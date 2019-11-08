<template>
  <div class="article">
    <div class="articleTitle">
       <a href="javascript: void(0)">新建文章</a>
       <div class="right"><i class="fa fa-sign-out" aria-hidden="true">退出</i></div>
    </div>
    <div class="articleMain">
      <ul>
        <li>
          <h2 class="title">文章标题</h2>
          <div class="btn">
            <span>编辑</span>
            <span>删除</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="less" scoped>
 @import '../../assets/css/article.less';
</style>