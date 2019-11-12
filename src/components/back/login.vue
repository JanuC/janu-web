<template>
  <div class="backMain">
    <div class="loginMain">
      <div class="l-left">
        <div class="content">
          <h2>{{time}}啊，Janu</h2>
          <p>今天天气好吗？记录点什么吧！</p>
        </div>
      </div>
      <div class="l-right">
        <div class="logincontent">
          <el-form :model="ruleForm" ref="ruleForm" :rules="rules" class="form">
            <el-form-item prop="username">
              <el-input v-model="ruleForm.username" prop="username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input
                v-model="ruleForm.password"
                prop="password"
                placeholder="请输入密码"
                type="password"
                
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// const address = 'http://47.100.36.233:3006'
const address = "http://v1.janulog.com:3001";
export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error("用户名不能为空"));
      } else if (/[\u4E00-\u9FA5]/g.test(value.trim())) {
        callback(new Error("用户名不能为汉字"));
      } else if (value.trim().length > 7 || value.trim().length < 4) {
        callback(new Error("用户名为4到7个字符"));
      } else {
        callback();
      }
    };
    var validatePwd = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error("密码不能为空"));
      } else if (value.trim().length > 12 || value.trim().length < 6) {
        callback(new Error("密码为6到12个字符"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      time: '',
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePwd, trigger: "blur" }]
      }
    };
  },
  created() {
    let h = new Date().getHours()
    if(h > 0 && h <= 6) {
      this.time = '凌晨好'
    }
    else if (h > 6 && h <= 11) {
      this.time = '上午好'
    }
    else if (h > 11 && h <= 13) {
      this.time = '中午好'
    }
    else if (h > 13 && h <= 18) {
      this.time = '下午好'
    }
    else if (h > 18 && h <= 22) {
      this.time = '晚上好'
    }else {
      this.time = '夜深了'
    }
  },
  methods: {
    // 登录功能
    login() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          axios.post(address + "/api/login", this.ruleForm).then(res => {
            // console.log(res);
            if (res.data.code === 200) {
              // 登录成功
              // 将token保存起来
              localStorage.setItem("username", res.data.data.username);
              localStorage.setItem("token", res.data.data.token);
              // 跳转到后台首页
              this.$router.push({ path: "/back/backhome" });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                center: true
              });
            }
          });
        } else {
          // console.log(2);
        }
      });
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

.form input {
  background-color: rgba(45,48,53,0)!important;
  border: 0;
  border-bottom: 1px solid #F56C6C;
  border-radius: 0%;
  outline: none;
  color: #fff;
}
.form .el-input__inner:focus {
  border-color: #F56C6C;
}
.form .el-input__inner:hover {
  border-color: #F56C6C;
}
</style>
<style lang="less" scoped>
@import "../../assets/css/login.less";
</style>