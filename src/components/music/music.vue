<template>
  <div class="content" :class="{paddingbottom: this.$store.state.showPlayMusic}">

    <router-view></router-view>
      
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

