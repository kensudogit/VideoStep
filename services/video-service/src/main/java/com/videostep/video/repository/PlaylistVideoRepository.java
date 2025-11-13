package com.videostep.video.repository;

import com.videostep.video.entity.PlaylistVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * プレイリスト動画リポジトリ
 */
@Repository
public interface PlaylistVideoRepository extends JpaRepository<PlaylistVideo, Long> {
    List<PlaylistVideo> findByPlaylistIdOrderByPositionAsc(Long playlistId);
    void deleteByPlaylistId(Long playlistId);
    boolean existsByPlaylistIdAndVideoId(Long playlistId, Long videoId);
}

