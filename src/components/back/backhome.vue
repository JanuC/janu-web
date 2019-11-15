<template>
  <div class="backhome">
    <el-container>
      <el-aside width="200px">
        <div class="admin">
          <div class="logo"></div>
          <div class="message">
            <p>欢迎~</p>
            <div class="logout" @click="logout">
              <i class="fa fa-sign-out" aria-hidden="true">退出</i>
            </div>
          </div>
        </div>
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <router-link to="/back/backhome/write" class="link">写文章</router-link>
          </el-menu-item>
          <el-menu-item index="2">
            <router-link to="/back/backhome/article" class="link">文章管理</router-link>
          </el-menu-item>
          <el-menu-item index="3">
            <router-link to="/back/backhome/other" class="link">其他管理</router-link>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <h2>Janu后台管理</h2>
        </el-header>
        <el-main>
          <router-view v-if="isRouteeAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
// const address = 'http://v1.janulog.com:80'
const address = "http://v1.janulog.com:3001";
export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouteeAlive: true
    };
  },
  created() {
    //  this.checkuser()
    // console.log(location.hash);
  },
  methods: {
    // 退出功能
    logout() {
      // 获取 登录的用户名
      let name = localStorage.getItem("username");
      this.checkuser(name => {
        axios.post(address + "/api/logout", { name: name }).then(res => {
          // console.log(res);
          if (res.data.code === 200) {
            // 退出成功
            this.$message({
              message: res.data.message,
              type: "success",
              center: true
            });
            // 销毁localStorage 中的数据
            localStorage.removeItem("username");
            localStorage.removeItem("token");

            // 1s后跳转到登录页
            setTimeout(() => {
              this.$router.push({ path: "/back/login" });
            }, 1000);
          } else {
            // 退出失败
            this.$message({
              message: res.data.message,
              type: "error",
              center: true
            });
            return;
          }
        });
      }, name);
    },
    reload() {
      this.isRouteeAlive = false;
      this.$nextTick(() => {
        this.isRouteeAlive = true;
      });
    }
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
<style lang="less" scoped>
@import "../../assets/css/backhome.less";
</style>