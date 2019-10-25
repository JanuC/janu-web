
import axios from 'axios'

const address = 'http://localhost:3000'

// 该js文件用于存放全局方法
export default {
  install(Vue) {
    // 1. 该方法用于获取歌曲相关信息,并保存
    // 通过 async 和 await 获取异步请求 axios 返回的数据
    Vue.prototype.getMusicMsg = async function (id) {
      // 该方法用于根据id获取歌曲信息
      const obj = {}
      // 根据传入的id,获取歌曲信息
      await axios
        .get(address + `/song/url?id=${id}`)
        .then( async res => {
          // console.log(res);
          
          if (res.data.code === 200) {
            // 得到歌曲id 和 url
            obj.id = res.data.data[0].id
            obj.url = res.data.data[0].url
            // 发送请求获取歌曲详细信息
          await axios
              .get(address + `/song/detail?ids=${id}`)
              .then(res => {
                // console.log(res);
                if (res.data.code === 200) {
                  // 图片地址
                 obj.imgUrl = res.data.songs[0].al.picUrl
                  // 歌曲名字
                 obj.name = res.data.songs[0].name
                  // 歌手信息
                 obj.author = res.data.songs[0].ar[0].name
                }
              })
          }
        })
        // console.log(obj);
        
      this.$store.commit('getMusicMsg',obj)
      
    }

    // 2. 该方法用于获取歌曲总长以及当前播放时间
    Vue.prototype.musicTime = function(dom) {
      // 传递进来的dom 是页面中的audio DOM 元素
      clearInterval(timeid)
      var timeid = setInterval(() => {
        if(dom.duration) {
          // 总时长
        let totalMinute = Math.floor(parseInt(dom.duration / 60))
        if(totalMinute < 10) {
          totalMinute = '0' + totalMinute
        }
        let totalSecond = Math.floor(parseInt(dom.duration % 60))
        if(totalSecond < 10) {
          totalSecond = '0' + totalSecond
        }
        let totalTime = totalMinute + ':' + totalSecond
        let newTotal = totalTime
        // 已播放时长
        let currentMinute = Math.floor(parseInt(dom.currentTime / 60))
        if(currentMinute < 10) {
          currentMinute = '0' + currentMinute
        }
        let currentSecond = Math.floor(parseInt(dom.currentTime % 60))
        if(currentSecond < 10) {
          currentSecond = '0' + currentSecond
        }
        let currentTime = currentMinute + ':' + currentSecond
        // console.log(currentTime);
        // 进度条
        let duration = dom.duration
        let current = dom.currentTime
        let progressWidth = parseInt(current / duration * 100) 
        // 将时间以及进度条信息提交到vuex
        this.$store.commit('getMusicTime',{currentTime: currentTime,totalTime:newTotal,progressWidth : progressWidth})

        if(totalTime === currentTime) {
          // 清除定时器
          clearInterval(timeid)
        }
        }
        
      },1000)
      
    }

    // 3. 该方法用于判断歌曲是否可播放
    Vue.prototype.musicCanPlay = function(id,n) {
       axios
        .get(address + `/check/music?id=${id}`)
        .then( async res => {
          if(res) {
            // 可以播放
            this.getMusicMsg(id)
          }else {
            let index = this.$store.state.playlist.indexOf(id)
           if(n===0) {
             // 继续找上一曲
            this.musicCanPlay(this.$store.state.playlist[index - 1])
           }else {
             // 继续找下一曲
            this.musicCanPlay(this.$store.state.playlist[index + 1])
           }
          }
        })
    }
  }
}

