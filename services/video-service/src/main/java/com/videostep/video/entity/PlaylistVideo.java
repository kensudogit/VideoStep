package com.videostep.video.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * プレイリスト動画エンティティ
 */
@Entity
@Table(name = "playlist_videos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"playlist_id", "video_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "playlist_id", nullable = false)
    private Long playlistId;

    @Column(name = "video_id", nullable = false)
    private Long videoId;

    @Column(name = "position")
    private Integer position; // プレイリスト内の順序

    @Column(name = "added_at")
    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }
}

