package com.videostep.translation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 翻訳レスポンスDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TranslationResponse {
    private Long id;
    private String sourceText;
    private String translatedText;
    private String sourceLanguage;
    private String targetLanguage;
    private Long videoId;
    private Long slideId;
    private String translationType;
}
