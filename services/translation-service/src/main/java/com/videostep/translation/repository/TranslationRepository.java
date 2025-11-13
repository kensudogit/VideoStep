package com.videostep.translation.repository;

import com.videostep.translation.entity.Translation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 翻訳リポジトリ
 */
@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {
    List<Translation> findByVideoIdAndTargetLanguage(Long videoId, String targetLanguage);

    Optional<Translation> findByVideoIdAndSlideIdAndTargetLanguage(Long videoId, Long slideId, String targetLanguage);

    List<Translation> findByVideoId(Long videoId);
}
