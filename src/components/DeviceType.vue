<template>
  <div>

    <el-form ref="addDeviceType" :model="form" label-width="80px">
      <el-form-item label="类型代码">
        <el-input v-model="form.code" placeholder="请输入类型代码"></el-input>
      </el-form-item>
      <el-form-item label="类型名称">
        <el-input v-model="form.name" placeholder="请输入类型名称"></el-input>
      </el-form-item>

      <el-form-item label="协议类型">
        <el-select v-model="form.pro_code" value-key="code" placeholder="请选择协议类型" @change="handleProChange">
          <el-option v-for=" pro in protocolList" :key="pro.code" :label="pro.message" :value="pro">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="网络类型">
        <el-select v-model="form.net_code" value-key="code" placeholder="请选择网络类型">
          <el-option v-for=" net in networkList" :key="net.code" :label="net.message" :value="net">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="协议指令">
        <el-checkbox-group v-model="form.pro_command">
          <el-checkbox v-for="com in commandList" :key="com.code" :label="com.code">
            {{ com.message }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="onClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'DeviceType',
  components: {
  },
  data() {
    return {
      form: {
        name: '',
        pro_code: '',
        net_code: '',
        pro_command: [],
        remark: '',
      },
      protocolList: [],
      networkList: [],
      commandList: []
    }
  },
  async mounted() {
    this.protocolList = (await this.$http.cors("/loans/typecode_manager/getTypecodeList", {
      typecode: "protocol"
    })).data;
    this.networkList = (await this.$http.cors("/loans/typecode_manager/getTypecodeList",{
      typecode: "network"
    })).data;
  },
  methods: {
    async handleProChange(value) {
      this.commandList = (await this.$http.cors("/loans/typecode_manager/getTypecodeList", {
        typecode: value.param
      })).data;

      this.form.pro_command = [];
      for (var i = 0; i < this.commandList.length; i++) {
        this.form.pro_command.push(this.commandList[i].code);
      }
    },
    onSubmit() {
      this.$http.cors("/loans/device_manager/addDeviceType", {
        code: this.form.code,
        name: this.form.name,
        pro_code: this.form.pro_code.code,
        pro_name: this.form.pro_code.message,
        net_code: this.form.net_code.code,
        net_name: this.form.net_code.message,
        pro_command_set: this.form.pro_code.param,
        pro_command: this.form.pro_command,
        remark: this.form.remark
      }).then((res) => {
        if (res.code == 0)
          this.$emit("w_success");
        else
          this.$alert(res.msg, '错误', {
            confirmButtonText: '确定'
          });
      }).catch(err => {
        this.$alert(err, '错误', {
          confirmButtonText: '确定'
        });
      })
    },
    onClose() {
      this.$emit("w_close");
    }
  }
}
</script>