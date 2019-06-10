let weToast = require("utils/wetoast/wetoast.js").WeToast;
App({
    WeToast: weToast,
    onLaunch: function () {

        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                this.globalData.CODE = res.code;
            },
            fail: err => {
                wx.showToast({
                    title: '微信登录异常'
                });
                setTimeout(() => {
                    wx.hideToast()
                }, 1500)
            }
        });

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
        this.getContactInfo();
    },

    getContactInfo: function(){
        let url = '/customer_service';
        this.wxRequest('GET', url, null, (res) => {
            if (res.result) {
                wx.setStorageSync("phone", res.data.phone);
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    getrequestHeader: function() {
        var e = wx.getStorageSync("PHPSESSID");
        if ("" != e && null != e) t = {
            "content-type": "application/x-www-form-urlencoded",
            Cookie: "PHPSESSID=" + e
        };
        else var t = {
            "content-type": "application/x-www-form-urlencoded"
        };
        return t;
    },

    /**
     * 封装wx.request请求
     * method： 请求方式
     * url: 请求地址
     * data： 要传递的参数
     * callback： 请求成功回调函数
     * errFun： 请求失败回调函数
     **/
    wxRequest: function(method, url, data, callback, errFun) {
        wx.request({
            url: this.globalData.HOST + this.globalData.URL + url,
            method: method,
            data: data,
            header: {
                'content-type': method == 'POST' || method == 'PUT' ? 'application/json' : 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            dataType: 'json',
            success: function(res) {
                callback(res.data);
            },
            fail: function(err) {
                errFun(err);
            }
        })
    },

    globalData: {
        // 服务器域名
        // HOST: 'https://zdshop.zhideweini.com',
        // HOST: 'http://47.100.4.198:8081',
        HOST: 'http://localhost:8081',

        // 全局请求URL
        URL: '/mall/wx',

        // 微信登录code
        CODE: '',
        userInfo: null,
    },

    // 通用弹出框
    optionToast: function (msg) {
        wx.showToast({
            title: msg
        });
        setTimeout(() => {
            wx.hideToast()
        }, 1500)
    }
});
