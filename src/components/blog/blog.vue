<template>
  <div class="blogMain">
    <div class="select">
      请选择文章分类:
      <el-select v-model="value" placeholder="请选择" class="sel" :disabled="selected">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="loading" v-show="showLoading">loading...</div>
    <div class="noarticle" v-show="noArticle">
      <h1>非常抱歉,当前分类下还没有文章~</h1>
    </div>
    <div class="list" v-show="!noArticle || showLoading">
      <transition-group 
        appear
        tag="ul"
        name="right"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        ref="ul"
       >
        <li v-for="(item) in showList" :key="item.id">
          <div class="article" @click="getArticle(item.id)">
            <h2 ><span :class="{istop: returnBoo(item.istop)}"> {{returnBoo(item.istop) ? '[置顶]' : ''}}</span>{{item.title}}</h2>
            <div class="articlemsg">
              <span>
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                {{item.updatetime}}
              </span>
              <span>
                <i class="fa fa-tags" aria-hidden="true"></i>
                {{item.label}}
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
// const address = "http://192.168.31.19:3001";
const address = "http://v1.janulog.com:3001";
export default {
  data() {
    return {
      value: "all", // 文章分类
      options: [
        { value: "all", label: "全部" },
        { value: "HTML", label: "HTML" },
        { value: "JS", label: "JS" },
        { value: "CSS", label: "CSS" },
        { value: "log", label: "随笔" },
        { value: "face", label: "面试" }
      ],
      allList: [], //所有文章
      showList: [], //当前显示的文章列表
      noArticle: false, //当前没有文章
      showLoading: true,
      time: 0,
      selected: true,// 控制是否可选分类
    };
  },
  created() {
    this.$store.commit("getSecMusic", false);

    // 进入页面,发送请求获取所有文章所需信息
    axios.post(address + "/api/getarticlemsg").then(res => {
      // console.log(res);
      if (res.data.code === 200) {
        let arr = [];
        res.data.data.forEach(item => {
          arr.push(item);
        });
        this.handleArticle(arr);
      }
    });
  },
  methods: {
    // 该方法用于处理后台返回的文章数据
    handleArticle(arr) {
      arr.forEach(item => {
        let result = this.options.find(items => items.value === item.category);
        // console.log(xx);
        item.label = result.label;
        let date = new Date(+item.updatetime);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        item.updatetime = y + "-" + m + "-" + d;
      });
      // console.log(arr);

      this.allList = this.progressArticle(arr);
      
      
      this.selected = false;
      // this.showList = arr
      this.showList = this.allList;
      this.showLoading = false;
      // console.log(this.showList);
    },
    // 点击想看的文章
    getArticle(id) {
      // 跳转到文章详情页,并传递id
      this.$router.push({
        path: "/home/artcile",
        query: { category: this.value, id: id }
      });
    },
    // 该方法用于返回一个布尔值
    returnBoo(str) {
      // console.log(str);
      
      return str === 'true' ? true : false
    },
    beforeEnter(el,done) {
      el.style.transform = "translateX(200px)"
    },
    enter(el,done) {
      el.offsetWidth
      setTimeout(() => {
        el.style.transform = "translateX(0)"
        el.style.transition = "all 0.6s ease " + this.time + 's'
        this.time += 0.3
      },100)
      done()
    },
    afterEnter(el) {

    },
    beforeLeave(el) {
      this.time = 0
      el.style.transition = "all 0s"
      // console.log(2);
      
    }
  },
  watch: {
    // 通过监听select的 value,动态更新当前显示文章
    value(newVal) {
      // 先将文章列表置为空
      this.showList = []
      // 在数据变化之后等待Vue完成更新DOM
      this.$nextTick(() => {
        // 过滤出符合分类的文章
        let newArr = this.allList.filter(item => item.category === newVal);
        
        if (newVal === "all") {
          this.noArticle = false;
          // this.showList = this.allList
          this.showList = this.allList
        }else if (newArr.length === 0) {
          // 当前分类下没有文章
          this.noArticle = true;
          // return
        } else {
          // this.showList = []
          this.noArticle = false;
          // this.showList = newArr;
          this.showList = newArr
          
        }
      })
     
    },
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/blog.less";
</style>