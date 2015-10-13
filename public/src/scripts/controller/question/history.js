define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;
    var token = avalon.illyGlobal.token;
    
    // prefix of localStorage
    var cachedPrefix = 'illy-question-history-';
    // cache the view data
    
    // history cache flag
    var needCache = true;

    var localLimit = 6; // 一次抓取多少数据
    var history = avalon.define({

        $id: "history",
        visited: false, // first in, no data
        historys: [], 

        offset: 0, // inner var, to fetch data with offset and limit
        noContent: false,
        isLoading: false,
        noMoreData: false,
        btnShowMore: false,
        fetchRemoteData: function(apiArgs, data, target, concat) { // only ctrl function to fetch data with api
            if (arguments.length !== 4) {
                avalon.illyError('ERROR: must give 4 args!' + arguments);
            }
            history.noMoreData = false;
            if (history.visited && needCache && !concat) {
                var articles = history.historys;
                history.historys = avalon.getLocalCache(cachedPrefix + history.categoryId + '-' + target);
                avalon.vmodels.root.currentRendered = true;
                history.offset = history.historys.length;
                if (articles.length > localLimit && articles.length % localLimit < localLimit) {
                    history.noMoreData = true; // not full support, but ok
                }
                return;
            }
            history.isLoading = true;
            $http.ajax({
                url: apiBaseUrl + apiArgs,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: data,
                success: function(res) { 
                    if (concat === true) {
                        history.historys = history.historys.concat(res);
                    } else {
                        history.historys = res;
                    }
                    if (res.length === 0) {
                        history.noMoreData = true;
                    }
                    history.offset = history.historys.length;
                    if (history.historys.length === 0) {
                        history.noContent = true;
                        history.noMoreData = true;
                    }
                    var result = history.historys.$model;
                    avalon.setLocalCache(cachedPrefix + history.categoryId + '-' + target, result); // illy-microsite-11111-historys
                    history.isLoading = false;
                    avalon.vmodels.root.currentRendered = true;
                },
                error: function(res) {
                    avalon.illyError('microsite history.js ajax error', res);
                    if (history.historys.length === 0) {
                        history.noContent = true;
                    }
                    history.isLoading = false;
                },
                ajaxFail: function(res) { 
                    avalon.illyError('microsite history.js ajax failed', res);
                    if (history.historys.length === 0) {
                        history.noContent = true;
                    }
                    history.isLoading = false;
                }
            });
        },
        showMore: function(e) {
            e.preventDefault();
            history.fetchRemoteData('categories/' + history.categoryId + '/posts', {limit: localLimit, offset: history.offset}, 'historys', true); // isShowMore
        }

    }); // end of define

    history.historys.$watch('length', function(newhistorys) {
        if (newhistorys !== void 0) {
            if (newhistorys < localLimit) {
                history.btnShowMore = false;
            } else {
                if (history.categoryId !== 'hots') {
                    history.btnShowMore = true;
                }
            }
        }
    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function(params) {

            avalon.vmodels.result.current = 'history';
            history.visited = avalon.vmodels.root.currentIsVisited;

        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});

