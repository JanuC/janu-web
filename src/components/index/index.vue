<template>
  <div class="content">
    <div class="introduce">
      <p class="h1">{{strForm.h1Str}}</p>
      <p class="h2">{{strForm.h2Str}}</p>
      <p class="h2">{{strForm.h3Str}}</p>
      <p class="h3">{{strForm.h4Str}}</p>
      <a href="">{{$store.state.count}}</a>
      <a href=""  @click.prevent="playlist" v-show="playlistShow">《Janu的歌单》</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {mapMutations,mapActions} from 'vuex'
const address = 'http://v2.janulog.com:80'
export default {
  data() {
    return {
      time: 0,
      strForm: {
        h1Str: '',
        h2Str: '',
        h3Str: '',
        h4Str: ''
      },
      playlistShow: false
    }
  },
  created() {
    let strObj = {
      h1Str: '嗨！你来啦！欢迎 ~',
      h2Str: '我是Janu，这是我的第一个个人网站',
      h3Str: '先简单自我介绍一下吧',
      h4Str: `95后，来自四川泸州，现在在成都，从事前端开发的工作，个性比较活泼开朗吧，没事学学技术，打打游戏听听歌，说到听歌，先听听我的歌单吧！`
    }
    let step = 0 // 计步器
    // 各个字符串长度
    let l1 = strObj.h1Str.length
    let l2 = strObj.h2Str.length
    let l3 = strObj.h3Str.length
    let l4 = strObj.h4Str.length
    let timeid = setInterval(()=> {
      if(step < l1) {
        this.strForm.h1Str += strObj.h1Str[step]
      }else if(step >= l1&& step < l1 + l2) {
        this.strForm.h2Str += strObj.h2Str[step -  l1]
      }else if (step >= l1 + l2 && step < l1 + l2 +l3) {
        this.strForm.h3Str += strObj.h3Str[step - l1 - l2]
      }else if(step >= l1 + l2 + l3 && step < l1 + l2 + l3 + l4) {
        this.strForm.h4Str += strObj.h4Str[step - l1 - l2 - l3]
      }else {
        this.playlistShow = true
        clearInterval(timeid)
      }
      step++
      
      
    },80)
    this.$store.commit('getSecMusic', false)
  },
  methods: {
    
    playlist() {
      
      if(this.$store.state.playlist.length != 0) {
        // 不是第一次进入页面
        this.$store.commit('updateMusicBtn',true)
        this.$store.commit('updatePlayMusic',true)
        return
      }
      
      // 显示播放界面
      // 将播放按钮隐藏,暂停按钮出现
      this.$store.commit('updateMusicBtn',false)
      // 先去vuex中获取用户id
      const userid = this.$store.state.userid
      // 通过拿到的id,发送请求,获取用户歌单
      axios
        .get(address + `/user/playlist?uid=${userid}`)
        .then(res => { 
          // console.log(res);
          if(res.data.code === 200) {
            // 获取成功
            const playlistId = res.data.playlist[1].id
            // console.log(playlistId);
            
            // 发送请求获取当前歌单的详细信息
            axios
              .get(address + `/playlist/detail?id=${playlistId}`)
              .then(res => {
                // console.log(res);
                if(res.data.code === 200) {
                  // 请求成功
                  // 将歌单中所有id保存起来
                  const list = []
                  for(let i = 0 ; i < res.data.privileges.length; i++) {
                   list.push(res.data.privileges[i].id)
                  }
                  // 将歌单所有歌曲id保存在 vuex 中
                  this.sendPlaylist(list)
                  // 播放第一曲
                  this.getMusicMsg(list[0])
                  
                }
              })
          }
        })
    },
    ...mapMutations({
      sendPlaylist: 'getPlaylist',
      // sendMusicMsg: 'getMusicMsg'
    }),
    ...mapActions({
      
    })
  }
}
</script>
<style>
  .content>.introduce>.h1 {
    font-size: 30px
  }
  .content>.introduce>.h2 {
    font-size: 22px
  }
  .content>.introduce>.h3 {
    width: 80%;
    font-size: 18px
  }
   .content>.introduce>a {
     color: #b82535;
   }
</style>
<style scoped>
  @import "../../assets/css/common.less";
  @import "../../assets/css/index.less";
</style>