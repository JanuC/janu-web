<template>
  <div class="article">
    <div class="articleMain" v-show="!showChild">
      <ul>
        <li v-for="(item,index) in allList" :key="index">
          <div class="a-left">
            <h2>{{item.title}}</h2>
            <span>更新于: {{updateTime(item.updatetime)}}</span>
            <span>标签: {{retutnLabel(item.category)}}</span>
            <span
              class="error"
              :class="{success: returnBoo(item.ispublish)}"
            >{{returnBoo(item.ispublish) ? '已发布' : '未发布'}}</span>
            <span
              class="error"
              :class="{success: returnBoo(item.isshow)}"
            >{{returnBoo(item.isshow) ? '可见' : '不可见'}}</span>
            <span
              class="error"
              :class="{success: returnBoo(item.istop)}"
            >{{returnBoo(item.istop) ? '已置顶' : '未置顶'}}</span>
          </div>
          <div class="a-right">
            <div class="btn">
              <i class="fa fa-pencil-square-o update" aria-hidden="true" @click="updateArticle(item.id)"></i>
              <i class="fa fa-trash-o trash" aria-hidden="true" @click="delArticle(index)"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <create-article v-show="showChild" :id="id"></create-article>
  </div>
</template>

<script>
import axios from "axios";
import CreateArticle from './createarticle'
const address = "http://v1.janulog.com:3001";
export default {
  data() {
    return {
      allList: [],
      showChild: false,// 是否显示子组件
      id: -1,//需要修改文章的id
      options: [
        { value: "HTML", label: "HTML" },
        { value: "JS", label: "JS" },
        { value: "CSS", label: "CSS" },
        { value: "log", label: "随笔" },
        { value: "face", label: "面试" }
      ]
    };
  },
  created() {
    this.checkuser(() => {
      axios.post(address + "/api/getarticle").then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          // 请求成功
          let arr = [];
          res.data.articlelist.forEach(item => {
            arr.push(item);
          });
          // this.allList = arr;
          this.allList = this.progressArticle(arr)
        }
      });
    });
  },
  methods: {
    // 该方法用于更新时间戳
    updateTime(str) {
      let date = new Date(parseInt(str));
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let h = date.getHours();
      let mi = date.getMinutes();
      let s = date.getSeconds();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      h = h < 10 ? "0" + h : h;
      mi = mi < 10 ? "0" + mi : mi;
      s = s < 10 ? "0" + s : s;
      return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
    },
    // 该方法传递进字符串 返回 布尔值
    returnBoo(str) {
      return str === "true" ? true : false;
    },
    // 该方法用于删除文章
    delArticle(index) {
      let idx = this.allList[index].id;

      // 先提醒用户是否确认删除文章
      this.$confirm("确认删除改文章吗?", "删除文章", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 已经上传到服务器
          this.checkuser(idx => {
            axios.post(address + "/api/delarticle", { id: idx }).then(res => {
              // console.log(res);
              if (res.data.code === 200) {
                // 操作成功
                this.$message({
                  message: res.data.message,
                  type: "success",
                  center: true
                });
                // 更新页面数据
                if (res.data.data.length != 0) {
                  let arr = [];
                  res.data.data.forEach(item => {
                    arr.push(item);
                  });
                  this.allList = arr;
                } else {
                  this.articleList = [];
                  this.ruleForm.value = "";
                  this.editor.info = "";
                }
              } else {
                // 操作失败
                this.$message({
                  message: "操作失败",
                  type: "error",
                  center: true
                });
              }
            });
          }, idx);
        })
        .catch(() => {
          // console.log(2);
        });
    },
    updateArticle(id) {
      // console.log(id);
      this.id = id
      this.showChild = true //显示子组件
    },
    // 该方法用于返回标签
    retutnLabel(str) {
      
      let obj = this.options.find(item => {
        return item.value === str
      })
      return obj.label
      
    }
  },
  components: {
    CreateArticle
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/article.less";
</style>