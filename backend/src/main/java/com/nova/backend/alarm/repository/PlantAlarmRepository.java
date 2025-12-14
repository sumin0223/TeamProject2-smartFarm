package com.nova.backend.alarm.repository;

import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.alarm.entity.PlantAlarmEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

// 알람 조회 (최근 값)
@Repository
public interface PlantAlarmRepository extends JpaRepository<PlantAlarmEntity,Long> {
    // 최근 알람 10개 정도 찍을예정~~~~
    List<PlantAlarmEntity> findTop10ByFarmOrderByCreatedAtDesc(FarmEntity farm);

    // 오늘 알람 (날짜 기준)
    List<PlantAlarmEntity> findByFarmAndCreatedAtBetweenOrderByCreatedAtDesc(
            FarmEntity farm,
            //서비스에서 오늘 00:00 ~ 23:59 계산해서
            LocalDateTime start,
            LocalDateTime end
    );

    // 읽지 않은 알람 (실시간 팝업용)
    List<PlantAlarmEntity> findByFarmAndIsReadFalseOrderByCreatedAtDesc(
            FarmEntity farm
    );

    // 전체 알람 (알람 탭)
    List<PlantAlarmEntity> findByFarmOrderByCreatedAtDesc(
            FarmEntity farm
    );
}
