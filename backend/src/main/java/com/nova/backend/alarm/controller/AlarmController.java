package com.nova.backend.alarm.controller;

import com.nova.backend.alarm.dto.AlarmResponseDTO;
import com.nova.backend.alarm.service.AlarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/alarm")
@RequiredArgsConstructor
public class AlarmController {
    private final AlarmService alarmService;

    // 실시간 팝업 알람 (읽지 않은 알람)
    @GetMapping("/unread")
    public ResponseEntity<List<AlarmResponseDTO>> getUnreadAlarms(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                alarmService.getUnreadAlarms(farmId)
        );
    }

    // 대시보드 최근 알람 10개
    @GetMapping("/recent")
    public ResponseEntity<List<AlarmResponseDTO>> getRecentAlarms(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                alarmService.getRecentAlarms(farmId)
        );
    }

    // 오늘 알람
    @GetMapping("/today")
    public ResponseEntity<List<AlarmResponseDTO>> getTodayAlarms(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                alarmService.getTodayAlarms(farmId)
        );
    }

    // 전체 알람 (알람 탭)
    @GetMapping("/all")
    public ResponseEntity<List<AlarmResponseDTO>> getAllAlarms(
            @RequestParam Long farmId
    ) {
        return ResponseEntity.ok(
                alarmService.getAllAlarms(farmId)
        );
    }

    // 팜 알람 전체 읽음
    @PatchMapping("/read-all")
    public ResponseEntity<Void> readAllAlarms(
            @RequestParam Long farmId
    ) {
        alarmService.readAllAlarms(farmId);
        return ResponseEntity.ok().build();
    }
}
