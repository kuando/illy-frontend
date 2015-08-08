define([], function() {

    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com/api/v1/';
    var token = localStorage.getItem('illy-token');
    
    var cachedPrefix = 'illy-task-mall-';

    var limit = 6; // 一次抓取多少数据
    var mall = avalon.define({
        $id: "mall",
        visited: false, // first in, no data
        lists: [], 
        offset: 0, // inner var, to fetch data with offset and limit
        btnShowMore: true,
        /**
         * fetchRemoteData
         * only ctrl function to fetch data with api
         *
         * @param apiArgs api里需要的参数
         * @param data ajax请求查询参数
         * @param target success得到的数据赋值目标变量名
         * @param type 数据赋值是直接赋值还是追加方式
         *
         */
        fetchRemoteData: function(apiArgs, data, target, type) {
            if (mall.visited) {
                //mall.lists = getCachedData(target);
                mall.lists = avalon.getLocalCache(cachedPrefix + target);
                return;
            }
            $http.ajax({
                url: apiBaseUrl + apiArgs,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: data,
                success: function(res) {
                    type == 'concat' ? mall[target] = mall[target].concat(res) : mall[target] = res;
                    setLocalCache(cachedPrefix + target, res); // illy-task-mall-lists
                },
                error: function(res) {
                    avalon.log('mall ajax error when fetch data');
                },
                ajaxFail: function(res) {
                    avalon.log('mall ajax failed when fetch data');
                }
            })
        },
        showMore: function(e) {
            e.preventDefault();
            var page = 2;
            if (mall.offset < limit) {
                mall.btnShowMore = false;
                return;
            } else {
                mall.offset = mall.offset + limit * (page - 1);
            }

            mall.fetchRemoteData('score/mall', {offset: mall.offset}, 'lists', 'concat');
        }
    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            mall.visited = avalon.vmodels.root.currentIsVisited;
            mall.offset <= limit ? mall.btnShowMore = false : mall.btnShowMore = true; // otherwise, show it
            mall.fetchRemoteData('score/mall', {}, 'lists');
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log('list.js onRendered in Time: ' + Date.now());
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

