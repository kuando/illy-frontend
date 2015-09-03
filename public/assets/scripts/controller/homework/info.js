define([], function() {
    
    // get config, apiBaseUrl
    var apiBaseUrl = avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com/api/v1/';
    
    // get config, token
    var token = avalon.illyGlobal.token; 
    if (token === null) {
        avalon.vmodels.root.noTokenHandler();
    }

    // 题目要求视图,渲染题目信息面板
    var info = avalon.define({
        $id: "info",
        homeworkId: 0,
        workType: 'homework',
        title: '',
        keyPoint: '',
        keyPointRecord: '',
        isPlaying: false, // 有录音的作业是否在播放录音
        duration: 0, // 知识重点录音时长, 用于播放完毕ui change
        // core!!! 因为detail为抽象状态，无onEnter的params参数，故延迟到这里获取数据
        fetchDataForDetailCtrl: function(id, type) { // 可以获取多种作业类型的数据了,201507201446
            var _id = id;   
            $http.ajax({
                url: apiBaseUrl + type + '/' + _id,
                data: {
                    
                },
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: 'json',
                success: function(json) {
                    var detail = avalon.vmodels.detail;
                    info.homeworkId = json._id;
                    detail.homeworkId = json._id;
                    info.title = json.title;
                    detail.title = json.title;
                    info.keyPoint = json.keyPoint;
                    detail.keyPoint = json.keyPoint;
                    info.keyPointRecord = json.keyPointRecord;
                    detail.keyPointRecord = json.keyPointRecord;
                    detail.exercises = json.exercises;

                    var keyPointAudio = avalon.$('.info .keyPointAudio');
                    keyPointAudio && keyPointAudio.setAttribute('src', 'http://resource.hizuoye.com/' + info.keyPointRecord); /* jshint ignore:line */
                },
                error: function(res) {
                    console.log('homework info ajax error' + res);
                },
                ajaxFail: function(res) {
                    console.log('homework info ajax failed' + res);
                }
            });
        },
        goNext: function() { // core!!! 判断跳转到哪种类型的题目
            avalon.router.go('app.detail.question', { homeworkId: info.homeworkId, questionId: 1 });
        },
        playRecord: function() {
            var audio = avalon.$('.keyPointAudio');
            audio.play();
            info.isPlaying = true;
            setTimeout(function() {
                info.isPlaying = false;
            }, info.duration * 1000); 
        },
        stopRecord: function() {
            var audio = avalon.$('.keyPointAudio');
            audio.pause();
            info.isPlaying = false;
            // ui recover
            // ...
        },
        toggleRecord: function() {
            if (info.isPlaying) {
                info.stopRecord();
            } else {
                info.playRecord();
            }
        }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log("info.js onRendered fn");
        };
        // 进入视图
        $ctrl.$onEnter = function(params) {
            //avalon.log("info.js onEnter callback");
            
            //clear localAnswers here to fix bug in low Andriod, drop in 20150808
            //var questionVM = avalon.vmodels.question;
            //questionVM && ( questionVM.localAnswers = [] );
           
            var type = location.href.split("=")[1] || 'homework'; // for strong
            info.workType = type;
            var _id = params.homeworkId;
            info.fetchDataForDetailCtrl(_id, type); // 分为两种，作业和预习, 更加灵活，便于扩充

            // setTimeout(function() { // fix: deal with no keyPointRecord condition & make no 404 request with undefined resource
            //     if (info.keyPointRecord !== '' || info.keyPointRecord !== undefined) {
            //         var keyPointAudio = avalon.$('.info .keyPointAudio');
            //         keyPointAudio && keyPointAudio.setAttribute('src', 'http://resource.hizuoye.com/' + info.keyPointRecord); /* jshint ignore:line */
            //     } 
            //     //else {
            //     //    avalon.$('.info .keyPointAudio').getAttribute('src');
            //     //    avalon.$('.keyPointAudio').getAttribute('src');
            //     //}
            // }, 500);

            setTimeout(function() {
                // 设置好录音时间
                var audio = avalon.$('.keyPointAudio');
                var duration = audio && audio.duration;
                info.duration = duration;
                var time = avalon.$('.info .record-total-time');
                time && ( time.innerHTML = parseInt(duration, 10) || 0 ); /* jshint ignore:line */
            }, 2000);
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("info.js onBeforeUnload fn");
        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

