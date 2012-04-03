var db;

//constructor
var DatabaseManager = function(shortName, version, displayName, maxSize) {
  this.exists = false;
  this.db = openDatabase(shortName, version, displayName, maxSize);
  this.query('drop table levels', function(){alert('dropped')}, function(){alert('not dropped')})
  this.initialSetup();
};

DatabaseManager.QUERIES = {
  CREATE_TABLE: 'create table if not exists levels (levelNo INTEGER NOT NULL, score INTEGER, status INTEGER NOT NULL, UNIQUE (levelNo))',
  SELECT_LEVELS: 'select levelNo, status, score from levels order by levelNo'
};

DatabaseManager.prototype.query = function(query, callback, errorCallBack) {
  this.db.transaction(function(transaction){
    transaction.executeSql(query , [],
      function(t, r){callback(r)},
      function(){callback(false)}
    )}
  );
};

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

DatabaseManager.prototype.removeLevel = function(levelNo) {
  this.query('delete from levels where levelNo = ' + levelNo,
    function(){},
    function(){console.log('Could not remove level...');}
  );
};

DatabaseManager.prototype.selectLevel = function(levelNo, callback) {
  this.query('select levelNo, score, status from levels where levelNo = ' + levelNo,
    callback,
    function(){console.log('Could not select level...');}
  );
};

DatabaseManager.prototype.selectCompletedLevels = function(callback) {
  this.query(DatabaseManager.QUERIES.SELECT_LEVELS,
    callback, function(){console.log('Could not select levels...');}
  );
};

DatabaseManager.prototype.initialSetup = function() {
  this.query(DatabaseManager.QUERIES.CREATE_TABLE,
    function(){}, function(){console.log('Error establishing database connection.')}
  );
  
  for(i in levels){
    this.levelInfo(i, 0, (i==1)?1:0, function(){});
  }
  
};

if(window.openDatabase){
  var shortName = 'mowerman';
  var version = '1.0';
  var displayName = 'Game Info';
  var maxSize = 3072*1024; //  = 3MB in bytes 65536
  db = new DatabaseManager(shortName, version, displayName, maxSize);
};