<template>
    <div>
        <el-button type="primary" @click="refreshGpsDataList">刷新</el-button>
        <div class="block">
            <el-pagination layout="prev, pager, next" :total="page.total" :size="page.size"
                @current-change="handlePageChange">
            </el-pagination>
        </div>
        <el-table ref="gpsList" :data="gpsList" highlight-current-row 
            max-height="800px">
            <!-- <el-table-column prop="id" label="主键" /> -->
            <!-- <el-table-column prop="alarm" label="报警标志" />
            <el-table-column prop="status_field" label="状态位" /> -->
            <el-table-column prop="altitude" label="海拔高度" />
            <el-table-column prop="course" label="方向" />
            <el-table-column prop="latitude" label="纬度 " />
            <el-table-column prop="longitude" label="经度" />
            <el-table-column prop="speed" label="速度 km/h" />
            <el-table-column prop="sim_no" label="终端手机号" />
            <el-table-column prop="time" label="定位时间" />
            <!-- <el-table-column prop="message" label="原始报文" /> -->
            <el-table-column prop="create_time" label="入库时间" />
            <el-table-column prop="addr" label="地址" />
            <el-table-column prop="glat" label="高德纬度" />
            <el-table-column prop="glng" label="高德经度" />
            <!-- <el-table-column prop="xh_vehicle_id" label="xh_vehicle 表id" /> -->
            <el-table-column prop="state" label="状态">
                <template slot-scope="scope">
                    <span>{{
                        scope.row.state == "3" ? '离线' :
                        scope.row.state == "7" ? '在线-行驶' :
                            scope.row.state == "8" ? '在线-行驶-报警' :
                                scope.row.state == "9" ? '在线-停车-ACC关' :
                                    scope.row.state == "10" ? '在线-停车-ACC开' :
                                        scope.row.state == "11" ? '在线-停车-ACC关-报警' :
                                            scope.row.state == "12" ? '在线-停车-ACC开-报警' :
                                                scope.row.state == "13" ? '在线-无效定位' : scope.row.stat
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="acc_stutus" label="ACC">
                <template slot-scope="scope">
                    <span>{{ scope.row.acc_stutus == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="positioning" label="定位">
                <template slot-scope="scope">
                    <span>{{ scope.row.positioning == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="latitudes" label="">
                <template slot-scope="scope">
                    <span>{{ scope.row.latitudes == 0 ? '北纬' : '南纬' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="through" label="">
                <template slot-scope="scope">
                    <span>{{ scope.row.through == 0 ? '东经' : '西经' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="">
                <template slot-scope="scope">
                    <span>{{ scope.row.status == 0 ? '运营' : '停运' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="keep_secret" label="">
                <template slot-scope="scope">
                    <span>{{ scope.row.keep_secret == 0 ? '经纬度未经保密插件加密' : '经纬度已经保密插件加密' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="fully_loaded_state" label="载况">
                <template slot-scope="scope">
                    <span>{{ scope.row.fully_loaded_state == "00" ? '空车' :
                        scope.row.fully_loaded_state == "01" ? '半载' :
                            scope.row.fully_loaded_state == "10" ? '保留' :
                                scope.row.fully_loaded_state == "11" ? '满载' : scope.row.fully_loaded_state
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="oil_way" label="油路">
                <template slot-scope="scope">
                    <span>{{ scope.row.oil_way == 0 ? '油路正常' : '油路断开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="circuit" label="电路">
                <template slot-scope="scope">
                    <span>{{ scope.row.circuit == 0 ? '电路正常' : '电路断开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="car_unlock" label="车门">
                <template slot-scope="scope">
                    <span>{{ scope.row.car_unlock == 0 ? '车门解锁' : '车门加锁' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="front_door" label="前门">
                <template slot-scope="scope">
                    <span>{{ scope.row.front_door == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="middle_door" label="中门">
                <template slot-scope="scope">
                    <span>{{ scope.row.middle_door == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="back_door" label="后门">
                <template slot-scope="scope">
                    <span>{{ scope.row.back_door == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="drive_door" label="驾驶席门">
                <template slot-scope="scope">
                    <span>{{ scope.row.drive_door == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="customize" label="自定义">
                <template slot-scope="scope">
                    <span>{{ scope.row.customize == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="gps_satellite" label="GPS">
                <template slot-scope="scope">
                    <span>{{ scope.row.gps_satellite == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="beidou_satellite" label="北斗">
                <template slot-scope="scope">
                    <span>{{ scope.row.beidou_satellite == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="glonass_satellite" label="GLONASS">
                <template slot-scope="scope">
                    <span>{{ scope.row.glonass_satellite == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="galileo_satellite" label="Galileo">
                <template slot-scope="scope">
                    <span>{{ scope.row.galileo_satellite == 0 ? '关' : '开' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="urgent_status" label="紧急报警" />
            <el-table-column prop="spdeing_stuts" label="超速报警" />
            <el-table-column prop="fatigue_status" label="疲劳驾驶" />
            <el-table-column prop="danger_status" label="危险预警" />
            <el-table-column prop="gnss_malfunction" label="GNSS模块发生故障" />
            <el-table-column prop="gnss_shear" label="GNSS天线未接或被剪断" />
            <el-table-column prop="gnss_circuit" label="GNSS天线短路" />
            <el-table-column prop="terminal_undervoltage" label="主电源欠压" />
            <el-table-column prop="terminal_power_down" label="主电源掉电" />
            <el-table-column prop="terminal_lcd" label="终端LCD或显示器故障" />
            <el-table-column prop="terminal_tts" label="TTS模块故障" />
            <el-table-column prop="camera_failure" label="摄像头故障" />
            <el-table-column prop="way_ic" label="道路运输证IC卡模块故障" />
            <el-table-column prop="speeding_warning" label="超速预警" />
            <el-table-column prop="fatigue_driving" label="疲劳驾驶预警" />
            <el-table-column prop="driving_overtime" label="当天累计驾驶超时" />
            <el-table-column prop="overtime_parking" label="超时停车" />
            <el-table-column prop="inout_area" label="进出区域" />
            <el-table-column prop="inout_route" label="进出路线" />
            <el-table-column prop="insufficient_driving_time" label="路段行驶时间不足/过长" />
            <el-table-column prop="route_deviation_alarm" label="路线偏离报警" />
            <el-table-column prop="vss_malfunction" label="车辆VSS故障" />
            <el-table-column prop="oil_abnormal" label="车辆油量异常" />
            <el-table-column prop="vehicle_stolen" label="车辆被盗" />
            <el-table-column prop="vehicle_ignition" label="车辆非法点火" />
            <el-table-column prop="vehicle_shift" label="车辆非法位移" />
            <el-table-column prop="collision_warning" label="碰撞预警" />
            <el-table-column prop="rollover_warning" label="侧翻预警" />
            <el-table-column prop="illegal_open" label="非法开门报警" />
            <el-table-column prop="mileage" label="里程（1/10km）" />
            <el-table-column prop="voltage" label="电压/电量" />
            <el-table-column prop="voltage_two" label="电压2/电量" />
            <el-table-column prop="oil_volume" label="油量（1/10L）" />
            <el-table-column prop="speeds" label="行驶记录速度（1/10km/h）" />
            <el-table-column prop="alarm_event" label="人工确认报警事件的 ID" />
            <el-table-column prop="speeding_alarm" label="超速报警附加信息" />
            <el-table-column prop="route_alarm" label="进出区域/路线报警附加信息" />
            <el-table-column prop="long_alarm" label="路段行驶时间不足/过长报警附加信息" />
            <el-table-column prop="signal_status" label="扩展车辆信号状态位" />
            <el-table-column prop="io_status" label="IO状态位" />
            <el-table-column prop="analog" label="模拟量" />
            <el-table-column prop="signal_strength" label="信号强度" />
            <el-table-column prop="gnss" label="定位卫星数" />
            <!-- <el-table-column prop="custom_route_alarm" label="(已弃用)自定义进出区域报警  ;区域id,是否区域内,拐点1,拐点2;" />
            <el-table-column prop="custom_speed_alarm" label="(已弃用)自定义超速报警  ;区域id,是否区域内超速,拐点;" /> -->
            <el-table-column prop="warm_alarm" label="1078视频报警" />
            <el-table-column prop="video_loss" label="视频信号丢失" />
            <el-table-column prop="video_shield" label="视频信号遮挡报警" />
            <el-table-column prop="memory_failure" label="存储单元故障报警" />
            <el-table-column prop="other_video_alarm" label="其他视频设备故障报警" />
            <el-table-column prop="overload" label="客车超员报警" />
            <el-table-column prop="abnormal_drive" label="异常驾驶行为报警" />
            <el-table-column prop="memory_to_limit" label="特殊报警录像达到存储阈值报警" />
            <el-table-column prop="lose_alarm" label="视频信号丢失报警状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.lose_alarm?.toString(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="shield_alarm" label="视频信号遮挡报警状态" />
            <el-table-column prop="memory_alarm" label="存储器故障报警状态" />
            <el-table-column prop="abnormal_alarm" label="异常驾驶行为报警详细描述" />
            <el-table-column prop="other_attribute" label="gw_gps_tag.table_tag" />
            <el-table-column prop="custom_warn_state" label="自定义区域报警状态" />
            <el-table-column prop="custom_warn_flags" label="自定义区域报警特征值" />
            <el-table-column prop="is_his" label="是否是补报数据" />
        </el-table>
    </div>
</template>

<script>
export default {
    name: "GpsDataList",
    props: {
        number: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            gpsList: [],
            page: {
                total: 0,
                size: 10,
                pos: 1
            }
        }
    },
    watch: {
        number() {
            this.refreshGpsDataList();
        }
    },
    mounted() {
        this.refreshGpsDataList();
    },
    methods: {
        refreshGpsDataList() {
            this.$http.cors("php","/loans/gps_data_manager/getGpsDataList", {
                number: this.number,
                page: this.page
            }).then((res) => {
                this.page.total = res.count;
                this.gpsList = res.data;
            })
        },
        handlePageChange(val) {
            this.page.pos = val;
            this.refreshGpsDataList();
        },
    }
}
</script>

<style></style>
