(function() {

  var vedioList = JSON.parse(localStorage.getItem('vedioDetail'))
  if(vedioList!= ''){
    var vediosUse1 = vedioList[0]
    console.log("===>",vediosUse1)
    document.getElementById('ws_url').value = 'ws://' + vediosUse1.videoWs + ':8124/'
    document.getElementById('rtsp_url').value = 'rtsp://' + vediosUse1.videoName + ':' + vediosUse1.videoPsd + '@' + vediosUse1.videoIp
    play()

  }


  var wfs = null
  window.onload = function() {
    if (!Wfs.isSupported()) {
      alert('您的浏览器不支持 MediaSource Extend,某些功能使用将受到影响！')
    }
  }

  function play() {
    console.log(wfs)
    if (wfs) {
      stop()
    }
    wfs = new Wfs()
    var ws_url = document.getElementById('ws_url').value
    var rtsp_url = document.getElementById('rtsp_url').value

    if (ws_url == '') {
      alert('请填写WebSocket Url')
      return false
    }
    if (rtsp_url == '') {
      alert('请填写RTSP Url')
      return false
    }

    var videomap = document.getElementById('videomap')

    wfs.attachMedia(videomap, rtsp_url, 'H264Raw', ws_url)
  }

  function stop() {
    wfs.closeWebSocket()
    wfs.destroy()
  }


// 检测是否全屏
  function checkFull() {
    var isFull =
      document.fullscreenEnabled ||
      window.fullScreen ||
      document.webkitIsFullScreen ||
      document.msFullscreenEnabled
    if (isFull === undefined) isFull = false
    return isFull
  }

//进入全屏
  function FullScreen(id) {
    var ele = document.getElementById(id)
    if (ele.requestFullscreen) {
      ele.requestFullscreen()
    } else if (ele.mozRequestFullScreen) {
      ele.mozRequestFullScreen()
    } else if (ele.webkitRequestFullScreen) {
      ele.webkitRequestFullScreen()
    } else if (ele.msRequestFullscreen) {
      ele.msRequestFullscreen()
    } else if (ele.oRequestFullscreen) {
      ele.oRequestFullscreen()
    }
  }

//退出全屏
  function exitFullscreen() {
    var de = document
    if (de.exitFullscreen) {
      de.exitFullscreen()
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen()
    } else if (de.webkitExitFullscreen) {
      de.webkitExitFullscreen()
    } else if (de.msExitFullscreen) {
      de.msExitFullscreen()
    } else if (de.oRequestFullscreen) {
      de.oCancelFullScreen()
    }
  }

//------------------事件监听 start ---------------------------

  // 双击全屏、非全屏切换
  var video = document.getElementsByTagName('video')
  for (var i = 0; i < video.length; i++) {
    video[i].addEventListener('dblclick', function() {
      if (checkFull() == false) {
        exitFullscreen()
      } else {
        FullScreen(this.id)
      }
    })
  }

  document.addEventListener('visibilitychange', function() {
    var isHidden = document.hidden
    if (isHidden) {
      Wfs.DefaultConfig.isHidden = true
    } else {
      Wfs.DefaultConfig.isHidden = false
    }
  })
})()


