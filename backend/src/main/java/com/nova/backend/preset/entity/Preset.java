package com.nova.backend.preset.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "preset")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Preset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int presetId;
    @Column(nullable = false)
    private String plantType;
    @Column(nullable = false)
    private String presetName;

    @Column(name = "user_id", nullable = false)
    private Long userId; //ManyToOne

}
