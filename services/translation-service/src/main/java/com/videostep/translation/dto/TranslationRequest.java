package com.videostep.translation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 翻訳リクエストDTO
 */
@Data
public class TranslationRequest {
    @NotBlank(message = "Source text is required")
    private String sourceText;

    @NotBlank(message = "Source language is required")
    private String sourceLanguage;

    @NotBlank(message = "Target language is required")
    private String targetLanguage;

    private Long videoId;
    private Long slideId;
    private String translationType;
}
