define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com/api/v1/';
    var token = avalon.illyGlobal.token;

    // 获取全局wx-sdk接口
    var wx = avalon.wx;

    // prefix of localStorage
    var cachedPrefix = 'illy-task-activity-';

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
    var dataAdapter= function dataAdapter(source) {
        var arr = copyArr(source);
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i] = {
                key: activity.CopyinfoCollect[i], 
                value: arr[i]
            };
        }
        return {
            name: source[0],
            phone: source[1],
            others: arr
        };
    };
    
    var activity = avalon.define({
        $id: "activity",
        visited: false,
        isDone: false,
        isCancel: false,
        isFilling: false,
        taskId: 1,
        scoreAward: 10,
        address: '',
        content: "",
        startTime: '',
        endTime: '',
        deadline: '',
        shareCount: 88,
        visitCount: 88,
        infoCollect: [],
        CopyinfoCollect: [],
        theme: '',
        isShared: false,
        updateShare: function() {
            $http.ajax({
                method: 'PUT',
                url: apiBaseUrl + 'tasks/' + activity.taskId + '/share',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function(res) {
                    avalon.log(res);
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
            if (activity.visited && activity.hasData) {
                var localCache = avalon.getLocalCache(cachedPrefix + activity.taskId);
                    activity.taskId = localCache._id;
                    activity.address = localCache.address;
                    activity.content = localCache.content;
                    activity.startTime = localCache.startTime;
                    activity.endTime = localCache.endTime;
                    activity.deadline = localCache.deadline;
                    activity.shareCount = localCache.shareCount;
                    activity.visitCount = localCache.visitCount;
                    activity.infoCollect = localCache.infoCollect[0];
                    activity.CopyinfoCollect = localCache.infoCollect[0];
                    activity.theme = localCache;
                return; // core!!! key!!! forget this will getCache and request!!!
            }
            $http.ajax({
                url: apiBaseUrl + "tasks/" + activity.taskId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    activity.taskId = json._id;
                    activity.address = json.address;
                    activity.content = json.content;
                    activity.startTime = json.startTime;
                    activity.endTime = json.endTime;
                    activity.deadline = json.deadline;
                    activity.shareCount = json.shareCount;
                    activity.visitCount = json.visitCount;
                    json.infoCollect.unshift('姓名', '电话'); // array
                    activity.infoCollect = json.infoCollect;
                    for (var i = 0, len = activity.infoCollect.length; i < len; i++) {
                        activity.infoCollect[i] = '';
                    }
                    activity.CopyinfoCollect = json.infoCollect;
                    activity.theme = json.theme;
                    avalon.setLocalCache(cachedPrefix + activity.taskId, json);

                    wx.onMenuShareTimeline({
                        title: activity.title, // 分享标题
                        link: '', // 分享链接
                        imgUrl: document.getElementsByTagName('img')[0].src, // 分享图标
                        success: function () { 
                            // 不管成功与否，前台界面至少先更新
                            activity.shareCount++;
                            activity.isShared = true;
                            activity.updateShare();
                        },
                        cancel: function () { 
                            // 用户取消分享后执行的回调函数
                            alert('差一点就能完成任务拿积分了!');
                        }
                    });

                }
            });
        }, // end of fetch data
        pushInfo: function() {
            var invalid = activity.infoCollect.some(function(item) {
                return item === '';
            });
            if (invalid) { alert('请完整填写报名信息'); return; }

            $http.ajax({
                method: 'POST',
                url: apiBaseUrl + 'activities/' + activity.taskId + '/info',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    info: dataAdapter(activity.infoCollect) // array([key1, key2]) to a array({key1: value1}, {key2, value2})
                },
                success: function(res) { /* jshint ignore:line */
                    activity.isDone = true;
                    activity.isFilling = false;
                },
                error: function(res) {
                    console.log(res);
                    //activity.infoCollect = act
                },
                ajaxFail: function(res) {
                    console.log(res);
                }
            });
        },
        filling: function() {
            activity.isFilling = true;
        },
        cancel: function() {
            activity.isCancel = true;
            activity.isFilling = false;
        } 
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

            avalon.$('.gotop').onclick = function() {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            };

            setTimeout(function() {
                avalon.$('#gotop').style.display = 'block';
            }, 3000);

        };
        // 进入视图
        $ctrl.$onEnter = function(params) {

            activity.taskId = params.taskId;
            activity.scoreAward = params.scoreAward; // get activity score award
            activity.visited = avalon.vmodels.root.currentIsVisited;
            activity.isShared = false; // overwrite it
            activity.fetchData();

        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

