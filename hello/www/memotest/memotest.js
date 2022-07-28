// DECLARO VARIABLES Y CONSTANTES;
const content =
  document.querySelector(
    "table tbody"
  ); /*le asigno a la variable content la tabla que está vacía para después poder modificarla con la funcion generateTable, pasandola como parámetro. También al tenerla en una variable agilizamos su manipulación, tanto para llenarla como para vaciar el contenido*/
var tableSize = document.getElementById("pick");
var matrixSize = 4; //Dimension de la matriz (5x5, 6x6, etc)
var matrixRows = 4; //Dimension de la matriz (5x5, 6x6, etc)
var matrixColumns = matrixRows;
var checker = []; // este array guarda los 2 valores para comparar si son los mismos
var matrix = []; // declaro la matriz
var imgArray = [
  "img/0.png",
  "img/1.png",
  "img/2.png",
  "img/3.png",
  "img/4.png",
  "img/5.png",
  "img/6.png",
  "img/7.png",
  "img/8.png",
  "img/9.png",
  "img/10.png",
  "img/11.png",
  "img/12.png",
  "img/13.png",
  "img/14.png",
  "img/15.png",
  "img/16.png",
  "img/17.png",
]; // declaro el array que va a contener los objetos.
var shuffleArray = []; // declaro el array que va a mezclar las posiciones.
var score = 1000; // puntaje inicial
var mod = 0.98; // variable por la cual se multiplica el puntaje (al ser menor que 1 hace el numero menor en vez de mayor al multiplicarlo, es lo mismo q dividir por 1.02)
var pairCount = 0; // valor inicial de los pares correctos
var currentPlayer = true; //variable que guarda los jugadores
var idHolder = [];
var ticking = false;
var time = 0;
var freeFunction = true;
const players = getPlayers();
const timeUpdater = document.getElementById("time");

/*---------------------- FUNCIONES ----------------------*/

/* funcion para generar la tabla. Dentro de las filas y columnas que se van agregando introducimos la imagen default, con las funciones onclick */
function generateTable() {
  generateMatrix();
  valueAssigner();
  content.innerHTML = null;
  for (let j = 0; j < matrixRows; j++) {
    let row = content.insertRow(j);
    row.setAttribute("id", "row " + j);
    for (let i = 0; i < matrixColumns; i++) {
      let cell = row.insertCell(i);
      cell.innerHTML =
        "<img src=img/default.png id=" + j + "" + i + " onclick=check(id)>";
      //cell.setAttribute ("id", j+""+i);
      //cell.setAttribute ("onclick", "check(id)");
    }
  }
}

generateTable();

/* funcion para modificar el tamaño de la tabla, una vez que el usuario modifica el value, se reinicia generateTable() */
function getMatrixSize() {
  matrixSize = parseInt(document.getElementById("pick").value);
  matrixRows = parseInt(document.getElementById("pick").value);
  matrixColumns = parseInt(document.getElementById("pick").value);
  generateTable();
  freeFunction = true;
  currentPlayer = !currentPlayer;
  pairCount = 0;
  fillPlayerContent(currentPlayer);
}

/* generateMatrix() crea el array bidimensional, dandole por default el valor 0 a cada elemento (filas y columnas) */
function generateMatrix() {
  matrix = [];
  shuffleArray = [];
  for (let i = 0; i < matrixRows; i++) {
    //recorre la dimension de la matriz
    matrix.push([]); //agrega un array por posicion de matrixSize

    for (let j = 0; j < matrixColumns; j++) {
      matrix[i].push(0); //rellena de la cantidad de 0 necesaria
      shuffleArray.push({ Row: i, Col: j }); // crea un objeto con Row y Col por cada posicion de la matriz. Al llamar una subposicion de la matriz estas llamando un objeto con un set de coordenadas unico.
    }
  }

  shuffleArray = shuffler(shuffleArray); // randomiza las posiciones una vez ya generadas
}

function valueAssigner() {
  // Asigna valores de a pares a las posiciones disponibles de la matriz.
  for (
    let i = 0;
    i < Math.floor((matrixRows * matrixColumns) / 2) * 2;
    i = i + 2
  ) {
    // Cuenta hasta la mitad del total de posiciones en la matriz. Omite numeros impares (5x5, 7x7, 9x9)
    matrix[shuffleArray[i].Row][shuffleArray[i].Col] = i / 2; // Asigna la primer posicion de un par llamando al objeto de la subposicion i de shuffleArray, que contiene un objeto con un dato de Col y Row para utilzar como posicion.
    matrix[shuffleArray[i + 1].Row][shuffleArray[i + 1].Col] = i / 2; //Asigna la segunda posición de un par llamando al objeto de la subposicion i+1 de shuffleArray, que contiene un objeto con un dato de Col y Row para utilzar como posicion.
  }
  if (matrixSize ** 2 % 2 !== 0) {
    // Asigna el valor que falta en una matriz impar
    matrix[shuffleArray[matrixSize ** 2 - 1].Row][
      shuffleArray[matrixSize ** 2 - 1].Col
    ] = (matrixSize ** 2 + 1) / 2; //el -1 es porque la ultima subposicion de un array con 25 posiciones es 24, ya que la primera subposicion es 0.
    console.log("funciono");
  }
}

function shuffler(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function parser(id) {
  // esta funcion separa las partes del id y las transforma en numero.(ej: el id "00" pasa a ser matrix[0][0])

  let tenedor = id; // variable auxiliar para guardar el string del id
  let guardarPrimerNumero = tenedor.substr(0, 1); // guardo el primer carácter del string
  let guardarSegundoNumero = tenedor.substr(1, 1); // guardo el segundo caracter del string
  guardarPrimerNumero = parseInt(guardarPrimerNumero); //transformo en numero el primer carácter que había guardado
  guardarSegundoNumero = parseInt(guardarSegundoNumero); //transformo en numero el segundo carácter que había guardado
  let valorMatriz = matrix[guardarPrimerNumero][guardarSegundoNumero]; //asigno en una variable la coordenada correspondiente a los numeros indicados por el id, ver ejemplo en la linea 114.

  return valorMatriz; // devuelvo el valor de la posicion indicada de la matriz
}

function check(id) {
  if (ticking != true) {
    runClock();
  }
  if (freeFunction == true) {
    let value = parser(id); // guardo en value el valor de la posición de la matriz indicada por el elemento al que se le hizo click
    console.log(value);
    console.log(typeof value);
    checker.push(value); // meto el valor numerico al array checker
    idHolder.push(id); // meto el string con el id al array idHolder

    //console.log(id);
    document.getElementById(id).setAttribute("onclick", ""); // elimino el onclick del elemento al que se le hizo click para evitar que futuros clicks en ese elemento rompan la lógica.
    showCard(id, value); // muestro la carta que fue seleccionada

    if (checker.length >= 2) {
      // me fijo si el jugador clickeo 2 cartas diferentes
      freeFunction = false;
      if (checker[0] == checker[1]) {
        /* lo que queremos que pase cuando se cumpla la condicion */ setTimeout(
          function () {
            correctPair();
            checker = [];
            idHolder = [];
            freeFunction = true;
            saveGame(
              matrix,
              pairCount,
              { id: idHolder, pos: checker },
              time,
              content,
              freeFunction,
              currentPlayer
            );
          },
          800
        ); //el timeout espera 2 segundos y ejecuta la funcion correctPair (no esta funcionando, pero esa es la lógica)
        //checker=[]; //limpio el array checker
        //idHolder=[]; //limpio el array idHolder
        pairCount++; // agrego 1 a la cuenta de pares correctos.
      } else {
        setTimeout(function () {
          flip();
          checker = [];
          idHolder = [];
          freeFunction = true;
          saveGame(
            matrix,
            pairCount,
            { id: idHolder, pos: checker },
            time,
            content,
            freeFunction,
            currentPlayer
          );
        }, 800); // el timeout espera 2 segundos y ejecuta la función flip (no esta funcionando y lo ejecuta instantáneamente, por lo que parece que la segunda carta solo se muestra si es correcta)
        //checker=[]; // limpio el array checker
        //idHolder=[]; // limpio el array idHolder
      }
    }

    if (pairCount === Math.floor(matrixSize ** 2 / 2)) {
      //condición ganadora. Ya que contamos PARES correctos tiene que ser la mitad del cuadrado de la matriz. (4x4 tiene 8 pares, 5x5 tiene 12 pares, 6x6 tiene 18 pares.)
      stopClock();
      displayScore("player"); // muestro el puntaje final.
      console.log("sos vos");
    }
  }
}

function correctPair() {
  // asigna a los 2 elementos clickeados la clase "correct"
  document.getElementById(idHolder[0]).setAttribute("class", "correct");
  document.getElementById(idHolder[1]).setAttribute("class", "correct");
}

function showCard(id, value) {
  document.getElementById(id).setAttribute("src", imgArray[value]); //utiliza el id para seleccionar el elemento indicado y el value para saber que imagen del array de imagenes (imgArray[valor en la matriz del id]) hay que mostrar.
}

function flip() {
  // condicion al ser incorrecto el par seleccionado
  document.getElementById(idHolder[0]).setAttribute("src", "img/default.png"); // le vuelvo a dar default como imagen a la primera imágen que seleccionó
  document.getElementById(idHolder[1]).setAttribute("src", "img/default.png"); // le vuelvo a dar default como imagen a la segunda imágen que seleccionó
  document.getElementById(idHolder[0]).setAttribute("onclick", "check(id)"); // le devuelvo el onclick a la primera imágen que seleccionó, para que vuelva a ser interactuable.
  document.getElementById(idHolder[1]).setAttribute("onclick", "check(id)"); // le devuelvo el onclick a la segunda imágen que seleccionó, para que vuelva a ser interactuable.
}

function scoreMaker() {
  for (let i = 0; i < time; i++) {
    score = score * 0.992;
  }
  score = Math.floor(score);
}

function displayScore(id) {
  scoreMaker();
  // Imprime el puntaje final.
  if(!currentPlayer){
    document.getElementById(id).innerHTML = players[1].nick + " scored " + score + ' points!';
  } else {
    document.getElementById(id).innerHTML = players[0].nick + " scored " + score + ' points!';
  }
}

function reset() {
  generateTable();
  resetTimer();
}

function runClock() {
  ticking = true;
  clock = setInterval(addTime, 1000);
}

function addTime() {
  time = time + 1;
  //timeUpdater.innerHTML = formatTime();
}

function stopClock() {
  clearInterval(clock);
  ticking = false;
}

/*function formatTime() {
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  minutes = utilidades.pad(minutes, 3);
  seconds = utilidades.pad(seconds, 3);
  minutes = minutes.substr(1, 2);
  seconds = seconds.substr(1, 2);

  let returndata = minutes + ":" + seconds;
  return returndata;
}*/

/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */

function saveGame(
  table,
  pairsGuessed,
  currentSelection,
  timeUsed,
  board,
  currentPlayer
) {
  localStorage.setItem(
    "memotestData",
    JSON.stringify({
      matrix: table,
      progress: pairsGuessed,
      selected: { id: currentSelection.id, pos: currentSelection.pos },
      time: timeUsed,
      htmlElementState: board.innerHTML,
      player: currentPlayer
    })
  );
  console.log("game was saved");
}

function checkSaves() {
  if (localStorage.getItem("memotestData") != null) {
    return true;
  } else {
    return false;
  }
}

function loadGame() {
  const retrievedData = JSON.parse(localStorage.getItem("memotestData"));

  matrix = retrievedData.matrix;
  pairCount = retrievedData.progress;
  idHolder = retrievedData.selected.id;
  checker = retrievedData.selected.pos;
  time = retrievedData.time;
  content.innerHTML = retrievedData.htmlElementState;
  currentPlayer= retrievedData.player;
  //freeFunction = retrievedData.selectState;

  fillPlayerContent(currentPlayer);
  console.log("game loaded");
}

function loadGameHi() {
  console.log("idk either");
}

function startUp() {
  if (checkSaves()) {
    loadGame();
  } else {
    getMatrixSize();
    fillPlayerContent(true)
  }
}

function fillPlayerContent(player) {
  const domElement = [document.getElementById('player'), document.getElementById('playerImg')];
    if(player) {
      domElement[0].innerHTML = players[0].nick + ' is playing...';
      domElement[1].setAttribute('src', players[0].profilepic);
    } else {
      domElement[0].innerHTML = players[1].nick + ' is playing...';
      domElement[1].setAttribute('src', players[1].profilepic);
    }
}

startUp();
