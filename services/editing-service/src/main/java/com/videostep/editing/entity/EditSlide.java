package com.videostep.editing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 編集スライドエンティティ
 */
@Entity
@Table(name = "edit_slides")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditSlide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(nullable = false)
    private Integer sequence;

    @Column(nullable = false)
    private String slideUrl;

    private String title;

    @Column(length = 1000)
    private String text;

    @Column(name = "start_time")
    private Long startTime; // milliseconds

    @Column(name = "end_time")
    private Long endTime; // milliseconds

    @Column(name = "transition_type")
    private String transitionType; // FADE, SLIDE, NONE

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
