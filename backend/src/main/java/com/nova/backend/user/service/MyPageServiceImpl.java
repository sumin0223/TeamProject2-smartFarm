package com.nova.backend.user.service;

import com.nova.backend.nova.dao.NovaDAO;
import com.nova.backend.nova.dto.NovaRequestDTO;
import com.nova.backend.nova.dto.NovaResponseDTO;
import com.nova.backend.nova.entity.NovaEntity;
import com.nova.backend.user.dao.UsersDAO;
import com.nova.backend.user.dto.MyPageRequestDTO;
import com.nova.backend.user.dto.MyPageResponseDTO;
import com.nova.backend.user.dto.UsersRequestDTO;
import com.nova.backend.user.dto.UsersResponseDTO;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService {
    private final UsersDAO usersDAO;
    private final NovaDAO novaDAO;
    private final ModelMapper modelMapper;

    @Override
    public MyPageResponseDTO findByUserId(Long userId) {
        // 1) 유저 조회 (없으면 예외)
        UsersEntity user = usersDAO.findByUserId(userId);
        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 유저입니다. userId=" + userId);
        }
        // 2) user → DTO
        UsersResponseDTO usersResponseDTO = modelMapper.map(user, UsersResponseDTO.class);

        List<NovaResponseDTO> novaResponseDTOList = novaDAO.getNovaEntity(user).stream()
                .map(nova -> modelMapper.map(nova, NovaResponseDTO.class))
                .collect(Collectors.toList());
        MyPageResponseDTO myPageResponseDTO = new MyPageResponseDTO(usersResponseDTO, novaResponseDTOList);
        return myPageResponseDTO;
    }

    @Override
    public void updateMyPage(MyPageRequestDTO myPageRequestDTO) {
        UsersRequestDTO usersRequestDTO = myPageRequestDTO.getUsersRequestDTO();
        UsersEntity usersEntity = usersDAO.findByUserId(usersRequestDTO.getUserId());
        if (usersEntity == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        modelMapper.map(usersRequestDTO, usersEntity);
        usersDAO.update(usersEntity);

        List<NovaRequestDTO> novaRequestDTOList = myPageRequestDTO.getNovaRequestDTOList();
        System.out.println("novaRequestDTOList 생성");
        List<NovaEntity> novaEntityUpdateList = novaRequestDTOList.stream()
                .filter(nova -> nova.getStatus().equals("update"))
                .peek(nova -> nova.setStatus("default"))
                .map(nova -> modelMapper.map(nova, NovaEntity.class))
                .collect(Collectors.toList());
        System.out.println("novaRequestDTOList: " + novaRequestDTOList);
        List<NovaEntity> novaEntityDeleteList = novaRequestDTOList.stream()
                .filter(nova -> nova.getStatus().equals("delete"))
                .map(nova -> modelMapper.map(nova, NovaEntity.class))
                .collect(Collectors.toList());
        System.out.println("novaRequestDTOList: " + novaRequestDTOList);
        List<NovaEntity> novaEntityCreateList = novaRequestDTOList.stream()
                .filter(nova -> nova.getStatus().equals("create"))
                .map(nova -> {
//                    NovaEntity entity = new NovaEntity(
//                            nova.getUserId(),
//                            nova.getNovaSerialNumber(),
//                            "default"
//                    );
//                    return entity;
                    //노바에 user fk설정으로 변경햇습니당
                    NovaEntity entity = new NovaEntity();
                    entity.setUser(usersEntity);   // (userId ❌, UsersEntity ⭕)
                    entity.setNovaSerialNumber(nova.getNovaSerialNumber());
                    entity.setStatus("default");
                    return entity;
                })
                .collect(Collectors.toList());
        System.out.println("novaEntityCreateList: " + novaEntityCreateList);
        novaDAO.update(novaEntityUpdateList);
        novaDAO.delete(novaEntityDeleteList);
        novaDAO.create(novaEntityCreateList);
    }
}
