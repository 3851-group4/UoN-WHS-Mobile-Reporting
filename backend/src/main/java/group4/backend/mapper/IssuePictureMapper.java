package group4.backend.mapper;

import group4.backend.entity.IssuePicture;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface IssuePictureMapper {

    @Select("select * from issue_picture where issue_id=#{id}")
    List<IssuePicture> selectByIssueId(Long id);

    @Insert("insert into issue_picture(issue_id, url, create_time, update_time) values(#{issueId}, #{url}, #{createTime}, #{updateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(IssuePicture issuePicture);

    @Delete("delete from issue_picture where issue_id=#{issueId}")
    void deleteByIssueId(Long issueId);
}
