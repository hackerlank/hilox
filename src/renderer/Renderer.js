/**
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
    startDraw: function(target){ },

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
    resize: function(width, height){ },
    
    
    /**
     * 设置可视对象DOM元素的CSS样式。
     * @param {View} obj 指定要设置CSS样式的可视对象。
     * @private
     */
    setElementStyleByView: function(obj){
        var drawable = obj.drawable,
            style = drawable.domElement.style,
            stateCache = obj._stateCache || (obj._stateCache = {}),
            prefix = Hilo.browser.jsVendor, px = 'px', flag = false;

        if(this.cacheStateIfChanged(obj, ['visible'], stateCache)){
            style.display = !obj.visible ? 'none' : '';
        }
        if(this.cacheStateIfChanged(obj, ['alpha'], stateCache)){
            style.opacity = obj.alpha;
        }
        if(!obj.visible || obj.alpha <= 0) return;

        if(this.cacheStateIfChanged(obj, ['width'], stateCache)){
            style.width = obj.width + px;
        }
        if(this.cacheStateIfChanged(obj, ['height'], stateCache)){
            style.height = obj.height + px;
        }
        if(this.cacheStateIfChanged(obj, ['depth'], stateCache)){
            style.zIndex = obj.depth + 1;
        }
        if(flag = this.cacheStateIfChanged(obj, ['pivotX', 'pivotY'], stateCache)){
            var tpx = obj.pivotX, tpy = obj.pivotY;
            var rect = drawable.rect;
            if(rect){
                var sw = rect[2], sh = rect[3], offsetX = rect[4], offsetY = rect[5];
                if(offsetX || offsetY){
                    tpx = tpx - (offsetX - sw * 0.5);
                    tpy = tpy - (offsetY - sh * 0.5);
                }
            }
            style[prefix + 'TransformOrigin'] = tpx + px + ' ' + tpy + px;
        }
        if(this.cacheStateIfChanged(obj, ['x', 'y', 'rotation', 'scaleX', 'scaleY'], stateCache) || flag){
            style[prefix + 'Transform'] = this.getTransformCSS(obj);
        }
        if(this.cacheStateIfChanged(obj, ['background'], stateCache)){
            style.backgroundColor = obj.background;
        }
        if(!style.pointerEvents){
            style.pointerEvents = 'none';
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

    /**
     * 生成可视对象的CSS变换样式。
     * @param {View} obj 指定生成CSS变换样式的可视对象。
     * @returns {String} 生成的CSS样式字符串。
     */
    getTransformCSS: function(obj){
        var use3d = Hilo.browser.supportTransform3D,
            str3d = use3d ? '3d' : '';

        return 'translate' + str3d + '(' + (obj.x - obj.pivotX) + 'px, ' + (obj.y - obj.pivotY) + (use3d ? 'px, 0px)' : 'px)')
             + 'rotate' + str3d + (use3d ? '(0, 0, 1, ' : '(') + obj.rotation + 'deg)'
             + 'scale' + str3d + '(' + obj.scaleX + ', ' + obj.scaleY + (use3d ? ', 1)' : ')');
    }

});
Hilo.Renderer = Renderer;
})(window);