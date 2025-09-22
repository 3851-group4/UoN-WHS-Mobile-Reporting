package group4.backend.mapper;

import group4.backend.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Insert("insert into user(email,password,name,role,create_time,update_time) values(#{email},#{password},#{name},#{role},#{createTime},#{updateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(User user);


    @Select("select * from user where email = #{email}")
    User selectByEmail(String email);
}
