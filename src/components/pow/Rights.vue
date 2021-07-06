<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片数据区域 -->
    <el-card>
      <el-table :data="rightsData" style="width: 100%" border stripe>
        <!-- 编号列 -->
        <el-table-column type="index"> </el-table-column>

        <!-- 权限名称列 -->
        <el-table-column prop="authName" label="权限" width="180" align="center"> </el-table-column>

        <!-- 路径名称列 -->
        <el-table-column prop="path" label="路径" width="180" align="center"> </el-table-column>

        <!-- 等级列 -->
        <el-table-column prop="level" label="等级" width="180" align="center">
          <template v-slot="scope">
            <!-- 获取的数据level对其值进行判断，然后分等级 -->
            <el-tag v-if="scope.row.level <= 1">等级一</el-tag>
            <el-tag type="success" v-if="scope.row.level == 2">等级二</el-tag>
            <el-tag type="info" v-if="scope.row.level == 3">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //列表数据数据
      rightsData: [],
    };
  },

  //挂载时就请求数据
  created() {
    this.getrighthData();
  },

  methods: {
    //发起请求数据的网络请求
    async getrighthData() {
      //发起请求
      const { data: res } = await this.$http.get("rights/list");
      //判断请求是否成功
      if (res.meta.status != 200) return this.$message.error("请求失败");
      //得到的数据传给rightsData
      this.rightsData = res.data;
    },
  },
};
</script>

<style scope>
.breadcrumb {
  padding-bottom: 10px;
}
</style>
