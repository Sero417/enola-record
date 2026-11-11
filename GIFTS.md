# 七份礼物与歌曲

同一套页面提供七个独立网址，每份 NFC 贴纸写入对应链接。礼物动画和唱片交互共用，音频文件互相独立。原塔罗牌版本仍可通过不带 gift 参数的根网址访问。

| 礼物 | 网页链接 | 歌曲文件位置 |
|---|---|---|
| 木梳 | https://sero417.github.io/enola-record/?gift=comb | public/audio/comb.mp3 |
| 双猫挂件 | https://sero417.github.io/enola-record/?gift=cats | public/audio/cats.mp3 |
| 两顶帽子 | https://sero417.github.io/enola-record/?gift=hats | public/audio/hats.mp3 |
| 穿戴甲 | https://sero417.github.io/enola-record/?gift=nails | public/audio/nails.mp3 |
| 娃娃 | https://sero417.github.io/enola-record/?gift=doll | public/audio/doll.mp3 |
| 信纸 | https://sero417.github.io/enola-record/?gift=letter | public/audio/letter.mp3 |
| 企鹅亲亲 | https://sero417.github.io/enola-record/?gift=kiss | public/audio/kiss.mp3 |

歌曲准备好后将 MP3 放在上表对应位置，提交并发布即可，不需要修改播放器逻辑。当前没有添加占位音频，不会播放原塔罗版本的歌曲。缺少录音时会显示歌曲准备中提示。

礼物配置集中在 js/variants.js，图片位于 assets/gifts/。信纸正文尚未提供，当前只有称呼、信纸横线和署名；亲亲采用两只小企鹅靠近的循环动画，支持减少动态效果偏好。

实物素材根据用户提供图片制作透明抠图；帽子两顶为一组、猫猫两个挂件为一组。未进行真实 NFC 贴纸测试。
