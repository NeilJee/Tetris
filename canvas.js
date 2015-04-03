/**
 * Created by Administrator on 2015/3/5.
 */
var Tetris = function () {
    /*Game对象，负责canvas画布相关的初始化，操作等*/
    function Game() {
        var interval;
        this.self = this;
        this.downonce = 0;
        this.board = new Board();
        Keyboard.call(this);
        this.start = function () {

            interval = setInterval(this.loop, 1000 / this.board.FPS, this.self);

        };
        this.loop = function (that) {

            if (that.downonce === 0) {
                /*that.board.shape.clearShap(that.board.canvas.context2d);*/
                that.board.clearBoard();
                that.board.drawBoard();
                that.board.shape.refresh();
                that.board.shape.draw(that.board.canvas.context2d);
                that.downonce = 1;
            }
            else if (that.downonce === 1) {
                /*that.board.shape.clearShap(that.board.canvas.context2d);*/
                that.board.clearBoard();
                that.board.drawBoard();
                that.board.shape.draw(that.board.canvas.context2d);
                if(that.board.isHit()){
                    that.downonce=0;
                    that.board.endDown();
                }
                else{
                    that.board.shape.down();
                }


            }

        };
        /*        this.gamelogic = function (context, cw, ch) {

         var objA = new Shape();
         context = this.context2D;
         objA.draw(context);
         setInterval(function () {
         x1 = objA.x;
         y1 = objA.y + 2;
         w1 = objA.width;
         h1 = objA.height;
         objA.update(x1, y1, w1, h1);
         context.clearRect(0, 0, cw, ch);
         objA.draw(context);
         }, 1000 / this.FPS);
         };*/
        this.start();

    };
    function Canvas(id, w, h) {
        this.id = id;
        this.canvas = document.getElementById(this.id);
        this.context2d = this.canvas.getContext("2d");
        this.setSize(w, h);
    }

    Canvas.prototype = {
        constructor: Canvas,
        setSize: function (w, h) {
            this.canvas.width = w || window.innerWidth;
            this.canvas.height = h || window.innerHeight;
        }
    }

    function Board() {

        this.cols = 20;
        this.rows = 30;

        this.blockSize = 20;
        this.grid = [];
        this.FPS = 5;
        this.canvas = new Canvas("mycanvas", this.cols * this.blockSize, this.rows * this.blockSize);
        this.shape = new Shape(this);
        this.init();
        this.drawBoard();
    }

    Board.prototype = {
        constructor: Board,
        init: function () {
            for (var y = 0; y < this.rows; y++) {
                this.grid[y] = [];
                for (var x = 0; x < this.cols; x++) {
                    this.grid[y][x] = 0;
                }
            }

        },
        drawBoard: function () {
            this.canvas.context2d.fillStyle = "#F5F5F5";
            this.canvas.context2d.fillRect(0, 0, this.cols * this.blockSize, this.rows * this.blockSize);
            for (var y = 0; y < this.rows; y++) {
                for (var x = 0; x < this.cols; x++) {
                    if(this.grid[y][x]!==0){
                        this.canvas.context2d.fillStyle = this.shape.colors[this.grid[y][x]-1];
                        this.canvas.context2d.fillRect( x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize)
                    }
                }
            }
        },
        clearBoard: function () {
            this.canvas.context2d.clearRect(0, 0, this.cols * this.blockSize, this.rows * this.blockSize);
        },
        isHit: function () {
            var blockSize = this.blockSize;
            function nextBlock(type, x, y) {
                var target = [];
                var rows = type.length;
                var cols = type[0].length;


                for (var j = 0; j < cols; j++) {
                    if (type[rows - 1][j] === 0) {
                        target[j] = [y / blockSize + rows - 1,j + x / blockSize ];
                    }
                    else if (type[rows - 1][j] === 1) {
                        target[j] = [y / blockSize + rows,j + x / blockSize ];
                    }
                }
                return target;

            }

            var next = nextBlock(this.shape.type, this.shape.x, this.shape.y)
            for (var i = 0; i < next.length; i++) {
                if(next[i][0]>this.rows-1){
                    return true
                }
                if (this.grid[next[i][0]][next[i][1]] !== 0) {
                    return true
                }
            }
            return false
        },
        endDown:function(){
            var blockSize = this.blockSize;
            function thisShape(type,typenum, x, y) {
                var target = [];
                var rows = type.length;
                var cols = type[0].length;

            for(var i=0;i<rows;i++){
                target[i]=[];
                for (var j = 0; j < cols; j++) {
                    if (type[i][j] === 0) {
                        target[i][j] = [y / blockSize + i,j + x / blockSize,-1];
                    }
                    else if (type[i][j] === 1) {
                        target[i][j] = [y / blockSize + i,j + x / blockSize, typenum];
                    }
                }
            }
            return target;
            }
            var theShape=thisShape(this.shape.type,this.shape.typenum,this.shape.x,this.shape.y)
            for(var i=0;i<theShape.length;i++){
                for(var j=0;j<theShape[0].length;j++){
                    if(theShape[i][j][2]!==-1){
                        this.grid[theShape[i][j][0]][theShape[i][j][1]]=theShape[i][j][2]+1;
                    }

                }
            }

        },
        rotate:function(){
            var type=[];
                for(var j=0;j<this.shape.type[0].length;j++){
                    type[j]=[];
                }
            for(var i=0;i<this.shape.type.length;i++){
                for(var j=0;j<this.shape.type[0].length;j++){
                    type[j][this.shape.type.length-1-i]=this.shape.type[i][j];
                }
            }
            this.shape.type=type;
            type=null;


        },
        hrmove:function(){
            this.shape.x+=this.blockSize;
        },
        hlmove:function(){
            this.shape.x-=this.blockSize;
        },
        dmove:function(){

                this.shape.y+=this.blockSize;

        },
        validMove:function(h,v){
            if(h===-1){
                if((this.shape.x-this.blockSize)<0){
                    return false;
                }
            }
            else if(h===1){
                if((this.shape.x+this.shape.type[0].length*this.blockSize+this.blockSize)>this.blockSize*this.cols){
                    return false;
                }
            }
            else if(v===-1){
                if(this.isHit()){
                    return false;
                }
            }
            else if(v===1){
                var type=[];
                for(var j=0;j<this.shape.type[0].length;j++){
                    type[j]=[];
                }
                for(var i=0;i<this.shape.type.length;i++){
                    for(var j=0;j<this.shape.type[0].length;j++){
                        type[j][this.shape.type.length-1-i]=this.shape.type[i][j];
                    }
                }

                for(i=0;i<type.length;i++){
                    for(j=0;j<type[0].length;j++){
                        if(this.grid[this.shape.y/this.blockSize+i][this.shape.x/this.blockSize+j]!==0){
                            return false;
                        }
                    }
                }

            }

            return true;
        },
        clearLines:function(){

        }
    }

    /*A对象，作为方块对象*/
    function Shape(board) {
        this.types = [
            [
                [1, 1],
                [1, 1]
            ],
            [
                [1, 1, 1],
                [0, 0, 1]
            ],
            [
                [1, 1, 1],
                [1, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 1, 1],
                [1, 1, 0]
            ],
            [
                [1, 1, 1, 1]
            ],
            [
                [0, 1, 0],
                [1, 1, 1]
            ]
        ];
        this.board = board;
        this.colors = ["#4FC5C7", "#97EC71", "#DBF977", "#DE9DD6", "#FA6E86", "#8A7F7D", "#F1B6AE"];
        this.x = (board.cols / 2 - 2) * board.blockSize;
        this.y = 0;
        this.typenum = Math.floor(Math.random() * (this.types.length));
        this.type = this.types[this.typenum];
        this.color = this.colors[this.typenum];

    };
    Shape.prototype = {
        constructor: Shape,
        draw: function (context) {

            context.fillStyle = this.color;
            for (var y = 0; y < this.type.length; y++) {
                for (var x = 0; x < this.type[0].length; x++) {
                    if (this.type[y][x] === 1) {
                        context.fillRect(this.x + x * this.board.blockSize, this.y + y * this.board.blockSize, this.board.blockSize, this.board.blockSize)
                    }
                }
            }
        },
        refresh: function () {
            this.x = (this.board.cols / 2 - 1) * this.board.blockSize;
            this.y = 0;
            this.typenum = Math.floor(Math.random() * (this.types.length));
            this.type = this.types[this.typenum];
            this.color = this.colors[this.typenum];
        },
        down: function () {
            this.y += this.board.blockSize;
        }
    };

    function Keyboard(){
        var self=this;
        var keys={
            38: 'top',
            39: 'right',
            40: 'down',
            37: 'left'
        };
        this.eventHandles=function(){
            document.addEventListener("keydown",this.keyPressEvent,false);
        };
        this.keyPressEvent=function(event){
            var refresh=0;
            if(keys[event.keyCode]){
                var key=keys[event.keyCode];
                switch (key){
                    case "top":
                        if(self.board.validMove(0,1)){
                            self.board.rotate();
                            refresh=1;
                        }
                        break;
                    case "right":
                        if(self.board.validMove(1,0)){
                            self.board.hrmove();
                            refresh=1;
                        }
                        break;
                    case "left":
                        if(self.board.validMove(-1,0)){
                            self.board.hlmove();
                            refresh=1;
                        }
                        break;
                    case "down":
                        if(self.board.validMove(0,-1)) {
                            self.board.dmove();
                        }
                        break;
                    default :

                }
                if(refresh===1){
                    self.board.clearBoard();
                    self.board.drawBoard();
                    self.board.shape.draw(self.board.canvas.context2d);
                }
            }
        }
        this.eventHandles();
    }
    function Points() {
        this.points = 0;

    };

    return new Game();

}()