<template>
  <div class="container plan">
    <el-menu mode="horizontal">
    <el-menu-item index="0" disabled>饲喂量</el-menu-item>
    <el-menu-item index="1"  @click="goPath('/data/plan/fix')">调整</el-menu-item>
    <el-menu-item index="2" @click="goPath('/data/plan/distribution')">饲喂分布</el-menu-item>
</el-menu>  
    <div style="overflow:hidden">
       <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分娩前</span>
        <el-button style="float: right;" type="success" @click="addObj()">新增</el-button>
      </div>
      <div class="list">
        <div class="item" v-for="(item,index) in before" :key="index">
            <el-input-number v-if="item.days"   v-model="item.days"></el-input-number> 
            <el-tag v-if="item.days">天</el-tag>
            <el-tag style="width:218px" v-else>直到产仔</el-tag>
            <el-input-number v-model="item.fodder"></el-input-number> <el-tag>千克</el-tag>
            <el-tag type="danger" class="pointer" v-if="item.days" @click.native="delObj(index)">删除</el-tag>    
        </div>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分娩后</span>
        <el-button style="float: right;" @click="addActions" type="success">新增</el-button>
      </div>
       <div class="list">
        <div class="item" v-for="(item,index) in after" :key="index">
            <el-input-number v-if="item.days"  v-model="item.days"></el-input-number> 
            <el-tag v-if="item.days">天</el-tag>
            <el-tag style="width:218px" v-else>0</el-tag>
            <el-input-number v-model="item.fodder"></el-input-number> <el-tag>千克</el-tag>
            <el-tag type="danger" class="pointer" v-if="item.days" @click.native="delActions(index)">删除</el-tag>   
        </div>
      </div>
    </el-card>
    </div>
    <el-button type="success" @click="save" class="submit">确定</el-button>
     <el-card class="box-card" style="width:100%">
      <div slot="header" class="clearfix">
        <span>喂料曲线</span>
      </div>
    <div class="echarts" ref="echarts">

    </div>
    </el-card>
    </div>
</template>
<script>
import { fast } from "@/api/fast";
import { unionUnit,eventDic } from "@/utils/index"

var echarts = require('echarts/lib/echarts');
 
require('echarts/lib/chart/line');

export default {
    data() {
        return {
            before:[],
            after:[]
        }
    },
  created() {
    this.init();
  },
  methods: {
    init() {
      fast("getFeed", this.$route.query).then(res => {
          this.chart(res);
          for (var i=0;i<res.length;i++) {

              res[i].fodder = res[i].fodder/10

              if (res[i].days>=0) {
                  this.after.push(res[i])
              }
              if (res[i].days<=0) {
                  res[i].days = -res[i].days
                  this.before.push(res[i])
              }
          }
          
      });
    },chart(res){

      for(let i = 0 ; i<res.length;i++){
              let item = res[i];
              item.ff = item.fodder / 10;
           }
      var options = {
          xAxis: {
                type: 'category',
                data: res.map(item=>{
                    return item.days
                })
          },
          yAxis: {},
          series: {
                name: '喂料曲线',
                type: 'line',
                data: res.map(item=>{

                    return item.ff;
                })
          }
       }
            
      var myEchars = echarts.init(this.$refs.echarts)
      myEchars.setOption(options) 
    },
    goPath(path) {
        this.$router.push({
            path: path,
            query: {
                id: this.$route.query.id
            }
        })
    },
    addObj() {
       this.before =  [{
            days:1,
            fodder:0
        }].concat(this.before)
    },
    addActions() {
        this.after.push({
            days:1,
            fodder:0
        })
    },
    delObj(index) {
         this.$confirm("删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "我点错了",
        type: "warning"
      })
        .then(() => {
            this.before.splice(index,1)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delActions(index) {
         this.$confirm("删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "我点错了",
        type: "warning"
      })
        .then(() => {
            this.after.splice(index,1)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    save() {
      var data = JSON.parse(JSON.stringify(this.after))
      var before = JSON.parse(JSON.stringify(this.before))  
      for (var i=0;i<before.length;i++ ) {
          before[i].days = -before[i].days
          data.push(before[i])
      }
      // 去重
      var insData = {}
      for (var i=0;i<data.length;i++) {
        data[i].fodder = data[i].fodder*10
          if (data[i].id) {
             insData[data[i].id] =  data[i]
          } else {
            insData['id'+i] =  data[i]
          }

      }
      data = []
      for (var index in insData) {
          data.push(insData[index])
      }
      
      fast('feedDayEdit',{data:JSON.stringify(data),scheduleId:this.$route.query.id}).then(res=>{
           this.$message.success("提交成功！");
           data.sort(function(a,b){
             if(a.days>b.days){
               return 1;
             }else if(a.days<b.days){
               return -1;
             }else{
               return 0;
              }
           });
           this.chart(data);
      })
    }
  }
};
</script>

<style lang="scss">
.plan {
  overflow: hidden;
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

        }
    }
  }
  .submit {
    clear: both;
    display: block;

    width: 40%;
    margin: 20px auto 20px;
  }
  .echarts {
    width: 800px;
    height: 500px;
  }
}
</style>

