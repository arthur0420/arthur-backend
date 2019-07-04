<template>
  <div class="container">
    <div class="filter-container">
      <el-button class="filter-item" type="success" @click="handleEdit()" icon="el-icon-plus">添加</el-button>
    </div>
    <el-table
      ref="listTable"
      v-loading="listLoading"
      element-loading-text="Loading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column align="center" label="用户名" width="80">
        <template slot-scope="scope">{{ scope.row.username?scope.row.username:'-' }}</template>
      </el-table-column>

      <el-table-column align="center" label="昵称" width="80">
        <template slot-scope="scope">{{ scope.row.nickname?scope.row.nickname:'-' }}</template>
      </el-table-column>

      <el-table-column align="center" label="电话" width="80">
        <template slot-scope="scope">{{ scope.row.phone?scope.row.phone:'-' }}</template>
      </el-table-column>

      <el-table-column align="center" label="备注" width="80">
        <template slot-scope="scope">{{ scope.row.remark?scope.row.remark:'-' }}</template>
      </el-table-column>

      <el-table-column align="center" label="角色" width="80">
        <template slot-scope="scope">{{ scope.row.role?scope.row.role:'-' }}</template>
      </el-table-column>

      <el-table-column class-name="status-col" label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="del(scope.row.username)">删除</el-button>
          <el-button type="warning" @click="reset(scope.row.username)">重置密码</el-button>
          <el-button type="primary" @click="handlePwdEdit(scope.row)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--对话相关开始-->
    <!--编辑-->
    <el-dialog title="编辑" v-if="editShow" top="10px" class="editDialog" :visible.sync="editShow">
      <el-form :rules="rules" ref="formEdit" :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="b">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="用户电话" :label-width="formLabelWidth" prop="b">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="用户角色" :label-width="formLabelWidth" prop="role">
          <el-input v-model="form.role" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editShow = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
    <!--对话相关结束-->

    <!--编辑-->
    <el-dialog
      title="编辑"
      v-if="pwdEditShow"
      top="10px"
      class="editDialog"
      :visible.sync="pwdEditShow"
    >
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdEditShow = false">取 消</el-button>
        <el-button type="primary" @click="pwdEdit('pwdEdit')">确 定</el-button>
      </div>
    </el-dialog>
    <!--对话相关结束-->
  </div>
</template>
<script>
import { fast } from "@/api/fast";
export default {
  data() {
    return {
      listLoading: false,
      list: [],
      editShow: false,
      pwdEditShow: false,
      form: {},
      formLabelWidth: "100px",
      rules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" }
        ],
        nickname: [
          { required: true, trigger: "blur", message: "请输入用户昵称" }
        ],
        role: [{ required: true, trigger: "blur", message: "请输入用户角色" }]
      },
      pwdRules: {
        psw: [{ required: true, trigger: "blur", message: "请输入新密码" }],
        oldpsw: [{ required: true, trigger: "blur", message: "请输入原密码" }],
        confirm_pwd: [{ required: true, trigger: "blur", message: "请确认新密码" }],
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.listLoading = true;
      fast("userlist").then(data => {
        this.listLoading = false;
        this.list = data;
      });
    },
    handleEdit(data) {
      if (data) {
        this.form = data;
      } else {
        this.form = {};
      }
      this.editShow = true;
    },
    handlePwdEdit(data) {
      this.form = data;
      this.pwdEditShow = true;
    },
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
          fast("userPwdChange", this.form).then(res => {
            this.$message.success("提交成功！");
            this.pwdEditShow = false;
            this.fetchData();
          });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          fast("userAdd", this.form).then(res => {
            this.$message.success("提交成功！");
            this.editShow = false;
            this.fetchData();
          });
        }
      });
    },
    del(username) {
      this.$confirm("删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fast("userDel", { username: username }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    reset(username) {
      this.$confirm("是否重置密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          fast("userPwdReset", { username: username }).then(res => {
            this.$message({
              type: "success",
              message: "重置成功!"
            });
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置"
          });
        });
    }
  }
};
</script>

