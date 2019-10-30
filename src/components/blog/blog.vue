<template>
  <div class="content">博客</div>
</template>

<script>
export default {
  created() {
    this.$store.commit('getSecMusic', false)
  }
}
</script>
<style scoped>

</style>