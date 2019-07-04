<template>
  <div class="container plan fix">
    <el-menu mode="horizontal">
      <el-menu-item index="0" @click="goPath('/data/plan/val')">饲喂量</el-menu-item>
      <el-menu-item index="1" @click="goPath('/data/plan/fix')">调整</el-menu-item>
      <el-menu-item index="2" disabled>饲喂分布</el-menu-item>
    </el-menu>
    <div style="overflow:hidden">
      <el-card class="box-card">
          
    <el-button type="primary" @click="add" style="margin:10px auto" class="submit">添加</el-button>
        <el-table ref="listTable" :data="list" border fit highlight-current-row style="height:64vh;overflow-y:scroll">
          <el-table-column align="center" label="天数"  width="60">
            <template slot-scope="scope">
                <el-input v-if="scope.row.days!==0&&!scope.row.days" style="border:1px solid red" v-model="scope.row.days"></el-input>
                <el-input v-else v-model="scope.row.days"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" v-for="(item,index) in hours" :label="index.toString()" :key="index" width="46">
            <template slot-scope="scope"><el-input class="dayNum" v-model="scope.row['h'+index]"></el-input></template>
          </el-table-column>
          <el-table-column align="center" label="操作"  width="120">
            <template slot-scope="scope">
              <el-button @click="del(scope.$index)" type="danger">删除</el-button>
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="总"  width="80">
            <template slot-scope="scope">
               <el-tag :type="total(scope.row)!=100?'danger':''">{{total(scope.row)}}</el-tag> 
            </template>
          </el-table-column>


        </el-table>
      </el-card>
    </div>
    
    <el-alert title="提示:" type="warning" :closable="false" >当“天数”为空时不能提交。当'总'不为100时不能提交</el-alert> 
    <el-button type="success" @click="save" style="margin:10px auto" class="submit">确定</el-button>
  </div>
</template>
<script>
import { fast } from "@/api/fast";
import { unionUnit, eventDic } from "@/utils/index";
var test = 1;
var hours = []
for (var i=0;i<24;i++) {
    hours.push(i)
}
export default {
  data() {
    return {
      hours:hours,
      list:[]
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
        fast('feedHourGet',{scheduleId:this.$route.query.id}).then(res=>{
            this.list = res
        })
    },
    goPath(path) {
      this.$router.push({
        path: path,
        query: {
          id: this.$route.query.id
        }
      });
    },
    add() {
        var data = {}
        for (var i=0;i<24;i++) {
            data['h'+i] = 0
        }
        data['days'] = 0
        this.list.push(data)
    },
    save() {
      for (var i=0;i<this.list.length;i++) {
          var item = this.list[i]
          if (item.schedule_id) {
              delete this.list[i].schedule_id
          }
          if (item.days!==0&&!item.days) {
              return false
          }
          var count = 0
          for (var i=0;i<24;i++) {
             count += parseInt(item['h'+i])
         }
        if (count != 100) {
            return false
        }
      }
       fast('feedHourEdit',{data:JSON.stringify(this.list),scheduleId:this.$route.query.id}).then(res=>{

        })
    },
    total(data) {
        var count = 0
        for (var i=0;i<24;i++) {
            count += parseInt(data['h'+i])
        }
        return count
    },
    del(index) {
      this.$confirm("删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            this.list.splice(index,1)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
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
  .dayNum {
    width:40px;
    padding:0;
    .el-input__inner {
      padding: 0;
      text-align: center;
    }
  }
  .el-table .cell {
    padding: 0;
  }
}
</style>

