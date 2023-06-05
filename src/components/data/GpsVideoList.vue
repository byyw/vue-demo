<template>
    <div>
        <el-row>
            <el-col :span="12">
                <video autoplay controls width="100%" id="channel_1" @click="videoPlay(1)"></video>
            </el-col>
            <el-col :span="12">
                <video autoplay controls width="100%" id="channel_2" @click="videoPlay(2)"></video>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <video autoplay controls width="100%" id="channel_3" @click="videoPlay(3)"></video>
            </el-col>
            <el-col :span="12">
                <video autoplay controls width="100%" id="channel_4" @click="videoPlay(4)"></video>
            </el-col>
        </el-row>
    </div>
</template>

<script>

import flvjs from 'flv.js';

function getUrl(url) {
    url = url.slice(url.indexOf("://") + 3)
    var e = url.indexOf("/");
    if (e != -1)
        return url.slice(0, e);
    else
        return url;
}

export default {
    name: "GpsVideoList", 
    props: {
        number: {
            type: String,
            required: true
        }
    },
    watch: {
        number() {
            // this.videoPlay();
        }
    },
    mounted() {
        // this.videoPlay();
    },
    methods: {
        async videoPlay(channel) {
            if (flvjs.isSupported()) {
                for (var i = 1; i <= 4; i++) {
                    if (channel && channel != i)
                        continue;
                    var res = await this.$http.cors("java","/jtt1078/realtimePlay", {
                        "simNo": this.number,
                        "channelNo": i
                    });
                    if (res.code != 0) {
                        this.$alert(res.msg, '错误', {
                            confirmButtonText: '确定'
                        });
                        return;
                    }
                    var videoElement = document.getElementById('channel_' + i);
                    var flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        // url: 'http://192.168.1.77:8083/media/getMediaStream?key=' + res.key //你的url地址
                        url: 'ws://'+getUrl(this.$http.defaults.baseURL['java'])+'/ws/media?key=' + res.key //你的url地址
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    flvPlayer.load();
                    flvPlayer.play();
                }
            }
        }
    }
}
</script>

<style></style>