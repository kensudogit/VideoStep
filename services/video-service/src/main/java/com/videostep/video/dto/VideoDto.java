package com.videostep.video.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 動画DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoDto {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private Long duration;
    private Long fileSize;
    private String status;
    private String category;
    private String tags;
    private Long viewCount;
    private Long likeCount;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
