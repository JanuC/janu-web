<template>
  <div class="main">
      <el-container>
        <el-header>
          <div class="nav">
            <div class="logo">
            <h1>Janu</h1>
            </div>
            <div class="top">
              <router-link to="/home/index">首页</router-link>
              <router-link to="/home/blog">博客</router-link>
              <router-link to="/home/music">音乐</router-link>
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
export default {};
</script>

<style lang="less" scoped>
@import "../../assets/css/common.less";
@import "../../assets/css/home.less";
</style>