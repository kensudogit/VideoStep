package com.videostep.translation.service;

import com.videostep.translation.dto.TranslationRequest;
import com.videostep.translation.dto.TranslationResponse;
import com.videostep.translation.entity.Translation;
import com.videostep.translation.repository.TranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 翻訳サービス
 * 24言語対応の自動翻訳機能を提供
 */
@Service
public class TranslationService {

    @Autowired
    private TranslationRepository translationRepository;

    // サポート言語リスト（24言語）
    private static final String[] SUPPORTED_LANGUAGES = {
            "ja", "en", "zh", "ko", "es", "fr", "de", "it", "pt", "ru",
            "ar", "hi", "th", "vi", "id", "ms", "nl", "pl", "tr", "sv",
            "da", "fi", "no", "cs"
    };

    @Transactional
    public TranslationResponse translate(TranslationRequest request) {
        // 既存の翻訳を確認
        if (request.getVideoId() != null && request.getSlideId() != null) {
            var existing = translationRepository.findByVideoIdAndSlideIdAndTargetLanguage(
                    request.getVideoId(), request.getSlideId(), request.getTargetLanguage());
            if (existing.isPresent()) {
                return convertToResponse(existing.get());
            }
        }

        // Google Cloud Translation APIを使用した翻訳（実装は簡略化）
        String translatedText = performTranslation(request.getSourceText(), 
                request.getSourceLanguage(), request.getTargetLanguage());

        Translation translation = new Translation();
        translation.setVideoId(request.getVideoId());
        translation.setSlideId(request.getSlideId());
        translation.setSourceLanguage(request.getSourceLanguage());
        translation.setTargetLanguage(request.getTargetLanguage());
        translation.setSourceText(request.getSourceText());
        translation.setTranslatedText(translatedText);
        translation.setTranslationType(request.getTranslationType());

        Translation saved = translationRepository.save(translation);
        return convertToResponse(saved);
    }

    public List<TranslationResponse> getTranslationsByVideo(Long videoId, String targetLanguage) {
        List<Translation> translations;
        if (targetLanguage != null) {
            translations = translationRepository.findByVideoIdAndTargetLanguage(videoId, targetLanguage);
        } else {
            translations = translationRepository.findByVideoId(videoId);
        }
        return translations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private String performTranslation(String text, String sourceLang, String targetLang) {
        // 実際の実装ではGoogle Cloud Translation APIを使用
        // ここでは簡略化のため、プレースホルダーを返す
        return "[Translated to " + targetLang + "] " + text;
    }

    public String[] getSupportedLanguages() {
        return SUPPORTED_LANGUAGES;
    }

    private TranslationResponse convertToResponse(Translation translation) {
        TranslationResponse response = new TranslationResponse();
        response.setId(translation.getId());
        response.setSourceText(translation.getSourceText());
        response.setTranslatedText(translation.getTranslatedText());
        response.setSourceLanguage(translation.getSourceLanguage());
        response.setTargetLanguage(translation.getTargetLanguage());
        response.setVideoId(translation.getVideoId());
        response.setSlideId(translation.getSlideId());
        response.setTranslationType(translation.getTranslationType());
        return response;
    }
}

