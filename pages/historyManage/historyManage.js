
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
    patient1:'',
    patient2:'',
    patient3:'',
    
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
          let patient1 = pat_id + ' - ' + res.data.pat_name
          _this.setData({
            drugs: res.data.data,
            patient1: patient1
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
            // 将患者编号和患者姓名拼成一个新的字符串
            let patient1 = pat_id +' - '+res.data.pat_name;
            _this.setData({
              drugs: res.data.data,
              message: '',
              patient1: patient1

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
            let newData = [];
            for (let i = 0; i < res.data.data.length; i++) {
              // let id = res.data.data[i].id
              // let pat_id = res.data.data[i].pat_id;
              let drug_name = res.data.data[i].drug_name;
              let drug_id = res.data.data[i].drug_id;
              let kinds = res.data.data[i].kinds;
              let time = res.data.data[i].time;
              let y = time.substr(0, 4);
              let m = time.substr(4, 2);
              let d = time.substr(6, 2);
              let h = time.substr(8, 2);
              let minute = time.substr(10, 12);
              time = y + "/" + m + "/" + d + " " + h + ":" + minute;
              let data1 = { "drug_name": drug_name, "drug_id": drug_id, "kinds": kinds, "time": time };
              newData.unshift(data1);
            }
            let patient2 = pat_id + ' - ' + res.data.pat_name
            // console.log(pat_id,pat_name)
            _this.setData({
              warning: newData,
              message: '',
              patient2: patient2
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
            let patient3 = pat_id + ' - ' + res.data.pat_name
            _this.setData({
              reminds: res.data.data,
              message: '',
              patient3: patient3
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