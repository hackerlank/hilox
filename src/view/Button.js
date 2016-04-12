/**
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
    useHandCursor: true,

    _state: null,
    _enabled: true,

    /**
     * 设置按钮是否可用。
     * @param {Boolean} enabled 指示按钮是否可用。
     * @returns {Button} 按钮本身。
     */
    setEnabled: function(enabled){
        if(this._enabled != enabled){
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
        if(this._state !== state){
            this._state = state;
            this._enabled = this.pointerEnabled = (state !== Button.DISABLED);

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
})(window);