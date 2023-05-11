<template>
  <div>
    <el-button type="primary" @click="addDeviceType">添加</el-button>
    <el-button type="primary" @click="refreshDeviceTypeList">刷新</el-button>
    <el-button type="primary" @click="delDeviceType">删除</el-button>
    <el-table 
      ref="deviceTypeList"
      :data="devList"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%">
      <el-table-column prop="code" label="类型代码" width="180">
      </el-table-column>
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
      dialogVisible: false,
      currentRow: null
    }
  },
  async created() {
    this.devList = (await this.$http.cors("/loans/device_manager/getDeviceTypeList")).data;
  },
  methods: {
    addDeviceType() {
      if (this.$route.path !== "/DeviceTypeList/DeviceType") {
        this.$router.push('/DeviceTypeList/DeviceType');
      }
      this.dialogVisible = true;
    },
    refreshDeviceTypeList(){
      this.$http.cors("/loans/device_manager/getDeviceTypeList").then((res)=>{
        this.devList = res.data;
      })
    },
    delDeviceType(){
      this.$http.cors("/loans/device_manager/delDeviceType",{
        "code": this.currentRow.code
      }).then((res)=>{
        if(res.code == 0){
          this.refreshDeviceTypeList();
        } else {
          this.$alert(res.msg, '错误', {
            confirmButtonText: '确定'
          });
        }
      })
    },
    handleCurrentChange(val){
      this.currentRow = val;
    },
    dialogClose(){
      this.$router.back();
      this.dialogVisible = false;
    },
    async dialogSuccess(){
      this.$router.back();
      this.dialogVisible = false;
      this.refreshDeviceTypeList();
    }
  }
}
</script>