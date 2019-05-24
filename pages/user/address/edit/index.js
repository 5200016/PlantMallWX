const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: false,
        hiddenModal: true,
        deleteId: 0,
        data: {}
    },

    deleteAddress: function () {
        this.setData({
            hiddenModal: false
        });
    },

    getAddressById: function(id){
        let url = '/address/' + id;
        app.wxRequest('GET', url, null, (res) => {
            if (res.result) {
                this.setData({
                    hidden: true,
                    data: res.data,
                    deleteId: res.data.id
                })
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    /**
     * 修改收货地址信息
     */
    updateAddress: function(e){
        let url = '/address';
        app.wxRequest('PUT', url, e.detail.value, (res) => {
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

    // 模态框确认操作
    modalConfirm: function() {
        let url = '/address/' + this.data.deleteId;
        app.wxRequest('DELETE', url, null, (res) => {
            if (res.result) {
                this.setData({
                    hiddenModal: true
                });
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
    // 模态框取消操作
    modalCancel: function() {
        this.setData({
            hiddenModal: true
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (e) {
        this.getAddressById(e.id);
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
