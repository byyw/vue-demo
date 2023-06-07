<template>
  <div>
    <el-form ref="DeviceItem" :model="form" label-width="100px">

      <el-form-item label="设备名称" :disabled="opt == 'update'">
        <el-input v-model="form.name" placeholder="请输入设备名称" />
      </el-form-item>

      <el-form-item label="设备类型">
        <el-select v-model="form.type" value-key="code" placeholder="请选择设备类型" :disabled="opt == 'update'">
          <el-option v-for=" tp in deviceTypeList" :key="tp.code" :label="tp.name" :value="tp"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="设备终端号">
        <el-input v-model="form.number" placeholder="请输入设备终端号" :disabled="opt == 'update'" />
      </el-form-item>

      <el-form-item label="SIM卡号">
        <el-input v-model="form.sim_no" placeholder="请输入SIM卡号" />
      </el-form-item>

      <el-form-item label="设备厂家">
        <el-input v-model="form.factory" placeholder="请输入设备厂家" />
      </el-form-item>

      <el-form-item label="设备型号">
        <el-input v-model="form.device_version" placeholder="请输入设备型号" />
      </el-form-item>

      <el-form-item label="软件版本">
        <el-input v-model="form.soft_version" placeholder="请输入软件版本" />
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="请输入备注" />
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
  name: "DeviceItem",
  props: {
    id: {
      type: String
    },
    opt: {
      type: String
    }
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        type: '',
        number: '',
        sim_no: "",
        factory: '',
        device_version: '',
        soft_version: '',
        remark: '',
      },
      deviceTypeList: [],
    }
  },
  watch: {
    async '$route'(to) {
      if (to.path != "/device_list/device_item")
        return;

      this.form = {
        id: '',
        name: '',
        type: '',
        number: '',
        sim_no: "",
        factory: '',
        device_version: '',
        soft_version: '',
        remark: '',
      }
      this.deviceTypeList = [];

      if (this.opt == 'update') {
        var d = (await this.$http.cors("php", "/loans/device_manager/getDeviceList", {
          id: this.id
        })).data[0];

        this.form.id = d.id;
        this.form.name = d.name;
        this.form.type = this.deviceTypeList.filter(it => it.code == d.type)[0];
        this.form.number = d.number;
        this.form.sim_no = d.sim_no;
        this.form.factory = d.factory;
        this.form.device_version = d.device_version;
        this.form.soft_version = d.soft_version;
        this.form.remark = d.remark;
      }
    }
  },
  async mounted() {
    this.deviceTypeList = (await this.$http.cors("php", "/loans/device_type_manager/getDeviceTypeList")).data;

    if (this.opt == 'update') {
      var d = (await this.$http.cors("php", "/loans/device_manager/getDeviceList", {
        id: this.id
      })).data[0];

      this.form.id = d.id;
      this.form.name = d.name;
      this.form.type = this.deviceTypeList.filter(it => it.code == d.type)[0];
      this.form.number = d.number;
      this.form.sim_no = d.sim_no;
      this.form.factory = d.factory;
      this.form.device_version = d.device_version;
      this.form.soft_version = d.soft_version;
      this.form.remark = d.remark;
    }
  },
  methods: {
    onSubmit() {
      if (this.opt == "update")
        this.updateDevice();
      else
        this.bindDevice();
    },
    onClose() {
      this.$emit("m_res", {
        "code": "close"
      });
    },
    bindDevice() {
      this.$http.cors("php", "/loans/device_manager/bindDevice", {
        name: this.form.name,
        type: this.form.type.code,
        type_name: this.form.type.name,
        pro_code: this.form.type.pro_code,
        pro_name: this.form.type.pro_name,
        number: this.form.number,
        sim_no: this.form.sim_no,
        factory: this.form.factory,
        device_version: this.form.device_version,
        soft_version: this.form.soft_version,
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
    updateDevice() {
      this.$http.cors("php", "/loans/device_manager/updateDevice", {
        id: this.form.id,
        name: this.form.name,
        sim_no: this.form.sim_no,
        factory: this.form.factory,
        device_version: this.form.device_version,
        soft_version: this.form.soft_version,
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