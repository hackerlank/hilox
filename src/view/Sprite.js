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
 * @property {number}  duration 精灵动画的帧间隔，单位为秒。
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
    duration: 0.3,


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
                if(frame.name){
                    this._frameNames[frame.name] = frame;
                }
                
                if(typeof frame.image === 'string'){
                    var img = new Image();
                    img.src = frame.image;
                    frame.image = img;
                    if(!frame.rect){
                        img.onload = function(){
                            img.onload = null;
                            frame.rect = [0,0,img.width,img.height];
                        }
                    }    
                }else{
                    if(!frame.rect){
                        frame.rect = [0,0,frame.image.width, frame.image.height];
                    }
                }
            }
        }else{
            if(typeof frame.image === 'string'){
                var me = this;
                frames.image = new Image();
                frames.image.src = frames.image;
                frames.image.onload = function(){
                    frames.image.onload = null;
                    me.setFrames(frames);
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
            if(frame){
                this.drawable.init(frame);
                if(frame.rect){
                    this.width = frame.rect[2];
                    this.height = frame.rect[3];
                }
            }
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
        if((frame && frame.stop) || (!this.loop && frameIndex >= total - 1)){
            this.stop();
            return frameIndex;
        }

        var elapsed = this._frameElapsed + delta, duration = (frame && frame.duration) || this.duration;
        if(elapsed > duration){
            this._frameElapsed = elapsed - duration;
            if(frame && frame.next != null){
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
})(window);