package com.videostep.video.repository;

import com.videostep.video.entity.VideoSlide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 動画スライドリポジトリ
 */
@Repository
public interface VideoSlideRepository extends JpaRepository<VideoSlide, Long> {
    List<VideoSlide> findByVideoIdOrderBySequenceAsc(Long videoId);

    void deleteByVideoId(Long videoId);
}
