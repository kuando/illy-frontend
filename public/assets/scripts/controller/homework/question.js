define([], function() {

    var local_question_view_ani = 'a-bounceinL';
    var wx = avalon.wx;
    
    // 录音对象相关属性和方法, 因为wx的sdk方法都是独立作用域的回调，需要一个全局的存储对象
    var record = {
        startTime: 0,
        endTime: 0,
        localId: '',
        timeout: 'timeout',
        showTimeoutDelay: 49, // second, define when show the timeout
        recordTooShortTipsDelay: 1500,
        showTimeOutLayer: function() {
            // 给个遮罩， 10秒倒计时开始
            //alert("倒计时10秒！");
            var timeoutMask = avalon.$('timeout-mask');
            timeoutMask && timeoutMask.style.display = 'inline-block'; // show mask
            avalon.$('.isRecording').classList.add('timeout'); // change some ui for mask
            // time to show
            setTimeout(function() {
                timeoutMask.innerHTML = parseInt(timeoutMask.innerHTML, 10) - 1;
            }, 1000)
            // recover the ui when time enough
            setTimeout(function() {
                avalon.$('.isRecording').classList.remove('timeout');
            }, 11000); 
        },
        showTips: function() {
            avalon.$('.record-tips').style.display = 'inline-block';
        },
        hideTips: function() {
            avalon.$('.record-tips').style.display = 'none';
        }
    }; 

    // 每一个具体的题目控制器
    var question = avalon.define({
        $id: "question",
        homeworkId: avalon.vmodels.detail.homeworkId, // 直接取
        exercise: {},
        total: 0, // 直接取不行,fuck bug... waste much time... 201507222006
        currentId: 0, // current exerciseId, 当前题id
        localAnswers: [], // 本地保存本次作业当前所有做过的题的答案，length就是做到过哪一题了
        hasNext: false,
        userAnswer: '', // 忠实于用户答案
        right: null, // 做对与否, audio question is always right(Em~...)
        isRecording: false, // whether recording now, for ms-class 
        showPlayRecordBtn: false,
        next: function() { // 点击进入下一题
            // 只处理页面跳转进入下一题
            avalon.router.go('app.detail.question', {homeworkId: question.homeworkId, questionId: question.currentId + 1});
        },
        startRecord: function() {
            wx.startRecord();
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
            })
            // 同时设置ui来提示快到时间了
            record.timeout = setTimeout(function() {
                record.showTimeOutLayer();
            }, record.showTimeoutDelay) // 49秒
        },
        stopRecord: function() {
            question.isRecording = false;
            // 能到这一步就该先清理ui上的倒计时，再统计时间来做相应操作
            record.timeout && clearTimeout(record.timeout); // for strong
            var endTime = Date.now();
            record.endTime = endTime;
            var duration = ( record.endTime - record.startTime ) / 1000; // 间隔时间， 单位秒 
            if (duration < 5) { // 小于五秒
                // alert('对不起，录制时间过短，请重新录制！'); // ios 点击穿透bug... fuck
                record.showTips();
                setTimeout(function() {
                    record.hideTips();
                }, record.recordTooShortTipsDelay)
                wx.stopRecord({
                    // do nothing, just stop, fix bug
                });
            } else { // 正常结束，取结果, 1号获取路径
                wx.stopRecord({
                    success: function(res) {
                        var localId = res.localId;
                        record.localId = localId;
                        question.uploadRecord();
                        question.showPlayRecordBtn = true;
                    }
                })
            }
        },
        playRecord: function() {
            var localId = record.localId;
            if (localId == '') {
                alert("录制不成功，请重试！");
                console.log('no localId');
                //console.log(record);
                return ;
            }
            wx.playVoice({
                localId: localId
            });
        },
        uploadRecord: function() {
            var localId = record.localId;
            if (localId == '') {
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
                }
            })
        },
        checkAnswer: function() { // check answer and collect info for Collect
            if (question.localAnswers.length >= question.currentId) {
                console.log("不可更改答案!");
                return;
            }
            //avalon.log("check answer");
            var detailVM = avalon.getPureModel('detail');
            // if map3, collect info and push to the AudioCollect
            if (question.exercise && question.exercise.eType == 3) {
                question.stopRecord(); // checkAnswer click, means record must stop
                // do sth to check record or not
                // push and return. (id, answer)
                question.right = true; // right it for next
                // mark!!! set the question.userAnswer!!!!!!!!!!!!
                var audioAnswer = question.userAnswer;
                detailVM.audioAnswers.push({exerciseId: question.currentId, answer: audioAnswer});
                question.localAnswers.push(audioAnswer); // bug fix, also need push
                return;
            }
            var answers = document.querySelectorAll('.question input[type="radio"]');
            for (var i = 0, len = answers.length; i < len; i++) {
                if (answers[i].checked) {
                    question.userAnswer = answers[i].getAttribute('data-answer');
                    break;
                }
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
            question.localAnswers.push(question.userAnswer);
            //avalon.log(question.localAnswers);
        }, // checkAnswer end
        submit: function() {
            //avalon.log("question submit");
            // 1.通知父vm的submit方法发送统计数据， 
            // removed!!! 2.自身跳转至result页面, removed, put in detail submit success fn to go
            avalon.vmodels.detail.submit();
            //avalon.router.go('app.detail.result', {homeworkId: question.homeworkId});
        } // submit end
    });


    var requestAuth = false; // 申请录音权限, do it only once
    return avalon.controller(function($ctrl) {

        var rootView = document.querySelector('.app');
        var questionView = document.querySelector('.question');

        var question_view_ani = local_question_view_ani || (avalon.illyGlobal && avalon.illyGlobal.question_view_ani); // question视图切换动画配置
        var detailModel = avalon.getPureModel('detail');
        var exercises = detailModel.exercises;

        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            question.userAnswer = ''; // 重置用户答案为空，防止影响下一题
            // clear local record
            record.startTime = '';
            record.endTime = '';
            record.localId = '';

            question.showPlayRecordBtn = false;
            
            // 过场动画
            //setTimeout(function() {
            //    rootView && rootView.classList.toggle(question_view_ani);
            //    questionView && questionView.classList.toggle(question_view_ani);
            //}, 16)
            
            question.right = null; // 重置题目对错标记
            //question.homeworkId = params.homeworkId !== "" ? params.homeworkId : 0; // yes, 直接从父vm属性中拿
            question.currentId = params.questionId;
            // questionId, 去取上级vm的exercises[questionId], 然后赋值给本ctrl的exercise，
            // 然后双向绑定，渲染
            var id = params.questionId - 1 || 0; // for strong, url中的questionId才用的是1开始，为了易读性
            question.exercise = exercises[id]; // yes
            question.total = avalon.vmodels.detail.exercises.length; // yes, must动态设置
            if (params.questionId < question.total) { // key! to next or submit
                question.hasNext = true;
            } else {
                question.hasNext = false;
            }
            //avalon.log(params); 
            //avalon.log(question.exercise);
            if (!requestAuth) {
                wx.startRecord();
                wx.stopRecord();
                requestAuth = true; // auth done
            }
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("question.js onBeforeUnload fn");
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

