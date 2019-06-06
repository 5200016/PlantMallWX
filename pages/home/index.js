const app = getApp();
const util = require("../../utils/util.js");
Page({
    data: {
        hidden: false,
        topBanner: [],    // 顶部广告
        bottomBanner: [], // 底部广告
        middleMenuList: [],   // 模块列表
        bottomMenuList: [],   // 模块列表
        url: app.globalData.HOST + '/',
        hiddenModal: true,
        modalTitle: "您尚未登录，请前往'我的'界面完成登录",

        hhidden: !0,
        moudle: [],
        scrWidth: 375,
        hiddenoperation: !1,
        hiddenjiage: !1,
        hiddenmianyi: !0,
        hiddenbuxianshi: !0,
        info: {},
        id: 0,
        cid: 0,
        shopId: 0,
        num: 1,
        price: 0,
        total: 0,
        stock: 1,
        hiddenxiangou: !1,
        btnType: "",
        canSetNum: !1,
        commodityAttrValue: [],
        commodityAttr: [],
        attrValueList: [],
        includeGroup: [],
        firstIndex: -1,
        collect: 0,
        attrList: [],
        islogin: !1,
        title: "首页",
        version: 0
    },

    /**
     * 根据type查询广告图片列表
     */
    getBannerList: function(type){
        let url = '/banner';
        let data = {
            type: type
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                if(type === 0){
                    this.setData({
                        hidden: true,
                        topBanner: res.data
                    });
                }
                if(type === 1){
                    this.setData({
                        hidden: true,
                        bottomBanner: res.data
                    });
                }

            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    /**
     * 查询模块菜单模块列表
     */
    getModuleMenuList: function(type){
        let url = '/module/menu';
        let data = {
            type: type
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                if(type === 0){
                    this.setData({
                        hidden: true,
                        middleMenuList: res.data
                    });
                }
                if(type === 1){
                    this.setData({
                        hidden: true,
                        bottomMenuList: res.data
                    });
                }
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    /**
     * 搜索框跳转
     */
    toSearchPage: function() {
        wx.navigateTo({
            url: '/pages/search/index',
        })
    },

    /**
     * 轮播图片加载完成回调
     */
    bannerImageLoad: function(){

    },

    /**
     * 中部图片加载完成回调
     */
    middleImageLoad: function(){

    },

    /**
     * 弹出框确定按钮
     */
    modalConfirm: function(){
        wx.switchTab({
            url: '/pages/user/index'
        })
    },

    onLoad: function (t) {

    },
    onShow: function () {
        let openid = wx.getStorageSync("openid"),
            userId = wx.getStorageSync("userId");
        if(util.isEmpty(openid) || util.isEmpty(userId)){
            this.setData({
                hiddenModal: false
            })
        }else {
            this.setData({
                hiddenModal: true
            })
        }
        this.getBannerList(0);
        this.getBannerList(1);
        this.getModuleMenuList(0);
        this.getModuleMenuList(1);
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
        var t = this;
        t.setData({
            moudle: [],
            hiddenmore: !0
        }), S(t);
    },
    toGetUserInfo: function (t) {
        var a = this;
        a.setData({
            hhidden: !1
        }), i.getUserInfo(function (t) {
            a.setData({
                hidden: !0
            }), "object" == (void 0 === t ? "undefined" : e(t)) ? (a.setData({
                islogin: !0
            }), console.log("登录成功")) : ("error" == t && wx.showToast({
                title: "微信登录异常"
            }), "fail" == t && wx.showToast({
                title: "用户授权失败"
            }), "loginfail" == t && wx.showToast({
                title: "获取用户登录态失败"
            })), S(a), a.setData({
                hhidden: !0
            });
        });
    },
    setTab: function (t) {
        for (var e = this, a = e.data.moudle, i = t.target.dataset.moduleid, o = t.target.dataset.current, n = 0; n < a.length; n++) n == i && (a[n].content.currentTab = o);
        e.setData({
            moudle: a
        });
    },
    errImg: function (t) {
        var e = {};
        e["moudle[" + t.target.dataset.errorimg + "].content.goodslist[" + t.target.dataset.errorimgs + "].logo"] = "../../images/img_error.jpg",
            this.setData(e);
    },
    errImg2: function (t) {
        var e = {};
        e["moudle[" + t.target.dataset.errorimgone + "].content.goodslist[" + t.target.dataset.errorimgtwo + "].lists[" + t.target.dataset.errorimgthree + "].logo"] = "../../images/img_error.jpg",
            this.setData(e);
    },
    errImg3: function (t) {
        var e = {};
        e["moudle[" + t.target.dataset.errorimg + "].content.goodslist[" + t.target.dataset.errorimgs + "].pic"] = "../../images/img_error.jpg",
            this.setData(e);
    },
    errImgBySeckill: function (t) {
        var e = {};
        e["moudle[" + t.target.dataset.errorimg + "].content.goodslist[" + t.target.dataset.errorimgs + "].pro_logo"] = "../../images/sp_logo.png",
            this.setData(e);
    },
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            path: "/pages/home/index",
            success: function (t) {
                console.log("成功");
            },
            fail: function (t) {
                console.log("失败");
            }
        };
    },

    clickToJump: function (e) {
        let path = e.currentTarget.dataset.path;
        let classifyId = this.getUrlParam(path, "classifyId"),
            classifyType = this.getUrlParam(path, "classifyType");
        if(!util.isEmpty(classifyId)){
            wx.setStorageSync("bannerClassifyId", classifyId);
            wx.setStorageSync("bannerClassifyType", classifyType);
            wx.switchTab({
                url: "/pages/product/list/index",
            });
        }else {
            wx.navigateTo({
                url: "/" + path,
            });
        }
    },

    getUrlParam : function(url, name){
        // 正则筛选地址栏
        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        // 匹配目标参数
        let result = url.substr(1).match(reg);
        //返回参数值
        return result ? decodeURIComponent(result[2]) : null;
    },

    jumptotuan: function (t) {
        p ? wx.switchTab({
            url: "../product/group_list/index",
            success: function (t) {
                var e = getCurrentPages().pop();
                void 0 != e && null != e && e.upper();
            }
        }) : wx.navigateTo({
            url: "../product/group_list/index",
            success: function (t) {
                var e = getCurrentPages().pop();
                void 0 != e && null != e && e.upper();
            }
        });
    },
    jumptopintuan: function (t) {
        f ? wx.switchTab({
            url: "../pintuan/index",
            success: function (t) {
                var e = getCurrentPages().pop();
                void 0 != e && null != e && e.upper();
            }
        }) : wx.navigateTo({
            url: "../pintuan/index",
            success: function (t) {
                var e = getCurrentPages().pop();
                void 0 != e && null != e && e.upper();
            }
        });
    },
    jumptoseckill: function (t) {
        x ? wx.switchTab({
            url: "../product/seckill/index",
            success: function (t) {
                var e = getCurrentPages().pop();
                void 0 != e && null != e && e.upper();
            }
        }) : wx.navigateTo({
            url: "../product/seckill/index",
            success: function (t) {
                var e = getCurrentPages().pop();
                void 0 != e && null != e && e.upper();
            }
        });
    },
    seckill_remind: function (t) {
        var e = this;
        if (0 != e.data.islogin) {
            var a = e.data.moudle,
                o = t.detail.formId,
                n = t.detail.value.pid,
                r = t.detail.value.time;
            wx.request({
                url: d,
                data: {
                    form_id: o,
                    pid: n,
                    time: r
                },
                method: "POST",
                header: i.getrequestHeader(),
                complete: function (t) {
                    for (var i = 0; i < a.length; i++)
                        if (411 == a[i].content._moduleType)
                            for (var o = 0; o < a[i].content.goodslist.length; o++) a[i].content.goodslist[o].pro_id == n && (a[i].content.goodslist[o].is_remind = 1);
                    e.setData({
                        moudle: a
                    }), wx.showToast({
                        title: "提醒成功"
                    });
                }
            });
        } else wx.showToast({
            title: "请先登录"
        });
    },
    clicktoreceivecoupon: function (t) {
        var e = t.currentTarget.dataset.id;
        D(0, e);
    },
    upper: function (t) {
        var e = this;
        e.setData({
            moudle: [],
            hiddenmore: !0
        }), S(e);
    },
    setModalStatus: function (t) {
        0 != this.data.islogin ? (this.setData({
            btnType: t.currentTarget.dataset.type,
            id: t.currentTarget.dataset.id
        }), V(this, t)) : wx.showToast({
            title: "请先登录"
        });
    },
    distachAttrValue: function (t) {
        for (var e = this.data.attrValueList, a = 0; a < t.length; a++)
            for (o = 0; o < t[a].attrValueList.length; o++) {
                var i = this.getAttrIndex(t[a].attrValueList[o].attrKey, e);
                i >= 0 ? this.isValueExist(t[a].attrValueList[o].attrValue, e[i].attrValues) || e[i].attrValues.push(t[a].attrValueList[o].attrValue) : e.push({
                    attrKey: t[a].attrValueList[o].attrKey,
                    attrValues: [t[a].attrValueList[o].attrValue]
                });
            }
        for (a = 0; a < e.length; a++)
            for (var o = 0; o < e[a].attrValues.length; o++) e[a].attrValueStatus ? e[a].attrValueStatus[o] = !0 : (e[a].attrValueStatus = [],
                e[a].attrValueStatus[o] = !0);
        this.setData({
            attrValueList: e
        });
    },
    getAttrIndex: function (t, e) {
        for (var a = 0; a < e.length && t != e[a].attrKey; a++) ;
        return a < e.length ? a : -1;
    },
    isValueExist: function (t, e) {
        for (var a = 0; a < e.length && e[a] != t; a++) ;
        return a < e.length;
    },
    selectAttrValue: function (e) {
        var a = this.data.attrValueList,
            i = e.currentTarget.dataset.index,
            o = e.currentTarget.dataset.key,
            n = e.currentTarget.dataset.value;
        e.currentTarget.dataset.status;
        (e.currentTarget.dataset.status || i == this.data.firstIndex) && (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value ? this.disSelectValue(a, i, o, n) : this.selectValue(a, i, o, n));
        for (var r = [], s = this.data.commodityAttrValue, l = 0; l < this.data.attrValueList.length && this.data.attrValueList[l].selectedValue; l++) r.push(this.data.attrValueList[l].selectedValue);
        if (l == this.data.attrValueList.length) {
            var d = s[r.join(",")];
            this.setData({
                price: d.price_calc,
                kucun: d.kucun,
                num: 1
            }), this.setData({
                canSetNum: !0,
                cid: d.id
            });
            for (var o in s)
                if (d.id == s[o].id) {
                    this.setData({
                        stock: parseInt(s[o].kucun)
                    });
                    break;
                }
            if (d.price_calc > 0) {
                var u = t(d.price_calc, 1);
                this.setData({
                    total: u
                }), this.setData({
                    hiddenjiage: !1,
                    hiddenmianyi: !0,
                    hiddenbuxianshi: !0
                });
            } else "面议" == d.price ? this.setData({
                hiddenjiage: !0,
                hiddenmianyi: !1,
                hiddenbuxianshi: !0
            }) : this.setData({
                hiddenjiage: !0,
                hiddenmianyi: !0,
                hiddenbuxianshi: !1
            });
        } else this.setData({
            canSetNum: !1,
            cid: 0
        });
    },
    selectValue: function (t, e, a, i, o) {
        var n = [];
        if (e != this.data.firstIndex || o) r = this.data.includeGroup;
        else
            for (var r = this.data.commodityAttr, s = 0; s < t.length; s++)
                for (c = 0; c < t[s].attrValues.length; c++) t[s].selectedValue = "";
        for (s = 0; s < r.length; s++)
            for (c = 0; c < r[s].attrValueList.length; c++) r[s].attrValueList[c].attrKey == a && r[s].attrValueList[c].attrValue == i && n.push(r[s]);
        t[e].selectedValue = i;
        for (s = 0; s < t.length; s++)
            for (c = 0; c < t[s].attrValues.length; c++) t[s].attrValueStatus[c] = !1;
        for (var l = 0; l < t.length; l++)
            for (s = 0; s < n.length; s++)
                for (c = 0; c < n[s].attrValueList.length; c++)
                    if (t[l].attrKey == n[s].attrValueList[c].attrKey)
                        for (var d = 0; d < t[l].attrValues.length; d++) t[l].attrValues[d] == n[s].attrValueList[c].attrValue && (t[l].attrValueStatus[d] = !0);
        this.setData({
            attrValueList: t,
            includeGroup: n
        });
        for (var u = 0, s = 0; s < t.length; s++)
            for (var c = 0; c < t[s].attrValues.length; c++)
                if (t[s].selectedValue) {
                    u++;
                    break;
                }
        u < 2 ? this.setData({
            firstIndex: e
        }) : this.setData({
            firstIndex: -1
        });
    },
    disSelectValue: function (t, e, a, i) {
        var o = this.data.commodityAttr;
        t[e].selectedValue = "";
        for (r = 0; r < t.length; r++)
            for (var n = 0; n < t[r].attrValues.length; n++) t[r].attrValueStatus[n] = !0;
        this.setData({
            includeGroup: o,
            attrValueList: t
        });
        for (var r = 0; r < t.length; r++) t[r].selectedValue && this.selectValue(t, r, t[r].attrKey, t[r].selectedValue, !0);
    },
    submit: function () {
        if (!this.data.num) return this.setData({
            num: 0
        }), void wx.showToast({
            title: "请输入购买数量"
        });
        for (var t = [], a = 0; a < this.data.attrValueList.length && this.data.attrValueList[a].selectedValue; a++) t.push(this.data.attrValueList[a].selectedValue);
        if (a < this.data.attrValueList.length) wx.showToast({
            title: "请选择属性"
        });
        else if (this.data.price > 0) {
            var o = this;
            "buy" == this.data.btnType ? (o.setData({
                hidden: !1
            }), i.getUserInfo(function (t) {
                if (o.setData({
                    hidden: !0
                }), "object" == (void 0 === t ? "undefined" : e(t))) {
                    wx.setStorageSync("pid", o.data.id), wx.setStorageSync("cid", o.data.cid), wx.setStorageSync("num", o.data.num),
                        wx.setStorageSync("buyType", "buy"), wx.setStorageSync("shopId", o.data.shopId);
                    wx.navigateTo({
                        url: "../../cart/order/index"
                    });
                } else "error" == t && wx.showToast({
                    title: "微信登录异常"
                }), "fail" == t && wx.showToast({
                    title: "用户授权失败"
                }), "loginfail" == t && wx.showToast({
                    title: "获取用户登录态失败"
                });
            })) : (o.setData({
                hidden: !1
            }), i.getUserInfo(function (t) {
                o.setData({
                    hidden: !0
                }), "object" == (void 0 === t ? "undefined" : e(t)) ? _(o) : ("error" == t && wx.showToast({
                    title: "微信登录异常"
                }), "fail" == t && wx.showToast({
                    title: "用户授权失败"
                }), "loginfail" == t && wx.showToast({
                    title: "获取用户登录态失败"
                }));
            }));
        }
    },
    bindMinus: function (e) {
        if (this.data.canSetNum) {
            var a = this.data.price,
                i = this.data.num;
            if (--i > 0) {
                var o = t(a, i);
                this.setData({
                    num: i,
                    total: o
                });
            }
        } else wx.showToast({
            title: "请选择属性"
        });
    },
    bindPlus: function (e) {
        if (this.data.canSetNum) {
            var a = this.data.price,
                i = this.data.num,
                o = this.data.stock,
                n = parseInt(this.data.info.xiangou);
            if (i++, n > 0) {
                if (n > o) {
                    if (i > o) return void wx.showToast({
                        title: "超过库存"
                    });
                } else if (i > n) return void wx.showToast({
                    title: "超过限购"
                });
            } else if (i > o) return void wx.showToast({
                title: "超过库存"
            });
            var r = t(a, i);
            this.setData({
                num: i,
                total: r
            });
        } else wx.showToast({
            title: "请选择属性"
        });
    },
    formsubmit: function (e) {
        let formId = e.detail.formId;
    },
    toLocation: function (t) {
        wx.navigateTo({
            url: t.target.dataset.url
        });
    },
    setHkKeyword: function (t) {
        a.data.keyword = t.detail.value, wx.setStorageSync("keyWordProd", t.detail.value),
            this.setData({
                hkData: a.data
            });
    },
    hkFormSubmit: function () {
        wx.setStorageSync("cityName2", a.data.locationName), wx.setStorageSync("cityId2", a.data.locationId),
            c ? wx.switchTab({
                url: "/pages/product/list/index",
                success: function (t) {
                    var e = getCurrentPages().pop();
                    void 0 != e && null != e && e.upper();
                }
            }) : wx.navigateTo({
                url: "/pages/product/list/index",
                success: function (t) {
                    var e = getCurrentPages().pop();
                    void 0 != e && null != e && e.upper();
                }
            });
    },
    calling: function (t) {
        var e = t.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: e,
            success: function () {
                console.log("拨打电话成功！");
            },
            fail: function () {
                console.log("拨打电话失败！");
            }
        });
    },
    setVedioTitleShow: function (t) {
        var e = t.currentTarget.dataset.index,
            a = this.data.moudle;
        a[e].content.showTitle = !1, this.setData({
            module: a
        });
    },
    setVedioTitleHide: function (t) {
        var e = t.currentTarget.dataset.index,
            a = this.data.moudle;
        a[e].content.showTitle = !0, this.setData({
            module: a
        });
    }
});
