<template>
  <div class="rankMain">
    <div class="ranktitle">
       <ul>
         <li><a href="javascript: void(0)" class="title" @click="getRankList(3)" :class="{clickRank: rankListId === 3}">云音乐飙升榜</a></li>
         <li><a href="javascript: void(0)" class="title" @click="getRankList(0)" :class="{clickRank: rankListId === 0}">云音乐新歌榜</a></li>
         <li><a href="javascript: void(0)" class="title" @click="getRankList(2)" :class="{clickRank: rankListId === 2}">云音乐原创歌曲榜</a></li>
         <li><a href="javascript: void(0)" class="title" @click="getRankList(1)" :class="{clickRank: rankListId === 1}">云音乐热歌榜</a></li>
       </ul>
    </div>
    <div class="listMain">
      <div class="listTitle">
        <div class="titleLeft">
          <h3>歌曲列表</h3>
          <a href="javascript: void(0)" @click="playMusic(0)">播放全部</a>
        </div>
        <div class="titleRight">
          <span>{{playlistLength}}首歌</span>
          <span>播放: <i>{{playCount}}</i> 次</span>
        </div>
      </div>
      <div class="list-playlist">
        <table cellspacing="0">
          <thead>
            <tr>
              <th class="w1"></th>
              <th class="w2">标题</th>
              <th class="w3">时长</th>
              <th class="w4">歌手</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in ranklist" :key="index" :class="{oddColor: index % 2 === 0}">
              <td class="index">{{index+1}}</td>
              <td><i class="fa fa-play-circle" aria-hidden="true" @click="playMusic(index)"></i>{{item.name}}</td>
              <td>{{updateDuration(item.dt)}}</td>
              <td>{{item.ar[0].name}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {mapMutations} from 'vuex'
const address = "http://v2.janulog.com:80"
export default {
  data() {
    return {
      rankListId: 3,
      playCount: '',//播放次数
      playlistLength:'',//歌曲数量
      ranklist: [],//歌单列表
      rankId: '',//当前排行榜歌单id
    }
  },
  created () {
    this.getRankList(3)
  },
  methods: {
    // 该方法用于获取排行榜
    getRankList(idx) {
      this.rankListId = idx
      axios 
        .get(address + '/top/list?idx=' + idx)
        .then(res => {
          // console.log(res);
          if(res.data.code === 200) {
            // 获取数据成功
            this.playCount = res.data.playlist.playCount
            let arr = []
            res.data.playlist.tracks.forEach(item => {
              arr.push(item)
            })
            this.ranklist = arr
            this.playlistLength = arr.length
            this.rankId = res.data.playlist.id
            // console.log(this.rankId);
            
          }
        })
    },
    // 该方法用于更新歌曲总时长
    updateDuration(num) {
      let date = new Date(num)
      let m = date.getMinutes()
      let s = date.getSeconds()
      m = m < 10 ? '0' + m : m
      s = s < 10 ? '0' + s : s
      return m + ':' + s 
    },
    // 该方法用于获取点击音乐的id,并播放
    playMusic(idx) {
      // console.log(this.ranklist[idx].id);
      
      this.getPlaylist(this.rankId,this.ranklist[idx].id)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/css/rank.less";
</style>