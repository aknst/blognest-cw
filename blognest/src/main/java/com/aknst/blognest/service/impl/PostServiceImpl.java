package com.aknst.blognest.service.impl;

import com.aknst.blognest.dto.UpdatePostRequest;
import com.aknst.blognest.exception.BlogAPIException;
import com.aknst.blognest.exception.ResourceNotFoundException;
import com.aknst.blognest.model.Blog;
import com.aknst.blognest.model.Post;
import com.aknst.blognest.model.Tag;
import com.aknst.blognest.model.User;
import com.aknst.blognest.repository.PostRepository;
import com.aknst.blognest.repository.TagRepository;
import com.aknst.blognest.service.PostService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;

    @Override
    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id.toString()));
    }

    @Override
    public Post updatePost(Long id, UpdatePostRequest updatePostRequest) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", id.toString()));

        existingPost.setTitle(updatePostRequest.getTitle());
        existingPost.setBrief(updatePostRequest.getBrief());
        existingPost.setContent(updatePostRequest.getContent());
        existingPost.setCoverFileId(updatePostRequest.getCoverFileId());

        Set<Tag> tags = updatePostRequest.getTags().stream()
                .map(tagDTO -> tagRepository.findByName(tagDTO.getText())
                        .orElseGet(() -> tagRepository.save(new Tag(null, tagDTO.getText()))))
                .collect(Collectors.toSet());
        existingPost.setTags(tags);

        return postRepository.save(existingPost);
    }

    @Override
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResourceNotFoundException("Post", "id", id.toString());
        }
        postRepository.deleteById(id);
    }

    @Override
    public Page<Post> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
        return postRepository.findAll(pageable);
    }

    @Override
    public Post createPostForUserBlog(User user, UpdatePostRequest postRequest) {
        Blog blog = user.getBlog();
        if (blog == null) {
            throw new BlogAPIException("User does not have a blog");
        }

        Set<Tag> tags = postRequest.getTags().stream()
                .map(tagDTO -> tagRepository.findByName(tagDTO.getText())
                        .orElseGet(() -> tagRepository.save(new Tag(null, tagDTO.getText()))))
                .collect(Collectors.toSet());

        Post post = new Post();
        post.setAuthor(user);
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setBrief(postRequest.getBrief());
        post.setCoverFileId(postRequest.getCoverFileId());
        post.setTags(tags);
        post.setBlog(blog);

        return postRepository.save(post);
    }

    @Override
    public Page<Post> getPostsByTag(String tag, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByTags_NameIgnoreCaseContaining(tag, pageable);
    }

    @Override
    public boolean isPostOwner(Long id, String username) {
        Post post = getPostById(id);
        return post.getAuthor().getUsername().equals(username);
    }
}