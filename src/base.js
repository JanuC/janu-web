
import axios from 'axios'

const address = 'http://v2.janulog.com:80'

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
        .then(async res => {
          // console.log(res);

          if (res.data.code === 200) {
            console.log(res);

            // 得到歌曲id 和 url
            obj.id = res.data.data[0].id
            if (res.data.data[0].url) {
              obj.url = res.data.data[0].url
            } else {
              this.$message.error('暂无版权,即将播放下一曲')
              // 播放下一曲 
              this.getMusicMsg(this.$store.state.playlist[this.$store.state.playlist.indexOf(id) + 1])

            }
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

      this.$store.commit('getMusicMsg', obj)

    }

    // 2. 该方法用于获取歌曲总长以及当前播放时间
    Vue.prototype.musicTime = function (dom) {
      // 传递进来的dom 是页面中的audio DOM 元素
      clearInterval(timeid)
      var timeid = setInterval(() => {
        if (dom.duration) {
          // 总时长
          let totalMinute = Math.floor(parseInt(dom.duration / 60))
          if (totalMinute < 10) {
            totalMinute = '0' + totalMinute
          }
          let totalSecond = Math.floor(parseInt(dom.duration % 60))
          if (totalSecond < 10) {
            totalSecond = '0' + totalSecond
          }
          let totalTime = totalMinute + ':' + totalSecond
          let newTotal = totalTime
          // 已播放时长
          let currentMinute = Math.floor(parseInt(dom.currentTime / 60))
          if (currentMinute < 10) {
            currentMinute = '0' + currentMinute
          }
          let currentSecond = Math.floor(parseInt(dom.currentTime % 60))
          if (currentSecond < 10) {
            currentSecond = '0' + currentSecond
          }
          let currentTime = currentMinute + ':' + currentSecond
          // console.log(currentTime);
          // 进度条
          let duration = dom.duration
          let current = dom.currentTime
          let progressWidth = parseInt(current / duration * 100)
          // 将时间以及进度条信息提交到vuex
          this.$store.commit('getMusicTime', { currentTime: currentTime, totalTime: newTotal, progressWidth: progressWidth })

          if (totalTime === currentTime) {
            // 清除定时器
            clearInterval(timeid)
          }
        }

      }, 1000)

    }

    // 3. 该方法用于判断歌曲是否可播放
    Vue.prototype.musicCanPlay = function (id, n) {
      if (id) {
        axios
          .get(address + `/check/music?id=${id}`)
          .then(async res => {
            if (res) {
              // 可以播放
              this.getMusicMsg(id)
            } else {
              let index = this.$store.state.playlist.indexOf(id)
              if (n === 0) {
                // 继续找上一曲
                this.musicCanPlay(this.$store.state.playlist[index - 1])
              } else {
                // 继续找下一曲
                this.musicCanPlay(this.$store.state.playlist[index + 1])
              }
            }
          })
      }

    }

    // 4. 该方法用于获取歌单信息
    Vue.prototype.getPlaylist = function (id, clickMusicId) {
      axios
        .get(address + '/playlist/detail?id=' + id)
        .then(res => {
          // console.log(res);

          if (res.data.code === 200) {
            // 将所有信息保存
            const list = []
            for (let i = 0; i < res.data.privileges.length; i++) {
              list.push(res.data.privileges[i].id)
            }
            // 将歌单所有歌曲id保存在 vuex 中
            this.$store.commit('getPlaylist', list)
            // 播放点击的歌曲
            this.getMusicMsg(clickMusicId)
          }
        })
    }
    // 5. 发方法用于验证用户身份是否合法,合法则执行传递过来的方法
    Vue.prototype.checkuser = async function (fn,params) {
      let promise = new Promise((resolve, reject) => {
        let username = localStorage.getItem("username");
        let token = localStorage.getItem("token");
        axios
          .post("http://v1.janulog.com:3001" + "/api/checkuser", { username: username, token: token })
          .then((res) => {
            resolve(res.data.status)
          });
      })
      let flag = await promise
      if(flag) {
        // 合法身份
        if(params) {
          // 传递进来了参数
          fn(params)
        }else {
          // 为传递参数
          fn()
        }
      }else {
        // 非法身份
        this.$router.push({path: '/back/login'})
      }
    }
  }
}


