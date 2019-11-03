<template>
  <div class="content">

    <router-view></router-view>
      <!-- <div class="searchInput">
        <input class="input" v-model="searchVal" placeholder="想听听啥？">
      </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return{

    }
  },
  created() {
    this.$store.commit('getSecMusic', true) 
  }
}
</script>

<style lang="less" scoped>
  @import "../../assets/css/common.less";
  @import "../../assets/css/music.less";

</style>

