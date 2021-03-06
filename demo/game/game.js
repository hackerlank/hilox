var renderTypes = {
     'canvas':1,
     'dom':1,
     'webgl':1
};

var renderType = location.search.slice(1);
if(!renderTypes[renderType]){
    renderType = 'canvas';
}




var renderTypeElem = document.createElement('div');
renderTypeElem.style.cssText = 'position:absolute;right:5px;top:5px;z-index:99999;';
document.getElementsByTagName('body')[0].appendChild(renderTypeElem);

var renderTypeList = ['canvas', 'dom', 'webgl'];
renderTypeList.forEach(function(type){
    var typeElem = document.createElement('div');
    typeElem.innerHTML = '<input type="radio" data-type="{type}">{type}</input>'.replace(/{type}/g, type);
    typeElem.setAttribute('data-type', type);
    typeElem.style.cssText = 'display:inline;margin-left:10px;line-height:20px;cursor:pointer;height:40px;';
    typeElem.input = typeElem.children[0];
    renderTypeElem.appendChild(typeElem);
    if(type === renderType){
        typeElem.input.checked = true;
    }

    typeElem.onclick = function(){
        if(renderType !== type){
            location.search = type;
        }
    }
});


var game = {}

function onResize(){
	var winWidth = (window.innerWidth || document.documentElement.clientWidth);
	var winHeight = (window.innerHeight || document.documentElement.clientHeight);

	var gameX = 0;
	var gameY = 0;
	var gameScale = 1.0;
	var gameWidth = 530;
	var gameHeight = 800;


	if(winWidth/winHeight > gameWidth/gameHeight)
	{//fix h
	   gameScale = winHeight/gameHeight;
	   gameX = (winWidth - gameWidth * gameScale)/2.0;
	   gameY = 0.0;
	}
	else
	{//fix w
	   gameScale = winWidth/gameWidth;
	   gameY = (winHeight - gameHeight * gameScale)/2.0;
	   gameX = 0.0;
	}

	var gameContainer = document.getElementById("game-container");
	gameContainer.style.height = (gameHeight * gameScale) + 'px';
	gameContainer.style.width = (gameWidth * gameScale) + 'px';
	gameContainer.style["margin-left"] = gameX + 'px';
	gameContainer.style["margin-top"] = gameY + 'px';


    game.winWidth = winWidth;
    game.winHeight = winHeight;
    game.x = gameX;
    game.y = gameY;
    game.w = gameWidth;
    game.h = gameHeight;
    game.scale = gameScale;
    game.container = gameContainer;

    var stage = game.stage;
    if(stage){
        stage.width = game.w;
        stage.height = game.h;
        stage.scaleX = game.scale;
        stage.scaleY = game.scale;
    }
}

function onLoad(){
    onResize();

    //init stage
    var stage = new Hilo.Stage({
        renderType: renderType,
        container: game.container,
        width: game.w,
        height: game.h,
        scaleX: game.scale,
        scaleY: game.scale,
	//background:'#000'
    });
    game.stage = stage;

    //start stage ticker
    var ticker = new Hilo.Ticker(60);
    ticker.addTick(stage);
    ticker.start();

    //enable dom events
    stage.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END]);



 
            
    for(var i = 0;i<20;i++){
            
//create a fish sprite
            var fish = new Hilo.Sprite({
                frames: {width:174, height:126, image: 'images/fish.png', rect:[0,0,174,1512]},
                x: 10 * (i%50),
                y: 100 * (i%8),
                duration: 100,
                loop: true,
                update: function(){
                    if(this.x > stage.width){
                        this.x = 0;
                    }else{
                        this.x += 3;
                    }
                }
            }).addTo(stage);
    }	
      
    var root = new Hilo.Container({
	        background: '#ffe',
	        clipChildren: true,
	        //alpha:0.5,
	        width:400,
	        height:400,
	        x:265,
	        y:300,
	        rotation:45
	    }).addTo(stage);

    var container = new Hilo.Container({
                background: '#efe',
                clipChildren: true,
                //alpha:0.5,
                width:300,
                height:300,
                x:200,
                y:200,
                rotation:30
            }).addTo(root);

    //green button
    var greenBtn = new Hilo.Button({
        id: 'greenBtn',
        image: 'images/btn.png',
        width: 64,
        height: 64,
        upState: {rect:[0, 64, 64, 64]},
        overState: {rect:[64, 64, 64, 64]},
        downState: {rect:[128, 64, 64, 64]},
        disabledState: {rect:[192, 64, 64, 64]},
        x: 190,
        y: 80
    }).addTo(container);
    var greenBtn2 = new Hilo.Button({
        id: 'greenBtn',
        image: 'images/btn.png',
        width: 64,
        height: 64,
        upState: {rect:[0, 64, 64, 64]},
        overState: {rect:[64, 64, 64, 64]},
        downState: {rect:[128, 64, 64, 64]},
        disabledState: {rect:[192, 64, 64, 64]},
        x: 80,
        y: 90
    }).addTo(container);
    
    //blue button
    var blueBtn = new Hilo.Button({
        id: 'blueBtn',
        image: 'images/btn.png',
        width: 64,
        height: 64,
        upState: {rect:[0, 0, 64, 64]},
        disabledState: {rect:[192, 0, 64, 64]},
        x: 40,
        y: 300
    }).addTo(stage);

    var mask = new Hilo.View({
        background: '#000',
        alpha: 0.5,
        //alpha:0.5,
        width:100,
        height:100,
        x:0,
        y:0,
    }).addTo(root);

    

    //bind pointer events
    blueBtn.on(Hilo.event.POINTER_START, function(e){
        console.log(e.type, this);
    }).on(Hilo.event.POINTER_END, function(e){
        console.log(e.type, this);
    });

    greenBtn.on(Hilo.event.POINTER_START, function(e){
        console.log(e.type, this);
    }).on(Hilo.event.POINTER_END, function(e){
        console.log(e.type, this);
    });

    greenBtn2.on(Hilo.event.POINTER_START, function(e){
        console.log(e.type, this);
    }).on(Hilo.event.POINTER_END, function(e){
        console.log(e.type, this);
    });

    blueBtn.setImage({
                image: 'images/fish.png',
                rect: [0, 0, 174, 126],
                scaleX:0.5,
		scaleY:0.5,
            });
    blueBtn.setText({text:"sss",background:'#0ff'});

//static bitmap
            var bmp = new Hilo.Bitmap({
                image: 'images/fish.png',
                rect: [0, 0, 174, 126],
                split: [60,60,54,6],
                width:300,
                height:300,
                //scaleX:2,
                x: 100,
                y: 120,
                background:'#0e0'
            }).addTo(stage);

            //dom element
            var blueRect = new Hilo.Element({
                id: 'blueRect',
                element: Hilo.createElement('div', {
                    style: {
                        backgroundColor: '#004eff',
                        position: 'absolute'
                    }
                }),
                width: 100,
                height: 100,
                x: 50,
                y: 70
            }).addTo(stage);
blueRect.run(1,{rotation:360}, true);
var func=function(a, b){
    blueRect.run(1,{alpha:a}, function(){ func(b,a); })
};
func(-0.5,0.5);
            //dom element
            var yellowRect = new Hilo.Element({
                id: 'yellowRect',
                element: Hilo.createElement('div', {
                    style: {
                        backgroundColor: '#ff0',
                        position: 'absolute'
                    }
                }),
                width: 100,
                height: 100,
                x: 80,
                y: 100
            }).addTo(stage);

            //dom element
            var redRect = new Hilo.Element({
                id: 'redRect',
                element: Hilo.createElement('div', {
                    style: {
                        backgroundColor: '#f00',
                        position: 'absolute',
                    }
                }),
                width: 100,
                height: 100,
                x: -50,
                y: 0
            }).addTo(container);

//text view
            var text = new Hilo.Text({
                text: "生命在他里头，这生命就是人的光。光照在黑暗里，黑暗却不接受光。 (《新约.约翰福音》第1章)\nWhat has come into being in him was life, and the life was the light of all people. The light shines in the darkness, and the darkness did not overcome it. John 1-4,5",
                width: 200,
                //height: 300,
                x: 40,
                y: 350,
		background:'#0f0'
            }).addTo(stage);

            var text = new Hilo.Text({
                text: "John 1-4,5",
                width: 300,
                height: 300,
                x: 200,
                y: 450,
		background:'#0ff',
                alpha:0.5,
                textAlign:'center',
            }).addTo(stage);

	    var fps = new Hilo.Text({
                text: "FPS:",
                x: 40,
                y: 40,
            }).addTo(stage);

            fps.onUpdate = function(){
                fps.text = "FPS:"+ticker.getMeasuredFPS();
	    }

            var lbl = new Hilo.Label({
                font:{text:'0235689471', width:64, height:64, image:'images/num.png', rect:[0,0,256,256]},
                text: "00",
                x: 400,
                y: 40,
            }).addTo(stage);

            lbl.onUpdate = function(){
                lbl.text = ticker.getMeasuredFPS();
	    }

    var scroll = new Hilo.Scroll({
                width: 300,
                height: 300,
                innerWidth: 300,
                innerHeight: 600,
                x: 160,
                y: 200,
		background:'#8ff',
    }).addTo(stage);

    var stext = new Hilo.Text({
        text: "生命在他里头，这生命就是人的光。光照在黑暗里，黑暗却不接受光。 (《新约.约翰福音》第1章)\nWhat has come into being in him was life, and the life was the light of all people. The light shines in the darkness, and the darkness did not overcome it. John 1-4,5",
        width: 200,
        height: 500,
	background:'#0f0'
    }).addTo(scroll.view);

 var btn = new Hilo.Button({
            text:{text:"创建角色",background:'#0ff'},
            x: 270,
            y: 500
        }).addTo(stage);

}
