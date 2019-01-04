// app.js
/* eslint semi: "off" */
const rev = require('./reversi.js');
const readlineSync = require('readline-sync');
const fs = require('fs');

let settings;
let boardSize;
let on = true;
let board;
let response;
let passCount = 0;
let humanTurn = true;
let pLetter;
let compLetter;


console.log('Welcome to Othello!\n');

while(on){
  let choice = readlineSync.question('Please choose a mode: \n 1) Configuration File \n 2) Set up your own Game \n>')
  if(choice === "1"){
    if(process.argv[2]!==undefined){
      fs.readFile(process.argv[2], 'utf8', function(err, data) {
       if (err) {
        console.log('there\'s an error', err);
       } else {
         let settings = JSON.parse(data);
         let pLetter = settings['boardPreset']['playerLetter'];
         let board = settings['boardPreset']['board'];
         let computerMoves = settings["scriptedMoves"]["computer"];
         let playerMoves = settings["scriptedMoves"]["player"];
         let compLetter;
         console.log("These are the player moves: "+ playerMoves);
         console.log("These are the computer moves: " + computerMoves);
         if(pLetter === "X"){
           compLetter = "O";
         }else{
           compLetter = "X";
         }

         if(pLetter === "X"){
           humanTurn = true;
         }else{
           humanTurn = false;
         }

         while(playerMoves.length > 0 || computerMoves.length >0){
           if(humanTurn){
             readlineSync.question("Press Enter to see player's move");
             if(playerMoves.length>0){
               let curInfo = playerMoves.shift();
               board = rev.placeLetters(board, pLetter, curInfo);

               let info = rev.algebraicToRowCol(curInfo);
               let cellsToFlip = rev.getCellsToFlip(board, info["row"], info["col"]);

               for(let i=0; i<cellsToFlip.length; i++){
                 for(let j = 0; j<cellsToFlip[i].length; j++){
                   rev.flip(board,cellsToFlip[i][j][0], cellsToFlip[i][j][1]);
                 }
               }
              }
              console.log(rev.boardToString(board));
              humanTurn = false;
            }else{  //computer turn
               if(computerMoves.length>0){
                 readlineSync.question("Press Enter to see computer's move");
                 let curInfo = computerMoves.shift();
                 board = rev.placeLetters(board, compLetter, curInfo);
                 let info = rev.algebraicToRowCol(curInfo);
                 let cellsToFlip = rev.getCellsToFlip(board, info["row"], info["col"]);

                 for(let i=0; i<cellsToFlip.length; i++){
                   for(let j = 0; j<cellsToFlip[i].length; j++){
                     rev.flip(board,cellsToFlip[i][j][0], cellsToFlip[i][j][1]);
                    }
                  }
                }
                console.log(rev.boardToString(board));
                humanTurn = true;
              }
            }

          console.log(rev.boardToString(board));
          console.log("Score ");
          console.log("======");
          let count = rev.getLetterCounts(board);
          console.log("X:" + count["X"] + ", " + " O:" + count["O"]);

      }
    });
  }else{
      console.log("file not read");
    }
    on = false;
  }else if(choice === "2"){
    while(boardSize%2 !==0 || (boardSize<4 || boardSize>26) ){
      boardSize = readlineSync.question('How wide should the board be? (Please enter an even integer from 4-26) \n>');
    }

    while(!((pLetter=== "O") || (pLetter === "X"))){
      pLetter = readlineSync.question('Pick your Letter: X (black) or O (White) \n>');
      if(pLetter === "X"){
        compLetter = "O";
      }else{
        compLetter = "X";
      }
    }
    board = rev.generateBoard(boardSize, boardSize, ' ');
  	board[rev.rowColToIndex (board,boardSize/2,boardSize/2)] = 'O';
  	board[rev.rowColToIndex (board, boardSize/2-1, boardSize/2-1)] = 'O';
  	board[rev.rowColToIndex (board, boardSize/2-1, boardSize/2)] = 'X';
  	board[rev.rowColToIndex (board, boardSize/2, boardSize/2-1)] = 'X';


    if(pLetter === "X"){
      humanTurn = true;
    }else{
      humanTurn = false;
    }
    console.log(rev.boardToString(board));
    while(!(rev.isBoardFull(board))){
      if(passCount===2){
        console.log("There has been two consecutive passes so the game is over")
        break;
      }
      if(humanTurn){
        //player turn
        if(rev.getValidMoves(board, pLetter).length >0){
          while(!(rev.isValidMoveAlgebraicNotation(board, pLetter, response))){
            response = readlineSync.question('What is your move? \n>').toUpperCase();

            if(rev.isValidMoveAlgebraicNotation(board, pLetter, response)){
              board = rev.placeLetters(board, pLetter, response);
              passCount = 0;
              let algebraic = rev.algebraicToRowCol(response);
              //let playerMoves = rev.getValidMoves(board,pLetter);
              board[rev.rowColToIndex (board, algebraic[0],algebraic[1])] = pLetter;
              let cellsToFlip = rev.getCellsToFlip(board, algebraic['row'], algebraic['col']);

              for(let i=0; i<cellsToFlip.length; i++){
                for(let j = 0; j<cellsToFlip[i].length; j++){
                  rev.flip(board,cellsToFlip[i][j][0], cellsToFlip[i][j][1]);
                }

              }
              break;

            }else{
            console.log("Invalid Move! Your move should: ");
            console.log("* be in the right format (A7 or D2)");
            console.log("* specify and existing empty cell");
            console.log("* flip at least one of your opponent's pieces");
            }
          }
        }else{
          readlineSync.question("No valid moves available please press <Enter> to show computer move");
          passCount++;
        }
        humanTurn = false;
        readlineSync.question("Please press <Enter> to show computers move");

      } else{
        //computer turn
        if(rev.getValidMoves(board, compLetter).length >0){
          let computerMoves = rev.getValidMoves(board,compLetter);
          board[rev.rowColToIndex (board, computerMoves[0][0],computerMoves[0][1])] = compLetter;
          let cellsToFlip = rev.getCellsToFlip(board, computerMoves[0][0], computerMoves[0][1]);

          for(let i=0; i<cellsToFlip.length; i++){
            for(let j = 0; j<cellsToFlip[i].length; j++){
              rev.flip(board,cellsToFlip[i][j][0], cellsToFlip[i][j][1]);
            }
          }
        
        }else{
          console.log("No available moves for the computer")
          passCount++;
        }
        humanTurn = true;
      }

      response = '';
      console.log(rev.boardToString(board));
      console.log("Score ");
      console.log("======");
      let count = rev.getLetterCounts(board);
      console.log("X:" + count["X"] + ", " + " O:" + count["O"]);

    }
    console.log("Score ");
    console.log("======");
    let count = rev.getLetterCounts(board);
    console.log("X:" + count["X"] + ", " + " O:" + count["O"]);
    if(count["X"]>count["O"]){
      console.log("X (black) Won!");
    }else if(count["X"]<count["O"]){
      console.log("O (white) Won!");
    }else{
      console.log("It's a tie!!")
    }
    on = false;
  }else{
    console.log("Please Choose either option 1 or 2");
  }
}
