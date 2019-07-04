<template>
  <div class="wrap">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="page">
        <!-- <div class="banner">
          <ul>
            <li>
              <img src="/static/img/pageBg.png" alt="#">
            </li>
            <li></li>
            <li></li>
          </ul>
          <div class="circleWrap">
            <ul>
              <li class="on"></li>
              <li></li>
              <li class="last"></li>
            </ul>
          </div>
        </div> -->
        <div class="pageRight">
          <div class="welcome"></div>
          <div class="account">
            <div class="accountWrap">
              <div class="accountBg"></div>
            </div>
            <el-input
              v-model="loginForm.username"
              name="username"
              type="text"
              auto-complete="on"
              placeholder="username"
            />
          </div>
          <div class="account">
            <div class="accountWrap">
              <div class="accountBg"></div>
            </div>
            <el-input
              :type="pwdType"
              v-model="loginForm.password"
              name="password"
              auto-complete="on"
              placeholder="password"
              @keyup.enter.native="handleLogin"
            />
          </div>
          <button type="button" @click="handleLogin">登录</button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "admin"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch((e) => {
              console.log(e)
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
* {
  margin: 0;
  padding: 0;
}
.login-container {
  height: 100%;
}
li {
  list-style: none;
}
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  // background: url("/static/img/bg.png") no-repeat;
  background-size: 100% 100%;
}
.wrap .page {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 1000px;
  height: 560px;
}
.wrap .page .banner {
  position: relative;
  width: 560px;
  height: 100%;
  overflow: hidden;
}
.wrap .page .banner > ul {
  display: flex;
  width: 300%;
  height: 100%;
}
.wrap .page .banner > ul li {
  width: 560px;
  height: 100%;
}
.wrap .page .banner > ul li img {
  width: 100%;
  height: 100%;
}
.wrap .page .banner .circleWrap {
  position: absolute;
  bottom: 60px;
  left: 50%;
  width: 50px;
  height: 10px;
  margin-left: -25px;
}
.wrap .page .banner .circleWrap ul {
  display: flex;
}
.wrap .page .banner .circleWrap ul li {
  width: 10px;
  height: 10px;
  background: #ffffff;
  border: 1px solid #00dfb9;
  border-radius: 50%;
}
.wrap .page .banner .circleWrap ul li.on {
  background: #00dfb9;
  border: 0px;
}
.wrap .page .banner .circleWrap ul li:not(.last) {
  margin-right: 10px;
}
.wrap .page .pageRight {
  width: 440px;
  height: 560px;
  padding-top: 160px;
  margin:auto auto;
  background: white;
  box-sizing: border-box;
}
.wrap .page .pageRight .welcome {
  width: 149px;
  height: 13px;
  margin: auto;
  background: url("/static/img/欢迎@2x.png") no-repeat;
  background-size: 100% 100%;
}
.wrap .page .pageRight .account {
  display: flex;
  width: 260px;
  height: 46px;
  margin: 22px auto 0;
  background: #ffffff;
  border: 1px solid #666666;
}
.wrap .page .pageRight .account .accountWrap {
  width: 46px;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
}
.wrap .page .pageRight .account .accountWrap .accountBg {
  width: 16px;
  height: 16px;
  background: url("/static/img/用户名@2x.png") no-repeat;
  background-size: 100% 100%;
}
.wrap .page .pageRight .account:nth-child(3) .accountWrap .accountBg {
  background: url("/static/img/密码@2x.png") no-repeat;
  background-size: 100% 100%;
}
.wrap .page .pageRight .account input {
  height: 100%;
  font-size: 14px;
  text-indent: 5px;
  font-family: HiraginoSansGB-W3;
  font-weight: normal;
  color: #333333;
  border: none;
}
.wrap .page .pageRight .account input:focus {
  outline-width: 0px;
}
.wrap .page .pageRight button {
  width: 260px;
  height: 46px;
  font-size: 16px;
  font-family: HiraginoSansGB-W3;
  font-weight: normal;
  color: #ffffff;
  margin: 23px 90px 0;
  border: 0px;
  background: #00dfb9;
}
</style>
