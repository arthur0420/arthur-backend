<template>
  <div class="container fast">
    <div style="overflow:hidden">
       <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择对象</span>
        <el-button style="float: right;" type="success" @click="addObj()">新增</el-button>
      </div>
      <div class="list">
        <div class="item" v-for="(item,index) in objects" :key="index">
            <el-tag>产线</el-tag>
            <el-select v-model="item.plid">
              <el-option v-for="(item,index) in plList" :key="index" :value="index" :label="item.name"></el-option>
            </el-select>
            <el-tag>产房</el-tag>
           <el-select :disabled="plList[item.plid]?false:true" v-model="item.apid">
            <el-option
              v-for="vo in plList[item.plid]?plList[item.plid].sub:[]"
              :key="vo.id"
              :value="vo.id"
              :label="vo.ap_name"
            ></el-option>
          </el-select>
            <el-tag>编号</el-tag>
            <el-input v-model="item.no_in_apartment" class="big-input" placeholder="'-'取范围,','分隔多个"></el-input>
            <el-tag type="danger" class="pointer" @click.native="delObj(index)">删除</el-tag>    
        </div>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择操作</span>
        <el-button style="float: right;" @click="addActions" type="success">新增</el-button>
      </div>
       <div class="list">
        <div class="item" v-for="(item,index) in actions" :key="index">
            <el-tag>操作</el-tag>
            <el-select v-model="item.actionid">
              <el-option v-for="(item,index) in actionList" :key="index" :value="index" :label="item.name"></el-option>
            </el-select>
           <el-select :disabled="actionList[item.actionid]&&actionList[item.actionid].obj?false:true" v-model="item.actionValue">
            <el-option
              v-for="vo in actionList[item.actionid]?actionList[item.actionid].obj:[]"
              :key="vo.event_no"
              :value="vo.event_no"
              :label="vo.event_name"
            ></el-option>
          </el-select>
            <el-tag type="danger" class="pointer" @click.native="delAction(index)">删除</el-tag>    
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
            plList:[],
            actionList: {
              1:{name:'添加事件',obj:eventDic},
              2:{name:'出栏',obj:false},
            },
            objects:[],
            actions:[]
        }
    },
  created() {
    this.init();
  },
  methods: {
    init() {
      fast("union", this.listQuery).then(res => {
        this.plList = unionUnit(res);
      });
      this.getDic();
      this.addObj();
      this.addActions();
    },
     //获取字典
    getDic() {
      var constVal = localStorage.getItem('constVal')
      if (constVal) {
        constVal = JSON.parse(constVal)
        //return  this.actionList[1].obj = constVal
      } 
      constVal = {}
      fast('constGet').then(data=>{
        for (var i=0;i<data.length;i++) {
            constVal[data[i].id] = data[i]
        }
        localStorage.setItem('constVal',JSON.stringify(constVal))
      //  this.actionList[1].obj = constVal
      })
    }, 
    addObj() {
        this.objects.push({
            plid:'',
            apid:'',
            no_in_apartment:''
        })
    },
    addActions() {
      this.actions.push({
        actionid:'',
        actionValue:''
      })
    },
    delObj(index) {
         this.$confirm("删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "我点错了",
        type: "warning"
      })
        .then(() => {
            this.objects.splice(index,1)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delAction(index) {
         this.$confirm("删除无法恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "我点错了",
        type: "warning"
      })
        .then(() => {
            this.actions.splice(index,1)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    save() {
      var form = {
          objects:JSON.stringify(this.objects),
          actions: JSON.stringify(this.actions)
      }
   
      if (this.objects.length==0) {
         return this.$message.error("请选择对象");
      }
      
      // if (this.actions.length==0) {
      //  // return this.$message.error("请选择操作");
      // }

      // for (var i=0;i<this.objects.length;i++) {
      //     if (!this.objects[i].apid) {
      //       return this.$message.error("请选择产房");
      //     }
          
      //     if (!this.objects[i].no_in_apartment) {
      //       return this.$message.error("请填写编号");
      //     }

      // }
      
      // for (var i=0;i<this.actions.length;i++) {
      //     if (!this.actions[i].actionid) {
      //   //    return this.$message.error("请选择操作");
      //     }
          

      // }


      fast('fastInput',form).then(res=>{
           this.$message.success("提交成功！");
           this.form = {}
           this.objects = [],
           this.actions = []
      })
    }
  }
};
</script>

<style lang="scss">
.fast {
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
                input {
                    width: 110px;
                }
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
    // min-width: ;  
    width: 40%;
    margin: 20px auto;
    // margin-top: 20px;
  }
}
</style>

