<template>
  <div class="container">
       <el-table
      ref="listTable"
      v-loading="listLoading"
      element-loading-text="Loading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="栏内序号" width="80">
        <template slot-scope="scope">{{ scope.row.no_in_apartment }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="是否有动物" width="100">
        <template slot-scope="scope">{{scope.row.have_animal?'有':'无'}}</template>
      </el-table-column>
      
      <el-table-column align="center" label="饲喂计划" width="120">
        <template slot-scope="scope">{{ scope.row.schedule_name }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="天数" width="80">
        <template slot-scope="scope">{{ scope.row.days }}</template>
      </el-table-column>

      <el-table-column align="center" label="已饲喂/总量（当日，千克）" width="280">
        <template slot-scope="scope">{{ scope.row.fed }}/{{ scope.row.wfwac }}</template>
      </el-table-column>

      <el-table-column align="center" label="跳过" width="80">
        <template slot-scope="scope">{{ scope.row.skip_time }}</template>
      </el-table-column>

      
      <el-table-column align="center" label="百分比" width="80">
        <template slot-scope="scope">{{ scope.row.offset }}</template>
      </el-table-column>

      <el-table-column align="center" label="饲喂开关" width="80">
        <template slot-scope="scope"><el-tag class="pointer" :type="scope.row.switch?'':'danger'" @click.native="toggleSwitch(scope.row)">{{ scope.row.switch?'开':'关' }}</el-tag></template>
      </el-table-column>

      
      <el-table-column align="center" label="操作" width="480">
        <template slot-scope="scope">
          <el-button type="warning" @click="edit(scope.row)">编辑</el-button>
          <router-link :to="'/data/event?id='+scope.row.id">
          <el-button>查看事件</el-button>
          </router-link>
          </template>
      </el-table-column>
    </el-table>

    <editAnimal v-if="editShow" :info="editShow" @editAnimalOver="editAnimalOver"></editAnimal>

  </div>
</template>

<script>
import { fast } from '@/api/fast'
import editAnimal from './component/editAnimal'

export default {
  name: "Dashboard",
  components: { editAnimal },
  data() {
    return {
      list: [],
      listQuery:{
        pageIndex:1,
        dataType: 'detail',
        pageSize: 10
      },
      total: 0,
      listLoading: false,
      editShow: false
    };
  },
  created() {
    console.log('what?')
    this.listQuery.apartmentId = this.$route.query.id
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.listLoading = true;
      fast("animal",this.listQuery).then(res => {
        this.listLoading = false;
        for(let i = 0 ; i<res.length;i++){
          let one = res[i];
          one.fed = (one.fedPercent * one.wfwac / 1000).toFixed(1);
          one.wfwac =  one.wfwac/10;
        }
        this.list = res;
      });
    },
    edit(info) {
      var nd = {
       skip_time: info.skip_time,
       offset:info.offset,
       switch:info.switch,
       id:info.id
      }
      this.editShow =nd;
    },
    editAnimalOver(e) {
      this.editShow = false
      if (e) {
        this.fetchData()
      }
    },
    toggleSwitch(info) {
      var msg = info.switch?'关闭':'开启'
       this.$confirm("是否确认"+msg+"饲喂？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let rd = { id:info.id,switch: info.switch?0:1,skip_time:info.skip_time,offset:info.offset }
          fast("animalEdit", rd).then(res => {
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
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
</style>
