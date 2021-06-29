<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/" class="card">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 阑珊布局 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- 双向绑定要搜索的内容queryInfo.query, 添加清空键， 给清空键绑定事件，重新返回响应参数 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUseList"
          >
            <!-- 点击搜索按钮，即可重新返回响应参数 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUseList"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <!-- 点击创建用户，弹出对话框 -->
          <el-button type="primary" @click="addDialog = !addDialog"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格处理区域，不需要v-for,只需绑定data就行 -->
      <el-table :data="userlist" style="width: 100%" border class="table">
        <!-- 添加索引列，只需添加type为index就行 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="" label="状态">
          <!-- 作用域插槽，相当于替换了prop里的内容 -->
          <template v-slot="scope">
            <!-- 开关 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userstateChange(scope.row)"
            ></el-switch
          ></template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template v-slot="scope">
            <!-- 修改/删除/分配按钮 插槽-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <!--  :visible.sync的值若为true，则弹出 -->
    <el-dialog
      title="请输入用户信息"
      :visible.sync="addDialog"
      width="50%"
      @close="addClose"
    >
      <!-- 弹出对话框里的表单 -->
      <el-form
        :model="addUser"
        :rules="addRules"
        ref="addUserRef"
        label-width="70px"
      >
        <!-- 添加用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <!-- 添加密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <!-- 添加邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <!-- 添加电话 -->
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserCommit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogShow" width="30%">
      <el-form ref="formEdit" :model="editSelectUser" label-width="80px">
        <!-- 用户名栏 -->
        <el-form-item label="姓名">
          <el-input v-model="editSelectUser.username" disabled></el-input>
        </el-form-item>
        <!-- 邮箱栏 -->
        <el-form-item label="邮箱">
          <el-input v-model="editSelectUser.email"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机">
          <el-input v-model="editSelectUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="editUserForm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUseList();
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      var regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (regEmail.test(value)) return callback();
      callback(new Error("请输入合法邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      var regMobile = /^1[3|4|5|7|8][0-9]{9}$/;
      if (regMobile.test(value)) return callback();
      callback(new Error("请输入合法手机号"));
    };
    return {
      queryInfo: {
        query: "", //搜索内容
        pagenum: 1, //当前是第几页
        pagesize: 5, //每页有多少条
      },
      userlist: [],
      total: 0,
      addDialog: false, //添加用户数据对话框默认为false
      editDialogShow: false, //修改用户对话框默认为false
      editSelectUser: {},
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      }, //添加用户表单数据
      addRules: {
        //用户规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 11,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      }, //添加用户规则
    };
  },
  methods: {
    async getUseList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });

      if (res.meta.status != 200) return this.$message.error("获取失败");
      (this.userlist = res.data.users), (this.total = res.data.total);
    },
    handleSizeChange(newsize) {
      //监听当前的每页多少条数据(里面的参数是当前每页多少条)
      // console.log(newsize)
      this.queryInfo.pagesize = newsize; //传给当前的请求参数
      this.getUseList(); //变成新的每页多少条数据时，重新请求，获取响应参数
    },
    handleCurrentChange(newpage) {
      //监听当前是第几页（里面的参数是当前的第几页）
      // console.log(newpage)
      this.queryInfo.pagenum = newpage; //传给当前的请求参数
      this.getUseList(); //变成新的第几页时，重新请求，获取响应参数
    },
    async userstateChange(data) {
      // console.log(data)      //获取当前的数据对象
      const { data: res } = await this.$http.put(
        `users/${data.id}/state/${data.mg_state}`
      ); //发送put请求，修该开关状态

      if (res.meta.status != 200) return this.$message.error("更新用户失败");
      this.$message.success("更新用户成功！");
    },
    addClose() {
      this.$refs.addUserRef.resetFields();
    },
    addUserCommit() {
      //提交判断，若成功，则valid为true
      this.$refs.addUserRef.validate(async (valid) => {
        console.log(this.addUser);
        const { data: res } = await this.$http.post("users", this.addUser);
        if (res.meta.status != 201) return this.$message.error("添加失败");
        this.$message.success("添加用户成功");
        this.addDialog = false;
        this.getUseList();
      });
    },
    // 修改用户对话框
    async showEditDialog(id) {
      this.editDialogShow = true;
      // console.log(id);
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("失败");
      // console.log(res);
      this.editSelectUser = res.data;
      this.editDialogShow = true;
    },
    //修改用户时点击确定时的表单验证
     editUserForm() {
      this.$refs.formEdit.validate( async valid => {
        if(valid)
           {
             const {data: res} = await this.$http.put("users/"+this.editSelectUser.id,{
               email: this.editSelectUser.email,
               mobile: this.editSelectUser.mobile
             })
             if(res.meta.status != 200) return this.$message.error("失败")
           }
        
        //关闭对话框
        this.editDialogShow = false
        //更新数据列表
        this.getUseList()
        //提示修改成功
        this.$message.success("修改成功")

      })
    },
    //根据id值删除id值
    async removeUserById(id){
      //弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继t续?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消', 
          type: 'warning'
        }
      ).catch(err => err)
      if(confirmResult != "confirm") return this.$message.info("已取消删除")

      //删除用户
      const {data: res} = await this.$http.delete("users/"+id)
     
      if(res.meta.status !=200) return this.$message.success("删除失败")

      this.$message.success("删除用户成功！")
      this.getUseList()
    }
  },
};
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 15px;
}
.table {
  margin-top: 16px;
}
</style>