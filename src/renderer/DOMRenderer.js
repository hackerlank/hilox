/**
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
        drawable.domElement = (drawable.domElement || Hilo.createDOMDrawable(target, drawable));

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
})(window);