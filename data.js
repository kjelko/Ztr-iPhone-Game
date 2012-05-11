/**
 * @fileoverview Creates an abstraction layer to interact with the player's
 * saved data.
 */


/**
 * Creates a new DatabaseManager object.
 * @constructor
 * @todo Remove the stupid 'Dev mode' thing.
 * 
 */
var DatabaseManager = function() {
  var shortName = 'mowerman', version = '1.0', displayName = 'Game Info', maxSize = 3072*1024;
  this.db = openDatabase(shortName, version, displayName, maxSize);
  this.query('drop table levels', function(){alert('Running in dev mode - your progress will not be saved')}, function(){alert('not dropped')})
  this.initialSetup();
};

/**
 * Holdes some common queries.
 * @type {Array.<string>}
 * 
 */
DatabaseManager.QUERIES = {
  CREATE_TABLE: 'create table if not exists levels (levelNo INTEGER NOT NULL, score INTEGER, status INTEGER NOT NULL, UNIQUE (levelNo))',
  SELECT_LEVELS: 'select levelNo, status, score from levels order by levelNo'
};


/**
 * Executes a query on the database.
 * @param {string} query The query to run.
 * @param {function} callback The function to call when the query ghas executed.
 * 
 */
DatabaseManager.prototype.query = function(query, callback) {
  this.db.transaction(function(transaction){
    transaction.executeSql(query , [],
      function(t, r){callback(r)},
      function(){callback(false)}
    )}
  );
};


/**
 * Updates a level's information.  We only update the score/status if the
 * new values are higher than the ones already stored.
 * @param {int} levelNo The level number to update.
 * @param {int} score The new level score.
 * @param {int} status The new level status.
 * @param {function} callback Function to call when the level has been updated.
 *
 */
DatabaseManager.prototype.levelInfo = function(levelNo, score, status, callback) {
  this.query('INSERT OR REPLACE INTO levels (levelNo, score, status) '+
             'VALUES ('+levelNo+', ' +
             '(CASE WHEN NOT EXISTS (select * from levels where levelNo = ' + levelNo + ') THEN ' + score +
             ' WHEN ((select score from levels where levelNo = '+levelNo+') < ' + score + ') THEN ' +
             score + ' ELSE (select score from levels where levelNo = '+levelNo+') END), ' +
             '(CASE WHEN NOT EXISTS (select * from levels where levelNo = ' + levelNo + ') THEN ' + status +
             ' WHEN ((select status from levels where levelNo = '+levelNo+') < ' + status + ') THEN ' +
             status + ' ELSE (select status from levels where levelNo = '+levelNo+') END))',
             callback, function(){console.log('failed')});
};

/**
 * Removes a level from the database.
 * @param {int} levelNo The level to get rid of.
 * @todo Delete this?
 */
DatabaseManager.prototype.removeLevel = function(levelNo) {
  this.query('delete from levels where levelNo = ' + levelNo,
    function(){},
    function(){console.log('Could not remove level...');}
  );
};

/**
 * Selects a level from the database.
 * @param {int} levelNo The level to select.
 * @todo Delete this?
 */
DatabaseManager.prototype.selectLevel = function(levelNo, callback) {
  this.query('select levelNo, score, status from levels where levelNo = ' + levelNo,
    callback,
    function(){console.log('Could not select level...');}
  );
};

/**
 * Selects all completed levels from the database.
 * @param {function} callback Function to call when query has executed.
 */
DatabaseManager.prototype.selectCompletedLevels = function(callback) {
  this.query(DatabaseManager.QUERIES.SELECT_LEVELS,
    callback, function(){console.log('Could not select levels...');}
  );
};

/**
 * Handles the initial creation of database table.
 * 
 */
DatabaseManager.prototype.initialSetup = function() {
  this.query(DatabaseManager.QUERIES.CREATE_TABLE,
    function(){}, function(){console.log('Error establishing database connection.')}
  );
  
  for(i in levels){
    this.levelInfo(i, 0, (i==1) ? 1 : 1, function(){});
  }
  
};

//Create a new instance of DatabaseManager
//@todo handle this in the containing object.
var db;
if(window.openDatabase){
  db = new DatabaseManager();
};