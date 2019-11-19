<template>
  <div class="temMain">
    <div class="loading" v-show="showLoading">
      <img src="../../../static/image/loading2.gif" />
    </div>
    <div class="articleContent">
      <div class="title">
        <input type="text" v-model="articleTitle" />
      </div>
      <div class="eitorContent">
        <Editorbar v-model="editor.info" @change="changeVal" :editorVal="editor.info"></Editorbar>
      </div>
      <div class="select">
        <el-form :model="ruleForm" ref="ruleForm">
          <el-form-item label="请选择文章分类:">
            <el-select v-model="ruleForm.value" placeholder="请选择分类" prop="value">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否可见:" prop="isshow">
            <el-switch active-color="#409eff" v-model="ruleForm.isshow"></el-switch>
          </el-form-item>
          <el-form-item label="是否置顶:" prop="istop">
            <el-switch active-color="#409eff" v-model="ruleForm.istop"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateArticle" v-show="isUpdate">保存修改</el-button>
            <el-button type="default" @click="back" v-show="isUpdate">返回</el-button>
            <el-button type="primary" v-show="!isUpdate" @click="putOutArticle(1)">发布文章</el-button>
            <el-button type="default" v-show="!isUpdate" @click="putOutArticle(2)">保存草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Editorbar from "./editor";
import "wangeditor/release/wangEditor.min.css";
import axios from "axios";
import {mapMutations} from 'vuex'
// const address = "http://192.168.31.19:3001";
const address = "http://v1.janulog.com:3001";
export default {
  inject: ["reload"],
  data() {
    return {
      editor: {
        info: ""
      },
      options: [
        { value: "HTML", label: "HTML" },
        { value: "JS", label: "JS" },
        { value: "CSS", label: "CSS" },
        { value: "log", label: "随笔" },
        { value: "face", label: "面试" }
      ],
      ruleForm: {
        value: "", // 文章分类
        isshow: true, // 是否可见
        istop: false //是否置顶
      },
      articleTitle: "无标题", //文章标题
      nowId: "", //当前文章id
      isUpdate: false, // 判断修改还是新建文章
      showLoading: false //显示loading
    };
  },
  props: {
    id: {
      type: Number,
      default: -1
    }
  },
  methods: {
    // 该方法用于返回一个布尔值
    returnBoo(str) {
      return str === "true" ? true : false;
    },
    // 更新文章
    updateArticle() {
      // console.log(this.nowId);
      this.checkuser(() => {
        axios
          .post(address + "/api/updatearticle",{
            id: this.nowId,
            title: this.articleTitle,
            main: this.editor.info,
            category: this.ruleForm.value,
            isshow: this.ruleForm.isshow,
            istop: this.ruleForm.istop
          })
          .then(res => {
            // console.log(res);
            if (res.data.code === 200) {
              this.$message({
                message: res.data.message,
                type: "success",
                center: true
              });
              // 更新文章完成后,将vuex中的新老文章置为空
              this.$store.commit('getOldArticleVal', '')
              this.$store.commit('getNewArticleVal', '')
              this.reload();
            }
          });
      });
    },
    back() {
      this.reload();
    },
    putOutArticle(num) {
      if (!this.ruleForm.value) {
        console.log(this.editor.info);
        
        this.$message({
          message: "请选择文章标签",
          type: "error",
          center: true
        });
        return;
      } else {
        this.checkuser(num => {
          // 判断是保存草稿还是发表文章
          var flag = true;
          // console.log(num);

          if (num === 2) {
            flag = false;
          }
          axios
            .post(address + "/api/newarticle", {
              title: this.articleTitle,
              main: this.editor.info,
              category: this.ruleForm.value,
              isshow: this.ruleForm.isshow,
              ispublish: flag,
              istop: this.ruleForm.istop
            })
            .then(res => {
              // console.log(res);
              if(res.data.code === 200) {
                if(num === 1) {
                  this.$message({
                    message: '发布成功',
                    type: 'success',
                    center: true
                  })
                }
                if(num === 2) {
                  this.$message({
                    message: '保存草稿成功',
                    type: 'default',
                    center: true
                  })
                }
                // 发布文章完成后,将vuex中的新老文章置为空
                this.$store.commit('getOldArticleVal', '')
                this.$store.commit('getNewArticleVal', '')
                this.reload()
              }
            });
        }, num);
      }
    },
    changeVal(val) {
      // console.log(val);
      this.editor.info = val
      // console.log(this.editor.info);
      
    }
  },
  watch: {
    id(id) {
      // console.log(id);
      this.nowId = id;
      this.isUpdate = true;
      // 显示loading 图片
      this.showLoading = true;
      this.checkuser(id => {
        axios.post(address + "/api/backgetarticle", { id: id }).then(res => {
          // console.log(res);
          if (res.data.code === 200) {
            this.editor.info = res.data.article.main;
            // console.log(this.editor.info);
            
            this.articleTitle = res.data.article.title;
            this.ruleForm.value = res.data.article.category;
            this.ruleForm.isshow = this.returnBoo(res.data.article.isshow);
            this.ruleForm.istop = this.returnBoo(res.data.article.istop);
            // 隐藏 loading
            this.showLoading = false;
            // 将当前文章内容保存在vuex中
            this.$store.commit('getOldArticleVal', res.data.article.main)
          }
        });
      }, id);
    },
    'editor.info' (val,oldVal) {
      //将新值提交给vuex
      this.$store.commit('getNewArticleVal',val)
      
    }
  },
  components: {
    Editorbar
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/createarticle.less";
</style>