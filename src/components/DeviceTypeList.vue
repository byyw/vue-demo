<template>
    <div>
        <el-input v-model="search.name" placeholder="类型名称" style="width:200px" />
        <el-input v-model="search.pro_name" placeholder="协议类型" style="width:200px" />
        <el-input v-model="search.net_name" placeholder="网络类型" style="width:200px" />
        <el-button type="primary" @click="refreshDeviceTypeList">查询</el-button>
        <el-button type="primary" @click="addDeviceType">添加</el-button>
        <el-button type="primary" @click="updateDeviceType">修改</el-button>
        <el-button type="primary" @click="delDeviceType">删除</el-button>
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="page.total" :size="page.size"
                @current-change="handlePageChange">
            </el-pagination>
        </div>
        <el-table style="width: 100%" ref="deviceTypeList" :data="deviceTypeList" highlight-current-row
            @current-change="handleCurrentChange">
            <el-table-column prop="code" label="类型代码" width="180" />
            <el-table-column prop="name" label="类型名称" width="180" />
            <el-table-column prop="pro_name" label="协议类型" width="180" />
            <el-table-column prop="net_name" label="网络类型" />
            <el-table-column prop="commands" label="协议指令" />
            <el-table-column prop="remark" label="备注" />
        </el-table>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
            <DeviceTypeItem v-if="dialogComponent === 'DeviceTypeItem'" :opt="deviceTypeItem.opt"
                :code="deviceTypeItem.code" @m_res="deviceTypeItemRes">
            </DeviceTypeItem>
        </el-dialog>
    </div>
</template>

<script>

import DeviceTypeItem from "./DeviceTypeItem.vue";

export default {
    name: 'DeviceTypeList',
    components: {
        DeviceTypeItem: DeviceTypeItem
    },
    data() {
        return {
            dialogVisible: false,
            dialogTitle: "",
            dialogComponent: "",
            deviceTypeList: [],
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
            },
            deviceTypeItem: {
                opt: "",
                code: ""
            }
        }
    },
    created() {
        this.refreshDeviceTypeList();
    },
    methods: {
        addDeviceType() {
            this.deviceTypeItem.opt = "insert";
            this.dialogDisplay("设备类型", "DeviceTypeItem");
        },
        refreshDeviceTypeList() {
            this.page.pos = 1;
            this.$http.cors("php", "/loans/device_type_manager/getDeviceTypeList", {
                name: this.search.name,
                pro_name: this.search.pro_name,
                net_name: this.search.net_name,
                page: this.page
            }).then((res) => { 
                this.page.total = res.count;
                this.deviceTypeList = res.data; 
            })
        },
        delDeviceType() {
            if (this.currentRow == null) {
                this.$alert("请选择类型", '提示', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.$http.cors("php", "/loans/device_type_manager/delDeviceType", {
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
        updateDeviceType() {
            if (this.currentRow == null) {
                this.$alert("请选择类型", '提示', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.deviceTypeItem.opt = "update";
            this.deviceTypeItem.code = this.currentRow.code;
            this.dialogDisplay("设备类型", "DeviceTypeItem");
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        handlePageChange(val) {
            this.page.pos = val;
            this.refreshDeviceTypeList();
        },
        deviceTypeItemRes(res) {
            if (res.code == 'success') {
                this.refreshDeviceTypeList();
            }
            this.dialogVisible = false;
        },
        dialogDisplay(title, component) {
            this.dialogTitle = title;
            this.dialogVisible = true;
            this.dialogComponent = component;
        },
        dialogClose() {
            // 取消挂载，再次弹出时回触发组件挂载事件
            this.dialogComponent = "";
        }
    }
}
</script>