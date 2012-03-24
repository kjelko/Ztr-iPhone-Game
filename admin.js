var SplashScreen = function(canvasId){
  var canvas = document.getElementById(canvasId),
  cxt = canvas.getContext('2d'),
  ui = new Ui(canvas, cxt);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  cxt.fillStyle = '#252f3c';
  cxt.fillRect(0, 0, canvas.width, canvas.height);
  
  cxt.fillStyle = "#fff";
  cxt.font = 'bold 45px Arial';
  cxt.fillText('Mr. Mower Man', canvas.width/2-200, canvas.height/2);
  cxt.font = 'bold 35px Arial';
  cxt.fillText('Play', canvas.width/2-200, canvas.height/2+55);
  
  cxt.font = 'bold 15px Arial';
  cxt.fillText('Created by Kevin Elko', canvas.width-175, canvas.height-15);
  
  
  var b = {};
  b.coords = utils.square(canvas.width/2-200, canvas.height/2+55-35, 100, 35)

  b.callback = play;
  
  ui.addButton(b);
  
  function play(){
    ui.clear();
    LevelSelect(canvasId);
  }
  
};

var LevelSelect = function(canvasId){
  
  var numLevels = 0,
  canvas = document.getElementById(canvasId),
  cxt = canvas.getContext('2d'),
  ui = new Ui(canvas, cxt);
  
  for(i in levels) {
    newLevelButton(levels[i]);
  }
  
  function startLevel(levelInit) {
    ui.clear();
    levelInit(canvasId);
  }
  
  this.consoleStart = function (func) {
    startLevel(func);
  }
  
  function loadButtons(cxt) {  
    for(i in levelButtons) {
      var b = levelButtons[i];
      cxt.fillStyle = 'black';
      cxt.fillRect(b[0].x, b[0].y, b[1].x - b[0].x, b[3].y - b[0].y);
      cxt.fillStyle = "red";
      cxt.font = 'bold 25px Arial';
      cxt.fillText(b.levelNumber, b[0].x + 18, b[0].y + 32);
    }
  }
  
  function newLevelButton(func) {
    var b = {};
    b.coords = utils.square(50*numLevels + 15*(numLevels+1), 15, 50, 50);
    b.callback = function(){startLevel(func)};
    b.fill = 'black';
    ui.addButton(b);
    numLevels++;
  }

  return this;

};

var Ui = function(canvas, cxt){
  
  function preventTouchMove(e) {e.preventDefault()}
  canvas.addEventListener('touchmove', preventTouchMove, false);
  
  var buttons = [];
  
  function handleTouch(e){
    for(i in buttons){
      var b = buttons[i],
      touchx = e.changedTouches[0].clientX,
      touchy = e.changedTouches[0].clientY;
      if(utils.pointInPoly(b.coords, {x: touchx, y: touchy})) {
        b.callback.call();
      }
    }
  };

  this.addButton = function(button){
    if(!buttons.length) {
      canvas.addEventListener('touchstart', handleTouch);
    }
    buttons.push(button);
    this.drawButtons();
  };
  
  this.drawButtons = function(){
    for(i in buttons){
      var button = buttons[i];
      if(button.fill) {
        cxt.fillStyle = button.fill;
        cxt.fillRect(button.coords[0].x, button.coords[0].y,
          button.coords[1].x - button.coords[0].x,
          button.coords[3].y - button.coords[0].y)
      } else if(button.image) {
        //draw image
      }
    }
  };
  
  this.clear = function(){
    canvas.removeEventListener('touchstart', handleTouch);
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    buttons = [];
  };
  
  this.clear();

};