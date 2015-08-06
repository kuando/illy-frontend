define([], function() {
 
    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuo.com/api/v1/';
    var token = avalon.illyGlobal.token;
    if (token == void 0) {
        avalon.log("Error, no token!");
        alert('对不起，系统错误，请退出重试！');
    }

    // cache the view data
    var needCache = true;

    var index = avalon.define({
        $id: "index",
        sliders: [], // auto-nature-cached key!!!
        hots: [], // auto-nature-cached key!!!
        categories: [], // auto-nature-cached key!!!
        visited: false, // first in, no cache
        fetchRemoteData: function(apiArgs, data, target) {
            if (index.visited && needCache) { return; }

            $http.ajax({
                url: apiBaseUrl + apiArgs + '',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: data,
                success: function(res) {
                    index[target] = res;
                },
                error: function(res) {
                    avalon.log(res);
                },
                ajaxFail: function(res) {
                    alert("Woops, site.index ajax failed!");
                }
            })

        } // end of fetchRemoteData
    });

    // download this ctrl file time
    var enterTime = Date.now();
    avalon.indexEnterTime = enterTime;
    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {

            index.visited = avalon.vmodels.root.currentIsVisited;
            index.fetchRemoteData('posts/slider', {}, 'sliders');
            index.fetchRemoteData('posts/hot?limit=3', {}, 'hots'); // three articles
            index.fetchRemoteData('categories/posts', {}, 'categories');

        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            if (avalon.endTime == void 0) { // first in 
                var endTime = Date.now();
                avalon.endTime = endTime;
                avalon.totalTime = avalon.endTime - avalon.startTime;
                avalon.log('total time: ' + avalon.totalTime);
                /* 
                 *
                 *  wifi 300 +/-
                 *  3g   420 +/-
                 *  2g   650 +/-
                 *
                 */
                renderedDelay = avalon.endTime - avalon.indexEnterTime;
                if (avalon.totalTime > 1500) {
                    renderedDelay += 2500;
                } else if (avalon.totalTime > 500 && avalon.totalTime < 1500) {
                    renderedDelay = renderedDelay + 500;
                }
                renderedDelay += 384; // 24 frame
            } else { // file in avalon.templateCache, do the some 
                renderedDelay = 64; // 4 frame
            }
            setTimeout(function() {
                $('#slider').slider({
                    loop: true,
                    ready: function() {
                        //avalon.log('gmu sliders ready in Time: ' + Date.now());
                        setTimeout(function() {
                            avalon.$('#slider').style.visibility = 'visible';
                        }, 16) // 1 frame
                    },
                    'done.dom': function() {
                        //avalon.log('gmu sliders done.dom in Time: ' + Date.now());
                    }
                })
            }, renderedDelay)
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("index.js onBeforeUnload fn");
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

