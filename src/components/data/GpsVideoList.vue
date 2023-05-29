<template>
    <div>
        <div id="xxoo1"
            style="background-color: #333333;border-radius: 10px; overflow: hidden; width: 400px; height: 300px;"></div>
        <input id="tag1" style="width: 300px;">
        <button onclick="playVideo(1)">Play Video</button>
    </div>
</template>

<script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.js"></script>
<script type="text/javascript">
    /**
     * 创建一个FLV播放器，参数如下：
     * {
     *      container : 视频容器元素
     *      muted     : 是否静音
     *      url       : HTTP-FLV地址
     * }
     */
    function FLVPlayer(opts) {
        var videoElement = document.createElement('VIDEO');
        videoElement.autoplay = true;
        videoElement.controls = false;
        videoElement.muted = false;
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        opts.container.append(videoElement);

        this.container = opts.container;
        this.videoElement = videoElement;
        this.httpFlvURL = opts.url;

        this.mediaInfo = null;
        this.play = null;
        this.onPlayEvtListener = null;
        this.onPauseEvtListener = null;
        this.onStopEvtListener = null;

        this.autoFastForward = opts.autoFastForward;
        this.autoFastForwardInterval = null;

        this.play = function () {
            if (this.player) return;
            var self = this;
            self.player = new flvjs.createPlayer({
                type: 'flv',
                url: self.httpFlvURL,
                isLive: true,
                enableWorker: true,
                enableStashBuffer: true,
                autoCleanupSourceBuffer: true,
                autoCleanupMaxBackwardDuration: 5,
                autoCleanupMinBackwardDuration: 1
            });

            self.player.on('media_info', function () {
                self.mediaInfo = self.player.mediaInfo;
            });

            self.player.on('statistics_info', function () {
                console.log(arguments);
            });

            var autoPlayTimer = null;
            self.videoElement.addEventListener('player', function (e) {
                if (autoPlayTimer) clearInterval(autoPlayTimer);
                if (self.onPlayEvtListener) self.onPlayEvtListener(self, e);
            });
            self.videoElement.addEventListener('dblclick', function () {
                if (self.videoElement.requestFullscreen) self.videoElement.requestFullscreen();
            });
            autoPlayTimer = setInterval(function () {
                try { self.player.play(); } catch (e) { clearInterval(autoPlayTimer); };
            });

            self.player.attachMediaElement(self.videoElement);
            self.player.load();
            self.player.play();

            if (this.autoFastForward) this.autoFastForwardInterval = setInterval(function () {
                if (self.videoElement.buffered.length > 0 && self.videoElement.buffered.end(0) - self.videoElement.currentTime > 2) {
                    console.log(self.videoElement.buffered.end(0) + "-" + self.videoElement.currentTime);
                    self.videoElement.currentTime = self.videoElement.buffered.end(0) - 1;
                }
            }, 1000);
        };

        this.fullscreen = function () {
            if (this.videoElement && this.videoElement.requestFullscreen)
                this.videoElement.requestFullscreen();
        };

        this.onPlay = function (fn) {
            this.onPlayEvtListener = fn;
        };

        this.destroy = function () {
            this.player.destroy();
            clearInterval(this.autoFastForwardInterval);
        }
    }
</script>
<script type="text/javascript">
    if (location.hash) {
        var hash = location.hash.substring(1);
        $('#tag').val(hash);
    }
    function playVideo(i) {

        var videoPlayer = new FLVPlayer({
            container: $("#xxoo"+i),
            url: $("#tag"+i).val(),
            // 自动快进追祯，但是可能会导致画面停顿
            autoFastForward: false
        });
        videoPlayer.play();
    }
</script>
<script>
export default {
    name: "GpsVideoList",
    mounted(){
        
    }
}
</script>

<style></style>