package com.videostep.video.service;

import com.videostep.video.dto.NotificationDto;
import com.videostep.video.entity.Notification;
import com.videostep.video.entity.Video;
import com.videostep.video.repository.NotificationRepository;
import com.videostep.video.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 通知サービス
 */
@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private VideoRepository videoRepository;

    /**
     * いいね通知を作成
     */
    @Transactional
    public void createLikeNotification(Long videoId, Long likedByUserId) {
        Video video = videoRepository.findById(videoId).orElse(null);
        if (video == null || video.getUserId().equals(likedByUserId)) {
            return; // 自分の動画へのいいねは通知しない
        }

        Notification notification = new Notification();
        notification.setUserId(video.getUserId()); // 動画の所有者に通知
        notification.setType(Notification.NotificationType.LIKE);
        notification.setTitle("新しいいいね");
        notification.setMessage("あなたの動画「" + video.getTitle() + "」にいいねがつきました");
        notification.setRelatedVideoId(videoId);
        notification.setRelatedUserId(likedByUserId);
        notification.setIsRead(false);

        notificationRepository.save(notification);
    }

    /**
     * コメント通知を作成
     */
    @Transactional
    public void createCommentNotification(Long videoId, Long commentedByUserId, String commentContent) {
        Video video = videoRepository.findById(videoId).orElse(null);
        if (video == null || video.getUserId().equals(commentedByUserId)) {
            return; // 自分の動画へのコメントは通知しない
        }

        Notification notification = new Notification();
        notification.setUserId(video.getUserId()); // 動画の所有者に通知
        notification.setType(Notification.NotificationType.COMMENT);
        notification.setTitle("新しいコメント");
        String preview = commentContent.length() > 50
                ? commentContent.substring(0, 50) + "..."
                : commentContent;
        notification.setMessage("あなたの動画「" + video.getTitle() + "」にコメントがつきました: " + preview);
        notification.setRelatedVideoId(videoId);
        notification.setRelatedUserId(commentedByUserId);
        notification.setIsRead(false);

        notificationRepository.save(notification);
    }

    /**
     * 返信通知を作成
     */
    @Transactional
    public void createReplyNotification(Long parentCommentUserId, Long repliedByUserId, Long videoId,
            String replyContent) {
        if (parentCommentUserId.equals(repliedByUserId)) {
            return; // 自分のコメントへの返信は通知しない
        }

        Video video = videoRepository.findById(videoId).orElse(null);
        String videoTitle = video != null ? video.getTitle() : "動画";

        Notification notification = new Notification();
        notification.setUserId(parentCommentUserId); // 親コメントの所有者に通知
        notification.setType(Notification.NotificationType.REPLY);
        notification.setTitle("新しい返信");
        String preview = replyContent.length() > 50
                ? replyContent.substring(0, 50) + "..."
                : replyContent;
        notification.setMessage("「" + videoTitle + "」へのあなたのコメントに返信がつきました: " + preview);
        notification.setRelatedVideoId(videoId);
        notification.setRelatedUserId(repliedByUserId);
        notification.setIsRead(false);

        notificationRepository.save(notification);
    }

    /**
     * ユーザーの通知一覧を取得
     */
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 未読通知一覧を取得
     */
    public List<NotificationDto> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * 未読通知数を取得
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /**
     * 通知を既読にする
     */
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to mark this notification as read");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    /**
     * すべての通知を既読にする
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }

    /**
     * 通知を削除
     */
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUserId());
        dto.setType(notification.getType());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setRelatedVideoId(notification.getRelatedVideoId());
        dto.setRelatedUserId(notification.getRelatedUserId());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
