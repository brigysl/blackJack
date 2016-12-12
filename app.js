var deck = {
  ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  suits: ["H", "S", "C", "D"],
  cards: [],
  spacer: 0,
  newDeck: function() {
    this.spacer = Math.ceil((Math.random() * 15) + 60);
    this.cards = [];
    for(let k = 0; k < 6; k++){
      for(let i = 0; i < this.ranks.length; i++){
        for(let j = 0; j < this.suits.length; j++){
          this.cards.push(this.ranks[i] + this.suits[j]);
        }
      }
    }
  },
  newCard: function() {
    if(this.cards.length > this.spacer){
      return this.cards.splice(Math.floor(Math.random() * deck.cards.length), 1);
    } else {
      this.newDeck();
      for(let i = 0; i < myCards.hand.length; i++){
        for(let j = 0; j < this.cards.length; j++){
          if(myCards.hand[i] === this.cards[j]){
            this.cards.splice(j, 1);
            break;
          }
        }
      }
      for(let i = 0; i < dealerCards.hand.length; i++){
        for(let j = 0; j < this.cards.length; j++){
          if(dealerCards.hand[i] === this.cards[j]){
            this.cards.splice(j, 1);
            break;
          }
        }
      }
      return this.cards.splice(Math.floor(Math.random() * deck.cards.length), 1);
    }
  }
}

function player(){
  this.hand = [];
  this.drawCard = function(card){
    this.hand.push(card);
  };
  this.score = function(){
    var total = 0;
    var aces = 0;
    for(let i = 0; i < this.hand.length; i++){
      var card = String(this.hand[i]).split("");
      if(isNaN(parseInt(card[0]))){
        if(card[0] === "A"){
          aces++;
          total += 11;
        } else {
          total += 10;
        }
      } else {
        if(card[0] === "1"){
          total += 10;
        } else {
          total += parseInt(card[0]);
        }
      }
      if(total > 21){
        if(aces > 0){
          total -= 10;
          aces--;
        }
      }
    }
    return total;
  };
  this.resetHand = function(){
    this.hand = [];
  };
  this.showAll = function(){
    return this.hand.join(" ");
  }
  this.showOne = function(){
    return this.hand[0]
  }
}

var myCards = new player();
var dealerCards = new player();

var credit = {
  total: 0,
  bet: 0,
  win: 0,
  ask: function(){
    do{
      this.total = parseFloat(prompt("How much do you want to loose? (Min $2)")).toFixed(2);
    }
    while(isNaN(this.total) || this.total < 2);
  },
  askBet: function(){
    do{
      this.bet = parseFloat(prompt("How much do you want to bet? (Min $2, Max $500)")).toFixed(2);
    }
    while(isNaN(this.bet) || parseFloat(this.bet) < 2 || parseFloat(this.bet) > 500 || parseFloat(this.bet) > parseFloat(this.total));
    this.total = parseFloat(this.total) - parseFloat(this.bet);
  },
  winDouble: function(){
    this.win = this.bet * 2;
    this.total = parseFloat(this.win) + parseFloat(this.total);
  },
  winOneNhalf: function(){
    this.win = (this.bet * 1.5).toFixed(2);
    this.total = parseFloat(this.win) + parseFloat(this.total);
  },
  tie: function(){
    this.total = parseFloat(this.total) + parseFloat(this.bet);
  },
  doubleDwn: function(){
    this.total = parseFloat(this.total) - parseFloat(this.bet);
    this.bet = parseFloat(this.bet) * 2;
  }
}

document.getElementById("startBtn").addEventListener("click", function(){
  document.getElementById("hitBtn").style.visibility = "hidden";
  document.getElementById("standBtn").style.visibility = "hidden";
  document.getElementById("doubleD").style.visibility = "hidden";
  document.getElementById("placeBet").style.visibility = "hidden";
  document.getElementById("dealerScore").innerHTML = "";
  credit.ask();
  credit.askBet();
  document.getElementById("startBtn").innerHTML = "Restart";
  document.getElementById("credit").innerHTML = "You have $" + credit.total.toFixed(2) + " left.";
  document.getElementById("bet").innerHTML = "You bet $" + credit.bet;
  myCards.resetHand();
  dealerCards.resetHand();
  deck.newDeck();
  myCards.drawCard(deck.newCard());
  dealerCards.drawCard(deck.newCard());
  myCards.drawCard(deck.newCard());
  dealerCards.drawCard(deck.newCard());
  document.getElementById("yourScore").innerHTML = "Your score is: " + myCards.score();
  document.getElementById("card").innerHTML = "You got: " + myCards.showAll();
  document.getElementById("dealersCard").innerHTML = "Dealer got: " + dealerCards.showOne();
  if(myCards.score() === 21 && dealerCards.score() === 21){
    document.getElementById("standBtn").click();
  } else if(myCards.score() === 21){
    credit.winOneNhalf();
    document.getElementById("credit").innerHTML = "You have $" + credit.total.toFixed(2) + " left.";
    document.getElementById("placeBet").style.visibility = "visible";
    document.getElementById("bet").innerHTML = "You win $" + credit.win;
    document.getElementById("dealerScore").innerHTML = "Dealers score is: " + dealerCards.score();
    document.getElementById("dealersCard").innerHTML = "Dealer got: " + dealerCards.showAll();
  } else if(dealerCards.score() === 21){
    if(credit.total >= 2){
      document.getElementById("placeBet").style.visibility = "visible";
    }
    document.getElementById("bet").innerHTML = "You lost.";
    document.getElementById("dealerScore").innerHTML = "Dealers score is: " + dealerCards.score();
    document.getElementById("dealersCard").innerHTML = "Dealer got: " + dealerCards.showAll();
  } else if(myCards.score() > 8 && myCards.score() < 12 && parseFloat(credit.bet) <= parseFloat(credit.total)){
    document.getElementById("hitBtn").style.visibility = "visible";
    document.getElementById("standBtn").style.visibility = "visible";
    document.getElementById("doubleD").style.visibility = "visible";
  } else {
    document.getElementById("hitBtn").style.visibility = "visible";
    document.getElementById("standBtn").style.visibility = "visible";
  }
})

document.getElementById("hitBtn").addEventListener("click", function(){
  document.getElementById("doubleD").style.visibility = "hidden";
  myCards.drawCard(deck.newCard());
  document.getElementById("yourScore").innerHTML = "Your score is: " + myCards.score();
  if(myCards.score() > 21){
    document.getElementById("hitBtn").style.visibility = "hidden";
    document.getElementById("standBtn").style.visibility = "hidden";
    if(credit.total >= 2){
      document.getElementById("placeBet").style.visibility = "visible";
    }
    document.getElementById("bet").innerHTML = "Bust.";
    document.getElementById("dealerScore").innerHTML = "Dealers score is: " + dealerCards.score();
    document.getElementById("dealersCard").innerHTML = "Dealer got: " + dealerCards.showAll();
  } else if(myCards.score() === 21){
    document.getElementById("standBtn").click();
  }
  document.getElementById("card").innerHTML = "You got: " + myCards.showAll();
})

document.getElementById("standBtn").addEventListener("click", function(){
  document.getElementById("hitBtn").style.visibility = "hidden";
  document.getElementById("standBtn").style.visibility = "hidden";
  document.getElementById("doubleD").style.visibility = "hidden";
  while(dealerCards.score() < 17){
    dealerCards.drawCard(deck.newCard());
  }
  if(myCards.score() === dealerCards.score()){
    credit.tie();
    document.getElementById("credit").innerHTML = "You have $" + credit.total.toFixed(2) + " left.";
    document.getElementById("placeBet").style.visibility = "visible";
    document.getElementById("bet").innerHTML = "It's a tie.";
  } else if(dealerCards.score() > 21  || dealerCards.score() < myCards.score()){
    credit.winDouble();
    document.getElementById("credit").innerHTML = "You have $" + credit.total.toFixed(2) + " left.";
    document.getElementById("placeBet").style.visibility = "visible";
    document.getElementById("bet").innerHTML = "You win $" + credit.win;
  } else {
    document.getElementById("bet").innerHTML = "You lost.";
    if(credit.total >= 2){
      document.getElementById("placeBet").style.visibility = "visible";
    }
  }
  document.getElementById("dealerScore").innerHTML = "Dealers score is: " + dealerCards.score();
  document.getElementById("dealersCard").innerHTML = "Dealer got: " + dealerCards.showAll();
})

document.getElementById("placeBet").addEventListener("click", function(){
  document.getElementById("placeBet").style.visibility = "hidden";
  myCards.resetHand();
  document.getElementById("dealerScore").innerHTML = "";
  dealerCards.resetHand();
  credit.askBet();
  document.getElementById("credit").innerHTML = "You have $" + credit.total.toFixed(2) + " left.";
  document.getElementById("bet").innerHTML = "You bet $" + credit.bet;
  myCards.drawCard(deck.newCard());
  dealerCards.drawCard(deck.newCard());
  myCards.drawCard(deck.newCard());
  dealerCards.drawCard(deck.newCard());
  document.getElementById("yourScore").innerHTML = "Your score is: " + myCards.score();
  document.getElementById("card").innerHTML = "You got: " + myCards.showAll();
  document.getElementById("dealersCard").innerHTML = "Dealer got: " + dealerCards.showOne();
  if(myCards.score() === 21 && dealerCards.score() === 21){
    document.getElementById("standBtn").click();
  } else if(myCards.score() === 21){
    credit.winOneNhalf();
    document.getElementById("credit").innerHTML = "You have $" + credit.total.toFixed(2) + " left.";
    document.getElementById("placeBet").style.visibility = "visible";
    document.getElementById("bet").innerHTML = "You win $" + credit.win;
    document.getElementById("dealerScore").innerHTML = "Dealers score is: " + dealerCards.score();
    document.getElementById("dealersCard").innerHTML = "Dealer got: " + dealerCards.showAll();
  } else if(dealerCards.score() === 21){
    if(credit.total >= 2){
      document.getElementById("placeBet").style.visibility = "visible";
    }
    document.getElementById("bet").innerHTML = "You lost.";
    document.getElementById("dealerScore").innerHTML = "Dealers score is: " + dealerCards.score();
    document.getElementById("dealersCard").innerHTML = "Dealer got: " + dealerCards.showAll();
  } else if(myCards.score() > 8 && myCards.score() < 12 && parseFloat(credit.bet) <= parseFloat(credit.total)){
    document.getElementById("hitBtn").style.visibility = "visible";
    document.getElementById("standBtn").style.visibility = "visible";
    document.getElementById("doubleD").style.visibility = "visible";
  } else {
    document.getElementById("hitBtn").style.visibility = "visible";
    document.getElementById("standBtn").style.visibility = "visible";
  }
})

document.getElementById("doubleD").addEventListener("click", function(){
  myCards.drawCard(deck.newCard());
  credit.doubleDwn();
  document.getElementById("credit").innerHTML = "You have $" + credit.total.toFixed(2) + " left.";
  document.getElementById("yourScore").innerHTML = "Your score is: " + myCards.score();
  document.getElementById("card").innerHTML = "You got: " + myCards.showAll();
  document.getElementById("standBtn").click();
})






















