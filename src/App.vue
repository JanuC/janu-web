<template>
  <div id="app">
    <router-view/>
    <div class="bottom">
      <!-- 播放歌曲 -->
      <audio :src="this.$store.state.playMusicMsg.url" autoplay @ended="end" ref="audio" @canplay="getTime" @timeupdate="updateLyric"></audio>
      <div class="info">
        <!-- 歌曲信息 -->
        <div class="musicMsg">
          <img :src="this.$store.state.playMusicMsg.imgUrl">
        </div>
        <!-- 歌名以及歌手 -->
        <div class="author">
          <p>{{this.$store.state.playMusicMsg.name}} - {{this.$store.state.playMusicMsg.author}}</p>
        </div>
        <!-- 进度条 -->
        <div class="progress">
          <span>{{ this.$store.state.playMusicTime.currentTime }}</span>
          <div class="line">
            <div class="outline" :style="this.$store.state.playMusicTime.progressWidth"></div>
          </div>
          <span>{{ this.$store.state.playMusicTime.totalTime }}</span>
        </div>
        <div class="btns">
          <!-- 上一曲 -->
          <i class="fa fa-step-backward" aria-hidden="true" @click="lastSong"></i>
          <!-- 播放按钮 -->
          <i class="fa fa-play-circle-o" aria-hidden="true" v-show="this.$store.state.showPlayBtn" @click="audio('play')"></i>
          <!-- 暂停播放 -->
          <i class="fa fa-pause-circle-o" aria-hidden="true" v-show="!this.$store.state.showPlayBtn" @click="audio('pause')"></i> 
          <!-- 下一曲 -->
          <i class="fa fa-step-forward" aria-hidden="true" @click="end"></i>
          <!-- 音量调节 -->
          <i class="fa fa-volume-up" aria-hidden="true"></i>
          <!-- 歌词按钮 -->
          <i class="lyric" @click="getLyric">词</i>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
// 导入 axios
import axios from 'axios'

import {mapState,mapMutations} from 'vuex'

const address = 'http://localhost:3000'
export default {
  name: 'App',
  data() {
    return {
      id: 0,// 网易云用户id
    }
  },
  created() {
    // 进入页面,先登录网易云音乐
    axios
      .post(address + '/login/cellphone',{
        'phone': 18383030041,
        'password': 'cy641578178'
      })
      .then(res => {
       if(res.data.code === 200) {
         console.log(res);
         // 登录成功
         // 获取当前用户id
         this.id = res.data.account.id
         // 将当前用户id 存在vuex中
         this.sendUserId(this.id)
       }
        
      })
  },
  methods: {
    // 获取用户id
    ...mapMutations({
      sendUserId : 'getUserId'
    }),
    // 播放完成
    end() {
      // 获取当前播放歌曲的id
      const id = this.$store.state.playMusicMsg.id
      // 获取下一首歌曲 index
      let index = this.$store.state.playlist.indexOf(id) + 1
      // 调用封装好的方法,播放下一首歌曲
      // 1 为标记下一曲
      this.musicCanPlay(this.$store.state.playlist[index],1)
    },
    // 获取播放时间以及进度条
    getTime() {
      const audio = this.$refs.audio
      this.musicTime(audio)
    },
    // 点击上一曲
    lastSong() {
       // 获取当前播放音乐id
      const id = this.$store.state.playMusicMsg.id
      //  获取当前播放音乐 index
      let index = this.$store.state.playlist.indexOf(id)
      
      // 判断index
      if(index === 0) {
        // 上一曲为列表最后一曲
        // 0 为标记上一曲
         this.musicCanPlay(this.$store.state.playlist[this.$store.state.playlist.length - 1],0)
      }else {
        // 上一曲
        this.musicCanPlay(this.$store.state.playlist[index - 1],0)

      
      }
     
      
      
    },
    // 播放暂停功能
    audio(data) {
      data === 'play' ? this.$refs.audio.play() : this.$refs.audio.pause()
      this.$store.state.showPlayBtn = ! this.$store.state.showPlayBtn
    },
    // 获取歌词功能
    getLyric() {
      let id = this.$store.state.playMusicMsg.id
      axios
        .get(address + `/lyric?id=${id}`)
        .then(res => {
          let lyric = res.data.lrc.lyric
          this.handleLyric(lyric)
        })
    },
    // 封装一个处理歌词的方法
    handleLyric(lyr) {
      // console.log(lyr);
      let arr = lyr.split(']')
      // console.log(arr);
      
      let newArr = []

      arr.forEach((item,index) => {
          newArr.push(arr[index].split('[')[0])
          newArr.push(arr[index].split('[')[1])
      })
      newArr.splice(0,1)
      newArr.splice(newArr.length - 1,1)
      // console.log(newArr);
      let tArr = [] // 时间数组
      let lArr = [] // 歌词数组
      newArr.forEach((item,index) => {
        index%2 === 0 ? tArr.push(item) : lArr.push(item)
      })
      // console.log(tArr);
      // console.log(lArr);
      
      let newTArr = []
      // 将tArr 数组转换为时间形式
      tArr.forEach((item,index)=> {
        let mins = parseInt(item[0] + item[1]) * 60 
        let secs = parseInt(item[3] + item[4])
        // let mills = parseInt(item[6] + item[7] + item[8]) * 1000
        let time = mins + secs 
        newTArr.push(time)
      })
      console.log(newTArr);
      this.updateLyric(newTArr,lArr)
    },
    updateLyric(tArr,lArr) {
      // console.log(1);
      // 获取当前currentTime
      let currentTime = this.$refs.audio.currentTime
      // console.log(currentTime);
      
      // 处理currentTime
      let currentInt = Math.floor(currentTime)
      // let currentFloat = Math.floor((currentTime - currentInt) * 1000)
      // let newCurrentTime = currentInt * 1000 + currentFloat
      console.log(currentInt);
      
    }
  }
}
</script>
<style>
  #app {
    width: 100%;
    height: 100%;
  }
  #app .bottom {
      width: 100%;
      height: 60px;
      background-color: rgba(255,255,255,.1);
      position: fixed;
      bottom: 0;
  }
  .bottom .info {
    width: 768px;
    height: 100%;
    margin: 0 auto;
    position: relative;
  }
  .info .musicMsg {
    width: 60px;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .info .musicMsg img{
    width: 100%;
    border-radius: 50%
  }
  .info .author {
    width: 150px;
    height: 100%;
    position: absolute;
    left: 85px;
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
    width:350px;
    height: 100%;
    line-height: 60px;
    position: absolute;
    right: 0;
  }
  .progress .line {
    display: inline-block;
    height: 4px;
    width: 250px;
    border-radius: 2px;
    background-color: #454546;
    margin-bottom: 4px;
  }
  .outline {
    width: 0;
    height: 100%;
    border-radius: 2px;
    background-color: #b82535;
  }
  .progress span {
    color: #fff;
  }
  .info .btns {
      height: 60px;
      line-height: 60px;
      position: absolute;
      left: 260px;
      top: 0;
    }
  .bottom .btns i {
    margin-right:  8px;
    font-size: 20px;
    color: #fff;
    cursor: pointer;
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
    background-color: #ccc;
    color: #fff;
  }
  .bottom .btns .lyric:hover {
    background-color: #b82525;
    color: #000;
  }
</style>
<style>
  @import './assets/css/common.less';
</style>
