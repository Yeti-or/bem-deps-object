const removeEntity = require('./removeEntity');

class DepsObject {
    constructor(obj) {
        this.obj = obj;
    }

    remove(entity) {
        removeEntity(entity, this.obj);
    }
}

module.exports = DepsObject;
