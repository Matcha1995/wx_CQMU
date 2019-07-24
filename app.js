//app.js
let Fly = require("/lib/wx")
const promisify = require('/utils/promisify')
// const openSocket = require('/utils/websocket.js')
const wxlogin = promisify(wx.login)
App({
  fly: new Fly,
  nfly: new Fly,
  // 登录
  userLogin:function(){
    let client_id = wx.getStorageSync('client_id')
    // let client_id = this.globalData.client_id
    console.log(client_id)
    return wxlogin()
      .then(ret =>{
        if(ret.code){
          return this.nfly.request(this.globalData.apiURL + "Login",{code:ret.code,client_id:client_id})
        }else{
          Promise.reject("获取用户登录态失败")
        }
      })
      .then(resp => {
        this.globalData.userStatus = resp.data.statusCode;
        wx.setStorageSync('skey', resp.data.skey);
        this.globalData.header.cookie = 'skey=' + resp.data.skey;
        Promise.resolve(this.globalData.userStatus);
      })
      .catch(err => {
        console.log(err)
      });
  },

  onLaunch:function(){
    wx.removeStorageSync('client_id')
    console.log(this.globalData.websocketStatus)
    if (!this.globalData.websocketStatus){
      console.log("启动websocket")
      this.openSocket();
    }

    // if (!this.globalData.socketStatus) {
    //   console.log("启动websocket")
    //   openSocket.connect(res => {
    //     console.log(res)
    //   });
    // }

    // 配置请求基地址
    this.fly.config.baseURL = "https://danthology.cn/"
    //拦截请求，添加cookie
    this.fly.interceptors.request.use((config, promise) => {
      config.headers = this.globalData.header;
      return config;
    });

    const newFly = new Fly;
    let _this = this;
    
    this.fly.interceptors.response.use(
      function (response) {
        // console.log(response)
        //skey过期
        if (response.data.statusCode === _this.globalData.resp.skeyExpire) {
          this.lock();
          return _this.userLogin()
            .then(() => {
              this.unlock();
              return newFly.request(response.request);
            })
          //参数错误
        } else if (response.data.statusCode === _this.globalData.resp.paraError) {
          return newFly.request(response.request);
        } 
        else if (response.data.statusCode ===301){
          wx.showToast({
            icon: "none",
            title: "重复绑定"
          })
          return response;
        } else if (response.data.statusCode === 302){
          wx.showToast({
            icon: "none",
            title: "没有该患者"
          })
          // console.log("没有该患者")
        }
        else {
          return response;
        }
      },
      function (err) {
        console.log(err);
        wx.showToast({
          icon: "none",
          title: "网络错误"
        })
      }
    )
  },
  
  
  openSocket() {
    // 打开信道
    wx.connectSocket({
      url: 'wss://danthology.cn:8282'
    })
    //打开时的动作
    wx.onSocketOpen(() => {
      console.log("WebSocket 已连接")
      this.globalData.websocketStatus = true
      this.sendMessage();
    })
    // 断开时的动作
    wx.onSocketClose(() => {
      console.log('WebSocket 已断开')
      this.globalData.websocketStatus = false
    })
    // 报错时的动作
    wx.onSocketError(error => {
      console.error('socket error:', error)
    })
    // 监听服务器推送的消息
    wx.onSocketMessage(message => {
      console.log(message)
      console.log(typeof message.data)
      let messageStr = message.data.replace(" ", "");
      console.log(messageStr)
      if (typeof messageStr != 'object') {
        messageStr = messageStr.replace(/\ufeff/g, ""); //重点
        var jj = JSON.parse(messageStr);       
        message = jj;
      }
      // console.log(message)
      // console.log(message.type)
      console.log("【websocket监听到消息】内容如下：");
      if(message.type == 'init'){
        let client_id = message.client_id
        console.log(client_id)
        // cb(client_id)
        this.globalData.client_id = client_id
        wx.setStorageSync('client_id', message.client_id)

      }else{
        let items = [];
        items.push(message)
        // console.log(items)
        this.globalData.callback(items)
      }  
    }) 
  },
  //关闭信道
  closeSocket() {
    if (this.globalData.websocketStatus) {
      wx.closeSocket({
        success: () => {
          this.globalData.websocketStatus = false
        }
      })
    }
  },
  // 发送消息函数
  sendMessage() {
    if (this.globalData.websocketStatus === true) {
      setInterval(()=>{
        //自定义的发给后台识别的参数
        wx.sendSocketMessage({
          data: "test message"
        })
      },3000)
    }
  },
 

  
  globalData: {
    header:{
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': 'skey=' + wx.getStorageSync("skey") //读取cookie
    },
    resp:{
      ok:200,
      skeyExpire:201,
      paraError:300,
      loginError:500
    },
    userStatus:200,
    websocketStatus:false, //websocket状态,false为closed，true为connected
    callback:function(){},
    client_id:null,
    userInfo: null,
    apiURL: 'https://danthology.cn/407/api/'
  }
})