package com.videostep.editing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 編集プロジェクト作成リクエストDTO
 */
@Data
public class CreateEditProjectRequest {
    @NotNull(message = "Video ID is required")
    private Long videoId;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;
}
