// pages/category/index.js
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧导航数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的导航栏
    currentIndex: 0,
    // 右侧的内容滚动条距离顶部的距离
    scrollTop: 0
  },
  // 页面的数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    1先判断一下本地存储的数据中有没有旧的数据
    (time.Date.now(),data:[...])
    存储数据的方式不一样
    web：localStorage.setItem("key",value) localStorage.getItem(key)
    小程序: wx:setStorageSync("key",data是个对象) wx:getStorageSync("key")
    一般 跟时间有关的都是用时间戳 Date.now()
    2没有旧的数据 直接发送新的请求
    3有旧的数据同时旧数据没有过期就是用本地存储数据即可
    */
    const Cates = wx.getStorageSync("cates");

    if (!Cates) {
      this.getCates()
    } else {
      // 有旧的数据还没有过期
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新请求
        this.getCates();
      } else {
        this.Cates = Cates.data
        let leftMenuList;
        let rightContent;
        // 左侧导航数据
        leftMenuList = this.Cates.map(item => item.cat_name)
        // 右侧商品数据
        rightContent = this.Cates[0].children;
        // console.log(rightContent);
        this.setData({
          leftMenuList,
          rightContent,
        })
      }
    }


  },
  // 异步函数
  async getCates() {
    const res = await request({ url: "/categories" });
    this.Cates = res;
    // 把数据存储在本地中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    let leftMenuList;
    let rightContent;
    // 左侧导航数据
    leftMenuList = this.Cates.map(item => item.cat_name)
    // 右侧商品数据
    rightContent = this.Cates[0].children;
    // console.log(rightContent);
    this.setData({
      leftMenuList,
      rightContent,
    })
  },
  // 点击左侧菜单触发的一系列事件
  handleItemTap(e) {
    // console.log(e);
    let currentIndex = e.currentTarget.dataset.index;
    this.setData({
      currentIndex,
      rightContent: this.Cates[currentIndex].children,
      // 重新设置 右侧内容距离顶部的距离
      scrollTop: 0
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})