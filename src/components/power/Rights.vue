<!--  -->
<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <el-table :data='rightsList' border stripe>
            <el-table-column type='index'></el-table-column>
            <el-table-column label='权限名称' prop='authName'></el-table-column>
            <el-table-column label='路径' prop='path'></el-table-column>
            <el-table-column label='权限等级' prop='level'>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level==='0'">一级</el-tag>    
                    <el-tag type='success' v-else-if="scope.row.level==='1'">二级</el-tag>
                    <el-tag type='warning' v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
       //import引入的组件需要注入到对象中才能使用
       data() {
           return {
               // 所有的权限列表
               rightsList:[]
           }
       },
       created() {
           // 获取所有的权限
           this.getRightsList()
       },
       methods: {
           // 获取权限列表
           async getRightsList(){
               const {data:res} = await this.$http.get('rights/list')
               if(res.meta.status !== 200) return this.$message.error('请求数据失败!')

               this.rightsList = res.data
           }
       },
   }
</script>
<style lang='less' scoped>

</style>