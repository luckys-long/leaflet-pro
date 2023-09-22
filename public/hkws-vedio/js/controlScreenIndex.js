$('#video1').on('click', function (event) {
  // event.preventDefault()
  $('#container-top').html('')
  $(this).parent('.container-left').addClass('avtiveCss').siblings('div').removeClass('avtiveCss')
  $('#container-top').append(' <video id="video4" class="video_size" autoplay="autoplay" loop="true"></video>')
  $('#container-top').append(' <div class="inputDiv" style="display: none;">\n' +
    '        <input id="ws_url_4" type="text" placeholder="请输入wwbsocket" value=""/>\n' +
    '        <input id="rtsp_url_4" type="text" placeholder="请输入RTSP" value=""/>\n' +
    '        <button id="play4" onclick="play()">播 放</button>\n' +
    '        <button id="stop4" onclick="stop4()">停 止</button>\n' +
    '      </div>')
  getScreen()
})
$('#video2').on('click', function (event) {
  // event.preventDefault()
  $('#container-top').html('')
  $(this).parent('.container-right').addClass('avtiveCss').siblings('div').removeClass('avtiveCss')
  $('#container-top').append(' <video id="video5" class="video_size" autoplay="autoplay" loop="true"></video>')
  $('#container-top').append(' <div class="inputDiv" style="display: none;">\n' +
    '        <input id="ws_url_5" type="text" placeholder="请输入wwbsocket" value="/"/>\n' +
    '        <input id="rtsp_url_5" type="text" placeholder="请输入RTSP" value=""/>\n' +
    '        <button id="play5" onclick="play()">播 放</button>\n' +
    '        <button id="stop5" onclick="stop5()">停 止</button>\n' +
    '      </div>')
  getScreen()
})
$('#video3').on('click', function (event) {
  // event.preventDefault()
  $('#container-top').html('')
  $(this).parent('.container-center').addClass('avtiveCss').siblings('div').removeClass('avtiveCss')
  $('#container-top').append(' <video id="video6" class="video_size" autoplay="autoplay" loop="true"></video>')
  $('#container-top').append('<div class="inputDiv" style="display: none;">\n' +
    '        <input id="ws_url_6" type="text" placeholder="请输入wwbsocket" value="/"/>\n' +
    '        <input id="rtsp_url_6" type="text" placeholder="请输入RTSP" value=""/>\n' +
    '        <button id="play6" onclick="play()">播 放</button>\n' +
    '        <button id="stop6" onclick="stop6()">停 止</button>\n' +
    '      </div>')
  getScreen()
})

var wfs4 = null
var wfs5 = null
var wfs6 = null
function getScreen(){
  var vedioList = JSON.parse(localStorage.getItem('vedioList'))
  var vediosUse4 = vedioList[0]
  var vediosUse5 = vedioList[1]
  var vediosUse6 = vedioList[2]
  if (document.getElementById('ws_url_4') != null) {
    document.getElementById('ws_url_4').value = 'ws://' + vediosUse4.videoWs + ':8124/'
    //document.getElementById('rtsp_url_4').value = 'rtsp://' + vediosUse4.videoName + vediosUse4.videoPsd + vediosUse4.videoIp
    document.getElementById('rtsp_url_4').value = 'rtsp://' + vediosUse4.videoName + ':' + vediosUse4.videoPsd + '@' + vediosUse4.videoIp

  }
  if(document.getElementById('ws_url_5') != null){
    document.getElementById('ws_url_5').value = 'ws://' + vediosUse5.videoWs + ':8124/'
    document.getElementById('rtsp_url_5').value = 'rtsp://' + vediosUse5.videoName + ':' + vediosUse5.videoPsd + '@' + vediosUse5.videoIp

  }
  if(document.getElementById('ws_url_6') != null){
    document.getElementById('ws_url_6').value = 'ws://' + vediosUse6.videoWs + ':8124/'
    document.getElementById('rtsp_url_6').value = 'rtsp://' + vediosUse6.videoName + ':' + vediosUse6.videoPsd + '@' + vediosUse6.videoIp
  }


  if (document.getElementById('ws_url_4') != null) {
    if (wfs4) {
      stop4()
    }
    wfs4 = new Wfs()
    var ws_url_4 = document.getElementById('ws_url_4').value
    var rtsp_url_4 = document.getElementById('rtsp_url_4').value
    if (ws_url_4 == '') {
      alert('请填写WebSocket Url')
      return false
    }
    if (rtsp_url_4 == '') {
      alert('请填写RTSP Url')
      return false
    }
    var video4 = document.getElementById('video4')
    wfs4.attachMedia(video4, rtsp_url_4, 'H264Raw', ws_url_4)

  }
  if (document.getElementById('ws_url_5') != null) {
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
  if (document.getElementById('ws_url_6') != null) {
    if (wfs6) {
      stop6()
    }
    wfs6 = new Wfs()
    var ws_url_6 = document.getElementById('ws_url_6').value
    var rtsp_url_6 = document.getElementById('rtsp_url_6').value
    if (ws_url_6 == '') {
      alert('请填写WebSocket Url')
      return false
    }
    if (rtsp_url_6 == '') {
      alert('请填写RTSP Url')
      return false
    }
    var video6 = document.getElementById('video6')
    wfs6.attachMedia(video6, rtsp_url_6, 'H264Raw', ws_url_6)
  }
}
function stop4() {
  wfs4.closeWebSocket()
  wfs4.destroy()
}

function stop5() {
  wfs5.closeWebSocket()
  wfs5.destroy()
}

function stop6() {
  wfs6.closeWebSocket()
  wfs6.destroy()
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
var video = document.getElementsByTagName('video1')
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
