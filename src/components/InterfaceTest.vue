<template>
    <div>
        <el-input v-model="url" placeholder="url"></el-input>
        <el-input v-model="times" placeholder="次数"></el-input>
        <el-button type="primary" @click="on">on</el-button>
        <el-row>
            <el-col :span="12"><el-input type="textarea" :rows="50" placeholder="request" v-model="request" /></el-col>
            <el-col :span="12"><el-input type="textarea" :rows="50" placeholder="response" v-model="response" /></el-col>
        </el-row>



    </div>
</template>

<script>
export default {
    name: "InterfaceTest",
    data() {
        return {
            url: "http://192.168.1.77:8083/jtt1078/realtimePlay",
            times: 1,
            request: '{"simNo":"00000000018542820192","channelNo":1,"mediaType":0,"streamType":0}',
            response: ""
        }
    },
    methods: {
        on() {
            this.response = "";
            for (let i = 0; i < this.times; i++) {
                this.$http.cors(this.url, JSON.parse(this.request)).then(res => {
                    this.response += JSON.stringify(res) + "\n\n";
                });
            }
        }
    }
}
</script>

<style></style>