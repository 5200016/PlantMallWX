const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 保存用户地址信息
     */
    saveUserAddress: function (data) {
        let url = '/address';
        data.userId = wx.getStorageSync("userId");
        app.wxRequest('POST', url, data, (res) => {
            if (res.result) {
                wx.redirectTo({
                    url: "../list/index"
                })
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    /**
     * 保存按钮操作
     */
    formSubmit: function (e) {
        this.saveUserAddress(e.detail.value)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
