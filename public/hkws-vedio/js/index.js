(function () {
  var vedioList = JSON.parse(localStorage.getItem('vedioList'))
  if (vedioList != '') {
    var vediosUse1 = vedioList[0]
    var vediosUse2 = vedioList[1]
    var vediosUse3 = vedioList[2]
    var vediosUse5 = vedioList[3]
    document.getElementById('ws_url').value = 'ws://' + vediosUse1.videoWs + ':8124/'
    document.getElementById('rtsp_url').value =  'rtsp://' + vediosUse1.videoName + ':' + vediosUse1.videoPsd + '@' + vediosUse1.videoIp
    document.getElementById('ws_url_2').value = 'ws://' + vediosUse2.videoWs + ':8124/'
    document.getElementById('rtsp_url_2').value = 'rtsp://' + vediosUse2.videoName + ':' + vediosUse2.videoPsd + '@' + vediosUse2.videoIp
    document.getElementById('ws_url_3').value = 'ws://' + vediosUse3.videoWs + ':8124/'
    document.getElementById('rtsp_url_3').value = 'rtsp://' + vediosUse3.videoName + ':' + vediosUse3.videoPsd + '@' + vediosUse3.videoIp
    document.getElementById('ws_url_5').value = 'ws://' + vediosUse5.videoWs + ':8124/'
    document.getElementById('rtsp_url_5').value = 'rtsp://' + vediosUse5.videoName + ':' + vediosUse5.videoPsd + '@' + vediosUse5.videoIp
    play()
  }

  var wfs = null
  var wfs2 = null
  var wfs3 = null
  var wfs5 = null
  window.onload = function () {
    if (!Wfs.isSupported()) {
      alert('您的浏览器不支持 MediaSource Extend,某些功能使用将受到影响！')
    }
  }

  function play() {
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

    var video1 = document.getElementById('video1')

    wfs.attachMedia(video1, rtsp_url, 'H264Raw', ws_url)

    if (wfs2) {
      stop2()
    }
    wfs2 = new Wfs()
    var ws_url_2 = document.getElementById('ws_url_2').value
    var rtsp_url_2 = document.getElementById('rtsp_url_2').value
    if (ws_url_2 == '') {
      alert('请填写WebSocket Url')
      return false
    }
    if (rtsp_url_2 == '') {
      alert('请填写RTSP Url')
      return false
    }
    var video2 = document.getElementById('video2')
    wfs2.attachMedia(video2, rtsp_url_2, 'H264Raw', ws_url_2)


    if (wfs3) {
      stop3()
    }
    wfs3 = new Wfs()
    var ws_url_3 = document.getElementById('ws_url_3').value
    var rtsp_url_3 = document.getElementById('rtsp_url_3').value
    if (ws_url_3 == '') {
      alert('请填写WebSocket Url')
      return false
    }
    if (rtsp_url_3 == '') {
      alert('请填写RTSP Url')
      return false
    }
    var video3 = document.getElementById('video3')
    wfs3.attachMedia(video3, rtsp_url_3, 'H264Raw', ws_url_3)

    if (wfs5) {
      stop5()
    }
    wfs5 = new Wfs()
    var ws_url_5 = document.getElementById('ws_url_5').value
    var rtsp_url_5 = document.getElementById('rtsp_url_5').value
    if (ws_url_5 == '') {
      alert('请填写WebSocket Url')
      return false
    }
    if (rtsp_url_5 == '') {
      alert('请填写RTSP Url')
      return false
    }
    var video5 = document.getElementById('video5')
    wfs5.attachMedia(video5, rtsp_url_5, 'H264Raw', ws_url_5)

  }

  function stop() {
    wfs.closeWebSocket()
    wfs.destroy()
  }

  function stop2() {
    wfs2.closeWebSocket()
    wfs2.destroy()
  }

  function stop3() {
    wfs3.closeWebSocket()
    wfs3.destroy()
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
    video[i].addEventListener('dblclick', function () {
      if (checkFull() == false) {
        exitFullscreen()
      } else {
        FullScreen(this.id)
      }
    })
  }

  document.addEventListener('visibilitychange', function () {
    var isHidden = document.hidden
    if (isHidden) {
      Wfs.DefaultConfig.isHidden = true
    } else {
      Wfs.DefaultConfig.isHidden = false
    }
  })


})()


