package group4.backend.controller;


import group4.backend.dto.UserLoginDto;
import group4.backend.dto.UserRegisterDto;
import group4.backend.service.UserService;
import group4.backend.util.R;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {


    @Autowired
    UserService userService;


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


}
