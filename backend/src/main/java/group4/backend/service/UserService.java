package group4.backend.service;

import group4.backend.dto.UserLoginDto;
import group4.backend.dto.UserRegisterDto;

public interface UserService {
    void register(UserRegisterDto userRegisterDto);

    String login(UserLoginDto userLoginDto);
}
