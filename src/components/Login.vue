<template>
  <div class="login_container">
    <div class="login_index">
      <!-- 头像logo -->
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 表单 -->
      <div class="inpu">
        <el-form label-width="0" :model="form" :rules="rules" ref="loginref">
          <!-- 用户名 -->
          <!-- :rules代表总规则，prop代表规则里面的具体是哪几个，prop需要写在item里面 -->
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              prefix-icon="iconfont icon-yonghu"
            ></el-input>
          </el-form-item>

          <!-- 密码 (重要！prop不能为password，否则有错误-->
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              prefix-icon="iconfont icon-mima"
              type="password"
            ></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btn" style="width: 300px">
            <el-button type="primary" @click="tijiaoxiaoyan">登录</el-button>
            <el-button type="info" @click="chongzhi">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      //对username、userpassword进行检验
      rules: {
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
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 9, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //重置表单方法，先通过ref=“属性名”在form上拿到该属性，再通过this.$refs.loginref拿到该属性
    chongzhi() {
      // this.$refs.loginref.resetField();
      this.$refs.loginref.resetFields();
    },
    tijiaoxiaoyan() {
      //先通过validate函数判断检验格式是否成功，若成功flag为true，否则为false
      //发送axios请求
      this.$refs.loginref.validate(async (flag) => {
        if (!flag) return;
        //以下是axios请求，axios实际上是对promise函数的封装，里面有个solve()函数，里面是拿到的请求结果数据，通过await，得到它的请求结果数据，再解构给对象{data:rel}
        const { data: rel } = await this.$http.post("login", this.form);
       
       //若成功登录则rel.meta的值为200，然后弹出弹框
        if (rel.meta.status != 200) return this.$message.error("登录失败")
        else this.$message.success("登录成功")

        //将登录成功之后的token保存到客户端的sessionStorage，（rel里面有个token属性）
        window.sessionStorage.setItem("token",rel.data.token);

        //登录成功之后跳转到主页面
        this.$router.push("/home")
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: black;
  height: 100%;
}
.login_index {
  width: 450px;
  height: 350px;
  background-color: #ffffff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .logo {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -40%);
    border-radius: 50%;
    background-color: #eedede;
    padding: 8px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: gray;
    }
  }
}
.btn {
  display: flex;
  justify-content: flex-end;
}
.inpu {
  position: absolute;
  top: 110px;
  left: 80px;
}
</style>