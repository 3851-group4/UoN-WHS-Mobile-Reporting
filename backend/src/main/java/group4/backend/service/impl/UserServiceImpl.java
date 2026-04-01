package group4.backend.service.impl;


import com.google.gson.Gson;
import group4.backend.dto.UserInfoDto;
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
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

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

    @Override
    public UserInfoDto getInfo(String token) {

        if (token == null || token.isEmpty()) {
            throw new RuntimeException("token expired");
        }

        String userJson = stringRedisTemplate.opsForValue().get(token);
        if(userJson==null){
            throw new RuntimeException("token error");
        }

        User user = gson.fromJson(userJson, User.class);
        UserInfoDto userInfoDto = new UserInfoDto();
        BeanUtils.copyProperties(user,userInfoDto);


        return userInfoDto;
    }

    @Override
    public UserInfoDto updateInfo(String token, UserRegisterDto userRegisterDto) {

        if (token == null || token.isEmpty()) {
            throw new RuntimeException("token expired");
        }

        String userJson = stringRedisTemplate.opsForValue().get(token);
        if (userJson == null) {
            throw new RuntimeException("token error");
        }

        if (userRegisterDto == null) {
            throw new RuntimeException("required field error");
        }

        User currentUser = gson.fromJson(userJson, User.class);
        User user = userMapper.selectById(currentUser.getId());
        if (user == null) {
            throw new RuntimeException("user not found");
        }

        boolean updated = false;

        // update email
        String email = userRegisterDto.getEmail();
        if (email != null && !email.isBlank()) {
            email = email.trim();
            if (!email.equals(user.getEmail())) {
                User userByEmail = userMapper.selectByEmail(email);
                if (userByEmail != null && !userByEmail.getId().equals(user.getId())) {
                    throw new RuntimeException("email exists");
                }
                user.setEmail(email);
                updated = true;
            }
        }

        // update password
        String password = userRegisterDto.getPassword();
        if (password != null && !password.isBlank()) {
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
            user.setPassword(bCryptPasswordEncoder.encode(password));
            updated = true;
        }

        // update name
        String name = userRegisterDto.getName();
        if (name != null && !name.isBlank()) {
            name = name.trim();
            if (!name.equals(user.getName())) {
                user.setName(name);
                updated = true;
            }
        }

        if (!updated) {
            throw new RuntimeException("no fields to update");
        }

        user.setUpdateTime(LocalDateTime.now());
        userMapper.update(user);

        // update user cache
        String newJson = gson.toJson(user);
        Long expire = stringRedisTemplate.getExpire(token, TimeUnit.SECONDS);
        if (expire != null && expire > 0) {
            stringRedisTemplate.opsForValue().set(token, newJson, expire, TimeUnit.SECONDS);
        } else {
            stringRedisTemplate.opsForValue().set(token, newJson, 30, TimeUnit.DAYS);
        }

        UserInfoDto userInfoDto = new UserInfoDto();
        BeanUtils.copyProperties(user, userInfoDto);
        return userInfoDto;
    }

    // admin get all user
    @Override
    public List<UserInfoDto> getAllUsers() {
        // select all user
        List<User> users = userMapper.selectAll();

        // convert user to useInfoDto
        return users.stream().map(user -> {
            UserInfoDto dto = new UserInfoDto();
            BeanUtils.copyProperties(user, dto);
            return dto;
        }).collect(Collectors.toList());
    }
}
