package group4.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

// Intercept all requests except login and register
@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Autowired
    StringRedisTemplate stringRedisTemplate;

   @Override
   public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

       // get token from header
       String token = request.getHeader("token");
       if(token == null || token.isEmpty()){
           throw new RuntimeException("token not valid");
       }

       String userJson = stringRedisTemplate.opsForValue().get(token);
       if(userJson == null){
           throw new RuntimeException("token not valid");
       }


       return true;
   }

}
