<template>
    <div>
        <el-input v-model="search.name" placeholder="设备名称" style="width:200px" />
        <el-input v-model="search.type_name" placeholder="设备类型" style="width:200px" />
        <el-input v-model="search.pro_name" placeholder="协议类型" style="width:200px" />
        <el-select v-model="search.state" clearable placeholder="请选择" style="width:150px">
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-select v-model="search.net_state" multiple placeholder="请选择" style="width:200px">
            <el-option v-for="item in netStateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
        </el-select>
        <el-input v-model="search.number" placeholder="终端号" style="width:200px" />
        <el-input v-model="search.sim_no" placeholder="SIM卡号" style="width:200px" />
        <el-input v-model="search.address" placeholder="网络地址" style="width:200px" />
        <el-button type="primary" @click="refreshDeviceList()">查询</el-button>
        <el-button type="primary" @click="bindDevice">绑定</el-button>
        <el-button type="primary" @click="unbindDevice">解绑</el-button>
        <el-button type="primary" @click="updateDevice">修改</el-button>
        <el-button type="primary" @click="cleanUnbindOfflineDevice">清除未绑定-离线设备</el-button>
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="page.total" :size="page.size" :current-page="page.pos"
                @current-change="handlePageChange">
            </el-pagination>
        </div>
        <el-table ref="deviceList" :data="deviceList" highlight-current-row @current-change="handleCurrentChange"
            style="width: 100%">
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column prop="name" label="设备名称" width="180" />
            <el-table-column prop="type_name" label="设备类型" />
            <el-table-column prop="pro_name" label="协议类型" />
            <el-table-column prop="name" label="状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.type_name == null ? "未绑定" : "已绑定" }}</span>
                </template>
            </el-table-column>
            <el-table-column label="网络状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.tcp_state == -1 ? "" : scope.row.tcp_state == 0 ? " tcp关 " : " tcp开 " }}</span>
                    <span>{{ scope.row.http_state == -1 ? "" : scope.row.http_state == 0 ? " http关 " : " http开 " }}</span>
                    <span>{{ scope.row.ws_state == -1 ? "" : scope.row.ws_state == 0 ? " websocket关 " : " websocket开 "}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="number" label="终端号" />
            <el-table-column prop="sim_no" label="SIM卡号" />
            <el-table-column prop="online_time" label="上线时间" />
            <el-table-column prop="address" label="网络地址" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="showData(scope.row)"
                        v-if="scope.row.pro_name === 'jtt808/1078'">数据</el-button>
                    <el-button type="primary" size="mini" @click="showVideo(scope.row)"
                        v-if="scope.row.pro_name === 'jtt808/1078'">实时</el-button>
                    <el-button type="primary" size="mini" @click="showHisVideo(scope.row)"
                        v-if="scope.row.pro_name === 'jtt808/1078'">回放</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose">
            <DeviceItem v-if="dialogComponent === 'DeviceItem'" :opt="deviceItem.opt" :id="deviceItem.id"
                @m_res="deviceItemRes"></DeviceItem>
            <GpsDataList v-if="dialogComponent === 'GpsDataList'" :number="selNumber"></GpsDataList>
            <GpsVideoList v-if="dialogComponent === 'GpsVideoList'" :number="selNumber"></GpsVideoList>
            <GpsHisVideoList v-if="dialogComponent === 'GpsHisVideoList'" :number="selNumber"></GpsHisVideoList>
        </el-dialog>
    </div>
</template>

<script>
import DeviceItem from "./DeviceItem.vue";
import GpsDataList from "./data/GpsDataList.vue";
import GpsVideoList from "./data/GpsVideoList.vue";
import GpsHisVideoList from "./data/GpsHisVideoList.vue";

export default {
    name: "DeviceList",
    components: {
        DeviceItem: DeviceItem,
        GpsDataList: GpsDataList,
        GpsVideoList: GpsVideoList,
        GpsHisVideoList: GpsHisVideoList,
    },
    data() {
        return {
            dialogVisible: false,
            dialogTitle: "",
            dialogComponent: "",
            deviceList: [],
            currentRow: null,
            search: {
                name: "",
                type_name: "",
                pro_name: "",
                state: "",
                net_state: [],
                number: "",
                sim_no: "",
                address: ""
            },
            page: {
                total: 0,
                size: 10,
                pos: 1
            },
            selNumber: "",
            deviceItem: {
                opt: "",
                id: ""
            },
            stateList: [{
                value: 0,
                label: "未绑定"
            }, {
                value: 1,
                label: "已绑定"
            }],
            netStateList: [{
                value: 0,
                label: "tcp开"
            }, {
                value: 1,
                label: "http开"
            }, {
                value: 2,
                label: "websocket通"
            }]

        }
    },
    created() {
        this.refreshDeviceList();
    },
    methods: {
        refreshDeviceList(pos) {
            if (pos == null) pos = 1;
            this.page.pos = pos;
            var sc = {
                name: this.search.name,
                type_name: this.search.type_name,
                pro_name: this.search.pro_name,
                state: this.search.state,
                number: this.search.number,
                sim_no: this.search.sim_no,
                address: this.search.address,
                page: this.page
            };
            for (var i = 0; i < this.search.net_state.length; i++) {
                if (this.search.net_state[i] == 0) {
                    sc.tcp_state = 1;
                } else if (this.search.net_state[i] == 1) {
                    sc.http_state = 1;
                } else if (this.search.net_state[i] == 2) {
                    sc.ws_state = 1;
                }
            }
            this.$http.cors("php", "/loans/device_manager/getDeviceList", sc).then((res) => {
                this.page.total = res.count;
                this.deviceList = res.data;
            })
        },
        bindDevice() {
            this.deviceItem.opt = "bind";
            this.dialogDisplay("绑定设备", "DeviceItem");
        },
        unbindDevice() {
            if (this.currentRow == null) {
                this.$alert("请选择设备", '错误', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.$http.cors("php", "/loans/device_manager/unbindDevice", {
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
        updateDevice() {
            if (this.currentRow == null) {
                this.$alert("请选择设备", '错误', {
                    confirmButtonText: '确定'
                });
                return;
            }
            if (this.currentRow.type == null) {
                this.$alert("设备未绑定，无法修改", '错误', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.deviceItem.opt = "update";
            this.deviceItem.id = this.currentRow.id;
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
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        handlePageChange(val) {
            this.refreshDeviceList(val);
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

<!-- 
命名空间

统合的抽象类，为所有对象的上级，有抽象类封装各种对象，实现，如果根据对象找另一个对象，
而统合的抽象类，在不同业务中是不同的


 -->