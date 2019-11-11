<template>
  <div class="backMain">
    <div class="loginMain">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" prop="username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" prop="password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// const address = 'http://47.100.36.233:3006'
const address = 'http://v1.janulog.com:3001'
export default {
  data() {
    var validateUsername = (rule,value,callback) => {
      if(!value.trim()) {
        callback(new Error('用户名不能为空'))
      }
      else if(/[\u4E00-\u9FA5]/g.test(value.trim())) {
        callback(new Error('用户名不能为汉字'))
      }
      else if(value.trim().length > 7 || value.trim().length < 4) {
        callback(new Error('用户名为4到7个字符'))
      }
      else {
        callback()
      }
    }
    var validatePwd = (rule,value,callback) => {
      if(!value.trim()) {
        callback(new Error('密码不能为空'))
      }
      else if(value.trim().length > 12 || value.trim().length < 6) {
        callback(new Error('密码为6到12个字符'))
      }else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        password: '',
      },
      rules: {
        username:[{validator: validateUsername,trigger: 'blur'}],
        password:[{validator: validatePwd,trigger: 'blur'}]
        }
    }
    
  },
  methods: {
    // 登录功能
    login() {
      this.$refs["ruleForm"].validate(valid => {
        if(valid) {
          axios
            .post(address + '/api/login',this.ruleForm)
            .then(res => {
              console.log(res);
              if(res.data.code === 200) {
                // 登录成功
                // 将token保存起来
                localStorage.setItem('username',res.data.data.username)
                localStorage.setItem('token',res.data.data.token)
                // 跳转到后台首页
                this.$router.push({path: '/back/backhome'})
              }else {
                this.$message({
                  message: res.data.message,
                  type: 'error',
                  center: true
                })
              }
            })
          
        }else {
          console.log(2);
          
        }
      })
    }
  }
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
@import "../../assets/css/login.less";
</style>