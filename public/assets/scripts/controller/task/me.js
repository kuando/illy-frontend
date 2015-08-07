define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com/api/v1/';
    var token = avalon.illyGlobal.token;

    // 获取全局wx-sdk接口
    var wx = avalon.wx;

    // prefix of localStorage
    //var cachedPrefix = 'illy-task-article-';
    
    // prefix of resource
    var resourcePrefix = 'http://resource.hizuoye.com/';
    
    // avatar manage
    var avatar = {
        localId: '',
        serverId: ''
    }
    
    var me = avalon.define({
        $id: "me",
        hasEdited: false,
        editing: false,
        copyOfJSON: '',
        username: '',
        displayName: '',
        gender: '',
        phone: '',
        parend: '',
        avatar: '',
        onSchool: '',
        grade: '',
        finishedHomeworkCount: '',
        finishedPreviewsCount: '',
        fetchData: function() {
            //if (me.visited) {
            //    return; // core!!! key!!! forget this will getCache and request!!!
            //}
            $http.ajax({
                url: apiBaseUrl + "profile",
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    me.copyOfJSON = json;
                    me.setVM(json);
                }
            })
       },
       chooseImage: function() {
           wx.chooseImage({
               count: 1, // 默认9
               sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
               sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
               success: function (res) {
                   var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                   avatar.localId = localIds && localIds[0];
                   alert('choose ' + localIds.length + ' images!');
                   me.avatar = avatar.localId; // change it now 
                   me.uploadImage();
               }
           });
       },
       uploadImage: function() {
           wx.uploadImage({
               localId: avatar.localId, // 需要上传的图片的本地ID，由chooseImage接口获得
               isShowProgressTips: 1, // 默认为1，显示进度提示
               success: function (res) {
                   var serverId = res.serverId; // 返回图片的服务器端ID
                   avatar.serverId = serverId;
               }
           });
       },
       toggleEditState: function() {
           me.hasEdited = true;
           if (me.editing === true) {
               me.editing = false;
           } else {
               me.editing = true;
           }
       },
       setVM: function(source) {
           me.username = source.username;
           me.displayName = source.displayName;
           me.gender = source.gender;
           me.phone = source.phone;
           me.parend = source.parent;
           me.avatar = resourcePrefix + source.avatar;
           me.onSchool = source.onSchool;
           me.grade = source.grade;
           me.finishedHomeworkCount = source.finishedHomeworkCount;
           me.finishedPreviewsCount = source.finishedPreviewsCount;
       },
       resetAll: function() {
           me.setVM(me.copyOfJSON);
       }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {

            me.fetchData();

        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

