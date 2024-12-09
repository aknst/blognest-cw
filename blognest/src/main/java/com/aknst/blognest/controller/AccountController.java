package com.aknst.blognest.controller;

import com.aknst.blognest.dto.UpdateUserRequest;
import com.aknst.blognest.dto.UserDTO;
import com.aknst.blognest.model.User;
import com.aknst.blognest.security.CustomUserDetails;
import com.aknst.blognest.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static com.aknst.blognest.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/account")
public class AccountController {
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping("/me")
    @PreAuthorize("#currentUser != null and principal.username == #currentUser.username")
    public UserDTO getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userService.validateAndGetUserByUsername(currentUser.getUsername());
        return modelMapper.map(user, UserDTO.class);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PutMapping("/me")
    @PreAuthorize("#currentUser != null and principal.username == #currentUser.username")
    public ResponseEntity<UserDTO> updateCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser,
                                                     @RequestBody UpdateUserRequest updateUserRequest) {
        User updatedUser = userService.updateUserInfo(currentUser.getUsername(), updateUserRequest);
        UserDTO updatedUserDTO = modelMapper.map(updatedUser, UserDTO.class);
        return ResponseEntity.ok(updatedUserDTO);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @DeleteMapping("/me")
    @PreAuthorize("#currentUser != null and principal.username == #currentUser.username")
    public ResponseEntity<String> deleteCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userService.validateAndGetUserByUsername(currentUser.getUsername());
        userService.deleteUser(user);
        return ResponseEntity.ok("Account deleted successfully");
    }
}
