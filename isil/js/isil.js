/**
 * Created by juliojamil on 19/11/16.
 */
var bg;

function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}

function getDocWidth() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollWidth,
        D.body.offsetHeight, D.documentElement.offsetWidth,
        D.body.clientHeight, D.documentElement.clientWidth
    );
}

function prepareMain() {
    var canvas = document.getElementById('mainCanvas');
    context = canvas.getContext('2d');
    canvas.width = document.documentElement.offsetWidth;
    canvas.height = document.documentElement.offsetHeight;
    stage = new createjs.Stage(canvas);

    bg = new createjs.Container();
    stage.addChild(bg);

    stage.enableMouseOver();
    window.addEventListener('resize', function () {
        resizeCanvas(canvas);
    }, true);
    createjs.Ticker.addEventListener("tick", stage);
    loading();
}

function bgUpdate(src) {
    var image = new Image();
    image.src = src;
    image.onload = function(){
        var bitmap = new createjs.Bitmap(image);
        bitmap.scaleX = stage.canvas.width/image.width;
        bitmap.scaleY = stage.canvas.height/image.height;
        bg.addChild(bitmap);
    };
}

function resizeCanvas(canvas) {
    var background = window.sessionStorage.getItem('background');
    stage.canvas.width = canvas.width = document.documentElement.offsetWidth;
    stage.canvas.height = canvas.height = document.documentElement.offsetHeight;
    stage.update();

    if(background != null) {
        bgUpdate(background);
    }
}

function tBase64(t, d) {
    var s = {};
    s.event = t;
    s.data = d;

    var code = window.sessionStorage.getItem('code');
    var tencrypted = CryptoJS.SHA256(code);
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(s), tencrypted.toString()).toString();
    var encryptedArray = CryptoJS.enc.Utf8.parse(encrypted);
    var base64 = CryptoJS.enc.Base64.stringify(encryptedArray);
    return base64;
}

function tString(t) {
    //console.log(t);
    var code = window.sessionStorage.getItem('code');
    var tencrypted = CryptoJS.SHA256(code);
    var encryptedArray = CryptoJS.enc.Base64.parse(t.token);
    var decrypted = CryptoJS.AES.decrypt(encryptedArray.toString(CryptoJS.enc.Utf8), tencrypted.toString());
    var result = decrypted.toString(CryptoJS.enc.Utf8);
    return result;
}

function loading() {
    document.getElementById("loading").remove();
    var loadingImage = new Image;
    loadingImage.src = 'https://assets.sr-1.tk/img/loadingSprite.png';
    loadingImage.onload = function (event) {
        var dataSpritesLoading = {
            "images": [loadingImage],

            "frames": [
                [0, 0, 104, 42, 0, 0, 0],
                [104, 0, 104, 42, 0, 0, 0],
                [208, 0, 104, 42, 0, 0, 0],
                [312, 0, 104, 42, 0, 0, 0],
                [416, 0, 104, 42, 0, 0, 0],
                [520, 0, 104, 42, 0, 0, 0],
                [624, 0, 104, 42, 0, 0, 0],

                [0, 42, 116, 18, 0, 0, 0],
                [116, 42, 116, 18, 0, 0, 0],
                [232, 42, 116, 18, 0, 0, 0],
                [348, 42, 116, 18, 0, 0, 0]
            ],

            "animations": {
                "loading/logo": {"frames": [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]},
                "loading/text": {"frames": [10, 9, 8, 7, 8, 9, 10]}
            }
        };

        var spriteSheetLoading = new createjs.SpriteSheet(dataSpritesLoading);
        var _aLoadingImage = new createjs.Sprite(spriteSheetLoading, "loading/logo");
        var _aLoadingText = new createjs.Sprite(spriteSheetLoading, "loading/text");
        _aLoadingImage.framerate = 6;
        _aLoadingText.framerate = 4;
        _aLoadingImage.x = 6;
        _aLoadingImage.y = 0;
        _aLoadingText.x = 0;
        _aLoadingText.y = 42;
        var loadingContainer = new createjs.Container();
        loadingContainer.x = (stage.canvas.width - 116 * _aLoadingImage.scaleX) / 2;
        loadingContainer.y = (stage.canvas.height - 90 * _aLoadingImage.scaleY) / 2;

        var loadingBarContainer = new createjs.Container();
        var loadingBarHeight = 10;
        var loadingBarWidth = 116;
        var LoadingBarColor = createjs.Graphics.getRGB(0, 0, 0);

        var loadingBar = new createjs.Shape();
        loadingBar.graphics.beginFill(LoadingBarColor).drawRect(0, 0, 1, loadingBarHeight).endFill();

        var frame = new createjs.Shape();
        var padding = 3;
        frame.graphics.setStrokeStyle(1).beginStroke(LoadingBarColor).drawRect(-padding / 2, -padding / 2, loadingBarWidth + padding, loadingBarHeight + padding).endStroke();
        loadingBarContainer.addChild(loadingBar, frame);
        loadingBarContainer.x = 0;
        loadingBarContainer.y = 64;

        var loadProgressLabel = new createjs.Text("", "14px Verdana", "black");
        loadProgressLabel.textAlign = "center";
        loadProgressLabel.x = 56;
        loadProgressLabel.y = 80;

        loadingContainer.addChild(_aLoadingImage, _aLoadingText, loadingBarContainer, loadProgressLabel);
        stage.addChild(loadingContainer);
        stage.update();
        //
        manifest = [
            {src: "https://assets.sr-1.tk/img/background-loading.jpg", id: "background-loading"},
            {src: "https://assets.sr-1.tk/img/background-login.jpg", id: "background-login"},
            {src: "https://assets.sr-1.tk/css/login.css", id: "css-login"},
            {src: "https://cdn-orig.socket.io/socket.io-1.4.5.js", id: "socket.io"},
            {src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js", id: "jquery"}
        ];
        var preload = new createjs.LoadQueue(true);
        preload.addEventListener("complete", function () {
            handleLoadingComplete(loadingContainer, preload);
        });
        preload.addEventListener("progress", function () {
            handleLoadingProgress(loadingBar, loadProgressLabel, loadingBarWidth, preload);
        });
        preload.on("fileload", handleFileLoaded);
        preload.loadManifest(manifest, true);
        //
    };
}

function handleFileLoaded(event) {
    var item = event.item;
    var id = item.id;
    //console.log(id);
    if(id == "background-loading"){
        window.sessionStorage.setItem('background', item.src);
        bgUpdate(item.src);
    }
}

function  handleLoadingProgress(loadingBar, loadProgressLabel, loadingBarWidth, preload){
    loadingBar.scaleX = preload.progress * loadingBarWidth;
    var progresPrecentage = Math.round(preload.progress*100);
    loadProgressLabel.text = progresPrecentage + "% Loaded" ;
    stage.update();
}

function handleLoadingComplete(loadingContainer, preload) {
    loadingContainer.removeAllEventListeners();
    preload.removeAllEventListeners();
    loadingContainer.removeAllChildren();
    stage.removeChild(loadingContainer);
    createLoginForm(preload.getItem('background-login').src);
}

function createLoginForm(bg) {
    var htmlLogin = $('' +
        '<div class="loginContainer">' +
        '<div class="loginTop">' +
        '<h4>Seja Bem Vindo(a)!</h4>' +
        '<p>No momento n&atilde;o estamos aceitando novos usu&aacute;rios.</p>' +
        '<p>Caso voc&ecirc; tenha registrado-se como usuario beta, e n&atilde;o lembre a senha, voc&ecirc; poder&aacute; solicitar uma nova senha <a href="#">AQUI</a>.</p>' +
        '</div>' +
        '<div class="clearfix"></div>' +
        '<div class="loginForm">' +
        '<div class="formLabel">Email:</div>' +
        '<div class="formInput">' +
        '<input type="text" class="input" id="formUser" placeholder="E-mail" maxlength="254">' +
        '</div>' +
        '<div class="clearfix"></div>' +
        '<div class="formLabel">Senha:</div>' +
        '<div class="formInput">' +
        '<input type="password" class="input" id="formPass" placeholder="Senha" maxlength="32">' +
        '</div>' +
        '<div class="clearfix"></div>' +
        '<div class="formBtn"><a id="formSend">Conectar</a></div>' +
        '</div>' +
        '</div>' +
        '').hide().appendTo(document.body)[0];


    var domLogin = new createjs.DOMElement(htmlLogin);
    domLogin.x = (stage.canvas.width - 400) / 2;
    domLogin.y = (stage.canvas.height - 380) / 2;

    window.addEventListener('resize', function () {
        domLogin.x = (stage.canvas.width - 400) / 2;
        domLogin.y = (stage.canvas.height - 380) / 2;
    });

    var loginContainer = new createjs.Container();
    loginContainer.addChild(domLogin);
    stage.addChild(loginContainer);
    stage.update();
    window.sessionStorage.setItem('background', bg);
    $('.loginContainer').show();
    bgUpdate(bg);
}
