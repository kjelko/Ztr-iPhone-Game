/**
 * @fileoverview Define each level as a function.  Also included are some
 * temporary auxiliary functions.
 * 
 */


/**
 * Auxiliary function to handle level completion.  Ideally this would be
 * managed by some all encompasing object.
 * @param {Object} levelInfo Passes the trail canvas to calculate percent mowed.
 * @param {int} levelNo The level number.
 * @param {int} goal the percent of lawn that needs to be mowed. 
 *
 */
var levelComplete = function(levelInfo) {
  
  var t = levelInfo.trail,
  trailPix = t.context.getImageData(0,0,t.canvas.width, t.canvas.height).data,
  spritePix = levelInfo.spriteMap.getImageData(0,0,t.canvas.width, t.canvas.height).data,
  possiblePixels = 0,
  coveredPixels = 0;

  for(var i=0; i < spritePix.length; i+=4){
    if((trailPix[i] || trailPix[i+1] || trailPix[i+2]) &&
       !(spritePix[i] || spritePix[i+1] || spritePix[i+2]))
      coveredPixels++;
    if(!(spritePix[i] || spritePix[i+1] || spritePix[i+2]))
      possiblePixels++;
  } 
  
  var percent = Math.round(coveredPixels/possiblePixels * 100);
  if(percent > 100) percent = 100;
  
  var moveOn = function(){
    ui.clear(true);
    LevelSelect(ui);
  }

  if(percent >= levelInfo.goal) {
    if(levels[levelInfo.levelNo+1])
      db.levelInfo(levelInfo.levelNo+1, 0, 1, function(){});
    db.levelInfo(levelInfo.levelNo, percent, 2, moveOn);
    alert('Congrats! You mowed ' + percent + ' percent of the lawn!');
  } else {
    db.levelInfo(levelInfo.levelNo, percent, 1, moveOn);
    alert('Oh no! You only mowed ' + percent + ' percent of the lawn!');
  }  
  
};


/**
 * The array that holds the levels.
 * @type {Array.<object>}
 */
var levels = [
  //Level 1
  {
    //Setting the background.
    background : new Sprite({
      image: 'images/grass.png',
      sWidth: 100,
      sHeight: 500,
      sx: 0,
      sy: 0,
      dWidth: 100,
      dHeight: 500
    }),
    //Setting the sprite for the main character, we define a hit are that
    //is not the same as the sprite boundaries.
    hero : new Sprite({
      image: 'images/tank.png',
      sWidth: 30,
      sHeight: 52,
      sx: 0,
      sy: 0,
      dWidth: 30,
      dHeight: 52,
      dx: window.innerWidth/2 - 15,//ui.width/2 - 15,
      dy: window.innerHeight/2 - 26,//ui.height/2 - 26,
      dz: 1,
      fixed: true,
      hitArea: [[-11, -12], [11,  -12], [11,  23], [-11, 23]]
    }),
    //Set the sprites for the lawn mower controls.
    handles: {
      right : new Sprite({
        image: 'images/handle.png',
        sWidth: 70,
        sHeight: 20,
        sx: 70,
        sy: 0,
        dWidth: 75,
        dHeight: 20,
        dz: 5,
        fixed: true
      }),
      left : new Sprite({
        image: 'images/handle.png',
        sWidth: 70,
        sHeight: 20,
        sx: 0,
        sy: 0,
        dWidth: 75,
        dHeight: 20,
        dz: 5,
        fixed: true
      })
    },
    //Set the start view for the level.
    view : {
      angle: 0,
      pos : { x: 0, y: -215 }
    },
    //Here we set some of the other level information.
    drawTrail : true,
    trailImage : 'images/cut_grass.png',
    timer : 30,
    goal : 90, 
    gameOver : levelComplete
  },
  
  //Level 2
  {
    background : new Sprite({
      image: 'images/grass.png',
      sWidth: 400,
      sHeight: 400,
      sx: 0,
      sy: 0,
      dWidth: 400,
      dHeight: 400
    }),
    hero : new Sprite({
      image: 'images/tank.png',
      sWidth: 30,
      sHeight: 52,
      sx: 0,
      sy: 0,
      dWidth: 30,
      dHeight: 52,
      dx: window.innerWidth/2 - 15,//ui.width/2 - 15,
      dy: window.innerHeight/2 - 26,//ui.height/2 - 26,
      dz: 1,
      fixed: true,
      hitArea: [[-11, -12], [11,  -12], [11,  23], [-11, 23]]
    }),
    handles: {
      right : new Sprite({
        image: 'images/handle.png',
        sWidth: 70,
        sHeight: 20,
        sx: 70,
        sy: 0,
        dWidth: 75,
        dHeight: 20,
        dz: 5,
        fixed: true
      }),
      left : new Sprite({
        image: 'images/handle.png',
        sWidth: 70,
        sHeight: 20,
        sx: 0,
        sy: 0,
        dWidth: 75,
        dHeight: 20,
        dz: 5,
        fixed: true
      })
    },
    //This is an example of a solid obstacle that the character
    //cannot move through.
    obstacles : [
      {
        sprite : new Sprite({
          image: 'images/bg_color.png',
          sWidth: 99,
          sHeight: 99,
          sx: 0,
          sy: 0,
          dWidth: 300,
          dHeight: 206,
          dx: 0,
          dy: 0,
          dz: -1,
          drawToSpriteMap: true
        }),
        beginCollision : function(){},
        endCollision : function(){}
      }
    ],
    view : {
      angle: 2,
      pos : { x: -30, y: -150 }
    },
    drawTrail : true,
    trailImage : 'images/cut_grass.png',
    timer : 115,
    goal : 85, 
    gameOver : levelComplete
  },
  
  //Level 3
  {
    background : new Sprite({
      image: 'images/grass.png',
      sWidth: 500,
      sHeight: 500,
      sx: 0,
      sy: 0,
      dWidth: 500,
      dHeight: 500
    }),
    hero : new Sprite({
      image: 'images/tank.png',
      sWidth: 30,
      sHeight: 52,
      sx: 0,
      sy: 0,
      dWidth: 30,
      dHeight: 52,
      dx: window.innerWidth/2 - 15,//ui.width/2 - 15,
      dy: window.innerHeight/2 - 26,//ui.height/2 - 26,
      dz: 1,
      fixed: true,
      hitArea: [[-11, -12], [11,  -12], [11,  23], [-11, 23]]
    }),
    handles: {
      right : new Sprite({
        image: 'images/handle.png',
        sWidth: 70,
        sHeight: 20,
        sx: 70,
        sy: 0,
        dWidth: 75,
        dHeight: 20,
        dz: 5,
        fixed: true
      }),
      left : new Sprite({
        image: 'images/handle.png',
        sWidth: 70,
        sHeight: 20,
        sx: 0,
        sy: 0,
        dWidth: 75,
        dHeight: 20,
        dz: 5,
        fixed: true
      })
    },
    obstacles : [
      {
        sprite: new Sprite({
          image: 'images/house.png',
          sWidth: 300,
          sHeight: 206,
          sx: 0,
          sy: 0,
          dWidth: 300,
          dHeight: 206,
          dx: 110,
          dy: 230,
          dz: 2,
          hitArea: [[130, 250], [390, 250], [390, 416], [130, 416]]
        }),
        beginCollision: function(){},
        endCollision: function(){}
      },
      {
        sprite: new Sprite({
          image: 'images/car.png',
          sWidth: 297,
          sHeight: 147,
          sx: 0,
          sy: 0,
          dWidth: 75,
          dHeight: 37,
          dx: 100,
          dy: 200,
          dz: 1
        }),
        beginCollision: function(){},
        endCollision: function(){}
      }
    ],
    //This is an example of an item that the character can move
    //through/over/under.
    items : [
      {
        sprite: new Sprite({
          image: 'images/driveway.png',
          sWidth: 216,
          sHeight: 124,
          sx: 0,
          sy: 0,
          dWidth: 216,
          dHeight: 124,
          dx: 0,
          dy: 155,
          dz: -1,
          drawToSpriteMap: true,
          hitArea: [[0, 180], [195, 180], [195, 256], [0, 256]]
        }),
        beginCollision: function(ztr){ztr.setSpeed(8)},
        endCollision: function(ztr){ztr.setSpeed(5)}
      }
    ],
    view : {
      angle: 0,
      pos : { x: -25, y: 50 }
    },
    drawTrail : true,
    trailImage : 'images/cut_grass.png',
    timer : 120,
    goal : 90, 
    gameOver : levelComplete
  }
];