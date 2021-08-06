//Page Object
import { request } from "../../request/index"
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    cateList: [],
    // 楼层数据
    floorList: [],
    // nav_url链接
    nav_url: []
  },
  //options(Object)
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 1.发送异步请求轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata',
    }).then(res => {
      this.setData({
        swiperList: res
      })
    });

  },
  // 2.发送异步请求导航数据
  getCateList() {
    request({
      url: '/home/catitems',
    }).then(res => {
      this.setData({
        cateList: res
      })
    });
  },
  // 3.发送异步请求楼层数据
  async getFloorList() {
    const res = await request({
      url: "/home/floordata"
    })
    this.setData({
      floorList: res
    })
    const nav_url = res.map(item1 => item1.product_list.map(item2 => this.insertStr(item2.navigator_url, 17, "/index")));
    this.setData({
      nav_url
    })
  },
  insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start);
  },
});
