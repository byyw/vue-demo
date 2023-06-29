<template>
  <div>
    <div class="block">
      <el-select v-model="channelNo" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker v-model="dateRange" type="datetimerange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="primary" @click="videoPlay">播放</el-button>
      <el-button type="primary" @click="videoDownload">下载</el-button>
    </div>
    <el-container style="height: 700px;">
      <el-aside width="340px" height="150px" style="background-color: rgb(255, 255, 255)">
        <el-tree :data="treeData" @node-click="treeClick" :highlight-current="true"></el-tree>
      </el-aside>
      <el-main>
        <video autoplay controls width="100%" id="video" @click="videoPlay"></video>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import flvjs from 'flv.js';
import dayjs from "dayjs";

function getUrl(url) {
    url = url.slice(url.indexOf("://") + 3)
    var e = url.indexOf("/");
    if (e != -1)
        return url.slice(0, e);
    else
        return url;
}

export default {
  name: "GpsHisVideoList",
  props: {
    number: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      date: "",
      options: [{
        value: '1',
        label: '通道1'
      }, {
        value: '2',
        label: '通道2'
      }, {
        value: '3',
        label: '通道3'
      }, {
        value: '4',
        label: '通道4'
      }],
      channelNo: "1",
      dateRange: [new Date() - 86400000, new Date()],
      treeData: [],
      treeSel: "",
      hisData: {}
    }
  },
  watch: {
    number() {
      this.channelNo = "1";
      this.dateRange = [new Date() - 86400000, new Date()];
      this.treeData = [];
      this.hisData = {};
    },
    channelNo() {
      this.showTree(this.channelNo);
    }
  },
  methods: {
    async videoPlay() {
      if(this.hisData[this.channelNo][this.treeSel] == null){
        this.$alert('请选择视频', '错误', {
          confirmButtonText: '确定'
        });
        return;
      }
      if (flvjs.isSupported()) {
        var res = await this.$http.cors("java","/jtt1078/media/history/play", {
          "simNo": this.number,
          "channelNo": this.channelNo,
          "startTime": this.hisData[this.channelNo][this.treeSel].startTime,
          "endTime": this.hisData[this.channelNo][this.treeSel].endTime
        });
        if (res.code != 0) {
          this.$alert(res.msg, '错误', {
            confirmButtonText: '确定'
          });
          return;
        }
        var videoElement = document.getElementById("video");
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          // url: 'http://192.168.1.77:8083/media/getMediaStream?key=' + res.key //你的url地址
          url: 'ws://'+getUrl(this.$http.defaults.baseURL['java'])+'/ws/media?key=' + res.key //你的url地址
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
      }
    },
    async videoDownload() {
      if(this.hisData[this.channelNo][this.treeSel] == null){
        this.$alert('请选择视频', '错误', {
          confirmButtonText: '确定'
        });
        return;
      }
      var res = await this.$http.cors("java","/jtt1078/exitFileInServer", {
        "simNo": this.number,
        "channelNo": this.channelNo,
        "startTime": this.hisData[this.channelNo][this.treeSel].startTime,
        "endTime": this.hisData[this.channelNo][this.treeSel].endTime
      });
      if (res.code == 0) {
        window.location.href = this.$http.defaults.baseURL["java"]+"/file" + res.data;
      } else {
        if (res.msg == '设备未上传文件至服务器') {
          this.$confirm('设备未上传文件至服务器，是否开始上传?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.cors("java","/jtt1078/fileUpload", {
              "simNo": this.number,
              "channelNo": this.channelNo,
              "startTime": this.hisData[this.channelNo][this.treeSel].startTime,
              "endTime": this.hisData[this.channelNo][this.treeSel].endTime
            });
          }).catch(() => {
          });
        } else if (res.msg == '设备文件上传中') {
          this.$alert('设备文件上传中，请等待', '提升', {
            confirmButtonText: '确定'
          });
        }
      }
      console.log(res);
    },
    search() {
      this.$http.cors("java","/jtt1078/media/history/list", {
        simNo: this.number,
        channelNo: this.channelNo,
        startTime: dayjs(this.dateRange[0]).format("YYMMDDHHmmss"),
        endTime: dayjs(this.dateRange[1]).format("YYMMDDHHmmss")
      }).then((res) => {
        this.hisData[this.channelNo] = res.data;
        this.showTree(this.channelNo);
      })
      // this.hisData[this.channelNo] = [
      //   {
      //     "channelNo": 2,
      //     "mediaType": 0,
      //     "streamType": 1,
      //     "warnBit1": 1,
      //     "size": 13596184,
      //     "warnBit2": 134217728,
      //     "storageType": 1,
      //     "startTime": "230605081000",
      //     "endTime": "230605082000"
      //   }
      // ]
      this.showTree(this.channelNo);
    },
    showTree(channelNo) {
      var data = [];
      if (this.hisData[channelNo] == undefined) {
        this.treeData = data;
        return;
      }
      for (var i = 0; i < this.hisData[channelNo].length; i++) {
        var item = this.hisData[channelNo][i];
        var startTime = dayjs("20" + item.startTime, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
        var endTime = dayjs("20" + item.endTime, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
        data.push({
          id: i,
          label: startTime + " - " + endTime
        });
      }
      this.treeData = data;
    },
    treeClick(node) {
      this.treeSel = node.id;
    }
  }
}
</script>

<style></style>