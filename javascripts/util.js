(function() {
  var Util;

  Util = (function() {
    var pix2int;

    function Util() {}

    Util.prototype.urlToBlob = function(url, callback) {
      var xhr;

      xhr = new XMLHttpRequest;
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function(e) {
        var arrayBufferView, blob;

        arrayBufferView = new Uint8Array(this.response);
        blob = new Blob([arrayBufferView], {
          type: 'image/png'
        });
        return callback(blob);
      };
      return xhr.send();
    };

    Util.prototype.getBackgroundSize = function(string) {
      var size;

      size = string.split(' ');
      return [pix2int(size[0]), pix2int(size[1])];
    };

    Util.prototype.getBackgroundPosition = function(string) {
      var position;

      position = string.split(' ');
      return [pix2int(position[0]), pix2int(position[1])];
    };

    Util.prototype.getBackgroundCenterPoint = function(size, position) {
      return [size[0] * 0.5 + position[0], size[1] * 0.5 + position[1]];
    };

    Util.prototype.getImgSize = function(src) {
      var newImg;

      newImg = new Image();
      newImg.src = src;
      return [newImg.width, newImg.height];
    };

    Util.prototype.getBackgroundImageUrl = function(element) {
      var url;

      url = element.css('background-image');
      return url.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    };

    pix2int = function(string) {
      return parseFloat(string.replace('px', ''));
    };

    Util.prototype.uploadBase64 = function(base64, callback) {
      var endpoing, w;

      endpoing = "http://iing.tw/badges.json";
      w = window.open("/waiting.html", "wait", "width=500, height=500, menubar=no, resizable=no, scrollbars=no, status=no, titlebar=no, toolbar=no");
      return $.post(endpoing, {
        data: base64
      }, function(result) {
        return callback(result.url, w);
      });
    };

    return Util;

  })();

  window.$util = new Util();

  window.xx = function(v) {
    return console.log(v);
  };

}).call(this);
