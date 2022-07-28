var matrix = [];
var whiteKingPosition = {};
var blackKingPosition = {};
var check = false;
var moves = [];
var gameStillOn = false;
var lastmove;
var foundPiece = false;
var blackControl = [];
var whiteControl = [];
var savemoves = [];
var validmoves = [];
var player = true;
var globalhelp;
var lastPiece;
var queeninghelp;
var queening = false;
var controlling = false;
var lastToMove = "B";
var selectedId = "A1";
var lastIds = [];
var mate = false;
var time;
var timers = {
  white: 1,
  black: 1,
  whiteID: document.getElementById("Wclock"),
  blackID: document.getElementById("Bclock"),
};
var Wclock;
var Bclock;
var takes = false;
var gameMoves = [];
var drawFlag = [false, false];
var queenedPiece;
var totalMoveList = [];
const timeToggleElement = document.getElementById("timeContainer");
var switchy = false;

//genero la matriz
function generateMatrix() {
  matrix = [];
  for (let i = 0; i < 8; i++) {
    matrix.push([]);
    for (let j = 0; j < 8; j++) {
      matrix[i].push(0);
    }
  }
}

//pongo las piezas en su respectivo casillero
function setPieces() {
  // Pawns
  for (let i = 0; i < 8; i++) {
    matrix[6][i] = "W_pawnS";
    matrix[1][i] = "B_pawnS";
  }
  // White pieces
  matrix[7][0] = "W_rookS";
  matrix[7][7] = "W_rookS";
  matrix[7][1] = "W_knight";
  matrix[7][6] = "W_knight";
  matrix[7][2] = "W_bishop";
  matrix[7][5] = "W_bishop";
  matrix[7][3] = "W_queen";
  matrix[7][4] = "W_kingS";
  whiteKingPosition = { row: 7, col: 4 };
  // Black pieces
  matrix[0][0] = "B_rookS";
  matrix[0][7] = "B_rookS";
  matrix[0][1] = "B_knight";
  matrix[0][6] = "B_knight";
  matrix[0][2] = "B_bishop";
  matrix[0][5] = "B_bishop";
  matrix[0][3] = "B_queen";
  matrix[0][4] = "B_kingS";
  blackKingPosition = { row: 0, col: 4 };
}

//genero el tablero
function generateBoard() {
  let board = document.getElementById("tablero");
  board.innerHTML = null;
  let squarelogic = true;
  for (let i = 65; i < 73; i++) {
    let setclass;
    squarelogic = !squarelogic;
    //genero las letras de la A a la H
    let letter = String.fromCharCode(i); //transforma nros del 65 al 73 en letras A-H
    let row = board.insertRow(i - 65); //inserto un row cada vez
    for (let j = 0; j < 8; j++) {
      if (squarelogic == true) {
        setclass = "blacksquare";
      } else {
        setclass = "whitesquare";
      }
      squarelogic = !squarelogic;
      let cell = row.insertCell(j); //y las celdas contenedoras
      //con sus piezas correspondientes a cada casillero.
      cell.innerHTML =
        '<img onclick="move(id)" src="assets/img/' +
        getThePiece(letter, j) +
        '.png" id="' +
        letter +
        (j + 1) +
        '">';
      cell.setAttribute("class", setclass);
    }
  }
}

function playerSwitch() {
  player = !player;
}

function move(id) {
  if (gameStillOn == true) {
    //limpio movimientos de piezas seleccionadas antes
    cleanBoard();
    //transformo la letra del id en numero de 0 a 7
    let turnToNumber = id.substr(0, 1);
    globalhelp = id;
    turnToNumber = turnToNumber.charCodeAt(0);
    turnToNumber = turnToNumber - 65;
    //transformo el numero del id en numero en vez de string
    let secondNumber = id.substr(1, 1);
    secondNumber = parseInt(secondNumber);
    secondNumber = secondNumber - 1;
    //guardo lo que hay dentro del casillero clickeado
    var holder = matrix[turnToNumber][secondNumber];
    document.getElementById(selectedId).setAttribute("class", "");
    //si no esta vacío
    if (holder != 0) {
      //consigo la letra W o B, clave de color de la pieza
      let color = holder.substr(0, 1);
      //consigo el string del nombre de la pieza
      let piece = holder.substr(2, holder.length - 2);
      //y guardo la posición de esa pieza para pasarla como parámetro a la lógica de los movimientos
      let position = {
        row: turnToNumber,
        col: secondNumber,
      };
      let moveArray = [];
      if (color != lastToMove) {
        document.getElementById(id).setAttribute("class", "selected");
        selectedId = id;
        moveArray = giveMoves(piece, moveArray, color, position);
        //pregunto que pieza fue clickeada
        //Si existen movimientos legales...
        if ((moveArray.length > 0) & (moveArray != undefined)) {
          savemoves = moveArray;
          for (let i = 0; i < moveArray.length; i++) {
            //...indicar cuales son
            if (matrix[moveArray[i].row][moveArray[i].col] != 0) {
              document
                .getElementById(findTheId(moveArray[i].row, moveArray[i].col))
                .setAttribute("class", "canTake");
              document
                .getElementById(findTheId(moveArray[i].row, moveArray[i].col))
                .setAttribute("onclick", "afterMove(id)");
              if (
                document.getElementById(
                  findTheId(moveArray[i].row, moveArray[i].col)
                ).style.backgroundColor != undefined
              ) {
                document.getElementById(
                  findTheId(moveArray[i].row, moveArray[i].col)
                ).style.backgroundColor = null;
              }
            } else {
              document
                .getElementById(findTheId(moveArray[i].row, moveArray[i].col))
                .setAttribute("src", "assets/img/available.png");
              document
                .getElementById(findTheId(moveArray[i].row, moveArray[i].col))
                .setAttribute("onclick", "afterMove(id)");
            }
          }
        }
      }
    }
  }
}

function giveMoves(piece, moveArray, color, position) {
  if (piece == "pawnS") {
    moveArray = pawnMove(color, position);
  }
  if (piece == "pawn") {
    moveArray = pawnMove(color, position);
  }
  if (piece == "knight") {
    moveArray = knightMove(color, position);
  }
  if (piece == "bishop") {
    moveArray = bishopMove(color, position);
  }
  if (piece == "rook") {
    moveArray = rookMove(color, position);
  }
  if (piece == "rookS") {
    moveArray = rookMove(color, position);
  }
  if (piece == "queen") {
    moveArray = queenMove(color, position);
  }
  if (piece == "king") {
    moveArray = kingMove(color, position);
  }
  if (piece == "kingS") {
    moveArray = kingMove(color, position);
  }
  return moveArray;
}

//devuelve el id de la posición indicada
function findTheId(row, col) {
  let letter = row + 65;
  letter = String.fromCharCode(letter);
  let id = col + 1;
  id = letter + id + "";

  return id;
}

//devuelve la pieza interior de un id
function getThePiece(letter, n) {
  let translator = letter.charCodeAt(0);
  translator = translator - 65;
  let numberCode = parseInt(n);

  if (matrix[translator][numberCode] != 0) {
    return matrix[translator][numberCode];
  } else {
    return "empty";
  }
}

function defined(n, k) {
  if (n < 0 || n > 7) {
    return false;
  } else {
    if (k < 0 || k > 7) {
      return false;
    } else {
      return true;
    }
  }
}

function knightMove(color, position) {
  moves = [];
  let posholder = position;
  if (pinnedPiece(color, posholder) == false) {
    //Si la pieza puede moverse...
    //...genero un array con todas las movidas posibles del caballo
    // HAY QUE METER UN IF ANTES DE CADA UNO ASEGURANDOSE QUE NO DEVUELVA UNDEFINED
    if (defined(position.row + 2, position.col + 1)) {
      if (matrix[position.row + 2][position.col + 1] != 0) {
        if (matrix[position.row + 2][position.col + 1].substr(0, 1) != color) {
          moves.push({
            row: position.row + 2,
            col: position.col + 1,
          });
        }
      } else {
        moves.push({
          row: position.row + 2,
          col: position.col + 1,
        });
      }
    }
    if (defined(position.row + 2, position.col - 1)) {
      if (matrix[position.row + 2][position.col - 1] != 0) {
        if (matrix[position.row + 2][position.col - 1].substr(0, 1) != color) {
          moves.push({
            row: position.row + 2,
            col: position.col - 1,
          });
        }
      } else {
        moves.push({
          row: position.row + 2,
          col: position.col - 1,
        });
      }
    }
    if (defined(position.row - 2, position.col + 1)) {
      if (matrix[position.row - 2][position.col + 1] != 0) {
        if (matrix[position.row - 2][position.col + 1].substr(0, 1) != color) {
          moves.push({
            row: position.row - 2,
            col: position.col + 1,
          });
        }
      } else {
        moves.push({
          row: position.row - 2,
          col: position.col + 1,
        });
      }
    }
    if (defined(position.row - 2, position.col - 1)) {
      if (matrix[position.row - 2][position.col - 1] != 0) {
        if (matrix[position.row - 2][position.col - 1].substr(0, 1) != color) {
          moves.push({
            row: position.row - 2,
            col: position.col - 1,
          });
        }
      } else {
        moves.push({
          row: position.row - 2,
          col: position.col - 1,
        });
      }
    }
    if (defined(position.row + 1, position.col + 2)) {
      if (matrix[position.row + 1][position.col + 2] != 0) {
        if (matrix[position.row + 1][position.col + 2].substr(0, 1) != color) {
          moves.push({
            row: position.row + 1,
            col: position.col + 2,
          });
        }
      } else {
        moves.push({
          row: position.row + 1,
          col: position.col + 2,
        });
      }
    }
    if (defined(position.row + 1, position.col - 2)) {
      if (matrix[position.row + 1][position.col - 2] != 0) {
        if (matrix[position.row + 1][position.col - 2].substr(0, 1) != color) {
          moves.push({
            row: position.row + 1,
            col: position.col - 2,
          });
        }
      } else {
        moves.push({
          row: position.row + 1,
          col: position.col - 2,
        });
      }
    }
    if (defined(position.row - 1, position.col + 2)) {
      if (matrix[position.row - 1][position.col + 2] != 0) {
        if (matrix[position.row - 1][position.col + 2].substr(0, 1) != color) {
          moves.push({
            row: position.row - 1,
            col: position.col + 2,
          });
        }
      } else {
        moves.push({
          row: position.row - 1,
          col: position.col + 2,
        });
      }
    }
    if (defined(position.row - 1, position.col - 2)) {
      if (matrix[position.row - 1][position.col - 2] != 0) {
        if (matrix[position.row - 1][position.col - 2].substr(0, 1) != color) {
          moves.push({
            row: position.row - 1,
            col: position.col - 2,
          });
        }
      } else {
        moves.push({
          row: position.row - 1,
          col: position.col - 2,
        });
      }
    }

    if ((check == true) & (controlling == false)) {
      //Me fijo si el rey está en jaque
      let legalmoves = [];
      for (let i = 0; i < moves.length; i++) {
        //De estar en jaque el rey, simular movimientos posibles para bloquear
        for (let j = 0; j < validmoves.length; j++) {
          if (
            moves[i].row != validmoves[j].row ||
            moves[i].col != validmoves[j].col
          ) {
            // y eliminar los que no evitan jaque
          } else {
            legalmoves.push(moves[i]);
          }
        }
      }
      moves = legalmoves;
    }
    return moves;
  } else {
    moves = pinnedMoving(color, position, "knight");
    return moves;
  }
}

function pieceMaker(color, name) {
  let formPiece = color + name;
  return formPiece;
}

function bishopMove(color, position) {
  moves = [];
  //si el rey no queda en jaque
  if (pinnedPiece(color, position) == false) {
    //genero los posibles movimientos del alfil
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row + i, position.col + i)) {
        if (matrix[position.row + i][position.col + i] == 0) {
          moves.push({
            row: position.row + i,
            col: position.col + i,
          });
        } else {
          if (
            color == whatsTheColor(matrix[position.row + i][position.col + i])
          ) {
            break;
          } else {
            moves.push({
              row: position.row + i,
              col: position.col + i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row + i, position.col - i)) {
        if (matrix[position.row + i][position.col - i] == 0) {
          moves.push({
            row: position.row + i,
            col: position.col - i,
          });
        } else {
          if (
            color == whatsTheColor(matrix[position.row + i][position.col - i])
          ) {
            break;
          } else {
            moves.push({
              row: position.row + i,
              col: position.col - i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row - i, position.col - i)) {
        if (matrix[position.row - i][position.col - i] == 0) {
          moves.push({
            row: position.row - i,
            col: position.col - i,
          });
        } else {
          if (
            color == whatsTheColor(matrix[position.row - i][position.col - i])
          ) {
            break;
          } else {
            moves.push({
              row: position.row - i,
              col: position.col - i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row - i, position.col + i)) {
        if (matrix[position.row - i][position.col + i] == 0) {
          moves.push({
            row: position.row - i,
            col: position.col + i,
          });
        } else {
          if (
            color == whatsTheColor(matrix[position.row - i][position.col + i])
          ) {
            break;
          } else {
            moves.push({
              row: position.row - i,
              col: position.col + i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    if ((check == true) & (controlling == false)) {
      //Me fijo si el rey está en jaque
      let legalmoves = [];
      for (let i = 0; i < moves.length; i++) {
        //De estar en jaque el rey, simular movimientos posibles para bloquear
        for (let j = 0; j < validmoves.length; j++) {
          if (
            moves[i].row != validmoves[j].row ||
            moves[i].col != validmoves[j].col
          ) {
            // y eliminar los que no evitan jaque
          } else {
            legalmoves.push(moves[i]);
          }
        }
      }
      moves = legalmoves;
    }
    return moves;
  } else {
    moves = pinnedMoving(color, position, "bishop");
    return moves;
  }
}

function rookMove(color, position) {
  moves = [];
  //si el rey no queda en jaque
  if (pinnedPiece(color, position) == false) {
    //genero los posibles movimientos de la torre
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row, position.col + i)) {
        if (matrix[position.row][position.col + i] == 0) {
          moves.push({
            row: position.row,
            col: position.col + i,
          });
        } else {
          if (color == whatsTheColor(matrix[position.row][position.col + i])) {
            break;
          } else {
            moves.push({
              row: position.row,
              col: position.col + i,
            });

            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row, position.col - i)) {
        if (matrix[position.row][position.col - i] == 0) {
          moves.push({
            row: position.row,
            col: position.col - i,
          });
        } else {
          if (color == whatsTheColor(matrix[position.row][position.col - i])) {
            break;
          } else {
            moves.push({
              row: position.row,
              col: position.col - i,
            });

            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row - i, position.col)) {
        if (matrix[position.row - i][position.col] == 0) {
          moves.push({
            row: position.row - i,
            col: position.col,
          });
        } else {
          if (color == whatsTheColor(matrix[position.row - i][position.col])) {
            break;
          } else {
            moves.push({
              row: position.row - i,
              col: position.col,
            });

            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row + i, position.col)) {
        if (matrix[position.row + i][position.col] == 0) {
          moves.push({
            row: position.row + i,
            col: position.col,
          });
        } else {
          if (color == whatsTheColor(matrix[position.row + i][position.col])) {
            break;
          } else {
            moves.push({
              row: position.row + i,
              col: position.col,
            });

            break;
          }
        }
      } else {
        break;
      }
    }

    if ((check == true) & (controlling == false)) {
      //Me fijo si el rey está en jaque
      let legalmoves = [];
      for (let i = 0; i < moves.length; i++) {
        //De estar en jaque el rey, simular movimientos posibles para bloquear
        for (let j = 0; j < validmoves.length; j++) {
          if (
            moves[i].row != validmoves[j].row ||
            moves[i].col != validmoves[j].col
          ) {
            // y eliminar los que no evitan jaque
          } else {
            legalmoves.push(moves[i]);
          }
        }
      }
      moves = legalmoves;
    }
    return moves;
  } else {
    let currentpiece;
    if (
      matrix[position.row][position.col].substr(
        2,
        matrix[position.row][position.col].length
      ) == "rook"
    ) {
      currentpiece = "rook";
    } else {
      currentpiece = "rookS";
    }
    moves = pinnedMoving(color, position, currentpiece);
    return moves;
  }
}

function queenMove(color, position) {
  moves = [];
  //si el rey no queda en jaque
  if (pinnedPiece(color, position) == false) {
    //genero los posibles movimientos de la reina
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row, position.col + i)) {
        if (matrix[position.row][position.col + i] == 0) {
          moves.push({
            row: position.row,
            col: position.col + i,
          });
        } else {
          if (color == whatsTheColor(matrix[position.row][position.col + i])) {
            break;
          } else {
            moves.push({
              row: position.row,
              col: position.col + i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row, position.col - i)) {
        if (matrix[position.row][position.col - i] == 0) {
          moves.push({
            row: position.row,
            col: position.col - i,
          });
        } else {
          if (color == whatsTheColor(matrix[position.row][position.col - i])) {
            break;
          } else {
            moves.push({
              row: position.row,
              col: position.col - i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row - i, position.col)) {
        if (matrix[position.row - i][position.col] == 0) {
          moves.push({
            row: position.row - i,
            col: position.col,
          });
        } else {
          if (color == whatsTheColor(matrix[position.row - i][position.col])) {
            break;
          } else {
            moves.push({
              row: position.row - i,
              col: position.col,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row + i, position.col)) {
        if (matrix[position.row + i][position.col] == 0) {
          moves.push({
            row: position.row + i,
            col: position.col,
          });
        } else {
          if (color == whatsTheColor(matrix[position.row + i][position.col])) {
            break;
          } else {
            moves.push({
              row: position.row + i,
              col: position.col,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row + i, position.col + i)) {
        if (matrix[position.row + i][position.col + i] == 0) {
          moves.push({
            row: position.row + i,
            col: position.col + i,
          });
        } else {
          if (
            color == whatsTheColor(matrix[position.row + i][position.col + i])
          ) {
            break;
          } else {
            moves.push({
              row: position.row + i,
              col: position.col + i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row + i, position.col - i)) {
        if (matrix[position.row + i][position.col - i] == 0) {
          moves.push({
            row: position.row + i,
            col: position.col - i,
          });
        } else {
          if (
            color == whatsTheColor(matrix[position.row + i][position.col - i])
          ) {
            break;
          } else {
            moves.push({
              row: position.row + i,
              col: position.col - i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row - i, position.col - i)) {
        if (matrix[position.row - i][position.col - i] == 0) {
          moves.push({
            row: position.row - i,
            col: position.col - i,
          });
        } else {
          if (
            color == whatsTheColor(matrix[position.row - i][position.col - i])
          ) {
            break;
          } else {
            moves.push({
              row: position.row - i,
              col: position.col - i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (defined(position.row - i, position.col + i)) {
        if (matrix[position.row - i][position.col + i] == 0) {
          moves.push({
            row: position.row - i,
            col: position.col + i,
          });
        } else {
          if (
            color == whatsTheColor(matrix[position.row - i][position.col + i])
          ) {
            break;
          } else {
            moves.push({
              row: position.row - i,
              col: position.col + i,
            });
            break;
          }
        }
      } else {
        break;
      }
    }

    if ((check == true) & (controlling == false)) {
      //Me fijo si el rey está en jaque
      let legalmoves = [];
      for (let i = 0; i < moves.length; i++) {
        //De estar en jaque el rey, simular movimientos posibles para bloquear
        for (let j = 0; j < validmoves.length; j++) {
          if (
            moves[i].row != validmoves[j].row ||
            moves[i].col != validmoves[j].col
          ) {
            // y eliminar los que no evitan jaque
          } else {
            legalmoves.push(moves[i]);
          }
        }
      }
      moves = legalmoves;
    }
    return moves;
  } else {
    moves = pinnedMoving(color, position, "queen");
    return moves;
  }
}

function kingMove(color, position) {
  moves = [];
  //genero los movimientos del rey
  if (defined(position.row + 1, position.col + 1)) {
    if (matrix[position.row + 1][position.col + 1] != 0) {
      if (color != whatsTheColor(matrix[position.row + 1][position.col + 1])) {
        moves.push({
          row: position.row + 1,
          col: position.col + 1,
        });
      }
    } else {
      moves.push({
        row: position.row + 1,
        col: position.col + 1,
      });
    }
  }
  if (defined(position.row, position.col + 1)) {
    if (matrix[position.row][position.col + 1] != 0) {
      if (color != whatsTheColor(matrix[position.row][position.col + 1])) {
        moves.push({
          row: position.row,
          col: position.col + 1,
        });
      }
    } else {
      moves.push({
        row: position.row,
        col: position.col + 1,
      });
    }
  }
  if (defined(position.row + 1, position.col)) {
    if (matrix[position.row + 1][position.col] != 0) {
      if (color != whatsTheColor(matrix[position.row + 1][position.col])) {
        moves.push({
          row: position.row + 1,
          col: position.col,
        });
      }
    } else {
      moves.push({
        row: position.row + 1,
        col: position.col,
      });
    }
  }
  if (defined(position.row - 1, position.col - 1)) {
    if (matrix[position.row - 1][position.col - 1] != 0) {
      if (color != whatsTheColor(matrix[position.row - 1][position.col - 1])) {
        moves.push({
          row: position.row - 1,
          col: position.col - 1,
        });
      }
    } else {
      moves.push({
        row: position.row - 1,
        col: position.col - 1,
      });
    }
  }
  if (defined(position.row - 1, position.col + 1)) {
    if (matrix[position.row - 1][position.col + 1] != 0) {
      if (color != whatsTheColor(matrix[position.row - 1][position.col + 1])) {
        moves.push({
          row: position.row - 1,
          col: position.col + 1,
        });
      }
    } else {
      moves.push({
        row: position.row - 1,
        col: position.col + 1,
      });
    }
  }
  if (defined(position.row + 1, position.col - 1)) {
    if (matrix[position.row + 1][position.col - 1] != 0) {
      if (color != whatsTheColor(matrix[position.row + 1][position.col - 1])) {
        moves.push({
          row: position.row + 1,
          col: position.col - 1,
        });
      }
    } else {
      moves.push({
        row: position.row + 1,
        col: position.col - 1,
      });
    }
  }
  if (defined(position.row - 1, position.col)) {
    if (matrix[position.row - 1][position.col] != 0) {
      if (color != whatsTheColor(matrix[position.row - 1][position.col])) {
        moves.push({
          row: position.row - 1,
          col: position.col,
        });
      }
    } else {
      moves.push({
        row: position.row - 1,
        col: position.col,
      });
    }
  }
  if (defined(position.row, position.col - 1)) {
    if (matrix[position.row][position.col - 1] != 0) {
      if (color != whatsTheColor(matrix[position.row][position.col - 1])) {
        moves.push({
          row: position.row,
          col: position.col - 1,
        });
      }
    } else {
      moves.push({
        row: position.row,
        col: position.col - 1,
      });
    }
  }

  //ENROQUE
  if (check == false) {
    if (matrix[position.row][position.col] == color + "_kingS") {
      for (let i = 1; i <= 3; i++) {
        if (
          (matrix[position.row][position.col - i] == 0) &
          (matrix[position.row][0] == color + "_rookS")
        ) {
          if (i == 3) {
            moves.push({
              row: position.row,
              col: position.col - 2,
            });
          }
        } else {
          break;
        }
      }
      for (let i = 1; i <= 2; i++) {
        if (
          (matrix[position.row][position.col + i] == 0) &
          (matrix[position.row][7] == color + "_rookS")
        ) {
          if (i == 2) {
            moves.push({
              row: position.row,
              col: position.col + 2,
            });
          }
        } else {
          break;
        }
      }
    }
  }
  if (controlling == false) {
    moves = illegalKing(color, position);
    let cantShort = false;
    let cantLong = false;
    for (let i = 0; i < moves.length; i++) {
      for (let j = 0; j < moves.length; j++) {
        if (moves[i].col - position.col == 2) {
          if (cantShort == false) {
            if (
              (moves[i].row == moves[j].row) &
              (moves[j].col == position.col + 1)
            ) {
              break;
            }
            if (j == moves.length - 1) {
              moves.splice(i, 1);
              i--;
              cantShort = true;
            }
          }
        }
        if (position.col - moves[i].col == 2) {
          if (cantLong == false) {
            if (
              (moves[i].row == moves[j].row) &
              (moves[j].col == position.col - 1)
            ) {
              break;
            }
            if (j == moves.length - 1) {
              moves.splice(i, 1);
              i--;
              cantLong = true;
            }
          }
        }
      }
    }
  }
  return moves;
}

function illegalKing(color, position) {
  let simMoves = [];
  let pinMoves = [];
  let squareholder;
  let WC = whiteControl;
  let BC = blackControl;
  let WK = whiteKingPosition;
  let BK = blackKingPosition;
  let checkState = check;
  let currentKingState = matrix[position.row][position.col];
  controlling = true;
  simMoves = kingMove(color, position);
  if (simMoves != undefined) {
    for (let i = 0; i < simMoves.length; i++) {
      matrix[position.row][position.col] = 0;
      squareholder = matrix[simMoves[i].row][simMoves[i].col];
      matrix[simMoves[i].row][simMoves[i].col] = currentKingState;
      if (color == "W") {
        whiteKingPosition = {
          row: simMoves[i].row,
          col: simMoves[i].col,
        };
        updateBlackControl();
        updateCheck("B");
      } else {
        blackKingPosition = {
          row: simMoves[i].row,
          col: simMoves[i].col,
        };
        updateWhiteControl();
        updateCheck("W");
      }
      if (check == false) {
        pinMoves.push({
          row: simMoves[i].row,
          col: simMoves[i].col,
        });
      }
      matrix[position.row][position.col] = currentKingState;
      matrix[simMoves[i].row][simMoves[i].col] = squareholder;
      blackControl = BC;
      whiteControl = WC;
      check = checkState;
      blackKingPosition = BK;
      whiteKingPosition = WK;
    }
  }
  return pinMoves;
}

function pawnMove(color, position) {
  moves = [];
  if (pinnedPiece(color, position) == false) {
    if (matrix[position.row][position.col] == "B_pawnS") {
      if (matrix[position.row + 1][position.col] == 0) {
        moves.push({
          row: position.row + 1,
          col: position.col,
        });
      }
      if (
        (matrix[position.row + 2][position.col] == 0) &
        (matrix[position.row + 1][position.col] == 0)
      ) {
        moves.push({
          row: position.row + 2,
          col: position.col,
        });
      }
      if (matrix[position.row + 1][position.col + 1] != 0) {
        if (defined(position.row + 1, position.col + 1)) {
          if (matrix[position.row + 1][position.col + 1].substr(0, 1) != "B") {
            moves.push({
              row: position.row + 1,
              col: position.col + 1,
            });
          }
        }
      }
      if (matrix[position.row + 1][position.col - 1] != 0) {
        if (defined(position.row + 1, position.col - 1)) {
          if (matrix[position.row + 1][position.col - 1].substr(0, 1) != "B") {
            moves.push({
              row: position.row + 1,
              col: position.col - 1,
            });
          }
        }
      }
    }
    if (matrix[position.row][position.col] == "B_pawn") {
      if (matrix[position.row + 1][position.col] == 0) {
        moves.push({
          row: position.row + 1,
          col: position.col,
        });
      }
      if (matrix[position.row + 1][position.col + 1] != 0) {
        if (defined(position.row + 1, position.col + 1)) {
          if (matrix[position.row + 1][position.col + 1].substr(0, 1) != "B") {
            moves.push({
              row: position.row + 1,
              col: position.col + 1,
            });
          }
        }
      }
      if (matrix[position.row + 1][position.col - 1] != 0) {
        if (defined(position.row + 1, position.col - 1)) {
          if (matrix[position.row + 1][position.col - 1].substr(0, 1) != "B") {
            moves.push({
              row: position.row + 1,
              col: position.col - 1,
            });
          }
        }
      }
      //PEON AL PASO
      if (matrix[position.row][position.col + 1] != 0) {
        if (defined(position.row, position.col + 1)) {
          if (defined(position.row + 2, position.col + 1)) {
            if (matrix[position.row + 2][position.col + 1] == 0) {
              if (matrix[position.row][position.col + 1] == "W_pawn") {
                if (lastPiece == "W_pawnS") {
                  if (
                    (lastmove[0].row - lastmove[1].row == 2) &
                    (lastmove[0].col == lastmove[1].col)
                  ) {
                    moves.push({
                      row: position.row + 1,
                      col: position.col + 1,
                    });
                  }
                }
              }
            }
          }
        }
      }
      if (matrix[position.row][position.col - 1] != 0) {
        if (defined(position.row, position.col - 1)) {
          if (defined(position.row + 2, position.col - 1)) {
            if (matrix[position.row + 2][position.col - 1] == 0) {
              if (matrix[position.row][position.col - 1] == "W_pawn") {
                if (lastPiece == "W_pawnS") {
                  if (
                    (lastmove[0].row - lastmove[1].row == 2) &
                    (lastmove[0].col == lastmove[1].col)
                  ) {
                    moves.push({
                      row: position.row + 1,
                      col: position.col - 1,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
    if (matrix[position.row][position.col] == "W_pawnS") {
      if (matrix[position.row - 1][position.col] == 0) {
        moves.push({
          row: position.row - 1,
          col: position.col,
        });
      }
      if (
        (matrix[position.row - 2][position.col] == 0) &
        (matrix[position.row - 1][position.col] == 0)
      ) {
        moves.push({
          row: position.row - 2,
          col: position.col,
        });
      }
      if (matrix[position.row - 1][position.col - 1] != 0) {
        if (defined(position.row - 1, position.col - 1)) {
          if (matrix[position.row - 1][position.col - 1].substr(0, 1) != "W") {
            moves.push({
              row: position.row - 1,
              col: position.col - 1,
            });
          }
        }
      }
      if (matrix[position.row - 1][position.col + 1] != 0) {
        if (defined(position.row - 1, position.col + 1)) {
          if (matrix[position.row - 1][position.col + 1].substr(0, 1) != "W") {
            moves.push({
              row: position.row - 1,
              col: position.col + 1,
            });
          }
        }
      }
    }
    if (matrix[position.row][position.col] == "W_pawn") {
      if (matrix[position.row - 1][position.col] == 0) {
        moves.push({
          row: position.row - 1,
          col: position.col,
        });
      }
      if (matrix[position.row - 1][position.col + 1] != 0) {
        if (defined(position.row - 1, position.col + 1)) {
          if (matrix[position.row - 1][position.col + 1].substr(0, 1) != "W") {
            moves.push({
              row: position.row - 1,
              col: position.col + 1,
            });
          }
        }
      }
      if (matrix[position.row - 1][position.col - 1] != 0) {
        if (defined(position.row - 1, position.col - 1)) {
          if (matrix[position.row - 1][position.col - 1].substr(0, 1) != "W") {
            moves.push({
              row: position.row - 1,
              col: position.col - 1,
            });
          }
        }
      }
      //PEON AL PASO
      if (matrix[position.row][position.col + 1] != 0) {
        if (defined(position.row, position.col + 1)) {
          if (defined(position.row - 2, position.col + 1)) {
            if (matrix[position.row - 2][position.col + 1] == 0) {
              if (matrix[position.row][position.col + 1] == "B_pawn") {
                if (lastPiece == "B_pawnS") {
                  if (
                    (lastmove[1].row - lastmove[0].row == 2) &
                    (lastmove[0].col == lastmove[1].col)
                  ) {
                    moves.push({
                      row: position.row - 1,
                      col: position.col + 1,
                    });
                  }
                }
              }
            }
          }
        }
      }
      if (matrix[position.row][position.col - 1] != 0) {
        if (defined(position.row, position.col - 1)) {
          if (defined(position.row - 2, position.col - 1)) {
            if (matrix[position.row - 2][position.col - 1] == 0) {
              if (matrix[position.row][position.col - 1] == "B_pawn") {
                if (lastPiece == "B_pawnS") {
                  if (
                    (lastmove[1].row - lastmove[0].row == 2) &
                    (lastmove[0].col == lastmove[1].col)
                  ) {
                    moves.push({
                      row: position.row - 1,
                      col: position.col - 1,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
    if ((check == true) & (controlling == false)) {
      //Me fijo si el rey está en jaque
      let legalmoves = [];
      for (let i = 0; i < moves.length; i++) {
        //De estar en jaque el rey, simular movimientos posibles para bloquear
        for (let j = 0; j < validmoves.length; j++) {
          if (
            moves[i].row != validmoves[j].row ||
            moves[i].col != validmoves[j].col
          ) {
            // y eliminar los que no evitan jaque
          } else {
            legalmoves.push(moves[i]);
          }
        }
      }
      moves = legalmoves;
    }
    return moves;
  } else {
    moves = pinnedMoving(color, position, "pawn");
    return moves;
  }
}

function pinnedPiece(color, position) {
  let result = false;
  if (controlling == false) {
    let piecestate = matrix[position.row][position.col];
    let checkstate = check;
    let WC = whiteControl;
    let BC = blackControl;
    matrix[position.row][position.col] = 0;
    if (color == "W") {
      updateBlackControl();
      updateCheck("B");
    } else {
      updateWhiteControl();
      updateCheck("W");
    }
    if (check) {
      result = true;
    }
    matrix[position.row][position.col] = piecestate;
    check = checkstate;
    whiteControl = WC;
    blackControl = BC;
  }
  return result;
}

function pinnedMoving(color, position, piece) {
  let simMoves;
  let WC = whiteControl;
  let BC = blackControl;
  let checkState = check;
  let pinMoves = [];
  let squareholder;
  if (piece == "pawn" || piece == "pawnS") {
    controlling = true;
    simMoves = pawnMove(color, position);
    if (simMoves != undefined) {
      for (let i = 0; i < simMoves.length; i++) {
        matrix[position.row][position.col] = 0;
        squareholder = matrix[simMoves[i].row][simMoves[i].col];
        matrix[simMoves[i].row][simMoves[i].col] = color + "_pawn";
        if (color == "W") {
          updateBlackControl();
          updateCheck("B");
        } else {
          updateWhiteControl();
          updateCheck("W");
        }
        if (check == false) {
          pinMoves.push({
            row: simMoves[i].row,
            col: simMoves[i].col,
          });
        }
        matrix[position.row][position.col] = color + "_pawn";
        matrix[simMoves[i].row][simMoves[i].col] = squareholder;
        blackControl = BC;
        whiteControl = WC;
        check = checkState;
      }
    }
  }
  if (piece == "queen") {
    controlling = true;
    simMoves = queenMove(color, position);
    if (simMoves != undefined) {
      for (let i = 0; i < simMoves.length; i++) {
        matrix[position.row][position.col] = 0;
        squareholder = matrix[simMoves[i].row][simMoves[i].col];
        matrix[simMoves[i].row][simMoves[i].col] = color + "_queen";
        if (color == "W") {
          updateBlackControl();
          updateCheck("B");
        } else {
          updateWhiteControl();
          updateCheck("W");
        }
        if (check == false) {
          pinMoves.push({
            row: simMoves[i].row,
            col: simMoves[i].col,
          });
        }
        matrix[position.row][position.col] = color + "_queen";
        matrix[simMoves[i].row][simMoves[i].col] = squareholder;
        blackControl = BC;
        whiteControl = WC;
        check = checkState;
      }
    }
  }
  if (piece == "rook" || piece == "rookS") {
    controlling = true;
    simMoves = rookMove(color, position);
    if (simMoves != undefined) {
      for (let i = 0; i < simMoves.length; i++) {
        matrix[position.row][position.col] = 0;
        squareholder = matrix[simMoves[i].row][simMoves[i].col];
        matrix[simMoves[i].row][simMoves[i].col] = color + "_rook";
        if (color == "W") {
          updateBlackControl();
          updateCheck("B");
        } else {
          updateWhiteControl();
          updateCheck("W");
        }
        if (check == false) {
          pinMoves.push({
            row: simMoves[i].row,
            col: simMoves[i].col,
          });
        }
        matrix[position.row][position.col] = color + "_rook";
        matrix[simMoves[i].row][simMoves[i].col] = squareholder;
        blackControl = BC;
        whiteControl = WC;
        check = checkState;
      }
    }
  }
  if (piece == "bishop") {
    controlling = true;
    simMoves = bishopMove(color, position);
    if (simMoves != undefined) {
      for (let i = 0; i < simMoves.length; i++) {
        matrix[position.row][position.col] = 0;
        squareholder = matrix[simMoves[i].row][simMoves[i].col];
        matrix[simMoves[i].row][simMoves[i].col] = color + "_bishop";
        if (color == "W") {
          updateBlackControl();
          updateCheck("B");
        } else {
          updateWhiteControl();
          updateCheck("W");
        }
        if (check == false) {
          pinMoves.push({
            row: simMoves[i].row,
            col: simMoves[i].col,
          });
        }
        matrix[position.row][position.col] = color + "_bishop";
        matrix[simMoves[i].row][simMoves[i].col] = squareholder;
        blackControl = BC;
        whiteControl = WC;
        check = checkState;
      }
    }
  }
  if (piece == "knight") {
    controlling = true;
    simMoves = knightMove(color, position);
    if (simMoves != undefined) {
      for (let i = 0; i < simMoves.length; i++) {
        matrix[position.row][position.col] = 0;
        squareholder = matrix[simMoves[i].row][simMoves[i].col];
        matrix[simMoves[i].row][simMoves[i].col] = color + "_knight";
        if (color == "W") {
          updateBlackControl();
          updateCheck("B");
        } else {
          updateWhiteControl();
          updateCheck("W");
        }
        if (check == false) {
          pinMoves.push({
            row: simMoves[i].row,
            col: simMoves[i].col,
          });
        }
        matrix[position.row][position.col] = color + "_knight";
        matrix[simMoves[i].row][simMoves[i].col] = squareholder;
        blackControl = BC;
        whiteControl = WC;
        check = checkState;
      }
    }
  }
  return pinMoves;
}

function whatsTheColor(position) {
  let colorholder = position.substr(0, 1);
  return colorholder;
}

function clearDuplicates(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (i != j) {
        if ((array[i].row == array[j].row) & (array[i].col == array[j].col)) {
          array.splice(j, 1);
          j--;
        }
      }
    }
  }
}

function updateWhiteControl() {
  whiteControl = [];
  let arrayholder = [];
  controlling = true;
  for (let i = 0; i <= 7; i++) {
    for (let j = 0; j <= 7; j++) {
      if (matrix[i][j] != 0) {
        if (matrix[i][j].substr(0, 1) == "W") {
          arrayholder.push(
            pieceMoveGenerator(matrix[i][j], "W", { row: i, col: j })
          );
        }
      }
    }
  }
  for (let h = 0; h < arrayholder.length; h++) {
    for (let x = 0; x < arrayholder[h].length; x++) {
      whiteControl.push(arrayholder[h][x]);
    }
  }
  clearDuplicates(whiteControl);
  moves = [];
  controlling = false;
}

function updateBlackControl() {
  blackControl = [];
  let arrayholder = [];
  controlling = true;
  for (let i = 0; i <= 7; i++) {
    for (let j = 0; j <= 7; j++) {
      if (matrix[i][j] != 0) {
        if (matrix[i][j].substr(0, 1) == "B") {
          arrayholder.push(
            pieceMoveGenerator(matrix[i][j], "B", { row: i, col: j })
          );
        }
      }
    }
  }
  for (let h = 0; h < arrayholder.length; h++) {
    for (let x = 0; x < arrayholder[h].length; x++) {
      blackControl.push(arrayholder[h][x]);
    }
  }
  clearDuplicates(blackControl);
  moves = [];
  controlling = false;
}

function pieceMoveGenerator(interior, color, position) {
  if (interior.substr(0, 1) == color) {
    let piece = interior.substr(2, interior.length - 2);
    var arrayholder = [];
    if (piece == "pawnS") {
      arrayholder = pawnControl(color, position);
    }
    if (piece == "pawn") {
      arrayholder = pawnControl(color, position);
    }
    if (piece == "knight") {
      arrayholder = knightMove(color, position);
    }
    if (piece == "bishop") {
      arrayholder = bishopMove(color, position);
    }
    if (piece == "rook") {
      arrayholder = rookMove(color, position);
    }
    if (piece == "rookS") {
      arrayholder = rookMove(color, position);
    }
    if (piece == "queen") {
      arrayholder = queenMove(color, position);
    }
    if (piece == "king") {
      arrayholder = kingMove(color, position);
    }
    if (piece == "kingS") {
      arrayholder = kingMove(color, position);
    }
  }
  return arrayholder;
}

function pawnControl(color, position) {
  let moves = [];
  if (color == "W") {
    if (defined(position.row - 1, position.col - 1)) {
      moves.push({
        row: position.row - 1,
        col: position.col - 1,
      });
    }
    if (defined(position.row - 1, position.col + 1)) {
      moves.push({
        row: position.row - 1,
        col: position.col + 1,
      });
    }
  }
  if (color == "B") {
    if (defined(position.row + 1, position.col - 1)) {
      moves.push({
        row: position.row + 1,
        col: position.col - 1,
      });
    }
    if (defined(position.row + 1, position.col + 1)) {
      moves.push({
        row: position.row + 1,
        col: position.col + 1,
      });
    }
  }
  return moves;
}

function findThePiece(textid) {
  let fixit = textid.substr(1, 1);
  let storeB = parseInt(fixit);
  storeB = storeB - 1;
  let storeA = textid.substr(0, 1);
  storeA = storeA.charCodeAt(0);
  storeA = storeA - 65;

  let data = matrix[storeA][storeB];
  return data;
}

function findPosition(id) {
  let storeB = parseInt(id.substr(1, 1));
  storeB = storeB - 1;
  let storeA = id.substr(0, 1);
  storeA = storeA.charCodeAt(0);
  storeA = storeA - 65;

  let data = [storeA, storeB];
  return data;
}

function cleanBoard() {
  if (savemoves.length != 0) {
    for (i = 0; i < savemoves.length; i++) {
      if (matrix[savemoves[i].row][savemoves[i].col] != 0) {
        document
          .getElementById(findTheId(savemoves[i].row, savemoves[i].col))
          .setAttribute("class", "");
        document
          .getElementById(findTheId(savemoves[i].row, savemoves[i].col))
          .setAttribute("onclick", "move(id)");
      } else {
        document
          .getElementById(findTheId(savemoves[i].row, savemoves[i].col))
          .setAttribute("src", "assets/img/empty.png");
        document
          .getElementById(findTheId(savemoves[i].row, savemoves[i].col))
          .setAttribute("onclick", "move(id)");
      }
    }
    savemoves = [];
  }
}

function translator(id) {
  let turnToNumber = id.substr(0, 1);
  turnToNumber = turnToNumber.charCodeAt(0);
  turnToNumber = turnToNumber - 65;
  let parseit = parseInt(id.substr(1, 1));
  parseit = parseit - 1;

  let returner = [turnToNumber, parseit];
  return returner;
}

function afterMove(id) {
  //limpio movimientos legales mostrados
  cleanBoard();
  if (lastIds.length != 0) {
    document.getElementById(lastIds[0]).style.backgroundColor = "";
    document.getElementById(lastIds[1]).style.backgroundColor = "";
  }
  lastIds = [];
  lastIds.push(globalhelp);
  lastIds.push(id);
  let castles_long = false;
  let castles_short = false;
  //me fijo el color y la posicion de la pieza seleccionada
  let color = findThePiece(globalhelp).substr(0, 1);
  let posarray = findPosition(globalhelp);
  //me fijo que casillero fue marcado y lo traduzco
  let currentarray = findPosition(id);
  let piece = findThePiece(globalhelp);
  lastToMove = color;
  lastmove = [
    {
      row: posarray[0],
      col: posarray[1],
    },
    {
      row: currentarray[0],
      col: currentarray[1],
    },
  ];
  lastPiece = matrix[posarray[0]][posarray[1]];
  if (matrix[currentarray[0]][currentarray[1]] != 0) {
    takes = true;
  } else {
    takes = false;
  }
  //si era un peon que nunca fue movido lo reemplazo por uno que el sistema identifica como que ya se movio
  if (piece == color + "_pawnS") {
    let replacer = translator(globalhelp);
    matrix[replacer[0]][replacer[1]] = color + "_pawn";
    piece = color + "_pawn";
  }
  //si era una torre que nunca fue movida la reemplazo por una que el sistema identifica como que ya se movio
  if (piece == color + "_rookS") {
    let replacer = translator(globalhelp);
    matrix[replacer[0]][replacer[1]] = color + "_rook";
    piece = color + "_rook";
  }
  //si era un rey que nunca fue movido lo reemplazo por uno que el sistema identifica como que ya se movio
  if (piece == color + "_kingS") {
    let replacer = translator(globalhelp);
    matrix[replacer[0]][replacer[1]] = color + "_king";
    piece = color + "_king";
    if (posarray[1] - currentarray[1] == 2) {
      castles_long = true;
    }
    if (posarray[1] - currentarray[1] == -2) {
      castles_short = true;
    }
  }
  if (
    piece.substr(1, piece.length - 1) == "_king" ||
    piece.substr(1, piece.length - 1) == "_kingS"
  ) {
    if (color == "W") {
      whiteKingPosition = {
        row: currentarray[0],
        col: currentarray[1],
      };
    } else {
      blackKingPosition = {
        row: currentarray[0],
        col: currentarray[1],
      };
    }
  }
  if (matrix[posarray[0]][posarray[1]] == color + "_pawn") {
    if (posarray[1] - currentarray[1] != 0) {
      if (matrix[currentarray[0]][currentarray[1]] == 0) {
        matrix[posarray[0]][currentarray[1]] = 0;
        document
          .getElementById(findTheId(posarray[0], currentarray[1]))
          .setAttribute("src", "assets/img/empty.png");
        document
          .getElementById(findTheId(posarray[0], currentarray[1]))
          .setAttribute("onclick", "");
      }
    }
    if (color == "W") {
      if (currentarray[0] == 0) {
        queeninghelp = {
          row: currentarray[0],
          col: currentarray[1],
        };
        queeningSquare(color);
        matrix[posarray[0]][posarray[1]] = 0;
        return;
      } else {
        document
          .getElementById(globalhelp)
          .setAttribute("src", "assets/img/empty.png");
        document.getElementById(globalhelp).setAttribute("onclick", "");
        document
          .getElementById(id)
          .setAttribute(
            "src",
            "assets/img/" + findThePiece(globalhelp) + ".png"
          );
        document.getElementById(id).setAttribute("onclick", "move(id)");
        matrix[posarray[0]][posarray[1]] = 0;
        matrix[currentarray[0]][currentarray[1]] = piece;
      }
    } else {
      if (currentarray[0] == 7) {
        queeninghelp = {
          row: currentarray[0],
          col: currentarray[1],
        };
        queeningSquare(color);
        matrix[posarray[0]][posarray[1]] = 0;
        return;
      } else {
        document
          .getElementById(globalhelp)
          .setAttribute("src", "assets/img/empty.png");
        document.getElementById(globalhelp).setAttribute("onclick", "");
        document
          .getElementById(id)
          .setAttribute(
            "src",
            "assets/img/" + findThePiece(globalhelp) + ".png"
          );
        document.getElementById(id).setAttribute("onclick", "move(id)");
        matrix[posarray[0]][posarray[1]] = 0;
        matrix[currentarray[0]][currentarray[1]] = piece;
      }
    }
  } else {
    document
      .getElementById(globalhelp)
      .setAttribute("src", "assets/img/empty.png");
    document.getElementById(globalhelp).setAttribute("onclick", "");
    document
      .getElementById(id)
      .setAttribute("src", "assets/img/" + findThePiece(globalhelp) + ".png");
    document.getElementById(id).setAttribute("onclick", "move(id)");
    matrix[posarray[0]][posarray[1]] = 0;
    matrix[currentarray[0]][currentarray[1]] = piece;
    if (castles_short) {
      matrix[posarray[0]][7] = 0;
      matrix[currentarray[0]][currentarray[1] - 1] = color + "_rook";
      document
        .getElementById(findTheId(currentarray[0], 7))
        .setAttribute("onclick", "");
      document
        .getElementById(findTheId(currentarray[0], 7))
        .setAttribute("src", "assets/img/empty.png");
      document
        .getElementById(findTheId(currentarray[0], 5))
        .setAttribute("onclick", "move(id)");
      document
        .getElementById(findTheId(currentarray[0], 5))
        .setAttribute("src", "assets/img/" + color + "_rook.png");
    }
    if (castles_long) {
      matrix[posarray[0]][0] = 0;
      matrix[currentarray[0]][currentarray[1] + 1] = color + "_rook";
      document
        .getElementById(findTheId(currentarray[0], 0))
        .setAttribute("onclick", "");
      document
        .getElementById(findTheId(currentarray[0], 0))
        .setAttribute("src", "assets/img/empty.png");
      document
        .getElementById(findTheId(currentarray[0], 3))
        .setAttribute("onclick", "move(id)");
      document
        .getElementById(findTheId(currentarray[0], 3))
        .setAttribute("src", "assets/img/" + color + "_rook.png");
    }
  }
  document.getElementById(lastIds[0]).style.backgroundColor =
    "rgba(255, 255, 224,0.6)";
  document.getElementById(lastIds[1]).style.backgroundColor =
    "rgba(255, 255, 224,0.6)";
  controlling = false;
  updateBlackControl();
  updateWhiteControl();
  updateCheck(color);
  checkForMate(color);
  playerSwitch();
  //printMove(!player);
  //gameMoves.push(notation());
  runClock(player);
  saveGame(matrix, player, lastIds, lastToMove, gameStillOn, timers, time);
}

function updateCheck(color) {
  check = false;
  if (color == "W") {
    for (let i = 0; i < whiteControl.length; i++) {
      if (
        (whiteControl[i].row == blackKingPosition.row) &
        (whiteControl[i].col == blackKingPosition.col)
      ) {
        check = true;
      }
    }
  }
  if (color == "B") {
    for (let i = 0; i < blackControl.length; i++) {
      if (
        (blackControl[i].row == whiteKingPosition.row) &
        (blackControl[i].col == whiteKingPosition.col)
      ) {
        check = true;
      }
    }
  }
}

const W = "W";
const B = "B";
const queen = "queen";
const rook = "rook";
const bishop = "bishop";
const knight = "knight";

function queeningSquare(color) {
  let idholder = document.getElementById("queening");
  idholder.setAttribute("class", "queening");
  if (color == "W") {
    idholder.innerHTML =
      '<div><img onclick="promote(W,queen)" src="assets/img/W_queen.png"></img><img onclick="promote(W,rook)" src="assets/img/W_rook.png"></img><img onclick="promote(W,bishop)" src="assets/img/W_bishop.png"></img><img onclick="promote(W,knight)" src="assets/img/W_knight.png"></img></div>';
  } else {
    idholder.innerHTML =
      '<div><img onclick="promote(B,queen)" src="assets/img/B_queen.png"></img><img onclick="promote(B,rook)" src="assets/img/B_rook.png"></img><img onclick="promote(B,bishop)" src="assets/img/B_bishop.png"></img><img onclick="promote(B,knight)" src="assets/img/B_knight.png"></img></div>';
  }
  queening = true;
}

function promote(color, piece) {
  if (color == "W") {
    if (piece == "queen") {
      matrix[queeninghelp.row][queeninghelp.col] = "W_queen";
    }
    if (piece == "rook") {
      matrix[queeninghelp.row][queeninghelp.col] = "W_rook";
    }
    if (piece == "bishop") {
      matrix[queeninghelp.row][queeninghelp.col] = "W_bishop";
    }
    if (piece == "knight") {
      matrix[queeninghelp.row][queeninghelp.col] = "W_knight";
    }
  } else {
    if (piece == "queen") {
      matrix[queeninghelp.row][queeninghelp.col] = "B_queen";
    }
    if (piece == "rook") {
      matrix[queeninghelp.row][queeninghelp.col] = "B_rook";
    }
    if (piece == "bishop") {
      matrix[queeninghelp.row][queeninghelp.col] = "B_bishop";
    }
    if (piece == "knight") {
      matrix[queeninghelp.row][queeninghelp.col] = "B_knight";
    }
  }
  queenedPiece = piece.substr(0, 1).toUpperCase();
  if (piece == "knight") {
    queenedPiece = "N";
  }
  let changer = document.getElementById(
    findTheId(queeninghelp.row, queeninghelp.col)
  );
  let prev = document.getElementById(globalhelp);
  changer.setAttribute(
    "src",
    "assets/img/" + matrix[queeninghelp.row][queeninghelp.col] + ".png"
  );
  changer.setAttribute("onclick", "move(id)");
  prev.setAttribute("src", "assets/img/empty.png");
  prev.setAttribute("onclick", "");
  document.getElementById("queening").setAttribute("class", "nodisplay");
  updateBlackControl();
  updateWhiteControl();
  updateCheck(color);
  checkForMate(color);
  //printMove(!player);
  //gameMoves.push(notation());
  queening = false;
  playerSwitch();
  runClock(player);
}

//Paso de explicar esto
function checkForMate(oyea) {
  validmoves = [];
  let color = oyea;
  let moveholder = [];
  let squareholder = 0;
  let piecemover = 0;
  let Wsave = whiteControl;
  let Bsave = blackControl;
  let Csave = check;
  let WkingSave = whiteKingPosition;
  let BkingSave = blackKingPosition;
  controlling = true;
  if (color == "W") {
    color = "B";
  } else {
    color = "W";
  }
  if (color == "W") {
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        if (
          matrix[i][j] == color + "_pawnS" ||
          matrix[i][j] == color + "_pawn"
        ) {
          moveholder = [];
          moveholder = pawnMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateBlackControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (matrix[i][j] == color + "_bishop") {
          moveholder = [];
          moveholder = bishopMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateBlackControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (matrix[i][j] == color + "_knight") {
          moveholder = [];
          moveholder = knightMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateBlackControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (matrix[i][j] == color + "_queen") {
          moveholder = [];
          moveholder = queenMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateBlackControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (
          matrix[i][j] == color + "_rook" ||
          matrix[i][j] == color + "_rookS"
        ) {
          moveholder = [];
          moveholder = rookMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateBlackControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (
          matrix[i][j] == color + "_king" ||
          matrix[i][j] == color + "_kingS"
        ) {
          moveholder = kingMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              whiteKingPosition = {
                row: moveholder[k].row,
                col: moveholder[k].col,
              };
              updateBlackControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
              whiteKingPosition = WkingSave;
            }
          }
        }
      }
    }
  }
  if (color == "B") {
    for (let i = 0; i <= 7; i++) {
      for (let j = 0; j <= 7; j++) {
        if (
          matrix[i][j] == color + "_pawnS" ||
          matrix[i][j] == color + "_pawn"
        ) {
          moveholder = [];
          moveholder = pawnMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateWhiteControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (matrix[i][j] == color + "_bishop") {
          moveholder = [];
          moveholder = bishopMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateWhiteControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (matrix[i][j] == color + "_knight") {
          moveholder = [];
          moveholder = knightMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateWhiteControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (matrix[i][j] == color + "_queen") {
          moveholder = [];
          moveholder = queenMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateWhiteControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (
          matrix[i][j] == color + "_rook" ||
          matrix[i][j] == color + "_rookS"
        ) {
          moveholder = [];
          moveholder = rookMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              updateWhiteControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
            }
          }
        }
        if (
          matrix[i][j] == color + "_king" ||
          matrix[i][j] == color + "_kingS"
        ) {
          moveholder = [];
          moveholder = kingMove(color, { row: i, col: j });
          if (moveholder != undefined) {
            for (let k = 0; k < moveholder.length; k++) {
              squareholder = matrix[moveholder[k].row][moveholder[k].col];
              piecemover = matrix[i][j];
              matrix[i][j] = 0;
              matrix[moveholder[k].row][moveholder[k].col] = piecemover;
              blackKingPosition = {
                row: moveholder[k].row,
                col: moveholder[k].col,
              };
              updateWhiteControl();
              updateCheck(oyea);
              if (check != true) {
                validmoves.push({
                  row: moveholder[k].row,
                  col: moveholder[k].col,
                });
              }
              matrix[i][j] = piecemover;
              matrix[moveholder[k].row][moveholder[k].col] = squareholder;
              blackControl = Bsave;
              whiteControl = Wsave;
              check = Csave;
              blackKingPosition = BkingSave;
            }
          }
        }
      }
    }
  }
  controlling = false;
  if (color == "W") {
    color = "B";
  } else {
    color = "W";
  }
  if ((check == true) & (validmoves.length == 0)) {
    checkmate(color);
    mate = true;
  } else {
    if ((check == false) & (validmoves.length == 0)) {
      stalemate();
    }
  }
}

function checkmate(color) {
  gameStillOn = false;
  clearInterval(Wclock);
  clearInterval(Bclock);
  if(color == "W") {
    printOutcome(true, false, 'checkmate');
  } else {
    printOutcome(false, true, 'checkmate');
  }
}

function stalemate() {
  gameStillOn = false;
  printOutcome(true, true, 'stalemate')
}

function reset() {
  gameStillOn = true;
  lastToMove = "B";
  player = true;
  gameMoves = [];
  generateMatrix();
  setPieces();
  generateBoard();
  resetClocks();
}

function clock(minutes, increment, loadSave=false) {
  updateClock(player);
  time = { mins: minutes, incr: increment };
  if(!loadSave){
    timers.white = minutes * 60;
    timers.black = minutes * 60;
  }
  runClock(player);
}

function runClock(turn) {
  if (turn) {
    clearInterval(Bclock);
    timers.black = timers.black + time.incr;
    updateClock(false);
    Wclock = setInterval(function () {
      timers.white--;
      updateClock(turn);
    }, 1000);
  } else {
    clearInterval(Wclock);
    timers.white = timers.white + time.incr;
    updateClock(true);
    Bclock = setInterval(function () {
      timers.black--;
      updateClock(turn);
    }, 1000);
  }
}

function updateClock(turn) {
  let minutes;
  let seconds;
  if (turn) {
    minutes = Math.floor(timers.white / 60);
    seconds = timers.white - minutes * 60;
    timers.whiteID.innerHTML = formatTime(minutes, seconds);
    if ((minutes == 0) & (seconds == 0)) {
      loseByTimeout(turn);
    }
  } else {
    minutes = Math.floor(timers.black / 60);
    seconds = timers.black - minutes * 60;
    timers.blackID.innerHTML = formatTime(minutes, seconds);
    if ((minutes == 0) & (seconds == 0)) {
      loseByTimeout(turn);
    }
  }
}

function loseByTimeout(turn) {
  if (turn) {
    printOutcome(true, false, 'timeout');
  } else {
    printOutcome(false, true, 'timeout');
  }
  clearInterval(Wclock);
  clearInterval(Bclock);
  gameStillOn = false;
}

/* function notation() {
  let file = lastmove[1].col;
  let rank = lastmove[1].row;
  let piece = lastPiece.substr(2, lastPiece.length - 2);
  let captures;
  let checc;
  let m8 = "";
  let queens = "";

  if (check) {
    checc = "+";
  } else {
    checc = "";
  }
  if (takes) {
    captures = "x";
  } else {
    captures = "";
  }
  if (piece == "pawn" || piece == "pawnS") {
    if (takes) {
      piece = String.fromCharCode(lastmove[0].col + 65).toLowerCase();
    } else {
      piece = "";
    }
  }
  if (piece == "rook" || piece == "rookS") {
    piece = "r";
  }
  if (piece == "king" || piece == "kingS") {
    piece = "k";
  }
  if (piece == "knight") {
    piece = "n";
  }
  if (piece == "bishop") {
    piece = "b";
  }
  if (piece == "queen") {
    piece = "q";
  }
  if (queening) {
    queens = "=" + queenedPiece;
  }
  if (mate) {
    m8 = "#";
    checc = "";
  }

  file = String.fromCharCode(file + 65).toLowerCase();
  rank = 7 - rank + 1;

  return piece + captures + file + rank + queens + checc + m8;
} */

function forfeit(color) {
  if(gameStillOn){
    if (color) {
      printOutcome(true, false, 'forfeit')
    } else {
      printOutcome(false, true, 'forfeit');
    }
    clearInterval(Wclock);
    clearInterval(Bclock);
    gameStillOn = false;
  }
}

function drawWhite(element) {
  if(gameStillOn) {
    drawFlag[0] = !drawFlag[0];
    if (drawFlag[0]) {
      element.style.backgroundColor = "orange";
    } else {
      element.style.backgroundColor = "whitesmoke";
    }
  
    checkDraw();
  }
}

function drawBlack(element) {
  if(gameStillOn){
    drawFlag[1] = !drawFlag[1];
    if (drawFlag[1]) {
      element.style.backgroundColor = "orange";
    } else {
      element.style.backgroundColor = "whitesmoke";
    }
    checkDraw();
  }
}

function checkDraw() {
  if (drawFlag[0] && drawFlag[1]) {
    printOutcome(true, true, 'agreement')
    clearInterval(Wclock);
    clearInterval(Bclock);
    gameStillOn = false;
    document.getElementById('blackDraw').style.backgroundColor = 'whitesmoke';
    document.getElementById('whiteDraw').style.backgroundColor = 'whitesmoke';
    drawFlag[0] = false;
    drawFlag[1] = false;
  }
}

function printOutcome(white, black, argument) {
  const domElement = document.getElementById('outcome');
  const playersData = getPlayers();
  let assistVarOne;
  let assistVarTwo;
  let content;

  if(switchy) {
    assistVarOne = 0;
    assistVarTwo = 1
  } else {
    assistVarOne = 1;
    assistVarTwo = 0;
  }

  if (white && black){
    content = '<div><div class="whiteWinPanel"><div class="drawPanel"><figure><img src='+playersData[assistVarOne].profilepic+' alt="black king"></figure><figure><img src='+playersData[assistVarTwo].profilepic+' alt="white king"></figure></div><h3>The game is a draw by '+argument+'!</h3><p>Tap anywhere to close this message. You can use the sidebar menu to play again!</p></div></div>';
  }
  if (!white && black) {
    content = '<div><div class="whiteWinPanel"><figure><img src='+playersData[assistVarOne].profilepic+' alt="white knight"></figure><h3>White wins by '+argument+'!</h3><p>Tap anywhere to close this message. You can use the sidebar menu to play again!</p></div></div>';
  }
  if (white && !black) {
    content = '<div><div class="blackWinPanel"><figure><img src='+playersData[assistVarTwo].profilepic+' alt="black knight"></figure><h3>Black wins by '+argument+'!</h3><p>Tap anywhere to close this message. You can use the sidebar menu to play again!</p></div></div>';
  }

  domElement.innerHTML = content;
  switchy = !switchy;
  toggleOutcomeDisplay();
}

/*function printMove(turn) {
  if (turn) {
        document.getElementById("moveHistory").innerHTML += '<tr></tr>';
        document.querySelector("#moveHistory tr:last-of-type").innerHTML += '<td class="whiteMove">' + notation() + '</td>';
    } else {
        document.querySelector("#moveHistory tr:last-of-type").innerHTML += '<td class="blackMove">' + notation() + '</td>';
    }
  totalMoveList.push(notation());
}*/

// SAVES ---------------------------------------------------------------------------------  -----------------------------------------   --- ------- ----------------------------------------------------------------

const saveGame = (
  matrix,
  turn,
  lastmove,
  lastPlayerToMove,
  gameStillOn,
  timers,
  timersSettingsData
) => {
  const gameState = {
    board: matrix,
    turn: turn,
    lastmove: lastmove,
    lastToMoveData: lastPlayerToMove,
    gameState: gameStillOn,
    clocks: timers,
    timerSettings: timersSettingsData,
  };
  localStorage.setItem("chessData", JSON.stringify(gameState));
};

const loadGame = (chessData) => {
  matrix = chessData.board;
  player = chessData.turn;
  lastIds = chessData.lastmove;
  gameStillOn = chessData.gameState;
  timers.white = chessData.clocks.white;
  timers.black = chessData.clocks.black;
  clock(chessData.timerSettings.mins, chessData.timerSettings.incr, true);
  updateClock(!player);
  lastToMove = chessData.lastToMoveData;
  updateTimeSettings(true, [chessData.timerSettings.mins, chessData.timerSettings.incr])

  gameStillOn = true;
  generateBoard();
};

const checkSaves = () => {
  const availableData = JSON.parse(localStorage.getItem("chessData"));
  if (availableData != null) {
    loadGame(availableData);
    return true;
  } else {
    return false;
  }
};

const startup = () => {
  if (!checkSaves()) {
    reset();
    //clock(time, increment);
  }
};

const toggleTimeMenu = () => {
  if (timeToggleElement.getAttribute("class") == "timeSettingsInactive") {
    timeToggleElement.setAttribute("class", "timeSettingsActive");
  } else {
    timeToggleElement.setAttribute("class", "timeSettingsInactive");
  }
  updateTimeSettings();
};

const toggleOutcomeDisplay = () => {
  const domElement = document.getElementById('outcome');

  if (domElement.getAttribute('class') == 'nodisplay') {
    domElement.setAttribute('class', 'display');
  } else {
    domElement.setAttribute('class', 'nodisplay')
  }
}

const updateTimeSettings = (loadState=false, settings) => {
  let mins, increment, elementText;
  if(loadState){
    mins = settings[0];
    increment = settings[1];
  } else {
    mins = parseInt(document.getElementById('time').value);
    increment = parseInt(document.getElementById('increment').value);
  }

  elementText = mins + ' | ' + increment;
  document.getElementById('chessTime').innerHTML = elementText;
} 

const resetClocks = () => {
  let newTime = parseInt(document.getElementById("time").value);
  let newIncrement = parseInt(document.getElementById("increment").value);

  clearInterval(Wclock);
  clearInterval(Bclock);
  clock(newTime, newIncrement);
};

const formatTime = (minutes, seconds) => {
  let newMinutes = minutes;
  let newSeconds = seconds;

  if (minutes < 10) {
    newMinutes = "0" + minutes;
  }
  if (seconds < 10) {
    newSeconds = "0" + seconds;
  }

  return newMinutes + ":" + newSeconds;
};

startup();
