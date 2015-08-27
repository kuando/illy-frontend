define([], function() {
 
    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuo.com/api/v1/';
    var token = avalon.illyGlobal.token;
    if (token === void 0) {
        // handler with no token error in one global method 
        avalon.illyGlobal.noTokenHandler();
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
                    console.log(res);
                },
                ajaxFail: function(res) {
                    alert("Woops, site.index ajax failed!" + res);
                }
            });

        }, // end of fetchRemoteData
        renderSlider: function() {
            setTimeout(function() {
                $('#slider').slider({
                    loop: true,
                    ready: function() {
                        //avalon.log('gmu sliders ready in Time: ' + Date.now());
                        setTimeout(function() {
                            avalon.$('#slider').style.visibility = 'visible';
                        }, 16); // 1 frame
                    },
                    'done.dom': function() {
                    }
                });
            }, 32);
        }
    });

    // download this ctrl file time
    //var enterTime = Date.now();
    //avalon.indexEnterTime = enterTime;
    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {

            index.visited = avalon.vmodels.root.currentIsVisited;
            index.fetchRemoteData('posts/slider', {}, 'sliders');
            index.fetchRemoteData('posts/hot?limit=3', {}, 'hots'); // three articles
            index.fetchRemoteData('categories/posts', {}, 'categories');
            
       };
        // 视图渲染后，意思是avalon.scan完成
        //var renderedDelay;
        $ctrl.$onRendered = function() {

            //if (avalon.endTime === void 0) { // first in 
            //    var endTime = Date.now();
            //    avalon.endTime = endTime;
            //    avalon.totalTime = avalon.endTime - avalon.startTime; // this var in bootstrap file
            //    avalon.log('total time: ' + avalon.totalTime);
                /* 
                 *
                 *  wifi 300 +/-
                 *  3g   420 +/-
                 *  2g   650 +/-
                 *
                 */
            //    if (avalon.getVM('detail') === void 0 && avalon.getVM('list') === void 0) { // fix slider render to delay when not first in index condition
            //        renderedDelay = avalon.endTime - avalon.indexEnterTime + 128;
            //    } else {
            //        renderedDelay = 500;
            //    }

            //    if (avalon.getVM('detail') !== void 0 || avalon.getVM('list') !== void 0) { // not first in index condition
            //        renderedDelay = 1000;
            //    } else {
            //        if (avalon.totalTime > 1500) {
            //            renderedDelay += 2500;
            //        } else if (avalon.totalTime > 500 && avalon.totalTime < 1500) {
            //            renderedDelay = renderedDelay + 500;
            //        } else {
            //            renderedDelay += 384; // 24 frame
            //        }
            //    }
            //} else { // file in avalon.templateCache, do the some 
            //    renderedDelay = 64; // 4 frame
            //}

            //setTimeout(function() {
            //    $('#slider').slider({
            //        loop: true,
            //        ready: function() {
            //            //avalon.log('gmu sliders ready in Time: ' + Date.now());
            //            setTimeout(function() {
            //                avalon.$('#slider').style.visibility = 'visible';
            //            }, 16); // 1 frame
            //        },
            //        'done.dom': function() {
            //        }
            //    });
            //    //avalon.log('gmu sliders done.dom in Time: ' + Date.now());
            //}, renderedDelay);
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("index.js onBeforeUnload fn");
        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

