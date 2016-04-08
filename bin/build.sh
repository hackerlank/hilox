#! /bin/bash


java -jar compiler.jar \
    --dependency_mode=NONE \
    --js_output_file=../out/hilo.js \
    --js=../src/core/polyfill.js \
    --js=../src/core/Hilo.js \
    --js=../src/core/Class.js \
    --js=../src/core/Event.js \
    --js=../src/core/Matrix.js \
    --js=../src/core/Ticker.js \
    --js=../src/core/Drawable.js \
    --js=../src/loader/ScriptLoader.js \
    --js=../src/loader/ImageLoader.js \
    --js=../src/loader/LoadQueue.js \
    --js=../src/audio/HTMLAudio.js \
    --js=../src/audio/WebAudio.js \
    --js=../src/audio/WebSound.js \
    --js=../src/renderer/Renderer.js \
    --js=../src/renderer/DOMRenderer.js \
    --js=../src/renderer/WebGLRenderer.js \
    --js=../src/renderer/CanvasRenderer.js \
    --js=../src/view/View.js \
    --js=../src/view/Container.js \
    --js=../src/view/Stage.js \
    --js=../src/view/Bitmap.js \
    --js=../src/view/Sprite.js \
    --js=../src/view/Button.js \
    --js=../src/view/Text.js \
    --js=../src/view/Label.js \
    --js=../src/view/Element.js \



java -jar yuicompressor-2.4.8.jar ../out/hilo.js -o ../out/hilo.min.js






