<template>
  <div v-if="list.length>0" class="container const">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>校准</span>
      </div>
      <div class="list">
        <div class="item">
          
          <el-alert title="校准饲喂速率" type="success" :closable="false"></el-alert>
          <el-input-number  @change="updateConst(list[6],1)" placeholder v-model="list[6].days"></el-input-number>
          <el-alert title="克/分钟" type="success" :closable="false"></el-alert>
        </div>
        <div class="item">
          <el-button type="success" @click.native="doCalibration()">开始校准</el-button>
        </div>

    
      </div>
    </el-card>

  </div>
</template>

<script>
import { fast } from "@/api/fast";

export default {
  name: "Dashboard",
  data() {
    return {
      switchs: {'1':'开启','0':'关闭'},
      list: [],
      listQuery: {
        pageIndex: 1,
        dataType: "detail",
        pageSize: 10
      },
      total: 0,
      listLoading: false
    };
  },
  created() {
    this.listQuery.apartmentId = this.$route.query.id;
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.listLoading = true;
      fast("constGet", this.listQuery).then(res => {
        this.listLoading = false;
        this.list = res;
      });
    },doCalibration(){
      fast('calibration',null).then(res=>{
        if(res.error == '0'){
          this.$alert('校准开始运行', '提示', {
            confirmButtonText: '确定',
          });
        }
      });
    },
    updateConst(datas,type) {
      let data = JSON.parse(JSON.stringify(datas))
      if (type) {
        delete data.switch
      } else {
        data.switchh = data.switch
        delete data.days
      }
      fast('constEdit',data).then()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.fetchData();
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
.const {
  .box-card {
    .list {
      .item {
        margin-bottom: 10px;
        .el-tag {
          width: 140px;
          height: 40px;
          line-height: 40px;
          float: left;
          margin-right: 10px;
        }
        .el-alert {
          display: inline;
        }
      }
    }
  }
}
</style>
