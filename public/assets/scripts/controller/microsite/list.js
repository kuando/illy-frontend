define([], function() {

    var limit = 6; // 一次抓取多少数据

    var token = localStorage.getItem('illy-token');
    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl;
    //var categoryId = mmState.currentState.name;
    
    var cachedPrefix = 'illy-microsite-list-';

    function setCachedData(itemName, data) {
        var strData = JSON.stringify(data);
        localStorage.setItem(cachedPrefix + itemName, strData);
    }
    
    function getCachedData(itemName) {
        var data = localStorage.getItem(cachedPrefix + itemName);
        return JSON.parse(data + '');
    }

    function clearCachedData(targetNameArr) {
        for (var i = 0, len = targetNameArr.length; i < len; i++) {
            localStorage.removeItem(cachedPrefix + targetNameArr[i]);
        }
    }

    var list = avalon.define({
        $id: "list",
        visited: false, // first in, no data
        lists: [], 
        categoryId: 111111111111111111111111,
        title: 'title',
        offset: 0, // inner var, to fetch data with offset and limit
        btnShowMore: true,
        fetchRemoteData: function(apiArgs, data, target, type) { // only ctrl function to fetch data with api
            if (list.visited) {
                list.lists = getCachedData(list.categoryId + '-' + target);
                return;
            }
            $http.ajax({
                url: apiBaseUrl + apiArgs,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: data,
                success: function(res) {
                    type == 'concat' ? list[target] = list[target].concat(res) : list[target] = res;
                    setCachedData(list.categoryId + '-' + target, res); // illy-microsite-11111-lists
                },
                error: function(res) {
                    avalon.log('list.js ajax error when fetch data');
                },
                ajaxFail: function(res) {
                    avalon.log('list.js ajax failed when fetch data');
                }
            })
        },
        showMore: function(e) {
            e.preventDefault();
            var page = 2;
            if (list.offset < limit) {
                list.btnShowMore = false;
                return;
            } else {
                list.offset = list.offset + limit * (page - 1);
            }

            //$http.ajax({
            //    method: "",
            //    url: apiBaseUrl + '/api/v1/categories/' + list.categoryId + '/posts',
            //    headers: {
            //        'Authorization': 'Bearer ' + token
            //    },
            //    dataType: "json",
            //    success: function(res) {
            //        //avalon.log("list.js ajax success" + res);
            //        list.lists = list.lists.concat(res);
            //        document.body.classList.remove('a-bounceinT');
            //        setTimeout(function() {
            //            document.body.classList.add('a-bounceinT');
            //        }, 16)
            //    },
            //    error: function(res) {
            //        alert("list.js ajax error");
            //        console.log("ajax error" + res);
            //    },
            //    ajaxFail: function(res) {
            //        console.log("ajaxFail" + res);
            //    }
            //})
            list.fetchRemoteData('/api/v1/categories/' + list.categoryId + '/posts', {offset: list.offset}, 'lists', 'concat');
        }
    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("leave list");
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            list.visited = avalon.vmodels.root.currentIsVisited;
            //avalon.log("list.html onEnter in Time: " + Date.now());
            list.categoryId = params.categoryId; // get postId
            //avalon.vmodels.root.title = params.categoryName; // set action bar title again drop in 20150724
            if (list.categoryId == 'hots') {
                list.btnShowMore = false;
                //$http.ajax({
                //    url: apiBaseUrl + '/api/v1/posts/hot?limit=10', // because hots only the topN(top10)
                //    headers: {
                //        'Authorization': 'Bearer ' + token
                //    },
                //    dataType: "json",
                //    success: function(res) {
                //        list.lists = res; //first fetch data
                //        setCachedData()
                //    },
                //    error: function(res) {
                //        avalon.log("site list ajax error" + res);
                //    },
                //    ajaxFail: function(res) {
                //        avalon.log("site list ajaxFail" + res);
                //    }
                //})
                list.fetchRemoteData('/api/v1/posts/hot?limit=10', {}, 'lists')
                return ;
            }
            list.offset <= limit ? list.btnShowMore = false : list.btnShowMore = true; // otherwise, show it
            //$http.ajax({
            //    method: "",
            //    url: apiBaseUrl + "/api/v1/categories/" + list.categoryId + '/posts',
            //    headers: {
            //        'Authorization': 'Bearer ' + token
            //    },
            //    dataType: "json",
            //    success: function(res) {
            //        list.lists = res; //first fetch data
            //    },
            //    error: function(res) {
            //        avalon.log("site list ajax error" + res);
            //    },
            //    ajaxFail: function(res) {
            //        avalon.log("site list ajaxFail" + res);
            //    }
            //})
            list.fetchRemoteData('/api/v1/categories/' + list.categoryId + '/posts', {}, 'lists');
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log('list.js onRendered in Time: ' + Date.now());
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

