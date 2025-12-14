package com.nova.backend.preset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "preset_step")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PresetStepEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int stepId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preset_id")
    private PresetEntity preset;
    private int growthStep;
    private int periodDays;

    // 기준값은 JSON
    @Column(columnDefinition = "json")
    private String temp;

    @Column(columnDefinition = "json")
    private String humidity;

    @Column(columnDefinition = "json")
    private String soilMoisture;

    @Column(columnDefinition = "json")
    private String lightPower;

    @Column(columnDefinition = "json")
    private String co2;
}
