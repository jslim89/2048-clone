/*
 * Ref:
 *      - https://chandruscm.wordpress.com/2014/10/25/2048-in-c-c/
 */
const SIZE = 4;

$(function() {

  var matrix = [];

  resetGame();

  $('body').keyup(function(e) {
    if ([37, 38, 39, 40].indexOf(e.which) < 0) return;

    try {
      if (e.which == 37) { // left
        rotateRight();
        moveUp();
        rotateRight();
        rotateRight();
        rotateRight();
      } else if (e.which == 38) { // top
        moveUp();
      } else if (e.which == 39) { // right
        rotateRight();
        rotateRight();
        rotateRight();
        moveUp();
        rotateRight();
      } else if (e.which == 40) { // bottom
        rotateRight();
        rotateRight();
        moveUp();
        rotateRight();
        rotateRight();
      }
      spawn();
      if (isGameOver()) {
        alert('Game over');
        resetGame();
      }
    } catch (ex) {
      // do nothing
      console.log('stackoverflow');
    }
    _showMatrix();
  });

  /*
   * rotate 90˚
   *
   * 0,0 = 0,3
   * 0,1 = 1,3
   * 0,2 = 2,3
   * 0,3 = 3,3

   * 1,0 = 0,2
   * 1,1 = 1,2
   * 1,2 = 2,2
   * 1,3 = 3,2
   * ...
   */
  function rotateRight() {

    var newMatrix = [];
    for (r = 0; r < SIZE; r++) {
      for (c = 0; c < SIZE; c++) {
        if (typeof newMatrix[c] == 'undefined') newMatrix[c] = [];
        newMatrix[c][SIZE-r-1] = matrix[r][c];
      }
    }
    for (r = 0; r < SIZE; r++) {
      for (c = 0; c < SIZE; c++) {
        updateTileWithNumber(r, c, newMatrix[r][c]);
      }
    }
  }

  function moveUp() {
    // move from top to bottom
    for (c = 0; c < SIZE; c++) {
      for (r = 0; r < SIZE; r++) {

        // if the tile is empty
        if (matrix[r][c] < 1) {
          // the tile below (just 1 tile below the current tile)
          for (i = r + 1; i < SIZE; i++) {

            if (matrix[i][c]) { // tile below is not empty
              // move the tile below to current tile
              updateTileWithNumber(r, c, matrix[i][c]);
              // set the tile below to empty
              updateTileWithNumber(i, c, 0);
              break;
            }
          }
        }
      }
    }
    updateUp();
  }

  function updateUp() {
    for (c = 0; c < SIZE; c++) {
      for (r = 0; r < SIZE; r++) {
        if (typeof matrix[r+1] == 'undefined') continue;
        if (typeof matrix[r][c] == 'undefined') matrix[r][c] = 0;
        // if the current tile is not empty & is equal to the tile below
        if (matrix[r][c] && matrix[r][c] == matrix[r+1][c]) {
          var num = matrix[r][c] * 2;
          updateTileWithNumber(r, c, num);
          updateTileWithNumber(r+1, c, 0);
          updateScoreForTile(num);
        }
      }
    }
  }

  function updateScoreForTile(num) {
    var score = parseInt($('#score').text());
    score += num;
    $('#score').text(score);
  }

  function getTile(row, col) {
    return $('#canvas tr').eq(row).find('td').eq(col);
  }

  function getRandomNum() {
    return Math.pow(2, Math.floor((Math.random() * 2) + 1));
  }

  function updateTileWithNumber(row, col, num) {
      matrix[row][col] = parseInt(num);

      return getTile(row, col)
        .removeClass()
        .addClass('cell-' + num)
        .text(num == 0 ? '' : num);
  }

  function spawn() {
    var row = Math.floor(Math.random() * SIZE);
    var col = Math.floor(Math.random() * SIZE);
    if (matrix[row][col] > 0) {
      return spawn();
    }
    console.log('new tile position: '+row+','+col);
    updateTileWithNumber(row, col, getRandomNum());
    return;
  }

  function resetGame() {
    var initialTiles = [
      Math.floor(Math.random() * SIZE) + ',' + Math.floor(Math.random() * SIZE)
      , Math.floor(Math.random() * SIZE) + ',' + Math.floor(Math.random() * SIZE)
    ];
    // initial tiles
    for (r = 0; r < SIZE; r++) {
      matrix[r] = [];
      for (c = 0; c < SIZE; c++) {
        var tileIndex = r + ',' + c;
        if (initialTiles.indexOf(tileIndex) >= 0) {
          var rand = getRandomNum();
          updateTileWithNumber(r, c, rand);
          continue;
        }
        updateTileWithNumber(r, c, 0);
      }
    }
  }

  function isGameOver() {
    var count = 0, similarSiblingCount = 0;

    for (r = 0; r < SIZE; r++) {
      for (c = 0; c < SIZE; c++) {
        if (matrix[r][c] > 0) count++;

        // next row check
        if (typeof matrix[r+1] != 'undefined') {
          if (matrix[r][c] == matrix[r+1][c]) similarSiblingCount++;
        }
        // next column check
        if (typeof matrix[r][c+1] != 'undefined') {
          if (matrix[r][c] == matrix[r][c+1]) similarSiblingCount++;
        }
      }
    }

    if (count == SIZE * SIZE) {
      return similarSiblingCount < 1;
    }
    return false;
  }

  function _showMatrix() {
    var str = '';
    for (i = 0; i < matrix.length; i++) {
      str += '\n[' + matrix[i].join(',') + ']';
    }
    console.log(str);
  }
});
