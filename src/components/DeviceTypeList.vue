<template>
    <div>
        <el-input v-model="search.name" placeholder="类型名称" style="width:200px" />
        <el-input v-model="search.pro_code" placeholder="协议类型" style="width:200px" />
        <el-input v-model="search.net_code" placeholder="网络类型" style="width:200px" />
        <el-button type="primary" @click="refreshDeviceTypeList">查询</el-button>
        <el-button type="primary" @click="addDeviceType">添加</el-button>
        <el-button type="primary" @click="updateDeviceType">修改</el-button>
        <el-button type="primary" @click="delDeviceType">删除</el-button>
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="page.total" :size="page.size"
                @current-change="handlePageChange">
            </el-pagination>
        </div>
        <el-table ref="deviceTypeList" :data="deviceTypeList" highlight-current-row @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column prop="code" label="类型代码" width="180" />
            <el-table-column prop="name" label="类型名称" width="180" />
            <el-table-column prop="pro_name" label="协议类型" width="180" />
            <el-table-column prop="net_name" label="网络类型" />
            <el-table-column prop="commands" label="协议指令" />
            <el-table-column prop="remark" label="备注" />
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
            deviceTypeList: [],
            dialogVisible: false,
            currentRow: null,
            search: {
                name: "",
                pro_code: "",
                net_code: ""
            },
            page: { 
                total: 0,
                size: 10,
                pos: 1
            }
        }
    },
    created() {
        this.refreshDeviceTypeList();
    },
    methods: {
        addDeviceType() {
            this.$router.push({
                path :"/DeviceTypeList/DeviceTypeItem",
                query :{
                    opt: "insert"
                }
            });
            this.dialogVisible = true;
        },
        refreshDeviceTypeList() {
            this.page.pos = 1;
            this.$http.cors("/loans/device_type_manager/getDeviceTypeList", {
                name: this.search.name,
                pro_code: this.search.pro_code,
                net_code: this.search.net_code,
                page: this.page
            }).then((res) => {
                this.page.total = res.count;
                this.deviceTypeList = res.data;
            })
        },
        delDeviceType() {
            this.$http.cors("/loans/device_type_manager/delDeviceType", {
                "code": this.currentRow.code
            }).then((res) => {
                if (res.code == 0) {
                    this.refreshDeviceTypeList();
                } else {
                    this.$alert(res.msg, '错误', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        updateDeviceType(){
            this.$router.push({
                path :"/DeviceTypeList/DeviceTypeItem",
                query :{
                    opt: "update",
                    code: this.currentRow.code
                }
            });
            this.dialogVisible = true;
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        handlePageChange(val) {
            this.page.pos = val;
            this.refreshDeviceTypeList();
        },
        dialogClose() {
            this.$router.back();
            this.dialogVisible = false;
        },
        dialogSuccess() {
            this.$router.back();
            this.dialogVisible = false;
            this.refreshDeviceTypeList();
        }
    }
}
</script>