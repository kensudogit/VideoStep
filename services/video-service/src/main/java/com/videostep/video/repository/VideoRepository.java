package com.videostep.video.repository;

import com.videostep.video.entity.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 動画リポジトリ
 */
@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Video> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Video> findByIsPublicTrueOrderByCreatedAtDesc();

    Page<Video> findByIsPublicTrueOrderByCreatedAtDesc(Pageable pageable);

    List<Video> findByCategoryOrderByCreatedAtDesc(String category);

    Page<Video> findByCategoryOrderByCreatedAtDesc(String category, Pageable pageable);

    List<Video> findByCategoryAndIsPublicTrueOrderByCreatedAtDesc(String category);

    Page<Video> findByCategoryAndIsPublicTrueOrderByCreatedAtDesc(String category, Pageable pageable);

    @Query("SELECT v FROM Video v WHERE v.title LIKE %:keyword% OR v.description LIKE %:keyword%")
    List<Video> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT v FROM Video v WHERE v.isPublic = true AND (v.title LIKE %:keyword% OR v.description LIKE %:keyword%)")
    Page<Video> searchPublicVideosByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
