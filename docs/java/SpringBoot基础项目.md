# SpringBoot 基础项目

## 创建项目

选择依赖

![image-20240419113115523](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419113115523.png)

添加 `druid` 和 `mybatis-plus` 依赖

```xml
<!-- https://mvnrepository.com/artifact/com.baomidou/mybatis-plus-boot-starter -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.5</version>
</dependency>
<!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.8</version>
</dependency>
```

## 创建数据库

创建数据库和数据表

```mysql
-- 创建 springboot_vue
DROP DATABASE IF EXISTS springboot_vue;
CREATE DATABASE springboot_vue;
USE springboot_vue;
-- 创建家居表
CREATE TABLE furn(
`id` INT(11) PRIMARY KEY AUTO_INCREMENT, ## id
`name` VARCHAR(64) NOT NULL, ## 家居名
`maker` VARCHAR(64) NOT NULL, ## 厂商
`price` DECIMAL(11,2) NOT NULL, ## 价格
`sales` INT(11) NOT NULL,
`stock` INT(11) NOT NULL ## 库存
);
-- 初始化家居数据
INSERT INTO furn(`id` , `name` , `maker` , `price` , `sales` , `stock`)
VALUES(NULL , '北欧风格小桌子' , '熊猫家居' , 180 , 666 , 7);
INSERT INTO furn(`id` , `name` , `maker` , `price` , `sales` , `stock`)
VALUES(NULL , '简约风格小椅子' , '熊猫家居' , 180 , 666 , 7);
INSERT INTO furn(`id` , `name` , `maker` , `price` , `sales` , `stock`)
VALUES(NULL , '典雅风格小台灯' , '蚂蚁家居' , 180 , 666 , 7);
INSERT INTO furn(`id` , `name` , `maker` , `price` , `sales` , `stock`)
VALUES(NULL , '温馨风格盆景架' , '蚂蚁家居' , 180 , 666 , 7);
SELECT * FROM furn;
```

在 application.yml 中添加数据库配置

```yml
server:
  port: 8090

spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    url: jdbc:mysql://localhost:3306/springboot_vue?useSSL=true&useUnicode=true
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
```

## 返回结果工具类

封装一个返回结果工具类，在 utils 包下创建一个 Result 类，这里不使用 @Data 注解，自己实现构造方法

```java
package com.fan.furn.utils;

public class Result<T> {
    private String code;
    private String msg;
    private T data;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    // 无参构造器
    public Result() {
        
    }

    // 带参构造器，指定返回的 data
    public Result(T data) {
        this.data = data;
    }

    /**
     * 返回需要的 Result 对象，表示成功的Result
     * @return Result
     */
    public static Result success() {
        Result result = new Result<>();
        result.setCode("200");
        result.setMsg("success");
        return result;
    }

    /**
     * 返回需要的 Result 对象，表示成功的Result，同时可以携带数据
     * 如果需要在static方法中使用泛型，需要在 static <T>
     * @return Result
     */
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>(data);
        result.setCode("200");
        result.setMsg("success");
        return result;
    }

    /**
     * 返回需要的 Result 对象，表示失败的Result
     * @return Result
     */
    public static Result error(String code, String msg) {
        Result result = new Result<>();
        result.setCode(code);
        result.setMsg(msg);
        return result;
    }

    /**
     * 返回需要的 Result 对象，表示失败的Result，同时可以携带参数
     * @return Result
     */
    public static <T> Result<T> error(String code, String msg, T data) {
        Result<T> result = new Result<>(data);
        result.setCode(code);
        result.setMsg(msg);
        return result;
    }
}
```

## 功能实现 - 添加家具信息

### 思路分析

完成后台代码从 mapper -> service -> controller , 并对每层代码进行测试 , 到 controller 这一层，使用 Postman 发送 http 请求完成测试

### 开发 Mapper

创建 Furn bean

```java
package com.fan.furn.beans;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * @TableName("furn") 表示 class Furn 与表 furn 相关联
 * 如果表名和类名相同，可省略
 */
@Data
@TableName("furn")
public class Furn {

    /**
     * @TableId 表示表主键标识
     * 配置了说明是表的id字段，而且是主键
     * type = IdType.AUTO 主键类型是自增长
     * 不写这个注解就要必须传 id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private String maker;
    private Double price;
    private Integer sales;
    private Integer stock;
}
```

创建 mapper 接口，继承 `mybatis-plus` 的 `baseMapper` 类

```java
package com.fan.furn.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.fan.furn.beans.Furn;

/**
 * 可以在这里添加 Mapper 注解，也可以在启动类中统一配置扫描包
 */
// @Mapper
public interface FurnMapper extends BaseMapper<Furn> {
}
```

不添加 `@Mapper` ，在启动类配置 `@MapperScan`

```java
package com.fan.furn;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan(basePackages = {"com.fan.furn.mapper"})
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

编写测试类，测试 furnMapper 是否正确

```java
package com.fan.furn;

import com.fan.furn.beans.Furn;
import com.fan.furn.mapper.FurnMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
public class ApplicationTest {

    @Resource
    private FurnMapper furnMapper;

    @Test
    public void testFurnMapper() {
        System.out.println("furnMapper" + furnMapper.getClass());

        Furn furn = furnMapper.selectById(4);

        System.out.println("furn" + furn);
    }

}
```

![image-20240419150738335](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419150738335.png)

### 开发 Service

创建 service 包，FurnService 接口，继承 mybatis-plus 的 IService

```java
package com.fan.furn.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.fan.furn.beans.Furn;

public interface FurnService extends IService<Furn> {
}
```

实现 FurnService 的实现类 FurnServiceImpl，继承 mybatis-plus 的 ServiceImpl

```java
package com.fan.furn.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fan.furn.beans.Furn;
import com.fan.furn.mapper.FurnMapper;
import com.fan.furn.service.FurnService;
import org.springframework.stereotype.Service;

@Service
public class FurnServiceImpl extends ServiceImpl<FurnMapper, Furn> implements FurnService {
}
```

测试 service

```java
@SpringBootTest
public class ApplicationTest {

    @Resource
    private FurnService furnService;

    @Test
    public void testFurnService() {
        List<Furn> list = furnService.list();
        for (Furn furn : list) {
            System.out.println("furn=>" + furn);
        }
    }
}
```

![image-20240419153217652](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419153217652.png)

### 开发 Controller

写一个保存接口

```java
package com.fan.furn.controller;

import com.fan.furn.beans.Furn;
import com.fan.furn.service.FurnService;
import com.fan.furn.utils.Result;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
public class FurnController {

    @Resource
    private FurnService furnService;

    @PostMapping("/save")
    public Result<?> save(@RequestBody Furn furn) {

        furnService.save(furn);
        return Result.success();
    }
}
```

使用 postman 测试一下

![image-20240419161042611](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419161042611.png)

## 功能实现 - 显示所有家具信息

mapper 和 service 可以不用写了，之前都写好了，直接在 controller 中添加就可以了

```java
@RequestMapping("/furns")
public Result<?> listFurns() {
    List<Furn> list = furnService.list();
    return Result.success(list);
}
```

测试一下返回的数据

![image-20240419162959083](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419162959083.png)

## 功能实现 - 根据 id 回显数据

根据id来查找某条数据

```java
@GetMapping("/find/{id}")
public Result<?> findById(@PathVariable Integer id) {
    Furn furn = furnService.getById(id);
    return Result.success(furn);
}
```

![image-20240419164834906](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419164834906.png)

## 功能实现 - 修改家具信息

根据 id 去修改它的信息，只需要在 controller 中实现接口

```java
@PutMapping("/update")
public Result<?> updateById(@RequestBody Furn furn) {
    furnService.updateById(furn);
    return Result.success();
}
```

![image-20240419163515103](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419163515103.png)

## 功能实现 - 删除家具信息

controller 中添加删除接口

```java
@DeleteMapping("/del/{id}")
public Result<?> deleteById(@PathVariable Integer id) {
    furnService.removeById(id);
    return Result.success();
}
```

![image-20240419164302690](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419164302690.png)

## 功能实现 - 列表数据分页显示

添加一个 mybatis-plus 的配置

```java
package com.fan.furn.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MybatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 根据实际所用数据库，配置类型
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));

        return interceptor;
    }
}
```

controller 中实现分页查询接口，默认大小为一页5条数据

```java
@RequestMapping("/furnsByPage")
public Result<?> listByPage(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "5") Integer pageSize) {
    Page<Furn> page = furnService.page(new Page<>(pageNum, pageSize));
    return Result.success(page);
}
```

测试结果

![image-20240419170243535](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419170243535.png)

## 切换数据源为Druid

确保引入依赖后，添加一个 druid 配置文件 `DruidDataSourceConfig`

```java
package com.fan.furn.config;

import com.alibaba.druid.pool.DruidDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.SQLException;

@Configuration
@Slf4j
public class DruidDataSourceConfig {

    @ConfigurationProperties("spring.datasource")
    @Bean
    public DataSource dataSource() throws SQLException {
        DruidDataSource dataSource = new DruidDataSource();
        log.info("数据源={}", dataSource.getClass());
        return dataSource;
    }
}
```

![image-20240419170924561](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419170924561.png)

## 功能实现 - 带搜索条件的分页查询

使用 wrappers 可以做条件查询

```java
@RequestMapping("/furnsBySearchPage2")
public Result<?> listBySearchPage(
    @RequestParam(defaultValue = "1") Integer pageNum,
    @RequestParam(defaultValue = "5")Integer pageSize,
    @RequestParam(defaultValue = "") String search
) {
    QueryWrapper<Furn> query = Wrappers.query();
    if (StringUtils.isNotBlank(search)) {
        query.like("name", search);
    }

    Page<Furn> page = furnService.page(new Page<>(pageNum, pageSize), query);
    return Result.success(page);
}
```

测试结果

![image-20240419180140998](SpringBoot%E5%9F%BA%E7%A1%80%E9%A1%B9%E7%9B%AE.assets/image-20240419180140998.png)