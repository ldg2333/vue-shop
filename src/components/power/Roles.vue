<!--  -->
<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区域 -->
        <el-row>
            <el-col>
                <el-button type='primary'>添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表区域 -->
        <el-table :data='rolelist' border stripe>
            <!-- 展开列 -->
            <el-table-column type='expand'>
                <template slot-scope="scope">
                    <el-row :class="['bdbottom',index === 0 ? 'bdtop' : '','vcenter']" v-for="(item,index) in scope.row.children" :key="item.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span='5'>
                            <el-tag @close='removeRightById(scope.row,item.id)' closable>{{item.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级和三级权限 -->
                        <el-col :span='19' >
                            <!-- 通过 for 循环嵌套渲染二级权限 -->
                            <el-row :class="[index === 0 ? '' : 'bdtop','vcenter']" v-for="(item1,index) in item.children" :key="item1.id">
                                <el-col :span='6'>
                                    <el-tag @close='removeRightById(scope.row,item1.id)' closable type='success'>{{item1.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span='18'>
                                    <el-tag @close='removeRightById(scope.row,item2.id)' closable type='warning' v-for="(item2, index) in item1.children" :key="index">
                                        {{item2.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label='#' type='index'></el-table-column>
            <el-table-column label='角色名称' prop='roleName'></el-table-column>
            <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
            <el-table-column label='操作' width='300px'>
                <template slot-scope="scope">
                     <el-button size='mini' type="primary" icon="el-icon-edit">编辑</el-button>
                     <el-button size='mini' type="danger" icon="el-icon-delete">删除</el-button>
                     <el-button size='mini' type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>   
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
    title="提示"
    :visible.sync="setRightDialogVisible"
    width="50%"
    @close='setRightDialogClosed'
    >
    <!-- 树形控件 -->
    <el-tree ref='treeRef' :default-checked-keys='defkeys' default-expand-all node-key='id' show-checkbox :data="rightslist" :props="treetProps" >

    </el-tree>
    <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
    </span>
    </el-dialog>
</div>
</template>

<script>
   //这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
   //例如：import 《组件名称》 from '《组件路径》';

   export default {
       //import引入的组件需要注入到对象中才能使用
       data() {
           return {
            // 所有角色列表数据
            rolelist:[],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible:false,
            // 所有权限的数据
            rightslist:[],
            // 树形控件的属性绑定对象
            treetProps:{
                children:'children',
                label:'authName'
            },
            // 默认选中的节点的 id 值数组
            defkeys:[],
            // 当前即将分配权限的角色 id
            roleId:''
           }
       },
       created() {
           this.getRolesList()
       },
       methods: {
           // 获取所有角色的列表
           async getRolesList(){
               const {data:res} = await this.$http.get('roles')
               if(res.meta.status !== 200) return this.$message.error('获取数据失败!')

               this.rolelist = res.data
           },
           // 根据 id 删除对应的权限
           async removeRightById(roles,rightId){
               // 弹框提示用户是否要删除
               const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).catch(err => err)
            
              if(confirmResult !== 'confirm') return this.$message.info('已取消删除!')

              const {data: res} = await this.$http.delete(`roles/${roles.id}/rights/${rightId}`)  

              if(res.meta.status !== 200) return this.$message.error('删除权限失败!')

              this.$message.success('删除权限成功！')  
              roles.children = res.data
           },
           // 展示分配权限的对话框
           async showSetRightDialog(role){

               this.roleId = role.id

               // 获取所有权限的数据
               const {data:res} = await this.$http.get('rights/tree')
               if(res.meta.status !== 200) return this.$message.error('获取权限数据失败!')
               
               // 获取到的权限数据保存到 data 中
               this.rightslist = res.data 
               
               // 递归获取三级节点的 Id
               this.getLeafKeys(role,this.defkeys)

               this.setRightDialogVisible = true
           },
           // 通过递归的形式 获取角色下所有三级权限的 id 并保存到 defKeys 数组中
           getLeafKeys(node,arr){
               // 如果当前 node 节点不包含 children 属性 则是三级节点
               if(!node.children){
                   return arr.push(node.id)
               }

               node.children.forEach(item => {
                   this.getLeafKeys(item,arr)
               })
           },
           // 监听分配权限对话框的关闭事件
           setRightDialogClosed(){
               // 防止数据多余 每次调用需要将 defkeys 清空再赋值
               this.defkeys = []
           },
           // 点击为角色分配权限
           async allotRights(){
               const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedNodes()]
               const idStr = keys.join(',')
               const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
               if(res.meta.status !== 200) return this.$message.error('分配权限失败!')

               this.$message.success('分配权限成功!')
               this.getRolesList()
               this.setRightDialogVisible = false
           }
       },
   }
</script>
<style lang='less' scoped>
    .el-tag{
        margin: 7px;
    }

    .bdtop{
        border-top: 1px solid #eee;
    }

    .bdbottom{
        border-bottom: 1px solid #eee;
    }

    .vcenter{
        display: flex;
        align-items: center;
    }
</style>