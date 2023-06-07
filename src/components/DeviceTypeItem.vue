<template>
  <div>
    <el-form ref="DeviceType" :model="form" label-width="80px">
      <el-form-item label="类型代码">
        <el-input v-model="form.code" placeholder="请输入类型代码" :disabled="opt == 'update'" />
      </el-form-item>
      <el-form-item label="类型名称">
        <el-input v-model="form.name" placeholder="请输入类型名称" :disabled="opt == 'update'" />
      </el-form-item>

      <el-form-item label="协议类型">
        <el-select v-model="form.pro_code" value-key="code" placeholder="请选择协议类型" @change="handleProChange"
          :disabled="opt == 'update'">
          <el-option v-for=" pro in protocolList" :key="pro.code" :label="pro.message" :value="pro" />
        </el-select>
      </el-form-item>

      <el-form-item label="网络类型">
        <el-select v-model="form.net_code" value-key="code" placeholder="请选择网络类型">
          <el-option v-for=" net in networkList" :key="net.code" :label="net.message" :value="net" />
        </el-select>
      </el-form-item>

      <el-form-item label="协议指令">
        <el-checkbox-group v-model="form.pro_command">
          <el-checkbox v-for="com in commandList" :key="com.code" :label="com.code.toString()">
            {{ com.message }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark" />
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
  name: 'DeviceTypeItem',
  props: {
    code: {
      type: String
    },
    opt: {
      type: String
    }
  },
  data() {
    return {
      form: {
        code: '',
        name: '',
        pro_code: '',
        net_code: '',
        pro_command: [],
        remark: '',
      },
      protocolList: [],
      networkList: [],
      commandList: [],
    }
  },
  async mounted() {
    this.protocolList = (await this.$http.cors("php", "/loans/typecode_manager/getTypecodeList", {
      typecode: "protocol"
    })).data;
    this.networkList = (await this.$http.cors("php", "/loans/typecode_manager/getTypecodeList", {
      typecode: "network"
    })).data;

    if (this.opt == "update") {
      var d = (await this.$http.cors("php", "/loans/device_type_manager/getDeviceTypeList", {
        code: this.code
      })).data[0];

      this.form.code = d.code;
      this.form.name = d.name;
      this.form.pro_code = this.protocolList.filter(it => it.code == d.pro_code)[0];
      await this.handleProChange(this.form.pro_code);
      if(d.commands != null){
        this.form.pro_command = d.commands.split(",");
      }
      this.form.net_code = this.networkList.filter(it => it.code == d.net_code)[0];
      this.form.remark = d.remark;
    }
  },
  methods: {
    async handleProChange(value) {
      this.commandList = (await this.$http.cors("php", "/loans/typecode_manager/getTypecodeList", {
        typecode: value.param
      })).data;

      this.form.pro_command = [];
      for (var i = 0; i < this.commandList.length; i++) {
        this.form.pro_command.push(this.commandList[i].code+"");
      }
    },
    onSubmit() {
      if (this.opt == "update")
        this.updateDeviceType();
      else
        this.addDeviceType();
    },
    onClose() {
      this.$emit("m_res", {
        "code": "close"
      });
    },
    addDeviceType() {
      this.$http.cors("php", "/loans/device_type_manager/addDeviceType", {
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
          this.$emit("m_res", {
            "code": "success"
          });
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
    updateDeviceType() {
      this.$http.cors("php", "/loans/device_type_manager/updateDeviceType", {
        code: this.form.code,
        net_code: this.form.net_code.code,
        net_name: this.form.net_code.message,
        pro_command_set: this.form.pro_code.param,
        pro_command: this.form.pro_command,
        remark: this.form.remark
      }).then((res) => {
        if (res.code == 0)
          this.$emit("m_res", {
            "code": "success"
          });
        else
          this.$alert(res.msg, '错误', {
            confirmButtonText: '确定'
          });
      }).catch(err => {
        this.$alert(err, '错误', {
          confirmButtonText: '确定'
        });
      })
    }
  }
}
</script>