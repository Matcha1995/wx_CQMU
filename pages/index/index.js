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
    


  },

  //获取初始新闻
  getNews:function(){
    app.fly.request(app.globalData.apiURL+"getNews")
    .then(res=>{
      
      console.log(res.data.data)
      if (res.data.data != ''){
        //获取数组长度
        let length = res.data.data.length
        this.setData({
          news: res.data.data,
          theFirstId: res.data.data[0].id,  //最大的id
          theLastId: res.data.data[length - 1].id, //最小的id
        })
      }else{
        console.log("没有新闻数据！！！")
      }
    })
    .catch(err=>{
      console.log(err)
    })
  },
  

  //下拉刷新
  onPullDownRefresh:function(){
    console.log(this.data.news)
    let news = this.data.news
    let length = news.length
    console.log(length)
    let theFirstId = news[0].id
    let theLastId = news[length-1].id
    console.log(theFirstId, theLastId)
    //显示顶部刷新图标
    wx.showNavigationBarLoading();
    app.fly.request(app.globalData.apiURL + 'getLatestNews', { theFirstId: theFirstId, theLastId: theLastId })
      .then(res=>{
        if(res.data.data == ''){
          wx.showToast({
            icon: "none",
            title: "已经是最新"
          })
        }else{
          let len = res.data.data.length;
          wx.showToast({
            icon: "none",
            title: "有"+len+"条新的新闻"
          })
        }
      })
      .catch(err=>{
        console.log(err)
      })


    app.fly.request(app.globalData.apiURL + 'getNews')
      .then(res=>{
        if(res.data.data != ''){
          let length = res.data.data.length
          console.log(length)
          this.setData({
            news: res.data.data,
          })
        }else{
          console.log("没有最新数据！！")
        }
        
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      })
      .catch(err => { 
        console.log(err)
      })
  },

  // //上拉加载更多
  onReachBottom:function(){
    console.log(this.data.news)
    let news = this.data.news
    let length = news.length
    console.log(length)
    let theFirstId = news[0].id
    let theLastId = news[length - 1].id
    console.log(theFirstId, theLastId)
    wx.showLoading({
      title: '数据加载中',
    });
    app.fly.request(app.globalData.apiURL + 'getHistoryNews', { theFirstId: theFirstId, theLastId: theLastId })
      .then(res => {
        if(res.data.data !=''){
          let addNews = news.concat(res.data.data)
          console.log(addNews)
          this.setData({
            news: addNews
          })
          console.log(this.data.news)
        }else{
          wx.hideLoading()
          wx.showToast({
            icon: "none",
            title: "没有更多了"
          })
        }
        // wx.hideLoading()
      })
      .catch(err => {
        console.log(err)
      })
  },

  // 跳转到新闻详情页面
  toDetail:function(event){
    let news = this.data.news
    let index = event.currentTarget.dataset.index
    let title = news[index].title
    let content = news[index].content
    wx.navigateTo({
      url: '../newsDetail/newsDetail?title=' + title + '&content=' + content,   //带参跳转
    })
  },

  //回到顶部
  goTop:function(){
    if(wx.pageScrollTo){
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  onLoad: function (options) {   
    wx.showLoading({
      title: "正在加载中",
      mask: true
    })
    setTimeout(()=>{
      this.getNews()
      wx.hideLoading()
    },3000)
    console.log(app.globalData.client_id)
  },


  onshow:function(){
    console.log("屏幕亮起")
  },
  obhide:function(){
    console.log("屏幕被隐藏")
  }
})