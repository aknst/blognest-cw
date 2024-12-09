package com.aknst.blognest.controller;

import com.aknst.blognest.dto.PostDTO;
import com.aknst.blognest.dto.PostSummaryDTO;
import com.aknst.blognest.dto.PostsResponse;
import com.aknst.blognest.dto.UpdatePostRequest;
import com.aknst.blognest.model.Post;
import com.aknst.blognest.model.User;
import com.aknst.blognest.security.CustomUserDetails;
import com.aknst.blognest.service.PostService;
import com.aknst.blognest.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static com.aknst.blognest.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final ModelMapper modelMapper;
    private final UserService userService;

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PostMapping
    public ResponseEntity<PostDTO> createPostForCurrentUser(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestBody UpdatePostRequest postRequest
    ) {
        User user = userService.validateAndGetUserByUsername(currentUser.getUsername());
        Post post = postService.createPostForUserBlog(user, postRequest);
        PostDTO postDTO = modelMapper.map(post, PostDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(postDTO);
    }

    @GetMapping
    public ResponseEntity<PostsResponse> getAllPosts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<Post> postsPage = postService.getAllPosts(page, size);

        List<PostSummaryDTO> postDTOs = postsPage.getContent().stream()
                .map(post -> modelMapper.map(post, PostSummaryDTO.class))
                .toList();

        PostsResponse postsResponse = new PostsResponse(
                postDTOs,
                postsPage.getNumber(),
                postsPage.getSize(),
                postsPage.getTotalElements(),
                postsPage.getTotalPages(),
                postsPage.isLast()
        );

        return ResponseEntity.ok(postsResponse);
    }

    @GetMapping("/by-tag")
    public ResponseEntity<PostsResponse> getPostsByTag(
            @RequestParam(value = "tag") String tag,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<Post> postsPage = postService.getPostsByTag(tag, page, size);

        List<PostSummaryDTO> postDTOs = postsPage.getContent().stream()
                .map(post -> modelMapper.map(post, PostSummaryDTO.class))
                .toList();

        PostsResponse postsResponse = new PostsResponse(
                postDTOs,
                postsPage.getNumber(),
                postsPage.getSize(),
                postsPage.getTotalElements(),
                postsPage.getTotalPages(),
                postsPage.isLast()
        );

        return ResponseEntity.ok(postsResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        PostDTO postDTO = modelMapper.map(post, PostDTO.class);
        return ResponseEntity.ok(postDTO);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @postServiceImpl.isPostOwner(#id, principal.username)")
    public ResponseEntity<PostDTO> updatePost(@PathVariable Long id, @RequestBody UpdatePostRequest updatePostRequest) {
        Post updatedPost = postService.updatePost(id, updatePostRequest);
        PostDTO updatedPostDTO = modelMapper.map(updatedPost, PostDTO.class);
        return ResponseEntity.ok(updatedPostDTO);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @postServiceImpl.isPostOwner(#id, principal.username)")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
