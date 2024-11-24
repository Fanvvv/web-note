# docker 中安装 nginx

## 下载镜像

使用命令

```bash
# 下载最新版
docker pull nginx
# 下载需要的版本
docker pull nginx:(xxx版本)
```

![image-20241124192336302](docker%E4%B8%AD%E5%AE%89%E8%A3%85nginx.assets/image-20241124192336302.png)

## 创建 nginx 配置文件

创建 `nginx` 挂载所需的目录或者配置文件

我们可先启动 `nginx` 容器，然后将容器内的静态资源、配置文件、日志等目录或者文件复制到外部挂载的目录或者文件下

### 创建挂载目录

```bash
# 创建挂载目录
mkdir -p /usr/local/nginx_info/conf
mkdir -p /usr/local/nginx_info/log
mkdir -p /usr/local/nginx_info/html
```

![image-20241124195051465](docker%E4%B8%AD%E5%AE%89%E8%A3%85nginx.assets/image-20241124195051465.png)

### 复制配置文件到宿主机

```bash
# 生成容器
docker run --name nginx -p 80:80 -d nginx
```

使用命令进入 nginx 容器，可以找到 nginx 的配置文件，复制配置文件到宿主机

```bash
# 命令行方式进入 nginx 容器
docker exec -it nginx容器ID bash
```

![image-20241124194733210](docker%E4%B8%AD%E5%AE%89%E8%A3%85nginx.assets/image-20241124194733210.png)

```bash
# exit 退出容器命令行
# 将容器nginx.conf文件复制到宿主机
docker cp nginx:/etc/nginx/nginx.conf /usr/local/nginx_info/conf/nginx.conf
# 将容器conf.d文件夹下内容复制到宿主机
docker cp nginx:/etc/nginx/conf.d /usr/local/nginx_info/conf/conf.d
# 将容器中的html文件夹复制到宿主机
docker cp nginx:/usr/share/nginx/html /usr/local/nginx_info/
```

![image-20241124195148509](docker%E4%B8%AD%E5%AE%89%E8%A3%85nginx.assets/image-20241124195148509.png)

## 重新创建 nginx 容器

删除原来的容器：

```bash
# 强制删除
docker rm -f nginx容器ID
```

构建容器，挂载目录并启动：

```bash
docker run \
-p 80:80 \
--name nginx \
-v /usr/local/nginx_info/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /usr/local/nginx_info/conf/conf.d:/etc/nginx/conf.d \
-v /usr/local/nginx_info/log:/var/log/nginx \
-v /usr/local/nginx_info/html:/usr/share/nginx/html \
-d nginx:latest
```

![image-20241124195719797](docker%E4%B8%AD%E5%AE%89%E8%A3%85nginx.assets/image-20241124195719797.png)

## 配置文件

**nginx.conf**：

`nginx` 的主配置文件，主要负责全局块、event块和http基础信息的配置

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;
    include /etc/nginx/conf.d/*.conf;
}
```

:::info 说明

`include /etc/nginx/conf.d/*.conf;`

就是包含 `/etc/nginx/conf.d` 目录下的所有 `.conf` 配置文件

如果我们需要修改或添加配置，编辑宿主机的 `/usr/local/nginx_info/conf/conf.d` 目录下的配置文件即可

:::

**default.conf**：

`nginx` 的默认配置文件，用户可以自定义配置，不配置静态资源部署、反向代理、负载均衡等

```nginx
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

