define([], function() {

    var limit = 6; // 一次抓取多少数据

    var token = localStorage.getItem('illy-token');
    var apiUrl = avalon.illyGlobal && avalon.illyGlobal.token;
    var categoryId = mmState.currentState.name;

    var list = avalon.define({
        $id: "list",
        lists: [], 
        offset: 0, // inner var, to fetch data with offset and limit

        showMore: function(e) {
            e.preventDefault();
            var page = 2;
            list.offset = list.offset + limit * (page - 1);
            // fetch more data and rerendered(maybe not good, should append)
            // ...
            $http.ajax({
                method: "",
                url: "api/list.json",
                data: {
                    //offset: 6,
                    offset: list.offset
                    //limit: 6
                },
                beforeSend: function(xhr) {

                },
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function(res) {
                    //avalon.log("list.js ajax success" + res);
                    list.lists = list.lists.concat(res);
                    document.body.classList.remove('a-bounceinT');
                    setTimeout(function() {
                        document.body.classList.add('a-bounceinT');
                    }, 1)
                },
                error: function(res) {
                    alert("list.js ajax error");
                    console.log("ajax error" + res);
                },
                ajaxFail: function(res) {
                    console.log("ajaxFail" + res);
                }
            })
        }
    });

    //list.$watch("currentPage", function(categories) {
    //    avalon.router.go("site.list", {categories: categories})
    //});

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            avalon.log("leave list");
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            avalon.log("list.html onEnter");
            $http.ajax({
                method: "",
                url: "api/list.json?limit=6",
                data: {
                    offset: 6,
                    //limit: 6
                },
                beforeSend: function(xhr) {

                },
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function(res) {
                    list.lists = res; //first fetch data
                },
                error: function(res) {
                    avalon.log("ajax error" + res);
                },
                ajaxFail: function(res) {
                    avalon.log("ajaxFail" + res);
                }
            })
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

