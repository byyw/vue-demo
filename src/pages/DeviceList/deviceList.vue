<template>
    <div class="page">
        <div class="content">
            <div class="left-part">
                <div style="display: flex;">
                    <el-input v-model="filterText" size="mini" placeholder="请输入设备类型"
                        prefix-icon="el-icon-search"></el-input>
                    <el-button icon="el-icon-refresh" plain size="mini" @click="clearTreeInput"></el-button>
                </div>
                <div>
                    <el-tree ref="tree2" class="filter-tree" :data="treeData" show-checkbox :filter-node-method="filterNode"
                        node-key="id" default-expand-all :props="defaultProps" @check="refreshDeviceList">
                    </el-tree>
                </div>
            </div>

            <div class="right-part">
                <div class="search-box">
                    <el-form class="form" ref="form" :model="search" label-width="80px">
                        <el-form-item label="设备名称">
                            <el-input v-model="search.name" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label="绑定状态">
                            <el-select v-model="search.bind_state" placeholder="请选择绑定状态" clearable>
                                <el-option label="未绑定" value="0"></el-option>
                                <el-option label="已绑定" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设备状态">
                            <el-select v-model="search.net_state" placeholder="请选择设备状态" clearable>
                                <el-option label="在线" value="1"></el-option>
                                <el-option label="离线" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="refreshDeviceList()" size="small">查询</el-button>
                            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="bindDevice"
                                size="small">添加设备</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <el-table ref="deviceList" class="table" :header-cell-style="tableStyle" :data="deviceList"
                    highlight-current-row style="width: 100%">
                    <el-table-column type="index" label="序号" :index="indexMethod" />
                    <el-table-column prop="name" label="设备名称" width="130" />
                    <el-table-column prop="type_name" label="设备型号" width="130" />
                    <el-table-column label="设备状态">
                        <template slot-scope="scope">
                            <span>{{ (scope.row.tcp_state == 1 || scope.row.ws_state == 1 || scope.row.http_state == 1) ?
                                "在线" : "离线"
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="number" label="终端号" />
                    <el-table-column prop="create_time" label="创建时间" />
                    <el-table-column prop="xh_system_user" label="创建用户" />
                    <el-table-column prop="remark" label="备注" />
                    <el-table-column label="操作" fixed="right" width="240">
                        <template slot-scope="scope">
                            <el-button type="success" icon="el-icon-document" plain size="mini"
                                @click="lookDevice(scope.row)">查看</el-button>
                            <el-button type="primary" icon="el-icon-edit-outline" plain size="mini"
                                @click="updateDevice(scope.row)">修改</el-button>
                            <el-button type="danger" icon="el-icon-delete" plain size="mini"
                                @click="unbindDevice(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="block">
                    <el-pagination :total="page.total" layout="total, sizes, prev, pager, next" :size="page.size"
                        @current-change="handlePageChange" @size-change="handlePageSizeChange"></el-pagination>
                </div>
            </div>

        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
            <DeviceItem v-if="dialogComponent === 'DeviceItem'" :opt="deviceItem.opt" :id="deviceItem.id"
                @m_res="deviceItemRes"></DeviceItem>
        </el-dialog>
    </div>
</template>

<script>
import DeviceItem from "@/components/DeviceItem.vue";

export default {
    name: "DeviceList",
    components: {
        DeviceItem: DeviceItem,
    },
    data() {
        return {
            filterText: '',
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },

            dialogVisible: false,
            dialogTitle: "",
            dialogComponent: "",
            deviceList: [],
            deviceItem: {
                opt: "",
                id: ""
            },
            search: {
                name: '',
                bind_state: '',
                net_staet: ''
            },
            page: {
                total: 0,
                size: 10,
                pos: 1
            },
            tableStyle: {
                color: '#5D85F4',
                backgroundColor: '#EEF2FD'
            }
        }
    },
    mounted() {
        this.getAllDeviceTypeList();
        this.refreshDeviceList();
    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    methods: {
        clearTreeInput() {
            this.filterText = "";
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        indexMethod(index) {
            return index + 1;
        },
        getAllDeviceTypeList() {
            this.$http.cors("php", "/loans/device_type_manager/getDeviceTypeList", {}).then((res) => {
                this.treeData = res.data;
            })
        },
        refreshDeviceList(pos) {
            if (pos == null) pos = 1;
            this.page.pos = pos;
            var sc = {
                name: this.search.name,
                bind_state: this.search.bind_state,
                net_state: this.search.net_state,
                type: [],
                page: this.page
            };
            console.log(pos);
            var types = this.$refs.tree2.getCheckedNodes();
            types.forEach(e => {
                sc.type.push(e.code);
            });
            this.$http.cors("php", "/loans/device_manager/getDeviceList", sc).then((res) => {
                this.page.total = res.count;
                this.deviceList = res.data;
            })
        },
        bindDevice() {
            this.deviceItem.opt = "bind";
            this.dialogDisplay("绑定设备", "DeviceItem");
        },
        unbindDevice(currentRow) {
            if (currentRow == null) {
                this.$alert("请选择设备", '错误', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.$http.cors("php", "/loans/device_manager/unbindDevice", {
                id: currentRow.id
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
        lookDevice(currentRow) {
            this.deviceItem.opt = "look";
            this.deviceItem.id = currentRow.id;
            this.dialogDisplay("查看设备", "DeviceItem");
        },
        updateDevice(currentRow) {
            if (currentRow == null) {
                this.$alert("请选择设备", '错误', {
                    confirmButtonText: '确定'
                });
                return;
            }
            if (currentRow.type == null) {
                this.$alert("设备未绑定，无法修改", '错误', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.deviceItem.opt = "update";
            this.deviceItem.id = currentRow.id;
            this.dialogDisplay("修改设备", "DeviceItem");
        },
        cleanUnbindOfflineDevice() {
            this.$http.cors("php", "/loans/device_manager/cleanUnbindOfflineDevice", {}).then((res) => {
                if (res.code == 0) {
                    this.refreshDeviceList();
                } else {
                    this.$alert(res.msg, '错误', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        showData(row) {
            if (row.pro_code == 'gps') {
                this.selNumber = row.number;
                this.dialogDisplay("设备数据", "GpsDataList");
            }
        },
        showVideo(row) {
            if (row.pro_code == 'gps') {
                this.selNumber = row.number;
                this.dialogDisplay("设备视频", "GpsVideoList");
            }
        },
        showHisVideo(row) {
            if (row.pro_code == 'gps') {
                this.selNumber = row.number;
                this.dialogDisplay("历史视频", "GpsHisVideoList");
            }
        },
        handlePageChange(val) {
            this.refreshDeviceList(val);
        },
        handlePageSizeChange(val) {
            this.page.size = val;
            this.page.pos = 1;
            this.refreshDeviceList();
        },
        dialogDisplay(title, component) {
            this.dialogTitle = title;
            this.dialogVisible = true;
            this.dialogComponent = component;
        },
        dialogClose() {
            this.dialogComponent = "";
        },
        deviceItemRes(res) {
            if (res.code == "success") {
                this.refreshDeviceList();
            }
            this.dialogVisible = false;
        }
    }
}
</script>
<style scoped>
.content {
    width: 100%;
    display: flex;
    height: 100%;
    justify-content: start;
    max-height: 100vh;
    
}

.left-part {
    width: 264px;
    height: 90vh;
    border-top: 0;
    padding-right: 10px;
    padding-top: 10px;
    box-shadow: 1px 0px 2px rgba(0, 0, 0, 0.2);
}

.right-part {
    position: relative;
    width: calc(100% - 264px);
    height: 90vh;
    padding: 0 10px;
}
.table {
    width: 100%;
    height: calc(100vh - 300px);
    overflow: scroll;
}

.form {
    display: flex;
    flex-wrap: wrap;
}

.el-button--mini {
    padding: 7px 7px;
    border: none;
}

.block {
    width: 100%;
    padding-top: 20px;
    position: absolute;
    bottom: 0px;
    display:block;
    text-align: right;
}
</style>
