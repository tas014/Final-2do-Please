var jugador=-1;
var gameStillOn=true;
var a1,a2,a3,b1,b2,b3,c1,c2,c3;
var casilleros = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];
var casillerosid = ["a","b","c"]
var movimientos = 0;
var uno = 0;
var dos = 0;
var saver=[];
var alreadysaved=false;
var bugpreventer=false;
var users=[];
var currentProfile=null;
var secondProfile=null;
var switchy=true;
const tableElement = document.getElementById("tabla");

function updateProfiles() {
    if (users.length!=0) {
        let profileList=JSON.stringify(users);
        localStorage.setItem("usuarios",profileList);
        let actual=JSON.stringify(currentProfile);
        localStorage.setItem("loggedUser",actual);
        let Sactual=JSON.stringify(secondProfile);
        localStorage.setItem("secondUser",Sactual);
    }
}

function getProfiles() {
    let userList=JSON.parse(localStorage.getItem("usuarios"));
    if (userList!=null) {
        let actualProfile=JSON.parse(localStorage.getItem("loggedUser"));
        users=userList;
        currentProfile=actualProfile;
            if (users.length>1) {
                secondProfile=JSON.parse(localStorage.getItem("secondUser"))
            }
        } else {
            document.getElementById("TTT").setAttribute("href","profiles.html");
            document.getElementById("CH").setAttribute("href","profiles.html");
            document.getElementById("MT").setAttribute("href","profiles.html");
        }
}

// cambiar por array
// controlar que no se reemplacen los casiLLeros ocupados
// resetear tablero
// opcional: marcador de puntaje

function playerSwitch () {
    jugador=jugador*(-1);
    saveGame();
}

function winner (pw){
        blink();
        gameStillOn=false;
        //document.getElementById("info").innerHTML="El jugador "+pw+" ha ganado.";
        var winner = document.getElementById("winAudio");
        winner.volume = 0.2;
        winner.play();
        document.getElementsByTagName("td").innerHTML=" ";

        if(pw == 1){
            dos = parseInt(document.getElementById('p2Score').innerHTML) + 1;
            uno = parseInt(document.getElementById('p1Score').innerHTML);
        }else{
            uno = parseInt(document.getElementById('p1Score').innerHTML) + 1;
            dos = parseInt(document.getElementById('p2Score').innerHTML)
        };
        updateScores();
        updateProfileScore();
        saveGame();
} 

function updateScores() {
        document.getElementById("p2Score").innerHTML= dos;
        document.getElementById("p1Score").innerHTML= uno;
}


function empate (){
    document.getElementById("info").innerHTML="¡Empate!";
    casilleros = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];
    gameStillOn = false;
}

function gameEnder () {
    if ( casilleros[0][0]+casilleros[1][0]+casilleros[2][0] == 3 || casilleros[0][1]+casilleros[1][1]+casilleros[2][1]==3 || casilleros[0][2]+casilleros[1][2]+casilleros[2][2]==3 || casilleros[0][0]+casilleros[0][1]+casilleros[0][2]==3 || casilleros[1][0]+casilleros[1][1]+casilleros[1][2]==3 || casilleros[2][0]+casilleros[2][1]+casilleros[2][2]==3 || casilleros[0][0]+casilleros[1][1]+casilleros[2][2]==3 || casilleros[2][0]+casilleros[1][1]+casilleros[0][2]==3) {
        winner(1);
    }

    if ( casilleros[0][0]+casilleros[1][0]+casilleros[2][0] == -3 || casilleros[0][1]+casilleros[1][1]+casilleros[2][1]== -3 || casilleros[0][2]+casilleros[1][2]+casilleros[2][2]== -3 || casilleros[0][0]+casilleros[0][1]+casilleros[0][2]== -3 || casilleros[1][0]+casilleros[1][1]+casilleros[1][2]== -3 || casilleros[2][0]+casilleros[2][1]+casilleros[2][2]== -3 || casilleros[0][0]+casilleros[1][1]+casilleros[2][2]== -3 || casilleros[2][0]+casilleros[1][1]+casilleros[0][2]== -3) {
        winner(2);
    }

    if(casilleros[0][0] && casilleros[1][0] && casilleros[2][0] && casilleros[0][1] && casilleros[1][1] && casilleros[2][1] && casilleros[0][2] && casilleros[1][2] && casilleros[2][2] !==0){
          empate();
    }
}

function blink (){
    if(casilleros[0][0]+casilleros[1][0]+casilleros[2][0] == 3 || casilleros[0][0]+casilleros[1][0]+casilleros[2][0] == -3){
        document.getElementById("A0").setAttribute("class", "combinacionGanadora");
        document.getElementById("B0").setAttribute("class", "combinacionGanadora");
        document.getElementById("C0").setAttribute("class", "combinacionGanadora");
        console.log("gan� una vez")
    };
    if(casilleros[0][1]+casilleros[1][1]+casilleros[2][1] == 3 || casilleros[0][1]+casilleros[1][1]+casilleros[2][1] == -3){
        document.getElementById("A1").setAttribute("class", "combinacionGanadora");
        document.getElementById("B1").setAttribute("class", "combinacionGanadora");
        document.getElementById("C1").setAttribute("class", "combinacionGanadora");
        console.log("gan� una vez")
    };
    if(casilleros[0][2]+casilleros[1][2]+casilleros[2][2] == 3 || casilleros[0][2]+casilleros[1][2]+casilleros[2][2] == -3){
        document.getElementById("A2").setAttribute("class", "combinacionGanadora");
        document.getElementById("B2").setAttribute("class", "combinacionGanadora");
        document.getElementById("C2").setAttribute("class", "combinacionGanadora");
        console.log("gan� una vez")
    };
    if(casilleros[0][0]+casilleros[0][1]+casilleros[0][2] == 3 || casilleros[0][0]+casilleros[0][1]+casilleros[0][2] == -3){
        document.getElementById("A0").setAttribute("class", "combinacionGanadora");
        document.getElementById("A1").setAttribute("class", "combinacionGanadora");
        document.getElementById("A2").setAttribute("class", "combinacionGanadora");
        console.log("gan� una vez")
    };
    if(casilleros[1][0]+casilleros[1][1]+casilleros[1][2] == 3 || casilleros[1][0]+casilleros[1][1]+casilleros[1][2] == -3){
        document.getElementById("B0").setAttribute("class", "combinacionGanadora");
        document.getElementById("B1").setAttribute("class", "combinacionGanadora");
        document.getElementById("B2").setAttribute("class", "combinacionGanadora");
        console.log("gan� una vez")
    };
    if(casilleros[2][0]+casilleros[2][1]+casilleros[2][2] == 3 || casilleros[2][0]+casilleros[2][1]+casilleros[2][2] == -3){
        document.getElementById("C0").setAttribute("class", "combinacionGanadora");
        document.getElementById("C1").setAttribute("class", "combinacionGanadora");
        document.getElementById("C2").setAttribute("class", "combinacionGanadora");
        console.log("gan� una vez")
    };
    if(casilleros[0][0]+casilleros[1][1]+casilleros[2][2] == 3 || casilleros[0][0]+casilleros[1][1]+casilleros[2][2] == -3){
        document.getElementById("A0").setAttribute("class", "combinacionGanadora");
        document.getElementById("B1").setAttribute("class", "combinacionGanadora");
        document.getElementById("C2").setAttribute("class", "combinacionGanadora");
        console.log("gan� una vez")
    };
    if(casilleros[2][0]+casilleros[1][1]+casilleros[0][2] == 3 || casilleros[2][0]+casilleros[1][1]+casilleros[0][2] == -3){
        document.getElementById("A2").setAttribute("class", "combinacionGanadora");
        document.getElementById("B1").setAttribute("class", "combinacionGanadora");
        document.getElementById("C0").setAttribute("class", "combinacionGanadora");
        console.log("gan� una vez")
    };
}

//traduce un id a su posicion en la matriz
function findPosition (id){ 
    let letter=id.substr(0,1); //guardo la letra del id
    let translatedLetter=letter.charCodeAt(0); //y la transformo en número
    translatedLetter=translatedLetter-65; //le resto 65 (motivo explicado abajo en findId())
    let nro=parseInt(id.substr(1,1)); //destransformo el número del id, que era un string
    let array=[translatedLetter,nro]; //guardo ambos números en un array de 2 posiciones. si el id que pase fuera "A0", el array va a verse así: array=[0,0].

    return array //y devuelvo el array
}

//traduce una posicion (ejemplo [0][2]) a un id (en caso de [0][2] seria "A2")
function findId(posobject) { // le paso como parametro un objeto con las 2 posiciones en el array como propiedades row y col (posobject.row devuelve la primera coordenada de la matriz)
    let letter=posobject.row+65; // 65 es la letra "A" en unicode, por lo tanto le sumo 65 para que recorra a partir de la A
    letter=String.fromCharCode(letter);//transformo el numero en letra (65=>"A",66=>"B",etc)
    let id=letter+posobject.col;// sumo la letra al numero, que se transforma en string porque letter ya es un string

    return id; // y lo devuelvo
}

function createTable () { //crea la tabla desde javascript
    tableElement.innerHTML="";
    for (let i=0;i<3;i++) {
        let row=tabla.insertRow(i);
        for (let j=0; j<3; j++) {
            let cell=row.insertCell(j);
            cell.setAttribute("onclick","drawer(id)");
            cell.setAttribute("id",findId({row:i,col:j}));
        }
    }
}

function drawer (id) {
    let clickedElement=document.getElementById(id);
    if (gameStillOn==true) {
            if (jugador==1) {
                let idposition=findPosition(id);
                casilleros[idposition[0]][idposition[1]]=jugador;
                saveGame();
                clickedElement.innerHTML="O";
                clickedElement.setAttribute("class", "circulo");
                clickedElement.setAttribute("onclick","")
                var audio = document.getElementById("firstAudio");
                audio.volume = 0.3;
                audio.play();
          //      casilleroActual=1;
                movimientos = movimientos+1;
                playerSwitch();
            } else{
                let idposition=findPosition(id);
                casilleros[idposition[0]][idposition[1]]=jugador;
                saveGame();
                clickedElement.innerHTML="X";
                clickedElement.setAttribute("class", "cruz");
                clickedElement.setAttribute("onclick","")
                var anotherAudio = document.getElementById("secondAudio");
                anotherAudio.volume = 0.1;
                anotherAudio.play();
          //      casilleroActual=-1;
                movimientos = movimientos+1;
                playerSwitch();
            };
            gameEnder();
            return jugador;
        }  
    } 


function reset(){
    saver=[];
    casilleros = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];
    createTable();
    gameStillOn= true;
    //document.getElementById("info").innerHTML="";
    saveGame();
    jugador=-1;
    switchSides();
}

function switchSides() {
    const firstElement = [document.getElementById('p1'), document.getElementById('p1Score')];
    const secondElement = [document.getElementById('p2'), document.getElementById('p2Score')];
    !switchy;
    
    firstElement[0].setAttribute('id', 'p2');
    firstElement[1].setAttribute('id', 'p2Score');

    secondElement[0].setAttribute('id', 'p1');
    secondElement[1].setAttribute('id', 'p1Score');
}


function saveGame() {
    localStorage.setItem("TicTacToeData",JSON.stringify({
        board:casilleros,
        score: [uno,dos],
        htmlElementState: tableElement.innerHTML,
        turn: jugador
        })
    );
}

function loadGame() {
    let fetchedData = JSON.parse(localStorage.getItem("TicTacToeData"));

    if(fetchedData != null) {
        casilleros = fetchedData.board;
        uno = fetchedData.score[0];
        dos = fetchedData.score[1];
        jugador = fetchedData.turn;
        loadPrevPosition(fetchedData.htmlElementState);
        updateScores();
    } else {
        reset();
    }
    fillContent();
}

function loadPrevPosition(data) {
    tableElement.innerHTML = data;
    bugpreventer=true;
    gameEnder();
}

function updateProfileScore() {
    for (let i=0;i<users.length;i++) {
        if (currentProfile.profilepic==users[i].profilepic) {
            users[i].score1=currentProfile.score1
        }
    }
}

function scoreboard() {
    let idholder=document.getElementById("scoreboard");
    let usersorter=[];

    for (let i=0;i<users.length;i++) {
        usersorter.push(users[i]);
    };
    usersorter.sort(function (a,b) {
        let first=a.score1;
        let second=b.score1;
        if (second>first) {return 1};
        if (first>second) {return -1};
        return 0;
    });
    for (let i=0;i<users.length;i++) {
        idholder.innerHTML+='<tr class="scoreboardcontainer"><td><img class="scoreboardimg" alt="imagen de '+usersorter[i].nick+'" src="'+usersorter[i].profilepic+'"></td><td class="scoreboardnick">'+usersorter[i].nick+'</td><td class="scoreboardscore">'+usersorter[i].score1+'</td></tr>'
    }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function fillContent() {
    const contentObjectOne = {
        img: document.getElementById("player1Img"),
        nick: document.getElementById("p1")
    }
    const contentObjectTwo = {
        img: document.getElementById("player2Img"),
        nick: document.getElementById("p2")
    }

   fillTicTacToeUsers([contentObjectOne, contentObjectTwo]); 
}


window.onload = loadGame();

// dentro de funci�n reset y al cerrar?
// JSONstringify
// Cuando termina el juego lo borro