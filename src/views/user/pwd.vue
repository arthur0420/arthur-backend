<template>
  <div class="container pwd">
     <el-form :rules="pwdRules" ref="pwdEdit" :model="form">
      <el-form-item label="原密码" :label-width="formLabelWidth" prop="oldpsw">
        <el-input v-model="form.oldpsw" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="新密码" :label-width="formLabelWidth" prop="psw">
        <el-input v-model="form.psw" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="confirm_pwd">
        <el-input v-model="form.confirm_pwd" autocomplete="off"></el-input>
      </el-form-item>
      
    </el-form>
     <div >
        <el-button type="primary" @click="pwdEdit('pwdEdit')">确 定</el-button>
      </div>
  </div>
</template>
<script>
import { fast } from "@/api/fast";
export default {
  data() {
    return {
      form: {},
      formLabelWidth: "100px",
      pwdRules: {
        psw: [{ required: true, trigger: "blur", message: "请输入新密码" }],
        oldpsw: [{ required: true, trigger: "blur", message: "请输入原密码" }],
        confirm_pwd: [
          { required: true, trigger: "blur", message: "请确认新密码" }
        ]
      }
    };
  },
  methods: {
      pwdEdit(formName) {
       this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.psw !== this.form.confirm_pwd) {
              return this.$message({
                        message: '两次密码不一致' ,
                        type: 'error',
                        duration: 5 * 1000
                    })
          }  
          let user  = localStorage.getItem('userInfo')
          user = JSON.parse(user)
          this.form.username = user.username
          fast("userPwdChange", this.form).then(res => {
            this.$message.success("提交成功！");
            this.editShow = false;
            this.fetchData();
          });
        }
      });
      }
  }
};
</script>
<style lang="scss">
    .pwd {
        input {
            width: 300px;
        }
    }
</style>

