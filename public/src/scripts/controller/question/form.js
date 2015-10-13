define([], function() {
 
    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;
    var token = avalon.illyGlobal.token;

    var form = avalon.define({
        $id: "form",
        imgLocalId: '',
        imgServerId: '',
        questionText: '',
        createQuestion: function() {
            $http.ajax({
                method: 'POST',
                url: apiBaseUrl + 'questions',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data {
                    questionImage: form.imgServerId,
                    questionText: form.questionText
                },
                success: function(res) {
                    avalon.router.go('question.result.list');
                },
                error: function(res) {
                    avalon.illyError('ajax error', res);
                    alert("submit error!");
                },
                ajaxFail: function(res) {
                    avalon.illyError('ajax failed', res);
                    alert("submit failed!");
                }
            });

        } // end of createQuestion 
    });

    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {

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

