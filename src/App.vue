<template>
  <div id="app">
    <router-view />
    <div class="web">蜀ICP备19034436号</div>
    <div class="bottom" v-show="this.$store.state.showPlayMusic">
      <!-- 播放歌曲 -->
      <audio
        :src="this.$store.state.playMusicMsg.url"
        autoplay
        @ended="end"
        ref="audio"
        @canplay="getTime"
        @timeupdate="updateLyric"
      ></audio>
      <div class="info">
        <!-- 歌词显示 -->
        <div class="lyrics" v-show="showLyric">
          <ul :style="styles">
            <li v-for="(item,index) in lyricArr" :key="index">{{item}}</li>
          </ul>
        </div>
        <!-- 歌曲信息 -->
          <div class="musicMsg imgRotate" :class="{'pausedRotate':isImgRotate}" >
            <img :src="this.$store.state.playMusicMsg.imgUrl"  />
          </div>
        <!-- 歌名以及歌手 -->
        <div class="author">
          <p>{{this.$store.state.playMusicMsg.name}} - {{this.$store.state.playMusicMsg.author}}</p>
        </div>
        <!-- 进度条 -->
        <div class="progress">
          <span class="left">{{ this.$store.state.playMusicTime.currentTime }}</span>
          <!-- <div class="line">
            <div class="outline" :style="this.$store.state.playMusicTime.progressWidth"></div>
          </div> -->
          <el-slider width="200px" v-model="musicProgress" :show-tooltip="false" @change="updatePosition"></el-slider>
          <span class="right">{{ this.$store.state.playMusicTime.totalTime }}</span>
        </div>
        <div class="btns">
          <!-- 上一曲 -->
          <i class="fa fa-step-backward" aria-hidden="true" @click="lastSong"></i>
          <!-- 播放按钮 -->
          <i
            class="fa fa-play-circle-o"
            aria-hidden="true"
            v-show="this.$store.state.showPlayBtn"
            @click="audio('play')"
          ></i>
          <!-- 暂停播放 -->
          <i
            class="fa fa-pause-circle-o"
            aria-hidden="true"
            v-show="!this.$store.state.showPlayBtn"
            @click="audio('pause')"
          ></i>
          <!-- 下一曲 -->
          <i class="fa fa-step-forward" aria-hidden="true" @click="end"></i>
          <!-- 音量调节 -->
          <i class="fa fa-volume-up voice" aria-hidden="true">
            <div class="block">
              <el-slider class="voiceSlider"
              v-model="value"
              vertical
              height="80px"
              @input="updateVoice">
            </el-slider>
            </div>
          </i>
          <!-- 歌词按钮 -->
          <i class="lyric" :class="{'bgc':showLyric}" @click="showLyricBtn" >词</i>
          <!-- 退出 -->
          <i class="fa fa-times" aria-hidden="true" @click="hidePlayMusic"></i> 
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
// 导入 axios
import axios from "axios";

import { mapState, mapMutations } from "vuex";
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);

const address = "http://v2.janulog.com:80";
export default {
  name: "App",
  data() {
    return {
      id: 0, // 网易云用户id
      timeArr: [], // 时间数组
      lyricArr: [], // 歌词数组
      lyricLine: 0, //记录歌词显示的行数
      styles: "transition: none ;transform:translateY(-0px)",
      showLyric: false, // 是否显示歌词
      value: 50,// 音量大小
      musicProgress: 0,
      isImgRotate: false,// 图片是否旋转
      
    };
  },
  created() {
    // 进入页面,先登录网易云音乐
    axios
      .post(address + "/login/cellphone", {
        phone: 18383030041,
        password: "cy641578178"
      })
      .then(res => {
        if (res.data.code === 200) {
          // console.log(res);
          // 登录成功
          // 获取当前用户id
          this.id = res.data.account.id;
          // 将当前用户id 存在vuex中
          this.sendUserId(this.id);
        } 
      });
  },
  methods: {
    // 获取用户id
    ...mapMutations({
      sendUserId: "getUserId"
    }),
    // 暂停播放且隐藏播放界面
    hidePlayMusic() {
      this.$store.commit('updateMusicBtn',false)
      // this.$store.state.showPlayBtn = true
      this.audio('paused')
      this.$store.commit('updatePlayMusic',false)
    },
    // 播放完成
    end() {
      // 获取当前播放歌曲的id
      const id = this.$store.state.playMusicMsg.id;
      // 获取下一首歌曲 index
      let index = this.$store.state.playlist.indexOf(id) + 1;
      // 调用封装好的方法,播放下一首歌曲
      // 1 为标记下一曲
      if(this.$store.state.playlist[index]) {

        this.musicCanPlay(this.$store.state.playlist[index], 1);
      }else {
        return
      }
    },
    // 加载完成,获取播放时间以及进度条
    getTime() {
      // 获取dom元素
      const audio = this.$refs.audio;
      // 显示播放界面
      this.$store.commit('updatePlayMusic',true)
      // 将按钮置为已播放
      this.$store.commit('updateMusicBtn',false)
      // 先将歌词行数置为 0,否则会有回滚效果
      this.lyricLine = 0;
      // 获取歌词
      this.getLyric();
      // 获取总时间以及当前播放时间
      this.musicTime(audio);
    },
    // 点击上一曲
    lastSong() {
      // 获取当前播放音乐id
      const id = this.$store.state.playMusicMsg.id;
      //  获取当前播放音乐 index
      let index = this.$store.state.playlist.indexOf(id);

      // 判断index
      if (index === 0) {
        // 上一曲为列表最后一曲
        // 0 为标记上一曲
        this.musicCanPlay(
          this.$store.state.playlist[this.$store.state.playlist.length - 1],
          0
        );
      } else {
        // 上一曲
        this.musicCanPlay(this.$store.state.playlist[index - 1], 0);
      }
    },
    // 播放暂停功能
    audio(data) {
      if(data === "play") {
        this.$refs.audio.play()
        this.isImgRotate = false
        this.$store.commit('updateMusicBtn',false)
      }else {
        this.$refs.audio.pause();
        this.isImgRotate = true
        this.$store.commit('updateMusicBtn',true)
      }
    },
    // 获取歌词功能
    getLyric() {
      let id = this.$store.state.playMusicMsg.id;
      axios.get(address + `/lyric?id=${id}`).then(res => {
        let lyric = res.data.lrc.lyric;
        this.handleLyric(lyric);
      });
    },
    // 封装一个处理歌词的方法
    handleLyric(lyr) {
      let arr = lyr.split("]");
      let newArr = [];
      arr.forEach((item, index) => {
        newArr.push(arr[index].split("[")[0]);
        newArr.push(arr[index].split("[")[1]);
      });
      newArr.splice(0, 1);
      newArr.splice(newArr.length - 1, 1);
      // console.log(newArr);
      let tArr = []; // 时间数组
      let lArr = []; // 歌词数组
      newArr.forEach((item, index) => {
        index % 2 === 0 ? tArr.push(item) : lArr.push(item);
      });

      let newTArr = [];
      // 将tArr 数组转换为时间形式
      tArr.forEach((item, index) => {
        let mins = parseInt(item[0] + item[1]) * 60 * 1000;
        let secs = parseInt(item[3] + item[4]) * 1000;
        let mills = parseInt(item[6] + item[7] + item[8]);

        let time = mins + secs + mills;
        newTArr.push(time); // 最终 的歌词数组
      });
      // 将两个数组保存
      this.timeArr = newTArr;
      this.lyricArr = lArr;
    },
    // 同步更新歌词
    updateLyric() {
      if(/\d/.test(this.$store.state.playMusicTime.progressWidth)) {
        this.musicProgress = this.$store.state.playMusicTime.progressWidth
      }
      // console.log(1);
      // 获取当前currentTime
      let currentTime = this.$refs.audio.currentTime;

      // 处理currentTime
      let currentInt = Math.floor(currentTime);
      let currentFloat = Math.floor((currentTime - currentInt) * 1000);

      let newCurrentTime = currentInt * 1000 + currentFloat;
      if (this.timeArr != []) {
        for (let i = 0; i < this.timeArr.length - 1; i++) {
          if (
            this.timeArr[i] < newCurrentTime &&
            this.timeArr[i + 1] > newCurrentTime
          ) {
            this.lyricLine = i;
          }
        }
      }
    },
    // 显示歌词功能
    showLyricBtn() {
      if (this.showLyric) {
        this.showLyricBtnStyle = "backgroud-color: #fff";
      } else {
        this.showLyricBtnStyle = "backgroud-color: #b82525";
      }
      this.showLyric = !this.showLyric;
    },
    // 调节音量大小
    updateVoice() {
      this.$refs.audio.volume = this.value / 100
    },
    // 改变播放位置
    updatePosition(pos) {
      // 获取总时长
      
      const totalTime = this.$refs.audio.duration
      const currentTime = pos / 100 * totalTime
      this.musicProgress = parseInt(currentTime / totalTime * 100)
      this.$refs.audio.currentTime = currentTime
    },
  },
  watch: {
    // 监听歌词变化
    lyricLine(newVal, oldVal) {
      
      if (this.lyricLine === 0) {
        this.styles = "transition: none ;transform:translateY(-0px)";
      } else {
        this.styles =
          "transition: all 1s;transform:translateY(-" +
          this.lyricLine * 60 +
          "px)";
      }
    },
  }
};
</script>
<style>

@keyframes rotate {
      0% {
        transform: rotateZ(0deg)
      }
      100% {
        transform: rotateZ(360deg)
      }
    }
.imgRotate {
  animation: rotate linear 10s infinite;
}
.pausedRotate {
  animation-play-state: paused
}
#app {
  width: 100%;
  height: 100%;
}
#app .bottom {
  width: 100%;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  bottom: 0;
}
.bottom .info {
  width: 980px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  user-select: none;
}
.info .lyrics {
  width: 600px;
  height: 60px;
  position: absolute;
  overflow: hidden;
  left: 50%;
  transform: translateX(-50%);
  bottom: 64px;
  border-radius: 25px;
}
.info .lyrics ul,
.info .lyrics li {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  width: 600px;
}
.info .lyrics li {
  width: 100%;
  height: 60px;
  color: #b82535;
  text-align: center;
  font-size: 20px;
  line-height: 60px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.bgc {
  background-color: #b82535;
}
.info .musicMsg {
  width: 60px;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
}
.info .musicMsg img {
  width: 100%;
  border-radius: 50%;
  
}
.info .author {
  width: 200px;
  height: 100%;
  position: absolute;
  left: 60px;
  text-align: center;
}
.info .author p {
  margin: 0;
  padding: 0;
  line-height: 60px;
  color: #fff;
  font-size: 16px;
}
.info .progress {
  width: 450px;
  height: 100%;
  line-height: 60px;
  position: absolute;
  right: 90px;
}
.progress .el-slider {
  width: 350px !important;
  top: 12px;
  left: 50px;
}
.progress .el-slider .el-slider__button {
  width: 12px;
  height: 12px;
  border: none;
  background-color: #b82535;
}
.progress .el-slider .el-slider__runway {
  height: 4px;
}
.progress .el-slider .el-slider__bar {
  height: 4px;
  background-color: #b82535;
}

.progress .right {
  position: absolute;
  right: 0;
}
.progress span {
  color: #fff;
}
.info .btns {
  height: 60px;
  line-height: 60px;
  position: absolute;
  left: 270px;
  top: 0;
}
.bottom .fa-times {
  position: absolute;
  right: -530px;
  top: 20px;
}
.bottom .btns i {
  margin-right: 8px;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}
.bottom .el-slider {
  z-index: 20;
  position: absolute;
  bottom: 100px;
}
.bottom .btns i:hover {
  color: #b82525;
}
.bottom .btns .lyric {
  display: inline-block;
  font-style: normal;
  width: 20px;
  height: 20px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin-left: 8px;
  color: #fff;
}
.bottom .btns .lyric:hover {
  background-color: #b82525;
  color: #000;
}
.voice:hover .block {
  display: block;
}
.voice .block {
  display: none;
  width: 20px;
  height: 110px;
  background-color: rgba(255,0,0,.1);
  border-radius: 10px;
  position: absolute;
  left: 77px;
  top: -65px;
}
.voice .voiceSlider {
  position: absolute;
  right: 8px;
  top: 8px;
}
.voiceSlider .el-slider__bar,
.voiceSlider .el-slider__runway {
  width: 4px !important;
}
.voiceSlider .el-slider__button {
  width: 10px;
  height: 10px;
  border: none;
  background-color: #b82525;
}
.voiceSlider .el-slider__bar {
  background: #b82525;
}
.voiceSlider .el-slider__button {
  margin-right: 2px;
}
#app .web {
  position: fixed;
  bottom: 0;
  right: 0;
  color: #ccc;
  font-size: 12px;
  padding-right: 40px;
}

</style>
<style>
@import "./assets/css/common.less";
</style>
