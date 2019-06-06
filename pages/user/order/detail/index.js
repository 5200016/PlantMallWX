const app = getApp();
const util = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        url: app.globalData.HOST + '/',
        orderInfo: {}
    },

    getOrderInfo: function (orderId) {
        let url = '/order/id';
        let data = {
            orderId: orderId,
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let data = res.data;
                data.createTime = util.formatTime(new Date(data.createTime));
                this.setData({
                    hidden: true,
                    orderInfo: data,
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
        if(!util.isEmpty(options.orderId)){
            this.getOrderInfo(options.orderId)
        }else {
            this.setData({
                hidden: true
            })
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
