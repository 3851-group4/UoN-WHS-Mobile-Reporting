package group4.backend.aop;

import com.google.gson.Gson;
import group4.backend.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class AccessAspect {

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Autowired
    Gson gson;

    @Around("@annotation(authCheck)")
    public Object authCheck(ProceedingJoinPoint joinPoint, AuthCheck authCheck) throws Throwable {


        RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
        String token = request.getHeader("token");
        String role = authCheck.role();
        String userJson = stringRedisTemplate.opsForValue().get(token);
        if (userJson == null) {
            throw new RuntimeException("token not valid");
        }

        User user = gson.fromJson(userJson, User.class);
        if (!user.getRole().equals(role)) {
            throw new RuntimeException("no permission");
        }



        return joinPoint.proceed();
    }
}
