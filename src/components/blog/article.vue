<template>
  <div class="content">
    <div class="loading" v-show="showLoading">
      <img src="../../../static/image/loading1.gif" alt="">
    </div>
    <div class="article" v-show="!showLoading">
      <div class="title">
        <h1>{{title}}</h1>
      </div>
      <div class="main" v-html="html" v-highlight></div>
      <div class="article-bottom">
        <div class="line">
          --------------------------------------------------------------------------------------------
          --------------------------------------------------------------------------------------------
          --------------------------------------------------------------------------------------------
          --------------------------------------------------------------------------------------------
          --------------------------------------------------------------------------------------------
        </div>
        <div class="time">
          更新于: {{time}}
        </div>
        <div class="other" v-show="lastArticle ||  nextArticle">
          <div class="b-left" v-show="lastArticle">
          <a href="javascript: void(0)" @click="checkArticle(lastArticle.id)">上一篇: {{lastArticle.title}}</a>
          </div>
          <div class="b-right"  v-show="nextArticle">
            <a href="javascript: void(0)" @click="checkArticle(nextArticle.id)">下一篇: {{nextArticle.title}}</a>
          </div>
          </div>
    </div>
    </div>
    
  </div>
</template>

<script>
import axios from "axios";
// const address = "http://192.168.31.19:3001";
const address = "http://v1.janulog.com:3001";
export default {
  data() {
    return {
      title: '',// 当前文章标题
      html: '',// 当前文章内容
      lastArticle: '',//上一篇文章信息
      nextArticle: '',//下一篇文章信息
      time: '',// 最后更新时间
      showLoading: true,
    }
  },
  created() {
    this.getNowArticle()
  },
  methods: {
    getNowArticle() {
      this.showLoading = true
      // 获取传递过来的id,并发送请求获取文章详情
      let id = this.$route.query.id
      let category = this.$route.query.category
      axios
        .post(address + '/api/articlemain',{category:category,id:id})
        .then(res => {
          if(res.data.code === 200) {
            this.title = res.data.nowArticle.title
            this.html = res.data.nowArticle.main
            this.time = this.updatetime(+res.data.nowArticle.updatetime)
            if(res.data.lastArticle) {
              // 有上一篇文章
              this.lastArticle = res.data.lastArticle
            }else {
              this.lastArticle = false
            }
            if(res.data.nextArticle) {
              // 有上一篇文章
              this.nextArticle = res.data.nextArticle
            }else {
              this.nextArticle = false
              
            }
            this.showLoading = false
          }
        })
    },
    // 更新时间
    updatetime(time) {
      let date = new Date(time)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      let h = date.getHours()
      let mi = date.getMinutes()
      let s = date.getSeconds()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      h = h < 10 ? '0' + h : h
      mi = mi < 10 ? '0' + mi : mi
      s = s < 10 ? '0' + s : s
      return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s
    },
    checkArticle(id) {
      let category = this.$route.query.category
      this.$router.push({path:'/home/artcile',query: {category: category,id: id}})
    }
  },
  watch: {
    // 监听路由中参数的变化
    '$route' (to,from) {
     if(to.query.id !== from.query.id) {
      this.getNowArticle()
       
     }
    }
  }
  
}
</script>
<style>
  .main pre {
    width: 100%;
    font-size: 18px
  }
</style>
<style lang="less" scoped>
  @import '../../assets/css/common.less';
  @import '../../assets/css/articlemain.less';
</style>