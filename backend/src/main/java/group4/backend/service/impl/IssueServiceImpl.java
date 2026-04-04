package group4.backend.service.impl;

import group4.backend.dto.IssueAddOrUpdateDto;
import group4.backend.entity.Issue;
import group4.backend.entity.IssuePicture;
import group4.backend.entity.User;
import group4.backend.enums.IssueStatusEnum;
import group4.backend.mapper.IssueMapper;
import group4.backend.mapper.IssuePictureMapper;
import group4.backend.mapper.UserMapper;
import group4.backend.service.EmailService;
import group4.backend.service.IssueService;
import group4.backend.util.PageResult;
import group4.backend.vo.IssueVo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IssueServiceImpl implements IssueService {

    @Autowired
    IssueMapper issueMapper;

    @Autowired
    IssuePictureMapper issuePictureMapper;

    @Autowired
    UserMapper userMapper;

    @Autowired
    EmailService emailService;

    @Transactional
    @Override
    public Long upsertIssue(Long id, IssueAddOrUpdateDto issueAddOrUpdateDto) {

        // convert to issue entity
        Issue issue = new Issue();
        BeanUtils.copyProperties(issueAddOrUpdateDto, issue);
        issue.setUserId(id);

        if (issue.getId() == null) { // add a new issue
            issue.setStatus(IssueStatusEnum.PENDING.getStatus());
            issue.setCreateTime(LocalDateTime.now());
            issue.setUpdateTime(LocalDateTime.now());
            issueMapper.insert(issue);
        } else { // update issue
            Issue issue1 = issueMapper.selectById(issue.getId());
            if (issue1 == null) {
                throw new RuntimeException("issue not found");
            }
            // only pending status issue can be updated
            if (!issue1.getStatus().equals(IssueStatusEnum.PENDING.getStatus())) {
                throw new RuntimeException("issue not in pending status");
            }
            issue.setUpdateTime(LocalDateTime.now());
            issueMapper.update(issue);

            // delete old picture
            issuePictureMapper.deleteByIssueId(issue.getId());
        }

        // get picture urls
        List<String> urls = issueAddOrUpdateDto.getUrls();
        if (urls != null && !urls.isEmpty()) {
            for (String url : urls) {

                // insert to issue picture table
                IssuePicture issuePicture = new IssuePicture();
                issuePicture.setIssueId(issue.getId());
                issuePicture.setUrl(url);
                issuePicture.setCreateTime(LocalDateTime.now());
                issuePicture.setUpdateTime(LocalDateTime.now());
                issuePictureMapper.insert(issuePicture);
            }
        }

        return issue.getId();

    }

    @Override
    public void deleteIssue(Long id, Long issueId) {

        // get issue by issueId
        Issue issue = issueMapper.selectById(issueId);

        // valid if issue can be deleted
        if (issue == null) {
            throw new RuntimeException("issue not found");
        }

        if (!issue.getUserId().equals(id)) {

            throw new RuntimeException("no permission");
        }

        if (!issue.getStatus().equals(IssueStatusEnum.PENDING.getStatus())) {
            throw new RuntimeException("issue not in pending status");
        }

        // delete issue
        issueMapper.delete(issueId);

    }

    @Override
    public List<IssueVo> getIssuesByUserId(Long id) {

        List<Issue> issues = issueMapper.selectByUserId(id);

        return convertToIssueVos(issues);
    }

    // admin get all issues
    @Override
    public List<IssueVo> getAllIssues() {

        // select all issues
        List<Issue> issues = issueMapper.selectAll();

        return convertToIssueVos(issues);
    }

    @Override
    public PageResult<IssueVo> pageIssuesForAdmin(String query, Integer page, Integer pageSize) {

        if (page == null || page < 1) {
            throw new RuntimeException("page error");
        }

        if (pageSize == null || pageSize < 1) {
            throw new RuntimeException("pageSize error");
        }

        // count total issue and total pages
        Long total = issueMapper.countByQuery(query);
        long totalPages = total == 0 ? 0 : (total + pageSize - 1L) / pageSize;

        List<IssueVo> records = List.of();
        if (total > 0) {
            int offset = (page - 1) * pageSize;
            List<Issue> issues = issueMapper.selectPageByQuery(query, offset, pageSize);
            records = convertToIssueVos(issues);
        }

        return new PageResult<>(page, pageSize, total, totalPages, records);
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

        String oldStatus = issue.getStatus();

        // update status
        issueMapper.updateStatus(issueId, status, LocalDateTime.now());

        // send email notification to the issue owner
        User user = userMapper.selectById(issue.getUserId());
        if (user != null && user.getEmail() != null) {
            emailService.sendIssueStatusChangeEmail(user.getEmail(), issue.getTitle(), oldStatus, status);
        }
    }

    private List<IssueVo> convertToIssueVos(List<Issue> issues) {
        return issues.stream().map(issue -> {
            List<IssuePicture> issuePictures = issuePictureMapper.selectByIssueId(issue.getId());
            List<String> urls = issuePictures.stream().map(IssuePicture::getUrl).toList();

            IssueVo issueVo = new IssueVo();
            BeanUtils.copyProperties(issue, issueVo);
            issueVo.setUrls(urls);
            return issueVo;
        }).collect(Collectors.toList());
    }

}
