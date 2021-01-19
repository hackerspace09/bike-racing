class Game {
  constructor(){
      this.winner = createElement("h3");
  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    bike1 = createSprite(100,200);
    bike1.addImage("bike1",bike1_img);
    bike1.scale = 0.5
    bike2 = createSprite(300,200);
    bike2.addImage("bike2",bike2_img);
    bike2.scale = 0.2
    bike3 = createSprite(500,200);
    bike3.addImage("bike3",bike3_img);
    bike3.scale = 0.45
    bike4 = createSprite(700,200);
    bike4.addImage("bike4",bike4_img);
    bike4.scale = 0.4
    bikes = [bike1, bike2,bike3, bike4];
  }

  play(){
    form.hide();

    Player.getPlayerInfo();
    
    if(allPlayers !== undefined){
      background(ground);

      image(track,0,-displayHeight*4,displayWidth,displayHeight*5);
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the Bikes
      var x = 215;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the bikes a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the bikes in y direction
        y = displayHeight - allPlayers[plr].distance;
        bikes[index-1].x = x;
        bikes[index-1].y = y;

        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60)
          bikes[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = bikes[index-1].y
        }
       
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    player.getBikesAtEnd();

    if(player.distance>4200){
      gameState = 2
      player.rank = player.rank+1;
      player.update()
      Player.updateBikesAtEnd(player.rank)
    }
    drawSprites();
  }
  
  end(){
    this.winner.html("WINNER "+player.rank)
    this.winner.position(displayWidth/2-70,displayHeight/4)
    console.log("game ended")
    console.log(player.rank);
  }

  displayRanks(){
    //display the medals 
    camera.position.y = 0; 
    camera.position.x = 0; 
    
    imageMode(CENTER); 
    
    Player.getPlayerInfo(); 
    
    //image (img,x,y,width,height)
    image(bronzeImg, displayWidth/-4, -100 + displayHeight/9, 200, 240); 
    image(silverImg, displayWidth/4, -100 + displayHeight/10, 225, 270); 
    image(goldImg, 0, -100, 250, 300); 
    
    textAlign(CENTER); 
    textSize(50); 
    
    for(var plr in allPlayers){ 
      if(allPlayers[plr].rank === 1){ 
        text("1st: " + allPlayers[plr].name, 0, 85); 
      }
      else if(allPlayers[plr].rank === 2){ 
        text("2nd: " + allPlayers[plr].name, displayWidth/4, displayHeight/9 + 73); 
      }
      else if(allPlayers[plr].rank === 3){ 
        text("3rd: " + allPlayers[plr].name, displayWidth/-4, displayHeight/10 + 76); 
      }
      else{ 
        textSize(30); 
        text("Honorable Mention: " + allPlayers[plr].name, 0, 225); 
      } 
    }

  }
}
