define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;
    var token = avalon.illyGlobal.token;
    
    var localLimit = 6; // 一次抓取多少数据
    var history = avalon.define({

        $id: "history",
        isVisited: false,
        noContent: false,
        noContentText: '还没有做过作业哦，<br/>快去完成作业，得到老师评价吧~',

        historys: [],

        isLoading: false, // 正在加载标记
        offset: 0, // inner var, to fetch data with offset and limit
        noMoreData: false, // no more data
        btnShowMore: false,
        fetchData: function(data, concat) {
            history.isLoading = true;

            var limit = localLimit;
            var offset;
            offset = history.historys.length || 0;

            $http.ajax({
                url: apiBaseUrl + "questions?limit=" + limit + "&offset=" + offset,
                data: data,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function(historys) {

                    if (concat === true) {
                        history.historys = history.historys.concat(historys);
                    } else {
                        history.historys = historys;
                    }
                    setTimeout(function() {                          
                        var newhistorys = history.historys;
                        if (newhistorys && newhistorys.length === 0) {
                            history.noContent = true;
                        }      
                    }, 200);
                    if (historys.length === 0) {
                        history.noMoreData = true;
                    }
                    history.isLoading = false;
                },
                error: function(res) {
                    avalon.illyError("history history ajax error", res);
                    if (history.lists.length <= 1) {
                        history.noContent = true;
                    }
                },
                ajaxFail: function(res) {
                    avalon.illyError("history history ajax failed" + res);
                    if (history.lists.length <= 1) {
                        history.noContent = true;
                    }
                }
            });
        }, // end of fetchData
        showMore: function(e) {
            e.preventDefault();
            history.fetchData({}, true); //is concat 
        },

    }); // end of define

    history.historys.$watch('length', function(newLength) { // mark for avalon1.5+ change this way
        if (newLength && (newLength < localLimit)) {
            history.btnShowMore = false;
        } else {
            history.btnShowMore = true;
        }
    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function() {

            history.isVisited = avalon.vmodels.root.currentIsVisited;
            if (!history.isVisited) {
                history.fetchData();
            }

        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});

