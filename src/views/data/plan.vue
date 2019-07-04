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
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="饲喂计划名称" width="260">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      
      <!-- <el-table-column align="center" label="速度" width="120">
        <template slot-scope="scope">{{ scope.row.speed }}</template>
      </el-table-column> -->

      
      <el-table-column align="center" label="绝对调整（单位100g）" width="260">
        <template slot-scope="scope">{{ scope.row.offset_absolute }}</template>
      </el-table-column>

      <el-table-column align="center" label="相对调整（百分比）" width="260">
        <template slot-scope="scope">{{ scope.row.offset_relative }}</template>
      </el-table-column>

      
      <el-table-column align="center" label="操作" width="480">
        <template slot-scope="scope">
          <el-button @click="goSub('val',scope.row.id)" type="warning">饲喂量</el-button>
  
          
         <router-link :to="'/data/plan/fix?id='+scope.row.id">
          <el-button type="success">调整</el-button>
          </router-link>
         <router-link :to="'/data/plan/distribution?id='+scope.row.id">
          <el-button type="primary">饲喂分布</el-button>
          </router-link>

          </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
import { fast } from '@/api/fast'

export default {
  name: "Dashboard",
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
    this.listQuery.apartmentId = this.$route.query.id
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.listLoading = true;
      fast("getFeedList",this.listQuery).then(res => {
        this.listLoading = false;
        this.list = res;
      });
    },
    goSub(path,id) {
      this.$router.push({
        path:'/data/plan/val',
        query: {id:id}
      })
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
