package com.aknst.blognest.controller;

import com.aknst.blognest.dto.UserDTO;
import com.aknst.blognest.exception.DuplicatedUserInfoException;
import com.aknst.blognest.model.Role;
import com.aknst.blognest.model.User;
import com.aknst.blognest.dto.AuthResponse;
import com.aknst.blognest.dto.LoginRequest;
import com.aknst.blognest.dto.SignUpRequest;
import com.aknst.blognest.security.TokenProvider;
import com.aknst.blognest.security.WebSecurityConfig;
import com.aknst.blognest.service.RoleService;
import com.aknst.blognest.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final RoleService roleService;
    private final ModelMapper modelMapper;

    @PostMapping("/authenticate")
    public AuthResponse login(@Valid @RequestBody LoginRequest loginRequest) {
        String token = authenticateAndGetToken(loginRequest.getUsername(), loginRequest.getPassword());
        User user = userService.validateAndGetUserByUsername(loginRequest.getUsername());
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        return new AuthResponse(token, userDTO);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/signup")
    public AuthResponse signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userService.hasUserWithUsername(signUpRequest.getUsername())) {
            throw new DuplicatedUserInfoException(String.format("Username %s already been used", signUpRequest.getUsername()));
        }
        if (userService.hasUserWithEmail(signUpRequest.getEmail())) {
            throw new DuplicatedUserInfoException(String.format("Email %s already been used", signUpRequest.getEmail()));
        }

        userService.saveUser(mapSignUpRequestToUser(signUpRequest));

        String token = authenticateAndGetToken(signUpRequest.getUsername(), signUpRequest.getPassword());

        User user = userService.validateAndGetUserByUsername(signUpRequest.getUsername());
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        return new AuthResponse(token, userDTO);
    }

    private String authenticateAndGetToken(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        return tokenProvider.generate(authentication);
    }

    private User mapSignUpRequestToUser(SignUpRequest signUpRequest) {
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());

        Set<Role> roles = new HashSet<>();
        Role userRole = roleService.findRoleByName("ROLE_USER").get();
        roles.add(userRole);
        user.setRoles(roles);
        return user;
    }
}
