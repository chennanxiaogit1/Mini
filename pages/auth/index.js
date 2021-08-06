// pages/auth/index.js
import { login, request } from "../../request/index"
Page({
  // 获取用户的信息
  async handleUserInfo(e) {
    let { encryptedData, rawData, iv, signature } = e.detail;
    // 小程序登录成功获取code
    const { code } = await login();
    // 发送请求获取token值
    const loginParams = { code, encryptedData, rawData, iv, signature }
    // const { token } =
    await request({ url: "/users/wxlogin", data: loginParams, method: "post" })

    // 4.将token设置在缓存中
    wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");

    wx.navigateBack({
      delta: 1
    });

  }
})