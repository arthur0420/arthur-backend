<template>
  <div v-if="list.length>0" class="container const">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>预计日期</span>
      </div>
      <div class="list">
        <div class="item">
          <el-tag effect="plain">断奶</el-tag>
          <el-input-number  @change="updateConst(list[0],1)" placeholder v-model="list[0].days"></el-input-number>
          <el-alert title="产仔后天数" type="success" :closable="false"></el-alert>
        </div>

        <div class="item">
          <el-tag effect="plain">妊娠</el-tag>
          <el-input-number @change="updateConst(list[1],1)" placeholder v-model="list[1].days"></el-input-number>
          <el-alert title="天" type="success" :closable="false"></el-alert>
        </div>
        <div class="item">
          <el-tag effect="plain">发情周期</el-tag>
          <el-input-number @change="updateConst(list[2],1)" v-model="list[2].days"></el-input-number>
          <el-alert title="天" type="success" :closable="false"></el-alert>
        </div>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>关注提示</span>
      </div>
      <div class="list">
        <div class="item">
          <el-tag effect="plain">验孕</el-tag>
          <el-radio-group  @change="updateConst(list[3])"  v-model="list[3].switch">
            <el-radio-button
              v-for="(item,index) in switchs"
              :key="index"
              :value="index"
              :label="index"
            >{{item}}</el-radio-button>
          </el-radio-group>
          <el-input-number @change="updateConst(list[3],1)" v-model="list[3].days"></el-input-number>
          <el-alert title="受精后天数" type="success" :closable="false"></el-alert>
        </div>

        <div class="item">
          <el-tag effect="plain">断奶</el-tag>
          <el-radio-group  @change="updateConst(list[4])"  v-model="list[4].switch">
            <el-radio-button
              v-for="(item,index) in switchs"
              :key="index"
              :value="index"
              :label="index"
            >{{item}}</el-radio-button>
          </el-radio-group>
          <el-input-number @change="updateConst(list[4],1)" v-model="list[4].days"></el-input-number>
          <el-alert title="预期断奶前天数" type="success" :closable="false"></el-alert>
        </div>
        <div class="item">
          <el-tag effect="plain">产仔</el-tag>
          <el-radio-group  @change="updateConst(list[5])"  v-model="list[5].switch">
            <el-radio-button
              v-for="(item,index) in switchs"
              :key="index"
              :value="index"
              :label="index"
            >{{item}}</el-radio-button>
          </el-radio-group>
          <el-input-number @change="updateConst(list[5],1)" v-model="list[5].days"></el-input-number>
          <el-alert title="预期分娩前天数" type="success" :closable="false"></el-alert>
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
