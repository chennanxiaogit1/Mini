// 判断一下子请求的次数
let ajaxTimes = 0;
export const request = function (params) {
    ajaxTimes++;
    // 显示加载效果
    wx.showLoading({
        title: "正在加载中",
        mask: true,
    });

    // 定义公共的路径
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes == 0) wx.hideLoading();
            }
        });
    })
}

export const showModal = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });

    })
}
export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });

    })
}
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
export const getUser = () => {
    return new Promise((resolve, reject) => {
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                resolve(res.userInfo)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}