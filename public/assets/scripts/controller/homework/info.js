define([], function() {
    
    // review in 201507221010

    var apiBaseUrl = ( avalon.illyGlobal && avalon.illyGlobal.apiBaseUrl ) || 'http://api.hizuoye.com';
    var token = avalon.illyGlobal && avalon.illyGlobal.token;

    // 题目要求视图,渲染题目信息面板
    var info = avalon.define({
        $id: "info",
        homeworkId: 0,
        workType: 'homework',
        title: '',
        keyPoint: '',
        keyPointRecord: '',
        isPlaying: false, // 有录音的作业是否在播放录音
        // core!!! 因为detail为抽象状态，无onEnter的params参数，故延迟到这里获取数据
        fetchDataForDetailCtrl: function(id, type) { // 可以获取多种作业类型的数据了,201507201446
            var _id = id;   
            $http.ajax({
                url: apiBaseUrl + '/api/v1/' + type +'/' + _id,
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
                },
                error: function(res) {
                    console.log(res);
                },
                ajaxFail: function(res) {
                    console.log(res);
                }
            })
        },
        goNext: function(type) { // core!!! 判断跳转到哪种类型的题目
            avalon.router.go('app.detail.question', {homeworkId: info.homeworkId, questionId: 1 });
        },
        playRecord: function() {
            var audio = avalon.$('.keyPointAudio');
            audio.play();
            info.isPlaying = true;
            avalon.log('playing');
            // ui change for playing
            // ...
        },
        stopRecord: function() {
            var audio = avalon.$('.keyPointAudio');
            audio.pause();
            info.isPlaying = false;
            avalon.log('stop playing');
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
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            //avalon.log("info.js onEnter callback");
            var type = location.href.split("=")[1] || 'homework'; // for strong
            info.workType = type;
            var _id = params.homeworkId;
            info.fetchDataForDetailCtrl(_id, type); // 分为两种，作业和预习, 更加灵活，便于扩充
            setTimeout(function() {
                // 设置好录音时间
                var audio = avalon.$('.keyPointAudio');
                var duration = audio && audio.duration;
                var time = avalon.$('.record-total-time');
                time && ( time.innerHTML = parseInt(duration, 10) );
            }, 2000)
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("info.js onBeforeUnload fn");
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

