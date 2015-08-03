define([], function() {
    
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal.token;

    if (!token) {
        alert("no token error");
        return;
    }

    var limit = 5; // 一次抓取多少数据

    var report = avalon.define({ // 学业统计报告

        $id: "report",
        offset: 0, // inner var, to fetch data with offset and limit
        fetchData: function(type) {
            $http.ajax({
                method: "",
                url: apiBaseUrl + "/api/v1/",
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
                    console.log("report ajax error" + res);
                },
                ajaxFail: function(res) {
                    console.log("report ajax failed" + res);
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
            report.fetchData();
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

