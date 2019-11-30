const app = getApp()
Page({
  /* 页面的初始数据*/
  data: {
    // patient:'张三'
    pat_name:'',
    space:' - ',
    pat_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('prePatId'))
    let pat_id = wx.getStorageSync('prePatId')
    // this.data.pat_id = pat_id;
      app.fly.request(app.globalData.apiURL + 'getPrevious', { pat_id: pat_id })
        .then(res => {
          console.log(res.data.data)
          console.log(res.data.pat_name)
          let pat_name = pat_id + ' - ' + res.data.pat_name;
          console.log(pat_id);
          console.log(pat_name);
          if(res.data.data == ''){
            this.setData({
              pat_name: pat_name
            })
            wx.showToast({
              icon: "none",
              title: "无服药信息"
            }) 
          }else{
            this.setData({
              list: res.data.data,
              pat_name: pat_name
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
  }

})