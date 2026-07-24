// STAR WARS MONOPOLY GLOBAL SURVIVAL ENGINE


let players = [];

let turn = 1;

let polandActive = false;

let eventHistory = [];

let valueHistory = [];





// ==========================
// PLAYER SYSTEM
// ==========================


function addPlayer(){

    let name = prompt("Player name:");

    if(!name) return;


    players.push({

        name:name,

        cash:1500,

        debt:0,

        loans:[],

        properties:[],

        propertyValue:0

    });


    logEvent(name + " joined the game");

    update();

}







function update(){


    updatePlayers();

    updateSelectors();

    updateGraphData();


}






function updatePlayers(){


let container=document.getElementById("playersContainer");


container.innerHTML="";


players.forEach((player,index)=>{


let netWorth =
player.cash +
player.propertyValue -
player.debt;



container.innerHTML += `


<div class="player-card">


<h3>${player.name}</h3>


<p>💰 Cash: $${player.cash}</p>

<p>💳 Debt: $${player.debt}</p>

<p>🏠 Properties: ${player.properties.length}</p>

<p>📊 Net Worth: $${netWorth}</p>


</div>


`;



});


}








function updateSelectors(){


let selectors=[

"selectedPlayer",

"loanPlayer",

"propertyOwner"

];


selectors.forEach(id=>{


let element=document.getElementById(id);


if(!element)return;


element.innerHTML="<option>Select Player</option>";


players.forEach(player=>{


element.innerHTML +=

`

<option value="${player.name}">
${player.name}
</option>


`;



});


});


}









// ==========================
// MONEY
// ==========================



function selected(){

let name =
document.getElementById("selectedPlayer").value;


return players.find(
p=>p.name===name
);

}



function amount(){


return Number(
document.getElementById("amountInput").value
);


}



function giveMoney(){


let player=selected();

if(!player)return;


player.cash += amount();


logEvent(
player.name+" received $"+amount()
);


update();


}





function removeMoney(){


let player=selected();

if(!player)return;


player.cash -= amount();


logEvent(
player.name+" lost $"+amount()
);


update();


}







// ==========================
// DEBT
// ==========================


function addDebt(){


let player=selected();

if(!player)return;


player.debt += amount();


logEvent(
player.name+" gained $"+amount()+" debt"
);


update();


}





function removeDebt(){


let player=selected();

if(!player)return;


player.debt -= amount();


if(player.debt<0)
player.debt=0;


logEvent(
player.name+" paid debt"
);


update();


}





function forgiveDebt(){


let player=selected();

if(!player)return;


let percent =
Number(prompt("Forgive what %?"));


player.debt -=
player.debt*(percent/100);



logEvent(
player.name+
" had "+
percent+
"% debt forgiven"
);


update();


}









// ==========================
// LOANS
// ==========================


function takeLoan(){


let name =
document.getElementById("loanPlayer").value;


let player =
players.find(p=>p.name===name);


if(!player)return;


let money =
Number(document.getElementById("loanAmount").value);


let interest =
Number(document.getElementById("interestRate").value);



player.cash += money;

player.debt += money;



player.loans.push({

amount:money,

interest:interest

});



logEvent(
player.name+
" took a $"+
money+
" loan"
);


update();


}








function payLoan(){


let player=selected();


if(!player)return;


let payment=amount();


player.debt-=payment;


if(player.debt<0)
player.debt=0;



player.cash-=payment;



logEvent(
player.name+
" paid $"+
payment+
" loan debt"
);


update();


}









// ==========================
// TURN SYSTEM
// ==========================



function endTurn(){


players.forEach(player=>{


player.loans.forEach(loan=>{


let interest =
loan.amount*
(loan.interest/100);



player.debt += interest;



});


});



turn++;


document.getElementById(
"turnNumber"
).innerText=turn;



logEvent(
"Turn "+turn+" started"
);



update();


}









// ==========================
// POLAND
// ==========================



function spawnPoland(){


if(polandActive){

alert("Poland already exists!");

return;

}


polandActive=true;


logEvent(
"🇵🇱 Poland appeared on Free Parking!"
);


}



function removePoland(){


polandActive=false;


logEvent(
"Poland disappeared"
);


}









// ==========================
// LOGGING
// ==========================



function logEvent(text){


eventHistory.unshift(
"Turn "+
turn+
": "+
text
);


let log =
document.getElementById(
"eventLog"
);



if(log)

log.innerHTML =
eventHistory.join("<br>");



}








// ==========================
// SAVE SYSTEM
// ==========================



function saveGame(){


localStorage.setItem(

"starWarsMonopoly",

JSON.stringify({

players,

turn,

eventHistory,

polandActive

})

);


alert("Game saved");


}







function loadGame(){


let data =
localStorage.getItem(
"starWarsMonopoly"
);



if(!data)return;



let save=JSON.parse(data);


players=save.players;

turn=save.turn;

eventHistory=save.eventHistory;

polandActive=save.polandActive;



document.getElementById(
"turnNumber"
).innerText=turn;


update();


alert("Game loaded");


}







function exportGame(){


let data=
JSON.stringify(players);


prompt(
"Copy your save:",
data
);


}








// ==========================
// STARTUP
// ==========================


update();
