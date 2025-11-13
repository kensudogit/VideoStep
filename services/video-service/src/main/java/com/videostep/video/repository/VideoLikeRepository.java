package com.videostep.video.repository;

import com.videostep.video.entity.VideoLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 動画いいねリポジトリ
 */
@Repository
public interface VideoLikeRepository extends JpaRepository<VideoLike, Long> {
    Optional<VideoLike> findByVideoIdAndUserId(Long videoId, Long userId);

    boolean existsByVideoIdAndUserId(Long videoId, Long userId);

    long countByVideoId(Long videoId);
}
