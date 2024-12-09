package com.aknst.blognest.config;

import com.aknst.blognest.dto.*;
import com.aknst.blognest.model.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        modelMapper.createTypeMap(User.class, UserDTO.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getBlog().getId(), UserDTO::setBlogId);
                    mapper.map(User::getRoles, UserDTO::setRoles);
                });

        modelMapper.createTypeMap(User.class, UserSummaryDTO.class)
                .addMappings(mapper -> {
                    mapper.map(src -> src.getBlog().getId(), UserSummaryDTO::setBlogId);
                });


        modelMapper.createTypeMap(Role.class, RoleDTO.class)
                .addMappings(mapper -> {
                    mapper.map(Role::getName, RoleDTO::setName);
                });


        modelMapper.createTypeMap(Blog.class, BlogDTO.class)
                .addMappings(mapper -> {
                    mapper.map(Blog::getTitle, BlogDTO::setTitle);
                    mapper.map(Blog::getDescription, BlogDTO::setDescription);
                    mapper.map(Blog::getUser, BlogDTO::setAuthor);
                });

        modelMapper.createTypeMap(Post.class, PostSummaryDTO.class)
                .addMappings(mapper -> {
                    mapper.map(Post::getTitle, PostSummaryDTO::setTitle);
                    mapper.map(Post::getBrief, PostSummaryDTO::setBrief);
                    mapper.map(Post::getCoverFileId, PostSummaryDTO::setCoverFileId);
                    mapper.map(Post::getCreatedAt, PostSummaryDTO::setCreatedAt);
                    mapper.map(Post::getAuthor, PostSummaryDTO::setAuthor);
                    mapper.map(Post::getTags, PostSummaryDTO::setTags);
                });

        modelMapper.createTypeMap(Tag.class, TagDTO.class)
                .addMappings(mapper -> {
                    mapper.map(Tag::getName, TagDTO::setText);
                });

        modelMapper.createTypeMap(UpdatePostRequest.class, Post.class)
                .addMappings(mapper -> mapper.skip(Post::setId));



        return modelMapper;
    }
}
