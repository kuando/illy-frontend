define([], function() {
    
    // get config, apiBaseUrl
    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com/api/v1/';
    
    var resourcePrefix = 'http://resource.hizuoye.com/';
    var defaultAvatarUrl = 'http://resource.hizuoye.com/images/avatar/children/default1.png?image';
    
    // get config, token
    var token = avalon.illyGlobal.token; 
    if (token === null) {
        avalon.vmodels.root.noTokenHandler();
    }

    avalon.filters.year = function(str) {
        return str.substring(0, 4);
    };

    avalon.filters.time = function(str) {
        return str.substring(5);
    };

    // 每页大小
    var limit = 6;
    var evaluation = avalon.define({ // 教师评价评语列表

        $id: "evaluation",
        noContent: false,
        noContentText: '还没有做过作业哦，<br/>快去完成作业，得到老师评价吧~',

        // avatar: '',
        //displayName: '',
        
        lists: [],
        visited: false,
        offset: 0,
        btnShowMore: true,
        fetchData: function(data, concat) {
            $http.ajax({
                method: "",
                //url: "api/list.json?limit=6",
                url: apiBaseUrl + "homework/comments",
                data: data,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function(lists) {
                    concat ? evaluation.lists.concat(lists) : evaluation.lists = lists; /* jshint ignore:line */
                    setTimeout(function() {
                        if (lists.length === 0) {
                            evaluation.noContent = true;
                        }
                    }, 200);
                },
                error: function(res) {
                    console.log("evaluation list ajax error" + res);
                    evaluation.noContent = true;
                },
                ajaxFail: function(res) {
                    console.log("evaluation list ajax failed" + res);
                    evaluation.noContent = true;
                }
            });
        }, // end of fetchData
        showMore: function(e) {
            e.preventDefault();
            var page = 2;
            if (evaluation.offset < limit) {
                evaluation.btnShowMore = false;
                return;
            } else {
                evaluation.offset = evaluation.offset + limit * (page - 1);
            }

            evaluation.fetchRemoteData({offset: evaluation.offset}, 'concat');
        }

    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function() {
            setTimeout(function() {
                evaluation.avatar = (resourcePrefix + avalon.vmodels.app.avatar + "?imageView2/1/w/200/h/200") || defaultAvatarUrl;
                evaluation.displayName = avalon.vmodels.app.displayName;
            }, 300);

            evaluation.visited = avalon.vmodels.root.currentIsVisited; 
            // otherwise, show it
            evaluation.offset <= limit ? evaluation.btnShowMore = false : evaluation.btnShowMore = true; /* jshint ignore:line */
            evaluation.fetchData();
            
        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});

