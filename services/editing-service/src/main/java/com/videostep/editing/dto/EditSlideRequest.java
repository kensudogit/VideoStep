package com.videostep.editing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 編集スライドリクエストDTO
 */
@Data
public class EditSlideRequest {
    @NotNull(message = "Sequence is required")
    private Integer sequence;

    @NotBlank(message = "Slide URL is required")
    private String slideUrl;

    private String title;
    private String text;
    private Long startTime;
    private Long endTime;
    private String transitionType;
}
