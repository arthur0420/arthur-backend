<template>
  <div class="container plan fix">
    <el-menu mode="horizontal">
    <el-menu-item index="0" @click="goPath('/data/plan/val')">饲喂量</el-menu-item>
    <el-menu-item index="1" disabled  >调整</el-menu-item>
    <el-menu-item index="2" @click="goPath('/data/plan/distribution')" >饲喂分布</el-menu-item>
</el-menu>  
    <div style="overflow:hidden">
       <el-card class="box-card">
     
      <div class="list">
        <div class="item">
           <el-tag style="width:82px;">绝对提升 </el-tag> <el-input-number v-model="form.offset_absolute"></el-input-number> <el-tag>千克</el-tag>
        </div>
        
        <div class="item">
           <el-tag style="width:82px;">百分比提升 </el-tag> <el-input-number :min="-100" v-model="form.offset_relative"></el-input-number> <el-tag>%</el-tag>
           <!-- <el-alert title="" type="success" :closable="false"></el-alert>  -->
        </div>
        
        <div class="item">
           <el-alert title=""  style="height:68px;" type="warning" :closable="false" >
             提示:两个修正只有一个生效，绝对的优先级高于百分比
             </el-alert> 
        </div>

      </div>
    </el-card>

   
    </div>
    <el-button type="success" @click="save" class="submit">确定</el-button>
  </div>
</template>
<script>
import { fast } from "@/api/fast";
import { unionUnit,eventDic } from "@/utils/index"
var test = 1
export default {
    data() {
        return {
            form: {
                offset_absolute:0,
                offset_relative:0
            }
        }
    },
  created() {
    this.init();
  },
  methods: {
    init() {
      fast('feedScGet',{scheduleId:this.$route.query.id}).then(res=>{
          this.form = res[0]
      })
    },
    goPath(path) {
         this.$router.push({
            path: path,
            query: {
                id: this.$route.query.id
            }
        })
    },
    save() {
      var data  = this.form
      data.scheduleId = this.$route.query.id
      fast('feedScEdit',data).then(res=>{
           this.$message.success("提交成功！");
      })
    }
  }
};
</script>

<style lang="scss">
.plan {
  overflow: hidden;
  &.fix {
    .el-card {
        width: 100%;
    }  
    .submit {
        margin-left: 30px;
        max-width: 100px;
        min-width: 100px;
    }
  } 
  .el-card {
    min-width: 700px;  
    width: 40%;
    float: left;
    margin-right: 20px;
    .el-card__header {
      line-height: 40px;
    }
    .list {
        .item {
        margin-bottom: 20px;
            .el-tag {
                height: 40px;
                line-height: 40px;
                display: inline-block;
            }
            .el-input {
                display: inline-block;
                
            }
            .big-input {
                width: 200px;
                input {
                    width: 200px;
                }
            }
            .el-alert {
                display: inline;
            }
        }
    }
  }
  .submit {
    clear: both;
    display: block;
    min-width: 1420px;  
    width: 40%;
    margin-top: 20px;
  }
}
</style>

