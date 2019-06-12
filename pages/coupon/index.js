const app = getApp();
const util = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        hiddenMore: true,
        pageNum: 1,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
        couponList: [],
        scrollHeight: 0
    },

    /**
     * 获取优惠券列表
     */
    getCouponList: function(){
        let url = '/coupon';
        let data = {
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = this.data.couponList;
                for (let i = 0; i < res.data.content.length; i++){
                    res.data.content[i].startTime = util.formatTimeYMD(new Date(res.data.content[i].startTime));
                    res.data.content[i].endTime = util.formatTimeYMD(new Date(res.data.content[i].endTime));
                    data.push(res.data.content[i]);
                }
                this.setData({
                    hidden: true,
                    couponList: data,
                    totalPages: res.data.totalPages,
                    totalElements: res.data.totalElements
                });
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    /**
     * 领取优惠券
     */
    getCoupon: function(e){
        let id = e.currentTarget.dataset.id;
        let url = '/coupon';
        let data = {
            userId: wx.getStorageSync("userId"),
            couponId: id
        };
        app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                app.optionToast(res.msg);
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    // 滚动事件，下滑加载页面
    lower: function () {
        let pageNum = this.data.pageNum;
        if(++pageNum <= this.data.totalPages){
            this.setData({
                pageNum: pageNum
            });
            this.getCouponList();
        }else {
            this.setData({
                hiddenMore: false
            })
        }
    },
    upper: function() {
        this.setData({
            pageNum: 1,
            totalPages: 0,
            couponList: []
        });
        this.getCouponList();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.getSystemInfo({
            success: function(t) {
                that.setData({
                    scrollHeight: t.windowHeight
                });
            }
        });
        this.getCouponList();
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
