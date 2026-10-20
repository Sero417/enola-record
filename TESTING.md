# 验证记录

日期：2026-10-20。

## 已完成

- Node.js 语法检查：app.js、config.js、player.js、serve.mjs。
- 本机 HTTP 服务器和内嵌浏览器加载实际页面。
- 没有正式音频时显示提示、禁用进度条，旋转保持静止。
- 临时 12 秒 WAV 通过真实 HTML5 Audio 加载到 0:12，点击播放后真实时间更新，按钮切换暂停。
- 点击暂停后播放状态和唱片运行状态移除，拖动到 50% 显示 0:06。
- 拖至尾部恢复播放后触发 ended，显示重播按钮；重新播放回到 0:00。
- 中心标签显示彩蛋，独立于播放器操作。
- 360、390、430px 视口检查：文档 scrollWidth 不大于 clientWidth。修复唱针变换引起的横向溢出。
- 录音配置恢复为 ./public/audio/enola.mp3，首版不附示范录音。
- 正式录音缺失时点击重新加载与播放均能显示失败提示，不进入播放状态。
- 1280px 桌面布局检查通过；最终本机页面 HTTP 返回 200。
- 截图保存于 artifacts/enola-first-screen.jpg 和 artifacts/enola-mobile.jpg（不参与部署）。

## 送出前需实际验证

1. 放入真正的 MP3，确认完整时长、音量与录音内容。
2. 在 Android Chrome、iPhone Safari 真机测试播放、暂停、拖动、播放结束与重播。
3. 在真实手机上检查刘海和底部安全区、横竖屏、大字号、减少动态效果。
4. 测试慢网、断网、重新联网后的重新加载；来电或切换应用打断播放后应可继续。
5. GitHub Pages HTTPS 正式网址与音频文件都能访问，子路径内无 404（缺少正式 MP3 时的预期 404 除外）。
6. 将正式 URL 写入 NFC，用另一部不装 NFC Tools 的手机读取并试听。

本记录中的响应式视口测试不等同于真实手机或 NFC 测试。当前浏览器验证使用 WAV，实际录音的 MP3 编码兼容性需补充验证。

## 正式录音与发布

- 正式录音：`public/audio/enola.wav`，27,211,820 字节；读取 WAV 头确认双声道、48 kHz、24 bit PCM，时长 94.49 秒。没有替换或改动录音内容。
- 网页与音频已上传到 `Sero417/enola-record` 的 main 分支；根目录原始 WAV 与 artifacts 目录未上传。
- GitHub Pages 来源：main /；HTTPS 已开启；首次构建状态为 built。
- 正式页面 `https://sero417.github.io/enola-record/` 返回 200，包含 ENOLA 标题；正式 WAV 的 HTTPS HEAD 请求返回 200。
- 本轮浏览器控制接口连续超时，未能完成正式网址上的浏览器试听；需要用户真机确认声音、音量与 NFC 读取。
