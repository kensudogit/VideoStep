package com.videostep.video.repository;

import com.videostep.video.entity.WatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 視聴履歴リポジトリ
 */
@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {
    Optional<WatchHistory> findByVideoIdAndUserId(Long videoId, Long userId);
    List<WatchHistory> findByUserIdOrderByWatchedAtDesc(Long userId);
    List<WatchHistory> findByVideoIdOrderByWatchedAtDesc(Long videoId);
}

