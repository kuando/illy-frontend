define([], function() {
    
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal.token;

    if (!token) {
        alert("no token error");
        return;
    }

    var limit = 5; // 一次抓取多少数据
    var report = avalon.define({

        $id: "report",
        offset: 0, // inner var, to fetch data with offset and limit
        fetchData: function(type) {
            $http.ajax({
                method: "",
                //url: "api/list.json?limit=6",
                url: apiBaseUrl + "/api/v1/homework/comments",
                data: {
                    //offset: list.offset
                    //limit: 6
                },
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function(lists) {
                    list[type] = lists; //key ! fetch data
                },
                error: function(res) {
                    console.error("report ajax error" + res);
                },
                ajaxFail: function(res) {
                    console.error("report ajaxFail" + res);
                }
            })
        } // end of fetchData

    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("leave list");
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            // remove cache in detail ctrl
            list.fetchData();
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

