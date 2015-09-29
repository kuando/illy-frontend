define([], function() {
 
    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;
    var token = avalon.illyGlobal.token;

    var form = avalon.define({
        $id: "form",
        visited: false, // first in, no cache
        imgLocalId: '',
        imgServerId: '',
        fetchRemoteData: function(apiArgs, data, target) {
            if (form.visited) { 
                avalon.vmodels.root.currentRendered = true;
                return; 
            }

            $http.ajax({
                url: apiBaseUrl + apiArgs + '',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: data,
                success: function(res) {
                    form[target] = res;
                    avalon.vmodels.root.currentRendered = true;
                },
                error: function(res) {
                    avalon.illyError('ajax error', res);
                },
                ajaxFail: function(res) {
                    avalon.illyError('ajax failed', res);
                }
            });

        } // end of fetchRemoteData
    });

    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {

            form.visited = avalon.vmodels.root.currentIsVisited;
            // form.fetchRemoteData();
            form.imgLocalId = avalon.vmodels.index.localImgSrc;
            form.imgServerId = avalon.vmodels.index.serverId;
            
       };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

