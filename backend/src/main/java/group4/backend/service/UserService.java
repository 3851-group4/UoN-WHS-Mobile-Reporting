package group4.backend.service;

import group4.backend.dto.UserInfoDto;
import group4.backend.dto.UserLoginDto;
import group4.backend.dto.UserRegisterDto;

import java.util.List;

public interface UserService {
    void register(UserRegisterDto userRegisterDto);

    String login(UserLoginDto userLoginDto);

    UserInfoDto getInfo(String token);

    List<UserInfoDto> getAllUsers();
}
