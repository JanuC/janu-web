<template>
  <div class="writeMain">
    <div class="writeLeft">
      <div class="writeNew" @click="createNew">
        <i class="fa fa-plus-circle" aria-hidden="true"></i>
        <span>新建文章</span>
      </div>
      <ul class="list" ref="ul">
        <li
          :class="{selectli: index === selectArticleIdx}"
          v-for="(item,index) in articleList"
          :key="index"
          @click="changeArticle(index)"
        >
          <div class="li-left">
            <i class="fa fa-file-text-o" aria-hidden="true"></i>
          </div>
          <div class="li-right">
            <h3>{{item.title}}</h3>
            <span :class="{green: item.ispublish === 'true'}">{{item.ispublish === 'true' ? '已发布' : '草稿'}}{{item.isshow === 'true' ? '(可见)' : '(不可见)'}}</span>
            <div class="setting">
              <i class="fa fa-trash-o" aria-hidden="true" @click="delArticle(index)"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="writeRight">
      <div class="r-top">
        <input type="text" class="title" v-model="title" @input="updateTitle" />
      </div>
      <!-- <div id="editor" style="height: 100%"></div> -->
      <template lang="html">
        <div class="editorbar">
          <Editorbar v-model="editor.info" :isClear="isClear" @change="change" :length="articleList.length"></Editorbar>
        </div>
      </template>
      <div class="r-bottom">
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
          <el-form-item>
            <el-button type="primary" @click="sendArticle(1)" v-show="!published">发表文章</el-button>
            <el-button type="primary" @click="updateArticle()" v-show="published">保存修改</el-button>
            <el-button @click="sendArticle(2)" v-show="!published">保存草稿</el-button>
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
// const address = 'http://v1.janulog.com:80'
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
  created() {
    // console.log(location.hash);
    // 进入页面,发送请求获取文章数据
    // 先确认身份是否合法
    this.checkuser(() => {
      // 发送请求获取文章列表
      axios.post(address + "/api/getarticle").then(res => {
        console.log(res);
        if (res.data.code === 200) {
          let arr = [];
          res.data.articlelist.forEach(item => {
            arr.push(item);
          });
          this.articleList = arr;
          
          // 选中第一篇文章
          this.changeArticle(0);
        }
      });
    });
  },
  methods: {
    change() {
      // console.log(this.editor.info);
    },
    // 新建文章功能
    createNew() {
      // console.log(this.$refs.ul);
      let obj = { title: "无标题", main: "", ispublish: false, isshow: "true" };
      this.ruleForm.value = ''
      this.articleList.push(obj);
      this.changeArticle(this.articleList.length - 1);
    },
    // 修改显示文章
    changeArticle(idx) {
      this.selectArticleIdx = idx;
      this.selectArticle = this.articleList[idx];
      this.title = this.articleList[idx].title;
      this.editor.info = this.articleList[idx].main;
      // 获取当前文章的分类
      this.ruleForm.value = this.selectArticle.category;
      // 获取当前文章是否可见
      if (this.selectArticle.isshow === "true") {
        this.ruleForm.isshow = true;
      } else {
        this.ruleForm.isshow = false;
      }
      // 判断文章是否已发表
      if (this.selectArticle.ispublish === "true") {
        this.published = true;
      } else {
        this.published = false;
      }
    },
    // 同步input框和li中的title
    updateTitle() {
      this.selectArticle.title = this.title;
    },
    // 该功能用于发布文章或者保存草稿
    // num: 1: 发布文章 2: 保存草稿
    sendArticle(num) {
      if (!this.ruleForm.value) {
        this.$message({
          message: "请选择文章标签",
          type: "error",
          center: true
        })
        return
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
              title: this.title,
              main: this.editor.info,
              category: this.ruleForm.value,
              isshow: this.ruleForm.isshow,
              ispublish: flag
            })
            .then(res => {
              console.log(res);
              if (res.data.code === 200) {
                // 发表成功
                this.$message({
                  message: res.data.message,
                  type: "success",
                  center: true
                });
                // 获取返回的所有文章数据
                let arr = [];
                res.data.data.forEach(item => {
                  arr.push(item);
                });
                // 更新 文章列表
                this.articleList = arr;
                
                this.changeArticle(0);
              }
            });
        },num);
      }
    },
    // 该功能用于删除文章
    delArticle(index) {
      let idx = this.articleList[index].id
      
      // 先提醒用户是否确认删除文章
      this.$confirm("确认删除改文章吗?", "删除文章", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if(idx) {
            // 已经上传到服务器
            this.checkuser((idx) => {
              console.log(this);
              
              axios.post(address + "/api/delarticle", { id: idx }).then(res => {
              console.log(res);
              if (res.data.code === 200) {
                // 操作成功
                this.$message({
                  message: res.data.message,
                  type: "success",
                  center: true
                });
                // 更新页面数据
                if(res.data.data.length != 0) {
                  let arr = [];
                  res.data.data.forEach(item => {
                    arr.push(item);
                  })
                  this.articleList = arr;
                  this.changeArticle(0);
                  }else {
                    this.articleList = []
                    this.ruleForm.value = ''
                    this.editor.info = ''
                  }
              } else {
                // 操作失败
                this.$message({
                  message: "操作失败",
                  type: "error",
                  center: true
                });
              }
            })
            
            
          },idx)
          }else {
            // 未上传到服务器
            this.articleList.splice(index,1)
          }
        })
        .catch(() => {
          console.log(2);
        });
    },
    // 该功能用于更新文章
    updateArticle() {
      let id = this.selectArticle.id;
      this.checkuser((idx) => {
        console.log(this.editor.info);
        
        
        axios
          .post(address + '/api/updatearticle',this.selectArticle)
          .then(res => {
           if(res.data.code === 200) {
             this.$message({
               message: '保存成功',
               type: 'success',
               center: true
             })
            let arr = []
            res.data.data.forEach(item => {
              arr.push(item)
            })
            this.articleList = arr
            this.changeArticle(0)
           }else {
             this.$message({
               message: '操所失败',
               type: 'error',
               center: true
             })
           }
          })
      },id);
    }
  },
  watch: {
    // 监听页面的数据,发生改变赋值给 selectArticle
    "ruleForm.value"(newVal, oldVal) {
      // 监听分类是否改变
      this.selectArticle.category = newVal;
    },
    "ruleForm.isshow"(newVal, oldVal) {
      // 监听是否可见
      this.selectArticle.isshow = newVal;
    },
    title(newVal, oldVal) {
      this.selectArticle.title = newVal;
    },
    "editor.info"(newVal, oldVal) {
      this.selectArticle.main = newVal;
    },
    // 'articleList.length'(newVal,oldVal) {
    //   console.log(newVal,oldVal);
      
    // }
  },
  components: {
    Editorbar
  }
};
</script>


<style lang="less" scoped>
@import "../../assets/css/write.less";
</style>