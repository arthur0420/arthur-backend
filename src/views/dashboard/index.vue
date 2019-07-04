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
      
      <el-table-column align="center" label="级别" width="80">
        <template slot-scope="scope">{{ scope.row.level }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="备注" width="500">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="日期" width="160">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>

    </el-table>
    
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-size="listQuery.limit"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
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
        pageSize: 10
      },
      total: 0,
      listLoading: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.listLoading = true;
      fast("log",this.listQuery).then(res => {
        this.listLoading = false;
        this.list = res.data;
        this.total = parseInt(res.total)
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
