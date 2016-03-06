## 日省 | Sunshine

一个帮助团队整理每一天工作的瀑布IM扩展。

本质上是一个机器人，每日早晚询问并记录每一个成员的工作情况。

> **日省**读作 Sunshine 喔

## 配置方法

> 所有的配置都在 瀑布IM 中进行。

### 1. 给机器人起名

首先你需要给机器人起一个可爱的名字，在 瀑布IM 团队我们叫他 Hank ～。

### 2. 给频道添加 Command 扩展

给频道添加一个 Command 扩展，并设置 **Command 地址**为 **http://sunshine-pubu.im/command**

> 如果你不会添加扩展，请看这里的指南：http://docs.pubu.im/command.html

### 3. 给频道添加 Outgoing 扩展

给频道添加一个 Outgoing 扩展，设置**触发关键词**为 @Hank，并设置**回调地址**为 http://sunshine-pubu.im/outgoing

> 这里 **Hank** 是机器人的名字，你可以换成你们自己起的名字。

### 4. 添加 Incoming 扩展并配置 Hook URL

给频道添加一个 Incoming 扩展，复制 Incoming 的 Hook URL 然后在聊天界面执行命令：

```
/hank hook [url]
```

例：

```
/hank hook http://myteam.pubu.im/services/kzpmqd9qb3pgtrw
```

### 5. 告诉机器人你们的工作时间段

```
/hank schedule 1030-1800
```

### 6. 叫机器人每天早晚来询问你的工作情况

```
/hank reg
```
