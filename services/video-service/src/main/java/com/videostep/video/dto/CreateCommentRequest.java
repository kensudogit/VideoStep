package com.videostep.video.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * コメント作成リクエストDTO
 */
@Data
public class CreateCommentRequest {
    @NotBlank(message = "Content is required")
    private String content;

    private Long parentCommentId; // 返信の場合
}
