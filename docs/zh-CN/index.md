---
layout: home
title: SoFinder 文件
titleTemplate: PHP 与 Symfony 安全文件管理
description: 安装、配置及扩充适用于 PHP 8.2–8.5 和 Symfony 6.4/7.4 的 SoFinder。

hero:
  name: SoFinder
  text: PHP 与 Symfony 安全文件管理
  tagline: 支持本机与 S3 兼容存储、细致权限、可靠上传及图片工具的 MIT 授权文件管理器。
  image:
    src: /logo.svg
    alt: SoFinder 标志
  actions:
    - theme: brand
      text: 开始使用
      link: /zh-CN/getting-started
    - theme: alt
      text: Symfony 整合
      link: /zh-CN/symfony
    - theme: alt
      text: GitHub
      link: https://github.com/sohophp/sofinder

features:
  - title: 以安全为设计核心
    details: 路径沙箱、私有隔离区、CSRF 保护、继承式 ACL、操作门禁及有界图片与压缩文件处理。
  - title: 完整文件浏览器
    details: 搜索、上传、文件夹、复制移动、回收站、图片编辑及 CKEditor 整合。
  - title: 弹性存储
    details: 使用本机存储，或通过可选软件包连接 AWS S3、Cloudflare R2、MinIO 等兼容服务。
  - title: 适合正式环境
    details: 配额、分页、请求限制、调度维护命令、部署安全审计及 public/proxy delivery。
---

## 安装

```bash
composer require sohophp/sofinder:^0.1@beta
```

接着注册 Bundle、导入路由并建立至少一个存储资源。请从[安装与快速开始](/zh-CN/getting-started)开始，完整选项可参考[配置参考](/zh-CN/configuration)。

::: warning Beta 版本
SoFinder 当前是公开 Beta。请明确指定 Beta 版本条件，升级前阅读[更新日志](/zh-CN/changelog)及[升级指南](/zh-CN/upgrading)。
:::
