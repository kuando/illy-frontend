define(['./lib/mmRouter/mmState', './http'], function() {

	//================= main to bootstrap the app =======================//

	/* global set start */
	
	// global view change animation, animation.css
	var g_viewload_animation = "a-bounceinR"; 

	// get the token and ready to cache
	var token = localStorage.getItem('illy-token') || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcGVuaWQiOiJvUDNYQ3ZqY1VjTUJ1UmVxUkNaUjNEeFY3bVpBIiwiX2lkIjoiNTU2NDRmZjczYTJlMGZlYTI5OTk0ODEwIiwic2Nob29sSWQiOiI1NTYzZWJiNGJkZTU2ZWYyNmQ5N2UzZDMiLCJpYXQiOjE0MzY0OTk3MTd9.IK7vohL_Sc2zTJRPZJJ7uAMHoouBdQ06qCY_sfWz6Vw';

	// global apiBaseUrl
	var apiBaseUrl = 'http://api.hizuoye.com';

	// avalon global cache stuff when app init
	avalon.illyGlobal = {

		viewani    : g_viewload_animation,

		token      : token,

		apiBaseUrl : apiBaseUrl,

		question_view_ani: 'a-bounceinL'

	}

	// avalon global static method, get vm-object with vm-name
	avalon.getVM = function(vm) {
		return avalon.vmodels[vm];
	}

	// avalon global static method, get pure $model for server
	avalon.getPureModel = function(vm) {
		return avalon.vmodels && avalon.vmodels[vm] && avalon.vmodels[vm].$model; // for strong
	}

	/* global set end */

	// 定义一个顶层的vmodel，用来放置全局共享数据
	var root = avalon.define({
		$id: "root",
		currentPage: "",
		canBack: this.currentPage !== "index" ? true : false, // whether back btn show in the common header
		title: "" // 每一页action bar的标题	
	});

	/* router start */


	// 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
	avalon.state("site", { // site.js这个控制器接管整个应用控制权
		url: "/",
		abstract: true, // 抽象状态，不会对应到url上, 会立即绘制index这个view
		views: {
			"splash@": {
				templateUrl: "assets/template/splash.html", // 指定模板地址
			},
			"loading@": {
				templateUrl: "assets/template/loading.html", // 指定模板地址
			},
			"header@": {
				templateUrl: "assets/template/microsite/header.html", // 指定模板地址
			},
			"": {
				templateUrl: "assets/template/microsite/site.html", // 指定模板地址
				controllerUrl: "scripts/controller/microsite/site.js", // 指定控制器地址
			},
			"footer@": { // 视图名字的语法请仔细查阅文档
				templateUrl: "assets/template/footer.html", // 指定模板地址
			}
		}
	})
	.state("site.index", { // 定义一个子状态，对应url是 
		url: "", // "/" will make error, 就没这个页面了
		views: {
			"": {
				templateUrl: "assets/template/microsite/index.html", // 指定模板地址
				controllerUrl: "scripts/controller/microsite/index.js", // 指定控制器地址
				ignoreChange: function(changeType) {
					return !!changeType;
				} // url通过{}配置的参数变量发生变化的时候是否通过innerHTML重刷ms-view内的DOM，默认会，如果你做的是翻页这种应用，建议使用例子内的配置，把数据更新到vmodel上即可
			}
		},
		onBeforeEnter: function() { // return false则退出整个状态机，且总config报onError错误，打印错误信息
			//avalon.log("site.index onBeforeEnter fn");
			//return false;
			// 加入一个淡入的class，营造进场效果 
		},
		onBeforeExit: function() { // return false则退出整个状态机，且总config报onError错误，打印错误信息
			//avalon.log("site.index onBeforeExit fn");
			//return false;
			//document.querySelector('[avalonctrl="index"]').style.backgroundColor = "red";
			// 加入一个淡出的class，营造出场的效果
		}
	})
	.state("site.list", { // 定义一个子状态，对应url是 /{categoryId}，比如/1，/2
		url: "{categoryId}",
		views: {
			"": {
				templateUrl: "assets/template/microsite/list.html", // 指定模板地址
				controllerUrl: "scripts/controller/microsite/list.js", // 指定控制器地址
				ignoreChange: function(changeType) { 
					return !!changeType;
				} // url通过{}配置的参数变量发生变化的时候是否通过innerHTML重刷ms-view内的DOM，默认会，如果你做的是翻页这种应用，建议使用例子内的配置，把数据更新到vmodel上即可
			}
		}
	})
	.state("site.detail", { // 定义一个子状态，对应url是 /detail/{articleId}，比如/detail/1, /detail/2
		url: "detail/{articleId}",
		views: {
			"": {
				templateUrl: "assets/template/microsite/detail.html", // 指定模板地址
				controllerUrl: "scripts/controller/microsite/detail.js", // 指定控制器地址
			}
		}
	})

    /*
     *  @interface avalon.state.config 全局配置
     *  @param {Object} config 配置对象
     *  @param {Function} config.onBeforeUnload 开始切前的回调，this指向router对象，第一个参数是fromState，第二个参数是toState，return false可以用来阻止切换进行
     *  @param {Function} config.onAbort onBeforeUnload return false之后，触发的回调，this指向mmState对象，参数同onBeforeUnload
     *  @param {Function} config.onUnload url切换时候触发，this指向mmState对象，参数同onBeforeUnload
     *  @param {Function} config.onBegin  开始切换的回调，this指向mmState对象，参数同onBeforeUnload，如果配置了onBegin，则忽略begin
     *  @param {Function} config.onLoad 切换完成并成功，this指向mmState对象，参数同onBeforeUnload
     *  @param {Function} config.onViewEnter 视图插入动画函数，有一个默认效果
     *  @param {Node} config.onViewEnter.arguments[0] 新视图节点
     *  @param {Node} config.onViewEnter.arguments[1] 旧的节点
     *  @param {Function} config.onError 出错的回调，this指向对应的state，第一个参数是一个object，object.type表示出错的类型，比如view表示加载出错，object.name则对应出错的view name，object.xhr则是当使用默认模板加载器的时候的httpRequest对象，第二个参数是对应的state
    */

    // 缓存访问过得页面，为了更好的loading体验，性能嘛? 先mark一下!!!
	var cache = [];
	avalon.state.config({ // common callback, every view renderd will listenTo and do something.
		onError: function() {
			avalon.log("Error!, Redirect to index!", arguments);
			avalon.router.go("site.index", function() {
				avalon.log("Error!, Redirect to index!");
			});
		}, // 打开错误配置
		onBeforeUnload: function() {
			// avalon.log("0 onBeforeUnload" + arguments);
		},
		onUnload: function() { 
			// avalon.log("1 onUnload" + arguments);
		},
		onBegin: function() {
			// avalon.log("2 onBegin" + root.currentPage);
			// 缓存来过的页面，不再显示loader
			var pageId = location.href.split("!")[1];
			cache.push(pageId);
			var loader = document.getElementById('loader');
			var visited = false;
			var curid = location.href.split("!")[1];
			for (var i = 0, len = cache.length - 1; i < len; i++) { // last one must be the current href, so not included(length - 1)
				if (cache[i] === curid) {
					visited = true;
				}
			}
			if (loader && !visited) { // 存在loader并且为未访问过得页面则show loader
				loader.style.display = '';
			}
		},
		onLoad: function() { 
			// avalon.log("3 onLoad" + root.currentPage);
			root.currentPage = mmState.currentState.stateName.split(".")[1];
			var loader = document.getElementById('loader');
			setTimeout(function() {
				loader && (loader.style.display = 'none'); // for strong, need ()
			}, 200);
		    var view = document.querySelector('[avalonctrl='+ root.currentPage + ']');
			view && view.classList.add(g_viewload_animation); // for strong
		},
		onViewEnter: function(newNode, oldNode) {
			//avalon(oldNode).animate({
			//    marginLeft: "-100%"
			//}, 500, "easein", function() {
			//    oldNode.parentNode && oldNode.parentNode.removeChild(oldNode)
			//})
			// alert(1);
		} // 不建议使用动画，因此实际使用的时候，最好去掉onViewEnter和ms-view元素上的oni-mmRouter-slide
	});

	/* router end */

	return {
		init: function() { // init and bootstrap site
			avalon.log("init to rendered the page");
			avalon.history.start({
				// basepath: "/mmRouter",
				fireAnchor: false
			});
			//go!!!!!!!!!
			avalon.scan();
		}
	}

});

