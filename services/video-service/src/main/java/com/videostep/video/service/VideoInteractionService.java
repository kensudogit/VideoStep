package com.videostep.video.service;

import com.videostep.video.dto.CommentDto;
import com.videostep.video.dto.CreateCommentRequest;
import com.videostep.video.dto.VideoDto;
import com.videostep.video.entity.Video;
import com.videostep.video.entity.VideoComment;
import com.videostep.video.entity.VideoFavorite;
import com.videostep.video.entity.VideoLike;
import com.videostep.video.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 動画インタラクションサービス
 * いいね、コメント、お気に入り機能を提供
 */
@Service
public class VideoInteractionService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private VideoLikeRepository likeRepository;

    @Autowired
    private VideoCommentRepository commentRepository;

    @Autowired
    private VideoFavoriteRepository favoriteRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public boolean toggleLike(Long videoId, Long userId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        Optional<VideoLike> existingLike = likeRepository.findByVideoIdAndUserId(videoId, userId);

        if (existingLike.isPresent()) {
            // いいねを削除
            likeRepository.delete(existingLike.get());
            video.setLikeCount(Math.max(0, video.getLikeCount() - 1));
            videoRepository.save(video);
            return false; // いいね解除
        } else {
            // いいねを追加
            VideoLike like = new VideoLike();
            like.setVideoId(videoId);
            like.setUserId(userId);
            likeRepository.save(like);
            video.setLikeCount(video.getLikeCount() + 1);
            videoRepository.save(video);

            // 通知を作成
            try {
                notificationService.createLikeNotification(videoId, userId);
            } catch (Exception e) {
                // 通知作成失敗は無視（ログに記録することを推奨）
            }

            return true; // いいね追加
        }
    }

    public boolean isLiked(Long videoId, Long userId) {
        return likeRepository.existsByVideoIdAndUserId(videoId, userId);
    }

    @Transactional
    public CommentDto createComment(Long videoId, Long userId, CreateCommentRequest request) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        VideoComment comment = new VideoComment();
        comment.setVideoId(videoId);
        comment.setUserId(userId);
        comment.setContent(request.getContent());
        comment.setParentCommentId(request.getParentCommentId());

        VideoComment saved = commentRepository.save(comment);

        // 通知を作成
        try {
            if (request.getParentCommentId() != null) {
                // 返信の場合
                VideoComment parentComment = commentRepository.findById(request.getParentCommentId())
                        .orElse(null);
                if (parentComment != null) {
                    notificationService.createReplyNotification(
                            parentComment.getUserId(),
                            userId,
                            videoId,
                            request.getContent());
                }
            } else {
                // 通常のコメントの場合
                notificationService.createCommentNotification(videoId, userId, request.getContent());
            }
        } catch (Exception e) {
            // 通知作成失敗は無視（ログに記録することを推奨）
        }

        return VideoMapper.toDto(saved);
    }

    public List<CommentDto> getComments(Long videoId) {
        List<VideoComment> comments = commentRepository
                .findByVideoIdAndParentCommentIdIsNullOrderByCreatedAtDesc(videoId);
        return comments.stream()
                .map(comment -> {
                    CommentDto dto = VideoMapper.toDto(comment);
                    // 返信を取得
                    List<VideoComment> replies = commentRepository
                            .findByParentCommentIdOrderByCreatedAtAsc(comment.getId());
                    dto.setReplies(replies.stream().map(VideoMapper::toDto).collect(Collectors.toList()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        VideoComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }

        commentRepository.deleteById(commentId);
    }

    @Transactional
    public boolean toggleFavorite(Long videoId, Long userId) {
        Optional<VideoFavorite> existingFavorite = favoriteRepository.findByVideoIdAndUserId(videoId, userId);

        if (existingFavorite.isPresent()) {
            favoriteRepository.delete(existingFavorite.get());
            return false; // お気に入り解除
        } else {
            VideoFavorite favorite = new VideoFavorite();
            favorite.setVideoId(videoId);
            favorite.setUserId(userId);
            favoriteRepository.save(favorite);
            return true; // お気に入り追加
        }
    }

    public boolean isFavorited(Long videoId, Long userId) {
        return favoriteRepository.existsByVideoIdAndUserId(videoId, userId);
    }

    public List<VideoDto> getFavoriteVideos(Long userId) {
        List<VideoFavorite> favorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return favorites.stream()
                .map(fav -> {
                    Video video = videoRepository.findById(fav.getVideoId())
                            .orElse(null);
                    return video != null ? VideoMapper.toDto(video) : null;
                })
                .filter(v -> v != null)
                .collect(Collectors.toList());
    }

}
