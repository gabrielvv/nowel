"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// $("h1").lettering();

//https://stackoverflow.com/questions/4617638/detect-ipad-users-using-jquery
var isIpad = navigator.userAgent.match(/iPad/i) != null;

var hideKeyboard = function hideKeyboard() {
  document.activeElement.blur();
  $("input").blur();
};

var target = location.href.split("/").pop();
console.log("target=", target);
var inputs = document.getElementsByTagName("input");
Array.prototype.forEach.call(inputs, function (inp) {
  inp.addEventListener("input", function () {
    console.log("change", inp.value);
    var code = Array.prototype.reduce.call(inputs, function (a, b) {
      return a + b.value;
    }, "");
    console.log("code", code);
    var targetCode = target.includes("lulu") ? "5P8C9TJC" : target.includes("marianne") ? "HOHOHOHO" : /* agnes */"HISTOIRE";
    if (code.toLowerCase() == targetCode.toLowerCase()) {
      document.getElementById("overlay").className += "out";
      hideKeyboard();
    }
  });
});

// document.getElementById("entrer").addEventListener("click", ()=>{
//   console.log("entrer")
//   document.getElementById("overlay").className += " out";
// })

var backgroundPlayer = undefined,
    assetsLoaded = false,
    assetsCount = /* svg */16 + /* sounds */13,
    assetsCounter = 0;
var newAssetLoaded = function newAssetLoaded() {
  return assetsLoaded = ++assetsCounter == assetsCount;
};

var Song = function () {
  function Song(chain, kdo) {
    _classCallCheck(this, Song);

    this.length = chain.length;
    this.complete = false;
    this.ids = chain;
    this.last = undefined;
    this.kdo = kdo;
  }

  _createClass(Song, [{
    key: "onSuccess",
    value: function onSuccess(samplePlayer) {
      this.complete = true;
      console.log("COMPLETE");
      // samplePlayer.on("complete", function(){
      //   document.getElementById("kdo").click()
      // })

      if (this.kdo) {
        /**
        * /!\ Le scaling svg ne marche pas sur Safari
        *
        *
        */

        this.kdo.node.style.zIndex = 99;
        var W = $(this.kdo.node).width();
        $(this.kdo.node).css({ width: W * 25 });
        $(this.kdo.node).addClass("scale-up");
        if (target.includes("lulu")) {
          // this.kdo.animate({
          //   transform: "t0,-400s25,25,0,0"
          // }, 5000);
          // this.kdo.animate({
          //   transform: "t-900,500s1,1,0,0"
          // }, 5000);
          // $(this.kdo.node).css({bottom: "-500px", left: "-45%"})
        } else if (target.includes("marianne")) {
          // this.kdo.animate({
          //   transform: "t-2100,1300s1,1,0,0"
          // }, 5000);
          // this.kdo.animate({
          //   transform: "t-250,-500s25,25,0,0"
          // }, 5000);
        } else {
            // this.kdo.animate({
            //   transform: "t2700,500s1,1,0,0"
            // }, 5000);
            // this.kdo.animate({
            //   transform: "t800,-1300s25,25,0,0"
            // }, 5000);
          }
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.complete = false;
      this.last = undefined;
      document.getElementById("progress").style.width = 0;
      this.kdo && this.kdo.attr({ transform: "t0,0s1,1,0,0" });
    }
  }, {
    key: "trigger",
    value: function trigger(soundID) {
      displayMusic();
      if ("number" == typeof soundID) soundID = this.ids[soundID];

      var samplePlayer = Song.playSound(soundID);

      if (this.complete) return;
      var i = this.ids.indexOf(soundID);
      console.log(soundID, i, this.last);
      if (i == 0) {
        this.last = 0;
      } else {
        if (i == this.last + 1) {
          ++this.last;
        } else {
          this.last = undefined;
          document.getElementById("progress").style.width = 0;
        }
      }
      var factor = (this.last == undefined ? -1 : this.last) + 1;
      document.getElementById("progress").style.width = factor / this.length * 100 + "%";
      console.log("after", i, this.last);
      if (this.length - 1 == this.last) this.onSuccess(samplePlayer);
    }
  }], [{
    key: "playSound",
    value: function playSound(soundID) {
      var interrupt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!backgroundPlayer) return;
      if (interrupt) backgroundPlayer.volume = 0;
      var samplePlayer = createjs.Sound.play(soundID);
      samplePlayer.on("complete", function () {
        setTimeout(function () {
          backgroundPlayer.volume = 0.05;
        });
      }, 500);
      return samplePlayer;
    }
  }]);

  return Song;
}();

var songs = {
  "ppn": new Song(["ppn_final_0", "ppn_final_1", "ppn_final_2", "ppn_final_3", "ppn_final_4"]),
  "noel": new Song(["noel_0", "noel_1", "noel_2", "noel_3"]),
  "santons": new Song(["pasto_0", "pasto_1", "pasto_2"]),
  soundIDs: function soundIDs() {
    return [].concat(_toConsumableArray(this.noel.ids), _toConsumableArray(this.ppn.ids), _toConsumableArray(this.santons.ids));
  },
  reset: function reset() {
    this.noel.reset();
    this.ppn.reset();
    this.santons.reset();
  },
  kdo: function kdo(elt) {
    console.log("kdo", elt);
    this.noel.kdo = this.ppn.kdo = this.santons.kdo = elt;
  }
};
document.getElementById("reset").addEventListener("click", function () {
  songs.reset();
});
var jingleBells = "jingle_bells";
var basePath = "./sounds/";
createjs.Sound.on("fileload", function (event) {
  newAssetLoaded();
  // A sound has been preloaded.
  console.log("Preloaded:", event.id, event.src);
  if (event.src.includes("jingle")) {
    backgroundPlayer = createjs.Sound.play(jingleBells);
    // https://createjs.com/docs/soundjs/classes/AbstractSoundInstance.html
    backgroundPlayer.volume = backgroundPlayer.volume * 0.05;
    backgroundPlayer.loop = -1; // infinitely
    backgroundPlayer.on("complete", function () {
      console.log("main song complete");
    });
    backgroundPlayer.on("loop", function () {
      console.log("main song loop");
    });
    backgroundPlayer.on("failed", function () {
      console.log("main song failed");
    });
    console.log(backgroundPlayer);
  }
}); // add an event listener for when load is completed
var loadSound = function loadSound() {
  [jingleBells, "ho_ho_ho", "merry_christmas", "jolly_laugh"].forEach(function (id) {
    return createjs.Sound.registerSound(basePath + id + ".mp3", /* id */id);
  });
  // @see https://createjs.com/docs/soundjs/classes/Sound.html#method_registerSounds
  createjs.Sound.registerSounds(songs.soundIDs().map(function (id) {
    return { src: id + ".wav", id: id };
  }), basePath);
};
document.body.onload = loadSound;

// https://github.com/adobe-webplatform/Snap.svg/issues/420
var imgBasePath = "./images/svg/";
var body = Snap("body");
var wrapper = Snap("#svg .svg");
var wrapperBack = Snap("#svg-background .svg");
var wrapperFore = Snap("#svg-foreground .svg");
var objects = {};
var loadSVG = function loadSVG(id, wp, cb) {
  Snap.load(imgBasePath + id + ".svg", function (fragment) {
    wp && wp.append(fragment);
    objects[id] = wp ? wp.select('#' + id) : fragment;
    cb && cb(objects[id], id);
    newAssetLoaded();
  });
};

var shadowOnOver = function shadowOnOver(elt) {
  elt.mouseover(addShadow);
  elt.mouseout(removeShadow);
  var shadow = elt.filter(Snap.filter.shadow(5, 10, 1, "#000044", 0.5));
  function addShadow() {
    this.attr({ filter: shadow });
  }
  function removeShadow() {
    this.attr({ filter: null });
  }
};

var register = function register() {
  Array(5).fill(0).forEach(function (elt, i) {
    var innerCircle = Snap("#b" + (4 + i));
    innerCircle.addClass("pointer");
    // shadowOnOver(innerCircle)
    var x = parseInt(innerCircle.attr("cx")),
        y = parseInt(innerCircle.attr("cy")),
        r = parseInt(innerCircle.attr("r"));
    var id = "halo-" + i;
    var frag = Snap.parse("<circle id=\"" + id + "\" class=\"halo\" cx=\"" + x + "\" cy=\"" + y + "\" r=\"" + (r + 5) + "\" stroke=\"black\" stroke-width=\"2\" fill=\"none\" opacity=\"0\"></circle>");
    objects["christmas-tree"].append(frag);
    var c = wrapper.select("#" + id);
    // console.log((x+r)*4, (y+r)*4)
    innerCircle.click(function () {
      songs["ppn"].trigger(i);
      var halo = function halo() {
        c.attr({ opacity: 0.5 });
        c.animate({
          opacity: 0,
          transform: "t-" + x * 0.5 + ",-" + y * 0.5 + "s1.5,1.5,0,0"
        }, 500, mina.linear, function () {
          c.attr({ transform: "t0,0s1,1,0,0" });
        });
      };
      halo();
      // setInterval(halo, 1000);
    });
  });
};

loadSVG("quaver", null, function (elt) {/*elt.addClass("music-note");*/});
loadSVG("music-note", null, function (elt) {/*elt.addClass("music-note");*/});
function displayMusic() {
  body.append(objects["quaver"]);
  body.append(objects["music-note"]);
  var q = Math.random() > 0.5 ? body.select("#quaver") : body.select("#music-note");
  q.removeClass("gv-hide");
  // const tx = (Math.random()*50+150)*(Math.random() > 0.5 ? 1 : -1);
  // const ty = (Math.random()*50+150)*(Math.random() > 0.5 ? 1 : -1);
  // const tx = -80;
  // const ty = -80;
  var tx = 0;
  var ty = 0;
  $(q.node).css({ width: "1%" });
  q.animate({
    // Sur Safari le scaling svg ne marche pas
    transform: "t" + tx + "," + ty + "s1,1,0,0"
    // transform: `t${tx},${ty}s0,0,0,0`,
  }, 1000, mina.linear, function () {
    q.addClass("gv-hide");
    $(q.node).css({ width: "" });
    q.attr({
      transform: "t0,0s1,1,0,0"
    });
    // q.remove();
  });
}

loadSVG("christmas-tree", wrapper, register);
loadSVG("star", wrapper, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    songs["noel"].trigger(0);
  });
  elt.hover(function () {
    if (elt.$animating) return;
    elt.$animating = true;
    console.log("hover");
    elt.animate({
      transform: "rotate(300 0 0)"
    }, 500, mina.easein, function () {
      elt.animate({
        transform: "rotate(-300 0 0)"
      }, 500, mina.easein, function () {
        elt.$animating = false;
      });
    });
  });
});

loadSVG("angel", wrapper, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    songs["santons"].trigger(0);
  });
});
loadSVG("drum", wrapper, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    songs["santons"].trigger(2);
  });
});
loadSVG("trumpet", wrapper, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    songs["santons"].trigger(1);
  });
});
loadSVG("train", wrapper, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    Song.playSound("ho_ho_ho", false);
  });
});
loadSVG("christmas-card", wrapper, function (elt) {
  target.includes("lulu") && songs.kdo(elt);
});
loadSVG("fireplace", wrapperBack, function (elt) {
  elt.select(".eye").transform();
});
loadSVG("wreath", wrapperBack, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    songs["noel"].trigger(1);
  });
});
loadSVG("sled", wrapperBack);
loadSVG("snow-globe", wrapperBack, function (elt, _id) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  // wrapperBack
  var innerCircle = elt.select('circle');
  var x = parseInt(innerCircle.attr("cx")),
      y = parseInt(innerCircle.attr("cy")),
      r = parseInt(innerCircle.attr("r"));
  var id = "halo-" + _id;
  var frag = Snap.parse("<circle id=\"" + id + "\" class=\"halo\" cx=\"" + x + "\" cy=\"" + y + "\" r=\"" + (r + 5) + "\" stroke=\"black\" stroke-width=\"15\" fill=\"none\" opacity=\"0\"></circle>");
  objects["snow-globe"].append(frag);
  var haloSvg = objects["snow-globe"].select("#" + id);
  // console.log((x+r)*4, (y+r)*4)
  objects["snow-globe"].click(function () {
    Song.playSound("jolly_laugh", false);
    var halo = function halo() {
      haloSvg.attr({ opacity: 0.5 });
      haloSvg.animate({
        opacity: 0,
        transform: "t-" + x * 0.5 + ",-" + y * 0.5 + "s1.5,1.5,0,0"
      }, 500, mina.linear, function () {
        haloSvg.attr({ transform: "t0,0s1,1,0,0" });
      });
    };
    halo();
    // setInterval(halo, 1000);
  });
});
loadSVG("sock", wrapperBack, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    songs["noel"].trigger(3);
  });
  //http://svg.dabbles.info/snaptut-blur
  //http://snapsvg.io/docs/#Snap.filter.shadow
});
loadSVG("candy", wrapperBack, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    Song.playSound("merry_christmas", false);
  });
});
loadSVG("gingerbread", wrapperBack, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    songs["noel"].trigger(2);
  });
});
loadSVG("gift-bag", wrapper, function (elt) {
  target.includes("agnes") && songs.kdo(elt);
});
loadSVG("gift-1", wrapper, function (elt) {
  target.includes("marianne") && songs.kdo(elt);
});