module.exports = (function () {

    function _toCamelCase(val) {
        return val.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
            if (p2) {
                return p2.toUpperCase();
            }
            
            return p1.toLowerCase();
        });
    }

    function MsgBag(options) {
        this._options = options;

        this._data = new options.Vue({
            data: function () {
                return {
                    msgbags: {}
                };
            }
        });
    }

    MsgBag.prototype.register = function(name) {
        var i,
            ccName = _toCamelCase(name);

        Vue.set(this._data.msgbags, ccName, {
            name: name,
            msgs: [],
            max: this._options.max,
            timeout: this._options.timeout
        });
        
        return ccName;
    };

    MsgBag.prototype.show = function (name, type, msg) {
        var i;

        if (arguments.length === 2) {
            name = 'global';
            type = name;
            msg = type;
        }

        name = _toCamelCase(name);

        if (msg.constructor !== Array) {
            msg = [msg];
        }

        if ( ! this._data.msgbags[name]) {
            this.register(name);
        }

        for (i in msg) {
            if (this._data.msgbags[name]) {
                if (this._data.msgbags[name].msgs.length >= this._data.msgbags[name].max) {
                    this._data.msgbags[name].msgs.shift();
                }

                this._data.msgbags[name].msgs.push({type: type, msg: msg[i]});
            }
        }

        this.hide();
    };

    MsgBag.prototype.success = function (name, msg) {
        this.show(msg ? name : 'global', 'success', msg || name);
    };

    MsgBag.prototype.error = function (name, msg) {
        this.show(msg ? name : 'global', 'error', msg || name);
    };

    MsgBag.prototype.warning = function (name, msg) {
        this.show(msg ? name : 'global', 'warning', msg || name);
    };

    MsgBag.prototype.hide = function (name) {
        var _this = this;

        name = _toCamelCase(name || 'global');

        if (this._data.msgbags[name]) {
            if (this._data.msgbags[name].msgs.length && ! _this._data.msgbags[name].timer) {
                this._data.msgbags[name].timer = setInterval(function () {
                    _this._data.msgbags[name].msgs.shift();
                    _this.hide(name);
                }, this._data.msgbags[name].timeout);
            }

            else if ( ! this._data.msgbags[name].msgs.length) {
                clearInterval(_this._data.msgbags[name].timer);
                _this._data.msgbags[name].timer = null;
            }
        }
    };

    MsgBag.prototype.option = function (name, key, val) {
        name = _toCamelCase(name || 'global');

        if ( ! this._data.msgbags[name]) {
            this.register(name);
        }

        if (val) {
            this._data.msgbags[name][key] = val;
        }
    };

    return function install(Vue, options) {
        var msgBag;

        options = options || {};
        options.Vue = Vue;
        options.max = options.max || 1;
        options.timeout = options.timeout || 1500;

        msgBag = new MsgBag(options);

        Vue.component(options.componentName || 'w-msgbag', require('./Shell.vue'));

        Object.defineProperties(Vue.prototype, {
            $msgbag: {
                get: function() {
                    return msgBag;
                }
            }
        });
    }
})();