const app = getApp();
const util = require("../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: app.globalData.HOST + '/',
        hidden: false,
        pageNum: 1,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
        plantLogList: [],
        plantLogModule: {},
        scrollHeight: 0,
    },

    getPlantLogList: function(){
        let url = '/plant_log';
        let data = {
            name: '',
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize,
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                this.setData({
                    hidden: true,
                    plantLogList: res.data.content,
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

    getPlantLogModule: function(){
        let url = '/module/type';
        let data = {
            type: 2
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                this.setData({
                    hidden: true,
                    plantLogModule: res.data
                });
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
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
        this.getPlantLogList();
        this.getPlantLogModule();
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
