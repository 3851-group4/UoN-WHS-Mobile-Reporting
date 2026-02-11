package group4.backend.controller;


import group4.backend.aop.AuthCheck;
import group4.backend.dto.UserInfoDto;
import group4.backend.dto.UserLoginDto;
import group4.backend.dto.UserRegisterDto;
import group4.backend.service.UserService;
import group4.backend.util.R;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {


    @Autowired
    UserService userService;

    @Autowired
    StringRedisTemplate stringRedisTemplate;


    // register function
    @PostMapping("/register")
    public R register(@RequestBody UserRegisterDto userRegisterDto){



       userService.register(userRegisterDto);



      // if register fails it will throw exception on service layer
        return R.ok("success");


    }

    // login function
    @PostMapping("/login")
    public R login(@RequestBody UserLoginDto userLoginDto){



    String token  =  userService.login(userLoginDto);


        return R.ok(token);


    }

    // logout
    @GetMapping("/logout")
    public R logout(HttpServletRequest httpServletRequest){



        // get token from header
        String token = httpServletRequest.getHeader("token");

        // delete token
        stringRedisTemplate.delete(token);


        return R.ok();

    }


    // get user info
    @GetMapping("/get/user")
    public R getInfo(HttpServletRequest httpServletRequest){



        // get token from header
        String token = httpServletRequest.getHeader("token");

        // get user info from token
        UserInfoDto user = userService.getInfo(token);

        return R.ok(user);


    }





}
