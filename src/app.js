//https://stackoverflow.com/questions/4617638/detect-ipad-users-using-jquery
const isIpad = navigator.userAgent.match(/iPad/i) != null;

var backgroundPlayer;
class Song {
  constructor(chain){
    this.length = chain.length;
    this.complete = false;
    this.ids = chain;
    this.last = undefined;
  }
  onSuccess(samplePlayer){
    this.complete = true;
    console.log("COMPLETE")
    // function(){ window.open("http://localhost:3000/cadeau", "_self") }
    samplePlayer.on("complete", function(){ document.getElementById("kdo").click() })
  }
  reset(){
    this.complete = false;
    this.last = undefined;
    document.getElementById("progress").style.width = 0
  }
  trigger(soundID){
    displayMusic();
    if("number" == typeof soundID)
      soundID = this.ids[soundID]

    Song.playSound(soundID)

    if(this.complete) return
    const i = this.ids.indexOf(soundID)
    console.log(soundID, i, this.last)
    if(i == 0){
        this.last = 0
    }else{
      if(i == this.last+1){
        ++this.last
      }
      else {
        this.last = undefined
        document.getElementById("progress").style.width = 0
      }
    }
    const factor = (this.last == undefined ? -1 : this.last) + 1
    document.getElementById("progress").style.width = (factor/this.length * 100)+"%"
    console.log("after", i, this.last)
    if(this.length-1 == this.last)
      this.onSuccess(samplePlayer)
  }
  static playSound(soundID, interrupt=true){
    if(interrupt) backgroundPlayer.volume = 0
    const samplePlayer = createjs.Sound.play(soundID);
    samplePlayer.on("complete", ()=>{
      setTimeout(()=>{ backgroundPlayer.volume=0.05; })
    }, 500);
  }
}

const songs = {
  "ppn": new Song(["ppn_final_0","ppn_final_1","ppn_final_2","ppn_final_3","ppn_final_4"]),
  "noel": new Song(["noel_0","noel_1","noel_2","noel_3"]),
  soundIDs(){
    return this.noel.ids.concat(this.ppn.ids)
  },
  reset(){
    this.noel.reset();
    this.ppn.reset();
  }
}
document.getElementById("reset").addEventListener("click", function(){ songs.reset() })
const jingleBells = "jingle_bells";
const basePath = "./sounds/"
createjs.Sound.on("fileload", function(event){
  // A sound has been preloaded.
  console.log("Preloaded:", event.id, event.src);
  if(event.src.includes("jingle")){
    backgroundPlayer = createjs.Sound.play(jingleBells);
    // https://createjs.com/docs/soundjs/classes/AbstractSoundInstance.html
    backgroundPlayer.volume = backgroundPlayer.volume * 0.05;
    backgroundPlayer.loop = -1; // infinitely
    backgroundPlayer.on("complete", ()=>{console.log("main song complete")})
    backgroundPlayer.on("loop", ()=>{console.log("main song loop")})
    backgroundPlayer.on("failed", ()=>{console.log("main song failed")});
    console.log(backgroundPlayer)
  }
}); // add an event listener for when load is completed
const loadSound = function(){
  [jingleBells, "ho_ho_ho", "merry_christmas", "jolly_laugh"].forEach(id=>createjs.Sound.registerSound(basePath + id + ".mp3", /* id */id))
  // @see https://createjs.com/docs/soundjs/classes/Sound.html#method_registerSounds
  createjs.Sound.registerSounds(
    songs
    .soundIDs()
    .map(id=>({src:id+".wav", id})),
    basePath
  );
};
document.body.onload = loadSound

  // https://github.com/adobe-webplatform/Snap.svg/issues/420
  const imgBasePath = "./images/svg/"
  const body = Snap("body");
  const wrapper = Snap("#svg .svg");
  const wrapperBack = Snap("#svg-background .svg");
  const wrapperFore = Snap("#svg-foreground .svg");
  const objects = {}
  const loadSVG = function(id, wp, cb){
    Snap.load(imgBasePath + id + ".svg", function(fragment){
      wp && wp.append(fragment);
      objects[id] = wp ? wp.select('#'+id) : fragment;
      cb && cb(objects[id], id);
    });
  };

  const shadowOnOver = function(elt){
    elt.mouseover(addShadow)
    elt.mouseout(removeShadow)
    var shadow = elt.filter(Snap.filter.shadow(5, 10, 1, "#000044", 0.5));
    function addShadow() {
      this.attr({ filter: shadow });
    }
    function removeShadow() {
      this.attr({ filter: null });
    }
  }

  const register = function(){
    Array(5).fill(0).forEach(function(elt, i){
      const innerCircle = Snap("#b"+(4+i))
      innerCircle.addClass("pointer")
      // shadowOnOver(innerCircle)
      const x = parseInt(innerCircle.attr("cx")), y = parseInt(innerCircle.attr("cy")), r = parseInt(innerCircle.attr("r"));
      const id = "halo-"+i;
      const frag = Snap.parse(`<circle id="${id}" class="halo" cx="${x}" cy="${y}" r="${r+5}" stroke="black" stroke-width="2" fill="none" opacity="0"></circle>`);
      objects["christmas-tree"].append( frag )
      const c = wrapper.select("#"+id)
      // console.log((x+r)*4, (y+r)*4)
      innerCircle.click(function(){
        songs["ppn"].trigger(i)
        const halo = function(){
          c.attr({opacity:0.5})
          c.animate({
            opacity:0,
            transform: `t-${(x)*0.5},-${(y)*0.5}s1.5,1.5,0,0`
          },500, mina.linear, function(){
            c.attr({transform:"t0,0s1,1,0,0"})
          })
        }
        halo()
        // setInterval(halo, 1000);
      })
    });
  }

  loadSVG("quaver", null, (elt)=>{ /*elt.addClass("music-note");*/ });
  loadSVG("music-note", null, (elt)=>{ /*elt.addClass("music-note");*/ });
  function displayMusic(){
    body.append(objects["quaver"]);
    body.append(objects["music-note"]);
    const q = Math.random() > 0.5 ? body.select("#quaver") : body.select("#music-note");
    q.removeClass("gv-hide")
    // const tx = (Math.random()*50+150)*(Math.random() > 0.5 ? 1 : -1);
    // const ty = (Math.random()*50+150)*(Math.random() > 0.5 ? 1 : -1);
    const tx = -80;
    const ty = -80;
    q.animate({
      transform: `t${tx},${ty}s0,0,0,0`,
    }, 1000, mina.linear, ()=>{
      q.addClass("gv-hide")
      q.attr({
        transform: "t0,0s1,1,0,0",
      })
      // q.remove();
    })
  }

  loadSVG("christmas-tree", wrapper, register)
  loadSVG("star", wrapper, function(elt){
    elt.addClass("pointer")
    shadowOnOver(elt)
    elt.click(function(){ songs["noel"].trigger(0); })
    elt.hover(function(){
      if(elt.$animating) return
      elt.$animating = true
      console.log("hover")
      elt.animate({
        transform: "rotate(300 0 0)",
      }, 500, mina.easein, function(){
        elt.animate({
          transform: "rotate(-300 0 0)",
        }, 500, mina.easein, function(){
          elt.$animating = false
        })
      })
    })
  })
  loadSVG("train", wrapper)
  loadSVG("christmas-card", wrapper)
  loadSVG("fireplace", wrapperBack, function(elt){
    elt.select(".eye").transform();
  })
  loadSVG("wreath", wrapperBack, function(elt){
    elt.addClass("pointer")
    shadowOnOver(elt)
    elt.click(function(){ songs["noel"].trigger(1) })
  })
  loadSVG("sled", wrapperBack)
  loadSVG("snow-globe", wrapperBack, function(elt, _id){
    elt.addClass("pointer")
    shadowOnOver(elt)
    // wrapperBack
    const innerCircle = elt.select('circle')
    const x = parseInt(innerCircle.attr("cx")), y = parseInt(innerCircle.attr("cy")), r = parseInt(innerCircle.attr("r"));
    const id = "halo-"+_id;
    const frag = Snap.parse(`<circle id="${id}" class="halo" cx="${x}" cy="${y}" r="${r+5}" stroke="black" stroke-width="15" fill="none" opacity="0"></circle>`);
    objects["snow-globe"].append( frag )
    const haloSvg = objects["snow-globe"].select("#"+id)
    // console.log((x+r)*4, (y+r)*4)
    objects["snow-globe"].click(function(){
      Song.playSound("jolly_laugh", false);
      const halo = function(){
        haloSvg.attr({opacity:0.5})
        haloSvg.animate({
          opacity:0,
          transform: `t-${(x)*0.5},-${(y)*0.5}s1.5,1.5,0,0`
        },500, mina.linear, function(){
          haloSvg.attr({transform:"t0,0s1,1,0,0"})
        })
      }
      halo()
      // setInterval(halo, 1000);
    })
  })
  loadSVG("sock", wrapperBack, function(elt){
    elt.addClass("pointer")
    shadowOnOver(elt)
    elt.click(function(){ songs["noel"].trigger(3) })
    //http://svg.dabbles.info/snaptut-blur
    //http://snapsvg.io/docs/#Snap.filter.shadow

  })
  loadSVG("candy", wrapperBack, function(elt){
    elt.addClass("pointer")
    shadowOnOver(elt)
    elt.click(function(){ Song.playSound("merry_christmas", false); })
  })
  loadSVG("gingerbread", wrapperBack, function(elt){
    elt.addClass("pointer")
    shadowOnOver(elt)
    elt.click(function(){ songs["noel"].trigger(2) })
  })
  loadSVG("gift-bag", wrapper, function(elt){
    elt.addClass("pointer")
    shadowOnOver(elt)
    elt.click(function(){ Song.playSound("ho_ho_ho", false); })
  })
  loadSVG("gift-1", wrapper)
