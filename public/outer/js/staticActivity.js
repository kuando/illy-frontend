// get config
var apiBaseUrl = 'http://api.hizuoye.com/api/v1/';

alert(location.href);

var $ = function(selector) {
    return document.querySelector(selector);
};

avalon.$ = $;

// inner function 
// copy the array and return
var copyArr = function copyArr(arr) {
    var brr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        brr[i] = arr[i];
    }
    return brr;
};

// inner function 
// arr = ['name', 'age'];
// ==>
// arr = [ {key: 'name', value: 'xxx'}, {key: 'age', value: 'xxx'} ]; 
var dataAdapter = function dataAdapter(source) {
    var arr = copyArr(source);
    for (var i = 2, len = arr.length; i < len; i++) {
        arr[i] = {
            key: activity.CopyinfoCollect[i],
            value: arr[i]
        };
    }
    // remove first two
    arr.shift();
    arr.shift();
    var infoJSON = arr;
    return {
        name: source[0],
        phone: source[1],
        others: infoJSON
    };
};

var activity = avalon.define({
    $id: "activity",

    theme: '',

    isDone: false,
    isCancel: false,
    isFilling: false,

    activityId: location.href.split('=')[1],
    address: '',
    content: "",
    startTime: '',
    endTime: '',
    deadline: '',

    shareCount: 88,
    visitCount: 88,
    likeCount: 0,

    infoCollect: [],
    CopyinfoCollect: [],

    isShared: false,
    updateShare: function() {
        $http.ajax({
            method: 'PUT',
            url: apiBaseUrl + 'public/activities/' + activity.activityId + '/share',
            success: function(res) {
                alert(res + 'shared');
            },
            error: function(res) {
                console.log(res);
            },
            ajaxFail: function(res) {
                console.log(res);
            }
        });
    },

    hasLiked: false,
    updateLike: function() {
        $http.ajax({
            method: 'PUT',
            url: apiBaseUrl + 'public/activities/' + activity.activityId + '/like',
            success: function() {
                var likeCount = activity.likeCount || 0;
                activity.likeCount = ++likeCount;
            },
            error: function(res) {
                console.log(res);
            },
            ajaxFail: function(res) {
                console.log(res);
            }
        });
    },
    like: function() {
        // http 
        activity.updateLike();
        // ui
        activity.hasLiked = true;
    },

    filling: function() {
        activity.isFilling = true;
    },
    cancel: function() {
        activity.isCancel = true;
        activity.isFilling = false;
    },
    pushInfo: function() {
        var validPhone = function invalidPhone(phone) {
            return /^\d{3,}$/.test(phone); // mark!!! 
        };

        var valid = activity.infoCollect[0] !== '' && validPhone(activity.infoCollect[1]);
        if (!valid) {
            alert('请填写信息完整，格式正确的报名信息，谢谢!');
            return;
        }

        $http.ajax({
            method: 'POST',
            url: apiBaseUrl + 'public/activities/' + activity.activityId + '/info',
            data: dataAdapter(activity.infoCollect), // array([key1, key2]) to a array({key1: value1}, {key2, value2})
            success: function(res) { /* jshint ignore:line */
                activity.isDone = true;
                activity.isFilling = false;
            },
            error: function(res) {
                console.log(res);
            },
            ajaxFail: function(res) {
                console.log(res);
            }
        });
    },
    fetchData: function() {
        $http.ajax({ // 获取活动详情
            url: apiBaseUrl + "public/activities/" + activity.activityId,
            dataType: "json",
            success: function(json) {
                activity.activityId = json._id;
                activity.theme = json.theme;
                activity.address = json.address;
                activity.content = json.content;
                activity.startTime = json.startTime;
                activity.endTime = json.endTime;
                activity.deadline = json.deadline;
                activity.shareCount = json.shareCount;
                activity.visitCount = json.visitCount;
                activity.likeCount = json.like || 0;
                json.infoCollect.unshift('姓名', '电话'); // array
                activity.infoCollect = json.infoCollect;
                for (var i = 0, len = activity.infoCollect.length; i < len; i++) {
                    activity.infoCollect[i] = '';
                }
                activity.CopyinfoCollect = json.infoCollect;
                activity.theme = json.theme;

                wx.onMenuShareTimeline({
                    title: activity.theme, // 分享标题
                    link: '', // 分享链接 
                    imgUrl: document.getElementsByTagName('img')[0].src, // 分享图标
                    success: function() {
                        // 不管成功与否，前台界面至少先更新
                        activity.shareCount++;
                        activity.isShared = true;
                        activity.updateShare();
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                        if (!activity.isShared) {
                            alert('差一点就分享成功了!');
                        }
                    }
                });

            }
        });
    } // end of fetch data

}); // end of define

activity.fetchData();



