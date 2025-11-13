package com.videostep.video.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 通知エンティティ
 */
@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // 通知を受け取るユーザー

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type; // 通知タイプ

    @Column(name = "title", nullable = false)
    private String title; // 通知タイトル

    @Column(name = "message", length = 1000)
    private String message; // 通知メッセージ

    @Column(name = "related_video_id")
    private Long relatedVideoId; // 関連する動画ID

    @Column(name = "related_user_id")
    private Long relatedUserId; // 関連するユーザーID（いいねやコメントをしたユーザー）

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false; // 既読フラグ

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null) {
            isRead = false;
        }
    }

    public enum NotificationType {
        LIKE, // いいね
        COMMENT, // コメント
        REPLY, // 返信
        FOLLOW, // フォロー
        VIDEO_UPLOADED // 動画アップロード
    }
}
