// pages/search/index.js
/*
1输入框绑定 值改变事件 input事件
 1 获取输入框中的值
 2 合法的判断
 3 检验通过 把输入框的值 发送到后台
 4返回后台打印的数据
2防抖效果
 0 防抖 一般在输入框中 防止重复输入 重复发送请求
 1 节流 一般是用在页面的下拉和上拉中

*/

import { request } from "../../request/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 按钮是否显示
    isFocus: false,
    // 输入框中的值
    inputValue: ""
  },

  onShow: function () {

  },
  TimeId: -1,
  handleInput(e) {
    // 1.获取输入框中的值
    const { value } = e.detail;
    // 2.检验合法性
    if (!value.trim()) {
      //  值不合法
      this.setData({
        isFocus: false
      })
      return;
    }
    // 3.准备向后台发送数据
    clearTimeout(this.TimeId);
    this.setData({
      isFocus: true
    })
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000)
  },
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } });
    this.setData({
      goods: res
    })
  },
  handleCancel() {
    this.setData({
      inputValue: "",
      isFocus: false,
      goods: []
    })
  }
})