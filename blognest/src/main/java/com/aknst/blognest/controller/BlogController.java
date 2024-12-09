package com.aknst.blognest.controller;

import com.aknst.blognest.dto.*;
import com.aknst.blognest.model.Blog;
import com.aknst.blognest.model.Post;
import com.aknst.blognest.model.User;
import com.aknst.blognest.security.CustomUserDetails;
import com.aknst.blognest.service.BlogService;
import com.aknst.blognest.service.UserService;
import com.aknst.blognest.service.impl.UserServiceImpl;
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

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.aknst.blognest.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;
    private final ModelMapper modelMapper;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<BlogsResponse> getAllBlogs(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "100") int size
    ) {
        Page<Blog> blogsPage = blogService.getAllBlogs(page, size);

        List<BlogDTO> blogDTOs = blogsPage.getContent().stream()
                .map(blog -> modelMapper.map(blog, BlogDTO.class))
                .toList();

        BlogsResponse blogsResponse = new BlogsResponse(
                blogDTOs,
                blogsPage.getNumber(),
                blogsPage.getSize(),
                blogsPage.getTotalElements(),
                blogsPage.getTotalPages(),
                blogsPage.isLast()
        );

        return ResponseEntity.ok(blogsResponse);
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<PostsResponse> getBlogPosts(
            @PathVariable UUID id,
            @RequestParam(value = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "100") int pageSize
    ) {
        Page<Post> postsPage = blogService.getPostsByBlogId(id, pageNo, pageSize);

        List<PostSummaryDTO> content = postsPage.getContent()
                .stream()
                .map(post -> modelMapper.map(post, PostSummaryDTO.class))
                .collect(Collectors.toList());

        PostsResponse response = new PostsResponse(
                content,
                postsPage.getNumber(),
                postsPage.getSize(),
                postsPage.getTotalElements(),
                postsPage.getTotalPages(),
                postsPage.isLast()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<BlogDTO> createBlogForUser(@PathVariable Long userId, @RequestBody BlogDTO blogDTO) {
        Blog blog = modelMapper.map(blogDTO, Blog.class);
        Blog createdBlog = blogService.createBlogForUser(userId, blog);
        BlogDTO createdBlogDTO = modelMapper.map(createdBlog, BlogDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBlogDTO);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping("/")
    @PreAuthorize("#currentUser != null and principal.username == #currentUser.username")
    public ResponseEntity<BlogDTO> getBlogForCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userService.validateAndGetUserByUsername(currentUser.getUsername());
        Blog blog = blogService.getBlogById(user.getBlog().getId());
        return ResponseEntity.ok(modelMapper.map(blog, BlogDTO.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogDTO> getBlogById(@PathVariable UUID id) {
        Blog blog = blogService.getBlogById(id);
        return ResponseEntity.ok(modelMapper.map(blog, BlogDTO.class));
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PreAuthorize("hasRole('ROLE_ADMIN') or @blogServiceImpl.isBlogOwner(#id, principal.username)")
    @PutMapping("/{id}")
    public ResponseEntity<BlogDTO> updateBlog(@PathVariable UUID id, @RequestBody UpdateBlogRequest updateBlogRequest) {
        Blog updatedBlog = blogService.updateBlog(id, updateBlogRequest);
        BlogDTO updatedBlogDTO = modelMapper.map(updatedBlog, BlogDTO.class);
        return ResponseEntity.ok(updatedBlogDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @PreAuthorize("hasRole('ROLE_ADMIN') or @blogServiceImpl.isBlogOwner(#id, principal.username)")
    public ResponseEntity<Void> deleteBlog(@PathVariable UUID id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }
}
