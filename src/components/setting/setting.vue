<template>
  <div class="content">setting</div>
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