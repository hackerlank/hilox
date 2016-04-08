//hilo game engine - guanghe fixed - http://hiloteam.github.io/
/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
//polyfiil for window.console.log
window.console = window.console||{log:function(){}};
    
var arrayProto = Array.prototype,
    slice = arrayProto.slice;

//polyfiil for Array.prototype.indexOf
arrayProto.indexOf = arrayProto.indexOf || function(elem, fromIndex){
    fromIndex = fromIndex || 0;
    var len = this.length, i;
    if(len == 0 || fromIndex >= len) return -1;
    if(fromIndex < 0) fromIndex = len + fromIndex;
    for(i = fromIndex; i < len; i++){
        if(this[i] === elem) return i;
    }
    return -1;
};

var fnProto = Function.prototype;

//polyfill for Function.prototype.bind
fnProto.bind = fnProto.bind || function(thisArg){
    var target = this,
        boundArgs = slice.call(arguments, 1),
        F = function(){};

    function bound(){
        var args = boundArgs.concat(slice.call(arguments));
        return target.apply(this instanceof bound ? this : thisArg, args);
    }

    F.prototype = target.prototype;
    bound.prototype = new F();

    return bound;
};
})(window);


//polyfill for requestAnimationFrame  cancelAnimationFrame
(function(window){
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    };
    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    };
})(window);


//color transform to {r:Number, g:Number, b:Number}
(function(window){
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
String.prototype.toColorRgb = function(){
	var sColor = this.toLowerCase();
	if(sColor && reg.test(sColor)){
		if(sColor.length === 4){
            return {
                r:parseInt("0x"+sColor.charAt(1)+sColor.charAt(1)),
                g:parseInt("0x"+sColor.charAt(2)+sColor.charAt(2)),
                b:parseInt("0x"+sColor.charAt(3)+sColor.charAt(3))
            };
		}else{
            return {
                r:parseInt("0x"+sColor.slice(1,3)),
                g:parseInt("0x"+sColor.slice(3,5)),
                b:parseInt("0x"+sColor.slice(5,7))
            };
        }
	}else{
		return {r:0,g:0,b:0};	
	}
};
})(window);




/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @namespace Hilo的基础核心方法集合。
 * @static
 * @module hilo/core/Hilo
 */
var Hilo = (function(){

var win = window, 
    doc = document, 
    docElem = doc.documentElement,
    uid = 0;

return {
    /**
     * 获取一个全局唯一的id。如Stage1，Bitmap2等。
     * @param {String} prefix 生成id的前缀。
     * @returns {String} 全局唯一id。
     */
    getUid: function(prefix){
        var id = ++uid;
        if(prefix) return prefix + "_" + id;
        return id;
    },

    /**
     * 简单的浅复制对象。
     * @param {Object} target 要复制的目标对象。
     * @param {Object} source 要复制的源对象。
     * @param {Boolean} strict 指示是否复制未定义的属性，默认为false，即不复制未定义的属性。
     * @returns {Object} 复制后的对象。
     */
    copy: function(target, source, strict){
        for(var key in source){
            if(!strict || target.hasOwnProperty(key) || target[key] !== undefined){
                target[key] = source[key];
            }
        }
        return target;
    },

    /**
     * 浏览器特性集合。包括：
     * <ul>
     * <li><b>jsVendor</b> - 浏览器厂商CSS前缀的js值。比如：webkit。</li>
     * <li><b>cssVendor</b> - 浏览器厂商CSS前缀的css值。比如：-webkit-。</li>
     * <li><b>supportStorage</b> - 是否支持本地存储localStorage。</li>
     * <li><b>supportTouch</b> - 是否支持触碰事件。</li>
     * <li><b>supportCanvas</b> - 是否支持canvas元素。</li>
     * </ul>
     */
    browser: (function(){
        var ua = navigator.userAgent;
        var data = {
            iphone: /iphone/i.test(ua),
            ipad: /ipad/i.test(ua),
            ipod: /ipod/i.test(ua),
            ios: /iphone|ipad|ipod/i.test(ua),
            android: /android/i.test(ua),
            webkit: /webkit/i.test(ua),
            chrome: /chrome/i.test(ua),
            safari: /safari/i.test(ua),
            firefox: /firefox/i.test(ua),
            ie: /msie/i.test(ua),
            opera: /opera/i.test(ua),
            supportTouch: 'ontouchstart' in win,
            supportCanvas: doc.createElement('canvas').getContext != null,
            supportStorage: false,
            supportOrientation: 'orientation' in win,
            supportDeviceMotion: 'ondevicemotion' in win
        };

        //`localStorage` is null or `localStorage.setItem` throws error in some cases (e.g. localStorage is disabled)
        try{
            var value = 'hilo';
            localStorage.setItem(value, value);
            localStorage.removeItem(value);
            data.supportStorage = true;
        }catch(e){ };

        //vendro prefix
        data.jsVendor = data.webkit ? 'webkit' : data.firefox ? 'Moz' : data.opera ? 'O' : data.ie ? 'ms' : '';
        data.cssVendor = '-' + data.jsVendor + '-';

        return data;
    })(),

    /**
     * 事件类型枚举对象。包括：
     * <ul>
     * <li><b>POINTER_START</b> - 鼠标或触碰开始事件。对应touchstart或mousedown。</li>
     * <li><b>POINTER_MOVE</b> - 鼠标或触碰移动事件。对应touchmove或mousemove。</li>
     * <li><b>POINTER_END</b> - 鼠标或触碰结束事件。对应touchend或mouseup。</li>
     * </ul>
     */
    event: (function(){
        var supportTouch = 'ontouchstart' in win;
        return {
            POINTER_START: supportTouch ? 'touchstart' : 'mousedown',
            POINTER_MOVE: supportTouch ? 'touchmove' : 'mousemove',
            POINTER_END: supportTouch ? 'touchend' : 'mouseup'
        };
    })(),

    /**
     * 可视对象对齐方式枚举对象。包括：
     * <ul>
     * <li><b>TOP_LEFT</b> - 左上角对齐。</li>
     * <li><b>TOP</b> - 顶部居中对齐。</li>
     * <li><b>TOP_RIGHT</b> - 右上角对齐。</li>
     * <li><b>LEFT</b> - 左边居中对齐。</li>
     * <li><b>CENTER</b> - 居中对齐。</li>
     * <li><b>RIGHT</b> - 右边居中对齐。</li>
     * <li><b>BOTTOM_LEFT</b> - 左下角对齐。</li>
     * <li><b>BOTTOM</b> - 底部居中对齐。</li>
     * <li><b>BOTTOM_RIGHT</b> - 右下角对齐。</li>
     * </ul>
     */
    align: {
        TOP_LEFT: 'TL', //top & left
        TOP: 'T', //top & center
        TOP_RIGHT: 'TR', //top & right
        LEFT: 'L', //left & center
        CENTER: 'C', //center
        RIGHT: 'R', //right & center
        BOTTOM_LEFT: 'BL', //bottom & left
        BOTTOM: 'B', //bottom & center
        BOTTOM_RIGHT: 'BR' //bottom & right
    },
 
    /**
     * 根据参数id获取一个DOM元素。此方法等价于document.getElementById(id)。
     * @param {String} id 要获取的DOM元素的id。
     * @returns {HTMLElement} 一个DOM元素。
     */
    getElement: function(id){
        return doc.getElementById(id);
    },
    /**
     * 获取DOM元素在页面中的内容显示区域。
     * @param {HTMLElement} elem DOM元素。
     * @returns {Object} DOM元素的可视区域。格式为：{left:0, top:0, width:100, height:100}。
     */
    getElementRect: function(elem){
        try{
            //this fails if it's a disconnected DOM node
            var bounds = elem.getBoundingClientRect();
        }catch(e){
            bounds = {top:elem.offsetTop, left:elem.offsetLeft, width:elem.offsetWidth, height:elem.offsetHeight};
        }

        var offsetX = ((win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)) || 0;
        var offsetY = ((win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0)) || 0;
        var styles = win.getComputedStyle ? win.getComputedStyle(elem) : elem.currentStyle;

        var parseIntFn = parseInt;
        var padLeft = (parseIntFn(styles.paddingLeft) + parseIntFn(styles.borderLeftWidth)) || 0;
        var padTop = (parseIntFn(styles.paddingTop) + parseIntFn(styles.borderTopWidth)) || 0;
        var padRight = (parseIntFn(styles.paddingRight) + parseIntFn(styles.borderRightWidth)) || 0;
        var padBottom = (parseIntFn(styles.paddingBottom) + parseIntFn(styles.borderBottomWidth)) || 0;
        var top = bounds.top || 0;
        var left = bounds.left || 0;

        return {
            left: left + offsetX + padLeft,
            top: top + offsetY + padTop,
            width: bounds.right - padRight - left - padLeft,
            height: bounds.bottom - padBottom - top - padTop
        };
    },

    /**
     * 创建一个DOM元素。可指定属性和样式。
     * @param {String} type 要创建的DOM元素的类型。比如：'div'。
     * @param {Object} properties 指定DOM元素的属性和样式。
     * @returns {HTMLElement} 一个DOM元素。
     */
    createElement: function(type, properties){
        var elem = doc.createElement(type), p, val, s;
        for(p in properties){
            val = properties[p];
            if(p === 'style'){
                for(s in val) elem.style[s] = val[s];
            }else{
                elem[p] = val;
            }
        }
        return elem;
    },

    /**
     * 设置可视对象DOM元素的CSS样式。
     * @param {View} obj 指定要设置CSS样式的可视对象。
     * @private
     */
    setElementStyleByView: function(obj, ignoreView){
        var prefix = Hilo.browser.jsVendor, px = 'px', flag = false;
        var parent = obj.parent,
            drawable = obj.drawable,
            elem = drawable.domElement,
            style = elem.style,
            stateCache = obj._stateCache || (obj._stateCache = {});
        
        if(parent){
            var parentElem = parent.drawable && parent.drawable.domElement;
            if(parentElem && parentElem != elem.parentNode){
                parentElem.appendChild(elem);
            }
        }

        if(this.cacheStateIfChanged(obj, ['visible'], stateCache)){
            style.display = !obj.visible ? 'none' : '';
        }
        if(this.cacheStateIfChanged(obj, ['alpha'], stateCache)){
            style.opacity = obj.alpha;
        }
        if(!obj.visible || obj.alpha <= 0) return;

        if(this.cacheStateIfChanged(obj, ['width'], stateCache)){
            style.width = (obj.width||0) + px;
        }
        if(this.cacheStateIfChanged(obj, ['height'], stateCache)){
            style.height = (obj.height||0) + px;
        }
        if(this.cacheStateIfChanged(obj, ['depth'], stateCache)){
            style.zIndex = obj.depth + 1;
        }
        if(this.cacheStateIfChanged(obj, ['clipChildren'], stateCache)){
            style.overflow = obj.clipChildren?'hidden':null;
        }
        if(flag = this.cacheStateIfChanged(obj, ['pivotX', 'pivotY'], stateCache)){
            style[prefix + 'TransformOrigin'] = obj.pivotX + px + ' ' + obj.pivotY + px;
        }
        if(this.cacheStateIfChanged(obj, ['x', 'y', 'rotation', 'scaleX', 'scaleY'], stateCache) || flag){
            style[prefix + 'Transform'] = 'translate(' + (obj.x - obj.pivotX) + 'px, ' + (obj.y - obj.pivotY) + 'px)' +
                                          'rotate(' + obj.rotation + 'deg)' +
                                          'scale(' + obj.scaleX + ', ' + obj.scaleY + ')';
        }
        
        if(ignoreView){
            style.pointerEvents = 'none';
            return;
        } 
        
        if(!style.pointerEvents){
            style.pointerEvents = 'none';
        }

        if(this.cacheStateIfChanged(obj, ['background'], stateCache)){
            style.backgroundColor = obj.background;
        }
        
        //render image as background
        var image = drawable.image;
        if(image){
            var src = image.src;
            if(src !== stateCache.image){
                stateCache.image = src;
                style.backgroundImage = 'url(' + src + ')';
            }

            var rect = drawable.rect;
            if(rect){
                var sx = rect[0], sy = rect[1];
                if(sx !== stateCache.sx){
                    stateCache.sx = sx;
                    style.backgroundPositionX = -sx + px;
                }
                if(sy !== stateCache.sy){
                    stateCache.sy = sy;
                    style.backgroundPositionY = -sy + px;
                }
            }
        }
    },

    /**
     * @private
     */
    cacheStateIfChanged: function(obj, propNames, stateCache){
        var i, len, name, value, changed = false;
        for(i = 0, len = propNames.length; i < len; i++){
            name = propNames[i];
            value = obj[name];
            if(value != stateCache[name]){
                stateCache[name] = value;
                changed = true;
            }
        }
        return changed;
    },

};

})();
window.Hilo = Hilo;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */ 

/**
 * 创建类示例：
 * <pre>
 * var Bird = Hilo.Class.create({
 *     Extends: Animal,
 *     Mixes: Event,
 *     constructor: function(name){
 *         this.name = name;
 *     },
 *     fly: function(){
 *         console.log('I am flying');
 *     },
 *     Statics: {
 *         isBird: function(bird){
 *             return bird instanceof Bird;
 *         }
 *     }
 * });
 *
 * var swallow = new Bird('swallow');
 * swallow.fly();
 * Bird.isBird(swallow);
 * </pre>
 * @namespace Class是提供类的创建的辅助工具。
 * @static
 * @module hilo/core/Class
 */
var Class = (function(){

/**
 * 根据参数指定的属性和方法创建类。
 * @param {Object} properties 要创建的类的相关属性和方法。主要有：
 * <ul>
 * <li><b>Extends</b> - 指定要继承的父类。</li>
 * <li><b>Mixes</b> - 指定要混入的成员集合对象。</li>
 * <li><b>Statics</b> - 指定类的静态属性或方法。</li>
 * <li><b>constructor</b> - 指定类的构造函数。</li>
 * <li>其他创建类的成员属性或方法。</li>
 * </ul>
 * @returns {Object} 创建的类。
 */
var create = function(properties){
    properties = properties || {};
    var clazz = properties.hasOwnProperty('constructor') ? properties.constructor : function(){};
    implement.call(clazz, properties);
    return clazz;
}

/**
 * @private
 */
var implement = function(properties){
    var proto = {}, key, value;
    for(key in properties){
        value = properties[key];
        if(classMutators.hasOwnProperty(key)){
            classMutators[key].call(this, value);
        }else{
            proto[key] = value;
        }
    }

    mix(this.prototype, proto);
};

var classMutators = /** @ignore */{
    Extends: function(parent){
        var existed = this.prototype, proto = createProto(parent.prototype);
        //inherit static properites
        mix(this, parent);
        //keep existed properties
        mix(proto, existed);
        //correct constructor
        proto.constructor = this;
        //prototype chaining
        this.prototype = proto;
        //shortcut to parent's prototype
        this.superclass = parent.prototype;
    },

    Mixes: function(items){
        items instanceof Array || (items = [items]);
        var proto = this.prototype, item;

        while(item = items.shift()){
            mix(proto, item.prototype || item);
        }
    },

    Statics: function(properties){
        mix(this, properties);
    }
};

/**
 * @private
 */
var createProto = (function(){
    if(Object.__proto__){
        return function(proto){
            return {__proto__: proto};
        }
    }else{
        var Ctor = function(){};
        return function(proto){
            Ctor.prototype = proto;
            return new Ctor();
        }
    }
})();

/**
 * 混入属性或方法。
 * @param {Object} target 混入目标对象。
 * @param {Object} source 要混入的属性和方法来源。可支持多个来源参数。
 * @returns {Object} 混入目标对象。
 */
var mix = function(target){
    for(var i = 1, len = arguments.length; i < len; i++){
        var source  = arguments[i], defineProps;
        for(var key in source){
            var prop = source[key];
            if(prop && typeof prop === 'object'){
                if(prop.value !== undefined || typeof prop.get === 'function' || typeof prop.set === 'function'){
                    defineProps = defineProps || {};
                    defineProps[key] = prop;
                    continue;
                }
            }
            target[key] = prop;
        }
        if(defineProps) defineProperties(target, defineProps);
    }

    return target;
};

try{
    var defineProperty = Object.defineProperty,
        defineProperties = Object.defineProperties;
    defineProperty({}, '$', {value:0});
}catch(e){
    if('__defineGetter__' in Object){
        defineProperty = function(obj, prop, desc){
            if('value' in desc) obj[prop] = desc.value;
            if('get' in desc) obj.__defineGetter__(prop, desc.get);
            if('set' in desc) obj.__defineSetter__(prop, desc.set);
            return obj;
        };
        defineProperties = function(obj, props){
            for(var prop in props){
                if(props.hasOwnProperty(prop)){
                    defineProperty(obj, prop, props[prop]);
                }
            }
            return obj;
        };
    }
}

return {create:create, mix:mix};

})();

Hilo.Class = Class;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class Event是一个包含事件相关功能的mixin。可以通过 Class.mix(target, Event) 来为target增加事件功能。
 * @mixin
 * @static
 * @module hilo/core/Event
 * @requires hilo/core/Class
 */
var Event = {
    _listeners: null,

    /**
     * 增加一个事件监听。
     * @param {String} type 要监听的事件类型。
     * @param {Function} listener 事件监听回调函数。
     * @param {Boolean} once 是否是一次性监听，即回调函数响应一次后即删除，不再响应。
     * @returns {Object} 对象本身。链式调用支持。
     */
    on: function(type, listener, once){
        var listeners = (this._listeners = this._listeners || {});
        var eventListeners = (listeners[type] = listeners[type] || []);
        for(var i = 0, len = eventListeners.length; i < len; i++){
            var el = eventListeners[i];
            if(el.listener === listener) return;
        }
        eventListeners.push({listener:listener, once:once});
        return this;
    },

    /**
     * 删除一个事件监听。如果不传入任何参数，则删除所有的事件监听；如果不传入第二个参数，则删除指定类型的所有事件监听。
     * @param {String} type 要删除监听的事件类型。
     * @param {Function} listener 要删除监听的回调函数。
     * @returns {Object} 对象本身。链式调用支持。
     */
    off: function(type, listener){
        //remove all event listeners
        if(arguments.length == 0){
            this._listeners = null;
            return this;
        }

        var eventListeners = this._listeners && this._listeners[type];
        if(eventListeners){
            //remove event listeners by specified type
            if(arguments.length == 1){
                delete this._listeners[type];
                return this;
            }

            for(var i = 0, len = eventListeners.length; i < len; i++){
                var el = eventListeners[i];
                if(el.listener === listener){
                    eventListeners.splice(i, 1);
                    if(eventListeners.length === 0) delete this._listeners[type];
                    break;
                }
            }
        }
        return this;
    },

    /**
     * 发送事件。当第一个参数类型为Object时，则把它作为一个整体事件对象。
     * @param {String} type 要发送的事件类型。
     * @param {Object} detail 要发送的事件的具体信息，即事件随带参数。
     * @returns {Boolean} 是否成功调度事件。
     */
    fire: function(type, detail){
        var event, eventType;
        if(typeof type === 'string'){
            eventType = type;
        }else{
            event = type;
            eventType = type.type;
        }

        var listeners = this._listeners;
        if(!listeners) return false;

        var eventListeners = listeners[eventType];
        if(eventListeners){
            eventListeners = eventListeners.slice(0);
            event = event || new EventObject(eventType, this, detail);
            if(event._stopped) return false;

            for(var i = 0; i < eventListeners.length; i++){
                var el = eventListeners[i];
                el.listener.call(this, event);
                if(el.once) eventListeners.splice(i--, 1);
            }

            if(eventListeners.length == 0) delete listeners[eventType];
            return true;
        }
        return false;
    }
};

/**
 * 事件对象类。当前仅为内部类，以后有需求的话可能会考虑独立为公开类。
 */
var EventObject = Class.create({
    constructor: function EventObject(type, target, detail){
        this.type = type;
        this.target = target;
        this.detail = detail;
        this.timeStamp = +new Date();
    },

    type: null,
    target: null,
    detail: null,
    timeStamp: 0,

    stopImmediatePropagation: function(){
        this._stopped = true;
    }
});

//Trick: `stopImmediatePropagation` compatibility
var RawEvent = window.Event;
if(RawEvent){
    var proto = RawEvent.prototype,
        stop = proto.stopImmediatePropagation;
    proto.stopImmediatePropagation = function(){
        stop && stop.call(this);
        this._stopped = true;
    }
}

Hilo.Event = Event;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class Matrix类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
 * @param {Number} a 缩放或旋转图像时影响像素沿 x 轴定位的值。
 * @param {Number} b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
 * @param {Number} c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
 * @param {Number} d 缩放或旋转图像时影响像素沿 y 轴定位的值。
 * @param {Number} tx 沿 x 轴平移每个点的距离。
 * @param {Number} ty 沿 y 轴平移每个点的距离。
 * @module hilo/core/Matrix
 * @requires hilo/core/Class
 */
var Matrix = Class.create(/** @lends Matrix.prototype */{
    constructor: function(a, b, c, d, tx, ty){
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    },

    /**
     * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
     * @param {Matrix} mtx 要连接到源矩阵的矩阵。
     * @returns {Matrix} 一个Matrix对象。
     */
    concat: function(mtx){
        var args = arguments,
            a = this.a, b = this.b, c = this.c, d = this.d,
            tx = this.tx, ty = this.ty;

        if(args.length >= 6){
            var ma = args[0], mb = args[1], mc = args[2],
                md = args[3], mx = args[4], my = args[5];
        }else{
            ma = mtx.a;
            mb = mtx.b;
            mc = mtx.c;
            md = mtx.d;
            mx = mtx.tx;
            my = mtx.ty;
        }

        this.a = a * ma + b * mc;
        this.b = a * mb + b * md;
        this.c = c * ma + d * mc;
        this.d = c * mb + d * md;
        this.tx = tx * ma + ty * mc + mx;
        this.ty = tx * mb + ty * md + my;
        return this;
    },

    /**
     * 对 Matrix 对象应用旋转转换。
     * @param {Number} angle 旋转的角度。
     * @returns {Matrix} 一个Matrix对象。
     */
    rotate: function(angle){
        var sin = Math.sin(angle), cos = Math.cos(angle),
            a = this.a, b = this.b, c = this.c, d = this.d,
            tx = this.tx, ty = this.ty;

        this.a = a * cos - b * sin;
        this.b = a * sin + b * cos;
        this.c = c * cos - d * sin;
        this.d = c * sin + d * cos;
        this.tx = tx * cos - ty * sin;
        this.ty = tx * sin + ty * cos;
        return this;
    },

    /**
     * 对矩阵应用缩放转换。
     * @param {Number} sx 用于沿 x 轴缩放对象的乘数。
     * @param {Number} sy 用于沿 y 轴缩放对象的乘数。
     * @returns {Matrix} 一个Matrix对象。
     */
    scale: function(sx, sy){
        this.a *= sx;
        this.d *= sy;
        this.c *= sx;
        this.b *= sy;
        this.tx *= sx;
        this.ty *= sy;
        return this;
    },

    /**
     * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
     * @param {Number} dx 沿 x 轴向右移动的量（以像素为单位）。
     * @param {Number} dy 沿 y 轴向右移动的量（以像素为单位）。
     * @returns {Matrix} 一个Matrix对象。
     */
    translate: function(dx, dy){
        this.tx += dx;
        this.ty += dy;
        return this;
    },

    /**
     * 为每个矩阵属性设置一个值，该值将导致 null 转换。通过应用恒等矩阵转换的对象将与原始对象完全相同。
     * @returns {Matrix} 一个Matrix对象。
     */
    identity: function(){
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    },

    /**
     * 执行原始矩阵的逆转换。您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
     * @returns {Matrix} 一个Matrix对象。
     */
    invert: function(){
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;
        var tx = this.tx;
        var i = a * d - b * c;

        this.a = d / i;
        this.b = -b / i;
        this.c = -c / i;
        this.d = a / i;
        this.tx = (c * this.ty - d * tx) / i;
        this.ty = -(a * this.ty - b * tx) / i;
        return this;
    },

    /**
     * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
     * @param {Object} point 想要获得其矩阵转换结果的点。
     * @param {Boolean} round 是否对点的坐标进行向上取整。
     * @param {Boolean} returnNew 是否返回一个新的点。
     * @returns {Object} 由应用矩阵转换所产生的点。
     */
    transformPoint: function(point, round, returnNew){
        var x = point.x * this.a + point.y * this.c + this.tx,
            y = point.x * this.b + point.y * this.d + this.ty;

        if(round){
            x = x + 0.5 >> 0;
            y = y + 0.5 >> 0;
        }
        if(returnNew) return {x:x, y:y};
        point.x = x;
        point.y = y;
        return point;
    }

});
Hilo.Matrix = Matrix;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class Ticker是一个定时器类。它可以按指定帧率重复运行，从而按计划执行代码。
 * @param {Number} fps 指定定时器的运行帧率。
 * @module hilo/core/Ticker
 * @requires hilo/core/Class
 * @requires hilo/core/Hilo
 */
var Ticker = Class.create(/** @lends Ticker.prototype */{
    constructor: function(fps){
        this._targetFPS = fps || 30;
        this._interval = 1000 / this._targetFPS;
        this._tickers = [];
    },

    _paused: false,
    _targetFPS: 0,
    _interval: 0,
    _intervalId: null,
    _tickers: null,
    _lastTime: 0,
    _tickCount: 0,
    _tickTime: 0,
    _measuredFPS: 0,

    /**
     * 启动定时器。
     * @param {Boolean} userRAF 是否使用requestAnimationFrame，默认为false。
     */
    start: function(useRAF){
        if(this._intervalId) return;
        this._lastTime = +new Date();

        var self = this, interval = this._interval,
            raf = window.requestAnimationFrame ||
                  window[Hilo.browser.jsVendor + 'RequestAnimationFrame'];

        if(useRAF && raf){
            var tick = function(){
                self._tick();
            }
            var runLoop = function(){
                self._intervalId = setTimeout(runLoop, interval);
                raf(tick);
            };
        }else{
            runLoop = function(){
                self._intervalId = setTimeout(runLoop, interval);
                self._tick();
            };
        }

        runLoop();
    },

    /**
     * 停止定时器。
     */
    stop: function(){
        clearTimeout(this._intervalId);
        this._intervalId = null;
        this._lastTime = 0;
    },

    /**
     * 暂停定时器。
     */
    pause: function(){
        this._paused = true;
    },

    /**
     * 恢复定时器。
     */
    resume: function(){
        this._paused = false;
    },

    /**
     * @private
     */
    _tick: function(){
        if(this._paused) return;
        var startTime = +new Date(),
            deltaTime = startTime - this._lastTime,
            tickers = this._tickers;

        //calculates the real fps
        if(++this._tickCount >= this._targetFPS){
            this._measuredFPS = 1000 / (this._tickTime / this._tickCount) + 0.5 >> 0;
            this._tickCount = 0;
            this._tickTime = 0;
        }else{
            this._tickTime += startTime - this._lastTime;
        }
        this._lastTime = startTime;

        for(var i = 0, len = tickers.length; i < len; i++){
            tickers[i].tick(deltaTime);
        }
    },

    /**
     * 获得测定的运行时帧率。
     */
    getMeasuredFPS: function(){
        return this._measuredFPS;
    },

    /**
     * 添加定时器对象。定时器对象必须实现 tick 方法。
     * @param {Object} tickObject 要添加的定时器对象。此对象必须包含 tick 方法。
     */
    addTick: function(tickObject){
        if(!tickObject || typeof(tickObject.tick) != 'function'){
            throw new Error('Ticker: The tick object must implement the tick method.');
        }
        this._tickers.push(tickObject);
    },

    /**
     * 删除定时器对象。
     * @param {Object} tickObject 要删除的定时器对象。
     */
    removeTick: function(tickObject){
        var tickers = this._tickers,
            index = tickers.indexOf(tickObject);
        if(index >= 0){
            tickers.splice(index, 1);
        }
    }

});
Hilo.Ticker = Ticker;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class Drawable是可绘制图像的包装。
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/core/Drawable
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @property {Object} image 要绘制的图像。即可被CanvasRenderingContext2D.drawImage使用的对象类型，可以是HTMLImageElement、HTMLCanvasElement、HTMLVideoElement等对象。
 * @property {array} rect 要绘制的图像的矩形区域。
 * @property {Object} domElement DOM实体
 */
var Drawable = Class.create(/** @lends Drawable.prototype */{
    constructor: function(properties){
        this.init(properties);
    },

    image: null,
    rect: null,
    domElement: null,

    /**
     * 初始化可绘制对象。
     * @param {Object} properties 要初始化的属性。
     */
    init: function(properties){
        var me = this, oldImage = me.image;
        if(Drawable.isDrawable(properties)){
            me.image = properties;
        }else{
            Hilo.copy(me, properties, true);
        }

        var image = me.image;
        if(typeof image === 'string'){
            if(oldImage && image === oldImage.getAttribute('src')){
                image = me.image = oldImage;
            }else{
                me.image = null;
                //load image dynamically
                var img = new Image();
                img.onload = function(){
                    img.onload = null;
                    me.init(img);
                };
                img.src = image;
                return;
            }
        }

        if(image && !me.rect) me.rect = [0, 0, image.width, image.height];
    },

    Statics: /** @lends Drawable */{
        /**
         * 判断参数elem指定的元素是否可包装成Drawable对象。
         * @param {Object} elem 要测试的对象。
         * @return {Boolean} 如果是可包装成Drawable对象则返回true，否则为false。
         */
        isDrawable: function(elem){
            if(!elem || !elem.tagName) return false;
            var tagName = elem.tagName.toLowerCase();
            return tagName === "img" || tagName === "canvas" || tagName === "video";
        }
    }
});
Hilo.Drawable = Drawable;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @private
 * @class javascript或JSONP加载器。
 * @module hilo/loader/ScriptLoader
 * @requires hilo/core/Class
 */
var ScriptLoader = Class.create({
    load: function(data){
        var me = this, src = data.src, isJSONP = data.type == 'jsonp';

        if(isJSONP){
            var callbackName = data.callbackName || 'callback';
            var callback = data.callback || 'jsonp' + (++ScriptLoader._count);
            var win = window;

            if(!win[callback]){
                win[callback] = function(result){
                    delete win[callback];
                }
            }
        }

        if(isJSONP) src += (src.indexOf('?') == -1 ? '?' : '&') + callbackName + '=' + callback;
        if(data.noCache) src += (src.indexOf('?') == -1 ? '?' : '&') + 't=' + (+new Date());

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = me.onLoad.bind(me);
        script.onerror = me.onError.bind(me);
        script.src = src;
        if(data.id) script.id = data.id;
        document.getElementsByTagName('head')[0].appendChild(script);
    },

    onLoad: function(e){
        var script = e.target;
        script.onload = script.onerror = null;
        return script;
    },

    onError: function(e){
        var script = e.target;
        script.onload = script.onerror = null;
        return e;
    },

    Statics: {
        _count: 0
    }

});
Hilo.ScriptLoader = ScriptLoader;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @private
 * @class 图片资源加载器。
 * @module hilo/loader/ImageLoader
 * @requires hilo/core/Class
 */
var ImageLoader = Class.create({
    load: function(data){
        var me = this;

        var image = new Image();
        if(data.crossOrigin){
            image.crossOrigin = data.crossOrigin;
        }

        image.onload = //me.onLoad.bind(image);
        function(){
            me.onLoad(image)
        };
        image.onerror = image.onabort = me.onError.bind(image);
        image.src = data.src + (data.noCache ? (data.src.indexOf('?') == -1 ? '?' : '&') + 't=' + (+new Date) : '');
    },

    onLoad: function(e){
        e = e||window.event;
        var image = e//e.target;
        image.onload = image.onerror = image.onabort = null;
        return image;
    },

    onError: function(e){
        var image = e.target;
        image.onload = image.onerror = image.onabort = null;
        return e;
    }

});
Hilo.ImageLoader = ImageLoader;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Event = Hilo.Event;
var ImageLoader = Hilo.ImageLoader;
var ScriptLoader = Hilo.ScriptLoader;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
 
//TODO: 超时timeout，失败重连次数maxTries，更多的下载器Loader，队列暂停恢复等。

/**
 * @class LoadQueue是一个队列下载工具。
 * @param {Object} source 要下载的资源。可以是单个资源对象或多个资源的数组。
 * @module hilo/loader/LoadQueue
 * @requires hilo/core/Class
 * @requires hilo/core/Event
 * @requires hilo/loader/ImageLoader
 * @requires hilo/loader/ScriptLoader
 * @property {Int} maxConnections 同时下载的最大连接数。默认为2。
 */
var LoadQueue = Class.create(/** @lends LoadQueue.prototype */{
    Mixes: Event,
    constructor: function(source){
        this._source = [];
        this.add(source);
    },

    maxConnections: 2, //TODO: 应该是每个host的最大连接数。

    _source: null,
    _loaded: 0,
    _connections: 0,
    _currentIndex: -1,

    /**
     * 增加要下载的资源。可以是单个资源对象或多个资源的数组。
     * @param {Object|Array} source 资源对象或资源对象数组。每个资源对象包含以下属性：
     * <ul>
     * <li><b>id</b> - 资源的唯一标识符。可用于从下载队列获取目标资源。</li>
     * <li><b>src</b> - 资源的地址url。</li>
     * <li><b>type</b> - 指定资源的类型。默认会根据资源文件的后缀来自动判断类型，不同的资源类型会使用不同的加载器来加载资源。</li>
     * <li><b>loader</b> - 指定资源的加载器。默认会根据资源类型来自动选择加载器，若指定loader，则会使用指定的loader来加载资源。</li>
     * <li><b>noCache</b> - 指示加载资源时是否增加时间标签以防止缓存。</li>
     * <li><b>size</b> - 资源对象的预计大小。可用于预估下载进度。</li>
     * </ul>
     * @returns {LoadQueue} 下载队列实例本身。
     */
    add: function(source){
        var me = this;
        if(source){
            source = source instanceof Array ? source : [source];
            me._source = me._source.concat(source);
        }
        return me;
    },

    /**
     * 根据id或src地址获取资源对象。
     * @param {String} id 指定资源的id或src。
     * @returns {Object} 资源对象。
     */
    get: function(id){
        if(id){
            var source = this._source;
            for(var i = 0; i < source.length; i++){
                var item = source[i];
                if(item.id === id || item.src === id){
                    return item;
                }
            }
        }
        return null;
    },

    /**
     * 根据id或src地址获取资源内容。
     * @param {String} id 指定资源的id或src。
     * @returns {Object} 资源内容。
     */
    getContent: function(id){
        var item = this.get(id);
        return item && item.content;
    },

    /**
     * 开始下载队列。
     * @returns {LoadQueue} 下载队列实例本身。
     */
    start: function(){
        var me = this;
        me._loadNext();
        return me;
    },

    /**
     * @private
     */
    _loadNext: function(){
        var me = this, source = me._source, len = source.length;

        //all items loaded
        if(me._loaded >= len){
            me.fire('complete');
            return;
        }

        if(me._currentIndex < len - 1 && me._connections < me.maxConnections){
            var index = ++me._currentIndex;
            var item = source[index];
            var loader = me._getLoader(item);

            if(loader){
                var onLoad = loader.onLoad, onError = loader.onError;

                loader.onLoad = function(e){
                    loader.onLoad = onLoad;
                    loader.onError = onError;
                    var content = onLoad && onLoad.call(loader, e) || e.target;
                    me._onItemLoad(index, content);
                };
                loader.onError = function(e){
                    loader.onLoad = onLoad;
                    loader.onError = onError;
                    onError && onError.call(loader, e);
                    me._onItemError(index, e);
                };
                me._connections++;
            }

            me._loadNext();
            loader && loader.load(item);
        }
    },

    /**
     * @private
     */
    _getLoader: function(item){
        var me = this, loader = item.loader;
        if(loader) return loader;

        var type = item.type || getExtension(item.src);

        switch(type){
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                loader = new ImageLoader();
                break;
            case 'js':
            case 'jsonp':
                loader = new ScriptLoader();
                break;
        }

        return loader;
    },

    /**
     * @private
     */
    _onItemLoad: function(index, content){
        var me = this, item = me._source[index];
        item.loaded = true;
        item.content = content;
        me._connections--;
        me._loaded++;
        me.fire('load', item);
        me._loadNext();
    },

    /**
     * @private
     */
    _onItemError: function(index, e){
        var me = this, item = me._source[index];
        item.error = e;
        me._connections--;
        me._loaded++;
        me.fire('error', item);
        me._loadNext();
    },

    /**
     * 获取全部或已下载的资源的字节大小。
     * @param {Boolean} loaded 指示是已下载的资源还是全部资源。默认为全部。
     * @returns {Number} 指定资源的字节大小。
     */
    getSize: function(loaded){
        var size = 0, source = this._source;
        for(var i = 0; i < source.length; i++){
            var item = source[i];
            size += (loaded ? item.loaded && item.size : item.size) || 0;
        }
        return size;
    },

    /**
     * 获取已下载的资源数量。
     * @returns {Uint} 已下载的资源数量。
     */
    getLoaded: function(){
        return this._loaded;
    },

    /**
     * 获取所有资源的数量。
     * @returns {Uint} 所有资源的数量。
     */
    getTotal: function(){
        return this._source.length;
    }

});

/**
 * @private
 */
function getExtension(src){
    var extRegExp = /\/?[^/]+\.(\w+)(\?\S+)?$/i, match, extension;
    if(match = src.match(extRegExp)){
        extension = match[1].toLowerCase();
    }
    return extension || null;
}
Hilo.LoadQueue = LoadQueue;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Event = Hilo.Event;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class HTMLAudio声音播放模块。此模块使用HTMLAudioElement播放音频。
 * 使用限制：iOS平台需用户事件触发才能播放，很多Android浏览器仅能同时播放一个音频。
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/audio/HTMLAudio
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @requires hilo/core/Event
 * @property {String} src 播放的音频的资源地址。
 * @property {Boolean} loop 是否循环播放。默认为false。
 * @property {Boolean} autoPlay 是否自动播放。默认为false。
 * @property {Boolean} loaded 音频资源是否已加载完成。只读属性。
 * @property {Boolean} playing 是否正在播放音频。只读属性。
 * @property {Number} duration 音频的时长。只读属性。
 * @property {Number} volume 音量的大小。取值范围：0-1。
 * @property {Boolean} muted 是否静音。默认为false。
 */
var HTMLAudio = Class.create(/** @lends HTMLAudio.prototype */{
    Mixes: Event,
    constructor: function(properties){
        Hilo.copy(this, properties, true);

        this._onAudioEvent = this._onAudioEvent.bind(this);
    },

    src: null,
    loop: false,
    autoPlay: false,
    loaded: false,
    playing: false,
    duration: 0,
    volume: 1,
    muted: false,

    _element: null, //HTMLAudioElement对象

    /**
     * 加载音频文件。
     */
    load: function(){
        if(!this._element){
            try{
                var elem = this._element = new Audio();
                elem.addEventListener('canplaythrough', this._onAudioEvent, false);
                elem.addEventListener('ended', this._onAudioEvent, false);
                elem.addEventListener('error', this._onAudioEvent, false);
                elem.src = this.src;
                elem.volume = this.volume;
                elem.load();
            }
            catch(err){
                //ie9 某些版本有Audio对象，但是执行play,pause会报错！
                var elem = this._element = {};
                elem.play = elem.pause = function(){

                };
            }
        }
        return this;
    },

    /**
     * @private
     */
    _onAudioEvent: function(e){
        // console.log('onAudioEvent:', e.type);
        var type = e.type;

        switch(type){
            case 'canplaythrough':
                e.target.removeEventListener(type, this._onAudioEvent);
                this.loaded = true;
                this.duration = this._element.duration;
                this.fire('load');
                if(this.autoPlay) this._doPlay();
                break;
            case 'ended':
                this.playing = false;
                this.fire('end');
                if(this.loop) this._doPlay();
                break;
            case 'error':
                this.fire('error');
                break;
        }
    },

    /**
     * @private
     */
    _doPlay: function(){
        if(!this.playing){
            this._element.volume = this.muted ? 0 : this.volume;
            this._element.play();
            this.playing = true;
        }
    },

    /**
     * 播放音频。如果正在播放，则会重新开始。
     * 注意：为了避免第一次播放不成功，建议在load音频后再播放。
     */
    play: function(){
        if(this.playing) this.stop();

        if(!this._element){
            this.autoPlay = true;
            this.load();
        }else if(this.loaded){
            this._doPlay();
        }

        return this;
    },

    /**
     * 暂停音频。
     */
    pause: function(){
        if(this.playing){
            this._element.pause();
            this.playing = false;
        }
        return this;
    },

    /**
     * 恢复音频播放。
     */
    resume: function(){
        if(!this.playing){
            this._doPlay();
        }
        return this;
    },

    /**
     * 停止音频播放。
     */
    stop: function(){
        if(this.playing){
            this._element.pause();
            this._element.currentTime = 0;
            this.playing = false;
        }
        return this;
    },

    /**
     * 设置音量。注意: iOS设备无法设置音量。
     */
    setVolume: function(volume){
        if(this.volume != volume){
            this.volume = volume;
            this._element.volume = volume;
        }
        return this;
    },

    /**
     * 设置静音模式。注意: iOS设备无法设置静音模式。
     */
    setMute: function(muted){
        if(this.muted != muted){
            this.muted = muted;
            this._element.volume = muted ? 0 : this.volume;
        }
        return this;
    },

    Statics: /** @lends HTMLAudio */ {
        /**
         * 浏览器是否支持HTMLAudio。
         */
        isSupported: window.Audio !== null
    }

});
Hilo.HTMLAudio = HTMLAudio;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Event = Hilo.Event;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class WebAudio声音播放模块。它具有更好的声音播放和控制能力，适合在iOS6+平台使用。
 * 兼容情况：iOS6+、Chrome33+、Firefox28+支持，但Android浏览器均不支持。
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/audio/WebAudio
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @requires hilo/core/Event
 * @property {String} src 播放的音频的资源地址。
 * @property {Boolean} loop 是否循环播放。默认为false。
 * @property {Boolean} autoPlay 是否自动播放。默认为false。
 * @property {Boolean} loaded 音频资源是否已加载完成。只读属性。
 * @property {Boolean} playing 是否正在播放音频。只读属性。
 * @property {Number} duration 音频的时长。只读属性。
 * @property {Number} volume 音量的大小。取值范围：0-1。
 * @property {Boolean} muted 是否静音。默认为false。
 */
var WebAudio = (function(){

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = AudioContext ? new AudioContext() : null;

return Class.create(/** @lends WebAudio.prototype */{
    Mixes: Event,
    constructor: function(properties){
        Hilo.copy(this, properties, true);

        this._init();
    },

    src: null,
    loop: false,
    autoPlay: false,
    loaded: false,
    playing: false,
    duration: 0,
    volume: 1,
    muted: false,

    _context: null, //WebAudio上下文
    _gainNode: null, //音量控制器
    _buffer: null, //音频缓冲文件
    _audioNode: null, //音频播放器
    _startTime: 0, //开始播放时间戳
    _offset: 0, //播放偏移量

    /**
     * @private 初始化
     */
    _init:function(){
        this._context = context;
        this._gainNode = context.createGain ? context.createGain() : context.createGainNode();
        this._gainNode.connect(context.destination);

        this._onAudioEvent = this._onAudioEvent.bind(this);
        this._onDecodeComplete = this._onDecodeComplete.bind(this);
        this._onDecodeError = this._onDecodeError.bind(this);
    },
    /**
     * 加载音频文件。注意：我们使用XMLHttpRequest进行加载，因此需要注意跨域问题。
     */
    load: function(){
        if(!this._buffer){
            var request = new XMLHttpRequest();
            request.src = this.src;
            request.open('GET', this.src, true);
            request.responseType = 'arraybuffer';
            request.onload = this._onAudioEvent;
            request.onprogress = this._onAudioEvent;
            request.onerror = this._onAudioEvent;
            request.send();
            this._buffer = true;
        }
        return this;
    },

    /**
     * @private
     */
    _onAudioEvent: function(e){
        // console.log('onAudioEvent:', e.type);
        var type = e.type;

        switch(type){
            case 'load':
                var request = e.target;
                request.onload = request.onprogress = request.onerror = null;
                this._context.decodeAudioData(request.response, this._onDecodeComplete, this._onDecodeError);
                request = null;
                break;
            case 'ended':
                this.playing = false;
                this.fire('end');
                if(this.loop) this._doPlay();
                break;
            case 'progress':
                this.fire(e);
                break;
            case 'error':
                this.fire(e);
                break;
        }
    },

    /**
     * @private
     */
    _onDecodeComplete: function(audioBuffer){
        this._buffer = audioBuffer;
        this.loaded = true;
        this.duration = audioBuffer.duration;
        // console.log('onDecodeComplete:', audioBuffer.duration);
        this.fire('load');
        if(this.autoPlay) this._doPlay();
    },

    /**
     * @private
     */
    _onDecodeError: function(){
        this.fire('error');
    },

    /**
     * @private
     */
    _doPlay: function(){
        this._clearAudioNode();

        var audioNode = this._context.createBufferSource();

        //some old browser are noteOn/noteOff -> start/stop
        if(!audioNode.start){
            audioNode.start = audioNode.noteOn;
            audioNode.stop = audioNode.noteOff;
        }

        audioNode.buffer = this._buffer;
        audioNode.onended = this._onAudioEvent;
        this._gainNode.gain.value = this.muted ? 0 : this.volume;
        audioNode.connect(this._gainNode);
        audioNode.start(0, this._offset);

        this._audioNode = audioNode;
        this._startTime = this._context.currentTime;
        this.playing = true;
    },

    /**
     * @private
     */
    _clearAudioNode: function(){
        var audioNode = this._audioNode;
        if(audioNode){
            audioNode.onended = null;
            // audioNode.disconnect(this._gainNode);
            audioNode.disconnect(0);
            this._audioNode = null;
        }
    },

    /**
     * 播放音频。如果正在播放，则会重新开始。
     */
    play: function(){
        if(this.playing) this.stop();

        if(this.loaded){
            this._doPlay();
        }else if(!this._buffer){
            this.autoPlay = true;
            this.load();
        }

        return this;
    },

    /**
     * 暂停音频。
     */
    pause: function(){
        if(this.playing){
            this._audioNode.stop(0);
            this._offset += this._context.currentTime - this._startTime;
            this.playing = false;
        }
        return this;
    },

    /**
     * 恢复音频播放。
     */
    resume: function(){
        if(!this.playing){
            this._doPlay();
        }
        return this;
    },

    /**
     * 停止音频播放。
     */
    stop: function(){
        if(this.playing){
            this._audioNode.stop(0);
            this._audioNode.disconnect();
            this._offset = 0;
            this.playing = false;
        }
        return this;
    },

    /**
     * 设置音量。
     */
    setVolume: function(volume){
        if(this.volume != volume){
            this.volume = volume;
            this._gainNode.gain.value = volume;
        }
        return this;
    },

    /**
     * 设置是否静音。
     */
    setMute: function(muted){
        if(this.muted != muted){
            this.muted = muted;
            this._gainNode.gain.value = muted ? 0 : this.volume;
        }
        return this;
    },

    Statics: /** @lends WebAudio */ {
        /**
         * 浏览器是否支持WebAudio。
         */
        isSupported: AudioContext != null,

        /**
         * 浏览器是否已激活WebAudio。
         */
        enabled: false,

        /**
         * 激活WebAudio。注意：需用户事件触发此方法才有效。激活后，无需用户事件也可播放音频。
         */
        enable: function(){
            if(!this.enabled && context){
                var source = context.createBufferSource();
                source.buffer = context.createBuffer(1, 1, 22050);
                source.connect(context.destination);
                source.start ? source.start(0, 0, 0) : source.noteOn(0, 0, 0);
                this.enabled = true;
                return true;
            }
            return this.enabled;
        }
    }
});

})();
Hilo.WebAudio = WebAudio;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var HTMLAudio = Hilo.HTMLAudio;
var WebAudio = Hilo.WebAudio;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * 使用示例:
 * <pre>
 * var audio = WebSound.getAudio({
 *     src: 'test.mp3',
 *     loop: false,
 *     volume: 1
 * }).on('load', function(e){
 *     console.log('load');
 * }).on('end', function(e){
 *     console.log('end');
 * }).play();
 * </pre>
 * @class 声音播放管理器。
 * @static
 * @module hilo/audio/WebSound
 * @requires hilo/core/Hilo
 * @requires hilo/audio/HTMLAudio
 * @requires hilo/audio/WebAudio
 */
var WebSound = {
    _audios: {},

    /**
     * 激活音频功能。注意：需用户事件触发此方法才有效。目前仅对WebAudio有效。
     */
    enableAudio: function(){
        if(WebAudio.isSupported){
            WebAudio.enable();
        }
    },

    /**
     * 获取音频对象。优先使用WebAudio。
     * @param {String|Object} source 若source为String，则为音频src地址；若为Object，则需包含src属性。
     * @returns {WebAudio|HTMLAudio} 音频播放对象实例。
     */
    getAudio: function(source){
        source = this._normalizeSource(source);
        var audio = this._audios[source.src];
        if(!audio){
            if(WebAudio.isSupported){
                audio = new WebAudio(source);
            }else if(HTMLAudio.isSupported){
                audio = new HTMLAudio(source);
            }
            this._audios[source.src] = audio;
        }

        return audio;
    },

    /**
     * 删除音频对象。
     * @param {String|Object} source 若source为String，则为音频src地址；若为Object，则需包含src属性。
     */
    removeAudio: function(source){
        var src = typeof source === 'string' ? source : source.src;
        var audio = this._audios[src];
        if(audio){
            audio.stop();
            audio.off();
            this._audios[src] = null;
            delete this._audios[src];
        }
    },

    /**
     * @private
     */
    _normalizeSource: function(source){
        var result = {};
        if(typeof source === 'string') result = {src:source};
        else Hilo.copy(result, source);
        return result;
    }

};
Hilo.WebSound = WebSound;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class 渲染器抽象基类。
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/renderer/Renderer
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @requires hilo/core/Drawable
 * @property {Object} canvas 渲染器对应的画布。它可能是一个普通的DOM元素，比如div，也可以是一个canvas画布元素。只读属性。
 * @property {Object} stage 渲染器对应的舞台。只读属性。
 * @property {String} renderType 渲染方式。只读属性。
 */
var Renderer = Class.create(/** @lends Renderer.prototype */{
    constructor: function(properties){
        properties = properties || {};
        Hilo.copy(this, properties, true);
    },

    renderType:null,
    canvas: null,
    stage: null,

    /**
     * 为开始绘制可视对象做准备。需要子类来实现。
     * @param {View} target 要绘制的可视对象。
     */
    startDraw: function(target){ return true; },

    /**
     * 绘制可视对象。需要子类来实现。
     * @param {View} target 要绘制的可视对象。
     */
    draw: function(target){ },

    /**
     * 结束绘制可视对象后的后续处理方法。需要子类来实现。
     * @param {View} target 要绘制的可视对象。
     */
    endDraw: function(target){ },

    /**
     * 对可视对象进行变换。需要子类来实现。
     */
    transform: function(){ },


    /**
     * 清除画布指定区域。需要子类来实现。
     * @param {Number} x 指定区域的x轴坐标。
     * @param {Number} y 指定区域的y轴坐标。
     * @param {Number} width 指定区域的宽度。
     * @param {Number} height 指定区域的高度。
     */
    clear: function(x, y, width, height){ },

    /**
     * 改变渲染器的画布大小。
     * @param {Number} width 指定渲染画布新的宽度。
     * @param {Number} height 指定渲染画布新的高度。
     */
    resize: function(width, height){ }
    
    

});
Hilo.Renderer = Renderer;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Renderer = Hilo.Renderer;
var Drawable = Hilo.Drawable;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class DOM+CSS3渲染器。将可视对象以DOM元素方式渲染出来。舞台Stage会根据参数canvas选择不同的渲染器，开发者无需直接使用此类。
 * @augments Renderer
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/renderer/DOMRenderer
 * @requires hilo/core/Class
 * @requires hilo/core/Hilo
 * @requires hilo/core/Drawable
 * @requires hilo/renderer/Renderer
 */
var DOMRenderer = (function(){

return Class.create({
    Extends: Renderer,
    constructor: function(properties){
        DOMRenderer.superclass.constructor.call(this, properties);
    },
    renderType:'dom',
    /**
     * 为开始绘制可视对象做准备。需要子类来实现。
     * @param {View} target 要绘制的可视对象。
     */
    startDraw: function(target){ 
        var drawable = (target.drawable = target.drawable || new Drawable());
        drawable.domElement = (drawable.domElement || Hilo.createElement('div', {style: {position: 'absolute'}}));

        return target.visible; 
    },

    /**
     * 绘制可视对象。需要子类来实现。
     * @param {View} target 要绘制的可视对象。
     */
    draw: function(target){
        Hilo.setElementStyleByView(target);
    },


    /**
     * @private
     * @see Renderer#resize
     */
    resize: function(width, height){
        var style = this.canvas.style;
        style.width = width + 'px';
        style.height = height + 'px';
        if(style.position != "absolute") {
          style.position = "relative";
        }
    }
});



})();

Hilo.DOMRenderer = DOMRenderer;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Renderer = Hilo.Renderer;
var Matrix = Hilo.Matrix;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * Heavily inspired by PIXI's SpriteRenderer:
 * https://github.com/pixijs/pixi.js/blob/v3.0.9/src/core/sprites/webgl/SpriteRenderer.js
 */

var DEG2RAD = Math.PI / 180;
/**
 * @class webgl画布渲染器。所有可视对象将渲染在canvas画布上。
 * @augments Renderer
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/renderer/WebGLRenderer
 * @requires hilo/core/Class
 * @requires hilo/core/Matrix
 * @requires hilo/renderer/Renderer
 * @property {WebGLRenderingContext} gl webgl上下文。只读属性。
 */
var WebGLRenderer = Class.create(/** @lends WebGLRenderer.prototype */{
    Extends: Renderer,
    Statics:/** @lends WebGLRenderer */{
        /**
         * 最大批渲染数量。
         * @type {Number}
         */
        MAX_BATCH_NUM:2000,
        /**
         * 顶点属性数。只读属性。
         * @type {Number}
         */
        ATTRIBUTE_NUM:5,
        /**
         * 是否支持WebGL。只读属性。
         * @type {Boolean}
         */
        isSupport:null
    },
    renderType:'webgl',
    gl:null,
    constructor: function(properties){
        WebGLRenderer.superclass.constructor.call(this, properties);
        var gl = this.gl = this.canvas.getContext("webgl", {stencil:true})||this.canvas.getContext('experimental-webgl', {stencil:true});


        //gl setup------------------------------------------------------
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.STENCIL_TEST);
        

        this._initShaders();
        
        //for bg draw-------------------------------------------------
        this.vertex2 = new Float32Array(4 * 2);
        this.indexs2 = new Uint16Array([0,1,2,1,2,3]);
        this.notextureShader.active();  
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexs2, gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertex2, gl.STREAM_DRAW);     
        
        //for image draw---------------------------------------------
        this.maxBatchNum = WebGLRenderer.MAX_BATCH_NUM;
        this.positionStride = WebGLRenderer.ATTRIBUTE_NUM * 4;
        var vertexNum = this.maxBatchNum * WebGLRenderer.ATTRIBUTE_NUM * 4;
        var indexNum = this.maxBatchNum * 6;
        this.vertex = new Float32Array(vertexNum);
        this.indexs = new Uint16Array(indexNum);
        for (var i=0, j=0; i < indexNum; i += 6, j += 4)
        {
            this.indexs[i + 0] = j + 0;
            this.indexs[i + 1] = j + 1;
            this.indexs[i + 2] = j + 2;
            this.indexs[i + 3] = j + 1;
            this.indexs[i + 4] = j + 2;
            this.indexs[i + 5] = j + 3;
        }
        this.batchIndex = 0;
        this.sprites = [];
        
        this.defaultShader.active();  
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexs, gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertex, gl.STREAM_DRAW);
        
    },

    context: null,

    /**
     * @private
     * @see Renderer#startDraw
     */
    startDraw: function(target){
        if(target.visible && target.alpha > 0){
            target.__webglWorldMatrix = target.__webglWorldMatrix||new Matrix(1, 0, 0, 1, 0, 0);
            target.__webglRenderAlpha = target.__webglRenderAlpha||1;
            return true;
        }
        return false;
    },

    /**
     * @private
     * @see Renderer#draw
     */
    draw: function(target){
        var drawable = target.drawable, 
            image = drawable && drawable.image,
            bg = target.background;
        

        if(this.batchIndex >= this.maxBatchNum || bg){
            this._renderBatches();
        }

        if(target.clipChildren){
            this.stencilLevel = this.stencilLevel||0;
            var gl = this.gl;
            if(this.stencilLevel === 0){
                gl.enable(gl.STENCIL_TEST);
                gl.clear(gl.STENCIL_BUFFER_BIT);
                gl.stencilFunc(gl.ALWAYS,1,0xFF);
                gl.stencilOp(gl.KEEP,gl.REPLACE,gl.REPLACE);
            }else{
                gl.stencilOp(gl.KEEP,gl.INCR,gl.INCR);
            }
            gl.colorMask(false, false, false, false);
            
            this.notextureShader.active();
            this._renderBackground(target, {r:1,g:1,b:1});
            this.stencilLevel = this.stencilLevel + 1;
            
            gl.colorMask(true, true, true, true);
            gl.stencilFunc(gl.LEQUAL,this.stencilLevel,0xFF);
            gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
            
            
        }
      
        
        if(bg){
            this.notextureShader.active();
            this._renderBackground(target, bg.toColorRgb());
            
        }
        if(image){
            this.defaultShader.active();
            this._renderImage(target, image, drawable.rect);
        }
        
    },

    /**
     * @private
     * @see Renderer#endDraw
     */
    endDraw: function(target){
        if(target === this.stage){
            this._renderBatches();
        }
        if(target.clipChildren){
            var gl = this.gl;
            this.stencilLevel = this.stencilLevel - 1;
            gl.stencilFunc(gl.LEQUAL,this.stencilLevel,0xFF);
            if(this.stencilLevel == 0){
                this._renderBatches();
                gl.disable(this.gl.STENCIL_TEST);
            }
        }
    },
    /**
     * @private
     * @see Renderer#transform
     */
    transform: function(target){
        this._setConcatenatedMatrix(target, target.parent);
        
        if(target.alpha > 0) {
            if(target.parent && target.parent.__webglRenderAlpha){
                target.__webglRenderAlpha = target.alpha * target.parent.__webglRenderAlpha;
            }
            else{
                target.__webglRenderAlpha = target.alpha;
            }
        }
    },


    /**
     * @private
     * @see Renderer#clear
     */
    clear: function(x, y, width, height){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    },

    /**
     * @private
     * @see Renderer#resize
     */
    resize: function(width, height){
        if(this.width !== width || this.height !== height){
            this.width = this.canvas.width = width;
            this.height = this.canvas.height = height;
            this.gl.viewport(0, 0, width, height);
            
            this.activeShader.active(true);//re active current shader
        }
    },
    
    _renderBackground:function(target, c){
        var gl = this.gl;
        var a = target.__webglRenderAlpha;
        gl.uniform4f(this.activeShader.u_color,c.r/255.0*a,c.g/255.0*a,c.b/255.0*a, a);
        
       
        var w = target.width, h = target.height, x = -target.pivotX, y = target.pivotY - h;
        var positions = this.vertex2;
          
        positions[0] = x;  
        positions[1] = y; 

        positions[2] = x+w;
        positions[3] = y; 

        positions[4] = x; 
        positions[5] = y+h;

        positions[6] = x+w;
        positions[7] = y+h;

        var matrix = target.__webglWorldMatrix;
        for(var i = 0;i < 4;i ++){
            var x = positions[i*2];
            var y = positions[i*2 + 1];

            positions[i*2] = matrix.a*x+matrix.c*y + matrix.tx;
            positions[i*2 + 1] = matrix.b*x+matrix.d*y + matrix.ty;
        }
        
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STREAM_DRAW);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    },
    _renderImage:function(target, image, rect){
        if(!image.texture){
            this.activeShader.uploadTexture(image);
        }
        
        var gl = this.gl, w = target.width, h = target.height, px = -target.pivotX, py = -target.pivotY;
        var vertexs = this._createVertexs(image, rect[0], rect[1], rect[2], rect[3], px, py, w, h);
        var index = this.batchIndex * this.positionStride;
        var positions = this.vertex;
        var alpha = target.__webglRenderAlpha;
        
        positions[index + 0] = vertexs[0];//x
        positions[index + 1] = vertexs[1];//y
        positions[index + 2] = vertexs[2];//uvx
        positions[index + 3] = vertexs[3];//uvy
        positions[index + 4] = alpha;//alpha

        positions[index + 5] = vertexs[4];
        positions[index + 6] = vertexs[5];
        positions[index + 7] = vertexs[6];
        positions[index + 8] = vertexs[7];
        positions[index + 9] = alpha;

        positions[index + 10] = vertexs[8]
        positions[index + 11] = vertexs[9]
        positions[index + 12] = vertexs[10]
        positions[index + 13] = vertexs[11]
        positions[index + 14] = alpha;

        positions[index + 15] = vertexs[12]
        positions[index + 16] = vertexs[13]
        positions[index + 17] = vertexs[14]
        positions[index + 18] = vertexs[15]
        positions[index + 19] = alpha;

        var matrix = target.__webglWorldMatrix;
        for(var i = 0;i < 4;i ++){
            var x = positions[index + i*5];
            var y = positions[index + i*5 + 1];

            positions[index + i*5] = matrix.a*x+matrix.c*y + matrix.tx;
            positions[index + i*5 + 1] = matrix.b*x+matrix.d*y + matrix.ty;
        }

        target.texture = image.texture;
        this.sprites[this.batchIndex++] = target;
    },
    _renderBatches:function(){
        var gl = this.gl;
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertex.subarray(0, this.batchIndex * this.positionStride));
        var startIndex = 0;
        var batchNum = 0;
        var preTexture = null;
        for(var i = 0;i < this.batchIndex;i ++){
            var sprite = this.sprites[i];
            if(preTexture && preTexture !== sprite.texture){
                this._renderBatch(startIndex, i);
                startIndex = i;
                batchNum = 1;
            }
            preTexture = sprite.texture;
        }
        this._renderBatch(startIndex, this.batchIndex);
        this.batchIndex = 0;
    },
    _renderBatch:function(start, end){
        var gl = this.gl;
        var num = end - start;
        if(num > 0){
            gl.bindTexture(gl.TEXTURE_2D, this.sprites[start].texture);
            gl.drawElements(gl.TRIANGLES, num * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
        }
    },
    _initShaders:function(){
        var VSHADER_SOURCE = "" +
            "attribute vec2 a_position;\n" +
            "attribute vec2 a_TexCoord;\n" +
            "attribute float a_alpha;\n" +
            "uniform mat3 u_projectionTransform;\n" +
            "varying vec2 v_TexCoord;\n" +
            "varying float v_alpha;\n" +
            "void main(){\n" +
            "    gl_Position =  vec4((u_projectionTransform * vec3(a_position, 1.0)).xy, 1.0, 1.0);\n" +
            "    v_TexCoord = a_TexCoord;\n" +
            "    v_alpha = a_alpha;\n" +
            "}\n";

        var FSHADER_SOURCE = "\n" +
            "precision mediump float;\n" +
            "uniform sampler2D u_Sampler;\n" +
            "varying vec2 v_TexCoord;\n" +
            "varying float v_alpha;\n" +
            "void main(){\n" +
            "    gl_FragColor = texture2D(u_Sampler, v_TexCoord) * v_alpha;\n" +
            "}\n";

        this.defaultShader = new Shader(this, {
            v:VSHADER_SOURCE,
            f:FSHADER_SOURCE
        },{
            attributes:[{name:"a_position",count:2,offset:0,stride:20},{name:"a_TexCoord",count:2,offset:8,stride:20},{name:"a_alpha",count:1,offset:16,stride:20}],
            uniforms:["u_projectionTransform", "u_Sampler"]
        });
        
        var VSHADER_SOURCE_NO_TEXTURE = "" +
            "attribute vec2 a_position;\n" +
            "uniform mat3 u_projectionTransform;\n" +
            "void main(){\n" +
            "    gl_Position =  vec4((u_projectionTransform * vec3(a_position, 1.0)).xy, 1.0, 1.0);\n" +
            "}\n";

        var FSHADER_SOURCE_NO_TEXTURE = "\n" +
            "precision mediump float;\n" +
            "uniform vec4 u_color;\n" +
            "void main(){\n" +
            "    gl_FragColor = u_color;\n" +
            "}\n";

        this.notextureShader = new Shader(this, {
            v:VSHADER_SOURCE_NO_TEXTURE,
            f:FSHADER_SOURCE_NO_TEXTURE
        },{
            attributes:[{name:"a_position",count:2,offset:0,stride:8}],
            uniforms:["u_projectionTransform", "u_color"]
        });
    },
    _createVertexs:function(img, tx, ty, tw, th, x, y, w, h){
        var tempVertexs = this.__tempVertexs||[];
        var width = img.width;
        var height = img.height;

        tw = tw/width;
        th = th/height;
        tx = tx/width;
        ty = ty/height;

        w = w;
        h = h;
        x = x;
        y = y;

        if(tw + tx > 1){
            tw = 1 - tx;
        }

        if(th + ty > 1){
            th = 1 - ty;
        }

        ty = 1 - ty - th;

        y = -h - y;

        var index = 0;
        tempVertexs[index++] = x; tempVertexs[index++] = y; tempVertexs[index++] = tx; tempVertexs[index++] = ty;
        tempVertexs[index++] = x+w;tempVertexs[index++] = y; tempVertexs[index++] = tx+tw; tempVertexs[index++] = ty;
        tempVertexs[index++] = x; tempVertexs[index++] = y+h; tempVertexs[index++] = tx;tempVertexs[index++] = ty+th;
        tempVertexs[index++] = x+w;tempVertexs[index++] = y+h;tempVertexs[index++] = tx+tw;tempVertexs[index++] = ty+th;

        return tempVertexs;
    },
    _setConcatenatedMatrix:function(view, ancestor){
        var mtx = view.__webglWorldMatrix;
        var cos = 1, sin = 0,
            rotation = 360-view.rotation % 360,
            pivotX = view.pivotX, pivotY = view.pivotY,
            scaleX = view.scaleX, scaleY = view.scaleY;

        if(rotation){
            var r = rotation * DEG2RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
        }

        mtx.a = cos*scaleX;
        mtx.b = sin*scaleX;
        mtx.c = -sin*scaleY;
        mtx.d = cos*scaleY;
        mtx.tx = view.x;
        mtx.ty = -view.y;

        var aMtx = ancestor.__webglWorldMatrix;
        mtx.concat(aMtx.a, aMtx.b, aMtx.c, aMtx.d, aMtx.tx, aMtx.ty);
    }
});

/**
 * shader
 * @param {WebGLRenderer} renderer [description]
 * @param {Object} source
 * @param {String} source.v 顶点shader
 * @param {String} source.f 片段shader
 * @param {Object} attr
 * @param {Array} attr.attributes attribute数组
 * @param {Array} attr.uniforms uniform数组
 */
var _cacheTexture = {};
var Shader = function(renderer, source, attr){
    this.renderer = renderer;
    this.gl = renderer.gl;
    this.program = this._createProgram(this.gl, source.v, source.f);

    attr = attr||{};
    this.attributes = attr.attributes||[];
    this.uniforms = attr.uniforms||[];
    
    
    this.vertexBuffer = this.gl.createBuffer();
    this.indexBuffer = this.gl.createBuffer();

}

Shader.prototype = {
    active:function(force){
        var that = this;
        var renderer = that.renderer;
        var oldShader = renderer.activeShader
               
        if((oldShader === that) && (!force)){
            return
        }
        
        var gl = that.gl;
        var program = that.program;

        if(program && gl){
            if(oldShader){
                oldShader.attributes.forEach(function(v){
                    gl.disableVertexAttribArray(oldShader[v.name]);
                });
            }
        
            renderer.activeShader = that;
            gl.useProgram(program);
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indexBuffer);
            gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer);
            
            
            that.attributes.forEach(function(v){
                attribute = v.name;
                that[attribute] = (that[attribute] || gl.getAttribLocation(program, attribute));
                gl.enableVertexAttribArray(that[attribute]);
                gl.vertexAttribPointer(that[attribute], v.count, gl.FLOAT, false, v.stride, v.offset);
            });

            that.uniforms.forEach(function(uniform){
                that[uniform] = (that[uniform] || gl.getUniformLocation(program, uniform));
            });
            
            if(that.width !== renderer.width || that.height !== renderer.height){
                that.width = renderer.width;
                that.height = renderer.height;
                that.uploadProjectionTransform(true);
            }
        }
    },
    uploadTexture:function(image){
        var gl = this.gl;
        var renderer = this.renderer;
        if(_cacheTexture[image.src]){
            image.texture = _cacheTexture[image.src];
        }
        else{
            var texture = gl.createTexture();

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.uniform1i(this.u_Sampler, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);

            image.texture = texture;
            _cacheTexture[image.src] = texture;
        }
    },
    uploadProjectionTransform:function(force){
        var gl = this.gl;
        if(!this._projectionTransformElements||force){
            this._projectionTransformElements = new Float32Array([
                2/this.width, 0, 0,
                0, 2/this.height, 0,
                -1, 1, 1,
            ]);
        }
        gl.uniformMatrix3fv(this.u_projectionTransform, false, this._projectionTransformElements);
    },
    _createProgram:function(gl, vshader, fshader){
        var vertexShader = this._createShader(gl, gl.VERTEX_SHADER, vshader);
        var fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, fshader);
        if (!vertexShader || !fragmentShader) {
            return null;
        }

        var program = gl.createProgram();
        if (program) {
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            gl.linkProgram(program);

            gl.deleteShader(fragmentShader);
            gl.deleteShader(vertexShader);
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked) {
                var error = gl.getProgramInfoLog(program);
                console.log('Failed to link program: ' + error);
                gl.deleteProgram(program);
                return null;
            }
        }
        return program;
    },
    _createShader:function(gl, type, source){
        var shader = gl.createShader(type);
        if(shader){
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                var error = gl.getShaderInfoLog(shader);
                console.log('Failed to compile shader: ' + error);
                gl.deleteShader(shader);
                return null;
            }
        }
        return shader;
    }
};

WebGLRenderer.isSupport = function(){
    if(this._isSupport !== undefined){
        return this._isSupport;
    }
    else{
        var canvas = document.createElement('canvas');
        if(canvas.getContext && (canvas.getContext('webgl')||canvas.getContext('experimental-webgl'))){
            this._isSupport = true;
        }
        else{
            this._isSupport = false;
        }
        return this._isSupport;
    }
};
Hilo.WebGLRenderer = WebGLRenderer;
})(window);
/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Renderer = Hilo.Renderer;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class canvas画布渲染器。所有可视对象将渲染在canvas画布上。舞台Stage会根据参数canvas选择不同的渲染器，开发者无需直接使用此类。
 * @augments Renderer
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/renderer/CanvasRenderer
 * @requires hilo/core/Class
 * @requires hilo/core/Hilo
 * @requires hilo/renderer/Renderer
 * @property {CanvasRenderingContext2D} context canvas画布的上下文。只读属性。
 */
var CanvasRenderer = Class.create(/** @lends CanvasRenderer.prototype */{
    Extends: Renderer,
    constructor: function(properties){
        CanvasRenderer.superclass.constructor.call(this, properties);

        this.context = this.canvas.getContext("2d");
    },
    renderType:'canvas',
    context: null,

    /**
     * @private
     * @see Renderer#startDraw
     */
    startDraw: function(target){
        if(target.visible && target.alpha > 0){
            this.context.save();
            
            return true;
        }
        return false;
    },

    /**
     * @private
     * @see Renderer#draw
     */
    draw: function(target){
        var ctx = this.context, w = target.width, h = target.height;

        if(target.clipChildren){
            ctx.beginPath();
            ctx.rect(0,0,w,h);
            ctx.clip();
        }
        
        //draw background
        var bg = target.background;
        if(bg){
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);
        }

        //draw image
        var drawable = target.drawable, image = drawable && drawable.image;
        if(image){
            var rect = drawable.rect;
            ctx.drawImage(image, rect[0], rect[1], rect[2], rect[3], 0, 0, w, h);
        }
    },

    /**
     * @private
     * @see Renderer#endDraw
     */
    endDraw: function(target){
        this.context.restore();
    },

    /**
     * @private
     * @see Renderer#transform
     */
    transform: function(target){
        var ctx = this.context,
            x = target.x,
            y = target.y,
            scaleX = target.scaleX,
            scaleY = target.scaleY,
            pivotX = target.pivotX,
            pivotY = target.pivotY,
            rotation = target.rotation % 360;


        //alignment
        var align = target.align;
        if(align){
            if(typeof align === 'function'){
                target.align();
            }else{
                var parent = target.parent;
                if(parent){
                    var w = target.width, h = target.height,
                        pw = parent.width, ph = parent.height;
                    switch(align){
                        case 'TL':
                            x = 0;
                            y = 0;
                            break;
                        case 'T':
                            x = pw - w >> 1;
                            y = 0;
                            break;
                        case 'TR':
                            x = pw - w;
                            y = 0;
                            break;
                        case 'L':
                            x = 0;
                            y = ph - h >> 1;
                            break;
                        case 'C':
                            x = pw - w >> 1;
                            y = ph - h >> 1;
                            break;
                        case 'R':
                            x = pw - w;
                            y = ph - h >> 1;
                            break;
                        case 'BL':
                            x = 0;
                            y = ph - h;
                            break;
                        case 'B':
                            x = pw - w >> 1;
                            y = ph - h;
                            break;
                        case 'BR':
                            x = pw - w;
                            y = ph - h;
                            break;
                    }
                }
            }
        }

        if(x != 0 || y != 0) ctx.translate(x, y);
        if(rotation != 0) ctx.rotate(rotation * Math.PI / 180);
        if(scaleX != 1 || scaleY != 1) ctx.scale(scaleX, scaleY);
        if(pivotX != 0 || pivotY != 0) ctx.translate(-pivotX, -pivotY);
        if(target.alpha > 0) ctx.globalAlpha *= target.alpha;
    },


    /**
     * @private
     * @see Renderer#clear
     */
    clear: function(x, y, width, height){
        this.context.clearRect(x, y, width, height);
    },

    /**
     * @private
     * @see Renderer#resize
     */
    resize: function(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
    }

});
Hilo.CanvasRenderer = CanvasRenderer;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Event = Hilo.Event;
var Matrix = Hilo.Matrix;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class View类是所有可视对象或组件的基类。
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/view/View
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
* @requires hilo/core/Event
 * @requires hilo/core/Matrix
 * @property {String} id 可视对象的唯一标识符。
 * @property {Number} x 可视对象的x轴坐标。默认值为0。
 * @property {Number} y 可视对象的y轴坐标。默认值为0。
 * @property {Number} width 可视对象的宽度。默认值为0。
 * @property {Number} height 可视对象的高度。默认值为0。
 * @property {Number} alpha 可视对象的透明度。默认值为1。
 * @property {Number} rotation 可视对象的旋转角度。默认值为0。
 * @property {Boolean} visible 可视对象是否可见。默认为可见，即true。
 * @property {Number} pivotX 可视对象的中心点的x轴坐标。默认值为0。
 * @property {Number} pivotY 可视对象的中心点的y轴坐标。默认值为0。
 * @property {Number} scaleX 可视对象在x轴上的缩放比例。默认为不缩放，即1。
 * @property {Number} scaleY 可视对象在y轴上的缩放比例。默认为不缩放，即1。
 * @property {Boolean} pointerEnabled 可视对象是否接受交互事件。默认为接受交互事件，即true。
 * @property {Object} background 可视对象的背景样式。可以是CSS颜色值、canvas的gradient或pattern填充。
 * @property {String|Function} align 可视对象相对于父容器的对齐方式。取值可查看Hilo.align枚举对象。
 * @property {Container} parent 可视对象的父容器。只读属性。
 * @property {Number} depth 可视对象的深度，也即z轴的序号。只读属性。
 * @property {Drawable} drawable 可视对象的可绘制对象。供高级开发使用。
 * @property {Array} boundsArea 可视对象的区域顶点数组。格式为：[{x:10, y:10}, {x:20, y:20}]。
 */
var View = (function(){

return Class.create(/** @lends View.prototype */{
    Mixes: Event,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid("View");
        Hilo.copy(this, properties, true);
    },

    id: null,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    alpha: 1,
    rotation: 0,
    visible: true,
    pivotX: 0,
    pivotY: 0,
    scaleX: 1,
    scaleY: 1,
    pointerEnabled: true,
    background: null,
    align: null,
    drawable: null,
    boundsArea: null,
    parent: null,
    depth: -1,

    /**
     * 返回可视对象的舞台引用。若对象没有被添加到舞台，则返回null。
     * @returns {Stage} 可视对象的舞台引用。
     */
    getStage: function(){
        var obj = this, parent;
        while(parent = obj.parent) obj = parent;
        if(obj.canvas && obj.renderer) return obj;
        return null;
    },

    /**
     * 返回可视对象缩放后的宽度。
     * @returns {Number} 可视对象缩放后的宽度。
     */
    getScaledWidth: function(){
        return this.width * this.scaleX;
    },

    /**
     * 返回可视对象缩放后的高度。
     * @returns {Number} 可视对象缩放后的高度。
     */
    getScaledHeight: function(){
        return this.height * this.scaleY;
    },

    /**
     * 添加此对象到父容器。
     * @param {Container} container 一个容器。
     * @param {Uint} index 要添加到索引位置。
     * @returns {View} 可视对象本身。
     */
    addTo: function(container, index){
        if(typeof index === 'number') container.addChildAt(this, index);
        else container.addChild(this);
        return this;
    },

    /**
     * 从父容器里删除此对象。
     * @returns {View} 可视对象本身。
     */
    removeFromParent: function(){
        var parent = this.parent;
        if(parent) parent.removeChild(this);
        return this;
    },
    /**
     * 修正自身width&height
     */
    fixSize: function(){
        //fix width/height
        if(!(this.width && this.height)){
            var rect = this.drawable && this.drawable.rect;
            if(rect){
                this.width = rect[2];
                this.height = rect[3];
            }
        }
    },
    /**
     * 获取可视对象在舞台全局坐标系内的外接矩形以及所有顶点坐标。
     * @returns {Array} 可视对象的顶点坐标数组vertexs。另vertexs还包含属性：
     * <ul>
     * <li><b>x</b> - 可视对象的外接矩形x轴坐标。</li>
     * <li><b>y</b> - 可视对象的外接矩形y轴坐标。</li>
     * <li><b>width</b> - 可视对象的外接矩形的宽度。</li>
     * <li><b>height</b> - 可视对象的外接矩形的高度。</li>
     * </ul>
     */
    getBounds: function(){
        var w = this.width, h = this.height,
            mtx = this.getConcatenatedMatrix(),
            poly = this.boundsArea || [{x:0, y:0}, {x:w, y:0}, {x:w, y:h}, {x:0, y:h}],
            vertexs = [], point, x, y, minX, maxX, minY, maxY;

        for(var i = 0, len = poly.length; i < len; i++){
            point = mtx.transformPoint(poly[i], true, true);
            x = point.x;
            y = point.y;

            if(i == 0){
                minX = maxX = x;
                minY = maxY = y;
            }else{
                if(minX > x) minX = x;
                else if(maxX < x) maxX = x;
                if(minY > y) minY = y;
                else if(maxY < y) maxY = y;
            }
            vertexs[i] = point;
        }

        vertexs.x = minX;
        vertexs.y = minY;
        vertexs.width = maxX - minX;
        vertexs.height = maxY - minY;
        return vertexs;
    },

    /**
     * 获取可视对象相对于其某个祖先（默认为最上层容器）的连接矩阵。
     * @param {View} ancestor 可视对象的相对的祖先容器。
     * @private
     */
    getConcatenatedMatrix: function(ancestor){
        var mtx = new Matrix(1, 0, 0, 1, 0, 0);

        for(var o = this; o != ancestor && o.parent; o = o.parent){
            var cos = 1, sin = 0,
                rotation = o.rotation % 360,
                pivotX = o.pivotX, pivotY = o.pivotY,
                scaleX = o.scaleX, scaleY = o.scaleY;

            if(rotation){
                var r = rotation * Math.PI / 180;
                cos = Math.cos(r);
                sin = Math.sin(r);
            }

            if(pivotX != 0) mtx.tx -= pivotX;
            if(pivotY != 0) mtx.ty -= pivotY;
            mtx.concat(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, o.x, o.y);
        }
        return mtx;
    },

    /**
     * 检测由x和y参数指定的点是否在其外接矩形之内。
     * @param {Number} x 要检测的点的x轴坐标。
     * @param {Number} y 要检测的点的y轴坐标。
     * @param {Boolean} usePolyCollision 是否使用多边形碰撞检测。默认为false。
     * @returns {Boolean} 点是否在可视对象之内。
     */
    hitTestPoint: function(x, y, usePolyCollision){
        var bound = this.getBounds(),
            hit = x >= bound.x && x <= bound.x + bound.width &&
                  y >= bound.y && y <= bound.y + bound.height;

        if(hit && usePolyCollision){
            hit = pointInPolygon(x, y, bound);
        }
        return hit;
    },

    /**
     * 检测object参数指定的对象是否与其相交。
     * @param {View} object 要检测的可视对象。
     * @param {Boolean} usePolyCollision 是否使用多边形碰撞检测。默认为false。
     */
    hitTestObject: function(object, usePolyCollision){
        var b1 = this.getBounds(),
            b2 = object.getBounds(),
            hit = b1.x <= b2.x + b2.width && b2.x <= b1.x + b1.width &&
                  b1.y <= b2.y + b2.height && b2.y <= b1.y + b1.height;

        if(hit && usePolyCollision){
            hit = polygonCollision(b1, b2);
        }
        return !!hit;
    },

    /**
     * 可视对象的基本渲染实现，用于框架内部或高级开发使用。通常应该重写render方法。
     * @param {Renderer} renderer 渲染器。
     * @param {Number} delta 渲染时时间偏移量。
     * @protected
     */
    _render: function(renderer, delta){
        if((!this.onUpdate || this.onUpdate(delta) !== false) && renderer.startDraw(this)){
            renderer.transform(this);
            this.render(renderer, delta);
            renderer.endDraw(this);
        }
    },
    /**
     * 冒泡鼠标事件
    */
    _fireMouseEvent:function(e){
        e.eventCurrentTarget = this;
        this.fire(e);

        //处理mouseover事件 mouseover不需要阻止冒泡
        if(e.type == "mousemove"){
            if(!this.__mouseOver){
                this.__mouseOver = true;
                var overEvent = Hilo.copy({}, e);
                overEvent.type = "mouseover";
                this.fire(overEvent);
            }
        }
        else if(e.type == "mouseout"){
            this.__mouseOver = false;
        }

        //向上冒泡
        var parent = this.parent;
        if(!e._stopped && !e._stopPropagationed && parent){
            if(e.type == "mouseout" || e.type == "touchout"){
                if(!parent.hitTestPoint(e.stageX, e.stageY, true)){
                    parent._fireMouseEvent(e);
                }
            }
            else{
                parent._fireMouseEvent(e);
            }
        }
    },

    /**
     * 更新可视对象，此方法会在可视对象渲染之前调用。此函数可以返回一个Boolean值。若返回false，则此对象不会渲染。默认值为null。
     * 限制：如果在此函数中改变了可视对象在其父容器中的层级，当前渲染帧并不会正确渲染，而是在下一渲染帧。可在其父容器的onUpdate方法中来实现。
     * @type Function
     * @default null
     */
    onUpdate: null,

    /**
     * 可视对象的具体渲染逻辑。子类可通过覆盖此方法实现自己的渲染。
     * @param {Renderer} renderer 渲染器。
     * @param {Number} delta 渲染时时间偏移量。
     */
    render: function(renderer, delta){
        this.fixSize();
        renderer.draw(this);
    },

    /**
     * 为指定的可视对象生成一个包含路径的字符串表示形式。如Stage1.Container2.Bitmap3。
     * @param {View} view 指定的可视对象。
     * @returns {String} 可视对象的字符串表示形式。
     */
    toString: function(){
        var result, obj = this;
        while(obj){
            result = result ? (obj.id + '.' + result) : obj.id;
            obj = obj.parent;
        }
        return result;
    },
});

/**
 * @private
 */
function pointInPolygon(x, y, poly){
    var cross = 0, onBorder = false, minX, maxX, minY, maxY;

    for(var i = 0, len = poly.length; i < len; i++){
        var p1 = poly[i], p2 = poly[(i+1)%len];

        if(p1.y == p2.y && y == p1.y){
            p1.x > p2.x ? (minX = p2.x, maxX = p1.x) : (minX = p1.x, maxX = p2.x);
            if(x >= minX && x <= maxX){
                onBorder = true;
                continue;
            }
        }

        p1.y > p2.y ? (minY = p2.y, maxY = p1.y) : (minY = p1.y, maxY = p2.y);
        if(y < minY || y > maxY) continue;

        var nx = (y - p1.y)*(p2.x - p1.x) / (p2.y - p1.y) + p1.x;
        if(nx > x) cross++;
        else if(nx == x) onBorder = true;

        //当射线和多边形相交
        if(p1.x > x && p1.y == y){
            var p0 = poly[(len+i-1)%len];
            //当交点的两边在射线两旁
            if(p0.y < y && p2.y > y || p0.y > y && p2.y < y){
                cross ++;
            }
        }
    }

    return onBorder || (cross % 2 == 1);
}

/**
 * @private
 */
function polygonCollision(poly1, poly2){
    var result = doSATCheck(poly1, poly2, {overlap:-Infinity, normal:{x:0, y:0}});
    if(result) return doSATCheck(poly2, poly1, result);
    return false;
}

/**
 * @private
 */
function doSATCheck(poly1, poly2, result){
    var len1 = poly1.length, len2 = poly2.length,
        currentPoint, nextPoint, distance,
        min1, max1, min2, max2, dot, overlap, normal = {x:0, y:0};

    for(var i = 0; i < len1; i++){
        currentPoint = poly1[i];
        nextPoint = poly1[(i < len1-1 ? i+1 : 0)];

        normal.x = currentPoint.y - nextPoint.y;
        normal.y = nextPoint.x - currentPoint.x;

        distance = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
        normal.x /= distance;
        normal.y /= distance;

        min1 = max1 = poly1[0].x * normal.x + poly1[0].y * normal.y;
        for(var j = 1; j < len1; j++){
            dot = poly1[j].x * normal.x + poly1[j].y * normal.y;
            if(dot > max1) max1 = dot;
            else if(dot < min1) min1 = dot;
        }

        min2 = max2 = poly2[0].x * normal.x + poly2[0].y * normal.y;
        for(j = 1; j < len2; j++){
            dot = poly2[j].x * normal.x + poly2[j].y * normal.y;
            if(dot > max2) max2 = dot;
            else if(dot < min2) min2 = dot;
        }

        if(min1 < min2){
            overlap = min2 - max1;
            normal.x = -normal.x;
            normal.y = -normal.y;
        }else{
            overlap = min1 - max2;
        }

        if(overlap >= 0){
            return false;
        }else if(overlap > result.overlap){
            result.overlap = overlap;
            result.normal.x = normal.x;
            result.normal.y = normal.y;
        }
    }

    return result;
}

})();
Hilo.View = View;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Drawable = Hilo.Drawable;
var View = Hilo.View;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class Container是所有容器类的基类。每个Container都可以添加其他可视对象为子级。
 * @augments View
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/view/Container
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @requires hilo/core/Drawable
 * @requires hilo/view/View
 * @property {Array} children 容器的子元素列表。只读。
 * @property {Boolean} pointerChildren 指示容器的子元素是否能响应用户交互事件。默认为true。
 * @property {Boolean} clipChildren 指示是否裁剪超出容器范围的子元素。默认为false。
 */
var Container = Class.create(/** @lends Container.prototype */{
    Extends: View,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid("Container");
        Container.superclass.constructor.call(this, properties);

        if(this.children) this._updateChildren();
        else this.children = [];
    },

    children: null,
    pointerChildren: true,
    clipChildren: false,

    /**
     * 返回容器的子元素的数量。
     * @returns {Uint} 容器的子元素的数量。
     */
    getChildrenNum: function(){
        return this.children.length;
    },

    /**
     * 在指定索引位置添加子元素。
     * @param {View} child 要添加的子元素。
     * @param {Number} index 指定的索引位置，从0开始。
     */
    addChildAt: function(child, index){
        var children = this.children,
            len = children.length,
            parent = child.parent;

        index = index < 0 ? 0 : index > len ? len : index;
        var childIndex = this.getChildIndex(child);
        if(childIndex == index){
            return this;
        }else if(childIndex >= 0){
            children.splice(childIndex, 1);
            index = index == len ? len - 1 : index;
        }else if(parent){
            parent.removeChild(child);
        }

        children.splice(index, 0, child);

        //直接插入，影响插入位置之后的深度
        if(childIndex < 0){
            this._updateChildren(index);
        }
        //只是移动时影响中间段的深度
        else{
            var startIndex = childIndex < index ? childIndex : index;
            var endIndex = childIndex < index ? index : childIndex;;
            this._updateChildren(startIndex, endIndex + 1);
        }
        
        if(child.drawable && child.drawable.domElement){
            this._domContainerFlag = true;
        }

        return this;
    },

    /**
     * 在最上面添加子元素。
     * @param {View} child 要添加的子元素。
     */
    addChild: function(child){
        var total = this.children.length,
            args = arguments;

        for(var i = 0, len = args.length; i < len; i++){
            this.addChildAt(args[i], total + i);
        }
        return this;
    },

    /**
     * 在指定索引位置删除子元素。
     * @param {Int} index 指定删除元素的索引位置，从0开始。
     * @returns {View} 被删除的对象。
     */
    removeChildAt: function(index){
        var children = this.children;
        if(index < 0 || index >= children.length) return null;

        var child = children[index];
        if(child){
            var drawable = child.drawable;
            var elem = drawable && drawable.domElement;

            if(elem){
                var parentElem = elem.parentNode;
                if(parentElem){
                    parentElem.removeChild(elem);
                }
                drawable.domElement = null;
                
                this._domContainerFlag = true;
            }

            child.parent = null;
            child.depth = -1;
        }

        children.splice(index, 1);
        this._updateChildren(index);

        return child;
    },

    /**
     * 删除指定的子元素。
     * @param {View} child 指定要删除的子元素。
     * @returns {View} 被删除的对象。
     */
    removeChild: function(child){
        return this.removeChildAt(this.getChildIndex(child));
    },

    /**
     * 删除指定id的子元素。
     * @param {String} id 指定要删除的子元素的id。
     * @returns {View} 被删除的对象。
     */
    removeChildById: function(id){
        var children = this.children, child;
        for(var i = 0, len = children.length; i < len; i++){
            child = children[i];
            if(child.id === id){
                this.removeChildAt(i);
                return child;
            }
        }
        return null;
    },

    /**
     * 删除所有的子元素。
     * @returns {Container} 容器本身。
     */
    removeAllChildren: function(){
        while(this.children.length) this.removeChildAt(0);
        return this;
    },

    /**
     * 返回指定索引位置的子元素。
     * @param {Number} index 指定要返回的子元素的索引值，从0开始。
     */
    getChildAt: function(index){
        var children = this.children;
        if(index < 0 || index >= children.length) return null;
        return children[index];
    },

    /**
     * 返回指定id的子元素。
     * @param {String} id 指定要返回的子元素的id。
     */
    getChildById: function(id){
        var children = this.children, child;
        for(var i = 0, len = children.length; i < len; i++){
            child = children[i];
            if(child.id === id) return child;
        }
        return null;
    },

    /**
     * 返回指定子元素的索引值。
     * @param {View} child 指定要返回索引值的子元素。
     */
    getChildIndex: function(child){
        return this.children.indexOf(child);
    },

    /**
     * 设置子元素的索引位置。
     * @param {View} child 指定要设置的子元素。
     * @param {Number} index 指定要设置的索引值。
     */
    setChildIndex: function(child, index){
        var children = this.children,
            oldIndex = children.indexOf(child);

        if(oldIndex >= 0 && oldIndex != index){
            var len = children.length;
            index = index < 0 ? 0 : index >= len ? len - 1 : index;
            children.splice(oldIndex, 1);
            children.splice(index, 0, child);
            this._updateChildren();
        }
        return this;
    },

    /**
     * 交换两个子元素的索引位置。
     * @param {View} child1 指定要交换的子元素A。
     * @param {View} child2 指定要交换的子元素B。
     */
    swapChildren: function(child1, child2){
        var children = this.children,
            index1 = this.getChildIndex(child1),
            index2 = this.getChildIndex(child2);

        child1.depth = index2;
        children[index2] = child1;
        child2.depth = index1;
        children[index1] = child2;
    },

    /**
     * 交换两个指定索引位置的子元素。
     * @param {Number} index1 指定要交换的索引位置A。
     * @param {Number} index2 指定要交换的索引位置B。
     */
    swapChildrenAt: function(index1, index2){
        var children = this.children,
            child1 = this.getChildAt(index1),
            child2 = this.getChildAt(index2);

        child1.depth = index2;
        children[index2] = child1;
        child2.depth = index1;
        children[index1] = child2;
    },

    /**
     * 根据指定键值或函数对子元素进行排序。
     * @param {Object} keyOrFunction 如果此参数为String时，则根据子元素的某个属性值进行排序；如果此参数为Function时，则根据此函数进行排序。
     */
    sortChildren: function(keyOrFunction){
        var fn = keyOrFunction,
            children = this.children;
        if(typeof fn == "string"){
            var key = fn;
            fn = function(a, b){
                return b[key] - a[key];
            };
        }
        children.sort(fn);
        this._updateChildren();
    },

    /**
     * 更新子元素。
     * @private
     */
    _updateChildren: function(start, end){
        var children = this.children, child,
            start = start || 0,
            end = end || children.length;
        for(var i = start; i < end; i++){
            child = children[i];
            child.depth = i + 1;
            child.parent = this;
        }
    },

    /**
     * 返回是否包含参数指定的子元素。
     * @param {View} child 指定要测试的子元素。
     */
    contains: function(child){
        while(child = child.parent){
            if(child === this){
                return true;
            }
        }
        return false;
    },

    /**
     * 返回由x和y指定的点下的对象。
     * @param {Number} x 指定点的x轴坐标。
     * @param {Number} y 指定点的y轴坐标。
     * @param {Boolean} usePolyCollision 指定是否使用多边形碰撞检测。默认为false。
     * @param {Boolean} global 使用此标志表明将查找所有符合的对象，而不仅仅是第一个，即全局匹配。默认为false。
     * @param {Boolean} eventMode 使用此标志表明将在事件模式下查找对象。默认为false。
     */
    getViewAtPoint: function(x, y, usePolyCollision, global, eventMode){
        if(this.clipChildren && (!this.hitTestPoint(x, y, usePolyCollision))){
            return null;
        }
        
        var result = global ? [] : null,
            children = this.children, child, obj;

        for(var i = children.length - 1; i >= 0; i--){
            child = children[i];
            //skip child which is not shown or pointer enabled
            if(!child || !child.visible || child.alpha <= 0 || (eventMode && !child.pointerEnabled)) continue;
            //find child recursively
            if(child.children && child.children.length && !(eventMode && !child.pointerChildren)){
                obj = child.getViewAtPoint(x, y, usePolyCollision, global, eventMode);
            }

            if(obj){
                if(!global) return obj;
                else if(obj.length) result = result.concat(obj);
            }else if(child.hitTestPoint(x, y, usePolyCollision)){
                if(!global) return child;
                else result.push(child);
            }
        }

        return global && result.length ? result : null;
    },

    /**
     * 覆盖渲染方法。
     * @private
     */
    render: function(renderer, delta){
        Container.superclass.render.call(this, renderer, delta);
        
        if(renderer.renderType != 'dom'){
            if(this._domContainerFlag){
                this._domContainerFlag = false;
                this._domContainerUpdate();
            }
            if(this.drawable && this.drawable.domElement){
                Hilo.setElementStyleByView(this, true);
            }
        }

        var children = this.children.slice(0), i, len, child;
        for(i = 0, len = children.length; i < len; i++){
            child = children[i];
            child._render(renderer, delta);
        }
    },
    
    /**
     * 创建DOM Container
     */
    _domContainerUpdate: function(){
        var children = this.children, findDomChild = false;
        for(i = 0, len = children.length; i < len; i++){
            child = children[i];
            if(child.drawable && child.drawable.domElement){
                findDomChild = true;
                break;
            }
        }
        
        var parent = this.parent, drawable = this.drawable, elem = drawable && drawable.domElement;
        if(findDomChild){
            if(!elem){
                var drawable = (this.drawable = this.drawable || new Drawable());
                drawable.domElement = (drawable.domElement || Hilo.createElement('div', {style: {position: 'absolute'}}));
                
                if(parent) parent._domContainerUpdate();
            }
        }else{
            if(elem){
                if(elem){
                    var parentElem = elem.parentNode;
                    if(parentElem){
                        parentElem.removeChild(elem);
                    }
                    drawable.domElement = null;
                    this.drawable = null;
                }
                
                if(parent) parent._domContainerUpdate();
            }
        }
    }

});
Hilo.Container = Container;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Container = Hilo.Container;
var CanvasRenderer = Hilo.CanvasRenderer;
var DOMRenderer = Hilo.DOMRenderer;
var WebGLRenderer = Hilo.WebGLRenderer;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * 示例:
 * <pre>
 * var stage = new Hilo.Stage({
 *     container: containerElement,
 *     width: 320,
 *     height: 480
 * });
 * </pre>
 * @class 舞台是可视对象树的根，可视对象只有添加到舞台或其子对象后才会被渲染出来。创建一个hilo应用一般都是从创建一个stage开始的。
 * @augments Container
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。主要有：
 * <ul>
 * <li><b>container</b>:String|HTMLElement - 指定舞台在页面中的父容器元素。它是一个dom容器或id。若不传入此参数且canvas未被加入到dom树，则需要在舞台创建后手动把舞台画布加入到dom树中，否则舞台不会被渲染。可选。</li>
 * <li><b>renderType</b>:String - 指定渲染方式，canvas|dom|webgl，默认canvas。可选。</li>
 * <li><b>canvas</b>:String|HTMLCanvasElement|HTMLElement - 指定舞台所对应的画布元素。它是一个canvas或普通的div，也可以传入元素的id。若为canvas，则使用canvas来渲染所有对象，否则使用dom+css来渲染。可选。</li>
 * <li><b>width</b>:Number</li> - 指定舞台的宽度。默认为canvas的宽度。可选。
 * <li><b>height</b>:Number</li> - 指定舞台的高度。默认为canvas的高度。可选。
 * <li><b>paused</b>:Boolean</li> - 指定舞台是否停止渲染。默认为false。可选。
 * </ul>
 * @module hilo/view/Stage
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @requires hilo/view/Container
 * @requires hilo/renderer/CanvasRenderer
 * @requires hilo/renderer/DOMRenderer
 * @requires hilo/renderer/WebGLRenderer
 * @property {HTMLCanvasElement|HTMLElement} canvas 舞台所对应的画布。它可以是一个canvas或一个普通的div。只读属性。
 * @property {Renderer} renderer 舞台渲染器。只读属性。
 * @property {Boolean} paused 指示舞台是否暂停刷新渲染。
 * @property {Object} viewport 舞台内容在页面中的渲染区域。包含的属性有：left、top、width、height。只读属性。
 */
var Stage = Class.create(/** @lends Stage.prototype */{
    Extends: Container,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid('Stage');
        Stage.superclass.constructor.call(this, properties);

        this._initRenderer(properties);

        //init size
        var width = this.width, height = this.height, viewport = this.updateViewport();
        if(!properties.width) width = (viewport && viewport.width) || 320;
        if(!properties.height) height = (viewport && viewport.height) || 480;
        this.resize(width, height, true);
    },

    canvas: null,
    renderer: null,
    paused: false,
    viewport: null,

    /**
     * @private
     */
    _initRenderer: function(properties){
        var canvas = properties.canvas;
        var container = properties.container;
        var renderType = properties.renderType||'canvas';

        if(typeof canvas === 'string') canvas = Hilo.getElement(canvas);
        if(typeof container === 'string') container = Hilo.getElement(container);

        if(!canvas){
            var canvasTagName = renderType === 'dom'?'div':'canvas';
            canvas = Hilo.createElement(canvasTagName, {style: {position: 'absolute', overflow: 'hidden'}});
        }

        this.canvas = canvas;
        if(container) container.appendChild(canvas);

        var props = {canvas:canvas, stage:this};
        switch(renderType){
            case 'dom':
                this.renderer = new DOMRenderer(props);
                break;
            case 'webgl':
                if(WebGLRenderer.isSupport()){
                    this.renderer = new WebGLRenderer(props);
                }
                else{
                    this.renderer = new CanvasRenderer(props);
                }
                break;
            case 'canvas':
            default:
                this.renderer = new CanvasRenderer(props);
                break;
        }
    },
    
        /**
     * 覆盖渲染方法。
     * @private
     */
    _render: function(renderer, delta){
        if((!this.onUpdate || this.onUpdate(delta) !== false) && renderer.startDraw(this)){
            //transform
            var w = this.width, h = this.height, scaleX = this.scaleX, scaleY = this.scaleY;
            var oldW = this._width, oldH = this._height, oldScaleX = this._scaleX, oldScaleY = this._scaleY;
            var canvas = this.canvas, style = canvas.style;

            if((oldW !== w) || (oldScaleX !== scaleX)){
                this._width = w;
                this._scaleX = scaleX;
                
                canvas.width = w;
                style.width = scaleX * w + "px";
            }
            if((oldH !== h) || (oldScaleY !== scaleY)){
                this._height = h;
                this._scaleY = scaleY;
                
                canvas.height = h;
                style.height = scaleY * h + "px";
            }
            
            
            
            var elem = this.drawable && this.drawable.domElement;
            if(elem){
                if(!elem.parentNode){
                    elem.style.overflow = 'hidden';
                    canvas.appendChild(elem);
                }
            }
                
            renderer.clear(0, 0, this.width, this.height);
            //render
            this.render(renderer, delta);
            
            renderer.endDraw(this);
        }
    },

    /**
     * 添加舞台画布到DOM容器中。注意：此方法覆盖了View.addTo方法。
     * @param {HTMLElement} domElement 一个dom元素。
     * @returns {Stage} 舞台本身，可用于链式调用。
     */
    addTo: function(domElement){
        var canvas = this.canvas;
        if(canvas.parentNode !== domElement){
            domElement.appendChild(canvas);
        }
        return this;
    },

    /**
     * 调用tick会触发舞台的更新和渲染。开发者一般无需使用此方法。
     * @param {Number} delta 调度器当前调度与上次调度tick之间的时间差。
     */
    tick: function(delta){
        if(!this.paused){
            this._render(this.renderer, delta);
        }
    },
    
    /**
     * 改变舞台的大小。
     * @param {Number} width 指定舞台新的宽度。
     * @param {Number} height 指定舞台新的高度。
     * @param {Boolean} forceResize 指定是否强制改变舞台大小，即不管舞台大小是否相同，仍然强制执行改变动作，可确保舞台、画布以及视窗之间的尺寸同步。
     */
    resize: function(width, height, forceResize){
        if(forceResize || this.width !== width || this.height !== height){
            this.width = width;
            this.height = height;
            this.renderer.resize(width, height);
            this.updateViewport();
        }
    },
    
        /**
     * 更新舞台在页面中的可视区域，即渲染区域。当舞台canvas的样式border、margin、padding等属性更改后，需要调用此方法更新舞台渲染区域。
     * @returns {Object} 舞台的可视区域。即viewport属性。
     */
    updateViewport: function(){
        var canvas = this.canvas, viewport = null;
        if(canvas.parentNode){
            viewport = this.viewport = Hilo.getElementRect(canvas);
        }
        return viewport;
    },
    
    /**
     * 开启/关闭舞台的DOM事件响应。要让舞台上的可视对象响应用户交互，必须先使用此方法开启舞台的相应事件的响应。
     * @param {String|Array} type 要开启/关闭的事件名称或数组。
     * @param {Boolean} enabled 指定开启还是关闭。如果不传此参数，则默认为开启。
     * @returns {Stage} 舞台本身。链式调用支持。
     */
    enableDOMEvent: function(type, enabled){
        var me = this,
            canvas = me.canvas,
            types = typeof type === 'string' ? [type] : type,
            enabled = enabled !== false,
            handler = me._domListener || (me._domListener = function(e){me._onDOMEvent(e)});

        for(var i = 0; i < types.length; i++){
            var type = types[i];

            if(enabled){
                canvas.addEventListener(type, handler, false);
            }else{
                canvas.removeEventListener(type, handler);
            }
        }

        return me;
    },

    /**
     * DOM事件处理函数。此方法会把事件调度到事件的坐标点所对应的可视对象。
     * @private
     */
    _onDOMEvent: function(e){
        var type = e.type, event = e, isTouch = type.indexOf('touch') == 0;

        //calculate stageX/stageY
        var posObj = e;
        if(isTouch){
            var touches = e.touches, changedTouches = e.changedTouches;
            posObj = (touches && touches.length) ? touches[0] :
                     (changedTouches && changedTouches.length) ? changedTouches[0] : null;
        }

        var x = posObj.pageX || posObj.clientX, 
            y = posObj.pageY || posObj.clientY,
            viewport = this.viewport || this.updateViewport();

        event.stageX = x = (x - viewport.left) / this.scaleX;
        event.stageY = y = (y - viewport.top) / this.scaleY;

        //鼠标事件需要阻止冒泡方法
        event.stopPropagation = function(){
            this._stopPropagationed = true;
        };

        var obj = this.getViewAtPoint(x, y, true, false, true)||this,
            canvas = this.canvas, 
            target = this._eventTarget;

        //fire mouseout/touchout event for last event target
        var leave = type === 'mouseout';
        //当obj和target不同 且obj不是target的子元素时才触发out事件
        if(target && (target != obj && (!target.contains || !target.contains(obj))|| leave)){
            var out = (type === 'touchmove') ? 'touchout' :
                      (type === 'mousemove' || leave || !obj) ? 'mouseout' : null;
            if(out) {
                var outEvent = Hilo.copy({}, event);
                outEvent.type = out;
                outEvent.eventTarget = target;
                target._fireMouseEvent(outEvent);
            }
            event.lastEventTarget = target;
            this._eventTarget = null;
        }

        //fire event for current view
        if(obj && obj.pointerEnabled && type !== 'mouseout'){
            event.eventTarget = this._eventTarget = obj;
            obj._fireMouseEvent(event);
        }

        //set cursor for current view
        if(!isTouch){
            var cursor = (obj && obj.pointerEnabled && obj.useHandCursor) ? 'pointer' : '';
            canvas.style.cursor = cursor;
        }

        //fix android: `touchmove` fires only once
        if(Hilo.browser.android && type === 'touchmove'){
            e.preventDefault();
        }
    },

    
     /**
     * 创建DOM Container
     */
    _domContainerUpdate: function(){
        Stage.superclass._domContainerUpdate.call(this);
        
        var elem = this.drawable && this.drawable.domElement;
        if(elem && !elem.parentNode && this.canvas.parentNode){
            this.canvas.parentNode.appendChild(elem);
        }
    }

});

Hilo.Stage = Stage;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var View = Hilo.View;
var Drawable = Hilo.Drawable;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * 使用示例:
 * <pre>
 * var bmp = new Hilo.Bitmap({image:imgElem, rect:[0, 0, 100, 100]});
 * stage.addChild(bmp);
 * </pre>
 * @class Bitmap类表示位图图像类。
 * @augments View
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。此外还包括：
 * <ul>
 * <li><b>image</b> - 位图所在的图像image。必需。</li>
 * <li><b>rect</b> - 位图在图像image中矩形区域。</li>
 * </ul>
 * @module hilo/view/Bitmap
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @requires hilo/core/Drawable
 * @requires hilo/view/View
 */
 var Bitmap = Class.create(/** @lends Bitmap.prototype */{
    Extends: View,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid("Bitmap");
        Bitmap.superclass.constructor.call(this, properties);

        this.drawable = new Drawable(properties);

        //init width and height
        if(!this.width || !this.height){
            var rect = this.drawable.rect;
            if(rect){
                this.width = rect[2];
                this.height = rect[3];
            }
        }
    },

    /**
     * 设置位图的图片。
     * @param {Image|String} image 图片对象或地址。
     * @param {Array} rect 指定位图在图片image的矩形区域。
     * @returns {Bitmap} 位图本身。
     */
    setImage: function(image, rect){
        this.drawable.init({image:image, rect:rect});
        if(rect){
            this.width = rect[2];
            this.height = rect[3];
        }
        return this;
    }
 });
Hilo.Bitmap = Bitmap;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var View = Hilo.View;
var Drawable = Hilo.Drawable;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class 动画精灵类。
 * @augments View
 * @module hilo/view/Sprite
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @requires hilo/core/Drawable
 * @requires hilo/view/View
 * @param properties 创建对象的属性参数。可包含此类所有可写属性。此外还包括：
 * <ul>
 * <li><b>frames</b> - 精灵动画的帧数据对象。</li>
 * </ul>
 * @property {boolean} paused 判断精灵是否暂停。默认为false。
 * @property {boolean} loop 判断精灵是否可以循环播放。默认为true。
 * @property {number}  duration 精灵动画的帧间隔，单位为毫秒。
 */
var Sprite = Class.create(/** @lends Sprite.prototype */{
    Extends: View,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid("Sprite");
        Sprite.superclass.constructor.call(this, properties);

        this._frames = [];
        this._frameNames = {};
        this._frameCallbacks = [];
        this.drawable = new Drawable();
        
        if(properties.frames) this.setFrames(properties.frames);
    },

    _frames: null, //所有帧的集合
    _frameNames: null, //带名字name的帧的集合
    _frameIndex: 0, //当前帧的索引
    _framePaused: false,
    _frameElapsed: 0, //当前帧持续的时间
    _frameCallbacks: null,
    
    loop: true,
    duration: 1,


    /**
     * 设置精灵动画序列
     * @param {frames} frames 要设置的精灵动画帧数据。
     *        Array [frame, frame,...]
     *        Object {width, height, total, image, rect}
     * @returns {Sprite} Sprite对象本身。
     */
    setFrames: function(frames){
        if(frames instanceof Array){ //frames by array
            this._frames = frames;
            this._frameNames = {}
            for(var i = 0, len = frames.length; i < len; i++){
                var frame = frames[i];
                if(frame.name) this._frameNames[frame.name] = frame;
            }
        }else{
            var image = frames.image, 
                rect  = frames.rect || [0,0,image.width,image.height], 
                x = rect[0], 
                y = rect[1],
                fw = frames.width || rect[2], 
                fh = frames.height || rect[3];
                
            var xn = Math.floor(rect[2]/fw);
            var fn = frames.total ||(xn * Math.floor(rect[3]/fh));
            
            var ff = [];
            for(var i = 0; i< fn; i++){
                var px = x + fw * (i % xn);
                var py = y + fh * Math.floor(i/xn);
                ff[i]={image:image,rect:[px, py, fw, fh]};
            }
            this.setFrames(ff);
        }
        return this;
    },
    

    /**
     * 获取精灵动画序列中指定的帧。
     * @param {Object} indexOrName 要获取的帧的索引位置或别名。
     * @returns {Object} 精灵帧对象。
     */
    getFrame: function(indexOrName){
        if(typeof indexOrName === 'number'){
            var frames = this._frames;
            if(indexOrName < 0 || indexOrName >= frames.length) return null;
            return frames[indexOrName];
        }
        return this._frameNames[indexOrName];
    },

    /**
     * 获取精灵动画序列中指定帧的索引位置。
     * @param {Object} frameValue 要获取的帧的索引位置或别名。
     * @returns {Object} 精灵帧对象。
     */
    getFrameIndex: function(frameValue){
        if(frameValue == null || frameValue == undefined) return this._frameIndex;
        
        var frames = this._frames, total = frames.length, index = -1;
        if(typeof frameValue === 'number'){
            index = frameValue;
        }else{
            var frame = typeof frameValue === 'string' ? this._frameNames[frameValue] : frameValue;
            if(frame){
                for(var i = 0; i < total; i++){
                    if(frame === frames[i]){
                        index = i;
                        break;
                    }
                }
            }
        }
        return index;
    },
    
    /**
     * 返回精灵动画的总帧数。
     * @returns {Uint} 精灵动画的总帧数。
     */
    getFrameTotal: function(){
        return this._frames ? this._frames.length : 0;
    },
    
    /**
     * 设置指定帧的回调函数。即每当播放头进入指定帧时调用callback函数。若callback为空，则会删除回调函数。
     * @param {Int|String} frame 要指定的帧的索引位置或别名。
     * @param {Function} callback 指定回调函数。
     * @returns {Sprite} 精灵本身。
     */
    setFrameCallback: function(frame, callback){
        var idx = this.getFrameIndex(frame);
        if(idx > -1) this._frameCallbacks[idx] = callback;
        return this;
    },
    
    /**
     * 播放精灵动画。
     * @returns {Sprite} Sprite对象本身。
     */
    play: function(){
        this._framePaused = false;
        return this;
    },

    /**
     * 暂停播放精灵动画。
     * @returns {Sprite} Sprite对象本身。
     */
    stop: function(){
        this._framePaused = true;
        return this;
    },

    /**
     * 跳转精灵动画到指定的帧。
     * @param {Object} indexOrName 要跳转的帧的索引位置或别名。
     * @param {Boolean} pause 指示跳转后是否暂停播放。
     * @returns {Sprite} Sprite对象本身。
     */
    goto: function(indexOrName, pause){
        var total = this._frames.length,
            index = this.getFrameIndex(indexOrName);

        this._frameIndex = index < 0 ? 0 : index >= total ? total - 1 : index;
        this._framePaused = pause || this._framePaused;
        this._frameElapsed = 0;
        return this;
    },

    /**
     * 渲染方法。
     * @private
     */
    _render: function(renderer, delta){
        var frameIndex = this._nextFrame(delta);
        if(frameIndex != this._frameIndex){
            this._frameIndex = frameIndex;
            var callback =  this._frameCallbacks[frameIndex];
            if(callback) callback.call(this);

            var frame = this._frames[frameIndex]
            this.drawable.init(frame);
            this.width = frame.rect[2];
            this.height = frame.rect[3];
        }
        
        Sprite.superclass._render.call(this, renderer, delta);
    },

    /**
     * @private
     */
    _nextFrame: function(delta){
        var frameIndex = this._frameIndex;
        if(this._framePaused){
            return frameIndex;
        }
            
        var frames = this._frames, total = frames.length, frame = frames[frameIndex];
        if(frame.stop || (!this.loop && frameIndex >= total - 1)){
            this.stop();
            return frameIndex;
        }

        var elapsed = this._frameElapsed + delta, duration = frame.duration || this.duration;
        if(elapsed > duration){
            this._frameElapsed = elapsed - duration;
            if(frame.next != null){
                //jump to the specified frame
                frameIndex = this.getFrameIndex(frame.next);
            }else if(frameIndex >= total - 1){
                //at the end of the frames, go back to first frame
                frameIndex = 0;
            }else{
                //normal go forward to next frame
                frameIndex++;
            }
        }else{
            this._frameElapsed = elapsed;
        }

        return frameIndex;
    }

});
Hilo.Sprite = Sprite;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var View = Hilo.View;
var Drawable = Hilo.Drawable;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * 示例:
 * <pre>
 * var btn = new Hilo.Button({
 *     image: buttonImage,
 *     upState: {rect:[0, 0, 64, 64]},
 *     overState: {rect:[64, 0, 64, 64]},
 *     downState: {rect:[128, 0, 64, 64]},
 *     disabledState: {rect:[192, 0, 64, 64]}
 * });
 * </pre>
 * @class Button类表示简单按钮类。它有弹起、经过、按下和不可用等四种状态。
 * @augments View
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。此外还包括：
 * <ul>
 * <li><b>image</b> - 按钮图片所在的image对象。</li>
 * </ul>
 * @module hilo/view/Button
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @requires hilo/core/Drawable
 * @requires hilo/view/View
 * @property {Object} upState 按钮弹起状态的属性或其drawable的属性的集合。
 * @property {Object} overState 按钮经过状态的属性或其drawable的属性的集合。
 * @property {Object} downState 按钮按下状态的属性或其drawable的属性的集合。
 * @property {Object} disabledState 按钮不可用状态的属性或其drawable的属性的集合。
 * @property {String} state 按钮的状态名称。它是 Button.UP|OVER|DOWN|DISABLED 之一。 只读属性。
 * @property {Boolean} enabled 指示按钮是否可用。默认为true。只读属性。
 * @property {Boolean} useHandCursor 当设置为true时，表示指针滑过按钮上方时是否显示手形光标。默认为true。
 */
 var Button = Class.create(/** @lends Button.prototype */{
    Extends: View,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid("Button");
        Button.superclass.constructor.call(this, properties);

        this.drawable = new Drawable(properties);
        this.setState(Button.UP);
    },

    upState: null,
    overState: null,
    downState: null,
    disabledState: null,

    state: null,
    enabled: true,
    useHandCursor: true,

    /**
     * 设置按钮是否可用。
     * @param {Boolean} enabled 指示按钮是否可用。
     * @returns {Button} 按钮本身。
     */
    setEnabled: function(enabled){
        if(this.enabled != enabled){
            if(!enabled){
                this.setState(Button.DISABLED);
            }else{
                this.setState(Button.UP);
            }
        }
        return this;
    },

    /**
     * 设置按钮的状态。此方法由Button内部调用，一般无需使用此方法。
     * @param {String} state 按钮的新的状态。
     * @returns {Button} 按钮本身。
     */
    setState: function(state){
        if(this.state !== state){
            this.state = state;
            this.pointerEnabled = this.enabled = state !== Button.DISABLED;

            var stateObj;
            switch(state){
                case Button.UP:
                    stateObj = this.upState;
                    break;
                case Button.OVER:
                    stateObj = this.overState;
                    break;
                case Button.DOWN:
                    stateObj = this.downState;
                    break;
                case Button.DISABLED:
                    stateObj = this.disabledState;
                    break;
            }

            if(stateObj){
                this.drawable.init(stateObj);
                Hilo.copy(this, stateObj, true);
            }
        }

        return this;
    },

    /**
     * overwrite
     * @private
     */
    fire: function(type, detail){
        if(!this.enabled) return;

        var evtType = typeof type === 'string' ? type : type.type;
        switch(evtType){
            case 'mousedown':
            case 'touchstart':
            case 'touchmove':
                this.setState(Button.DOWN);
                break;
            case "mouseover":
                this.setState(Button.OVER);
                break;
            case 'mouseup':
                if(this.overState) this.setState(Button.OVER);
                else if(this.upState) this.setState(Button.UP);
                break;
            case 'touchend':
            case 'touchout':
            case 'mouseout':
                this.setState(Button.UP);
                break;
        }

        return Button.superclass.fire.call(this, type, detail);
    },

    Statics: /** @lends Button */ {
        UP: 'up',
        OVER: 'over',
        DOWN: 'down',
        DISABLED: 'disabled'
    }
 });
Hilo.Button = Button;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Drawable = Hilo.Drawable;
var View = Hilo.View;
    
    
var _cacheCanvas = Hilo.createElement('canvas');
var _cacheContext = _cacheCanvas && _cacheCanvas.getContext('2d');
    
    
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class Text类提供简单的文字显示功能。复杂的文本功能可以使用Element。
 * @augments View
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/view/Text
 * @requires hilo/core/Class
 * @requires hilo/core/Hilo
 * @requires hilo/core/Drawable
 * @requires hilo/view/View
 * @property {String} text 指定要显示的文本内容。
 * @property {String} color 指定使用的字体颜色。
 * @property {String} textAlign 指定文本的对齐方式。可以是以下任意一个值：'left', 'center', 'right' 。
 * @property {Boolean} outline 指定文本是绘制边框还是填充。
 * @property {Number} lineSpacing 指定文本的行距。单位为像素。默认值为0。
 * @property {String} font 文本的字体CSS样式。只读属性。设置字体样式请用setFont方法。
 */
var Text = Class.create(/** @lends Text.prototype */{
    Extends: View,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid('Text');
        Text.superclass.constructor.call(this, properties);

        if(properties.width){
            this.width = properties.width;
            this._autoWidth = false;
        }else{
            this.width = 256;
            this._autoWidth = true;
        }
        if(properties.height){
            this.height = properties.height;
            this._autoHeight = false;
        }else{
            this.height = 256;
            this._autoHeight = true;
        }
        
        this.setFont(properties.font || '16px arial');
    },

    text: null,
    color: '#000',
    textAlign: null,
    outline: false,
    lineSpacing: 0,
    font: null, //ready-only
    
    
    /**
     * 设置文本的字体CSS样式。
     * @param {String} font 要设置的字体CSS样式。
     * @returns {Text} Text对象本身。链式调用支持。
     */
    setFont: function(font){
        var me = this;
        if(me.font !== font){
            me.font = font;
            me._fontHeight = Text.measureFontHeight(font);
        }
        return me;
    },

    /**
     * 覆盖渲染方法。
     * @private
     */
    render: function(renderer, delta){
        var me = this, canvas = renderer.canvas;
        
        if(renderer.renderType === 'canvas'){
            me._draw(renderer.context);
        }
        else if(renderer.renderType === 'dom'){
            var drawable = me.drawable;
            var domElement = drawable.domElement;
            var style = domElement.style;
            if(me._check()){
                style.font = me.font;
                style.textAlign = me.textAlign;
                style.color = me.color;
                style.lineHeight = (me._fontHeight + me.lineSpacing) + 'px';
                style['word-break'] = 'break-all';
                style['word-wrap'] = 'break-word';
                
                domElement.innerHTML = me.text.replace("\n","</br>");
            }
            renderer.draw(this);
            if(me._autoWidth){
                me.width = domElement.offsetWidth;
                style.width = null;
            }else{
                style.width = me.width + 'px';
            }
            if(me._autoHeight){
                me.height = domElement.offsetHeight;
                style.height = null;
            }else{
                style.height = me.height + 'px';
            }
        }
        else{
            if(me._check()){
                me._cache();
            }
            renderer.draw(me);
        }
    },

    /**
     * 在指定的渲染上下文上绘制文本。
     * @private
     */
    _draw: function(context){
        var me = this, text = me.text.toString();
        if(!text) return;

        //set drawing style
        context.font = me.font;
        context.textAlign = me.textAlign;
        context.textBaseline = 'top';

        //find and draw all explicit lines
        var lines = text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
        var width = 0, height = 0;
        var lineHeight = me._fontHeight + me.lineSpacing;
        var i, line, w;
        var drawLines = [];

        for(i = 0, len = lines.length; i < len; i++){
            line = lines[i];
            w = context.measureText(line).width;

            //check if the line need to split
            if(w <= me.width || me._autoWidth){
                drawLines.push({text:line, y:height});
                // me._drawTextLine(context, line, height);
                if(width < w) width = w;
                height += lineHeight;
                continue;
            }

            var str = '', oldWidth = 0, newWidth, j, word;

            for(j = 0, wlen = line.length; j < wlen; j++){
                word = line[j];
                newWidth = context.measureText(str + word).width;

                if(newWidth > me.width){
                    drawLines.push({text:str, y:height});
                    // me._drawTextLine(context, str, height);
                    if(width < oldWidth) width = oldWidth;
                    height += lineHeight;
                    str = word;
                }else{
                    oldWidth = newWidth;
                    str += word;
                }

                if(j == wlen - 1){
                    drawLines.push({text:str, y:height});
                    // me._drawTextLine(context, str, height);
                    if(str !== word && width < newWidth) width = newWidth;
                    height += lineHeight;
                }
            }
        }

        if(me._autoWidth) 
            me.width = width;
        if(me._autoHeight) 
            me.height = height;


        //draw background
        var bg = me.background;
        if(bg && (context !== _cacheContext)){
            context.fillStyle = bg;
            context.fillRect(0, 0, me.width, me.height);
        }

        if(me.outline) context.strokeStyle = me.color;
        else context.fillStyle = me.color;

        //draw text lines
        for(var i = 0; i < drawLines.length; i++){
            var line = drawLines[i];
            me._drawTextLine(context, line.text, line.y);
        }
    },

    /**
     * 在指定的渲染上下文上绘制一行文本。
     * @private
     */
    _drawTextLine: function(context, text, y){
        var me = this, x = 0, width = me.width;

        switch(me.textAlign){
            case 'center':
                x = width >> 1;
                break;
            case 'right':
                x = width;
                break;
        };

        if(me.outline) context.strokeText(text, x, y);
        else context.fillText(text, x, y);
    },
    
    _check: function(){
        var dirty = true;
        
        if(this._text !== this.text){
            this._text = this.text;
            dirty = true;
        }
        if(this._color !== this.color){
            this._color = this.color;
            dirty = true;
        }
        if(this._font !== this.font){
            this._font = this.font;
            dirty = true;
        }
        return dirty;
    },
    
    /**
     * 缓存到图片里。可用来提高渲染效率。
     * @param {Boolean} forceUpdate 是否强制更新缓存
     */
    _cache: function(){
        _cacheCanvas.width = this.width;
        _cacheCanvas.height = this.height;
        _cacheContext.clearRect(0, 0, _cacheCanvas.width, _cacheCanvas.height);
        this._draw(_cacheContext);

        var cacheImage = new Image();
        cacheImage.src = _cacheCanvas.toDataURL();

        this.drawable = this.drawable||new Drawable();
        this.drawable.init(cacheImage);
    },


    
    Statics: /** @lends Text */{
        /**
         * 测算指定字体样式的行高。
         * @param {String} font 指定要测算的字体样式。
         * @return {Number} 返回指定字体的行高。
         */
        measureFontHeight: function(font){
            var elem = Hilo.createElement('div', {style:{font:font, position:'absolute'}, innerHTML:'PM国家'});
            var docElement = document.documentElement;
            docElement.appendChild(elem);
            var fontHeight = elem.offsetHeight;
            docElement.removeChild(elem);
            return fontHeight;
        }
    }

});
Hilo.Text = Text;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Container = Hilo.Container;
var Bitmap = Hilo.Bitmap;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class Label。当前仅支持单行文本。
 * @augments Container
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/view/Label
 * @requires hilo/core/Class
 * @requires hilo/core/Hilo
 * @requires hilo/view/Container
 * @requires hilo/view/Bitmap
 * @property {Object} glyphs 位图字体的字形集合。格式为：{letter:{image:img, rect:[0,0,100,100]}}。
 * @property {Number} spacing 字距，即字符间的间隔。默认值为0。
 * @property {String} text 位图文本的文本内容。只读属性。设置文本请使用setFont方法。
 * @property {String} textAlign 文本对齐方式，值为left、center、right, 默认left。只读属性。设置文本请使用setTextAlign方法。
 */
var Label = Class.create(/** @lends Label.prototype */{
    Extends: Container,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid('Label');
        Label.superclass.constructor.call(this, properties);

        if(properties.font){
            this.setFont(properties.font);
        }
        
        var text = properties.text + '';
        if(text){
            this.text = '';
            this.setText(text);
        }

        this.pointerChildren = false; //disable user events for single letters
    },

    glyphs: null,
    spacing: 0,
    text: '',
    textAlign:'left',
    
     /**
      * 设置图片字体
      * font: {text, width, height, image, rect}
      */
    setFont:function(font){
        var str = font.text.toString(),
            image = font.image,
            rect = font.rect || [0,0,image.width,image.height],
            w = font.width || rect[2],
            h = font.height || rect[3],
            col = font.col || Math.floor(rect[2]/w);

        var glyphs = {};
        for(var i = 0, l = str.length; i < l; i++){
            charStr = str.charAt(i);
            glyphs[charStr] = {
                image:image,
                rect:[w * (i % col), h * Math.floor(i / col), w, h]
            }
        }
        this.glyphs = glyphs;

        if(this.text != ''){
            var str = this.text;
            this.text = '';
            this.setText(str);
        }
    },

    /**
     * 设置位图文本的文本内容。
     * @param {String} text 要设置的文本内容。
     * @returns {Label} Label对象本身。链式调用支持。
     */
    setText: function(text){
        var me = this, str = text.toString(), len = str.length;
        if(me.text == str) return;
        me.text = str;

        var i, charStr, charGlyph, charObj, width = 0, height = 0, left = 0;
        for(i = 0; i < len; i++){
            charStr = str.charAt(i);
            charGlyph = me.glyphs[charStr];
            if(charGlyph){
                left = width + (width > 0 ? me.spacing : 0);
                if(me.children[i]){
                    charObj = me.children[i];
                    charObj.setImage(charGlyph.image, charGlyph.rect);
                }
                else{
                    charObj = Label._createBitmap(charGlyph);
                    me.addChild(charObj);
                }
                charObj.x = left;
                width = left + charGlyph.rect[2];
                height = Math.max(height, charGlyph.rect[3]);
            }
        }

        for(i = me.children.length - 1;i >= len;i --){
            Label._releaseBitmap(me.children[i]);
            me.removeChild(me.children[i]);
        }

        me.width = width;
        me.height = height;
        this.setTextAlign();
        return me;
    },
    

     /**
     * 设置位图文本的对齐方式。
     * @param textAlign 文本对齐方式，值为left、center、right
     * @returns {Label} Label对象本身。链式调用支持。
     */
    setTextAlign:function(textAlign){
        this.textAlign = textAlign||this.textAlign;
        switch(this.textAlign){
            case "center":
                this.pivotX = this.width * .5;
                break;
            case "right":
                this.pivotX = this.width;
                break;
            case "left":
            default:
                this.pivotX = 0;
                break;
        }
        return this;
    },

   
    Statics:/** @lends Label */{
        _pool:[],
        _createBitmap:function(cfg){
            var bmp;
            if(Label._pool.length > 0){
                
                bmp = Label._pool.pop();
                bmp.setImage(cfg.image, cfg.rect);
            }
            else{
                bmp = new Bitmap({
                    image:cfg.image,
                    rect:cfg.rect
                });
            }
            return bmp;
        },
        _releaseBitmap:function(bmp){
            Label._pool.push(bmp);
        }
    }

});
Hilo.Label = Label;
})(window);/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var View = Hilo.View;
var Drawable = Hilo.Drawable;
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @name Element
 * @class Element是dom元素的包装。
 * @augments View
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。特殊属性有：
 * <ul>
 * <li><b>element</b> - 要包装的dom元素。必需。</li>
 * </ul>
 * @module hilo/view/Element
 * @requires hilo/core/Hilo
 * @requires hilo/core/Class
 * @requires hilo/core/Drawable
 * @requires hilo/view/View
 */
var Element = Class.create(/** @lends Element.prototype */{
    Extends: View,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid("Element");
        Element.superclass.constructor.call(this, properties);

        this.drawable = new Drawable();
        var elem = this.drawable.domElement = (properties.element || Hilo.createElement('div', {style: {position: 'absolute'}}));
        elem.id = this.id;
    },

    /**
     * 覆盖渲染方法。
     * @private
     */
    _render: function(renderer, delta){
        if(!this.onUpdate || this.onUpdate(delta) !== false){
            if(this.visible){
                this.render(renderer, delta);
            }
        }
    },

    /**
     * 覆盖渲染方法。
     * @private
     */
    render: function(renderer, delta){
        var canvas = renderer.canvas;
        if(renderer.renderType != 'dom'){
            Hilo.setElementStyleByView(this);
        }else{
            renderer.draw(this);
        }
    }
});
Hilo.Element = Element;
})(window);


//hilo game engine 
