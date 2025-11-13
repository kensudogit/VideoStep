package com.videostep.video.dto;

import com.videostep.video.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 通知DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private Long userId;
    private Notification.NotificationType type;
    private String title;
    private String message;
    private Long relatedVideoId;
    private Long relatedUserId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
