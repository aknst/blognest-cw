package com.aknst.blognest.service;

import com.aknst.blognest.dto.UpdateBlogRequest;
import com.aknst.blognest.model.Blog;
import com.aknst.blognest.model.Post;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface BlogService {

    Blog createBlogForUser(Long userId, Blog blog);

    Blog getBlogById(UUID id);

    Blog updateBlog(UUID id, UpdateBlogRequest updateBlogRequest);

    void deleteBlog(UUID id);

    Page<Post> getPostsByBlogId(UUID id, int pageNo, int pageSize);

    Page<Blog> getAllBlogs(int page, int size);

    boolean isBlogOwner(UUID id, String username);
}