# SpringBoot 秒杀项目

## 初始化项目

**使用的技术**：SpringBoot + Mysql + Redis + RabbitMQ +MyBatis-Plus + Maven + Linux + Jmeter

使用 spring initializr 创建一个项目，依赖可以不选，自己配置自己想要的依赖



```xml
<!-- web starter包 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!-- thymeleaf starter包 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<!-- mysql 包 -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
<!-- lombok 包 -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<!-- mybatis-plus 用于 springboot3 的 starter 包 -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.5</version>
</dependency>
```

```yml
server:
  port: 8090

spring:
  thymeleaf:
    cache: false # 关闭缓存
  # 连接数据库
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/seckill?useUnicode=true&characterEncoding=utf-8&useSSL=true
    username: root
    password: 123456
# mybatis-plus 配置
mybatis-plus:
  # 配置 mapper.xml 映射文件
  mapper-locations: classpath*:/mapper/*Mapper.xml
  # 配置 mybatis 数据返回类型别名
  type-aliases-package: com.fan.pojo

# mybatis sql 打印
logging:
  level:
    com.fan.mapper: debug
```

## 用户登录功能

### 数据库创建

创建数据库 `seckill`

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1715395096203-01c1112b-12c5-4af4-bd12-158986170281.png)

创建用户表 `seckill_user`

```sql
DROP TABLE IF EXISTS `seckill_user`;
CREATE TABLE `seckill_user`(
  `id` BIGINT(20) NOT NULL COMMENT '用户 ID, 设为主键, 唯一 手机号',
  `nickname` VARCHAR(255) NOT NULL DEFAULT '',
  `password` VARCHAR(32) NOT NULL DEFAULT '' COMMENT 'MD5(MD5(pass 明文+固定salt)+salt)',
  `slat` VARCHAR(10) NOT NULL DEFAULT '',
  `head` VARCHAR(128) NOT NULL DEFAULT '' COMMENT '头像',
  `register_date` DATETIME DEFAULT NULL COMMENT '注册时间',
  `last_login_date` DATETIME DEFAULT NULL COMMENT '最后一次登录时间',
  `login_count` INT(11) DEFAULT '0' COMMENT '登录次数',
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4;
```

### 密码的设计

**传统方式**：

客户端使用 password 明文

后端通过 md5(password 明文) 比对 db 中存放的 password 是否一致

**改进1**：

客户端使用 md5(password 明文)

后端通过 md5(md5(password 明文)) 比对 db 中存放的 password 是否一致

**改进2**：

客户端使用 md5(password 明文 + salt1)

后端通过 md5(md5(password 明文 + salt1) + salt2) 比对 db 中存放的 password 是否一致

### 代码开发

#### 密码 md5 加密

引入 md5 依赖

```xml
<!-- md5 依赖-->
<dependency>
    <groupId>commons-codec</groupId>
    <artifactId>commons-codec</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
</dependency>
```

编写一个 md5 加密工具类

```java
package com.fan.util;

import org.apache.commons.codec.digest.DigestUtils;

public class MD5Util {
    // 盐，这个盐是随机生成的，后面从数据库中取，每个用户的盐可能不一样
    private static final String SALT = "zMDgZ44T";
    // md5 加密
    public static String md5(String src) {
        return DigestUtils.md5Hex(src);
    }

    // 加盐加密，完成的是 md5(password + salt)
    public static String inputPassToMidPass(String inputPass) {
        String str = SALT.charAt(0) + inputPass + SALT.charAt(5);
        return md5(str);
    }

    // 加密加盐，完成的是 md5(md5(password + salt1) + salt2)
    public static String midPassToDbPass(String midPass, String slat) {
        String str = slat.charAt(2) + midPass + slat.charAt(3);
        return md5(str);
    }

    // 进行两次加密加盐，最后得到存到数据库的 md5
    public static String inputPassToDbPass(String inputPass, String slat) {
        String midPass = inputPassToMidPass(inputPass);
        return midPassToDbPass(midPass, slat);
    }
}
```

对工具类进行测试

```java
@Test
public void MD5UtilTest() {
    String s1 = MD5Util.inputPassToMidPass("123456");
    String s2 = MD5Util.midPassToDbPass(s1, "zMDgZ44T");
    String s3 = MD5Util.inputPassToDbPass("123456", "zMDgZ44T");
    System.out.println(s1); // 16dc84c0bbcae298841c1c3f62e67f2b
    System.out.println(s2); // f755d9888121566510a7bacb02e5f360
    System.out.println(s3); // f755d9888121566510a7bacb02e5f360
}
```

#### 手机号格式验证工具类

创建一个验证工具类

```java
package com.fan.util;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidatorUtil {

    private static final Pattern mobile_pattern = Pattern.compile("[1]([3-9])[0-9]{9}$");

    /**
     * 判断手机号是否正确
     * @param mobile
     * @return
     */
    public static boolean isMobile(String mobile) {
        if (!StringUtils.isNotBlank(mobile)) {
            return false;
        }
        Matcher matcher = mobile_pattern.matcher(mobile);
        return matcher.matches(); // 返回校验结果 true 为正确
    }
}
```

创建自定义校验器

```java
package com.fan.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {IsMobileValidator.class})
public @interface IsMobile {
    String message() default "手机号码格式错误";
    boolean required() default true;
    Class<?>[] groups() default { };//默认参数
    Class<? extends Payload>[] payload() default { };//默认参数
}
```

```java
package com.fan.validator;

import com.fan.util.ValidatorUtil;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

public class IsMobileValidator implements ConstraintValidator<IsMobile, String> {
    private boolean required = false;

    @Override
    public void initialize(IsMobile constraintAnnotation) {
        // 初始化
        required = constraintAnnotation.required();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // 必填
        if (required) {
            return ValidatorUtil.isMobile(value);
        } else {
            // 非必填
            if (!StringUtils.hasText(value)) {
                return true;
            } else {
                return ValidatorUtil.isMobile(value);
            }
        }
    }
}
```

在 LoginVo 中使用校验注解

```java
package com.fan.vo;

import com.fan.validator.IsMobile;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class LoginVo {

    // 手机号
    @NotNull
    @IsMobile
    private String mobile;
    @NotNull
    @Length(min = 32)
    // 密码
    private String password;
}
```

#### 全局异常处理器

```java
package com.fan.exception;

import com.fan.vo.RespBeanEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalException extends RuntimeException {
    private RespBeanEnum respBeanEnum;
}
package com.fan.exception;

import com.fan.vo.RespBean;
import com.fan.vo.RespBeanEnum;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


/**
 * 全局异常处理器
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    //处理所有的异常
    @ExceptionHandler(Exception.class)
    public RespBean ExceptionHandler(Exception e) {
        // 如果是全局异常，正常处理
        if (e instanceof GlobalException) {
            GlobalException ex = (GlobalException) e;
            return RespBean.error(ex.getRespBeanEnum());
        } else if (e instanceof BindException) {
            // 如果是绑定异常 ：由于我们自定义的注解只会在控制台打印错误信息，想让该信息传给前端。
            // 需要获取改异常 BindException，进行打印
            BindException ex = (BindException) e;
            RespBean respBean = RespBean.error(RespBeanEnum.BING_ERROR);
            respBean.setMessage(" 参数校验异常 ~ ： " +
                    ex.getBindingResult().getAllErrors().get(0).getDefaultMessage());
            return respBean;
        }
        return RespBean.error(RespBeanEnum.ERROR);
    }
}
```

使用

```java
import com.fan.exception.GlobalException;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Resource
    private UserMapper userMapper;

    // 用户登录
    @Override
    public RespBean doLogin(LoginVo loginVo, HttpServletRequest request, HttpServletResponse response) {

        // 用户输入
        String mobile = loginVo.getMobile();
        String password = loginVo.getPassword();

        System.out.println(StringUtils.isNotBlank(mobile) + " " + StringUtils.isNotBlank(password));
        // 判断是否为空，参数校验
        // if (!StringUtils.isNotBlank(mobile)) {
        //     return RespBean.error(RespBeanEnum.MOBILE_BLANK_ERROR);
        // }
        //
        // if (!ValidatorUtil.isMobile(mobile)) {
        //     return RespBean.error(RespBeanEnum.MOBILE_ERROR);
        // }

        // 从数据库中寻找对应用户
        User user = userMapper.selectById(mobile);
        // 用户不存在，响应错误信息
        if (user == null) {
            // return RespBean.error(RespBeanEnum.MOBILE_NOT_EXIST);
            // 这里抛出异常，全局异常处理器会处理
            throw new GlobalException(RespBeanEnum.MOBILE_NOT_EXIST);
        }
        // 密码不正确，返回错误信息
        if (!MD5Util.midPassToDbPass(password, user.getSlat()).equals(user.getPassword())) {
            return RespBean.error(RespBeanEnum.LOGIN_ERROR);
        }

        // 生成 cookie
        String ticket = UUIDUtil.getUUID();
        request.getSession().setAttribute(ticket, user);
        CookieUtil.setCookie(request, response, "userTicket", ticket);

        return RespBean.success();
    }
}
```

#### 业务开发

创建一个 `user bean`

```java
package com.fan.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
@TableName("seckill_user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    private String nickname;

    private String password;

    private String slat;

    private String head;

    private Date registerDate;

    private Date lastLoginDate;

    private Integer loginCount;

}
```

创建 user mapper 和它的映射

```java
package com.fan.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.fan.pojo.User;

public interface UserMapper extends BaseMapper<User> {
}
```

resources 目录下新建映射文件 `mapper/UserMapper.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.fan.mapper.UserMapper">
    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="com.fan.pojo.User">
        <id column="id" property="id" />
        <result column="nickname" property="nickname" />
        <result column="password" property="password" />
        <result column="slat" property="slat" />
        <result column="head" property="head" />
        <result column="register_date" property="registerDate" />
        <result column="last_login_date" property="lastLoginDate" />
        <result column="login_count" property="loginCount" />
    </resultMap>
    <!-- 通用查询结果列 -->
    <sql id="Base_Column_List">id, nickname, password, slat, head, register_date, last_login_date, login_count</sql>
</mapper>
```

创建响应信息的枚举

```java
package com.fan.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public enum RespBeanEnum {
    // 通用
    SUCCESS(200, "SUCCESS"),
    ERROR(500, "服务端异常"),
    // 登录模块
    MOBILE_BLANK_ERROR(500209, "手机号不能为空"),
    LOGIN_ERROR(500210, "手机号或者密码错误"),
    MOBILE_ERROR(500211, "手机号码格式不正确"),
    BING_ERROR(500212, "参数绑定异常"),
    MOBILE_NOT_EXIST(500213, "手机号码不存在"),
    PASSWORD_UPDATE_FAIL(500214, "更新密码失败");
    // TODO: 后续可以继续加

    private final Integer code;
    private final String message;
}
```

创建一个响应 bean，用于请求响应时的结果

```java
package com.fan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespBean {

    private long code;
    private String message;
    private Object obj;

    /**
     * 请求成功，返回状态码和信息，并返回数据
     * @param obj
     * @return
     */
    public static RespBean success(Object obj) {
        return new RespBean(RespBeanEnum.SUCCESS.getCode(), RespBeanEnum.SUCCESS.getMessage(), obj);
    }

    /**
     * 请求成功，返回状态码和信息，不返回数据
     * @return
     */
    public static RespBean success() {
        return new RespBean(RespBeanEnum.SUCCESS.getCode(), RespBeanEnum.SUCCESS.getMessage(), null);
    }

    /**
     * 请求失败，从枚举中取错误信息
     * @param respBeanEnum
     * @return
     */
    public static RespBean error(RespBeanEnum respBeanEnum) {
        return new RespBean(respBeanEnum.getCode(), respBeanEnum.getMessage(), null);
    }

    /**
     * 请求失败，返回错误信息，并返回数据
     * @param respBeanEnum
     * @param obj
     * @return
     */
    public static RespBean error(RespBeanEnum respBeanEnum, Object obj) {
        return new RespBean(respBeanEnum.getCode(), respBeanEnum.getMessage(), obj);
    }
}
```

创建登录vo，用于接收用户登录时的输入

```java
package com.fan.vo;

import lombok.Data;

@Data
public class LoginVo {

    // 手机号
    private String mobile;
    // 密码
    private String password;
}
```

创建用户接口，存放用户相关的方法

```java
package com.fan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.fan.pojo.User;
import com.fan.vo.LoginVo;
import com.fan.vo.RespBean;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface UserService extends IService<User> {
     // 用户登录
     RespBean doLogin(LoginVo loginVo, HttpServletRequest request, HttpServletResponse response);
}
```

用户实现类 UserServiceImpl

```java
import com.fan.util.MD5Util;
import com.fan.vo.LoginVo;
import com.fan.vo.RespBean;
import com.fan.vo.RespBeanEnum;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Resource
    private UserMapper userMapper;

    // 用户登录
    @Override
    public RespBean doLogin(LoginVo loginVo, HttpServletRequest request, HttpServletResponse response) {

        // 用户输入
        String mobile = loginVo.getMobile();
        String password = loginVo.getPassword();

        // 判断是否为空，参数校验
        if (!StringUtils.isNotBlank(mobile) || !StringUtils.isNotBlank(password)) {
            return RespBean.error(RespBeanEnum.MOBILE_ERROR);
        }

        // 校验手机号格式
        if (!ValidatorUtil.isMobile(mobile)) {
            return RespBean.error(RespBeanEnum.MOBILE_ERROR);
        }
        
        // 从数据库中寻找对应用户
        User user = userMapper.selectById(mobile);
        // 用户不存在，响应错误信息
        if (user == null) {
            return RespBean.error(RespBeanEnum.LOGIN_ERROR);
        }
        // 密码不正确，返回错误信息
        if (!MD5Util.midPassToDbPass(password, user.getSlat()).equals(user.getPassword())) {
            return RespBean.error(RespBeanEnum.LOGIN_ERROR);
        }

        return RespBean.success();
    }
}
```

实现登录接口

```java
package com.fan.controller;

import com.fan.service.UserService;
import com.fan.vo.LoginVo;
import com.fan.vo.RespBean;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/login")
@Slf4j
public class LoginController {

    @Resource
    private UserService userService;

    @RequestMapping("/toLogin")
    public String toLogin() {
        return "login";
    }

    /**
     * 用户登录接口
     * @param loginVo
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/doLogin")
    @ResponseBody
    public RespBean doLogin(@Valid LoginVo loginVo, HttpServletRequest request, HttpServletResponse response) {
        log.info("{}", loginVo);
        return userService.doLogin(loginVo, request, response);
    }
}
```

#### 生成 UUID 工具类

```java
package com.fan.util;

import java.util.UUID;

public class UUIDUtil {
    public static String getUUID() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}
```

测试：

```java
@Test
public void UUIDTest() {
    String uuid = UUIDUtil.getUUID();
    System.out.println(uuid);
}
```

#### cookie 工具类

```java
package com.fan.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class CookieUtil {
    /**
     * 得到 Cookie 的值, 不编码
     *
     * @param request
     * @param cookieName
     * @return
     */
    public static String getCookieValue(HttpServletRequest request, String
            cookieName) {
        return getCookieValue(request, cookieName, false);
    }
    /**
     * 得到 Cookie 的值
     * @param request
     * @param cookieName
     * @return
     */
    public static String getCookieValue(HttpServletRequest request, String
            cookieName, boolean isDecoder) {
        Cookie[] cookieList = request.getCookies();
        if (cookieList == null || cookieName == null) {
            return null;
        }
        String retValue = null;
        try {
            for (int i = 0; i < cookieList.length; i++) {
                if (cookieList[i].getName().equals(cookieName)) {
                    if (isDecoder) {
                        retValue = URLDecoder.decode(cookieList[i].getValue(), "UTF-8");
                    } else {
                        retValue = cookieList[i].getValue();
                    }
                    break;
                }
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return retValue;
    }
    /**
     * 得到 Cookie 的值, *
     * @param request
     * @param cookieName
     * @param encodeString
     * @return
     */
    public static String getCookieValue(HttpServletRequest request, String
            cookieName, String encodeString) {
        Cookie[] cookieList = request.getCookies();
        if (cookieList == null || cookieName == null) {
            return null;
        }
        String retValue = null;
        try {
            for (int i = 0; i < cookieList.length; i++) {
                if (cookieList[i].getName().equals(cookieName)) {
                    retValue = URLDecoder.decode(cookieList[i].getValue(), encodeString);
                    break;
                }
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return retValue;
    }
    /**
     * 设置 Cookie 的值 不设置生效时间默认浏览器关闭即失效,也不编码
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse
            response, String cookieName, String cookieValue) {
        setCookie(request, response, cookieName, cookieValue, -1);
    }
    /**
     * 设置 Cookie 的值 在指定时间内生效,但不编码
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse
            response, String cookieName, String cookieValue, int cookieMaxage) {
        setCookie(request, response, cookieName, cookieValue, cookieMaxage,
                false);
    }
    /**
     * 设置 Cookie 的值 不设置生效时间,但编码
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse
            response, String cookieName, String cookieValue, boolean isEncode) {
        setCookie(request, response, cookieName, cookieValue, -1, isEncode);
    }
    /**
     * 设置 Cookie 的值 在指定时间内生效, 编码参数
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse
            response, String cookieName, String cookieValue, int cookieMaxage, boolean
                                         isEncode) {
        doSetCookie(request, response, cookieName, cookieValue, cookieMaxage,
                isEncode);
    }
    /**
     * 设置 Cookie 的值 在指定时间内生效, 编码参数(指定编码)
     */
    public static void setCookie(HttpServletRequest request, HttpServletResponse
            response, String cookieName, String cookieValue, int cookieMaxage, String
                                         encodeString) {
        doSetCookie(request, response, cookieName, cookieValue, cookieMaxage, encodeString);
    }
    /**
     * 删除 Cookie 带 cookie 域名
     */
    public static void deleteCookie(HttpServletRequest request, HttpServletResponse response, String cookieName) {
        doSetCookie(request, response, cookieName, "", -1, false);
    }
    /**
     * 设置 Cookie 的值，并使其在指定时间内生效
     *
     * @param cookieMaxage cookie 生效的最大秒数
     */
    private static final void doSetCookie(HttpServletRequest request, HttpServletResponse response, String cookieName, String cookieValue,
                                          int cookieMaxage, boolean isEncode) {
        try {
            if (cookieValue == null) {
                cookieValue = "";
            } else if (isEncode) {
                cookieValue = URLEncoder.encode(cookieValue, "utf-8");
            }
            Cookie cookie = new Cookie(cookieName, cookieValue);
            if (cookieMaxage > 0) {
                cookie.setMaxAge(cookieMaxage);
            }
// if (null != request) {// 设置域名的 cookie
// String domainName = getDomainName(request);
// if (!"localhost".equals(domainName)) {
// cookie.setDomain(domainName);
// }
// }
            cookie.setPath("/");
            response.addCookie(cookie);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    /**
     * 设置 Cookie 的值，并使其在指定时间内生效
     *
     * @param cookieMaxage cookie 生效的最大秒数
     */
    private static final void doSetCookie(HttpServletRequest request,
                                                  HttpServletResponse response, String cookieName, String cookieValue,
                                          int cookieMaxage, String encodeString) {
        try {
            if (cookieValue == null) {
                cookieValue = "";
            } else {
                cookieValue = URLEncoder.encode(cookieValue, encodeString);
            }
            Cookie cookie = new Cookie(cookieName, cookieValue);
            if (cookieMaxage > 0) {
                cookie.setMaxAge(cookieMaxage);
            }
            if (null != request) {// 设置域名的 cookie
                String domainName = getDomainName(request);
                System.out.println(domainName);
                if (!"localhost".equals(domainName)) {
                    cookie.setDomain(domainName);
                }
            }
            cookie.setPath("/");
            response.addCookie(cookie);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    /**
     * 得到 cookie 的域名
     */
    private static final String getDomainName(HttpServletRequest request) {
        String domainName = null;
// 通过 request 对象获取访问的 url 地址
        String serverName = request.getRequestURL().toString();
        if ("".equals(serverName)) {
            domainName = "";
        } else {
// 将 url 地下转换为小写
            serverName = serverName.toLowerCase();
// 如果 url 地址是以 http://开头 将 http://截取
            if (serverName.startsWith("http://")) {
                serverName = serverName.substring(7);
            }
            int end = serverName.length();
// 判断 url 地址是否包含"/"
            if (serverName.contains("/")) {
//得到第一个"/"出现的位置
                end = serverName.indexOf("/");
            }
// 截取
            serverName = serverName.substring(0, end);
// 根据"."进行分割
            final String[] domains = serverName.split("\\.");
            int len = domains.length;
            if (len > 3) {
// www.abc.com.cn
                domainName = domains[len - 3] + "." + domains[len - 2] + "." +
                        domains[len - 1];
            } else if (len > 1) {
// abc.com or abc.cn
                domainName = domains[len - 2] + "." + domains[len - 1];
            } else {
                domainName = serverName;
            }
        }
        if (domainName.indexOf(":") > 0) {
            String[] ary = domainName.split("\\:");
            domainName = ary[0];
        }
        return domainName;
    }
}
```

用户请求登录的时候设置 cookie

```java
package com.fan.service.impl;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fan.exception.GlobalException;
import com.fan.mapper.UserMapper;
import com.fan.pojo.User;
import com.fan.service.UserService;
import com.fan.util.CookieUtil;
import com.fan.util.MD5Util;
import com.fan.util.UUIDUtil;
import com.fan.vo.LoginVo;
import com.fan.vo.RespBean;
import com.fan.vo.RespBeanEnum;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Resource
    private UserMapper userMapper;

    // 用户登录
    @Override
    public RespBean doLogin(LoginVo loginVo, HttpServletRequest request, HttpServletResponse response) {

        // 用户输入
        String mobile = loginVo.getMobile();
        String password = loginVo.getPassword();

        System.out.println(StringUtils.isNotBlank(mobile) + " " + StringUtils.isNotBlank(password));
        // 判断是否为空，参数校验
        // if (!StringUtils.isNotBlank(mobile)) {
        //     return RespBean.error(RespBeanEnum.MOBILE_BLANK_ERROR);
        // }
        //
        // if (!ValidatorUtil.isMobile(mobile)) {
        //     return RespBean.error(RespBeanEnum.MOBILE_ERROR);
        // }

        // 从数据库中寻找对应用户
        User user = userMapper.selectById(mobile);
        // 用户不存在，响应错误信息
        if (user == null) {
            // return RespBean.error(RespBeanEnum.MOBILE_NOT_EXIST);
            // 这里抛出异常，全局异常处理器会处理
            throw new GlobalException(RespBeanEnum.MOBILE_NOT_EXIST);
        }
        // 密码不正确，返回错误信息
        if (!MD5Util.midPassToDbPass(password, user.getSlat()).equals(user.getPassword())) {
            return RespBean.error(RespBeanEnum.LOGIN_ERROR);
        }

        // 生成 cookie
        String ticket = UUIDUtil.getUUID();
        request.getSession().setAttribute(ticket, user);
        CookieUtil.setCookie(request, response, "userTicket", ticket);

        return RespBean.success();
    }
}
```

```java
package com.fan.controller;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.fan.pojo.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/goods")
public class GoodsController {

    @RequestMapping("/toList")
    public String toList(HttpSession session, Model model, @CookieValue("userTicket") String ticket) {
        //如果 cookie 没有生成
        if (!StringUtils.isNotBlank(ticket)) {
            return "login";
        }

        User user = (User) session.getAttribute(ticket);
        if (user == null) {
            // 未登录
            return "login";
        }

        model.addAttribute("user", user);
        return "goodsList";
    }
}
```

goodsList 页面

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>商品列表</title>
</head>
<body>
    <h1>商品列表</h1>
    <p th:text="'hi: ' + ${user.nickname}"></p>
</body>
</html>
```

## 分布式 Session

分布式Session是一种在分布式系统环境下，对用户会话（Session）信息进行管理的技术。

分布式Session主要解决的问题是，当一个应用部署在多个服务器上时，如何跨服务器保存用户的Session信息，以便用户在每次请求时，无论请求被路由到哪个服务器，应用都可以获取到用户的会话状态。

分布式 session 会出现一个问题：

只能让用户购买一次商品。在使用 nginx 负载均衡后，可能对应到不同的 tomcat。用户第一次请求被均衡到 tomcatA，tomcatA 记录了 session。第二次请求被均衡到了 tomcatB，tomcatB 没记录 session，以为是第一次来，导致用户可以重复购买商品。

### 方案

#### session 绑定/粘滞/黏滞（session 服务器）

创建一个或者多个专门的Session服务器来管理所有的Session。所有的应用服务器都从Session服务器获取和保存Session。这种方式可以有效管理大量的Session，但是如果Session服务器出现问题，可能会影响所有的应用服务器。

优点：不占用服务器内存

缺点：

- 增加新机器，会重新 hash，导致重新登录
- 应用重启，需要重新登录
- 某台服务器宕机，该机器上的 session 也就不存在了，用户请求切换到其他机器后因为没有 session 而无法完成业务处理，这种方案不符合系统高可用需求，**使用较少**

#### session 复制

**Session 复制**是**小型架构使用较多**的一种服务器集群 Session 管理机制。每个服务器都保存所有的Session信息。当一个Session被创建或者修改时，这个Session会被复制到所有的服务器。这种方式实现简单，但是当服务器数量增加时，需要复制的Session数据会急剧增加，可能会影响性能。

优点：无需修改代码，修改 tomcat 配置即可

缺点：

- session 同步传输占用内网带宽
- 多台 tomcat 同步性能指数下降
- session 占用内存，无法有效水平扩展

#### 前端存储（基于Token的无状态Session）

服务器不保存Session，而是每次与客户端交互时，都发送一个包含了Session信息的Token。客户端在下次请求时，带上这个Token，服务器通过验证Token来恢复用户的会话状态。这种方式完全避免了服务器端的Session管理，但是需要在客户端和服务器之间频繁传输Token。

优点：不占用服务端内存

缺点：存在安全性问题；占用外网带宽

#### 后端集中存储（**持久化Session**）

将Session保存在数据库或者NoSQL存储系统(redis)中，所有的服务器都从这个存储系统中读取和写入Session。这种方式可以有效管理大量的Session，并且可以利用存储系统的高可用特性来提高Session的可用性。

优点：安全，容易水平扩展

缺点：增加复杂度，需要修改代码

## 使用 Redis 

### 加入相应依赖

```xml
<!-- spring data redis 依赖, 即 spring 整合 redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!--pool2 对象池依赖-->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
<!--实现分布式 session, 即将 Session 保存到指定的 Redis-->
<dependency>
    <groupId>org.springframework.session</groupId>
    <artifactId>spring-session-data-redis</artifactId>
</dependency>
```

### 添加配置

在 `application.yml` 中添加配置

```yaml
# redis 配置
redis:
  host: 127.0.0.1
  port: 6379
  database: 0 #默认数据库
  timeout: 10000ms
  lettuce:
    pool:
      #最大连接数：默认是 8 优化建议：cup核数*2
      max-active: 8
      #最大连接阻塞等待时间，默认是-1
      max-wait: 10000ms
      #最大空闲连接，默认是 8
      max-idle: 200
      #最小空闲连接，默认是 0
      min-idle: 5
```

### 测试session是否存储

登录成功后打开 redis 图形管理工具，发现 seesion 已经存储进去了

![image-20240514114853584](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240514114853584.png)

### 优化

前面将 Session 统一存放指定 Redis，是以原生的形式存放，在操作时，还需要反序列化，

不方便

**改进：**直接将登录用户信息统一存放到 Redis，利于操作

去除分布式 session 依赖

```xml
<!--实现分布式 session, 即将 Session 保存到指定的 Redis-->
<!--        <dependency>-->
<!--            <groupId>org.springframework.session</groupId>-->
<!--            <artifactId>spring-session-data-redis</artifactId>-->
<!--        </dependency>-->
```

#### redisConfig

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 设置相应 key 的序列化
        template.setKeySerializer(new StringRedisSerializer());
        // 设置相应 value 的序列化
        // redis 默认是 jdk 的序列化是二进制，这里使用的是通用的 json 序列化，不用传具体的序列号对象
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        // 设置 hash key 的序列化
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        // 设置连接工厂
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }
}
```

在 UserService 中写一个通过 cookie 获取用户信息的接口

```java
public interface UserService extends IService<User> {
     // 用户登录
     RespBean doLogin(LoginVo loginVo, HttpServletRequest request, HttpServletResponse response);

     // 根据 cookie 获取用户
     User getUserByCookie(String userTicket, HttpServletRequest request, HttpServletResponse response);
}
```

实现接口中的方法

```java
@Override
public User getUserByCookie(String userTicket, HttpServletRequest request, HttpServletResponse response) {
    if (!StringUtils.isNotBlank(userTicket)) {
        return null;
    }
    // 从 redis 中获取用户信息
    User user = (User) redisTemplate.opsForValue().get("user:" + userTicket);
    if (user != null) {
       CookieUtil.setCookie(request, response, "userTicket", userTicket);
    }
    return user;
}
```

在 GoodsController 中把原来直接存储 session 的方法改为存储用户信息

```java
@Controller
@RequestMapping("/goods")
public class GoodsController {

    @Autowired
    private UserService userService;

    @RequestMapping("/toList")
    public String toList(Model model, @CookieValue("userTicket") String ticket, HttpServletRequest request, HttpServletResponse response) {
        //如果 cookie 没有生成
        if (!StringUtils.isNotBlank(ticket)) {
            return "login";
        }

        // User user = (User) session.getAttribute(ticket);
        User user = userService.getUserByCookie(ticket, request, response);
        if (user == null) {
            // 未登录
            return "login";
        }
        model.addAttribute("user", user);

        return "goodsList";
    }
}
```

登录后 测试是否成功存储用户信息

![image-20240515092434371](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240515092434371.png)

## 秒杀的基本功能

### 数据库表

创建商品表和秒杀商品表

```sql
-- ----------------------------
-- Table structure for t_goods
-- ----------------------------
DROP TABLE
IF
	EXISTS `t_goods`;
CREATE TABLE `t_goods` (
	`id` BIGINT ( 20 ) NOT NULL AUTO_INCREMENT COMMENT '商品 id',
	`goods_name` VARCHAR ( 16 ) NOT NULL DEFAULT '',
	`goods_title` VARCHAR ( 64 ) NOT NULL DEFAULT '' COMMENT '商品标题',
	`goods_img` VARCHAR ( 64 ) NOT NULL DEFAULT '' COMMENT '商品图片',
	`goods_detail` LONGTEXT NOT NULL COMMENT '商品详情',
	`goods_price` DECIMAL ( 10, 2 ) DEFAULT '0.00' COMMENT '商品价格',
	`goods_stock` INT ( 11 ) DEFAULT '0' COMMENT '商品库存',
	PRIMARY KEY ( `id` ) 
) ENGINE = INNODB AUTO_INCREMENT = 3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of t_goods
-- ----------------------------
INSERT INTO `t_goods`
VALUES
	( '1', '整体厨房设计-套件', '整体厨房设计-套件', '/imgs/kitchen.jpg', '整体厨房设计-套件', '15266.00', '100' );
INSERT INTO `t_goods`
VALUES
	( '2', '学习书桌-套件', '学习书桌-套件', '/imgs/desk.jpg', '学习书桌-套件', '5690.00', '100' );
-- ----------------------------
-- Table structure for t_seckill_goods
-- ---------------------------- 
DROP TABLE IF EXISTS `t_seckill_goods`;
CREATE TABLE `t_seckill_goods` (
	`id` BIGINT ( 20 ) NOT NULL AUTO_INCREMENT,
	`goods_id` BIGINT ( 20 ) DEFAULT 0,
	`seckill_price` DECIMAL ( 10, 2 ) DEFAULT '0.00',
	`stock_count` INT ( 10 ) DEFAULT 0,
	`start_date` DATETIME DEFAULT NULL,
	`end_date` DATETIME DEFAULT NULL,
	PRIMARY KEY ( `id` ) 
) ENGINE = INNODB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4;

-- ----------------------------
-- Records of t_seckill_goods
-- ----------------------------
INSERT INTO `t_seckill_goods`
VALUES
	( '1', '1', '5266.00', '0', '2024-05-18 19:36:00', '2024-05-19 09:00:00' );
INSERT INTO `t_seckill_goods`
VALUES
	( '2', '2', '690.00', '10', '2024-05-18 08:00:00', '2024-05-19 09:00:00' );
```

### pojo 实体类

Goods 和 SeckillGoods pojo 实体类

```java
package com.fan.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@TableName("t_goods")
public class Goods implements Serializable {
    private final static long serialVersionUID = 1L;

    /**
     * 商品ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 商品名称
     */
    private String goodsName;

    /**
     * 商品标题
     */
    private String goodsTitle;

    /**
     * 商品图片
     */
    private String goodsImg;

    /**
     * 商品详情
     */
    private String goodsDetail;

    /**
     * 商品价格
     */
    private BigDecimal goodsPrice;

    /**
     * 商品库存
     */
    private Integer goodsStock;
}
package com.fan.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@TableName("t_seckill_goods")
public class SeckillGoods implements Serializable {

    private final static long serialVersionUID = 1L;

    /**
     * id
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 商品id
     */
    private Long goodsId;

    /**
     * 秒杀价格
     */
    private BigDecimal seckillPrice;

    /**
     * 库存数量
     */
    private Integer stockCount;

    /**
     * 秒杀开始时间
     */
    private Date startDate;

    /**
     * 秒杀结束时间
     */
    private Date endDate;
}
```

### 商品 Vo

Goods 商品 Vo

```java
package com.fan.vo;

import com.fan.pojo.Goods;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoodsVo extends Goods {

    private BigDecimal seckillPrice;
    private Integer stockCount;
    private Date startDate;
    private Date endDate;
}
```

### Mapper

```java
package com.fan.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.fan.pojo.Goods;
import com.fan.vo.GoodsVo;

import java.util.List;

public interface GoodsMapper extends BaseMapper<Goods> {

    // 获取商品列表
    List<GoodsVo> findGoodsVo();
}
package com.fan.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.fan.pojo.SeckillGoods;

public interface SeckillGoodsMapper extends BaseMapper<SeckillGoods> {
}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.fan.mapper.GoodsMapper">
    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="com.fan.pojo.Goods">
        <id column="id" property="id" />
        <result column="goods_name" property="goodsName" />
        <result column="goods_title" property="goodsTitle" />
        <result column="goods_img" property="goodsImg" />
        <result column="goods_detail" property="goodsDetail" />
        <result column="goods_price" property="goodsPrice" />
        <result column="goods_stock" property="goodsStock" />
    </resultMap>
    <!-- 通用查询结果列 -->
    <sql id="Base_Column_List">
        id, goods_name, goods_title, goods_img, goods_detail, goods_price, goods_stock
    </sql>
    <select id="findGoodsVo" resultType="com.fan.vo.GoodsVo">
        select
            g.id, g.goods_name, g.goods_title, g.goods_img,
            g.goods_detail, g.goods_price, g.goods_stock, sg.seckill_price, sg.stock_count, sg.start_date, sg.end_date
        FROM
            t_goods g LEFT JOIN t_seckill_goods as sg on g.id = sg.goods_id
    </select>
</mapper>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.fan.mapper.SeckillGoodsMapper">
    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="com.fan.pojo.SeckillGoods">
        <id column="id" property="id" />
        <result column="goods_id" property="goodsId" />
        <result column="seckill_price" property="seckillPrice" />
        <result column="stock_count" property="stockCount" />
        <result column="start_date" property="startDate" />
        <result column="end_date" property="endDate" />
    </resultMap>
    <!-- 通用查询结果列 -->
    <sql id="Base_Column_List">
        id, goods_id, seckill_price, stock_count, start_date, end_date
    </sql>
</mapper>
```

### Service 和 ServiceImpl

```java
package com.fan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.fan.pojo.Goods;
import com.fan.vo.GoodsVo;

import java.util.List;

public interface GoodsService extends IService<Goods> {

    // 商品列表
    List<GoodsVo> findGoodsVo();
}
package com.fan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.fan.pojo.SeckillGoods;

public interface SeckillGoodsService extends IService<SeckillGoods> {
}
package com.fan.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fan.mapper.GoodsMapper;
import com.fan.pojo.Goods;
import com.fan.service.GoodsService;
import com.fan.vo.GoodsVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoodsServiceImpl extends ServiceImpl<GoodsMapper, Goods> implements GoodsService {

    @Autowired
    private GoodsMapper goodsMapper;
    @Override
    public List<GoodsVo> findGoodsVo() {
        return goodsMapper.findGoodsVo();
    }
}
package com.fan.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fan.mapper.SeckillGoodsMapper;
import com.fan.pojo.SeckillGoods;
import com.fan.service.SeckillGoodsService;

public class SeckillGoodsServiceImpl extends ServiceImpl<SeckillGoodsMapper, SeckillGoods>  implements SeckillGoodsService {
}
```

### Controller

```java
package com.fan.controller;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.fan.pojo.User;
import com.fan.service.GoodsService;
import com.fan.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/goods")
public class GoodsController {

    @Autowired
    private UserService userService;

    @Autowired
    private GoodsService goodsService;

    @RequestMapping("/toList")
    public String toList(Model model, @CookieValue("userTicket") String ticket, HttpServletRequest request, HttpServletResponse response) {
        //如果 cookie 没有生成
        if (!StringUtils.isNotBlank(ticket)) {
            return "login";
        }

        // User user = (User) session.getAttribute(ticket);
        User user = userService.getUserByCookie(ticket, request, response);
        if (user == null) {
            // 未登录
            return "login";
        }
        model.addAttribute("user", user);
        // 商品列表
        model.addAttribute("goodsList", goodsService.findGoodsVo());

        return "goodsList";
    }
}
```

### 页面修改

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>商品列表</title>
    <!-- bootstrap -->
    <link rel="stylesheet" type="text/css" th:href="@{/bootstrap/css/bootstrap.min.css}"/>
    <script type="text/javascript" th:src="@{/js/jquery.min.js}"></script>
    <!-- jquery-validator -->
    <script type="text/javascript" th:src="@{/jquery-validation/jquery.validate.min.js}"></script>
    <script type="text/javascript"
            th:src="@{/jquery-validation/localization/messages_zh.min.js}"></script>
    <!-- layer -->
    <script type="text/javascript" th:src="@{/layer/layer.js}"></script>
    <!-- md5.js -->
    <script type="text/javascript" th:src="@{/js/md5.min.js}"></script>
    <!-- common.js -->
    <script type="text/javascript" th:src="@{/js/common.js}"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: "Open Sans", sans-serif;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-size: 11px;
        }
        body {
            background: #c9302c;
        }
        .main-header {
            width: 100%;
            height: 100px;
            background: whitesmoke;
            display: block;
        }
        .navbar {
            display: inline-block;
            float: right;
            margin-right: 50px;
            margin-top: 30px
        }
        .logo {
            display: inline-block;
            margin-top: 30px;
            margin-left: 30px;
            text-decoration: none;
        }
        .logo-lg {
            font-size: 20px;
            font-weight: lighter;
            color: #232324;
        }
        .logo-lg > b {
            font-size: 20px;
            font-weight: lighter;
            color: #232324;
        }
        .container {
            background: #FFFFFF;
        }
        .add-good {
            padding-top: 12px;
            padding-bottom: 20px;
            border-radius: 10px;
            outline: none;
            display: block;
            margin-right: 30px;
            background: #f6f6f6;
            color: #ce7d88;
            border: solid 1px #eac7cc;
        }
    </style>
</head>
<body>
<!--抽取头部公共页面-->
<header id="site-header" class="main-header">
    <!-- Logo -->
    <a class="logo" th:href="@{/goods/toList}">
        <span class="logo-lg"><b>商品抢购</b></span>
    </a>
    <nav class="navbar navbar-static-top">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </a>
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img class="user-image" src="/imgs/user.png" height="42" alt="User Image">
                        <span class="hidden-xs"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- User image -->
                        <li class="user-header">
                            <img class="img-circle" alt="User Image">
                            <p>
                                Hello ABC - Hello ABC
                                <small>Hello ABC</small>
                            </p>
                        </li>
                        <!-- Menu Body -->
                        <li class="user-body">
                        </li>
                        <li class="user-footer">
                            <div class="pull-middle">
                                <a th:href="@{/login/out}" class="btn btn-lg btn-default btn-block">退出系统</a>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</header>
<div class="container">
    <div class="panel-heading">秒杀商品列表</div>
    <table class="table" id="goodslist">
        <tr>
            <td>名称</td>
            <td>图片</td>
            <td>原价</td>
            <td>秒杀价</td>
            <td>库存</td>
            <td>详情</td>
        </tr>
        <tr th:each="goods,goodstStat : ${goodsList}">
            <td th:text="${goods.goodsName}"></td>
            <td>
                <img th:src="@{${goods.goodsImg}}" width="100" height="100"/>
            </td>
            <td th:text="${goods.goodsPrice}"></td>
            <td th:text="${goods.seckillPrice}"></td>
            <td th:text="${goods.stockCount}"></td>
            <td><a th:href="'/goods/toDetail/'+${goods.id}">查看详情</a></td>
        </tr>
    </table>
</div>
<script>
</script>
```

登录页也修改一下，登录成功后跳转到商品页

```html
<script>
    function login() {
        doLogin();
    }
    function doLogin() {
        var inputPass = $("#password").val();
        var salt = "zMDgZ44T";
        var str = salt.charAt(0) + inputPass + salt.charAt(5);
        var password = md5(str);
        $.ajax({
            url: "/login/doLogin",
            type: "POST", data: {
                mobile: $("#mobile").val(), password: password
            },success: function (data) {
                if (data.code == 200) {
                    // alert(data.message)
                    //登录成功后, 进入商品列表
                    layer.msg("登录成功~~");
                    window.location.href = "/goods/toList";
                } else {
                    alert(data.message)
                }
            },error: function () {
                alert("失败");
            }
        });
    }
</script>
```

测试一下内容是否正确

![image-20240515143826061](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240515143826061.png)

### 商品详情页实现

#### 增加 mapper 查询语句

根据商品 id 查询详情

```java
public interface GoodsMapper extends BaseMapper<Goods> {

    // 获取商品列表
    List<GoodsVo> findGoodsVo();

    // 根据商品id获取商品详情
    GoodsVo findGoodsVoByGoodsId(Long goodsId);
}
<select id="findGoodsVoByGoodsId" resultType="com.fan.vo.GoodsVo">
    select
        g.id, g.goods_name, g.goods_title, g.goods_img, g.goods_detail, g.goods_price, g.goods_stock, sg.seckill_price, sg.stock_count, sg.start_date, sg.end_date
    FROM
        t_goods g LEFT JOIN t_seckill_goods as sg on g.id = sg.goods_id
    where
        g.id = #{goodsId}
</select>
```

#### service 增加查询商品详情的方法

```java
public interface GoodsService extends IService<Goods> {

    // 商品列表
    List<GoodsVo> findGoodsVo();

    // 根据商品id查询商品详情
    GoodsVo findGoodsVoByGoodsId(Long goodsId);
}
@Service
public class GoodsServiceImpl extends ServiceImpl<GoodsMapper, Goods> implements GoodsService {

    @Autowired
    private GoodsMapper goodsMapper;
    @Override
    public List<GoodsVo> findGoodsVo() {
        return goodsMapper.findGoodsVo();
    }

    @Override
    public GoodsVo findGoodsVoByGoodsId(Long goodsId) {
        return goodsMapper.findGoodsVoByGoodsId(goodsId);
    }
}
```

#### controller 增加详情页路由

```java
    @RequestMapping("/toDetail/{goodsId}")
    public String toDetail(Model model, @CookieValue("userTicket") String ticket, @PathVariable("goodsId") Long goodsId, HttpServletRequest request, HttpServletResponse response) {
        //如果 cookie 没有生成
        if (!StringUtils.isNotBlank(ticket)) {
            return "login";
        }
        User user = userService.getUserByCookie(ticket, request, response);
        if (user == null) {
            // 未登录
            return "login";
        }
        model.addAttribute("user", user);
        // 商品详情
        model.addAttribute("goods", goodsService.findGoodsVoByGoodsId(goodsId));

        return "goodsDetail";
    }
```

#### 增加详情页

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>商品详情</title>
    <!--jquery-->
    <script type="text/javascript" th:src="@{/js/jquery.min.js}"></script>
    <!-- bootstrap -->
    <link rel="stylesheet" type="text/css" th:href="@{/bootstrap/css/bootstrap.min.css}"/>
    <script type="text/javascript" th:src="@{/bootstrap/js/bootstrap.js}"></script>
    <!-- layer -->
    <script type="text/javascript" th:src="@{/layer/layer.js}"></script>
    <!-- common.js -->
    <script type="text/javascript" th:src="@{/js/common.js}"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: "Open Sans", sans-serif;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-size: 11px;
        }
        body {
            /*background: #cbc0d3;*/
            background: #c9302c;
        }
        .main-header {
            width: 100%;
            height: 100px;
            /*background: #eac7cc;*/
            background: whitesmoke;
            display: block;
        }
        .navbar {
            display: inline-block;
            float: right;
            margin-right: 50px;
            margin-top: 30px;
        }
        .logo {
            display: inline-block;
            margin-top: 30px;
            margin-left: 30px;
            text-decoration: none;
        }
        .logo-lg {
            font-size: 20px;
            font-weight: lighter;
            color: #232324;
        }
        .logo-lg > b {
            font-size: 20px;
            font-weight: lighter;
            color: #232324;
        }
        .container {
            background: #FFFFFF;
            margin-right: auto;
            margin-left: auto;
            width: 900px;
        }
        .captcha {
            display: none;
        }
        .captchaImg {
            display: none;
            width: 130px;
            height: 32px;
        }
    </style>
</head>
<body>
<!--抽取头部公共页面-->
<header id="site-header" class="main-header">
    <!-- Logo -->
    <a class="logo" onclick="toList()">
        <span class="logo-lg"><b>商品抢购</b></span>
    </a>
    <nav class="navbar navbar-static-top">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </a>
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img class="user-image" src="/imgs/user.png" height="32" alt="User
Image">
                        <span class="hidden-xs"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- User image -->
                        <li class="user-header">
                            <img class="img-circle" alt="User Image">
                            <p>
                                Hello ABC - Hello ABC
                                <small>Hello ABC</small>
                            </p>
                        </li>
                        <!-- Menu Body -->
                        <li class="user-body">
                        </li>
                        <li class="user-footer">
                            <div class="pull-middle">
                                <a onclick="toOut()" class="btn btn-lg btn-default btn-block">退
                                    出系统</a>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</header>
<div class="panel panel-default">
    <div class="panel-heading" style="background: #c9302c;color: white">秒杀商品详情</div>
    <div class="panel-body">
        <span th:if="${user eq null}"> 您还没有登录，请登陆后再操作<br/></span>
        <span>production 参数</span>
    </div>
    <div class="container">
        <table class="table" id="good">
            <tr>
                <td>名称</td>
                <td colspan="3" id="goodName" th:text="${goods.goodsName}"></td>
            </tr>
            <tr>
                <td>图片</td>
                <td colspan="3"><img id="goodImg" th:src="@{${goods.goodsImg}}" width="200" heights="200"/></td>
            </tr>
            <tr>
                <td>秒杀价</td>
                <td id="secKillPrice" th:text="${goods.seckillPrice}"></td>
                <td>
                    <img id="captchaImg" class="captchaImg"/></td>
                <td>
                    <input id="captcha" class="captchaImg"/>
                    <input type="button" id="captchabtn" onclick="verifyCaptcha()" value="验证输入的验证码是否正确">
                </td>
            </tr>
            <tr>
                <td>原价</td>
                <td colspan="3" id="goodPrice" th:text="${goods.goodsPrice}"></td>
            </tr>
            <tr>
                <td>库存</td>
                <td colspan="3" id="stockCount" th:text="${goods.stockCount}"></td>
            </tr>
        </table>
    </div>
</div>
</body>
<script>
</script>
</html>
```

运行，登录测试详情页是否正常

![image-20240515163647436](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240515163647436.png)

### 秒杀实现

#### 数据库表

```sql
-- ----------------------------
-- Table structure for t_order 普通订单表,记录订单完整信息
-- ----------------------------
DROP TABLE
IF
	EXISTS `t_order`;
CREATE TABLE `t_order` (
	`id` BIGINT ( 20 ) NOT NULL AUTO_INCREMENT,
	`user_id` BIGINT ( 20 ) NOT NULL DEFAULT 0,
	`goods_id` BIGINT ( 20 ) NOT NULL DEFAULT 0,
	`delivery_addr_id` BIGINT ( 20 ) NOT NULL DEFAULT 0,
	`goods_name` VARCHAR ( 16 ) NOT NULL DEFAULT '',
	`goods_count` INT ( 11 ) NOT NULL DEFAULT '0',
	`goods_price` DECIMAL ( 10, 2 ) NOT NULL DEFAULT '0.00',
	`order_channel` TINYINT ( 4 ) NOT NULL DEFAULT '0' COMMENT '订单渠道 1pc，2Android，3ios',
	`status` TINYINT ( 4 ) NOT NULL DEFAULT '0' COMMENT '订单状态：0 新建未支付 1 已支付 2 已发货 3 已收货 4 已退款 5 已完成',
	`create_date` DATETIME DEFAULT NULL,
	`pay_date` DATETIME DEFAULT NULL,
	PRIMARY KEY ( `id` ) 
) ENGINE = INNODB AUTO_INCREMENT = 600 DEFAULT CHARSET = utf8mb4;
-- ----------------------------
-- Table structure for t_seckill_order 秒杀订单表,记录某用户 id,秒杀的商品 id,及其订单 id
-- ----------------------------
DROP TABLE
IF
	EXISTS `t_seckill_order`;
CREATE TABLE `t_seckill_order` (
	`id` BIGINT ( 20 ) NOT NULL AUTO_INCREMENT,
	`user_id` BIGINT ( 20 ) NOT NULL DEFAULT 0,
	`order_id` BIGINT ( 20 ) NOT NULL DEFAULT 0,
	`goods_id` BIGINT ( 20 ) NOT NULL DEFAULT 0,
	PRIMARY KEY ( `id` ),
UNIQUE KEY `seckill_uid_gid` ( `user_id`, `goods_id` ) USING BTREE COMMENT ' 用户 id，商品 id 的唯一索引，解决同一个用户多次抢购' 
) ENGINE = INNODB AUTO_INCREMENT = 300 DEFAULT CHARSET = utf8mb4;
```

#### 秒杀订单 pojo

```java
package com.fan.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@TableName("t_order")
public class Order implements Serializable {

    private final static long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long goodsId;

    private Long deliveryAddrId;

    private String goodsName;

    private Integer goodsCount;

    private BigDecimal goodsPrice;

    private Integer orderChannel;

    private Integer status;

    private Date createDate;

    private Date payDate;
}
package com.fan.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

@Data
@TableName("t_seckill_order")
public class SeckillOrder implements Serializable {

    private final static long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long orderId;

    private Long goodsId;
}
```

#### Mapper

```java
package com.fan.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.fan.pojo.Order;

public interface OrderMapper extends BaseMapper<Order> {
}
package com.fan.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.fan.pojo.SeckillOrder;

public interface SeckillOrderMapper extends BaseMapper<SeckillOrder> {
}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.fan.mapper.OrderMapper">
    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="com.fan.pojo.Order">
        <id column="id" property="id" />
        <result column="user_id" property="userId" />
        <result column="goods_id" property="goodsId" />
        <result column="delivery_addr_id" property="deliveryAddrId" />
        <result column="goods_name" property="goodsName" />
        <result column="goods_count" property="goodsCount" />
        <result column="goods_price" property="goodsPrice" />
        <result column="order_channel" property="orderChannel" />
        <result column="status" property="status" />
        <result column="create_date" property="createDate" />
        <result column="pay_date" property="payDate" />
    </resultMap>
    <!-- 通用查询结果列 -->
    <sql id="Base_Column_List">
        id, user_id, goods_id, delivery_addr_id, goods_name, goods_count, goods_price, order_channel, status, create_date, pay_date
    </sql>
</mapper>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.fan.mapper.SeckillOrderMapper">
    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="com.fan.pojo.SeckillOrder">
        <id column="id" property="id" />
        <result column="user_id" property="userId" />
        <result column="order_id" property="orderId" />
        <result column="goods_id" property="goodsId" />
    </resultMap>
    <!-- 通用查询结果列 -->
    <sql id="Base_Column_List">
        id, user_id, order_id, goods_id
    </sql>
</mapper>
```

#### Service 和 ServiceImpl

```java
package com.fan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.fan.pojo.Order;
import com.fan.pojo.User;
import com.fan.vo.GoodsVo;

public interface OrderService extends IService<Order> {

    // 秒杀
    Order seckill(User user, GoodsVo goodsVo);
}
package com.fan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fan.mapper.OrderMapper;
import com.fan.pojo.Order;
import com.fan.pojo.SeckillGoods;
import com.fan.pojo.SeckillOrder;
import com.fan.pojo.User;
import com.fan.service.OrderService;
import com.fan.service.SeckillGoodsService;
import com.fan.service.SeckillOrderService;
import com.fan.vo.GoodsVo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    @Resource
    private SeckillGoodsService seckillGoodsService;

    @Resource
    private SeckillOrderService seckillOrderService;

    @Resource
    private OrderMapper orderMapper;


    @Override
    public Order seckill(User user, GoodsVo goodsVo) {

        // 秒杀逻辑
        SeckillGoods seckillGoods = seckillGoodsService.getOne(new QueryWrapper<SeckillGoods>().eq("goods_id", goodsVo.getId()));

        // 扣减库存(下面这种方式是错误的，后面会出现问题，后面再优化)
        seckillGoods.setStockCount(seckillGoods.getStockCount() - 1);
        seckillGoodsService.updateById(seckillGoods);

        // 生成普通订单
        Order order = new Order();
        order.setUserId(user.getId());
        order.setGoodsId(goodsVo.getId());
        order.setGoodsName(goodsVo.getGoodsName());
        order.setDeliveryAddrId(0L);
        order.setGoodsCount(1);
        order.setGoodsPrice(seckillGoods.getSeckillPrice());
        order.setOrderChannel(1);
        order.setStatus(0);
        order.setCreateDate(new Date());
        orderMapper.insert(order);

        // 生成秒杀订单
        SeckillOrder seckillOrder = new SeckillOrder();
        seckillOrder.setGoodsId(goodsVo.getId());
        seckillOrder.setOrderId(order.getId());
        seckillOrder.setUserId(user.getId());
        seckillOrderService.save(seckillOrder);

        return order;
    }
}
package com.fan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.fan.pojo.SeckillOrder;

public interface SeckillOrderService extends IService<SeckillOrder> {
}
package com.fan.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fan.mapper.SeckillOrderMapper;
import com.fan.pojo.SeckillOrder;
import com.fan.service.SeckillOrderService;
import org.springframework.stereotype.Service;

@Service
public class SeckillOrderServiceImpl extends ServiceImpl<SeckillOrderMapper, SeckillOrder> implements SeckillOrderService {
}
```

#### Controller

```java
package com.fan.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.fan.pojo.Order;
import com.fan.pojo.SeckillOrder;
import com.fan.pojo.User;
import com.fan.service.GoodsService;
import com.fan.service.OrderService;
import com.fan.service.SeckillOrderService;
import com.fan.service.UserService;
import com.fan.vo.GoodsVo;
import com.fan.vo.RespBeanEnum;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;

@Controller
@RequestMapping("/seckill")
public class SeckillController {

    @Resource
    private UserService userService;
    
    @Resource
    private GoodsService goodsService;
    
    @Resource
    private SeckillOrderService seckillOrderService;

    @Resource
    private OrderService orderService;

    @RequestMapping("/doSeckill")
    public String doSeckill(Model model, @CookieValue("userTicket") String ticket, HttpServletRequest request, HttpServletResponse response, Long goodsId) {

        //如果 cookie 没有生成
        if (!StringUtils.isNotBlank(ticket)) {
            return "login";
        }

        User user = userService.getUserByCookie(ticket, request, response);
        if (user == null) {
            // 未登录
            return "login";
        }
        model.addAttribute("user", user);

        // ====================== 秒杀v1.0 开始 ==========
        GoodsVo goodsVo = goodsService.findGoodsVoByGoodsId(goodsId);
        if (goodsVo.getStockCount() <= 0) {
            // 库存不足
            model.addAttribute("errmsg", RespBeanEnum.ENTRY_STOCK.getMessage());
            return "secKillFail";
        }

        // 重复抢购
        SeckillOrder seckillOrder = seckillOrderService.getOne(new QueryWrapper<SeckillOrder>().eq("user_id", user.getId()).eq("goods_id", goodsId));
        if (seckillOrder!= null) {
            // 已经抢过了
            model.addAttribute("errmsg", RespBeanEnum.REPEATED_ERROR.getMessage());
            return "secKillFail";
        }

        // 秒杀开始
        Order order = orderService.seckill(user, goodsVo);
        if (order == null) {
            // 秒杀失败
            model.addAttribute("errmsg", RespBeanEnum.ENTRY_STOCK.getMessage());
            return "secKillFail";
        }

        // 秒杀成功
        model.addAttribute("order", order);
        model.addAttribute("goods", goodsVo);
        // ====================== 秒杀v1.0 结束 ==========

        return "orderDetail";
    }
}
```

商品详情页添加秒杀倒计时

```java
package com.fan.controller;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.fan.pojo.User;
import com.fan.service.GoodsService;
import com.fan.service.UserService;
import com.fan.vo.GoodsVo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;

@Controller
@RequestMapping("/goods")
public class GoodsController {

    @Autowired
    private UserService userService;

    @Autowired
    private GoodsService goodsService;

    @RequestMapping("/toList")
    public String toList(Model model, @CookieValue("userTicket") String ticket, HttpServletRequest request, HttpServletResponse response) {
        //如果 cookie 没有生成
        if (!StringUtils.isNotBlank(ticket)) {
            return "login";
        }

        // User user = (User) session.getAttribute(ticket);
        User user = userService.getUserByCookie(ticket, request, response);
        if (user == null) {
            // 未登录
            return "login";
        }
        model.addAttribute("user", user);
        // 商品列表
        model.addAttribute("goodsList", goodsService.findGoodsVo());

        return "goodsList";
    }

    //跳转商品详情页面
    @RequestMapping(value = "/toDetail/{goodsId}")
    public String toDetail(Model model, @CookieValue("userTicket") String ticket, HttpServletRequest request, HttpServletResponse response, @PathVariable Long goodsId) {
        //如果 cookie 没有生成
        if (!StringUtils.isNotBlank(ticket)) {
            return "login";
        }

        User user = userService.getUserByCookie(ticket, request, response);
        if (user == null) {
            // 未登录
            return "login";
        }

        model.addAttribute("user", user);
        GoodsVo goodsVo = goodsService.findGoodsVoByGoodsId(goodsId);
        //============处理秒杀倒计时和状态 start ==============
        Date startDate = goodsVo.getStartDate();
        Date endDate = goodsVo.getEndDate();
        Date nowDate = new Date();
        //秒杀状态
        int secKillStatus = 0;
        //秒杀倒计时
        int remainSeconds = 0;
        if (nowDate.before(startDate)) {
            //秒杀还没有开始
            remainSeconds = (int) ((startDate.getTime() - nowDate.getTime()) / 1000);
        } else if (nowDate.after(endDate)) {
            //秒杀结束
            secKillStatus = 2;
            remainSeconds = -1;
        } else {
            //秒杀进行中
            secKillStatus = 1;
            remainSeconds = 0;
        }
        model.addAttribute("secKillStatus", secKillStatus);
        model.addAttribute("remainSeconds", remainSeconds);
        //============处理秒杀倒计时和状态 end ==============
        model.addAttribute("goods", goodsVo);
        return "goodsDetail";
    }
}
```

#### 商品详情页

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>商品详情</title>
    <!--jquery-->
    <script type="text/javascript" th:src="@{/js/jquery.min.js}"></script>
    <!-- bootstrap -->
    <link rel="stylesheet" type="text/css" th:href="@{/bootstrap/css/bootstrap.min.css}"/>
    <script type="text/javascript" th:src="@{/bootstrap/js/bootstrap.js}"></script>
    <!-- layer -->
    <script type="text/javascript" th:src="@{/layer/layer.js}"></script>
    <!-- common.js -->
    <script type="text/javascript" th:src="@{/js/common.js}"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: "Open Sans", sans-serif;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-size: 11px;
        }
        body {
            /*background: #cbc0d3;*/
            background: #c9302c;
        }
        .main-header {
            width: 100%;
            height: 100px;
            /*background: #eac7cc;*/
            background: whitesmoke;
            display: block;
        }
        .navbar {
            display: inline-block;
            float: right;
            margin-right: 50px;
            margin-top: 30px;
        }
        .logo {
            display: inline-block;
            margin-top: 30px;
            margin-left: 30px;
            text-decoration: none;
        }
        .logo-lg {
            font-size: 20px;
            font-weight: lighter;
            color: #232324;
        }
        .logo-lg > b {
            font-size: 20px;
            font-weight: lighter;
            color: #232324;
        }
        .container {
            background: #FFFFFF;
            margin-right: auto;
            margin-left: auto;
            width: 900px;
        }
        .captcha {
            display: none;
        }
        .captchaImg {
            display: none;
            width: 130px;
            height: 32px;
        }
    </style>
</head>
<body>
<!--抽取头部公共页面-->
<header id="site-header" class="main-header">
    <!-- Logo -->
    <a class="logo" onclick="toList()">
        <span class="logo-lg"><b>商品抢购</b></span>
    </a>
    <nav class="navbar navbar-static-top">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </a>
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img class="user-image" src="/imgs/user.png" height="32" alt="User
Image">
                        <span class="hidden-xs"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- User image -->
                        <li class="user-header">
                            <img class="img-circle" alt="User Image">
                            <p>
                                Hello ABC - Hello ABC
                                <small>Hello ABC</small>
                            </p>
                        </li>
                        <!-- Menu Body -->
                        <li class="user-body">
                        </li>
                        <li class="user-footer">
                            <div class="pull-middle">
                                <a onclick="toOut()" class="btn btn-lg btn-default btn-block">退
                                    出系统</a>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</header>
<div class="panel panel-default">
    <div class="panel-heading" style="background: #c9302c;color: white">秒杀商品详情</div>
    <div class="panel-body">
        <span th:if="${user eq null}"> 您还没有登录，请登陆后再操作<br/></span>
        <span>production 参数</span>
    </div>
    <div class="container">
        <table class="table" id="good">
            <tr>
                <td>名称</td>
                <td colspan="3" id="goodName" th:text="${goods.goodsName}"></td>
            </tr>
            <tr>
                <td>图片</td>
                <td colspan="3"><img id="goodImg" th:src="@{${goods.goodsImg}}" width="200" height="200"/></td>
            </tr>
            <tr>
                <td>秒杀开始时间</td>
                <td id="startTime" th:text="${#dates.format(goods.startDate,'yyyy-MM-dd HH:mm:ss')}"></td>
                <td id="seckillTip">
                    <input type="hidden" id="remainSeconds"
                           th:value="${remainSeconds}"/>
                    <span th:if="${secKillStatus eq 0}">秒杀倒计时：
                        <span id="countDown" th:text="${remainSeconds}"> </span>秒
                    </span>
                    <span th:if="${secKillStatus eq 1}">秒杀进行中</span>
                    <span th:if="${secKillStatus eq 2}">秒杀已结束</span>
                </td>
                <td>
                    <form id="secKillForm" method="post" action="/seckill/doSeckill">
                        <input type="hidden" id="goodsId" name="goodsId" th:value="${goods.id}">
                        <button class="btn btn-primary btn-block" type="submit" id="buyButton"> 抢 购
                        </button>
                    </form>
                </td>
            </tr>

            <tr>
                <td>秒杀价</td>
                <td id="secKillPrice" th:text="${goods.seckillPrice}"></td>
                <td>
                    <img id="captchaImg" class="captchaImg"/></td>
                <td>
                    <input id="captcha" class="captchaImg"/>
                    <input type="button" id="captchabtn" onclick="verifyCaptcha()" value="验证输入的验证码是否正确">
                </td>
            </tr>
            <tr>
                <td>原价</td>
                <td colspan="3" id="goodPrice" th:text="${goods.goodsPrice}"></td>
            </tr>
            <tr>
                <td>库存</td>
                <td colspan="3" id="stockCount" th:text="${goods.stockCount}"></td>
            </tr>
        </table>
    </div>
</div>
</body>
<script>
    $(function () {
        countDown();
    });
    function countDown() {
        var remainSeconds = $("#remainSeconds").val();
        var timeout;
        // 秒杀还未开始
        if (remainSeconds > 0) {
            $("#buyButton").attr("disabled", true);
            timeout = setTimeout(function () {
                $("#countDown").text(remainSeconds - 1);
                $("#remainSeconds").val(remainSeconds - 1);
                countDown();
            }, 1000);
        } else if (remainSeconds == 0) {//秒杀进行中
            $("#buyButton").attr("disabled", false);
            if (timeout) {//清空计时器
                clearTimeout(timeout);
            }
            $("#seckillTip").html("秒杀进行中");
        } else {
            $("#buyButton").attr("disabled", true);
            $("#seckillTip").html("秒杀已结束");
        }
    }
</script>
</html>
```

#### 订单详情页

```html
<html lang="en"
      xmlns:th="http://www.thymeleaf.org">
<head>
    <title>订单详情</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <!--jquery-->
    <script type="text/javascript" th:src="@{/js/jquery.min.js}"></script>
    <!-- bootstrap -->
    <link rel="stylesheet" type="text/css" th:href="@{/bootstrap/css/bootstrap.min.css}"/>
    <script type="text/javascript" th:src="@{/bootstrap/js/bootstrap.js}"></script>
    <!-- layer -->
    <script type="text/javascript" th:src="@{/layer/layer.js}"></script>
    <!-- common.js -->
    <script type="text/javascript" th:src="@{/js/common.js}"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: "Open Sans", sans-serif;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-size: 11px;
        }
        body {
            background: #c9302c;
        }
        .main-header {
            width: 100%;
            height: 100px;
            background: whitesmoke;
            display: block;
        }
        .navbar {
            display: inline-block;
            float: right;
            margin-right: 50px;
            margin-top: 30px;
        }
        .logo {
            display: inline-block;
            margin-top: 30px;
            margin-left: 30px;
            text-decoration: none;
        }
        .logo-lg {
            font-size: 20px;
            font-weight: lighter;
            color: #232324;
        }
        .logo-lg > b {
            font-size: 20px;
            font-weight: lighter;
            color: #232324;
        }
        .container {
            background: #FFFFFF;
            padding-right: 15px;
            padding-left: 15px;
            margin-right: auto;
            margin-left: auto;
            width: 750px;
        }
    </style>
</head>
<body>
<header id="site-header" class="main-header">
    <!-- Logo -->
    <a class="logo" onclick="toList()">
        <span class="logo-lg"><b>商品抢购</b></span>
    </a>
    <nav class="navbar navbar-static-top">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </a>
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
                <li class="dropdown user user-menu">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img class="user-image" src="/imgs/user.png" height="32" alt="User
Image">
                        <span class="hidden-xs"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <!-- User image -->
                        <li class="user-header">
                            <img class="img-circle" alt="User Image">
                            <p>
                                Hello ABC - Hello ABC
                                <small>Hello ABC</small>
                            </p>
                        </li>
                        <!-- Menu Body -->
                        <li class="user-body">
                        </li>
                        <li class="user-footer">
                            <div class="pull-middle">
                                <a onclick="toList()" class="btn btn-lg btn-default btn-block">退
                                    出系统</a>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</header>
<div class="panel panel-default">
    <div class="panel-heading" style="background: #c9302c;color: white">秒杀订单详情</div>
    <div class="container">
        <table class="table" id="order">
            <tr>
                <td>名称</td>
                <td id="goodName" colspan="3" th:text="${goods.goodsName}"></td>
            </tr>
            <tr>
                <td>图片</td>
                <td colspan="2"><img id="goodImg" width="200" th:src="@{${goods.goodsImg}}" height="200"/></td>
            </tr>
            <tr>
                <td>订单价格</td>
                <td colspan="2" id="goodPrice" th:text="${order.goodsPrice}"></td>
            </tr>
            <tr>
                <td>下单时间</td>
                <td id="createDate" colspan="2"
                    th:text="${#dates.format(order.createDate,'yyyy-MM-dd HH:mm:ss')}"></td>
            </tr>
            <tr>
                <td>订单状态</td>
                <td id="status" >
                    <span th:if="${order.status eq 0}">未支付</span>
                    <span th:if="${order.status eq 1}">代发货</span>
                    <span th:if="${order.status eq 2}">已发货</span>
                    <span th:if="${order.status eq 3}">已收货</span>
                    <span th:if="${order.status eq 4}">已退款</span>
                    <span th:if="${order.status eq 5}">已完成</span>
                </td>
                <td>
                    <button class="btn btn-primary btn-block" type="submit"
                            id="payButton">立即支付
                    </button>
                </td>
            </tr>
            <tr>
                <td>收货人</td>
                <td colspan="2">XXX 13300000000</td>
            </tr>
            <tr>
                <td>收货地址</td>
                <td colspan="2">北京市幸福小区 6 单元 101 号</td>
            </tr>
        </table>
    </div>
</div>
<script>
</script>
</body>
</html>
```

#### 秒杀错误页

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            font-family: "Open Sans", sans-serif;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <h1>秒杀失败 ： </h1>
    <p th:text="${errmsg}"></p>
</body>
</html>
```

![image-20240516091749223](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240516091749223.png)



## 压力测试 JMeter

### JMeter

进入 [官网](https://jmeter.apache.org/) 了解更多

[下载链接](https://jmeter.apache.org/download_jmeter.cgi)，选择需要的进行下载

![image-20240522142811801](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240522142811801.png)

下载后直接解压即可，进入 bin 目录下，双击 `jmeter.bat` 文件即可运行

![image-20240522143505815](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240522143505815.png)



![image-20240522143605908](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240522143605908.png)

### 设置中文

如果有设置中文的需求，可以打开 `apache-jmeter-5.4.3\bin\jmeter.properties` 修改配置

```properties
#language=en
language=zh_CN

sampleresult.default.encoding=UTF-8
```

重新打开软件，就是中文的了

### 快速入门

测试我们写的商品列表接口，每次发出 10 次请求，共循环 5 次，即一共发出 50 次请求

#### 1. 新建线程组

![image-20240522154117536](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240522154117536.png)

![image-20240522155615256](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240522155615256.png)

#### 2. 设置 http 请求默认值

![image-20240522163403838](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240522163403838.png)

填写协议、IP和端口号

![image-20240522163536290](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240522163536290.png)

#### 3. 设置 http 请求

![image-20240522163717517](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/image-20240522163717517.png)

![image.png](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716367127734-dc4fc5d4-c8ba-4cc0-a411-9d05ea9f6719.png)

#### 4. 配置监听器

监听器有很多种类，可以返回各种形式的结果，方便观察。需要什么就添加什么

ctrl + e 可以清除结果树的结果

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716367468407-ed240746-88ea-4c25-ac93-a513f72a0ce2.png)

#### 5. 添加 cookie 管理器

商品列表需要登录才能请求，所以需要设置 cookie

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716367913635-8645219c-c047-4255-bd1c-b3681fe392ad.png)

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716368263845-dbeef762-07cc-4353-8768-e6bf5f20f843.png)

#### 6. 运行

点击运行

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716368456848-9fd6307f-42f2-4b8e-9894-d4ed8a94f18e.png)

即可看到请求结果

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716368196028-386c1b7a-37e4-4b5b-b2a1-9f1afa8ca65a.png)

聚合报告中可以查看吞吐量

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716427982368-b949bd84-86bf-4b3e-93bd-37ef0a71c91b.png)

### 用户测试

#### 单用户

添加用户信息接口，创建 `UserController`

```java
package com.fan.controller;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.fan.pojo.User;
import com.fan.service.UserService;
import com.fan.vo.RespBean;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/user")
public class UserController {

    @Resource
    UserService userService;

    /**
     * 获取用户信息
     * @param ticket
     * @param request
     * @param response
     * @param address
     * @return
     */
    @ResponseBody
    @RequestMapping("/info")
    public RespBean info(@CookieValue("userTicket") String ticket, HttpServletRequest request, HttpServletResponse response, String address) {

        User user = userService.getUserByCookie(ticket, request, response);
        return RespBean.success(user);
    }
}
```

新增用户请求

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716428569045-f029fab2-cfa9-4e0d-8012-92e36ff929bd.png)

禁用商品列表请求，运行用户信息请求

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716428911103-77bce247-199c-4eb7-a794-a04ca6dc9032.png)

#### 多用户

随便在哪个地方创建一个 config.txt 文件，里面存放登录名和cookie

```plain
13300000000,96dc39f1fb6e4235be47e0575cc836c1
13300000001,a2d6af3d523240a4ad42de9b34292aec
```

添加 CSV 配置

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716429444247-3538d47c-5d74-425a-9c0a-26e30c47e030.png)

选择配置文件，添加编码、变量名、分隔符这些信息

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716429649600-9222e6d0-3e11-4061-b474-22fe652df419.png)

将 cookie 管理器中的 cookie 用变量替代

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716430084105-b5017a90-1576-477e-b613-47861342e1a2.png)

运行测试就会发现，多个用户都会请求

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716430147851-74ab4069-3199-4d34-9232-336703a302dd.png)

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716430172034-22cd9c47-1ec0-47f9-b621-0a70cde4e152.png)

### 压测商品列表

配置多点的请求数

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716430615310-e2a67c17-246f-42b9-a0d2-7ea4cc29670d.png)

可以看出吞吐量还是有点小的，这个跟电脑配置有关，也就是跟服务器有关

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716430643146-2bc6733b-4f3f-454e-ab03-9d2e241f57f9.png)

### 压测秒杀接口

#### 创建多用户脚本

创建一个生成用户的工具类

```java
package com.fan.util;

import com.fan.pojo.User;
import com.fan.vo.RespBean;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;

// 生成用户工具类
// 创建用户，并且去登录得到 userticket 得到的 userticket 写入到桌面的 config.text 文件中
public class UserUtil {
    public static void createUser(int count) throws Exception {
        List<User> users = new ArrayList<>(count);
        for (int i = 0; i < count; i++){
            User user = new User();
            user.setId(13300000100L + i);
            user.setNickname("user" + i);
            user.setSlat("zMDgZ44T"); // 用户数据表的slat,由程序员设置
            // 是用户原始密码，比如12345，hello等
            user.setPassword(MD5Util.inputPassToDbPass("123456", user.getSlat()));
            users.add(user);
        }

        System.out.println("create user");
        // 插入数据库
        Connection connection = getConn();
        String sql = "insert into seckill_user(nickname,slat,password,id) values(?,?,?,?)";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            preparedStatement.setString(1, user.getNickname());
            preparedStatement.setString(2, user.getSlat());
            preparedStatement.setString(3, user.getPassword());
            preparedStatement.setLong(4, user.getId());
            preparedStatement.addBatch();
        }
        preparedStatement.executeBatch();
        preparedStatement.clearParameters();//关闭
        connection.close();
        System.out.println("insert to do");
        // 登录拿到 userTicket
        String urlStr = "http://localhost:8091/login/doLogin";
        File file = new File("C:\\Users\\EDY\\Desktop\\config.txt");
        if (file.exists()) {
            file.delete();
        }
        RandomAccessFile raf = new RandomAccessFile(file, "rw");
        raf.seek(0);
        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            // 请求
            URL url = new URL(urlStr);
            HttpURLConnection co = (HttpURLConnection) url.openConnection();
            co.setRequestMethod("POST");
            // 设置输入网页密码（相当于输出到页面）
            co.setDoOutput(true);
            OutputStream outputStream = co.getOutputStream();
            String params = "mobile=" + user.getId() + "&password=" +
                    MD5Util.inputPassToMidPass("123456");
            outputStream.write(params.getBytes());
            outputStream.flush();
            // 获取网页输出，（得到输入流，把结果得到，再输出到 ByteArrayOutputStream 内）
            InputStream inputStream = co.getInputStream();
            ByteArrayOutputStream bout = new ByteArrayOutputStream();
            byte[] bytes = new byte[1024];
            int len = 0;
            while ((len = inputStream.read(bytes)) >= 0) {
                bout.write(bytes, 0, len);
            }
            inputStream.close();
            bout.close();
            // 把 ByteArrayOutputStream 内的东西转换为 respBean 对象
            String response = new String(bout.toByteArray());
            ObjectMapper mapper = new ObjectMapper();
            RespBean respBean = mapper.readValue(response, RespBean.class);
            // 得到 userTicket
            String userTicket = (String) respBean.getObj();
            System.out.println("create userTicket" + userTicket);
            String row = user.getId() + "," + userTicket;
            // 写入指定文件
            raf.seek(raf.length());
            raf.write(row.getBytes());
            raf.write("\r\n".getBytes());
            System.out.println("write to file:" + user.getId());
        }
        raf.close();
        System.out.println("over");
    }

    /**
     * 获取数据库连接
     * @return
     * @throws Exception
     */
    private static Connection getConn() throws Exception {
        String url = "jdbc:mysql://localhost:3306/seckill?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai";
        String username = "root";
        String password = "123456";
        String driver = "com.mysql.cj.jdbc.Driver";
        Class.forName(driver);
        return DriverManager.getConnection(url, username, password);
    }
    public static void main(String[] args) throws Exception {
        createUser(10);
    }
}
```

在 UserServiceImpl 的用户登录方法中返回 ticket

```java
@Override
public RespBean doLogin(LoginVo loginVo, HttpServletRequest request, HttpServletResponse response) {
    // 返回 ticket, 否则生成多用户脚本时, userTicket 是 null
    return RespBean.success(ticket);
}
```

运行 UserUtil main 方法进行测试，成功写入了用户，redis 中也有用户记录，config.txt 也存有用户id 和 ticket

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716432629015-049c5955-4126-49c0-a1a3-7e4d4ce26f8c.png)

#### 进行压测

1. 把 `t_order` 和 `t_seckill_order` 表清空
2. 把 `t_seckill_goods` 的 id=1 商品 stock_count 调整为10
3. 测试秒杀商品1

在 jmeter 中添加秒杀接口请求，并传入参数 商品id

![img](SpringBoot%E7%A7%92%E6%9D%80%E9%A1%B9%E7%9B%AE.assets/1716432986935-933c12c3-2b5b-4380-944e-a88afd267323.png)

运行得到的结果是，数据库中 `order` 的记录比 `seckill_order` 的记录多

说明： 如果压测吞吐量大, 这个 `stock_count` 可能会超卖更多，需要优化