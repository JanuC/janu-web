<template>

  <div class="main" :class="{paddingBottom: $store.state.showPlayMusic}">
    <el-container>
      <el-header>
        <div class="nav">
          <div class="logo">
            <img src="/static/image/logo.png" alt="">
          </div>
          <div class="top">
            <router-link to="/home/index" >首页</router-link>
            <router-link to="/home/blog" >博客</router-link>
            <router-link to="/home/music" class="music" >音乐
              <div class="secondNav" v-show="this.$store.state.showSecMusic" v-if="showSecNav">
              <div class="box"></div>
              <div class="link">
                <router-link to="/home/music/recommend" class="musicSec" exact>推荐</router-link>
                <router-link to="/home/music/list" class="musicSec" exact>歌单</router-link>
                <router-link to="/home/music/rank" class="musicSec" exact>排行榜</router-link>
                <router-link to="/home/music/search" class="musicSec" exact>搜索</router-link>
              </div>
          </div>
            </router-link>
            <router-link to="/home/setting">设置</router-link>
           
          </div>
          
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template> 

<script>
export default {
  data() {
     return {
       showSecNav: true
     }
  },
  mounted() {
    window.addEventListener('scroll',this.scrollTop,true)
  },
  methods: {
    scrollTop(e) {
      // console.log(document.documentElement.scrollTop);
      if(document.documentElement.scrollTop > 100) {
        this.showSecNav = false
      }else {
        this.showSecNav = true
      }
    } 
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/common.less";
@import "../../assets/css/home.less";
</style>