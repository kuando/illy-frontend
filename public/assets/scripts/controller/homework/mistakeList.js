define([], function() {
    
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal.token;

    if (!token) {
        alert("no token error");
        return;
    }

    var mistakeList = avalon.define({

        $id: "mistakeList",
        lists: [], // 作业数据
        //isLoading: false, // 正在加载标记
        fetchData: function() {
            //list.isLoading = true; // 正在加载标记
            $http.ajax({
                method: "",
                //url: "api/list.json?limit=6",
                url: apiBaseUrl + "/api/v1/homework/mistake",
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function(res) {
                    mistakeList.lists = res; //key ! fetch data
                },
                error: function(res) {
                    console.log("mistakeList ajax error" + res);
                },
                ajaxFail: function(res) {
                    console.log("mistakeList ajax failed" + res);
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
            mistakeList.fetchData();
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

