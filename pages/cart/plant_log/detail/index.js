const app = getApp();
const util = require("../../../../utils/util.js"),
    wxParse = require("../../../../utils/wxParse/wxParse.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        scrollHeight: 0,
        plantLogInfo: {}
    },

    getPlantLogInfo: function(id){
        let url = '/plant_log/' + id;
        app.wxRequest('GET', url, null, (res) => {
            if (res.result) {
                this.setData({
                    hidden: true,
                    plantLogInfo: res.data
                });
                wxParse.wxParse("article", "html", res.data.description, this, 5);
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
        let id = options.id;
        wx.getSystemInfo({
            success: function(t) {
                that.setData({
                    scrollHeight: t.windowHeight
                });
            }
        });
        if(!util.isEmpty(id)){
            this.getPlantLogInfo(id);
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
