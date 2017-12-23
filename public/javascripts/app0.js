"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//https://stackoverflow.com/questions/4617638/detect-ipad-users-using-jquery
var isIpad = navigator.userAgent.match(/iPad/i) != null;

var backgroundPlayer;

var Song = function () {
  function Song(chain) {
    _classCallCheck(this, Song);

    this.length = chain.length;
    this.complete = false;
    this.ids = chain;
    this.last = undefined;
  }

  _createClass(Song, [{
    key: "onSuccess",
    value: function onSuccess(samplePlayer) {
      this.complete = true;
      console.log("COMPLETE");
      // function(){ window.open("http://localhost:3000/cadeau", "_self") }
      samplePlayer.on("complete", function () {
        document.getElementById("kdo").click();
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.complete = false;
      this.last = undefined;
      document.getElementById("progress").style.width = 0;
    }
  }, {
    key: "trigger",
    value: function trigger(soundID) {
      if ("number" == typeof soundID) soundID = this.ids[soundID];

      backgroundPlayer.volume = 0;
      var samplePlayer = createjs.Sound.play(soundID);
      samplePlayer.on("complete", function () {
        setTimeout(function () {
          backgroundPlayer.volume = 0.05;
        });
      }, 500);

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
  }]);

  return Song;
}();

var songs = {
  "ppn": new Song(["ppn_final_0", "ppn_final_1", "ppn_final_2", "ppn_final_3", "ppn_final_4"]),
  "noel": new Song(["noel_0", "noel_1", "noel_2", "noel_3"]),
  soundIDs: function soundIDs() {
    return this.noel.ids.concat(this.ppn.ids);
  },
  reset: function reset() {
    this.noel.reset();
    this.ppn.reset();
  }
};
document.getElementById("reset").addEventListener("click", function () {
  songs.reset();
});
var jingleBells = "jingleBells";
var basePath = "./sounds/";
createjs.Sound.on("fileload", function () {
  console.log("fileload");
  backgroundPlayer = createjs.Sound.play(jingleBells);
  // https://createjs.com/docs/soundjs/classes/AbstractSoundInstance.html
  backgroundPlayer.volume = backgroundPlayer.volume * 0.05;
  backgroundPlayer.loop = -1; // infinitely
}); // add an event listener for when load is completed
var loadSound = function loadSound() {
  createjs.Sound.registerSound(basePath + jingleBells + ".mp3", /* id */jingleBells);
  // @see https://createjs.com/docs/soundjs/classes/Sound.html#method_registerSounds
  createjs.Sound.registerSounds(songs.soundIDs().map(function (id) {
    return { src: id + ".wav", id: id };
  }), basePath);
};
document.body.onload = loadSound;

// https://github.com/adobe-webplatform/Snap.svg/issues/420
var imgBasePath = "./images/svg/";
var wrapper = Snap("#svg .svg");
var wrapperBack = Snap("#svg-background .svg");
var wrapperFore = Snap("#svg-foreground .svg");
var objects = {};
var loadSVG = function loadSVG(id, wp, cb) {
  Snap.load(imgBasePath + id + ".svg", function (fragment) {
    wp && wp.append(fragment);
    objects[id] = wp ? wp.select('#' + id) : fragment;
    cb && cb(objects[id], id);
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
      wp.append(objects["quaver"]);
      var q = wp.select("#quaver");
      q.animate({
        transform: "t100,100s0,0,0,0"
      }, 1000);
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

loadSVG("quaver");
loadSVG("music-note");
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
loadSVG("train", wrapper);
loadSVG("christmas-card", wrapper);
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
    // playSound(soundIDs[i])
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
  // elt.click(function(){ songs["noel"].trigger(3) })
});
loadSVG("gingerbread", wrapperBack, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
  elt.click(function () {
    songs["noel"].trigger(2);
  });
});
loadSVG("gift-bag", wrapper, function (elt) {
  elt.addClass("pointer");
  shadowOnOver(elt);
});
loadSVG("gift-1", wrapper);