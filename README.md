# ENOLA · 24 — A private pressing

一张可以听见的私人生日唱片。原生 HTML / CSS / JavaScript，无需构建、无需安装依赖，无后台、无追踪、无外部 CDN。首屏保留姓名、黑胶和「跳入漩涡，然后彼此拥抱」，向下滑动发现语音与生日信。

正式网页：**https://sero417.github.io/enola-record/**。NFC Tools 的 URL / URI 记录填写这个地址。仓库：https://github.com/Sero417/enola-record 。发布来源为 `main` 分支根目录；后续推送会触发自动更新。

## 本地预览

安装 Node.js 后，在项目目录运行：

```sh
node scripts/serve.mjs
```

打开 <http://127.0.0.1:4173>。关闭时在终端按 Ctrl+C。本机地址不能写入送出的 NFC 贴纸；手机应使用部署后的 HTTPS 链接。不要直接双击 index.html，浏览器会限制 file 协议下的 JavaScript 模块。

## 放入真实录音

当前已将你提供的 `人质.wav` 在本地转为 `public/audio/enola.mp3`，播放器已切换为 MP3。采用 128 kbps 双声道，时长约 1 分 34 秒，文件约 1.51 MB，比原 WAV 减少约 94%。原始 `人质.wav` 与 `public/audio/enola.wav` 备份均保留，不被播放器请求。之后直接替换同名 MP3 即可。MP3 为有损压缩，未调整音量或裁剪内容。

将你的录音命名为 `enola.mp3`，放到 **`public/audio/enola.mp3`**。这是实际静态目录，不需要打包工具处理。推荐使用真正编码为 MP3 的文件，不要只把其他格式改后缀。

默认路径已配置。替换同名 MP3 后，播放器代码无需改动；部署时提交新文件，等待 Pages 更新后刷新页面。若浏览器仍缓存旧版本，可在 `js/config.js` 的路径末尾加版本号，例如 `./public/audio/enola.mp3?v=2`。

如使用其他文件名或音频格式，在 `js/config.js` 修改 `audioSrc`，保留开头的 `./`。尚未提供录音时，网页会显示友好提示和重新加载按钮，不会模拟播放。真实录音没有包含在首版中。

## 修改文字和样式

姓名、年龄、副标题、核心句、生日信、彩蛋和音频路径集中在 **`js/config.js`**。中文信中的 `\n` 表示换行。年龄相关的英文副标题、中文祝福可分别修改；修改姓名后同时检查称呼文字。个人内容通过 textContent 渲染，无需写 HTML。

颜色、字体在 `styles.css` 顶部 `:root`；不加载网络字体，英文使用系统衬线字体，中文使用系统无衬线字体，因此不同设备字形会略有不同。首屏优先占满一屏，小屏或大字号时允许纵向滚动，避免裁切文字。

## 文件结构

```text
index.html                  页面与可访问性结构
styles.css                  唱片纹理、排版、响应式与减少动态效果
js/config.js                个人文案与音频路径
js/app.js                   文案绑定与中心标签彩蛋
js/player.js                HTML5 Audio、状态、时间与进度
assets/favicon.svg          唱片图标
assets/grain.svg            轻微纸张颗粒
public/audio/enola.mp3      你需要补充的真实录音
scripts/serve.mjs           本地预览，支持音频 Range 请求
.nojekyll                   GitHub Pages 静态文件标记
package.json                可选 npm 快捷命令，无依赖
TESTING.md                  已验证内容与实际设备验收项
```

## 部署到 GitHub Pages

以下使用无需付费服务的公开仓库方式。网页可以不被搜索引擎索引，但**没有密码保护**；公开仓库及知道网址的人可以访问、保存音频。`noindex` 只是搜索提示，不是访问控制。

1. 登录 GitHub，点击右上角 **+ → New repository**。名称可用 `enola-record`，选择 **Public**，创建仓库。
2. 在仓库选择 **Add file → Upload files**，上传 `index.html`、`styles.css`、`js/`、`assets/`、`public/` 中的文件及 README 等。确认 index.html 在仓库根目录，不能多套一层项目文件夹。提交到 `main`。
3. GitHub 网页上传可能忽略隐藏文件，用 **Add file → Create new file** 创建根目录 `.nojekyll`，内容可写一行注释。确认 `public/audio/enola.mp3` 已上传；网页单文件上传大小有限，较大录音请压缩或使用 Git。
4. 进入 **Settings → Pages → Build and deployment**。Source 选 **Deploy from a branch**，Branch 选 **main**、目录选 **/(root)**，点击 **Save**。
5. 等待发布完成。Pages 设置页会显示正式地址，通常是 `https://你的用户名.github.io/enola-record/`。如果失败，在 **Actions** 查看 Pages 构建结果。
6. 在 Settings → Pages 确认 HTTPS 可用，启用 **Enforce HTTPS**（若该选项可选）。使用显示的 HTTPS 链接。
7. 在安卓 Chrome 与 iPhone Safari 打开该网址，手动点击播放，验证时长、暂停、拖动和重播。还可以打开 `https://你的用户名.github.io/enola-record/public/audio/enola.mp3` 检查录音文件是否可直接播放。

所有网页资源使用相对路径，可兼容上面的仓库子路径，无需修改 base URL。无需 npm install 或构建步骤。

若使用 Git 上传，可在空仓库页面的指引基础上执行（将 URL 换成自己的仓库）：

```sh
git init
git add .
git commit -m "Create ENOLA birthday record"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/enola-record.git
git push -u origin main
```

部署步骤参考 [GitHub 官方 Pages 发布源说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 把链接写入 NFC 贴纸

准备支持 NDEF URL 的可写 NFC 标签（如 NTAG213）和支持 NFC 的手机。**只写最终 HTTPS 网页 URL，不写录音文件，也不写本机预览地址。**

1. 在安卓手机开启 NFC，安装并打开 **NFC Tools（Wakdev）**。
2. 进入 **Write / 写入 → Add a record / 添加记录 → URL / URI**。
3. 填入 Pages 完整 HTTPS 地址，确认没有重复 `https://`。
4. 保存该记录，点击 **Write / 写入**，把贴纸靠近手机 NFC 感应位置，等待成功提示。
5. 在 **Read / 读取** 页检查写入记录的地址与正式网址完全一致。测试前不要将标签永久锁定。
6. 使用**另一部**支持 NFC 的手机，亮屏、解锁并开启 NFC，贴近标签。按系统出现的链接通知打开浏览器，点击播放按钮试听。验证手机不安装 NFC Tools 也能打开网页。

参考 [Wakdev 官方 URL 写入教程](https://www.wakdev.com/en/knowledge-base/how-to-guides/how-to-write-a-link-url-on-an-nfc-chip.html)。

收礼人无需安装网页 App；写入 NFC Tools 的操作只需要送礼人完成。iPhone XS 及后续支持后台标签读取的机型可读出 URL 并提示打开，实际使用还受设备状态和系统限制影响，见 [Apple 官方后台标签读取说明](https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading)。其他机型请核实原生 NFC URL 读取支持；不要将“具备 NFC”理解为所有机型体验完全一致。

本项目没有离线缓存：**首次访问、加载网页及音频需要联网**，NFC 本身不提供网络。替换录音或文字后，只要网页地址不变，无需重写贴纸。

## 功能与验证边界

真实 HTML5 Audio 播放、暂停、时长、可拖动进度、缓冲与错误提示；播放事件驱动唱片旋转和唱针移动，暂停保留角度；播放结束可重听；中央标签显示 4.5 秒彩蛋；支持键盘、读屏标签、安全区与 prefers-reduced-motion。

已在桌面内嵌浏览器使用临时 WAV 测试音检查真实播放流程，并检查 360 / 390 / 430px 布局。测试音不用于正式网页。正式录音现使用约 1.51 MB 的 MP3；源 WAV 为双声道、48 kHz、24 bit PCM，约 27 MB。GitHub Pages 已发布。MP3 转码后逐帧检查通过，时长与原录音一致（编码填充约 0.03 秒）。实际录音听感、安卓 Chrome、iPhone Safari、实体手机安全区与 NFC 贴纸仍需按 `TESTING.md` 实测。


## 2026-10-29 唱针交互版

首屏保留，原下方播放器段落和生日信已移除。用鼠标或手指拖动唱针，角度限制为 -13°～30°；松手时角度达到 2° 即播放，拨回则暂停。键盘方向键也可操作，Home 抬针，End 落针。旋转仅随真实音频播放状态启动。

点击唱片中心打开歌词层，关闭或按 Escape 回到唱片，音频保持当前状态。歌词层含播放/暂停和进度控制。

在 `js/lyrics-data.js` 编辑 `{ time: 秒数, text: '歌词' }`，保持时间升序。目前只有占位文本，不含《人质》原歌词。可提供自己的歌词文件再替换并校准。


### 唱针限位更新

针头向内的终点按当前唱片尺寸计算：针头刚刚完整进入红色标签即停止，不再进入中心。播放期间允许拨动，只有拨回最外侧 -13° 底端才暂停；中间位置继续播放。歌词层也可以暂停。主句更新为「相互拥抱，然后跳进漩涡。」。

## 唱片内页视觉更新（2026-10-29）

首页主句使用本机宋体字体并分为两行；首次真实播放后，「轻拨唱针」提示淡出。歌词层采用暖纸色、居中排版和当前行高亮，仍使用 js/lyrics-data.js 中的占位文本与示例时间轴，可逐行替换。正常播放说明隐藏，但加载与错误信息仍显示。

## 透明歌词与手机一屏布局（2026-10-29）

主句恢复原来的无衬线字体，保留两行。歌词界面使用透明背景及暗色模糊遮罩，当前行高亮、相邻行淡化，后方唱片可见。手机首页按可视高度缩放唱片与留白；歌词页固定在可视高度内，仅歌词区滚动。
