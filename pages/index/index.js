//index.js


const app = getApp()
const util = require('../../utils/util.js')
const promisify = require('../../utils/promisify')
const wxGetSetting = promisify(wx.getSetting)
const wxGetUserInfo = promisify(wx.getUserInfo)
const wxCheckSession = promisify(wx.checkSession)
Page({

  /*页面的初始数据*/
  data: {
    imgUrls:[
      {
      "url":"../../images/item_1.jpg"
    },
    {
      "url":"../../images/item_2.jpg"
    },
    {
      "url":"../../images/item_3.jpg"
    }
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    circular:true,
    previousMargin: 0,
    nextMargin: 0,
    userInfo:{},
    hasWxUserInfo: false,

  },



  checkSession: function () {
    //处理登录态问题
    if (wx.getStorageInfoSync('skey')) {
      wxCheckSession()
      .then(
        () =>{
          console.log("Wechat Session Key ok");
        }
      )
      .catch(
        () =>{
          console.log("Wechat Session Key expired");
          app.userLogin();
        }
      )
    } else {
      // 初次登录
      console.log("skey 不存在")
    }
  },
  setWxUserInfo: function () {
    if (!this.data.hasWxUserInfo) {
      return this.getUserInfoMagical()
        .then(() => {
          this.setData({
            hasWxUserInfo: true
          });
        })
    } else {
      return new Promise((resolve, reject) => {
        resolve()
      });
    }
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
            return wxGetUserInfo();
          } else
            return Promise.reject("Not authorized!");
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
          this.checkSession();
          return this.getUserDetailInfo();
        }
      )
      .catch(
        err => {
          console.log(err);
        }
      )
  },
  /**
   * 生命周期函数--监听页面加载
   */
 


  //获取初始新闻
  getNews:function(){
    app.fly.request(app.globalData.apiURL+"getNews")
    .then(ret=>{
      this.setData({
        news:ret.data,
      })
    })
  },
  

  //下拉刷新
  onPullDownRefresh:function(){
    let id = this.data.theFirstId;
    console.log(id)
    //显示顶部刷新图标
    wx.showNavigationBarLoading();
    app.fly.request(app.globalData.apiURL + 'getLatestNews', { theFirstId: id })
      .then(res=>{
        this.setData({
          news: res.data
        })
        wx.hideNavigationBarLoading();
      })
      .catch(err => { 
        console.log(err)
      })
  },

  // //上拉加载更多
  // onReachBottom:function(){
  //   //显示加载图标
  //   wx.showLoading({
  //     title: '加载中',
  //   });
  //   app.fly.request(app.globalData.apiURL + 'getHistoryNews', { theLastId: id })
  //     .then(res => {
  //       this.setData({
  //         news: res.data
  //       })
  //       wx.hideNavigationBarLoading();
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // },

  onLoad: function (options) {
    // wx.showLoading({
    //   title: "正在加载中",
    //   mask: true
    // })
    // this.getUserInfoMagical().then(() => {
    //   wx.hideLoading();
    // })
    app.fly.request(app.globalData.apiURL + 'getNews')
      .then(res =>{
        console.log(res.data.data)
        this.setData({
          news: res.data.data,
          theFirstId: res.data.data[0].id
        })
        console.log(res.data.data[0].id)
        console.log(res.data.data[length-1].id)
        wx.setStorageSync('theFirstId', res.data.data[0].id);
        wx.setStorageSync('theLastId', res.data.data[length - 1].id);
        console.log("本地存储的id为：" + wx.getStorageSync('theFirstId'))
        console.log("本地存储的id为：" + wx.getStorageSync('theLastId'))
      })
      .catch(err=>{})
  },
})