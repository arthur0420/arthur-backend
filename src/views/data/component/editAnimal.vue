<template>
  <div>
    <el-dialog title="" top="10px" class="editDialog" :visible.sync="editShow" @closed="editAnimalOver(false)">
      <el-form :rules="rules" ref="formEdit" :model="form">
  
        <el-form-item label="百分比" :label-width="formLabelWidth" prop="offset">
          <el-input v-model="form.offset" autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="跳过" :label-width="formLabelWidth" prop="skip_time">
          <el-input v-model="form.skip_time" autocomplete="off"></el-input>次
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAnimalOver(false)">取 消</el-button>
        <el-button type="primary" @click="submitForm('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fast } from "@/api/fast";
import { unionUnit } from "@/utils/index"
export default {
  data() {
    return {
      form: {},
      editShow: true,
      formLabelWidth: "80px",
      rules: {
      },
    };
  },
  props: ["info"],
  created() {
    this.init();
  },
  methods: {
    init() {
      this.form = this.info
    },
    editAnimalOver(status) {
      this.$emit("editAnimalOver", status);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          fast("animalEdit", this.form).then(res => {
            this.$message.success("提交成功！");
            this.editAnimalOver(true)
          });
        }
      });
    },
  }
};
</script>



