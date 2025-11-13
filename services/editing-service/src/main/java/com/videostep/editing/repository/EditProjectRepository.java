package com.videostep.editing.repository;

import com.videostep.editing.entity.EditProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 編集プロジェクトリポジトリ
 */
@Repository
public interface EditProjectRepository extends JpaRepository<EditProject, Long> {
    List<EditProject> findByUserIdOrderByUpdatedAtDesc(Long userId);

    List<EditProject> findByVideoId(Long videoId);
}
