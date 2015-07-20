define([], function() {
    // review in 201507201010

	var limit = 9; // 一次抓取多少数据

	var token = avalon.illyGlobal.token;
	if (!token) {
		alert("no token error");
		return;
	}
	var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com';

    var list = avalon.define({
		$id: "list",
        homework: [], // 作业数据
		previews: [], // 预习数据
        offset: 0, // inner var, to fetch data with offset and limit
		fetchData: function(type) {
			$http.ajax({
				method: "",
				//url: "api/list.json?limit=6",
				url: apiBaseUrl + "/api/v1/" + type,
				data: {
					//offset: list.offset
					//limit: 6
				},
				beforeSend: function(xhr) {

				},
				headers: {
					'Authorization': 'Bearer ' + token
				},
				dataType: "json",
				success: function(lists) {
					list[type] = lists; //key ! fetch data
				},
				error: function(res) {
					console.error("list.js ajax error" + res);
				},
				ajaxFail: function(res) {
					console.error("list.js ajaxFail" + res);
				}
			})
		} // end of fetchData

		//,isLoading: false, 

		//showMore: function(e) {
		//    e.preventDefault();
		//    var page = 2; // page 2
		//    list.offset = list.offset + limit * (page - 1); // update the offset
		//    // fetch more data for the page
		//    $http.ajax({
		//        method: "",
		//        //url: "api/list.json",
		//        url: apiBaseUrl + "/api/v1/homework",
		//        data: {
		//            //offset: 6,
		//            offset: list.offset
		//            //limit: 6
		//        },
		//        beforeSend: function(xhr) {

		//        },
		//        headers: {
		//            'Authorization': 'Bearer ' + token
		//        },
		//        dataType: "json",
		//        success: function(res) { // success and add some view ani
		//            //avalon.log("list.js ajax success" + res);
		//            list.lists = list.lists.concat(res);
		//            document.body.classList.remove('a-bounceinT');
		//            setTimeout(function() {
		//                document.body.classList.add('a-bounceinT');
		//            }, 1)
		//        },
		//        error: function(res) {
		//            alert("list.js ajax error");
		//            console.log("ajax error" + res);
		//        },
		//        ajaxFail: function(res) {
		//            console.log("ajaxFail" + res);
		//        }
		//    })
		//}
    });

    return avalon.controller(function($ctrl) {
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            //avalon.log("leave list");
        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
			// remove cache in detail ctrl
			
			list.fetchData('homework');
			list.fetchData('previews');
        }
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

		}
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });
});

