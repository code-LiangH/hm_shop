<template>
  <div>
      <el-button type="info" @click="tuichu">推出登录</el-button>
  </div>
</template>

<script>
export default {
    methods: {
        tuichu() {    //退出
            //点击退出登录后，会执行以下函数，将token值清除，然后跳转到login页面。
            //如果不清空直接跳转，下次访问home页面会直接进去，因为有token值。
            window.sessionStorage.clear()
            this.$router.push("/login")
        }
    }
}
</script>

<style>

</style>