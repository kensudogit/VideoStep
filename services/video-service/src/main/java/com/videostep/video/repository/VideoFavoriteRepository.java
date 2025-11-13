package com.videostep.video.repository;

import com.videostep.video.entity.VideoFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 動画お気に入りリポジトリ
 */
@Repository
public interface VideoFavoriteRepository extends JpaRepository<VideoFavorite, Long> {
    Optional<VideoFavorite> findByVideoIdAndUserId(Long videoId, Long userId);

    boolean existsByVideoIdAndUserId(Long videoId, Long userId);

    List<VideoFavorite> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByVideoId(Long videoId);
}
