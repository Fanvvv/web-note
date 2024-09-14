# yum update 报错

报错信息：

```bash
Cannot find a valid baseurl for repo: centos-sclo-rh/x86_64
```

报错原因：

CentOS7的SCL源在2024年6月30日停止维护了。
当scl源里面默认使用了centos官方的地址，无法连接，需要替换为阿里云。

解决办法：

`cd /etc/yum.repos.d/` 将 `CentOS-SCLo-scl` 和 `CentOS-SCLo-scl-rh` 里的 `http://mirror.centos.org` 替换为 `https://mirrors.aliyun.com`，并注释 mirrorlist，解除 baseurl 的注释

比如：

```bash
# baseurl=http://mirror.centos.org/centos/7/sclo/$basearch/sclo/
mirrorlist=http://mirrorlist.centos.org?arch=$basearch&release=7&repo=sclo-sclo
```

改为阿里云镜像

```bash
baseurl=https://mirrors.aliyun.com/centos/7/sclo/$basearch/sclo/
# mirrorlist=http://mirrorlist.centos.org?arch=$basearch&release=7&repo=sclo-sclo
```

