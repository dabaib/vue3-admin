---
description: 同时启动 MySQL (Docker)、Java 后端 (Spring Boot) 和前端 (Vite) 三个服务
---

// turbo-all

1. 启动 MySQL Docker 容器
```bash
docker start vue3-admin-mysql
```

2. 启动 Java 后端（Spring Boot）
```bash
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot"; Set-Location "C:\Users\99513\Desktop\AI\vue3-admin-backend"; & "$env:USERPROFILE\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
```

3. 启动前端开发服务器 (Vite)
```bash
if (!(Test-Path node_modules)) { npm install }; npm run dev
```
