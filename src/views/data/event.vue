<template>
  <div class="container">
     <div class="filter-container">
       <el-tag v-if="predictDays">{{predictDays}}: {{days}}</el-tag>
       <el-button class="filter-item" type="success" @click="addEventShow=true">添加事件</el-button>
    </div>
       <el-table
      ref="listTable"
      v-loading="listLoading"
      element-loading-text="Loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width:932px;display:inline-block;vertical-align:top;"
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="事件" width="150">
        <template slot-scope="scope">{{ constVal[(scope.row.event_no-1)]?constVal[(scope.row.event_no-1)].event_name:'-' }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="执行者" width="150">
        <template slot-scope="scope">{{ scope.row.executor?scope.row.executor:'-' }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="公猪" width="150">
        <template slot-scope="scope">{{ scope.row.boar?scope.row.boar:'-' }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="结果" width="400">
        <template slot-scope="scope">{{ scope.row.result?scope.row.result:'-' }}</template>
      </el-table-column>
    </el-table>

     <el-table
      ref="listTable2"
      v-loading="listLoading"
      element-loading-text="Loading"
      :data="listFeed"
      border
      fit
      highlight-current-row
      style="width:302px;display:inline-block;vertical-align:top;margin-left:20px;"
      
    >
      <el-table-column align="center" label="饲喂时间" width="150">
        <template slot-scope="scope">{{ scope.row.timestr}}</template>
      </el-table-column>
      
      <el-table-column align="center" label="饲喂量（g）" width="150">
        <template slot-scope="scope">{{ scope.row.weight }}</template>
      </el-table-column>
    </el-table>
    <!--对话相关开始-->
    <!--添加事件-->
      <addEvent @addEventOver="addEventOver" :eventList="constVal" :id="listQuery.id" v-if="addEventShow">
      </addEvent>
    <!--添加事件结束-->

    <!--对话相关结束-->
  </div>
</template>

<script>
import { fast } from '@/api/fast'
import addEvent from './component/addEvent'
import { eventDic } from "@/utils/index"

export default {
  name: "Dashboard",
  components: { addEvent },
  data() {
    return {
      list: [],
      listFeed:[],
      constVal:eventDic,
      addEventShow: false,
      listQuery:{
        pageIndex:1,
        pageSize: 10
      },
      total: 0,
      listLoading: false,
      predictDays:'',
      days:''
    };
  },
  created() {
    this.listQuery.id = this.$route.query.id
    this.getDic();
  },
  methods: {
    fetchData: function() {
      this.listLoading = true;
      fast("event",this.listQuery).then(res => {
        this.listLoading = false;
        this.list = res;
        res[0]&&this.getDay(res[0])
      });
      fast("feedRecord",{cellid: this.$route.query.id}).then(res => {
        for(let i = 0 ; i< res.length; i++){
          let one = res[i];
          let td = new Date(one.time);
          let year = td.getFullYear();
          let mon =td.getMonth()+1;
          let d = td.getDate();
          let hh = td.getHours();
          let min = td.getMinutes();
          if(min <10)min = "0"+min;
          one.timestr =  ""+year +"/"+mon+"/"+d+" "+hh+":"+min;
        }
        this.listFeed = res;
      });
    },
    addEventOver(e) {
       this.addEventShow = false
      if (e) {
        this.fetchData()
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.fetchData();
    },
    //获取字典
    getDic() {
      this.fetchData()
      return 
      var constVal = localStorage.getItem('constVal')
      if (constVal) {
        this.constVal = JSON.parse(constVal)
        return this.fetchData()
      } 
      constVal = {}
      fast('constGet').then(data=>{
        for (var i=0;i<data.length;i++) {
            constVal[data[i].id] = data[i]
        }
        localStorage.setItem('constVal',JSON.stringify(constVal))
        this.constVal = constVal
        this.fetchData()
      })
    },
  
    getDay(data) {
      var showEventArr = {
        1:'下一次发情',
        2:'预计产仔',
        6:'预计断奶',
      }
   
      let constVal = JSON.parse(JSON.stringify(this.constVal))
      if (!showEventArr[data['event_no']]||!constVal[data['event_no']]) {
        return ;
      }
      var lastDate = data.date;
    
      var days = constVal[data['event_no']].days
      var gapDay = this.betweenDate(lastDate);
      days = days>0?days:0;
      this.days = days
      this.predictDays = showEventArr[data['event_no']];

    },
    betweenDate(d){ //事件日期和当前日期的差。
		var theD = new Date(d);
		var theM = theD.getTime();
		var nowM = new Date().getTime();
		var gapDay =  (nowM - theM)/(24 * 60 *60 *1000);
		return gapDay;
	}


  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
