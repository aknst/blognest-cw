package com.aknst.blognest.repository;

import com.aknst.blognest.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByBlogId(UUID blogId, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.tags t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :tag, '%'))")
    Page<Post> findByTags_NameIgnoreCaseContaining(@Param("tag") String tag, Pageable pageable);

    @Query("SELECT p FROM Post p ORDER BY p.createdAt DESC")
    Page<Post> findAllPostsSorted(Pageable pageable);
}
