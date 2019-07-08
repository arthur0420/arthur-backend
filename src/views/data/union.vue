<template>
  <div class="container">
     <div class="filter-container">
       <el-tag>动物总数: {{animalCount}}</el-tag>
       <el-button class="filter-item" type="success" @click="addAnimalShow=true">添加动物</el-button>
    </div>
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
      
      <el-table-column align="center" label="产线" width="80">
        <template slot-scope="scope">{{ scope.row.pl_name }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="房间" width="80">
        <template slot-scope="scope">{{ scope.row.ap_name }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="已产仔/总量" width="120">
        <template slot-scope="scope">{{ scope.row.deliveryGross }}/{{ scope.row.animalGross }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="已增加" width="120">
        <template slot-scope="scope">{{ scope.row.addGross }}</template>
      </el-table-column>

      <el-table-column align="center" label="已减少" width="120">
        <template slot-scope="scope">{{ scope.row.minus }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="无法饲喂" width="120">
        <template slot-scope="scope">{{ scope.row.unableFeed }}</template>
      </el-table-column>
      
      <el-table-column align="center" label="当前进度" width="120">
        <template slot-scope="scope">{{ scope.row.fedGross }}/{{ scope.row.weightGross }} </template>
      </el-table-column>


    <el-table-column class-name="status-col" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tag @click.native="goPath(0,scope.row)">查看动物</el-tag>
        </template>
      </el-table-column>
     

    </el-table>
    <!--对话相关开始-->
    <!--添加动物-->
      <addAnimal @addAnimalOver="addAnimalOver" :list="list" v-if="addAnimalShow">
      </addAnimal>
    <!--添加动物结束-->
    <!--对话相关结束-->
  </div>
</template>

<script>
import { fast } from '@/api/fast'
import addAnimal from './component/addAnimal'

export default {
  name: "Dashboard",
  components: { addAnimal },
  data() {
    return {
      list: [],
      animalCount:0,
      addAnimalShow: false,
      listQuery:{
        pageIndex:1,
        dataType: 'detail',
        pageSize: 10
      },
      total: 0,
      listLoading: false
    };
  },
  watch:  {
    $route(to,from) {
        console.log(to)
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData: function() {
      this.listLoading = true;
      fast("union",this.listQuery).then(res => {
        this.listLoading = false;
        this.list = res;
        var count = 0
        for (var i=0;i<res.length;i++) {
          count+=res[i].animalGross
        }
        this.animalCount = count
      });
    },
    goPath(type,info) {
      if (type==0) {
        return this.$router.push({path:'animal',query:{id:info.id}})
      }
      
      if (type==1) {
        return this.$router.push({path:'event',query:{id:info.id}})
      }

    },
    addAnimalOver(e) {
      if (!e) {
        this.addAnimalShow = false
      }
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
.el-tag {
  cursor: pointer;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
input{
  width:180px;
}
</style>
