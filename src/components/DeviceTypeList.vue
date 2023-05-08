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
      <el-table-column prop="proCommand" label="协议指令">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'DeviceTypeList',
  components: {
  },
  data() {
    return {
      devList: [{
      }]
    }
  },
  async mounted() {
    this.devList = await this.$http.cors("/loans/Gw/getDeviceTypeList");
  },
  methods: {
    addDeviceType() {
      this.$router.push('/addDeviceType')
    }
  }
}
</script>
<!-- 
构思下，接下来的路线
设备类型，而关于设备类型，应该如何管理，而流程又是怎样
首先，设备如果要上网关，那么肯定得在设备端绑定好对应的端口才行，而在这一步，网关就已经能识别这个设备了。
后续，实际上网关的工作到这一步就结束了，后续是平台的功能，如何管理这个设备。
网关是通过协议与协议约定的id进行设备识别的。而平台这边，需要建立一个协议的子集，也就是设备类型为一个集合
后续平台所有设备相关的操作都只能局限于一个集合之内，不允许跨集合的操作

 -->