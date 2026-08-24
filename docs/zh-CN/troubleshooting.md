---
title: 疑难排解
description: 诊断常见的 SoFinder 路由、授权、上传、图片、存储与部署问题。
---

# 疑难排解

## 文件浏览器路由返回 404

确认 Bundle 已注册且路由资源已导入：

```bash
bin/console debug:router | grep sofinder
```

导入路由的前缀决定公开 URL。保留作兼容用途的 `so_finder.route_prefix` 配置不能取代路由导入。

## 文件浏览器返回 401 或 403

- 确认请求由已验证用户的 Symfony firewall 处理。
- 检查资源的 `roles`、`operation_roles` 与 `path_acl`。
- 请记住，适用的 deny 规则优先于 allow。
- 前端显示的 capability 仅供参考；服务器会再次授权最终操作与路径。

## 上传遭到拒绝

依序检查：

1. PHP／Web Server 的 request body 大小与 timeout 限制。
2. 资源的 `max_size`、扩展名及 MIME allowlist。
3. 文件名长度与目的地文件夹深度。
4. 资源 quota 与文件系统可用空间。
5. 隔离区、分段上传、存储与用量目录的写入权限。
6. 审计记录是否有主动式内容或解码后图片遭拒绝的信息。

## 图片没有预览或编辑器

```bash
bin/console sofinder:image:capabilities
```

安装具备所需 coder 的 GD 或 Imagick，再重新启动 PHP 执行环境。HEIC、HEIF 与 TIFF 可存储在一般文件资源中，但刻意不提供浏览器预览或编辑。详见[图片格式](/zh-CN/image-formats)。

## 未验证即可存取私有文件

`delivery_mode: public` 会刻意略过 SoFinder 的读取授权。请将存储根目录移至 Web 根目录以外、移除 Web Server alias、清空 `public_url`，并改用 `delivery_mode: proxy`。

## 产生的链接使用错误前缀

Symfony 导入路由的前缀才是最终依据。修正 `config/routes/so_finder.yaml`，再清除正式环境的路由与应用程序缓存。

## 外部导入后 quota 不正确

```bash
bin/console sofinder:usage:recalculate
```

重新计算期间，不要从 SoFinder 以外修改受管理的存储空间。

## S3 兼容供应商连线失败

- 除非是明确受信任的本机 MinIO 网络，否则请使用 HTTPS。
- 分别确认 region、endpoint 与 bucket。
- MinIO 启用 path-style endpoint；AWS S3、R2 与 B2 通常保持停用。
- Cloudflare R2 使用 `region: auto`。
- 若供应商不支持有条件的 Put Object，只有在接受文件所述的并行建立竞争后，才配置 `conditional_writes: false`。
- 使用软件包的供应商 smoke test、非正式环境 bucket，以及限制前缀的凭证。

## 收集有用的诊断信息

请提供版本、移除机密后的有效配置、路由输出、失败操作及相关应用程序记录。切勿在公开 issue 贴上凭证、签署 URL、session 识别码或私有文件内容。安全漏洞请通过 [GitHub 私密漏洞报告](https://github.com/sohophp/sofinder/security/advisories/new)通报。
