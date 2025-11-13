package com.videostep.video.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 視聴履歴エンティティ
 */
@Entity
@Table(name = "watch_history", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"video_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "video_id", nullable = false)
    private Long videoId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "watched_at")
    private LocalDateTime watchedAt;

    @Column(name = "watch_duration")
    private Long watchDuration = 0L; // 視聴時間（秒）

    @Column(name = "last_position")
    private Long lastPosition = 0L; // 最後に視聴した位置（秒）

    @PrePersist
    protected void onCreate() {
        watchedAt = LocalDateTime.now();
    }
}

