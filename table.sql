create database whs_mobile_reporting;

use whs_mobile_reporting;


-- user table
create table if not exists user
(
    id             bigint auto_increment comment 'id' primary key,
    email   varchar(50)                           not null comment 'email',
    password  varchar(128)                           not null comment 'password',
    name      varchar(20)                           null comment 'user name',
    role      varchar(10) default 'user'            not null comment 'user/admin',
    create_time    datetime     default CURRENT_TIMESTAMP not null comment 'create time',
    update_time    datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment 'update time',
    UNIQUE KEY uk_user_account (email)
) comment 'user' collate = utf8mb4_unicode_ci;

-- issue table
create table if not exists issue
(
    id           bigint auto_increment comment 'id' primary key,
    user_id      bigint                                not null comment 'user id',
    title        varchar(100)                          not null comment 'issue title',
    description  text                                  not null comment 'issue description',
    location     varchar(512)                          not null comment 'issue location',
    status       varchar(20) default 'new'             not null comment 'status',
    happen_time  datetime     default CURRENT_TIMESTAMP not null comment 'issue happen time',
    create_time  datetime     default CURRENT_TIMESTAMP not null comment 'create time',
    update_time  datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment 'update time'
) comment 'issue' collate = utf8mb4_unicode_ci;

-- issue_picture table
create table if not exists issue_picture
(
    id           bigint auto_increment comment 'id' primary key,
    issue_id     bigint                              not null comment 'issue id',
    url    varchar(512)                        not null comment 'picture url',
    create_time  datetime default CURRENT_TIMESTAMP  not null comment 'create time',
    update_time  datetime default CURRENT_TIMESTAMP  not null on update CURRENT_TIMESTAMP comment 'update time'
) comment 'issue pictures table' collate = utf8mb4_unicode_ci;
