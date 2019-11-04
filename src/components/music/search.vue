<template>
  <div class="searchMain">
    <div class="searchInput" :class="{top: topPos}">
        <input class="input" v-model="searchVal" placeholder="想听听啥？" @change="searchMusic">
    </div>
    <div class="searchList" v-show="showTable">
      <table>
        <thead>
          <tr>
            <th class="t-t1">歌名</th>
            <th class="t-t2">歌手</th>
            <th class="t-t3">专辑</th>
            <th class="t-t4">时长</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in searchList" :key="index">
            <td><p class="td-name">{{item.name}}</p><a href="javascript: void(0)" @click="searchPlay(item.id)">播放</a></td>
            <td>{{item.artists[0].name}}</td>
            <td>{{item.album.name}}</td>
            <td>{{updateDuration(item.duration)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const address = "http://v2.janulog.com:80"
export default {
  data() {
    return {
      searchVal: '',// 搜索关键字
      topPos: false,// 控制input动画
      searchList: [],//保存搜索返回的歌单
      showTable:false,
    }
  },
  methods: {
    // 获取搜索框内容,发送请求
    searchMusic() {
      // 先判断字符串是否为空
      if(this.searchVal.trim()) {
        // 不为空
        axios
          .get(address + '/search?keywords=' + this.searchVal)
          .then(res => {
            // console.log(res);
            if(res.data.code === 200) {
              this.topPos = true
              let arr = []
              res.data.result.songs.forEach(item => {
                arr.push(item)
              })
              this.searchList = arr
              this.showTable = true
            }
          })
      }else {
        return 
      }
      
    },
    updateDuration(d) {
      let date = new Date(d)
      let m = date.getMinutes()
      let s = date.getSeconds()
      m = m < 10 ? '0' + m : m
      s = s < 10 ? '0' + s : s
      return m + ':' + s
    },
    // 播放
    searchPlay(id) {
      this.getMusicMsg(id)
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/css/search.less';
</style>