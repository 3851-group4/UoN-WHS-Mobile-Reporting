package group4.backend.mapper;

import group4.backend.entity.IssuePicture;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface IssuePictureMapper {

    @Select("select * from issue_picture where issue_id=#{id}")
    List<IssuePicture> selectByIssueId(Long id);
}
