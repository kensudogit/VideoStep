package com.videostep.video.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 動画作成リクエストDTO
 */
@Data
public class CreateVideoRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String category;
    private String tags;
    private Boolean isPublic = true;
}
