package com.videostep.video.service;

import com.videostep.video.dto.CommentDto;
import com.videostep.video.dto.VideoDto;
import com.videostep.video.entity.Video;
import com.videostep.video.entity.VideoComment;

/**
 * 動画マッパー
 * エンティティとDTOの変換を行う
 */
public class VideoMapper {

    public static VideoDto toDto(Video video) {
        if (video == null) {
            return null;
        }
        VideoDto dto = new VideoDto();
        dto.setId(video.getId());
        dto.setUserId(video.getUserId());
        dto.setTitle(video.getTitle());
        dto.setDescription(video.getDescription());
        dto.setVideoUrl(video.getVideoUrl());
        dto.setThumbnailUrl(video.getThumbnailUrl());
        dto.setDuration(video.getDuration());
        dto.setFileSize(video.getFileSize());
        dto.setStatus(video.getStatus());
        dto.setCategory(video.getCategory());
        dto.setTags(video.getTags());
        dto.setViewCount(video.getViewCount());
        dto.setLikeCount(video.getLikeCount());
        dto.setIsPublic(video.getIsPublic());
        dto.setCreatedAt(video.getCreatedAt());
        dto.setUpdatedAt(video.getUpdatedAt());
        return dto;
    }

    public static CommentDto toDto(VideoComment comment) {
        if (comment == null) {
            return null;
        }
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setVideoId(comment.getVideoId());
        dto.setUserId(comment.getUserId());
        dto.setContent(comment.getContent());
        dto.setParentCommentId(comment.getParentCommentId());
        dto.setLikeCount(comment.getLikeCount());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        // userNameはユーザーサービスから取得する必要がある（簡略化のためnull）
        dto.setUserName(null);
        return dto;
    }
}
