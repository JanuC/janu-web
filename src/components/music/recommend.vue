<template>
  <div class="musicContent">
    <div class="category">
      <span>全部</span>
      <button class="categoryBtn">选择分类</button>
      <span class="hot">热门</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const address = "http://localhost:3000";
export default {
  created() {
    axios
      .get(address + '/playlist/catlist')
      .then(res => {
        console.log(res);
        
      })
  }
}
</script>

<style lang="less" scoped>
  .musicContent {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    .category {
      width: 100%;
      height: 50px;
      border-bottom: 2px solid #b82535; 
      
      span {
        line-height: 50px;
        font-size: 20px;
      }
      .categoryBtn {
        width: 120px;
        height: 34px;
        color: #0c73ce;
        margin-left: 10px;
      }
      .hot {
        display: inline-block;
        width: 60px;
        height: 30px;
        background-color: #a80909;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        color: #fff;
        border-radius: 5px;
        box-shadow: 0.3px 0.5px 0.1px 0.1px #a80909;
      }
    }
  }
</style>