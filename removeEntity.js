var fs = require('fs');

var through = require('through2');

function removeEntityFromDep(entity, dep) {
    function removeElem(dep, elemName) {
        function emptify() {
            if (dep.block && Object.keys(dep).length === 1) {
                dep = {};
            }
        }

        function removeFromArr(key) {
            var index = dep[key].indexOf(elemName);
            if (~index) {
                dep[key].splice(index, 1);
                if (!dep[key].length) {
                    delete dep[key];
                }
            }
        }

        if (Array.isArray(dep.elem)) {
            removeFromArr('elem');
            emptify(dep);
        }
        else if (dep.elem === elemName) {
            delete dep.elem;
            emptify(dep);
        }
        else if (Array.isArray(dep.elems)) {
            removeFromArr('elems');
        }
        else if (dep.elems === elemName) {
            delete dep.elems;
        }
        return dep;
	}

    debugger
    if (entity.elem) {
        if (!entity.block && dep.block) {
            return dep;
        }
        dep = removeElem(dep, entity.elem);
    } else if (entity.block && dep.block && dep.block === entity.block) {
        dep = {};
    }

	return dep;
}

function removeEntity(entity, bemDeps) {
    return [].concat(bemDeps).map(techDep => {
        for (var type of ['mustDeps', 'shouldDeps']) {
            var deps = techDep[type];
            if (deps) {
                techDep[type] = [].concat(deps)
                    .map(dep => removeEntityFromDep(entity, dep))
                    .filter(d => Object.keys(d).length); // remove {}
                if (!techDep[type].length) {
                    delete techDep[type];
                }
            }
        }

        return techDep;
    })
    .filter(d => Object.keys(d).length);
}

function removeEntityStream(entity) {
    return through.obj(function(file, enc, next) {
        var deps = removeEntity(file.data, deps);
		var depsString = '(' + JSON.stringify(deps, null, 4) + ');';
		fs.writeFileSync(file.path, depsString);
	});
}

module.exports = removeEntityStream;
module.exports.removeEntity = removeEntity;
