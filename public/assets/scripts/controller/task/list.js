define([], function() {

    var limit = 6; // 一次抓取多少数据

    var token = localStorage.getItem('illy-token');
    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl;
    var categoryId = mmState.currentState.name;

    var list = avalon.define({
        $id: "list",
        lists: [], 
        categoryId: 111111111111111111111111,
        title: 'title',
        offset: 0, // inner var, to fetch data with offset and limit
        btnShowMore: true,
        showMore: function(e) {
            e.preventDefault();
            var page = 2;
            list.offset = list.offset + limit * (page - 1);

            $http.ajax({
                method: "",
                url: apiBaseUrl + '/api/v1/categories/' + list.categoryId + '/posts',
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
                    }, 16)
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

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            avalon.log("leave list");
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            //avalon.log("list.html onEnter in Time: " + Date.now());
            list.categoryId = params.categoryId; // get postId
            avalon.vmodels.root.title = params.categoryName; // set action bar title again
            if (list.categoryId == 'hots') {
                list.btnShowMore = false;
                $http.ajax({
                    url: apiBaseUrl + '/api/v1/posts/hot?limit=10',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    dataType: "json",
                    success: function(res) {
                        list.lists = res; //first fetch data
                    },
                    error: function(res) {
                        avalon.log("site list ajax error" + res);
                    },
                    ajaxFail: function(res) {
                        avalon.log("site list ajaxFail" + res);
                    }
                })
                return ;
            }
            list.btnShowMore = true; // otherwise, show it
            $http.ajax({
                method: "",
                url: apiBaseUrl + "/api/v1/categories/" + list.categoryId + '/posts',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                dataType: "json",
                success: function(res) {
                    list.lists = res; //first fetch data
                },
                error: function(res) {
                    avalon.log("site list ajax error" + res);
                },
                ajaxFail: function(res) {
                    avalon.log("site list ajaxFail" + res);
                }
            })
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log('list.js onRendered in Time: ' + Date.now());
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

