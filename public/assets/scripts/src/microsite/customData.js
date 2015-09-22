// ==================== custom project data start @include ==================== //

    token = token || localStorage.getItem('illy-token-microsite'); // just for microsite
    if (token === null) {
        alert("对不起，本系统仅供内部使用！ ERROR::no token error!");
        setTimeout(function() {
            location.replace('./login.html');
        }, 0);
    }

    // avalon global stuff when app init
    avalon.illyGlobal = {

        viewani    : global_viewload_animation_name,
        token      : token,
        apiBaseUrl : apiBaseUrl,
        illyDomain : illy_domain,
        imagesBaseSrc: illy_images_base_src

    };

    // 定义一个顶层的vmodel，用来放置全局共享数据
    var root = avalon.define({
        $id: "root",
        namespace: 'microsite',
        currentState: "", // spec-stateName
        currentAction: "",
        currentIsVisited: false, // useful for most child view
        currentRendered: false,
        title: "", // 每一页action bar的标题   
        footerInfo: 'kuando Inc',
        back: function() {
            history.go(-1);
        }
    });

    // ==================== custom project data end @include ==================== //
