const app = getApp()
const promisify = require('../../utils/promisify')
const wxGetSetting = promisify(wx.getSetting)
const wxGetUserInfo = promisify(wx.getUserInfo)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHide:false,
    userInfo:{},
    hasUserInfo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading({
      title: "正在加载中",
      mask: true
    })
    this.getUserInfoMagical().then(() => {
      wx.hideLoading();
    })
  },


  getUserInfoMagical: function () {
    // 获取用户微信信息
    return wxGetSetting()
      .then(
        res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            console.log("Bravo! You are authorized!");
            this.setData({
              hasWxUserInfo: true
            });
            wx.switchTab({
              url: '../index/index',
            })
            return wxGetUserInfo();
          } else{
            // 用户没有授权
            this.setData({
              isHide:true
            })
          }
        }
      )
      .then(
        res => {
          // 获取用户微信信息成功
          // 可以将 res 发送给后台解码出 unionId
          app.globalData.userInfo = res.userInfo;
          console.log("Got your information from Wechat!");
          this.setData({
            userInfo: res.userInfo
          });

        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  },

  bindGetUserInfo:function(e){
    if(e.detail.userInfo){
      // 用户按了允许授权按钮后需要处理的逻辑
      wx.switchTab({
        url: '../index/index',
      })
      that.setData({
        isHide:false
      })
    }else{
      // 用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序！！',
        showCancel:false,
        confirmText:"返回授权",
        success:function(res){
          if(res.confirm){
            console.log("用户点击了“返回授权")
          }
        }
      })
    }
  }

  
})