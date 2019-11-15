<template>
  <div class="writeMain">
    <create-article></create-article>
  </div>
</template>

<script>
import CreateArticle from './createarticle'
import axios from "axios";
const address = 'http://v1.janulog.com:3001'
export default {
  data() {
    return {
      // 富文本编辑器中中的文本
      editor: {
        info: ""
      },
      isClear: false, //是否清空文本域
      title: "无标题", // 文章标题
      articleList: [], //所有文章列表
      selectArticle: {}, // 当前显示的文章
      selectArticleIdx: 0, //当前选中文章的index,默认为0
      published: "", // 当前显示的文章是否已发布
      options: [
        { value: "HTML", label: "HTML" },
        { value: "JS", label: "JS" },
        { value: "CSS", label: "CSS" },
        { value: "log", label: "随笔" },
        { value: "face", label: "面试" }
      ],
      ruleForm: {
        value: "", // 文章分类
        isshow: true // 是否可见
      }
    };
  },
  // 组件导航守卫
  beforeRouteLeave(to, from, next) {
    let oldVal = this.$store.state.oldArticleVal;
    let newVal = this.$store.state.newArticleVal;
    if (oldVal != newVal) {
      this.$confirm("当前页面有尚未保存的内容,确认离开吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 将vuex中的文章内容置为空,并放行
          this.$store.commit('getOldArticleVal','')
          this.$store.commit('getNewArticleVal','')
          next();
        })
        .catch(() => {
          // 阻止路由跳转,留在当前页面
          next(false);
        });
    } else {
      // 用户没有修改文章,直接放行
      next();
    }
  },
  components: {
    CreateArticle
  }
};
</script>


<style lang="less" scoped>
@import "../../assets/css/write.less";
</style>