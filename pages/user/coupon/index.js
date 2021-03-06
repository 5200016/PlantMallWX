const app = getApp();
const util = require("../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        currentTab: 0,
        pageNum: 1,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
        couponList: [],
        scrollHeight: 0,
        hiddenMore: true,
    },

    /**
     * 获取优惠券列表
     */
    getCouponList: function(status){
        let url = '/coupon/my';
        let data = {
            status: status,
            userId: wx.getStorageSync("userId"),
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = this.data.couponList;
                for (let i = 0; i < res.data.content.length; i++){
                    res.data.content[i].coupon.startTime = util.formatTimeYMD(new Date(res.data.content[i].coupon.startTime));
                    res.data.content[i].coupon.endTime = util.formatTimeYMD(new Date(res.data.content[i].coupon.endTime));
                    data.push(res.data.content[i].coupon);
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

    // 切换选项卡
    tabFun: function(e) {
        let currentTab = this.data.currentTab,
            current = e.target.dataset.current;
        if(current != currentTab){
            this.setData({
                currentTab: current,
                pageNum: 1,
                pageSize: 5,
                totalPages: 0,
                totalElements: 0,
                couponList: []
            });
            this.getCouponList(current);
        }
    },

    // 滚动事件，下滑加载页面
    lower: function () {
        let pageNum = this.data.pageNum;
        if (++pageNum <= this.data.totalPages) {
            this.setData({
                pageNum: pageNum
            });
            this.getCouponList();
        } else {
            this.setData({
                hiddenMore: false
            })
        }
    },
    upper: function () {
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
        this.getCouponList(this.data.currentTab);
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
