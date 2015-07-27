define([], function() {

    // get config
    var apiBaseUrl = ( avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl) || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal && avalon.illyGlobal.token;
    
    var detail = avalon.define({
        $id: "detail",
        articleId: 1,
        title: "",
        content: "",
        created: "2015-07-09",
        shareCount: 88,
        visitCount: 88
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            detail.articleId = params.articleId !== "" ? params.articleId : 0;
            return $http.ajax({
                url: apiBaseUrl + "/api/v1/posts/" + detail.articleId,
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    detail.title = json.title;
                    detail.content = json.content;
                    detail.created = json.created;
                    detail.shareCount = json.shareCount;
                    detail.visitCount = json.visitCount;
                }
            })
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

