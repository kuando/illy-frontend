define([], function() {
    
    //var limit = 9; // 一次抓取多少数据

    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal.token;

    if (!token) {
        alert("no token error");
        return;
    }

    var list = avalon.define({

        $id: "list",
        homework: [], // 作业数据
        previews: [], // 预习数据
        offset: 0, // inner var, to fetch data with offset and limit
        //isLoading: false, // 正在加载标记
        fetchData: function(type) {
            //list.isLoading = true; // 正在加载标记
            $http.ajax({
                method: "",
                //url: "api/list.json?limit=6",
                url: apiBaseUrl + "/api/v1/" + type,
                data: {
                    //offset: list.offset
                    //limit: 6
                },
                beforeSend: function(xhr) {

                },
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function(lists) {
                    list[type] = lists; //key ! fetch data
                    //list.isLoading = false;
                },
                error: function(res) {
                    console.log("homework list ajax error" + res);
                },
                ajaxFail: function(res) {
                    console.log("homework list ajax failed" + res);
                }
            })
        } // end of fetchData

        //,showMore: function() { // 目前的设计无法实现很好的加载更多，考虑到作业不会很多，放弃分页
        //    list.fetchData()
        //}

    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("leave list");
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            // remove cache in detail ctrl
            list.fetchData('homework');
            list.fetchData('previews');
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

