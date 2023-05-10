<template>
  <div>
    <el-button type="primary" @click="addDeviceType">添加</el-button>
    <el-table :data="devList" style="width: 100%">
      <el-table-column prop="name" label="类型名称" width="180">
      </el-table-column>
      <el-table-column prop="pro_name" label="协议类型" width="180">
      </el-table-column>
      <el-table-column prop="net_name" label="网络类型">
      </el-table-column>
      <el-table-column prop="commands" label="协议指令">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
    </el-table>
    <el-dialog title="设备类型" :visible.sync="dialogVisible">
      <router-view @w_close="dialogClose" @w_success="dialogSuccess"></router-view>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'DeviceTypeList',
  data() {
    return {
      devList: [],
      dialogVisible: false
    }
  },
  async created() {
    this.devList = (await this.$http.cors("/loans/Gw/getDeviceTypeList")).data;
  },
  methods: {
    addDeviceType() {
      if (this.$route.path !== "/DeviceTypeList/DeviceType") {
        this.$router.push('/DeviceTypeList/DeviceType');
      }
      this.dialogVisible = true;
    },
    dialogClose(){
      this.$router.back();
      this.dialogVisible = false;
    },
    async dialogSuccess(){
      this.$router.back();
      this.dialogVisible = false;
      this.devList = (await this.$http.cors("/loans/Gw/getDeviceTypeList")).data;
    }
  }
}
</script>