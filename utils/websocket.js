
var app = getApp();

export const connect = function(cb){
  // 打开信道
  wx.connectSocket({
    url: 'wss://danthology.cn:8282'
  })
  //打开时的动作
  wx.onSocketOpen(() => {
    console.log("WebSocket 已连接")
    console.log(app.globalData.socketStatus)
    app.globalData.socketStatus = true
    this.sendMessage();
  })
  // 断开时的动作
  wx.onSocketClose(() => {
    console.log('WebSocket 已断开')
    app.globalData.socketStatus = false
  })
  // 报错时的动作
  wx.onSocketError(error => {
    console.error('socket error:', error)
  })
  // 监听服务器推送的消息
  wx.onSocketMessage(message => {
    let messageStr = message.data.replace(" ", "");
    if (typeof messageStr != 'object') {
      messageStr = messageStr.replace(/\ufeff/g, ""); //重点
      var jj = JSON.parse(messageStr);
      message = jj;
    }
    console.log("【websocket监听到消息】内容如下：");
    if (message.type == 'init') {
      let client_id = message.client_id
      console.log(client_id)
      cb(client_id)
      app.globalData.client_id = client_id
      // wx.setStorageSync('client_id', message.client_id)
    } else {
      console.log(message)
      cb(message)
    }
  }) 

}
//关闭信道
let closeSocket = function() {
  if (app.globalData.socketStatus) {
    wx.closeSocket({
      success: () => {
        app.globalData.socketStatus = false
      }
    })
  }
}
// 发送消息函数
let sendMessage = function() {
  if (app.globalData.socketStatus) {
    setInterval(() => {
      //自定义的发给后台识别的参数
      wx.sendSocketMessage({
        data: "test message"
      })
    }, 3000)
  }
}
