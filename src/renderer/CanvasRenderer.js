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
            var rect = drawable.rect, offsetX = rect[4], offsetY = rect[5];
            //the pivot is the center of frame if has offset, otherwise is (0, 0)
            if(offsetX || offsetY) ctx.translate(offsetX - sw * 0.5, offsetY - sh * 0.5);
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
})(window);