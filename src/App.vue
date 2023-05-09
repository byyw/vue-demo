<template>
  <div id="app">
    <el-container>
      <el-aside width="200px" style="background-color: rgb(255, 255, 255)">
        <el-menu :router="true" class="el-menu-demo">
          <el-menu-item v-for="(r, i) in menuItems" :key="i" :index="String(i)" :route="r.path">
            {{ r.meta.title }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      menuItems: [],
    };
  },
  created() {
    this.menuItems = this.$router.getRoutes().filter(r => r.parent==null);
    // console.log(this.menuItems)
  }
}
</script>
