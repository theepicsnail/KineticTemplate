define(["promise", "app/cell"], function(Promise, Cell) {

  function loadLevel(level) {
    // 2d int array
    // return a 2d array of cells that are wired together
    var grid = [];
    var r, row, c;
    for(r = 0 ; r < 10 ; r ++) {
      row = [];
      grid.push(row);
      for(c = 0 ; c < 16 ; c++) {
        var cell = new Cell(level[r][c]);
        row.push(cell);

        if(r !== 0) {
          cell.up = grid[r-1][c];
          grid[r-1][c].down = cell;
        }
        if(c !== 0) {
          cell.left = row[c-1];
          row[c-1].right = cell;
        }
      }
    }
    return grid;
  }


  var k=0, r=1, y=2, w=3;
  var grid = loadLevel([
    [w,w,w,k,k,k,k,k,k,y,y,y,r,r,r,r],
    [w,w,w,k,k,k,k,k,k,y,y,y,r,r,r,r],
    [k,k,k,k,r,r,r,k,k,r,r,r,y,y,y,y],
    [k,k,k,k,r,r,r,k,k,r,r,r,y,y,y,y],
    [k,k,k,k,k,k,k,k,k,k,k,w,k,k,k,k],
    [y,y,y,y,y,r,r,r,r,r,r,r,y,y,y,k],
    [y,y,y,y,y,r,r,r,r,r,r,r,y,y,y,k],
    [y,y,y,y,y,w,w,w,y,y,y,y,r,r,r,k],
    [r,r,r,r,y,w,w,w,y,k,k,k,r,r,r,k],
    [r,r,r,r,r,r,r,r,r,k,k,k,k,k,k,k],
  ]);


  var sel_color = 0;
  var width, height;
  var canvas;
  var ctx;
  var y_gap = 0;
  var x_gap = 0;
  var size; // size of each cell
  var winScreen = false;
  var last_percent = 1;
  function onFrame() {
    var timestamp = +new Date()/1000;
    for(row = 0 ; row < 10 ; row ++) {
      for(col = 0 ; col < 16 ; col ++) {
        //console.log(grid[row][col]);
        grid[row][col].setTimestamp(timestamp);
      }
    }

    window.requestAnimationFrame(onFrame);
    ctx.canvas.width = canvas.width = width = window.innerWidth;
    ctx.canvas.height = canvas.height = height =window.innerHeight;
    draw();

  }

  function draw() {
    var row, col;
    var cell_width = width/18;
    var cell_height = height/10;

    size  = cell_width < cell_height ? cell_width : cell_height;

    x_gap = (width - size*16);
    y_gap = (height - size*10)/2;

    //fill bg
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,width, height);

    // Move to board area
    ctx.translate(x_gap, y_gap);

    for(row = 0 ; row < 4 ; row ++) { //button row
      if (sel_color === row) {
        ctx.fillStyle = "#FFF";
        ctx.fillRect(-2*size, 2*row*size, 2*size, 2*size);
      }
      ctx.fillStyle = Cell.colors[row];
      ctx.fillRect(2-2*size, 2*row*size+2, 2*size-4, 2*size-4);
    }

    var settled = true, won = true, win_color = grid[0][0].color;
    for(row = 0 ; row < 10 ; row ++) {
      for(col = 0 ; col < 16 ; col ++) {
        cell = grid[row][col];
        cell.draw(ctx, col * size, row * size, size, size);
        if(settled) {
          settled = cell.fill_dir === Cell.DIR.NONE;
          if (won) {
            won = cell.color === win_color;
          }
        }
      }
    }

    //console.log(settled, won);
    if(settled && won) {
      winScreen = true;
    }
    if(winScreen) {
      onWin();
    }

  }

  function onWin() {
    var color = Math.floor( Math.random() * 4);
    // setting fill time here will let the win screen remain in sync.
    grid[0][0].startFill(color, Cell.DIR.CENTER);
    grid[9][0].startFill(color, Cell.DIR.CENTER);
    grid[0][15].startFill(color, Cell.DIR.CENTER);
    grid[9][15].startFill(color, Cell.DIR.CENTER);

    ctx.font = size + "pt Calibri";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("WIN", size * 8, size * 5);
  }


  function select(x, y) {
    var col = Math.floor((x - x_gap)/size);
    var row = Math.floor((y - y_gap)/size);
    //console.log(row, col);
    if ((col < 0) && (row >=0) && (row<8)) { // color selection menu
      selectColor(Math.floor(row/2));
      sel_color = Math.floor(row / 2);
    }

    if (row >=10 || col>=16 || row < 0 || col < 0) {
      return;  //Out of bounds
    }
    // grid[row][col].color = sel_color;

    grid[row][col].startFill(sel_color, Cell.DIR.CENTER);

  }

  function selectColor(color) {
    sel_color = color;
  }

  function addListeners() {
    function handler(evt) {
      if(!evt) {
        evt = event;
      }
      if(evt.touches) {
        evt = evt.touches[0];
      }
      select(evt.clientX, evt.clientY);
    }
    canvas.addEventListener("touchmove", function(event){event.preventDefault();}, false);
    canvas.addEventListener("touchstart", handler, false);
    canvas.addEventListener("mousedown", handler, false);
    document.addEventListener("keydown", function(e) {
      switch(e.keyCode) {
        case 49: sel_color = 0; break;
        case 50: sel_color = 1; break;
        case 51: sel_color = 2; break;
        case 52: sel_color = 3; break;
      }
    },true);
  }


  return {
    init: function() {
      return new Promise(function(accept, reject){
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        document.getElementById("content").appendChild(canvas);
        addListeners();
        accept();
      });
    },
    start: function() {
      window.requestAnimationFrame(onFrame);
    }
  };
});
