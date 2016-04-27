/**
 * Hilo 1.0.0 for standalone
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */
(function(window){
var Hilo = window.Hilo;
var Class = Hilo.Class;
var Container = Hilo.Container;
    
/**
 * Hilo
 * Copyright 2015 alibaba.com
 * Licensed under the MIT License
 */

/**
 * @class ScrollContainer
 * @augments Container
 * @param {Object} properties 创建对象的属性参数。可包含此类所有可写属性。
 * @module hilo/view/Label
 * @requires hilo/core/Class
 * @requires hilo/core/Hilo
 * @requires hilo/view/Container
 */
var Scroll = Class.create(/** @lends Label.prototype */{
    Extends: Container,
    constructor: function(properties){
        properties = properties || {};
        this.id = this.id || properties.id || Hilo.getUid('Scroll');
        Scroll.superclass.constructor.call(this, properties);

        this.clipChildren = true;
        this.pointerChildren = true;
        
        this.view = properties.view || new Container({width:properties.innerWidth || this.width, height:properties.innerHeight ||this.height});
        this.addChild(this.view);
    },
    view:null,
    
    /**
     * overwrite
     * @private
     */
    fire: function(type, detail){
        var evtType = typeof type === 'string' ? type : type.type;

        switch(evtType){
            case 'mousedown':
            case 'touchstart':
                this._scrollFlag = true;
                this._scrollX = type.x;
                this._scrollY = type.y;
                break;
            case 'mousemove':
            case 'touchmove':
                if(this._scrollFlag){
                    var view = this.view;
                    if(view.width > this.width){
                        view.x += type.x - this._scrollX;
                        this._scrollX = type.x;
                        if(view.x > 0) view.x = 0;
                        if(view.x + view.width < this.width) view.x = this.width - view.width;
                    }
                    if(view.height > this.height){
                        view.y += type.y - this._scrollY;
                        this._scrollY = type.y;
                        if(view.y > 0) view.y = 0;
                        if(view.y + view.height < this.height) view.y = this.height - view.height;
                    }
                }
                break;
            case 'mouseup':
            case 'mouseout':
            case 'touchend':
            case 'touchout':
                this._scrollFlag = false;
                break;
        }

        return Scroll.superclass.fire.call(this, type, detail);
    },

});
Hilo.Scroll = Scroll;
})(window);