define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuo.com/api/v1/';
    var token = avalon.illyGlobal.token;
    if (token === void 0) {
        avalon.log("Error, no token!");
        alert('对不起，系统错误，请退出重试！');
    }
    
    // prefix of localStorage
    var cachedPrefix = 'illy-microsite-list-';
    // cache the view data
    
    // cache flag
    var needCache = true;

    var limit = 6; // 一次抓取多少数据
    var list = avalon.define({

        $id: "list",
        visited: false, // first in, no data
        lists: [], 
        categoryId: 111111111111111111111111,
        title: 'title', // 本来是想这个页面url带来栏目名，重写action上的title，结果url带中文不行。暂时没用，先留着吧
        offset: 0, // inner var, to fetch data with offset and limit
        btnShowMore: true,
        fetchRemoteData: function(apiArgs, data, target, type) { // only ctrl function to fetch data with api
            if (list.visited && needCache) {
                list.lists = avalon.getLocalCache(cachedPrefix + list.categoryId + '-' + target);
                return;
            }
            $http.ajax({
                url: apiBaseUrl + apiArgs,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: data,
                success: function(res) { /* jshint ignore:line */
                    type === 'concat' ? list[target] = list[target].concat(res) : list[target] = res; /* jshint ignore:line */
                    avalon.setLocalCache(cachedPrefix + list.categoryId + '-' + target, res); // illy-microsite-11111-lists
                },
                error: function(res) { /* jshint ignore:line */
                    console.log('list.js ajax error when fetch data');
                },
                ajaxFail: function(res) { /* jshint ignore:line */
                    console.log('list.js ajax failed when fetch data');
                }
            });
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

            list.fetchRemoteData('categories/' + list.categoryId + '/posts', {offset: list.offset}, 'lists', 'concat');
        }

    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function(params) {
            list.visited = avalon.vmodels.root.currentIsVisited;

            list.categoryId = params.categoryId; // get postId
            //avalon.vmodels.root.title = params.categoryName; // set action bar title again drop in 20150724
            if (list.categoryId === 'hots') {
                list.btnShowMore = false;
                list.fetchRemoteData('posts/hot?limit=10', {}, 'lists');
                return ;
            }
            // otherwise, show it
            list.offset <= limit ? list.btnShowMore = false : list.btnShowMore = true; /* jshint ignore:line */
            list.fetchRemoteData('categories/' + list.categoryId + '/posts', {}, 'lists');
        };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
});

