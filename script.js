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


updateGraphData();


saveGraph();


logEvent(
"Turn "+turn+" started"
);


update();

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
// ==========================
// PROPERTY SYSTEM
// ==========================



function loadProperties(){


let container =
document.getElementById("propertyContainer");


let selector =
document.getElementById("propertySelect");



if(!container || !selector)
return;



container.innerHTML="";

selector.innerHTML =
"<option>Select Property</option>";



properties.forEach((property,index)=>{


container.innerHTML += `


<div class="property-card 
${property.mortgaged ? "property-mortgaged":""}">


<h3>${property.name}</h3>

<p>Type:
${property.colour || property.type}
</p>

<p>Value:
$${property.price}
</p>

<p>
Owner:
${property.owner || "Bank"}
</p>

<p>
Status:
${property.mortgaged ? 
"Mortgaged":
"Active"}
</p>


</div>


`;



selector.innerHTML += `

<option value="${index}">
${property.name}
</option>

`;



});


}






function selectedProperty(){


let index =
Number(
document.getElementById(
"propertySelect"
).value
);



return properties[index];


}







// GIVE PROPERTY


function giveProperty(){


let property =
selectedProperty();


let owner =
document.getElementById(
"propertyOwner"
).value;



if(!property || !owner)
return;



let player =
players.find(
p=>p.name===owner
);



if(!player)
return;



// remove old owner

if(property.owner){


let old =
players.find(
p=>p.name===property.owner
);


if(old){

old.properties =
old.properties.filter(
x=>x!==property.name
);

}

}





property.owner =
player.name;



player.properties.push(
property.name
);



updatePropertyValue();


logEvent(
player.name+
" received "+
property.name
);





loadProperties();


}









// MORTGAGE


function mortgageProperty(){


let property =
selectedProperty();


if(!property)
return;



if(property.mortgaged)
return;



property.mortgaged=true;



let player =
players.find(
p=>p.name===property.owner
);



if(player){


player.cash +=
property.mortgage;


}



logEvent(
property.name+
" was mortgaged"
);



update();


loadProperties();


}









// REMOVE MORTGAGE


function removeMortgage(){


let property =
selectedProperty();



if(!property)
return;



if(!property.mortgaged)
return;



let player =
players.find(
p=>p.name===property.owner
);



if(player){


player.cash -=
property.mortgage * 1.1;


}



property.mortgaged=false;



logEvent(
property.name+
" mortgage removed"
);



update();


loadProperties();


}









// LIQUIDATE


function liquidateProperty(){


let property =
selectedProperty();



if(!property)
return;



let player =
players.find(
p=>p.name===property.owner
);



if(player){


player.properties =
player.properties.filter(
x=>x!==property.name
);



player.cash +=
property.price / 2;


}



property.owner=null;

property.mortgaged=false;



logEvent(
property.name+
" was liquidated"
);



updatePropertyValue();


update();


loadProperties();


}









// AUCTION


function auctionProperty(){


let property =
selectedProperty();



if(!property)
return;



let winner =
prompt(
"Winner name:"
);



let player =
players.find(
p=>p.name===winner
);



let price =
Number(
prompt(
"Winning bid:"
)
);



if(!player)
return;



player.cash-=price;


property.owner=
player.name;


player.properties.push(
property.name
);



logEvent(
player.name+
" won auction for "+
property.name+
" ($"+
price+
")"
);



update();


loadProperties();


}









// UPDATE PROPERTY VALUE


function updatePropertyValue(){


players.forEach(player=>{


let total=0;


player.properties.forEach(name=>{


let property =
properties.find(
p=>p.name===name
);


if(property){

total+=property.price;

}


});


player.propertyValue=total;


});


}








// START PROPERTY LOADING


setTimeout(()=>{

update();
loadProperties();


},500);
// ==========================
// VALUE GRAPH SYSTEM
// ==========================


let valueChart;



function updateGraphData(){


    let turnData = {
        turn: turn,
        players:{}
    };


    players.forEach(player=>{


        let netWorth =
        player.cash +
        player.propertyValue -
        player.debt;


        turnData.players[player.name] =
        netWorth;


    });


    valueHistory.push(turnData);


    drawGraph();

}







function drawGraph(){


    let canvas =
    document.getElementById(
        "valueGraph"
    );


    if(!canvas)
    return;



    let labels =
    valueHistory.map(
        x=>"Turn "+x.turn
    );



    let datasets=[];



    players.forEach((player,index)=>{


        let values =
        valueHistory.map(
            x=>x.players[player.name] || 0
        );


        datasets.push({

            label:player.name,

            data:values,

            borderWidth:3,

            tension:0.3

        });


    });





    if(valueChart){

        valueChart.destroy();

    }




    valueChart =
    new Chart(canvas, {


        type:"line",


        data:{


            labels:labels,


            datasets:datasets


        },


        options:{


            responsive:true,


            plugins:{


                legend:{


                    position:"bottom"


                }


            },


            scales:{


                y:{


                    beginAtZero:false


                }


            }


        }


    });


}






// Save graph data


function saveGraph(){


localStorage.setItem(

"monopolyGraph",

JSON.stringify(valueHistory)

);


}





function loadGraph(){


let data =
localStorage.getItem(
"monopolyGraph"
);



if(data){


valueHistory =
JSON.parse(data);


}


}
