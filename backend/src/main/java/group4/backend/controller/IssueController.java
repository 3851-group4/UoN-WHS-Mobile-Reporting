package group4.backend.controller;


import com.google.gson.Gson;
import group4.backend.dto.IssueAddOrUpdateDto;
import group4.backend.entity.Issue;
import group4.backend.entity.User;
import group4.backend.service.IssueService;
import group4.backend.util.R;
import group4.backend.vo.IssueVo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issue")
public class IssueController {


    @Autowired
    IssueService issueService;

    @Autowired
    StringRedisTemplate stringRedisTemplate;

    @Autowired
    Gson gson;

    // add or update issue
    @PostMapping("/upsert")
    public R addIssue(@RequestBody IssueAddOrUpdateDto issueAddOrUpdateDto, HttpServletRequest request){


        // get token from header
        String token = request.getHeader("token");

        // get user info from token
        String info = stringRedisTemplate.opsForValue().get(token);
        User user = gson.fromJson(info, User.class);

        // add or update issue
        Long id =  issueService.upsertIssue(user.getId(),issueAddOrUpdateDto);


        return R.ok(id);

    }

    // delete issue
    @DeleteMapping("/delete/{issueId}")
    public R deleteIssue(@PathVariable Long issueId, HttpServletRequest request){


        // get token from header
        String token = request.getHeader("token");

        // get user info from token
        String info = stringRedisTemplate.opsForValue().get(token);
        User user = gson.fromJson(info, User.class);


        // delete issue

        issueService.deleteIssue(user.getId(),issueId);


        return R.ok();


    }


    // query current user issue
    @GetMapping("/view")
    public R viewIssue(HttpServletRequest request) {


        // get token from header
        String token = request.getHeader("token");

        // get user info from token
        String info = stringRedisTemplate.opsForValue().get(token);
        User user = gson.fromJson(info, User.class);


        List<IssueVo> issueVoList =  issueService.getIssuesByUserId(user.getId());


        return R.ok(issueVoList);

    }


}
