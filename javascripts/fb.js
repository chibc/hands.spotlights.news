(function() {
  var Facebook;

  window.$fb = {
    token: null,
    userID: null,
    picture: null,
    perms: "public_profile,user_photos",
    appId: '267188576687915',
    afterLogin: function(response) {
      $fb.token = response.authResponse.accessToken;
      $fb.userID = response.authResponse.userID;
      $facebook.getUserPicture();
      return $('body').addClass('fb-connected');
    },
    notLogin: function() {
      return $('body').addClass('no-fb');
    },
    beforeGetLoginStatus: function() {
      return $('body').addClass('fb-get-login-status');
    },
    afterGetLoginStatus: function() {
      return $('body').removeClass('fb-get-login-status');
    },
    beforeUserPictureLoaded: function() {
      return $('body').addClass('fb-get-picture');
    },
    afterUserPictureLoaded: function() {
      return $('body').removeClass('fb-get-picture');
    }
  };

  (function(d, s, id) {
    var fjs, js;

    js = void 0;
    fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/zh_TW/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'fb-root');

  window.fbAsyncInit = function() {
    FB.init({
      appId: $fb.appId,
      cookie: true,
      xfbml: true,
      version: 'v2.5'
    });
    $facebook.getLoginStatus();
    $('.js-fb-login').on('click', function() {
      return $facebook.dialogLogin(function() {
        return $facebook.getLoginStatus();
      });
    });
    return $('.js-fb-upload').on('click', function() {
      if ($fb.token) {
        return $facebook.uploadPicture();
      } else {
        return $facebook.dialogLogin(function() {
          return $facebook.getLoginStatus();
        });
      }
    });
  };

  Facebook = (function() {
    function Facebook() {}

    Facebook.prototype.getUserPicture = function() {
      var url;

      $fb.beforeUserPictureLoaded();
      url = "/" + $fb.userID + "/picture?width=500&height=500";
      return FB.api(url, function(result) {
        $fb.picture = result.data.url;
        return $util.urlToBlob($fb.picture, function(blob) {
          loadImage([blob]);
          return $fb.afterUserPictureLoaded();
        });
      });
    };

    Facebook.prototype.getLoginStatus = function() {
      $fb.beforeGetLoginStatus();
      return FB.getLoginStatus(function(response) {
        var status;

        status = response.status;
        if (status === 'connected') {
          $fb.afterLogin(response);
        } else if (status === 'not_authorized') {
          $fb.notLogin();
        } else {
          $fb.notLogin();
        }
        return $fb.afterGetLoginStatus();
      });
    };

    Facebook.prototype.dialogLogin = function(callback) {
      return FB.login((function(response) {
        callback(response);
        return xx(response);
      }), {
        scope: $fb.perms
      });
    };

    Facebook.prototype.uploadPicture = function() {
      var endpoing;

      endpoing = "http://staging.iing.tw/badges.json";
      return $.post(endpoing, {
        data: getBase64()
      }, function(result) {
        return FB.api('/me/photos', 'post', {
          access_token: $fb.token,
          url: result.url,
          caption: "http://iing.tw"
        }, function(response) {
          var url;

          if (response.id) {
            url = "https://m.facebook.com/photo.php?fbid=" + response.id + "&prof=1";
            return window.open(url, "", "width=550, height=460, menubar=no, resizable=no, scrollbars=no, status=no, titlebar=no, toolbar=no");
          }
        });
      });
    };

    return Facebook;

  })();

  window.$facebook = new Facebook();

}).call(this);
