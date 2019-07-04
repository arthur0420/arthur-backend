<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  .container {
    padding: 10px;
  }
  .container .el-dialog input{
    width: 200px;
  }
  .filter-container {
    padding-bottom: 10px;
  }
  .pointer {
    cursor: pointer;
  }
</style>
