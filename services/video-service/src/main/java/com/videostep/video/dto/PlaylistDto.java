package com.videostep.video.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * プレイリストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistDto {
    private Long id;
    private Long userId;
    private String userName;
    private String name;
    private String description;
    private Boolean isPublic;
    private Long videoCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<VideoDto> videos;
}
