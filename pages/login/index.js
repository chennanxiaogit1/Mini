// pages/login/index.js
import { getUser } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  async getUserProfile(e) {
    let userInfo;
    userInfo = await getUser();
    // 将用户的信息本地缓存
    wx.setStorageSync("userInfo", userInfo);
    // 跳转回去
    wx.navigateBack({
      delta: 1
    });
  }
})