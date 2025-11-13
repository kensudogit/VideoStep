package com.videostep.video.repository;

import com.videostep.video.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * プレイリストリポジトリ
 */
@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Playlist> findByUserIdAndIsPublicTrueOrderByCreatedAtDesc(Long userId);

    List<Playlist> findByIsPublicTrueOrderByCreatedAtDesc();
}
