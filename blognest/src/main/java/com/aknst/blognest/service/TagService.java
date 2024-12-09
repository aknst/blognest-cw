package com.aknst.blognest.service;

import com.aknst.blognest.model.Tag;

import java.util.Optional;

public interface TagService {
    Tag saveTag(Tag tag);
    Optional<Tag> findTagByName(String name);
}
