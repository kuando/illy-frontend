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
        defaultFullUrl: '',
        localId: '',
        serverId: ''
    }

    var me = avalon.define({
        $id: "me",
        infoProfile: ['displayName', 'gender', 'phone', 'parent', 'onSchool', 'grade'],
        editing: false,
        copyProfile: '',
        username: '',
        displayName: '',
        gender: '',
        phone: '',
        parent: '',
        avatar: '',
        onSchool: '',
        grade: '',
        finishedHomeworkCount: '',
        finishedPreviewsCount: '',
        //infoCollect: {
        //    'displayName': '',
        //    'gender': '',
        //    'phone': '',
        //    'parent': '',
        //    'onSchool': '',
        //    'grade': ''
        //},
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
                    me.copyProfile = json;
                    me.setVM(json, true);
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
                    //alert('choose ' + localIds.length + ' images!');
                    me.uploadImage();
                    me.avatar = avatar.localId; // change it now 
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
            if (me.editing === true) {
                me.editing = false;
            } else {
                me.editing = true;
            }
        },
        setVM: function(source, avatar) {
            if (avatar != false) avatar = true; // default
            me.username = source.username;
            me.displayName = source.displayName;
            me.gender = source.gender;
            me.phone = source.phone;
            me.parent = source.parent;
            if (avatar) {
                if (source.avatar != void 0) {
                    me.avatar = resourcePrefix + source.avatar;
                } else {
                    me.avatar = avatar.defaultFullUrl; // default avatar of user
                }
            }
            me.onSchool = source.onSchool;
            me.grade = source.grade;
            me.finishedHomeworkCount = source.finishedHomeworkCount;
            me.finishedPreviewsCount = source.finishedPreviewsCount;
        },
        resetAll: function() {
            me.setVM(me.copyProfile, false);
        },
        hasDiff: function() {
            var diff = me.infoProfile.every(function(item) {
                return me[item] === me.copyProfile[item];
            })
            return !diff;
        },
        updateProfile: function() {
            $http.ajax({
                method: 'PUT',
                url: apiBaseUrl + 'profile',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: {
                    displayName: me.displayName,
                    gender: me.gender,
                    phone: me.phone,
                    parent: me.parent,
                    onSchool: me.onSchool,
                    grade: me.grade
                },
                success: function(res) {

                },
                error: function(res) {
                    alert('对不起，账户信息更新失败...');
                    me.resetAll(); // 回滚页面ui中账户信息，做到更新失败的回滚
                },
                ajaxFail: function(res) {
                    alert('对不起，账户信息更新失败...');
                    me.resetAll(); // 回滚页面ui中账户信息，做到更新失败的回滚
                }
            })
        },
        save: function() { // diff will update and no-diff will just local save
            if(me.hasDiff()) {
                me.updateProfile();
            }
        }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        }
        // 进入视图
        $ctrl.$onEnter = function(params) {
            avatar.localId = '';
            avatar.serverId = '';
            me.fetchData();
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concact(DOM树上下文vmodels)
        $ctrl.$vmodels = []
    });

});

