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
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            avalon.log("index.js onRendered fn" + Date.now());
            avalon.$('#slider').style.display = 'none';
            setTimeout(function() {
                $('#slider').slider({
                    loop: true
                })
            }, 300)
            $('#slider').show();
        }
        // 进入视图
        $ctrl.$onEnter = function() {
            avalon.log("index.js onEnter callback" + Date.now());
            index.fetchData('/api/v1/posts/slider', {}, 'sliders');
            index.fetchData('/api/v1/posts/hot?limit=3', {}, 'hots'); // three articles
            index.fetchData('/api/v1/categories/posts', {}, 'categories');
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("index.js onBeforeUnload fn");
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

