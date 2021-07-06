<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb class="bread">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row class="fenlei">
        <el-col>
          <el-button type="primary" @click="showAddcateDialog()">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <!-- 是否有效列 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="!scope.row.cat_deleted"
            class="el-icon-circle-check paixu"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-circle-closef paixu"></i>
        </template>

        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 操作列编辑、删除按钮 -->
        <template slot="caozuo" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-edit" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 8, 20]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加对话框" :visible.sync="cateDialogFlag" width="30%">
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <!-- 添加分类输入框 -->
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <!-- 父级分类的联机选择器-->
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectKey"
            :options="parentCateList"
            :props="cascaderProps"
           
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="cateDialogFlag = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取到的商品分类总数据
      cateList: [],
      //获取到的总数据条数
      total: 0,
      //请求参数（获取商品分类的发送的）
      querInfo: {
        type: 3, //3级分类
        pagenum: 1, //当前页码值
        pagesize: 5, //每页显示5条数据
      },
      //父级分类的列表
      parentCateList: [],
      //添加分类对话框是否弹出
      cateDialogFlag: false,
      //添加分类的表单绑定对象
      addCateForm: {
        //添加分类名称的属性
        cat_name: "",
        //添加分类的id,默认为0
        cat_id: 0,
        //添加分类的等级，默认为0
        cat_level: 0,
      },
      //添加分类的表单验证对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      //选中的父级分类数组
      selectKey: [],
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template", //表示将当前列定义为模板列
          template: "isok", //模板名称
        },
        {
          label: "排序",
          type: "template", //表示将当前列定义为模板列
          template: "order", //模板名称
        },
        {
          label: "操作",
          type: "template",
          template: "caozuo",
        },
      ],
    };
  },
  methods: {
    //获取商品分类总数据
    async getcateList() {
      const { data: res } = await this.$http.get("categories", { params: this.querInfo });
      if (res.meta.status != 200) return this.$message.error("获取错误");
      //获取到的数据给cateList数组
      this.cateList = res.data.result;
      //获取到的条数给total
      this.total = res.data.total;
    },
    //监听pagesize的改变,newsize表示改变后的新页
    handleSizeChange(newsize) {
      this.querInfo.pagesize = newsize;
      this.getcateList();
    },
    //监听当前是第几页
    handleCurrentChange(newpage) {
      this.querInfo.pagenum = newpage;
      this.getcateList();
    },
    //点击添加分类按钮，弹出的对话框
    showAddcateDialog() {
      //调用获取父级分类的的数据列表
      this.getParentCateList();
      this.cateDialogFlag = true;
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", { params: { type: 2 } });
      if (res.meta.status != 200) return this.$message.error("获取失败");
      this.parentCateList = res.data;
    },
    //选择器发生变化时触发该函数
   
  },
  created() {
    //一开始就发起请求，获取商品分类数据
    this.getcateList();
  },
};
</script>

<style lang="less" scope>
.bread {
  margin-bottom: 7px;
}
.paixu {
  font-size: 20px;
}
.fenlei {
  margin-bottom: 20px;
}
</style>
