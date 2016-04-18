#! /bin/bash

OUT_FILE=../out/hilo.js
MIN_FILE=../out/hilo.min.js

echo "gen hilo.js..."
echo "//hilo game engine - guanghe fixed - http://hiloteam.github.io/" > $OUT_FILE
cat  ../src/core/polyfill.js >> $OUT_FILE 
cat  ../src/core/Hilo.js >> $OUT_FILE 
cat  ../src/core/Class.js >> $OUT_FILE            
cat  ../src/core/Event.js >> $OUT_FILE
cat  ../src/core/Matrix.js >> $OUT_FILE
cat  ../src/core/Ticker.js >> $OUT_FILE
cat  ../src/core/Drawable.js >> $OUT_FILE
cat  ../src/loader/ScriptLoader.js >> $OUT_FILE
cat  ../src/loader/ImageLoader.js >> $OUT_FILE
cat  ../src/loader/LoadQueue.js >> $OUT_FILE
cat  ../src/audio/HTMLAudio.js >> $OUT_FILE
cat  ../src/audio/WebAudio.js >> $OUT_FILE
cat  ../src/audio/WebSound.js >> $OUT_FILE
cat  ../src/renderer/Renderer.js >> $OUT_FILE
cat  ../src/renderer/DOMRenderer.js >> $OUT_FILE
cat  ../src/renderer/WebGLRenderer.js >> $OUT_FILE
cat  ../src/renderer/CanvasRenderer.js >> $OUT_FILE
cat  ../src/view/View.js >> $OUT_FILE
cat  ../src/view/Container.js >> $OUT_FILE
cat  ../src/view/Stage.js >> $OUT_FILE
cat  ../src/view/Bitmap.js >> $OUT_FILE
cat  ../src/view/Sprite.js >> $OUT_FILE
cat  ../src/view/Button.js >> $OUT_FILE
cat  ../src/view/Text.js >> $OUT_FILE
cat  ../src/view/Label.js >> $OUT_FILE
cat  ../src/view/Element.js >> $OUT_FILE
cat  ../src/view/Scroll.js >> $OUT_FILE
echo "//hilo game engine " >> $OUT_FILE


echo "gen hilo.min.js..."
java -jar compiler.jar --dependency_mode=NONE --js_output_file=$MIN_FILE --js=$OUT_FILE
java -jar yuicompressor-2.4.8.jar $MIN_FILE -o $MIN_FILE


echo "gen completed"




