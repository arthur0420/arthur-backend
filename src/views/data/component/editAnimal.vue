<template>
  <div>
    <el-dialog title="" top="10px" class="editDialog" :visible.sync="editShow" @closed="editAnimalOver(false)">
      <el-form :rules="rules" ref="formEdit" :model="form">
  
        <el-form-item label="跳过" :label-width="formLabelWidth" prop="skip_time">
          <el-input size="small" v-model="form.skip_time" ></el-input> 
        </el-form-item>
        <el-form-item label="百分比" :label-width="formLabelWidth" prop="offset">
          <el-input  v-model="form.offset" ></el-input>
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
          var skip = this.form.skip_time;
          var offset = this.form.offset;
          try{
            skip = parseInt(skip);
            if(skip<0)skip = 0;
            if(isNaN(skip))skip = 0;
          }catch(e){
            skip = 0;
          }
          try{
            offset = parseInt(offset);
            if(isNaN(offset))offset = 0;
          }catch(e){
            offset = 0;
          }
          var rd = {
            skip_time:skip,
            offset:offset,
            id:this.form.id,
            switch:this.form.switch
          }
          fast("animalEdit", rd).then(res => {
            this.$message.success("提交成功！");
            this.editAnimalOver(true)
          });
        }
      });
    },
  }
};
</script>



