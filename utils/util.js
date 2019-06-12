function t(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

module.exports = {
    // 格式化时间为年-月-日 时：分：秒
    formatTime: function (e) {
        let n = e.getFullYear(), o = e.getMonth() + 1, r = e.getDate(), u = e.getHours(), i = e.getMinutes(),
            g = e.getSeconds();
        return [n, o, r].map(t).join("-") + " " + [u, i, g].map(t).join(":");
    },

    // 格式化时间为年-月-日
    formatTimeYMD: function (e) {
        let n = e.getFullYear(), o = e.getMonth() + 1, r = e.getDate(), u = e.getHours(), i = e.getMinutes(),
            g = e.getSeconds();
        return [n, o, r].map(t).join("-");
    },

    // 判断元素是否为空
    isEmpty: function (value) {
        if (value !== null && value !== "" && value !== undefined) {
            return false
        }
        return true;
    }
};
