//app.js
let Fly = require("/lib/wx")
const promisify = require('/utils/promisify')
const wxlogin = promisify(wx.login)
App({
  fly: new Fly,
  nfly: new Fly,
  // 登录
  userLogin:function(){
    return wxlogin()
      .then(ret =>{
        if(ret.code){
          return this.nfly.request(this.globalData.apiURL + "Login", Object.assign(ret, this.globalData.userInfo))
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
    userInfo: null,
    newsId:null,
    apiURL: 'https://danthology.cn/407/api/'
  }
})