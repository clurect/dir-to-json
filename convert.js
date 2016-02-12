var fs = require('fs');
var path = require('path');

var config = JSON.parse(fs.readFileSync('config.json').toString());
var ignores = config.ignores;//['.git', 'readme.md'];

// var stream = fs.createWriteStream("out.json");
var dirToJson = function(dir, done) {
    var results = [];

    fs.readdir(dir, function(err, list) {
        if (err)
            return done(err);

        var pending = list.length;

        if (!pending)
            return done(null, {name: path.basename(dir), type: 'folder', children: results});

        list.forEach(function(file) {
            if (ignores.indexOf(file) >= 0) {
                if (!--pending)
                    done(null, results);
                return;
            }
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    dirToJson(file, function(err, res) {
                        results.push({
                            name: path.basename(file),
                            type: 'folder',
                            children: res
                        });
                        if (!--pending)
                            done(null, results);
                    });
                }
                else {
                    if (path.extname(file) === '.json') {
                        var contents = '';
                        try {
                            contents = JSON.parse(fs.readFileSync(file, 'utf8').toString());
                        }
                        catch(err) {
                            console.log(err + " when reading " + path.basename(file));
                            contents = fs.readFileSync(file, 'utf8').toString();
                        }
                        
                        results.push({
                            type: 'file',
                            name: path.basename(file, path.extname(file)),
                            contents: contents
                        });
                    }
                    if (!--pending)
                        done(null, results);
                }
            });
        });
    });
};


var dirTree = config.directory;

dirToJson(dirTree, function(err, res){
    if(err)
        console.error(err);
    fs.writeFile(config.out,JSON.stringify(res,null,2));
    
});