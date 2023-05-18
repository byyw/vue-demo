<template>
    <div>
        <el-input v-model="search.state" placeholder="状态" style="width:200px" />
        <el-input v-model="search.name" placeholder="设备名称" style="width:200px" />
        <el-input v-model="search.type" placeholder="设备类型" style="width:200px" />
        <el-input v-model="search.number" placeholder="终端号" style="width:200px" />
        <el-input v-model="search.sim_no" placeholder="SIM卡号" style="width:200px" />
        <el-input v-model="search.address" placeholder="网络地址" style="width:200px" />
        <el-button type="primary" @click="refreshDeviceList">查询</el-button>
        <el-button type="primary" @click="updateDevice">修改</el-button>
        <el-button type="primary" @click="bindDevice">绑定</el-button>
        <el-button type="primary" @click="unbindDevice">解绑</el-button>
        <el-button type="primary" @click="cleanUnbindDevice">清除未注册-离线设备</el-button>
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="page.total" :size="page.size"
                @current-change="handlePageChange">
            </el-pagination>
        </div>
        <el-table ref="deviceList" :data="deviceList" highlight-current-row @current-change="handleCurrentChange"
            style="width: 100%">
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column prop="name" label="设备名称" width="180" />
            <el-table-column prop="type_name" label="设备类型" width="180" />
            <el-table-column prop="state" label="状态" />
            <el-table-column prop="number" label="终端号" />
            <el-table-column prop="sim_no" label="SIM卡号" />
            <el-table-column prop="online_time" label="上线时间" />
            <el-table-column prop="address" label="网络地址" />
            <el-table-column prop="remark" label="备注" />
        </el-table>
        <el-dialog title="设备类型" :visible.sync="dialogVisible">
            <router-view @w_close="dialogClose" @w_success="dialogSuccess"></router-view>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "DeviceList",
    data() {
        return {
            deviceList: [],
            dialogVisible: false,
            currentRow: null,
            search: {
                state: "",
                name: "",
                type: "",
                number: "",
                sim_no: "",
                address: ""
            },
            page: {
                total: 0,
                size: 10,
                pos: 1
            }
        }
    },
    created() {
        this.refreshDeviceList();
    },
    methods: {
        refreshDeviceList() {
            this.page.pos = 1;
            this.$http.cors("/loans/device_manager/getDeviceList", {
                state: this.search.state,
                name: this.search.name,
                type: this.search.type,
                number: this.search.number,
                sim_no: this.search.sim_no,
                address: this.search.address,
                page: this.page
            }).then((res) => {
                this.page.total = res.count;
                this.deviceList = res.data;
            })
        },
        bindDevice() {
            this.$router.push({
                path :"/DeviceList/DeviceItem",
                query :{
                    opt: "bind"
                }
            });
            this.dialogVisible = true;
        },
        unbindDevice() {
            this.$http.cors("/loans/device_manager/unbindDevice", {
                id: this.currentRow.id
            }).then((res) => {
                if (res.code == 0) {
                    this.refreshDeviceList();
                } else {
                    this.$alert(res.msg, '错误', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        updateDevice(){
            if(this.currentRow.state==0 || this.currentRow.state==1){
                this.$alert("设备未注册，无法修改", '错误', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.$router.push({
                path :"/DeviceList/DeviceItem",
                query :{
                    opt: "update",
                    id: this.currentRow.id
                }
            });
            this.dialogVisible = true;
        },
        cleanUnbindDevice() {
            this.$http.cors("/loans/device_manager/cleanUnbindDevice", {}).then((res) => {
                if (res.code == 0) {
                    this.refreshDeviceList();
                } else {
                    this.$alert(res.msg, '错误', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        handlePageChange(val) {
            this.page.pos = val;
            this.refreshDeviceList();
        },
        dialogClose() {
            this.$router.back();
            this.dialogVisible = false;
        },
        dialogSuccess() {
            this.$router.back();
            this.dialogVisible = false;
            this.refreshDeviceList();
        }
    }
}
</script>

<!-- 
命名空间

统合的抽象类，为所有对象的上级，有抽象类封装各种对象，实现，如果根据对象找另一个对象，
而统合的抽象类，在不同业务中是不同的


 -->