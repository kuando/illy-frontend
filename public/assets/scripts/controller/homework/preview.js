define([], function() {

    // review in 201507201010

	var local_question_view_ani = 'a-bounceinL';

	// 每一个具体的题目控制器
    var question = avalon.define({
		$id: "question",
		homeworkId: avalon.vmodels.detail.homeworkId, // 直接取
        exercise: {},
		total: avalon.vmodels.detail.exercises.length,
		currentId: 0, // current exerciseId, 当前题id
		localAnswers: [], // 本地保存本次作业当前所有做过的题的答案，length就是做到过哪一题了
		hasNext: false,
		userAnswer: '', // 忠实于用户答案
		right: null, // 做对与否, audio question is always right(Em~...)
		next: function() { // 点击进入下一题
			// 只处理页面跳转进入下一题
			avalon.router.go('app.detail.question', {homeworkId: question.homeworkId, questionId: question.currentId + 1});
		},
		checkAnswer: function() { // check answer and collect info for Collect
			if (question.localAnswers.length >= question.currentId) {
				console.error("不可更改答案!");
				return;
			}
			//avalon.log("check answer");
			var detailVM = avalon.getPureModel('detail');
			// if map3, collect info and push to the AudioCollect
			if (question.exercise.eType == 3) {
				// push and return. (id, answer)
				question.right = true; // right it for next
				// mark!!! set the question.userAnswer!!!!!!!!!!!!
				var audioAnswer = question.userAnswer;
				detailVM.audioAnswers.push({exerciseId: question.currentId, answer: audioAnswer});
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
			if (question.exercise.answer === question.userAnswer.trim()) {
				question.right = true;
				//avalon.log("答对了");
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
		},
		submit: function() {
			//avalon.log("question submit");
			// 1.通知父vm的submit方法发送统计数据， 
			// removed!!! 2.自身跳转至result页面, removed, put in detail submit success fn to go
			
			//avalon.vmodels.detail.submit();
			
			// 业务不同于作业，只需要提示做完，回到首页即可
			alert("恭喜你，完成了本次预习作业，继续努力，再接再厉哦！")
			avalon.router.go('app.list');
		}
	});

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
			// 进入视图加个动画，开启loading, rendered后loading消失, 根据初始化一个answers数组，均为false，长度为choices的长度
			//avalon.log("add ani");
			
			// temp
			//setTimeout(function() {
			//    rootView && rootView.classList.toggle(question_view_ani);
			//    questionView && questionView.classList.toggle(question_view_ani);
			//}, 66)
			
			question.right = null; // 重置题目对错标记
			//question.homeworkId = params.homeworkId !== "" ? params.homeworkId : 0; // yes, 直接从父vm属性中拿
			question.currentId = params.questionId;
			// questionId, 去取上级vm的exercises[questionId], 然后赋值给本ctrl的exercise，
			// 然后双向绑定，渲染
			var id = params.questionId - 1 || 0; // for strong, url中的questionId才用的是1开始，为了易读性
			question.exercise = exercises[id]; // yes
			//question.total = exercises.length; // yes, 直接设置
			if (params.questionId < question.total) { // key! to next or submit
				question.hasNext = true;
			} else {
				question.hasNext = false;
			}
			//avalon.log(params); 
			//avalon.log(question.exercise);
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
			//avalon.log("question.js onBeforeUnload fn");
		}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

