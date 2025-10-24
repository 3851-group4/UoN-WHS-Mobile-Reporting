package group4.backend.service.impl;


import com.google.gson.Gson;
import group4.backend.dto.UserLoginDto;
import group4.backend.dto.UserRegisterDto;
import group4.backend.entity.User;
import group4.backend.mapper.UserMapper;
import group4.backend.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserMapper userMapper;

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Autowired
    Gson gson;


    @Override
    public void register(UserRegisterDto userRegisterDto) {

        // valid required fields
        if(userRegisterDto.getEmail() == null || userRegisterDto.getPassword() == null || userRegisterDto.getName() == null || userRegisterDto.getRole() == null)
        {
            throw new RuntimeException("required field error");
        }

        // verify whether email exists
        String email = userRegisterDto.getEmail();
        User userByEmail = userMapper.selectByEmail(email);
        if(userByEmail != null)
        {
            throw new RuntimeException("email exists");
        }

        // store to database
        User user = new User();
        BeanUtils.copyProperties(userRegisterDto,user);
        // encrypt password
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        String password = bCryptPasswordEncoder.encode(userRegisterDto.getPassword());
        user.setPassword(password);
        user.setRole("user");
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());

        userMapper.insert(user);
 

    }

    @Override
    public String login(UserLoginDto userLoginDto) {


        // valid required fields
        if(userLoginDto.getEmail() == null || userLoginDto.getPassword() == null)
        {
            throw new RuntimeException("required field error");
        }

        // valid email and password

        User user = userMapper.selectByEmail(userLoginDto.getEmail());
        if(user == null)
        {
            throw new RuntimeException("email or password error");
        }

        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        boolean matches = bCryptPasswordEncoder.matches(userLoginDto.getPassword(), user.getPassword());
        if(!matches)
        {
            throw new RuntimeException("email or password error");
        }

        // generate token and store to redis
        String json = gson.toJson(user);

        String token = UUID.randomUUID().toString();


        stringRedisTemplate.opsForValue().set(token,json, 30, TimeUnit.DAYS);

        return token;



    }
}
