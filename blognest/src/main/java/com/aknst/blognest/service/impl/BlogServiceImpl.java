package com.aknst.blognest.service.impl;

import com.aknst.blognest.dto.PostSummaryDTO;
import com.aknst.blognest.dto.PostsResponse;
import com.aknst.blognest.dto.UpdateBlogRequest;
import com.aknst.blognest.exception.BlogAPIException;
import com.aknst.blognest.exception.ResourceNotFoundException;
import com.aknst.blognest.model.Blog;
import com.aknst.blognest.model.Post;
import com.aknst.blognest.model.User;
import com.aknst.blognest.repository.BlogRepository;
import com.aknst.blognest.repository.PostRepository;
import com.aknst.blognest.repository.UserRepository;
import com.aknst.blognest.service.BlogService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public Blog createBlogForUser(Long userId, Blog blog) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));
        if (user.getBlog() != null) {
            throw new BlogAPIException("User already has a blog");
        }
        blog.setUser(user);
        return blogRepository.save(blog);
    }

    @Override
    public Blog getBlogById(UUID id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id.toString()));
    }

    @Override
    @Transactional
    public Blog updateBlog(UUID id, UpdateBlogRequest updateBlogRequest) {
        Blog existingBlog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id.toString()));
        if (updateBlogRequest.getTitle() != null) {
            existingBlog.setTitle(updateBlogRequest.getTitle());
        }
        if (updateBlogRequest.getDescription() != null) {
            existingBlog.setDescription(updateBlogRequest.getDescription());
        }
        return blogRepository.save(existingBlog);
    }

    @Override
    public void deleteBlog(UUID id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id.toString()));
        blogRepository.delete(blog);
    }

    @Override
    public Page<Post> getPostsByBlogId(UUID blogId, int pageNo, int pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Order.desc("createdAt")));
        return postRepository.findByBlogId(blogId, pageRequest);
    }

    @Override
    public Page<Blog> getAllBlogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogRepository.findAll(pageable);
    }

    @Override
    public boolean isBlogOwner(UUID id, String username) {
        Blog blog = getBlogById(id);
        return blog.getUser().getUsername().equals(username);

    }
}