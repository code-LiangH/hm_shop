<template>
  <el-container class="home-container">
    <!-- 头部栏 -->
    <el-header>
      <div>
        <img src="../assets/img/dianshang.png" alt="" />
        后台管理系统
      </div>
      <el-button type="info" @click="tuichu">推出登录</el-button>
    </el-header>

    <!-- //中间栏 -->
    <el-container>
      <!-- 侧边栏 菜单区-->
      <el-aside :width="iscollapse? '60px': '200px'">
        <!-- el-menu的菜单模块 -->
        <!-- unique-opened表示只能显示一个菜单，默认值为false，可以显示所有菜单 -->
        <div @click="coll">
          <span v-if="!iscollapse">折叠</span>
          <span v-else>展开</span>
        </div>
        <el-menu
          background-color="#4C4C4C"
          text-color="#ffffff"
          active-text-color="red"
          unique-opened 
          :collapse="iscollapse"   
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <!-- index的值若是唯一的，则点开一个菜单，所有菜单都会点开，所以要唯一 ，且只接受字符串-->
          <el-submenu :index="String(item.id)" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="icon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- index代表开启的路由 -->
            <el-menu-item :index="'/'+childItem.path" v-for="childItem in item.children" :key="childItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{childItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边 区域 -->
      <el-main>
        <!-- 跳转到welcome页面 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      icon: {
        125: "el-icon-user-solid",
        103: "el-icon-rank",
        101: "el-icon-shopping-bag-1",
        102: "el-icon-collection",
        145: "el-icon-tickets"
      },
      iscollapse: false
    }

  },
  async created() {    //生命周期函数，一挂载就请求到数据
    const {data: res} = await this.$http.get("menus")  
      if(res.meta.status != 200) this.$message.error(res.meta.msgs)
      this.menulist = res.data
      // console.log(this.menulist)
      // console.log(this.$http.get("menus"))
  }
  ,
  methods: {
    tuichu() {
      //退出
      //点击退出登录后，会执行以下函数，将token值清除，然后跳转到login页面。
      //如果不清空直接跳转，下次访问home页面会直接进去，因为有token值。
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    coll() {
      this.iscollapse = !this.iscollapse

    }
  },

};
</script>

<style lang="less" scoped>
.el-header {
  background-color: rgb(40, 44, 52);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 30px;

  > div {
    display: flex;
    align-items: center;
    img {
      margin-right: 20px;
    }
  }
}
.el-aside {
  background-color: #443c3c;
  .el-menu {
    border-right: none;
  }
  >div{
    text-align: center;
    color: #ffffff;
    cursor: pointer;
    line-height: 40px;
  }
}
.home-container {
  height: 100%;
}
</style>