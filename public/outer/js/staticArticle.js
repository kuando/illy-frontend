// get config
var apiBaseUrl = 'http://api.hizuoye.com/api/v1/';

alert(location.href);

var article = avalon.define({
    $id: "article",
    articleId: location.href.split('=')[1],
    title: "",
    content: "",
    created: "2015-07-09",
    shareCount: 88,
    visitCount: 88,
    likeCount: 88,

    isShared: false,
    updateShare: function() {
        $http.ajax({
            method: 'PUT',
            url: apiBaseUrl + 'public/posts/' + article.articleId + '/share',
            success: function() {

            },
            error: function(res) {
                console.log(res);
            },
            ajaxFail: function(res) {
                console.log(res);
            }
        });
    },

    hasLiked: false,
    updateLike: function() {
        $http.ajax({
            method: 'PUT',
            url: apiBaseUrl + 'public/posts/' + article.articleId + '/like',
            success: function() {
                var likeCount = article.likeCount || 0;
                article.likeCount = ++likeCount;
            },
            error: function(res) {
                console.log(res);
            },
            ajaxFail: function(res) {
                console.log(res);
            }
        });
    },
    like: function() {
        // http 
        article.updateLike();
        // ui
        article.hasLiked = true;
    },

    fetchData: function() {
        $http.ajax({
            url: apiBaseUrl + "public/posts/" + article.articleId,
            success: function(json) {
                article.title = json.title;
                article.content = json.content;
                article.created = json.created;
                article.shareCount = json.shareCount;
                article.visitCount = json.visitCount;
                article.likeCount = json.like || 0;

                wx.onMenuShareTimeline({
                    title: article.title, // 分享标题
                    link: '', // 分享链接
                    imgUrl: document.getElementsByTagName('img')[0].src, // 分享图标
                    success: function () { 
                        // 不管成功与否，前台界面至少先更新
                        article.shareCount++;
                        article.isShared = true;
                        article.updateShare();
                    },
                    cancel: function () { 
                        alert('差一点就分享成功了!');
                    }
                });

            }
        });
    } // fetch data end
});

article.fetchData();

