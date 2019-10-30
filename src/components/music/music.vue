<template>
  <div class="content">
    <div class="secondNav" v-show="showSecNav">
      <div class="box"></div>
      <div class="link">
        <router-link to="/home/music/recommend">推荐</router-link>
        <router-link to="/home/music/rank">排行榜</router-link>
        <router-link to="/home/music/list">歌单</router-link>
        <router-link to="/home/music/search">搜索</router-link>
      </div>
    </div>
    <router-view></router-view>
      <!-- <div class="searchInput">
        <input class="input" v-model="searchVal" placeholder="想听听啥？">
      </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSecNav: false
    }
  },
  created() {
    // 判断当前路由中是否 在music 目录下
    if(location.hash.indexOf('music') != -1) {
      // 显示二级导航菜单
      this.showSecNav = true
    }
    
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/css/common.less';
  @import '../../assets/css/music.less';

</style>

