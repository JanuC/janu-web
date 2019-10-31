<template>
  <div class="listmain" :class="{marbottom: marginBottom}">
    <div class="loadingImg" v-show="loadingImg">
        <img src="../../../static/image/loading1.gif">
    </div>
    <div class="authorMsg" v-show="!loadingImg">
      <div class="bgImg">
        <img :src="playlistMsg.bgImg" >
      </div>
      <div class="listMsg">
        <div class="lm-top">
          <div class="lm-ico">
            <div class="left">歌单</div>
            <div class="right">
              <div class="ico-i"></div>
            </div>
          </div>
          <h3 class="title">{{playlistMsg.title}}</h3>
        </div>
        <div class="lm-middle">
          <div class="authorImg">
            <img :src="playlistMsg.authorImg" >
          </div>
          <div class="createMsg">
            <span class="nickname">{{playlistMsg.authorName}}</span>
            <span class="createtime">{{playlistMsg.createTime}} 创建</span>
          </div>
        </div>
        <div class="lm-label">
          <span>标签:</span>
          <i v-for="(item,index) in playlistMsg.tags" :key="index">{{item}}</i>
          
        </div>
        <div class="lm-bottom">
          <p>介绍:</p>
          <ul>
            <li v-for="(item,index) in playlistMsg.description" :key="index">{{item}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="playlist" v-show="!loadingImg">
      <div class="pl-top">
       <div class="left">
          <h2>歌曲列表</h2>
          <a href="javascript: void(0)">播放全部</a>
       </div>
        <div class="right">
          <span>共{{playlistMsg.trackCount}}首歌曲</span>
          <span>播放: <i>{{playlistMsg.playCount}}</i>次</span>
        </div>
      </div>
      <div class="pl-main">
         <el-table
         :data='playlistMsgArr'
          :stripe='true'
          style="width: 100%">
          <el-table-column
            label=""
            prop="index"
            width="50">
          </el-table-column>
          <el-table-column
            label=""
            prop="index"
            width="50">
            <template slot-scope="scope">
              <a href="javascript:void(0)" class="clickPlay" @click="clickPlay(scope.row.id)"><i class="fa fa-play-circle" aria-hidden="true"></i></a>
            </template>
          </el-table-column>
          <el-table-column
            label="歌曲标题"
            prop="musicName"
            width="250">
          </el-table-column>
          <el-table-column
            label="时长"
            prop="musicTime"
            width="80">
          </el-table-column>
          <el-table-column
            label="歌手"
            prop="singer"
            width="150">
          </el-table-column>
          <el-table-column
            label="专辑"
            prop="album"
            width="220">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const address = "http://localhost:3000";
export default {
  data() {
    return {
      playlistMsg: {},// 存放渲染页面需要的信息
      playlistMsgArr: [], // 存放歌曲信息
      playlistId: '',
      marginBottom: false,
      loadingImg: true,//控制加载中图片显示与隐藏
    }
  },
  created() {
    // 传了id过来
    if(this.$route.query.id) {
      this.getPlaylistMsg(this.$route.query.id)
      this.playlistId = this.$route.query.id
    }else {
      // 没传id , 直接请求 自己的歌单
      this.getPlaylistMsg(3045284784)
      this.playlistId = 3045284784
    }
    
  },
  methods: {
    // 该方法用于获取歌单详细信息
    getPlaylistMsg(id) {
      axios
        .get(address + '/playlist/detail?id=' +id) 
        .then(res => {
          // console.log(res);
          if(res.data.code === 200) {
            let obj = {}
            let arr = []
            // 请求成功
            obj.title = res.data.playlist.name
            obj.bgImg = res.data.playlist.coverImgUrl
            obj.authorImg = res.data.playlist.creator.avatarUrl
            obj.authorName = res.data.playlist.creator.nickname
            obj.createTime = this.updateTime(res.data.playlist.createTime)
            if(res.data.playlist.tags.length != 0) {
              obj.tags = res.data.playlist.tags
            }else {
              obj.tags = ['无']
            }
            if(res.data.playlist.description) {
              obj.description = res.data.playlist.description.split('\n')
            }else {
              obj.description = ['这个人啥也没有留下！！！']
            }
            obj.playCount = res.data.playlist.playCount
            obj.trackCount = res.data.playlist.trackCount
            this.playlistMsg = obj
            res.data.playlist.tracks.forEach((item,index) => {
              arr[index] = {}
              arr[index].index = index + 1
              arr[index].id = item.id
              arr[index].musicName = item.name
              arr[index].singer = item.ar[0].name
              arr[index].album = item.al.name
              arr[index].musicTime = this.updateMusicTime(item.dt)
            })
            // console.log(arr);
            this.playlistMsgArr = arr
          }
        })
    },
    // 该方法用于更新时间戳
    updateTime(data) {
      let newDate = new Date(data)
      let y = newDate.getFullYear()
      let m = newDate.getMonth() + 1 
      let d = newDate.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    // 该方法用于整理描述
    updateDescription(str) {
      str.spit('')
    },
    // 该方法用于整理时长
    updateMusicTime(time) {
      let date = new Date(time)
      let m = date.getMinutes()
      let s = date.getSeconds()
      m = m < 10 ? '0' + m : m
      s = s < 10 ? '0' + s : s
      return m + ':' + s
    },
    clickPlay(clickMusicId) {
      this.getPlaylist(this.playlistId,clickMusicId)
    }
  },
  computed: {
    // 和watch一起,监听播放控件是否显示
    isShow() {
      return this.$store.state.showPlayBtn
    }
  },
  watch: {
    isShow(newVal,oldVal) {
      this.marginBottom = oldVal
      
    },
    playlistMsgArr: {
      deep: true,
      handler() {
        this.loadingImg = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/css/list.less';
</style>