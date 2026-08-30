---
layout: home
markdownStyles: false
title: SoFinder 文件
titleTemplate: PHP 与 Symfony 安全文件管理
description: 安装、配置及扩充适用于 PHP 8.1–8.5 和 Symfony 6.4/7.4 的 SoFinder。

hero:
  name: 安全的文件管理
  text: 面向 PHP 与 Symfony
  tagline: MIT 许可，支持本机与 S3 兼容存储、细致权限控制、可靠上传及图片工具。
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
    icon: { src: /feature-security.svg, alt: '' }
    details: 路径沙箱、私有隔离区、CSRF 保护、继承式 ACL 与操作门禁。
    link: /zh-CN/security
    linkText: 了解安全设计
  - title: 完整文件浏览器
    icon: { src: /feature-browser.svg, alt: '' }
    details: 响应式文件浏览器，支持目录、预览、搜索、拖放、批量操作与回收站。
    link: /zh-CN/cms-user-guide
    linkText: 内容编辑快速入门
  - title: 弹性存储
    icon: { src: /feature-storage.svg, alt: '' }
    details: 支持本机存储及 AWS S3、Cloudflare R2、MinIO 等 S3 兼容存储。
    link: /zh-CN/storage-adapters
    linkText: 比较存储方案
  - title: 适合框架集成
    icon: { src: /feature-framework.svg, alt: '' }
    details: Symfony Bundle、公开 PHP 契约、事件、Tagged Service 与可扩展 API。
    link: /zh-CN/developer-guide
    linkText: 集成 SoFinder
  - title: 面向真实应用
    icon: { src: /feature-ready.svg, alt: '' }
    details: 图片处理、可靠上传、Picker 模式、稳定资产 ID 与私有交付。
    link: /zh-CN/image-guide
    linkText: 探索产品能力
  - title: 适合正式环境
    icon: { src: /feature-operations.svg, alt: '' }
    details: 配额、分页、限流、维护命令与部署时安全审计。
    link: /zh-CN/production
    linkText: 生产环境运维
---

## 安装

```bash
composer require sohophp/sofinder-symfony:^1.1
```

现有应用可以继续使用兼容 Meta Package `sohophp/sofinder:^1.1`；两个包名都公开相同的
namespace。接着注册 Bundle、导入路由并建立至少一个存储资源。请从
[安装与快速开始](/zh-CN/getting-started)开始，完整选项可参考[配置参考](/zh-CN/configuration)。

::: tip 正式支持的框架版本线
Symfony 6.4／7.4、Laravel 12／13 与共享 PSR-15 Host 均是正式支持的 Full-stack
集成。Laravel、Slim、Mezzio 和纯 PHP 的可执行接入步骤见[框架集成指南](/zh-CN/framework-integrations)，
具体 PHP 8 组合见[框架支持策略](/zh-CN/framework-support)。PHP 8 主线绝不为
PHP 7.2 降级；Legacy 可行性始终独立评估。
:::

在 CMS 中使用 SoFinder？请先阅读 [CMS 内容编辑者指南](/zh-CN/cms-user-guide)。
需要了解全部文件操作时，继续阅读[完整文件管理器指南](/zh-CN/user-guide)和
[图片管理](/zh-CN/image-guide)。开发集成请查看[开发者指南](/zh-CN/developer-guide)及
[HTTP API 参考](/zh-CN/api-reference)。
