const app = getApp()
Page({
  /* 页面的初始数据*/
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let str=[];
    // let kinds;
    // let pat_id = wx.getStorageSync('prePatId')
    app.fly.request(app.globalData.apiURL + 'getWarningInfo')
      .then(res => {
        if(res.data.data == ''){
          wx.showToast({
            icon: "none",
            title: "无服药告警信息"
          }) 
          wx.removeStorageSync('item')
        }else{
          this.setData({
            list: res.data.data
          })
          wx.setStorageSync('item', res.data.data)
        }
      })
      .catch(err => {
        console.log(err)
      })

      this.onSocketMessage()
  },

  //监听页面显示
  onShow: function () {
    //websocket断线重连
    if (!app.globalData.websocketStatus) {
      wx.connectSocket({
        url: 'wss://danthology.cn:8282'
      })
    }
    let _this = this
    // 定义所用系统
    let platform
    wx.getSystemInfo({
      success(res) {
        platform = res.platform
        console.log(platform)
      }
    })
    // if (platform == "ios") {
    //   _this.data.myInterval = setInterval(() => {
    //     app.fly.request(app.globalData.apiURL + 'getWarningInfo')
    //       .then(res => {
    //         console.log(res.data.data)
    //         if (res.data.data != '') {
    //           _this.setData({
    //             list: res.data.data
    //           })
    //         } 
    //       })
    //       .catch(err => {
    //         console.log(err)
    //       })
    //   }, 3000)

    // }
  },
  //监听页面销毁
  onUnload: function (){
    console.log("关闭定时器")
    clearInterval(this.data.myInterval);
  },



  openConfirm: function (e) {
    console.log(e)
    let that = this
    let list = this.data.list
    let index = e.currentTarget.dataset.index
    // let pat_id = list[index].pat_id
    // let drug_name = list[index].drug_name
    let id = list[index].id
    console.log(index)
    // console.log(list)
    // console.log(pat_id)
    console.log(id)
        wx.showModal({
            title: '告警确认',  
            content: '是否确认该条告警信息？',
            confirmText: "确定",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                  app.fly.request(app.globalData.apiURL + 'confirmWarning', { id: id})
                    .then(res => {
                      list.splice(index, 1)
                      that.setData({
                        list: list
                      })
                      that.onLoad()  //刷新页面
                    })
                    .catch(err=>{
                      console.log(err)
                    })   
                }else{
                    console.log('用户点击辅助操作')
                }
            }
        });
    },
    // 收到websocket传过来的消息
  onSocketMessage: function (e) {
    let _this = this
    app.globalData.callback = function (msg) {
      let item = wx.getStorageSync('item')
      console.log(item)
      if(item == ''){
        _this.setData({
          list:msg
        })
      }else{
        _this.setData({
          list: msg.concat(item)
        })
      } 
      wx.setStorageSync('item', _this.data.list)
    }
  },
})