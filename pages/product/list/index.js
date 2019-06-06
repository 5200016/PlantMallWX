const app = getApp();
const util = require("../../../utils/util.js");
Page({
    data: {
        classifyList: [],
        productList: [],
        classifyId: null,
        hotRankId: null,
        classifyType: null,
        url: app.globalData.HOST + '/',
        filterHidden: true,
        pageNum: 1,
        pageSize: 5,
        totalPages: 0,
        totalElements: 0,
        keyWordProd: '',
        hidden: false,
        hiddenModal: true,
        modalTitle: "您尚未登录，请前往'我的'界面完成登录",

        // 热门排序
        hotRank: [
            {
                id: 0,
                name: "热门"
            },
            {
                id: 1,
                name: "最新"
            },
            {
                id: 2,
                name: "价格升序"
            },
            {
                id: 3,
                name: "价格降序"
            }],

        // 商品分类
        productType: [
            {
                id: 0,
                name: "出售",
                selected: true
            },
            {
                id: 1,
                name: "租赁",

            }],
        array: ['美国', '中国', '巴西', '日本'],
        index: 0,


        page: 1,
        maxpage: 1,
        count: 0,
        list: [],
        hiddenmore: !0,
        scrollHeight: 0,
        scrollHeight2: 0,
        currentTab: "1",
        areaTab: "3",
        filter: !0,
        key: "",
        areaid: "",
        cate: "",
        req_type: 0,
        hiddenother: 0,
        hasresource: 0,
        isloading: !1,
        classifyType: 1,

        cateList: [],
        classifyId: 0,
        currentLevel: 1,
        pidArr: [ 0 ],

        provHidden: !0,
        cityHidden: !0
    },

    /**
     * 分组查询商品分类
     */
    getClassifyGroup: function(id, type){
        let url = '/classify/list';
        app.wxRequest('GET', url, null, (res) => {
            if (res.result) {
                if(res.data.length > 0){
                    this.setData({
                        classifyList: res.data
                    });
                    if(!util.isEmpty(id) && !util.isEmpty(type)){
                        let classifyId = parseInt(id);
                        let classifyType = parseInt(type);
                        this.setData({
                            classifyId: classifyId,
                            classifyType: classifyType
                        });
                        this.getProductList(classifyId, classifyType, '', -1);
                    }else {
                        this.setData({
                            classifyId: res.data[0].id,
                            classifyType: res.data[0].type
                        });
                        this.getProductList(res.data[0].id, res.data[0].type, '', -1);
                    }
                }
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    /**
     * 点击商品分类
     */
    clickClassify: function(e) {
        let id = e.currentTarget.dataset.id,
            type = e.currentTarget.dataset.type;
        this.chooseClassify(id);
        this.setData({
            hidden: false
        });
        this.getProductList(id, type, '', -1);
    },

    /**
     * 获取商品列表
     */
    getProductList: function(classifyId, type, name, sort){
        let url = '/product/list';
        let data = {
            classifyId: classifyId,
            type: type,
            name: name,
            sortFlag: sort,
            pageNum: this.data.pageNum - 1,
            pageSize: this.data.pageSize
        };
        app.wxRequest('GET', url, data, (res) => {
            if (res.result) {
                let productList = res.data.content;
                for(let i in productList){
                    productList[i].number = 0;
                }
                this.setData({
                    productList: productList,
                    totalPages: res.data.totalPages,
                    totalElements: res.data.totalElements,
                    hidden: true,
                });
                wx.setStorageSync("bannerClassifyId", "");
                wx.setStorageSync("bannerClassifyType", "");
                this.chooseClassify(classifyId);
            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });
    },

    /**
     * 选中项样式改变方法
     */
    chooseClassify: function(id){
        let list = this.data.classifyList;
        let classifyType = null;
        // 清空历史选择
        for(let i = 0 ; i < list.length ; i++){
            delete list[i].selected;
        }

        // 设置选择样式
        for(let i = 0 ; i < list.length ; i++){
            if(list[i].id === id){
                list[i].selected = true;
                classifyType = list[i].type;
            }
        }
        this.setData({
            classifyList: list,
            classifyType: classifyType
        });
    },
    chooseHotRank: function(e) {
        let id = e.target.dataset.id,
            list = this.data.hotRank;
        // 清空历史选择
        for(let i = 0 ; i < list.length ; i++){
            delete list[i].selected;
        }

        // 设置选择样式
        for(let i = 0 ; i < list.length ; i++){
            if(list[i].id === id){
                list[i].selected = true;
            }
        }
        this.setData({
            hotRank: list,
            hotRankId: id
        });
    },
    chooseProductType: function(e) {
        let id = e.target.dataset.id,
            list = this.data.productType;
        // 清空历史选择
        for(let i = 0 ; i < list.length ; i++){
            delete list[i].selected;
        }

        // 设置选择样式
        for(let i = 0 ; i < list.length ; i++){
            if(list[i].id === id){
                list[i].selected = true;
            }
        }
        this.setData({
            productType: list
        });
    },

    /**
     * 筛选按钮操作事件
     */
    filterFunction: function() {
        wx.setStorageSync("filter", true);
        this.setData({
            filterHidden: false
        })
    },
    hideFilter: function() {
        wx.setStorageSync("filter", false);
        this.setData({
            filterHidden: true
        });
    },
    resetFilter: function() {
        let hotRankList = this.data.hotRank;
        for(let i = 0 ; i < hotRankList.length ; i++){
            delete hotRankList[i].selected;
        }
        this.setData({
            hotRank: hotRankList
        })
    },

    /**
     * 下拉框事件绑定
     */
    bindPickerChange: function (e) {
        this.setData({
            classifyId: this.data.classifyList[e.detail.value].id,
            classifyType: this.data.classifyList[e.detail.value].type,
            index: e.detail.value
        })
    },

    /**
     * 输入框事件绑定
     */
    keyInput: function(t) {
        this.setData({
            keyWordProd: t.detail.value
        });
    },

    submitFilter: function() {
        this.setData({
            filterHidden: true,
            pageNum: 1,
            pageSize: 5,
            totalPages: 0,
            totalElements: 0,
            productList: [],
            hidden: false
        });
        this.getProductList(this.data.classifyId, this.data.classifyType, this.data.keyWordProd, this.data.hotRankId);
    },

    addShoppingCar: function(e){
        let productId = e.currentTarget.dataset.productId,
            productType = e.currentTarget.dataset.productType,
            productIndex = e.currentTarget.dataset.productIndex;
        let productList = this.data.productList;
        productList[productIndex].number ++;

        this.setData({
            productList: productList
        });
        let url = '/product/operation';
        let data = {
            userId: wx.getStorageSync("userId"),
            productId: productId,
            productType: productType,
            number: 1,
            type: 1
        };
        app.wxRequest('PUT', url, data, (res) => {
            if (res.result) {

            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });


        let shoppingCarData = wx.getStorageSync("shoppingCar");
        shoppingCarData++;
        wx.setStorageSync("shoppingCar", shoppingCarData);
        wx.setTabBarBadge({
            index: 2,
            text: shoppingCarData.toString()
        });
    },

    reduceShoppingCar: function(e){
        let productId = e.currentTarget.dataset.productId,
            productType = e.currentTarget.dataset.productType,
            productIndex = e.currentTarget.dataset.productIndex;

        let productList = this.data.productList;
        productList[productIndex].number --;

        this.setData({
            productList: productList
        });
        let url = '/product/operation';
        let data = {
            userId: wx.getStorageSync("userId"),
            productId: productId,
            productType: productType,
            number: 1,
            type: 0
        };
        app.wxRequest('PUT', url, data, (res) => {
            if (res.result) {

            } else {
                app.optionToast(res.msg);
            }
        }, (err) => {
            console.log(err.data);
        });

        let shoppingCarData = wx.getStorageSync("shoppingCar");
        shoppingCarData--;
        if(shoppingCarData > 0){
            wx.setStorageSync("shoppingCar", shoppingCarData);
            wx.setTabBarBadge({
                index: 2,
                text: shoppingCarData.toString()
            });
        }else {
            wx.removeTabBarBadge({
                index: 2
            });
        }
    },

    /**
     * 弹出框确定按钮
     */
    modalConfirm: function(){
        wx.switchTab({
            url: '/pages/user/index'
        })
    },

    onLoad: function() {
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

        let that = this;
        wx.getSystemInfo({
            success: function(e) {
                let j = wx.canIUse("getSystemInfo.screenWidth") ? e.screenWidth : e.windowWidth;
                let i = 750 / j;
                let a = e.windowHeight - 80 / i;
                that.setData({
                    scrollHeight: e.windowHeight,
                    scrollHeight2: a
                });
            }
        });
        let classifyId = wx.getStorageSync("bannerClassifyId"),
            classifyType = wx.getStorageSync("bannerClassifyType");
        this.getClassifyGroup(classifyId, classifyType);
    },
    onUnload: function() {
        clearInterval();
    },
    onReady: function() {},
    onShow: function() {
        this.onLoad()
    },
    upper: function(t) {
        var e = this;
        e.setData({
            page: 1,
            maxpage: 1,
            list: [],
            isloading: !1,
            hiddenmore: !0
        }), f(e);
    },
    lower: function(t) {
        var e = this, a = e.data.page, i = e.data.maxpage;
        e.data.isloading || (++a > i ? e.setData({
            hiddenmore: !1
        }) : (e.setData({
            page: a
        }), f(e)));
    },
    setTab: function(t) {
        var e = this, a = e.data.currentTab, i = t.target.dataset.current;
        "3" == i ? e.setData({
            areaTab: "4"
        }) : "4" == i && e.setData({
            areaTab: "3"
        }), i != a && (e.setData({
            currentTab: i,
            page: 1,
            maxpage: 1,
            list: [],
            isloading: !1
        }), f(e));
    },
    errImg: function(t) {
        var e = {};
        e["list[" + t.target.dataset.errorimg + "].img"] = "../../../images/sp_logo.png",
            this.setData(e);
    },
    onShareAppMessage: function() {
        return {
            title: this.data.BarTitle,
            path: "/pages/product/list/index",
            success: function(t) {
                console.log("成功");
            },
            fail: function(t) {
                console.log("失败");
            }
        };
    },

});
