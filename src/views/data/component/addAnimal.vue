<template>
  <div>
    <el-dialog title="添加动物" top="10px" class="editDialog" :visible.sync="editShow" @closed="addAnimalOver(false)">
      <el-form :rules="rules" ref="formEdit" :model="form">
        <el-form-item label="产线" :label-width="formLabelWidth" prop="pl_no">
          <el-select v-model="form.pl_no">
            <el-option v-for="(item,index) in pl" :key="index" :value="index" :label="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产房" :label-width="formLabelWidth" prop="apId">
          <el-input  v-if="!pl[form.pl_no]" v-model="form.apId" autocomplete="off" :disabled="true"></el-input>
          <el-select v-if="pl[form.pl_no]" v-model="form.apId">
            <el-option
              v-for="item in pl[form.pl_no].sub"
              :key="item.id"
              :value="item.id"
              :label="item.ap_name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="栏位编号" :label-width="formLabelWidth" prop="no">
          <el-input v-model="form.no" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="受精日期" :label-width="formLabelWidth" prop="eventDate">
          <el-date-picker v-model="form.eventDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="受精日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAnimalOver(false)">取 消</el-button>
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
        pl_no:[
          {required: true, trigger: "blur", message: "请选择产线" }
        ],
        apId:[
          {required: true, trigger: "blur", message: "请选择产房" }
        ],
        no:[
          {required: true, trigger: "blur", message: "请选择栏位编号" }
        ],
        eventDate:[
          {required: true, trigger: "blur", message: "受精日期" }
        ],

      },
      pl: {}
    };
  },
  props: ["list"],
  created() {
    this.init();
  },
  methods: {
    init() {
      var list = this.list;
      
      this.pl = unionUnit(list);
    },
    addAnimalOver(status) {
      this.$emit("addAnimalOver", status);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          fast("animalAdd", this.form).then(res => {
            this.$message.success("提交成功！");
            this.addAnimalOver(true)
          });
        }
      });
    },
  }
};
</script>



