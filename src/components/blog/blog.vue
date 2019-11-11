<template>
  <div class="blogMain">
    <div class="select">
      请选择文章分类: 
      <el-select v-model="value" placeholder="请选择" class="sel">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="loading" v-show="showLoading">
      loading...
    </div>
    <div class="noarticle" v-show="noArticle">
      <h1>非常抱歉,当前分类下还没有文章~</h1>
    </div>
    <div class="list" v-show="!noArticle || showLoading">
        <transition-group tag="ul" appear name='right'>
        <li v-for="(item,index) in showList" :key="index">
          <div class="article" @click="getArticle(item.id)">
            <h2>{{item.title}}</h2>
            <div class="articlemsg">
              <span>
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i> {{item.updatetime}}
              </span>
              <span>
                <i class="fa fa-tags" aria-hidden="true"></i> {{item.label}}
              </span>
            </div>
          </div>
        </li>
        </transition-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const address = "http://192.168.31.19:3001";
export default {
  data() {
    return {
      value: 'all',// 文章分类
      options: [
        { value: "all", label: "全部" },
        { value: "HTML", label: "HTML" },
        { value: "JS", label: "JS" },
        { value: "CSS", label: "CSS" },
        { value: "log", label: "随笔" },
        { value: "face", label: "面试" }
      ],
      allList: [],//所有文章
      showList: [],//当前显示的文章列表
      noArticle: false, //当前没有文章
      showLoading: true
    }
  },
  created() {
    this.$store.commit("getSecMusic", false);

    // 进入页面,发送请求获取所有文章所需信息
    axios.post(address + "/api/getarticlemsg").then(res => {
      // console.log(res);
      if (res.data.code === 200) {
        let arr = []
        res.data.data.forEach(item => {
          arr.push(item)
        })
        this.handleArticle(arr)
      }
    });
  },
  methods: {
    // 该方法用于处理后台返回的文章数据
    handleArticle(arr) {
      arr.forEach(item => {
        let result = this.options.find(items => items.value === item.category)
        // console.log(xx);
        item.label = result.label
        let date = new Date(+item.updatetime)
        let y = date.getFullYear()
        let m = date.getMonth() + 1
        let d = date.getDate()
        m = m < 10 ? '0' + m : m
        d = d < 10 ? '0' + d : d
        item.updatetime = y + '-' + m + '-' + d
      })
      // console.log(arr);
      
      this.allList = arr
      // this.showList = arr
      this.showList = arr
      this.showLoading = false
    },
    // 点击想看的文章
    getArticle(id) {
      // 跳转到文章详情页,并传递id
      this.$router.push({path:'/home/artcile',query: {category: this.value,id: id}})
    }
  },
  watch: {
    // 通过监听select的 value,动态更新当前显示文章
    value(newVal) {
      let arr = this.allList
      let newArr = this.allList.filter(item => item.category === newVal)
      
      if(newVal === 'all') {
        this.noArticle = false
        this.showList = this.allList
      }else if(newArr.length === 0) {
        // 当前分类下没有文章
        this.noArticle = true
        // return
      }else {
        this.noArticle = false
        this.showList = newArr
      }
      
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/blog.less";
</style>