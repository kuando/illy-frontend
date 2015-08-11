define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com/api/v1/';
    var token = avalon.illyGlobal && avalon.illyGlobal.token;
    
    var rank = avalon.define({
        $id: "rank",
        ranks: [],
        myScore: 0,
        myRank: 0,
        displayName: '',
        avatar: ''
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 进入视图
        $ctrl.$onEnter = function(params) { /* jshint ignore:line */
            $http.ajax({
                url: apiBaseUrl + 'score/rank/me',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function(res) {
                    rank.displayName = res.displayName;
                    rank.avatar = res.avatar;
                    rank.myRanks = res.rank;
                    rank.myScore = res.score;
                },
                error: function(res) {
                    console.log('rank ajax error!' + res);
                },
                ajaxFail: function(res) {
                    console.log('rank ajax ajaxFail!' + res);
                }
            });
            $http.ajax({
                url: apiBaseUrl + 'score/rank/topTen',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                success: function(res) {
                    rank.ranks = res;
                },
                error: function(res) {
                    console.log('rank ajax error!' + res);
                },
                ajaxFail: function(res) {
                    console.log('rank ajax ajaxFail!' + res);
                }
            });
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

