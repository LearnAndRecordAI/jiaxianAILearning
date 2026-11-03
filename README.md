# 稼先 AI 学习频道 Demo

Vue 3 + TypeScript + Vite 纯前端演示，包含基础、应用、开发、前沿四类资源。

## 运行

建议使用 Node.js 22 LTS。

```bash
npm ci
npm run dev -- --port 5174
```

访问 http://localhost:5174/ 。验证命令：`npm test`、`npm run build`。

## 功能及边界

- 分类搜索、热门趋势、收藏分享、响应式布局和明暗主题。
- 我的学习：月度累计签到、成长任务、学习时长、已学合集。
- 今日及本月排行榜、奖励规则。

用户状态保存在浏览器 localStorage；排行榜含模拟数据，积分与奖品不会实际发放。播放器为交互演示，不代表原站真实播放；尚无服务端、SSO、真实计时或积分系统。

资源数据：`src/data/resources.ts`；封面：`src/assets/covers`。第三方课程、封面及商标权利归原权利人所有，本仓库不提供第三方视频再分发授权。不包含下载视频、原始表格、内部文档或旧仓库历史。

Cloudflare Pages 在线预览无需密码，任何获得链接的人都可以访问。不要将密码或其他敏感资料提交到 Git。

部分维护脚本需要外部原始资料，运行 Demo 无需这些资料；可以直接编辑资源数据。Python 导入脚本需另装 openpyxl。
