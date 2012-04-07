/**
 * @fileoverview This file defines some administrative functions that are used
 * to handle the splash screen, level selection, etc.
 *
 */

/**
 * Shows the splash screen.
 * @param {HTMLCanvas} canvas The main canvas.
 * @param {2dCanvasContext} cxt The 2d context of canvas.
 * @todo I should just pass a ui object here.  This function should be called
 * from the all encompassing object that is yet to be defined.
 * 
 */
var SplashScreen = function(canvas, cxt){
  ui = new Ui(canvas, cxt);
  
  cxt.fillStyle = '#252f3c';
  cxt.fillRect(0, 0, canvas.width, canvas.height);
  
  cxt.fillStyle = "#fff";
  cxt.font = 'bold 45px Arial';
  cxt.fillText('Mr. Mower Man', window.innerWidth/2-200, window.innerHeight/2);
  cxt.font = 'bold 35px Arial';
  cxt.fillText('Play', window.innerWidth/2-200, window.innerHeight/2+55);
  
  cxt.font = 'bold 15px Arial';
  cxt.fillText('Created by Kevin Elko', window.innerWidth-175, window.innerHeight-15);
  
  var b = new Ui.button(utils.square(window.innerWidth/2-200,
    window.innerHeight/2+55-35, 100, 35), null, play)
  
  ui.addButton(b);
  
  function play(){
    ui.clear(true);
    LevelSelect(ui);
  }
};


/**
 * Shows the splash screen.
 * @ui {Ui} ui A ui object upon which to display the level selection screen.
 *
 */
var LevelSelect = function(ui){
  
  var numLevels = 0;
  
  function loadLevels(results) {
    if(results.rows.length) {
      for(i = 0 ; i < results.rows.length; i++) {
        if(results.rows.item(i).status)
          newLevelButton(levels[results.rows.item(i).levelNo], results.rows.item(i).score, results.rows.item(i).status);
        else
          newLevelButton(null, results.rows.item(i).score, results.rows.item(i).status)
      }
    }else {
      newLevelButton(levels[1]);
    }
  }
  
  function startLevel(levelInit) {
    ui.clear(true);
    levelInit(ui);
  }
  
  function newLevelButton(func, score, status) {
    var b = new Ui.button(utils.square(50*numLevels + 15*(numLevels+1), 15, 50, 50),
      'black', (status) ? function(){startLevel(func)} : function(){alert('You must unlock this level!')});
    ui.addButton(b);
    
    if(status == 2) {
      ui.context.fillStyle = 'green';  
    } else if(status == 1){
      ui.context.fillStyle = 'red';
    } else {
      ui.context.fillStyle = '#555';
    }
    ui.context.font = 'bold 15px Arial';
    ui.context.fillText(score + '%', b.coords[0][0]+15, b.coords[0][1] + 25);
    
    numLevels++;
  }

  db.selectCompletedLevels(loadLevels);  


};