define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal.token;

    // 获取全局wx-sdk接口
    var wx = avalon.wx;

    // prefix of localStorage
    var cachedPrefix = 'illy-task-activity-';
    
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
                url: apiBaseUrl + '/api/v1/tasks/' + activity.taskId + '/share',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function(res) {
                    //console.log(res);
                },
                error: function(res) {
                    console.log(res);
                },
                ajaxFail: function(res) {
                    console.log(res);
                }
            })
        },
        fetchData: function() {
            if (activity.visited && activity.hasData) {
                var localCache = localCache.parse(localStorage.getItem(cachedPrefix + activity.taskId));
                    acTitle.taskId = localCache._id;
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
                url: apiBaseUrl + "/api/v1/tasks/" + activity.taskId,
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
                    activity.infoCollect = json.infoCollect[0].split(",");
                    for (var i = 0, len = activity.infoCollect.length; i < len; i++) {
                        activity.infoCollect[i] = '';
                    }
                    activity.CopyinfoCollect = json.infoCollect[0].split(",");
                    activity.theme = json.theme;
                    localStorage.setItem(cachedPrefix + activity.taskId, JSON.stringify(json));
                    avalon.log(activity.collectResult);

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
            })
        }, // end of fetch data
        pushInfo: function() {
            var invalid = activity.infoCollect.some(function(item) {
                return item === '';
            })
            if (invalid) { alert('请完整填写报名信息'); return; }

            $http.ajax({
                method: 'POST',
                url: apiBaseUrl + '/api/v1/activities/' + activity.taskId + '/info',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    info: activity.infoCollect // ordered-array   
                },
                success: function(res) {
                    activity.isDone = true;
                    activity.isFilling = false;
                },
                error: function(res) {
                    console.log(res);
                },
                ajaxFail: function(res) {
                    console.log(res);
                }
            })
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
            }

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {

            activity.taskId = params.taskId;
            activity.scoreAward = params.scoreAward; // get activity score award
            activity.visited = avalon.vmodels.root.currentIsVisited;
            activity.isShared = false; // overwrite it
            activity.fetchData();

        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

