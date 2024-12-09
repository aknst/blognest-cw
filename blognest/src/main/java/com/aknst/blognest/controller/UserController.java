package com.aknst.blognest.controller;

import com.aknst.blognest.dto.UserDTO;
import com.aknst.blognest.dto.UserSummaryDTO;
import com.aknst.blognest.service.UserService;
import com.aknst.blognest.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static com.aknst.blognest.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping
    @Secured({"ROLE_ADMIN"})
    public List<UserDTO> getUsers() {
        return userService.getUsers().stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    @GetMapping("/{username}")
    public UserSummaryDTO getUser(@PathVariable String username) {
        User user = userService.validateAndGetUserByUsername(username);
        return modelMapper.map(user, UserSummaryDTO.class);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @DeleteMapping("/{username}")
    @Secured({"ROLE_ADMIN"})
    public UserDTO deleteUser(@PathVariable String username) {
        User user = userService.validateAndGetUserByUsername(username);
        userService.deleteUser(user);
        return modelMapper.map(user, UserDTO.class);
    }
}
