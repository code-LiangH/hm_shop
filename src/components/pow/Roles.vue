<template>
  <div>
    <!-- 面包屑视图 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card style="width:100%">
      <!-- 添加角色区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="editRolesDialogFlag = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="getRolesData" style="width:800px">
        <!-- 展开列(显示权限) -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item, index1) in scope.row.children"
              :key="index1"
              :class="['bottomborder', index1 == 0 ? 'topborder' : '', 'venter']"
            >
              <!-- 显示一级权限 -->
              <el-col :span="8">
                <el-tag closable @close="removeTagById(scope.row, item.id)">
                  {{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 显示二级、三级权限权限 -->
              <el-col :span="16">
                <el-row v-for="(item2, index2) in item.children" :key="index2">
                  <el-col :span="8">
                    <el-tag type="success" closable @close="removeTagById(scope.row, item2.id)">{{
                      item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="16">
                    <el-tag
                      v-for="(item3, index3) in item2.children"
                      :key="index3"
                      closable
                      @close="removeTagById(scope.row, item3.id)"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"> </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="editRole(scope.row.id)"
            ></el-button>
            <!-- 分配权限按钮 -->
            <el-button
              type="danger"
              icon="el-icon-setting"
              size="mini"
              @click="packRight(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="提示" :visible.sync="editRolesDialogFlag" width="30%">
      <el-form ref="form" :model="editRolesUser" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editRolesUser.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesUser.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="editRoles()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="showRightFlag" width="30%" @close="setcheckList()">
      <!-- 树形控件 -->
      <el-tree
        :data="getRight"
        :props="treeProp"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkList"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRightFlag = false">取 消</el-button>
        <el-button type="primary" @click="alloRight()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getRolesData: [],
      editRolesDialogFlag: false, //添加角色对话框
      showRightFlag: false, //分配权限对话框
      editRolesUser: {
        //添加角色的信保存的对象
        roleName: "",
        roleDesc: "",
      },
      getRight: [], //获得到的全部权限
      treeProp: {
        //树型控件绑定的对象
        label: "authName",
        children: "children",
      },
      //绑定的被选中的数据
      checkList: [],
      roleId: "",
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    //显示角色列表
    async getRoles() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200) return this.$message.error("获取错误");
      this.getRolesData = res.data;
    },
    //添加角色（点击弹窗里的“确定”触发）
    async editRoles() {
      this.editRolesDialogFlag = false;
      const { data: res } = await this.$http.post("roles", this.editRolesUser);
      if (res.meta.status != 201) return this.$message.error("错误");
      this.getRoles();
      this.$message.success("添加角色成功");
    },
    //删除角色（点击删除图标触发）
    async editRole(id) {
      const confirmResult = await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult != "confirm") return this.$message.info("取消删除");
      //删除角色
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status != 200) return this.$message.success("取消删除");
      this.$message.success("删除用户成功");
      this.getRoles();
    },

    //删除标签(根据id)
    async removeTagById(role, rightid) {
      //弹窗提示用户是否删除
      const confirmResult = await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult != "confirm") return this.$message.info("取消删除");
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`);
      if (res.meta.status != 200) return this.$message.error("删除权限失败");
      this.$message.success("删除角色成功");
      //接受返回新数据
      role.children = res.data;
    },

    //分配权限
    async packRight(role) {
      //将当前的角色id传送给roleId
      this.roleId = role.id;
      this.showRightFlag = true;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) return this.$message.error("分配失败");
      this.getRight = res.data;
      //调用获取的三级权限函数
      this.getId(role, this.checkList);
    },

    //获取所有的三级权限的id
    getId(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getId(item, arr));
    },
    //关闭对话框时，清空checkList数组里的数据
    setcheckList() {
      this.checkList = [];
    },

    //点击确定将勾选的权限分配
    async alloRight() {
      const keys = [...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys()];
      //拼接为字符串
      const id = keys.join(",");
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: id });
      if (res.meta.status != 200) return this.$message.error("分配失败");
      this.$message.success("分配成功");
      this.getRoles();
      this.showRightFlag = false;
    },
  },
};
</script>

<style lang="less" scope>
.el-tag {
  margin: 7px;
}
.topborder {
  border-top: 1px solid;
}
.bottomborder {
  border-bottom: 1px solid;
}
.venter {
  display: flex;
  align-items: center;
}
</style>
