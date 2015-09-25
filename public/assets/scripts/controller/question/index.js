define([], function() {
 
    // get config
    //var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;
    //var token = avalon.illyGlobal.token;
    var wx = avalon.wx;

    var index = avalon.define({
        $id: "index",
        visited: false, // first in, no cache
        localImgSrc: '',  // 获取用户所拍题目图片(本地)
        serverId: '',  // 获取用户所拍题目图片(微信官方服务器对应资源)
        openCamera: function() {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    index.localImgSrc = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                    wx.uploadImage({
                        localId: '', // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                            index.serverId = res.serverId; // 返回图片的服务器端ID
                            // todo: uploadImageToServer with api
                        }
                    });

                    // temp demo
                    location.hash = '#!/form';
                    // avalon.router.go('index.form');
                }
            });
        }
    });

    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {

            index.visited = avalon.vmodels.root.currentIsVisited;
            // index.fetchRemoteData();
            
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

