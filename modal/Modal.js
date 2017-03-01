module.exports = (function () {

    function _toCamelCase(val) {
        return val.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
            if (p2) {
                return p2.toUpperCase();
            }
            
            return p1.toLowerCase();        
        });
    }

    function Modal(options) {
        this._data = new options.Vue({
            data: function () {
                return {
                    modals: {}
                };
            }
        });
    }

    Modal.prototype.register = function(name) {
        var i,
            ccName = _toCamelCase(name);

        this._data.$set(this._data.modals, ccName, {
            visible: false,
            name: name,
            data: {}
        });
        
        return ccName;
    };

    Modal.prototype.watch = function(name, func) {
        return this._data.$watch('modals.' + _toCamelCase(name) + '.visible', func);
    };

    Modal.prototype.show = function (name, data) {
        name = _toCamelCase(name);

        this._data.modals[name].data = data || null;
        this._data.modals[name].visible = true;
    };

    Modal.prototype.hide = function (name) {
        var i;

        if (name) {
            name = _toCamelCase(name);
            this._data.modals[name].visible = false;
        }
        else {
            for (i in this.data.modals) {
                this._data.modals[i].visible = true;
            }
        }
    };

    Modal.prototype.visible = function(name) {
        name = _toCamelCase(name);

        return this._data.modals[name].visible;
    };

    Modal.prototype.data = function(name) {
        name = _toCamelCase(name);

        return this._data.modals[name].data;
    };

    return function install(Vue) {
        var modal = new Modal({Vue: Vue});

        Vue.component('w-modal', require('./Shell.vue'));

        Object.defineProperties(Vue.prototype, {
            $modal: {
                get: function() {
                    return modal;
                }
            }
        });
    }
})();