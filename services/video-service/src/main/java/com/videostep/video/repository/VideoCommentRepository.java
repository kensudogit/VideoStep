package com.videostep.video.repository;

import com.videostep.video.entity.VideoComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 動画コメントリポジトリ
 */
@Repository
public interface VideoCommentRepository extends JpaRepository<VideoComment, Long> {
    List<VideoComment> findByVideoIdOrderByCreatedAtDesc(Long videoId);

    List<VideoComment> findByVideoIdAndParentCommentIdIsNullOrderByCreatedAtDesc(Long videoId);

    List<VideoComment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);

    long countByVideoId(Long videoId);
}
