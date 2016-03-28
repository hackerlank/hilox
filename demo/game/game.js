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
renderTypeList.forEach(function(type)
{
    var typeElem = document.createElement('div');
    typeElem.innerHTML = '<input type="radio" data-type="{type}">{type}</input>'.replace(/{type}/g, type);
    typeElem.setAttribute('data-type', type);
    typeElem.style.cssText = 'display:inline;margin-left:10px;line-height:20px;cursor:pointer;height:40px;';
    typeElem.input = typeElem.children[0];
    renderTypeElem.appendChild(typeElem);
    if(type === renderType)
    {
        typeElem.input.checked = true;
    }

    typeElem.onclick = function()
    {
        if(renderType !== type)
        {
            location.search = type;
        }
    }
});



var winWidth = (window.innerWidth || document.documentElement.clientWidth);
var winHeight = (window.innerHeight || document.documentElement.clientHeight);

var gameX = 0;
var gameY = 0;
var gameScale = 1.0;
var gameWidth = 480;
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

function init()
{
    //init stage
    var stage = new Hilo.Stage({
        renderType: renderType,
        container: gameContainer,
        width: gameWidth,
        height: gameHeight,
        scaleX: gameScale,
        scaleY: gameScale,
	background:'#000'
    });

    //start stage ticker
    var ticker = new Hilo.Ticker(20);
    ticker.addTick(stage);
    ticker.start();

    //enable dom events
    stage.enableDOMEvent([Hilo.event.POINTER_START, Hilo.event.POINTER_MOVE, Hilo.event.POINTER_END]);

    var root = new Hilo.Container({
	        background: '#ffe',
	        clipChildren: true,
	        //alpha:0.5,
	        width:400,
	        height:400,
	        x:300,
	        y:300,
	        rotation:45
	    }).addTo(stage);

    var container = new Hilo.Container({
                background: '#efe',
                clipChildren: true,
                //alpha:0.5,
                width:300,
                height:300,
                x:0,
                y:0,
                rotation:10
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
        overState: {rect:[64, 0, 64, 64]},
        downState: {rect:[128, 0, 64, 64]},
        disabledState: {rect:[192, 0, 64, 64]},
        x: 60,
        y: 70
    }).addTo(container);

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

}
