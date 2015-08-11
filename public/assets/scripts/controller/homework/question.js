define([], function() {

    //var local_question_view_ani = 'a-bounceinL';

    // 获取全局wx-sdk接口
    var wx = avalon.wx;
    
    // 录音对象相关属性和方法, 因为wx的sdk方法都是独立作用域的回调，需要一个全局的存储对象
    var record = {
        startTime: 0,
        endTime: 0,
        duration: 5,
        localId: '', // core!
        timeout: 'timeout', // timeoutId, just need it, whatever name can do!
        playRecordTimeout: 'playRecordTimeout', // 录音播放计时器
        remainTimeTimer: null, // remain time timer
        showTimeoutDelay: 45, // second, define when show the timeout
        recordTooShortTipsLastTime: 1.5, // 录音时间过短提示信息持续时间
        showTimeOutLayer: function() {
            // 给个遮罩， 10秒倒计时开始, 并会自动停止录音并上传
            var timeoutMask = avalon.$('.timeout-mask');
            //var isRecording = avalon.$('.isRecording'); 
            record.layerUiChange();
            // time to show
            record.remainTimeTimer = setInterval(function() {
                var time = timeoutMask && parseInt(timeoutMask.innerHTML, 10) || 0;
                timeoutMask && ( timeoutMask.innerHTML = ( time > 0 ? time - 1 : 10) ); /* jshint ignore:line */
                if (time === 0) { question.stopRecord(); clearInterval(record.remainTimeTimer); } // core! should stop it.
            }, 1000);
            // recover the ui when time enough, 18s is enough
            setTimeout(function() {
                record.layerUiRecover();
            }, 18000); 
        },
        layerUiChange: function() { // inner fn of showTimeoutLayer
            var timeoutMask = avalon.$('.timeout-mask');
            var isRecording = avalon.$('.isRecording'); 
            // change some ui for mask, show mask 
            timeoutMask && (timeoutMask.style.display = 'inline-block'); /* jshint ignore:line */
            isRecording && isRecording.classList.add('timeout'); /* jshint ignore:line */
        },
        layerUiRecover: function() { // inner fn of showTimeoutLayer
            var timeoutMask = avalon.$('.timeout-mask');
            var isRecording = avalon.$('.isRecording'); 
            var remainTimeTimer = record.remainTimeTimer;
            remainTimeTimer && clearInterval(remainTimeTimer); /* jshint ignore:line */
            timeoutMask && ( timeoutMask.innerHTML = '10' );  /* jshint ignore:line */
            timeoutMask && ( timeoutMask.style.display = 'none' ); /* jshint ignore:line */
            isRecording && isRecording.classList.remove('timeout'); /* jshint ignore:line */
        },
        showTips: function() {
            var recordTips = avalon.$('.record-tips');
            recordTips && ( recordTips.style.display = 'inline-block' ); /* jshint ignore:line */
        },
        hideTips: function() {
            var recordTips = avalon.$('.record-tips');
            recordTips && ( recordTips.style.display = 'none' ); /* jshint ignore:line */
        }
    }; 

    // 每一个具体的题目控制器
    var question = avalon.define({
        $id: "question",
        homeworkId: avalon.vmodels.detail.homeworkId, // 直接取，这种固定值不需要动态获取
        starter: true, // start answer the question flag
        exercise: {}, // 本题所有数据
        total: 0, // 直接取不行,fuck bug... waste much time... 201507222006
        currentId: 0, // current exerciseId, 当前题id
        userAnswer: '', // 忠实于用户答案, 最多加个trim()
        duration: 3, // record duration
        localAnswers: [], // 本地保存本次作业当前所有做过的题的答案，length就是做到过哪一题了, core!!!
        right: null, // 做对与否, 录音题始终设为right(Em~...), 控制一些显隐逻辑(null, true, false)
        hasNext: false, // 是否有下一题？
        isDroped: false, // drop the record question flag 
        isRecording: false, // whether recording now, for ms-class 
        isPlaying: false, // 是否正在播放
        showPlayRecordBtn: false, // 是否显示播放录音按钮
        next: function() { // 点击进入下一题
            // 只处理页面跳转进入下一题
            avalon.router.go('app.detail.question', {homeworkId: question.homeworkId, questionId: question.currentId + 1});
        },
        startRecord: function() {
            
            /** 
             ×  首先停止录音(防止录制出错，原则上不会出现正在录音状态)
             *
             *  开始微信录音api
             *  隐藏一些ui
             *  标记开始录音
             *  记录开始录音时间
             *  注册wx超时录音api
             *  注册超时ui提示timeout
             */

            wx.stopRecord(); // 待定！！！ mark!!!

            wx.startRecord();
            record.hideTips(); // for strong
            question.isRecording = true;
            var startTime = Date.now(); // 记录开始录音时间，便于过长提示或者太短的舍弃
            record.startTime = startTime;

            // 开始录音时就要注册这个函数，走到这就说明超时了，没点停止就自动完成, 2号获取路径
            wx.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行complete回调
                complete: function(res) {
                    var localId = res.localId;
                    record.localId = localId;
                    question.uploadRecord(); // 上传录音，得到serverId
                }
            });
            // 同时设置ui来提示快到时间了
            record.timeout = setTimeout(function() {
                record.showTimeOutLayer();
            }, record.showTimeoutDelay * 1000); // 秒

        },
        stopRecord: function() {

            /**
             *  停止ui
             *  停止正在录音标记
             *  停止时间记录
             *  判断长短是否合法？
             */

            question.isRecording = false;
            avalon.$('.timeout-mask').style.display = 'none';
            // 能到这一步就该先清理ui上的倒计时，再统计时间来做相应操作
            record.timeout && clearTimeout(record.timeout); /* jshint ignore:line  */
            var endTime = Date.now();
            record.endTime = endTime;
            var duration = ( record.endTime - record.startTime ) / 1000; // 间隔时间， 单位秒 
            duration = parseInt(duration, 10) || 1;
            //record.duration = duration || 5; // for strong
            record.duration = duration; // for strong
            if (duration < 3) { // 小于3秒
                // alert('对不起，录制时间过短，请重新录制！'); // ios 点击穿透bug... fuck
                record.showTips();
                setTimeout(function() {
                    record.hideTips();
                }, record.recordTooShortTipsLastTime * 1000);
                wx.stopRecord({
                    // do nothing, just stop, fix bug
                });
            } else if (duration >= 3 && duration <= 60){ // 正常结束，取结果, 1号获取路径, 条件加强
                wx.stopRecord({
                    success: function(res) {
                        var localId = res.localId;
                        record.localId = localId;
                        question.uploadRecord();
                    }
                });
            }
            
        },
        uploadRecord: function() {

            /**
             *  没有localId就提示
             *  有localId就上传
             */

            var localId = record.localId;
            if (localId === '') {
                alert('对不起,上传失败!');
                console.log('上传失败，没有localId, localId为：' + localId);
                //console.log(record); // print global record array
                return;
            }
            wx.uploadVoice({
                localId: localId,
                isShowProgressTips: 1,
                success: function(res) {
                    var serverId = res.serverId; // 返回音频的服务端ID
                    question.userAnswer = serverId; // 这才是需要往后端发送的数据,供后端下载

                    question.showPlayRecordBtn = true;
                    
                    //var recordTotalTime = avalon.$('.record-total-time'); 
                    // 设置录音时长
                    //recordTotalTime && ( recordTotalTime.innerHTML = ( parseInt(record.duration, 10) || 0 ) ); [> jshint ignore:line <]
                    question.duration = record.duration; 
                }
            });

        },
        playRecord: function() {

            /** 
             *  如果localId有，就播放，没有就提示
             */

            var localId = record.localId;
            if (localId === '') {
                alert("录制不成功，请重试！");
                console.log('no localId');
                return ;
            }
            wx.playVoice({
                localId: localId
            });
            question.isPlaying = true;
            // 同时播完应该isPlaying = false
            
            //  clear first and add new another timeout
            clearTimeout(record.playRecordTimeout);
            record.playRecordTimeout = setTimeout(function() {
                question.isPlaying = false;
            }, record.duration * 1000);

        },
        stopPlayRecord: function() {

            /** 
             *  没有localId就返回，有就停止
             */

            var localId = record.localId;
            if (localId === '') {
                return ;
            }
            wx.stopVoice({
                localId: localId // 需要停止的音频的本地ID，由stopRecord接口获得
            });
            question.isPlaying = false;

        },
        togglePlayRecord: function() {
            
            /** 
             *  正在播放就停止
             *  不在播放就开始
             */

            if (question.isPlaying) {
                question.stopPlayRecord();
            } else {
                question.playRecord();
            }

        },
        checkAnswer: function() { // check answer and collect info for Collect

            /** 
             *  首先设置状态为正在做题，防御后退更改答案, 停止播放录音(执行呗，反正无害...)
             *  1. 如果为录音题, 做相关判断和统计
             *  2. 不是录音题
             *        如果没做，提示并停止检查
             *        做了检查对错, 做好相关统计，加入本地答案列表
             */

            // is doing the question
            avalon.vmodels.detail.isDoing = true;

            if (question.localAnswers.length >= question.currentId) {
                console.log("不可更改答案!");
                return;
            }
            question.isRecording && question.stopPlayRecord(); /* jshint ignore:line */
            var detailVM = avalon.getPureModel('detail');
            // if map3, collect info and push to the AudioCollect
            if (question.exercise && question.exercise.eType === 3) {
                question.stopRecord(); // checkAnswer click, means record must stop
                // do sth to check record or not
                // push and return. (id, answer)
                // mark!!! set the question.userAnswer!!!!!!!!!!!!
                var audioAnswer = question.userAnswer;
                if (audioAnswer === '') {
                    question.dropRecordQuestionConfirm();
                    return;
                } else {
                    question.right = true; // right it for next
                    alert(audioAnswer);
                    detailVM.audioAnswers.push({exerciseId: question.currentId, answer: audioAnswer});
                }
                
                //question.localAnswers.push(record.localId); // bug fix, also need push
                question.localAnswers.push( {localId: record.localId, duration: question.duration} ); // bug fix, also need push
                return;
            }
            if (question.userAnswer === '') {
                alert("请选择至少一个答案！"); 
                return; 
            }
            
            // update the right attr, question.right = null for default, 不是null说明这题做过了，直接显示答案（处理后退的）
            if ( question.exercise && (question.exercise.answer === question.userAnswer.trim()) ) {
                question.right = true;
                //alert("答对了");
            } else {
                question.right = false;
                //alert("答错了");
                // collect info and push to the wrongCollect
                var radioAnswer = question.userAnswer;
                //alert(radioAnswer);
                detailVM.wrongCollect.push({exerciseId: question.currentId, answer: radioAnswer});  
            }
            question.localAnswers.push(question.userAnswer); // old-bug, 20150731

        }, // checkAnswer end
        submit: function() {

            /** 
             *  通知父vm提交(父vm决定提交跳转逻辑，此处简化)
             */

            avalon.vmodels.detail.submit();

        },
        dropRecordQuestionConfirm: function() {
            var app = avalon.vmodels.app;
            if (!question.isDroped ) {

                app.showConfirm('是否放弃本录音题?');
                app.$watch('yesOrNo', function(value) {
                    if (value === true) {
                        question.right = true; // right it for next
                        // key!!! mark!!!
                        // avalon.vmodels.detail.$model.audioAnswers.push({exerciseId: question.currentId, answer: ''});
                        question.localAnswers.push({localId: '', duration: 0}); // bug fix, also need push
                        question.isDroped = true;
                        if (question.hasNext) {
                            question.next();
                        } else {
                            question.submit();
                        }
                    } else {
                        app.$unwatch("yesOrNo");
                        //avalon.router.go('app.detail.question', {homeworkId: question.homeworkId, questionId: question.currentId});
                    }
                });

            }
        }
    });

    var hasRequestRecordAuth= false; // 申请录音权限, do it only once, 非核心数据，不应该放在vm里!
    return avalon.controller(function($ctrl) {

        //var rootView = document.querySelector('.app');
        //var questionView = document.querySelector('.question');

        //var question_view_ani = local_question_view_ani || (avalon.illyGlobal && avalon.illyGlobal.question_view_ani); // question视图切换动画配置
        var detailModel = avalon.getPureModel('detail');
        var exercises = detailModel.exercises;

        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() { 

            if (avalon.vmodels.question.starter) {
                avalon.vmodels.detail.questionStartTime = Date.now(); 
                avalon.vmodels.question.starter = false; // 重置为true的时候只有到列表页,为了保险。
            }  

            var question = avalon.$('.question');
            var win_height = document.documentElement.clientHeight;
            var answerPanel = avalon.$('.answer-panel');
            setTimeout(function() {
                question && (question.style.height = win_height + 'px'); /* jshint ignore:line */
            }, 16);
            answerPanel && (answerPanel.style.left = '1px'); /* jshint ignore:line */
            setTimeout(function() {
                answerPanel && (answerPanel.style.left = '0'); /* jshint ignore:line */
            }, 1600);

        };
        // 进入视图, 对复用的数据进行重置或清空操作！
        // 一个重大的问题或者注意事项就是，恢复的顺序问题，很多数据都是有顺序依赖的
        $ctrl.$onEnter = function(params) {

            //question.starter = true; // 做题开始计时标记，使得开始仅执行一次
            question.isDroped = false;

            // 保证不需要执行时不执行且执行最多一次（执行过后不会再执行）
            if( !hasRequestRecordAuth ) {

                var needRequestAuth = avalon.vmodels.detail.exercises.some(function(item) { // bool
                    return item.eType === 3;
                });

                if ( needRequestAuth ) { // check audio auth earlier
                    wx.startRecord();
                    setTimeout(function() {
                        wx.stopRecord();
                    }, 2000); // 2 second, enough??? sucks... wx-sdk
                    hasRequestRecordAuth = true; // auth done and the only place this var change!!! key!!!
                }

            }

            question.currentId = params.questionId;
            
            //question.homeworkId = params.homeworkId !== "" ? params.homeworkId : 0; // yes, 直接从父vm属性中拿,这个不变的东西，不需要在此处动态获取！
            
            // questionId, 去取上级vm的exercises[questionId], 然后赋值给本ctrl的exercise，
            // 然后双向绑定，渲染
            var id = params.questionId - 1 || 0; // for strong, url中的questionId才用的是1开始，为了易读性
            question.exercise = exercises[id]; // yes

            // core! 双向绑定的同时还能恢复状态！ dom操作绝迹！ 20150730
            if (question.exercise.eType === 3) {
                var localAnswerObj = question.localAnswers[question.currentId - 1] || {localId: '', duration: 0};
                question.userAnswer = localAnswerObj.localId;
                question.duration = localAnswerObj.duration;

                // clear some record data
                record.startTime = '';
                record.endTime = '';
                record.localId = question.userAnswer;
                record.duration = question.duration;
                record.remainTimeTimer = null;
                question.isRecording = false;

            } else {
                question.userAnswer = question.localAnswers[question.currentId - 1] || '';
            }
            //question.userAnswer = question.localAnswers[question.currentId - 1] || '';

            // 重置题目对错标记
            question.right = (question.exercise.answer ===  question.userAnswer);

            // play record btn, 至少一定是后退才能看到
            if ( question.localAnswers.length < question.currentId ) {
                question.showPlayRecordBtn = false; 
            } else {
                question.showPlayRecordBtn = true;
            }

            question.total = avalon.vmodels.detail.exercises.length; // yes, must动态设置
            if (params.questionId < question.total) { // key! to next or submit
                question.hasNext = true;
            } else {
                question.hasNext = false;
            }

        }; // onEnter end
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("question.js onBeforeUnload fn");
            question.stopPlayRecord(); // 离开就应该停止播放，一种视图隔离
        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

