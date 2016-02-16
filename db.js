var mongo = require('mongodb').MongoClient;


function importJSON(host, port, auth, db, collection, json, callback) {
  mongo.connect("mongodb://"+host+":"+port+"/" + db, function (connectErr, db) {
    if (!connectErr) {
      console.log('connected to the database');
    }
    db.collection(collection).deleteMany({}, function(delErr, results) {
    	if (!delErr) {
    		console.log('removal complete');
    		console.log(results);
    	}
    	db.collection(collection).insertMany(json, function (insertErr, results) {
    		console.log(typeof(json));
    		if (!insertErr) {
    			console.log('added the documents to mongo');
    			db.close();
    			callback();

    		}
    		else {
    			console.log(insertErr);
    		}
    	});
    });
    
  });
}
module.exports = {
  importJSON:importJSON
}
