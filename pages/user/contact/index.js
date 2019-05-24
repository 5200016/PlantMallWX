const app = getApp();
Page({
    data: {
        hidden: false,
        info: {}
    },

    /**
     * 获取客服信息
     */
    getContactInfo: function(){
        let url = '/customer_service';
        app.wxRequest('GET', url, null, (res) => {
            if (res.result) {
                this.setData({
                    info: res.data,
                    hidden: true
                })
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);

        });
    },

    onLoad: function() {
        this.getContactInfo();
    },
    calling: function(e) {
        let phone = e.target.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: phone,
            success: function() {
                console.log("拨打电话成功！");
            },
            fail: function() {
                console.log("拨打电话失败！");
            }
        });
    }
});
