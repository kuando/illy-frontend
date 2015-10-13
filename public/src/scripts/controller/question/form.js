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
            if (form.questionText.length <= 5) {
                avalon.vmodels.question.showAlert('请增加一些描述，以便老师解答!', 3);
                return;
            }
            $http.ajax({
                method: 'POST',
                url: apiBaseUrl + 'questions',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: {
                    questionImage: form.imgServerId,
                    questionText: form.questionText
                },
                success: function() {
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

            var index = avalon.vmodels.index;
            form.imgLocalId = index && index.localImgSrc;
            form.imgServerId = index && index.serverId;
            
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

