package com.aknst.blognest.service;

import com.aknst.blognest.dto.UpdatePostRequest;
import com.aknst.blognest.model.Post;
import com.aknst.blognest.model.User;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface PostService {
    Post savePost(Post post);
    Post getPostById(Long id);
    Post updatePost(Long id, UpdatePostRequest updatePostRequest);
    void deletePost(Long id);

    Page<Post> getAllPosts(int page, int size);

    Post createPostForUserBlog(User user, UpdatePostRequest postRequest);

    Page<Post> getPostsByTag(String tag, int page, int size);

    boolean isPostOwner(Long id, String username);
}