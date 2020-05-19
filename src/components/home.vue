<!--  -->
<template>
<div>
    home 组件
    <el-button type='info' @click='logout'>退出</el-button>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
       //import引入的组件需要注入到对象中才能使用
       methods: {
           logout(){
               // 清空 sessionStorage
               window.sessionStorage.clear()
               // 将路由重定向到 登录页
               this.$router.push('/login')
           }
       },
   }
</script>
<style lang='less' scoped>

</style>