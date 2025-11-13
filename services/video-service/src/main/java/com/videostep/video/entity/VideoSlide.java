package com.videostep.video.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 動画スライドエンティティ
 * スライド型動画編集機能で使用
 */
@Entity
@Table(name = "video_slides")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoSlide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "video_id", nullable = false)
    private Long videoId;

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    private String slideUrl;

    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "start_time")
    private Long startTime; // milliseconds

    @Column(name = "end_time")
    private Long endTime; // milliseconds

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
