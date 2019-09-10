<template>
  <div>
    <el-dialog title="添加事件" top="10px" class="editDialog" :visible.sync="editShow">
      <el-form :rules="rules" ref="formEdit" :model="form">

        <el-form-item label="事件" :label-width="formLabelWidth" prop="event_no">
          <el-select v-model="form.event_no">
            <el-option
              v-for="item in eventList"
              :key="item.event_no"
              :value="item.event_no"
              :label="item.event_name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="公猪" :label-width="formLabelWidth" prop="boar">
          <el-input v-model="form.boar" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="日期" :label-width="formLabelWidth" prop="eventDate">
          <el-date-picker v-model="form.eventDate" type="date" value-format="yyyy-MM-dd HH:mm" placeholder="日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="执行结果" :label-width="formLabelWidth" prop="result">
          <el-input v-model="form.result" autocomplete="off"></el-input>
        </el-form-item>
        
        
        <el-form-item label="执行人" :label-width="formLabelWidth" prop="executor">
          <el-input v-model="form.executor" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEventOver(false)">取 消</el-button>
        <el-button type="primary" @click="submitForm('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fast } from "@/api/fast";
import { eventDic } from "@/utils/index"
export default {
  data() {
    return {
      form: {},
      editShow: true,
      formLabelWidth: "80px",
      rules: {
      },
      pl: {},
      eventList: eventDic
    };
  },
  props: ["id"],
  created() {
    this.init();
    this.form.id=this.id
  },
  methods: {
    init() {
        
    },
    addEventOver(status) {
      this.$emit("addEventOver", status);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          fast("eventAdd", this.form).then(res => {
            this.$message.success("提交成功！");
            this.addEventOver(true)
          });
        }
      });
    },
  }
};
</script>

