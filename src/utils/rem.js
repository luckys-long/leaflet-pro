function setRem() { 
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
  // 得到html的Dom元素
  const htmlDom = document.getElementsByTagName('html')[0]
  // 设置根元素字体大小 htmlWidth 是浏览器的宽度  /96是把浏览器(1920px)分为96份 一份是20px也就是html根元素是默认20px
  htmlDom.style.fontSize = htmlWidth / 96 + 'px' 
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}
