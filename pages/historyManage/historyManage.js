
const app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["历史服药", "历史告警", "历史提醒"],
    // drugs: [
    //   { drugName: "阿莫西林" },
    //   { drugName: "999感冒灵" },
    //   { drugName: "止咳糖浆" }
    // ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    message:'',
    
    //开始时间和结束时间的初始化
    startDate:"0000-00-00",
    endDate: "2090-00-00"
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
      }
    });
    let _this = this
    let pat_id = wx.getStorageSync('prePatId')
    app.fly.request(app.globalData.apiURL + 'getHistoryMedicine', { pat_id: pat_id })
      .then(res => {
        if(res.data.data == ''){
          console.log("无历史服药信息！")
          _this.setData({
            message: '无历史服药信息'
          })
        }else{
          _this.setData({
            drugs: res.data.data,
            
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  tabClick: function (e) {
    var index = e.currentTarget.id
    // var that = this
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

    let _this = this
    let pat_id = wx.getStorageSync('prePatId')
    if(index == 0){
      app.fly.request(app.globalData.apiURL + 'getHistoryMedicine', { pat_id:pat_id })
        .then(res=>{
          if (res.data.data == '') {
            _this.setData({
              message: '无历史服药信息!'
            })
          } else {
            _this.setData({
              drugs: res.data.data,
              message: ''
            })
          }
        })
        .catch(err=>{
          console.log(err)
        })
    }
    else if(index == 1){
      app.fly.request(app.globalData.apiURL + 'getHistoryWarning', { pat_id: pat_id })
        .then(res => {
          if (res.data.data == '') {
            _this.setData({
              message: '无历史告警信息!'
            })
          } else {
            _this.setData({
              warning: res.data.data,
              message: ''
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }else if(index == 2){
      app.fly.request(app.globalData.apiURL + 'getHistoryRemind', { pat_id: pat_id })
        .then(res => {
          if (res.data.data == '') {
            _this.setData({
              message: '无历史提醒信息!'
            })
          } else {
            _this.setData({
              reminds: res.data.data,
              message: ''
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  //选择开始时间和结束时间
  bindDateStart: function (e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindDateEnd: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  //点击查询按钮
  historyMedSch:function(e){
    var that=this
    wx.request({
      url: 'http://www.danthology.cn/ezhan/api/test',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        that.setData({
          drugs: res.data,
        })
        console.log(res.data[0].Drugname);
      }
    })
  }
});