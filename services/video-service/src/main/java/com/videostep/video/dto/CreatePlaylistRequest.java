package com.videostep.video.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * プレイリスト作成リクエストDTO
 */
@Data
public class CreatePlaylistRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String description;
    private Boolean isPublic = true;
}
