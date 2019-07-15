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
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    var index = e.currentTarget.id
    var that = this
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if(index ==1){
      wx.request({
        url: 'http://www.danthology.cn/ezhan/api/test',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({
            warning: res.data,
          })
        }
      })
    }
    else if(index ==2){
      wx.request({
        url: 'http://www.danthology.cn/ezhan/api/test',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({
            reminds: res.data,
          })
        }
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