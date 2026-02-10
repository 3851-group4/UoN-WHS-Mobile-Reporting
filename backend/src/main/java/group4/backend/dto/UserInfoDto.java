package group4.backend.dto;

import lombok.Data;

@Data
public class UserInfoDto {

    private Long id;
    private String email;
    private String name;
    private String role;

}
