package com.videostep.editing.repository;

import com.videostep.editing.entity.EditSlide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 編集スライドリポジトリ
 */
@Repository
public interface EditSlideRepository extends JpaRepository<EditSlide, Long> {
    List<EditSlide> findByProjectIdOrderBySequenceAsc(Long projectId);

    void deleteByProjectId(Long projectId);
}
