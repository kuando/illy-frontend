define([], function() {
    
    // get config, apiBaseUrl
    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com/api/v1/';
    
    // get config, token
    var token = avalon.illyGlobal.token; 
    if (token === null) {
        avalon.vmodels.root.noTokenHandler();
    }

    // 每页大小
    var limit = 6;
    var evaluation = avalon.define({ // 教师评价评语列表

        $id: "evaluation",
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
                    concat ? evaluation.lists.concat(lists) : evaluation.lists = lists;
                },
                error: function(res) {
                    console.log("evaluation list ajax error" + res);
                },
                ajaxFail: function(res) {
                    console.log("evaluation list ajax failed" + res);
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
        $ctrl.$onEnter = function(params) {

            evaluation.visited = avalon.vmodels.root.currentIsVisited;
            evaluation.offset <= limit ? evaluation.btnShowMore = false : evaluation.btnShowMore = true; // otherwise, show it
            evaluation.fetchData();
            
        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

            setTimeout(function() {
                $('.comments-overflow').on('click', function() { 
                    $(this).hide();
                    $(this).parent().find('.comments-full')[0].style.display = 'inline-block';
                });
                $('.comments-full').on('click', function() { 
                    $(this).hide();
                    $(this).parent().find('.comments-overflow')[0].style.display = 'inline-block';
                });
            }, 500);

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});

