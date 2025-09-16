create database whs_mobile_reporting;

use whs_mobile_reporting;


-- user table
create table if not exists user
(
    id             bigint auto_increment comment 'id' primary key,
    user_name   varchar(50)                           not null comment 'user name',
    password  varchar(128)                           not null comment 'password',
    name      varchar(20)                           null comment 'student name',
    role      varchar(10) default 'student'            not null comment 'student/admin',
    create_time    datetime     default CURRENT_TIMESTAMP not null comment 'create time',
    update_time    datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment 'update time',
    UNIQUE KEY uk_user_account (user_name),
    INDEX idx_user_name (user_name)
) comment 'user' collate = utf8mb4_unicode_ci;
