package group4.backend.service.impl;

import group4.backend.dto.IssueAddOrUpdateDto;
import group4.backend.entity.Issue;
import group4.backend.entity.IssuePicture;
import group4.backend.enums.IssueStatusEnum;
import group4.backend.mapper.IssueMapper;
import group4.backend.mapper.IssuePictureMapper;
import group4.backend.service.IssueService;
import group4.backend.vo.IssueVo;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    IssueMapper issueMapper;

    @Autowired
    IssuePictureMapper issuePictureMapper;




    // add or update issue
    @Override
    public Long upsertIssue(Long id, IssueAddOrUpdateDto issueAddOrUpdateDto) {

        Issue issue = new Issue();
        BeanUtils.copyProperties(issueAddOrUpdateDto,issue);
        issue.setUserId(id);



        // add issue
        if(issue.getId()==null)
        {

            issue.setStatus(IssueStatusEnum.PENDING.getStatus());
            issue.setCreateTime(LocalDateTime.now());
            issue.setUpdateTime(LocalDateTime.now());

            issueMapper.insert(issue);
        }
        else {
            // update issue

            Issue issue1 =  issueMapper.selectById(issue.getId());
            if(issue1==null) {
                throw new RuntimeException("issue not found");
            }
            if(!issue1.getStatus().equals(IssueStatusEnum.PENDING.getStatus())){
                throw new RuntimeException("issue not in pending status");
            }
            issue.setUpdateTime(LocalDateTime.now());

            issueMapper.update(issue);
        }


        return issue.getId();


    }

    @Override
    public void deleteIssue(Long id, Long issueId) {


        // get issue by issueId
        Issue issue = issueMapper.selectById(issueId);

        // valid if issue can be deleted
        if(issue==null) {
            throw new RuntimeException("issue not found");
        }

        if(!issue.getUserId().equals(id)){

            throw new RuntimeException("no permission");
        }

        if(!issue.getStatus().equals(IssueStatusEnum.PENDING.getStatus())){
            throw new RuntimeException("issue not in pending status");
        }

        // delete issue
        issueMapper.delete(issueId);



    }

    @Override
    public List<IssueVo> getIssuesByUserId(Long id) {


        List<Issue>issues = issueMapper.selectByUserId(id);

        // get issue pictures by issue id

        List<IssueVo> issueVos = issues.stream().map((issue) -> {


            List<IssuePicture> issuePictures = issuePictureMapper.selectByIssueId(issue.getId());


            // get issue pictures url
            List<String> urls = issuePictures.stream().map(IssuePicture::getUrl).toList();


            IssueVo issueVo = new IssueVo();

            BeanUtils.copyProperties(issue, issueVo);

            issueVo.setUrls(urls);

            return issueVo;


        }).collect(Collectors.toList());




        return issueVos;
    }

    @Override
    public List<IssueVo> getAllIssues() {

        // select all issues
        List<Issue> issues = issueMapper.selectAll();

        // convert all issue to issueVo
        List<IssueVo> issueVos = issues.stream().map((issue) -> {
            List<IssuePicture> issuePictures = issuePictureMapper.selectByIssueId(issue.getId());
            List<String> urls = issuePictures.stream().map(IssuePicture::getUrl).toList();

            IssueVo issueVo = new IssueVo();
            BeanUtils.copyProperties(issue, issueVo);
            issueVo.setUrls(urls);
            return issueVo;
        }).collect(Collectors.toList());

        return issueVos;
    }

    @Override
    public void updateIssueStatus(Long issueId, String status) {
        // valid if issue exists
        Issue issue = issueMapper.selectById(issueId);
        if (issue == null) {
            throw new RuntimeException("issue not found");
        }

        // valid status
        try {
            IssueStatusEnum.fromStatus(status);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("invalid status");
        }

        // update status
        issueMapper.updateStatus(issueId, status, LocalDateTime.now());
    }
}
