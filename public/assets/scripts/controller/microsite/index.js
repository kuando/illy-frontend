define([], function() {

    // get apiBaseUrl
    var apiBaseUrl = ( avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl ) || 'http://api.hizuo.com';
    var token = avalon.illyGlobal && avalon.illyGlobal.token;
    if (token == void 0) {
        avalon.log("Error, no token!");
    }

    var index = avalon.define({
        $id: "index",
        sliders: [],
        hots: [],
        categories: [],
        fetchData: function(apiArgs, data, target) {
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
        }
    });

    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {
            //avalon.log("index.js onEnter callback" + Date.now());
            index.fetchData('/api/v1/posts/slider', {}, 'sliders');
            index.fetchData('/api/v1/posts/hot?limit=3', {}, 'hots'); // three articles
            index.fetchData('/api/v1/categories/posts', {}, 'categories');
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            avalon.log("index.js onRendered in Time: " + Date.now());
            setTimeout(function() {
                $('#slider').slider({
                    loop: true,
                    ready: function() {
                        avalon.log('gmu sliders ready in Time: ' + Date.now());
                        setTimeout(function() {
                            avalon.$('#slider').style.visibility = 'visible';
                        }, 16)
                    },
                    'done.dom': function() {
                        avalon.log('gmu sliders done.dom in Time: ' + Date.now());
                        setTimeout(function() { // 双保险
                            $('#slider').slider({
                                loop: true
                            })
                        }, 300)
                    }
                })
            }, 300)
            avalon.log('index page done!!! in Time: ' + Date.now());
            var endTime = Date.now();
            avalon.endTime = endTime;
            avalon.log('total time: ' + (avalon.endTime - avalon.startTime));
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("index.js onBeforeUnload fn");
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

