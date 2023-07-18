<template>
  <div class="page">


    <div class="content">
        <div class="left-part">
            <div style="display: flex;">
                <el-input v-model="filterText" size="mini" placeholder="请输入设备类型" prefix-icon="el-icon-search"></el-input>
                <el-button icon="el-icon-refresh" plain size="mini"></el-button>
            </div>

            <div>
                <el-tree
                    ref="tree2"
                    class="filter-tree"
                    :data="treeData"
                    show-checkbox
                    :filter-node-method="filterNode"
                    node-key="id"
                    default-expand-all
                    :props="defaultProps">
                </el-tree>
            </div>

        </div>
        <div class="right-part">
            <div class="search-box">
                <el-form class="form" ref="form" :model="searchForm" label-width="80px">
                    <el-form-item label="设备名称">
                        <el-input v-model="searchForm.name" placeholder="请输入名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="绑定状态">
                        <el-select v-model="searchForm.state" placeholder="请选择绑定状态">
                            <el-option label="未绑定" value=""></el-option>
                            <el-option label="已绑定" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备状态">
                        <el-select v-model="searchForm.state" placeholder="请选择设备状态">
                            <el-option label="在线" value="shanghai"></el-option>
                            <el-option label="离线" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="refreshDeviceList" size="small">查询</el-button>
                        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="bindDevice" size="small">添加设备</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table ref="deviceList" class="table" :header-cell-style="tableStyle" :data="deviceList" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
                <el-table-column type="index" label="序号" :index="indexMethod"/>
                <el-table-column prop="name" label="设备名称" width="130" />
                <el-table-column prop="type_name" label="设备型号" width="130" />
                <el-table-column label="设备状态" >
                    <template slot-scope="scope">
                        <span>{{ scope.row.tcp_state }} , {{ scope.row.ws_state }} , {{ scope.row.http_state }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="终端号" />
                <el-table-column prop="online_time" label="创建时间" />
                <el-table-column prop="admin" label="创建用户" />
                <el-table-column prop="remark" label="备注" />
                <el-table-column label="操作" fixed="right" width="240">
                    <template slot-scope="scope" >
                        <el-button type="success" icon="el-icon-document" plain size="mini" @click="updateDevice(scope.row)">查看</el-button>
                        <el-button type="primary" icon="el-icon-edit-outline" plain size="mini" @click="updateDevice(scope.row)">修改</el-button>
                        <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="unbindDevice(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination :total="page.total" layout="total, sizes, prev, pager, next" :size="page.size" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

    </div>


    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
        <router-view @w_close="dialogClose" @w_success="dialogSuccess"></router-view>
    </el-dialog>
</div>
</template>

<script>
export default {
  name: "DeviceList",
  data() {
    return {
        filterText: '',
        searchForm: {
            name: '',
            state: '',
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        deviceList: [],
        dialogVisible: false,
        dialogTitle: "",
        currentRow: null,
        search: {
            state: "",
            name: "",
            type_name: "",
            number: "",
            sim_no: "",
            address: ""
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
    created() {
        this.getAllDeviceList()
        this.refreshDeviceList();
    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        indexMethod(index) {
            return index+1;
        },
        getAllDeviceList() {
            this.$http.cors("/loans/device_manager/getDeviceList" ).then((res) => {
                this.treeData = res.data
                console.log('===> res', res)
            })
        },
        refreshDeviceList() {
            this.page.pos = 1;
            this.$http.cors("/loans/device_manager/getDeviceList", {
                state: this.search.state,
                name: this.search.name,
                typeName: this.search.type_name,
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
            this.dialogDisplay("绑定设备");
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
            if(this.currentRow.type == ''){
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
            this.dialogDisplay("修改设备");
        },
        cleanUnbindOfflineDevice() {
            this.$http.cors("/loans/device_manager/cleanUnbindOfflineDevice", {}).then((res) => {
                if (res.code == 0) {
                    this.refreshDeviceList();
                } else {
                    this.$alert(res.msg, '错误', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        showData(row){
            if(row.pro_code == 0){
                this.$router.push({
                    path :"/DeviceList/GpsDataList",
                    query :{
                        number: row.number
                    }
                });
                this.dialogDisplay("设备数据");
            }
        },
        showVideo(row){
            if(row.pro_code == 0){
                this.$router.push({
                    path :"/DeviceList/GpsVideoList",
                    query :{
                        number: row.number
                    }
                });
                this.dialogDisplay("设备视频");
            }
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        handlePageChange(val) {
            this.page.pos = val;
            this.refreshDeviceList();
        },
        dialogDisplay(title){
            this.dialogTitle = title;
            this.dialogVisible = true;
        },
        dialogClose() {
            this.$router.back();
            this.dialogVisible = false;
        },
        dialogSuccess() {
            this.dialogClose();
            this.refreshDeviceList();
        }
  }
}
</script>
<style scoped>
.content {
    display: flex;
    height: 100%;
    justify-content: space-between;
}
.left-part {
    width: 264px;
    height: 1020px;
    border-top: 0;
    padding-right: 10px;
    padding-top: 10px;
    box-shadow: 1px 0px 2px  rgba(0, 0, 0, 0.2);
}
.right-part {
    padding: 0 10px;
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
    display: flex;
    justify-content: flex-end;
    padding: 20px 0;
}
</style>
