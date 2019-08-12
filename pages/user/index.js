const app = getApp();
const util = require("../../utils/util.js");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        userInfo: null,
        hasUserInfo: false,
        hasPhone: false,
        bindMobile: "",

        waitPay: 0,
        waitSend: 0,
        waitReceive: 0,
        waitReview: 0,
        waitPayOut: 0,

        accountUrl: "../user/account/index",
        scrollHeight: 0,
        cart_flag: 0,
        score: 0,
        createing: true,
        have_share: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let openid = wx.getStorageSync("openid");
        if (openid !== '' && openid !== null && openid !== undefined) {
            this.getDatabaseUserInfo();

        } else {
            this.setData({
                hidden: true
            });
        }
    },

    getFormID: function (e) {
        console.log(e.detail.formId);
        let url = '/form';
        let data = {
            userId: wx.getStorageSync("userId"),
            formId: e.detail.formId
        };
        app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                console.log("新增成功")
            }
        }, (err) => {
            app.optionToast(err.msg);
        });
    },


    /**
     * 根据openid获取数据库中用户信息
     */
    getDatabaseUserInfo() {
        let openid = wx.getStorageSync("openid");
        let url = '/user';
        let data = {
            openid: openid
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result && res.data !== null) {
                let phoneStatus = false;
                if (!util.isEmpty(res.data.phone)) {
                    phoneStatus = true;
                }
                this.setData({
                    hasUserInfo: true,
                    userInfo: res.data,
                    hidden: true,
                    hasPhone: phoneStatus
                });
                app.globalData.userInfo = res.data;
            }
        }, (err) => {
            app.optionToast(err.msg);
        })
    },

    /**
     * 根据openid获取数据库中用户信息
     */
    getOrderStatisticInfo() {
        let userId = wx.getStorageSync("userId");
        let url = '/order/status/statistic';
        let data = {
            userId: userId
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                this.setData({
                    waitPay: res.data.waitPay,
                    waitSend: res.data.waitSend,
                    waitReceive: res.data.waitReceive,
                    waitReview: res.data.waitReview,
                    waitPayOut: res.data.waitPayOut,
                });
            }
        }, (err) => {
            app.optionToast(err.msg);
        })
    },

    /**
     * 微信接口绑定用户信息
     */
    getUserInfo: function (e) {
        this.setData({
            hasUserInfo: false,
            hidden: false
        });

        let errMsg = e.detail.errMsg;
        let url = '/bind_user';
        let data = {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            code: app.globalData.CODE
        };

        // 用户授权成功
        "getUserInfo:ok" === errMsg && app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                let phoneStatus = false;
                if (!util.isEmpty(res.data.phone)) {
                    phoneStatus = true;
                }
                this.setData({
                    hasUserInfo: true,
                    userInfo: res.data,
                    hidden: true,
                    hasPhone: phoneStatus
                });
                wx.setStorageSync("openid", res.data.openid);
                wx.setStorageSync("userId", res.data.id);
                app.globalData.userInfo = res.data;
                app.optionToast(res.msg);
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data)
        });

        // 用户授权失败
        "getUserInfo:ok" !== errMsg && this.setData({
            hidden: true
        });
    },

    /**
     * 微信接口绑定用户手机号
     */
    bindPhoneNumber: function (e) {
        this.setData({
            hidden: false
        });
        let errMsg = e.detail.errMsg;
        let url = '/bind_phone';
        let data = {
            openid: wx.getStorageSync("openid"),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            code: app.globalData.CODE
        };
        "getPhoneNumber:ok" === errMsg && app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                this.setData({
                    hidden: true,
                    hasPhone: true,
                    userInfo: res.data
                });
                app.optionToast(res.msg);
            } else {
                app.optionToast(res.msg);
            }
            this.setData({
                hidden: true
            });
        }, (err) => {
            console.log(err.data);

        });

        "getPhoneNumber:ok" !== errMsg && this.setData({
            hidden: true
        });
    },

    /**
     * 页面跳转
     */
    jumpTo: function (e) {
        if (this.data.hasUserInfo) {
            let url = e.currentTarget.dataset.url;
            wx.navigateTo({
                url: url
            });
        }
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
        this.getOrderStatisticInfo();
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
