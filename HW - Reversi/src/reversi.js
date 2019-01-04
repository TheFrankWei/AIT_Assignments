// reversi.js
const rev = { 
    repeat: function(value, n) {
        let repeated = Array(n);
        for (let i = 0; i < repeated.length; i++){
        	repeated[i] = value;
        }
        return repeated;
    },
    
    generateBoard: function(rows, columns, initialCellValue) {
        // implementation
        
        let squares = rows*columns;
        return  rev.repeat(initialCellValue,squares);
    },

    rowColToIndex: function(board, rowNumber, columnNumber) {
    	return rowNumber*Math.sqrt(board.length) + columnNumber;
    	
    },
    
    indexToRowCol: function(board,i){
    	let space = new Object();
    		space.row = Math.floor(i/Math.sqrt(board.length));
    		space.col = i-(Math.sqrt(board.length)*(space.row));
    	return {row:space.row, col:space.col};
    },

    setBoardCell: function(board, letter, row, col){
    	let copiedBoard = board.slice();
    	let index = rev.rowColToIndex(board,row,col);
    	copiedBoard[index] = letter;
    	return copiedBoard;
    },

    algebraicToRowCol: function(algebraicNotation){
    	function isLetter(c){
    		return c.toLowerCase () !== c.toUpperCase ();
    	};
    	if(algebraicNotation===undefined){
    		return undefined;
 		}
 		let letter, number;
  		if (algebraicNotation.length === 2) {
    	if (isLetter (algebraicNotation.charAt())===false) {
     		return undefined;
    	}
    	if (isNaN (algebraicNotation.charAt(1))) return undefined;
    	letter = algebraicNotation.charAt();
    	number = algebraicNotation.charAt(1);
    	number = parseInt (number);
  		} else if (algebraicNotation.length === 3) {
    	if (isLetter (algebraicNotation.charAt())===false) {
      		return undefined;
    	}
    	letter = algebraicNotation.charAt();
    	number = algebraicNotation.charAt(1);
    	for (let i=0; i<number.length; i++) {
      		if (isNaN (number[i]) || number[i]===' ') {
        	return undefined;
      		}
    	}
    	number = number.join ('');
    	number = parseInt (number);
  	} else {
    	return undefined;
  	}

    const letterToNumber =  {'A': 0, 'B': 1, 'C':2, 'D':3, 'E':4, 'F':5, 'G':6, 'H':7, 'I':8, 'J':9, 'K':10, 'L':11, 'M':12, 'N':13, 'O':14, 'P':15,
    'Q':16, 'R':17, 'S':18, 'T':20, 'U':21, 'V':22, 'X':23, 'Y':24, 'Z':25};
  	let column = letterToNumber[letter];
  	let row = number-1;
  	return  {'row': row, 'col': column};
    },

    placeLetters: function(board, letter, algebraicNotation){
    	let copiedBoard = board.slice();
    	for (let i=2; i<arguments.length; i++){
    		let rowCol = rev.algebraicToRowCol(arguments[i]);
    		let index = rev.rowColToIndex(board,rowCol['row'],rowCol['col']);
    		copiedBoard[index] = letter;
    	}
    	return copiedBoard;
    },

    boardToString: function(board){
    	let boardLength = Math.sqrt(board.length);
  		let line = '';
  		for (let i=0; i<2* (boardLength+1); i++) {
    	for (let j = 0; j<boardLength+1; j++) {
      	if ( (i%2)===0) {
        	if (i===0) {
          	if (j===0) {
            	line+= '   ';
          	} else if (j===boardLength) {
            	line += '  ' + String.fromCharCode (65+j-1) + '  ';
          	}  else  {
            	line += '  '+ String.fromCharCode (65+j-1)+ ' ';
          	}	
        	}  else  {
          	if (j===0) {
            	line += ' ' + Math.floor (i/2)+ ' |';
          	}  else  {
            	const index = rev.rowColToIndex (board, Math.floor (i/2)-1, j-1);
            	const cell = board[index];
            if (cell!== ' ') {
            	line+= ' '+ cell+ ' |';
            } else {
            	line+= '   |';
            }
          	}
        	}
      	} else {
        	if (j===0) {
          		line+= '   +';
        	} else {
          		line+= '---+';
        	}
      		}
    		}
    		line+= '\n';
  		}
  		return line;
    },

    isBoardFull: function(board){
    	let isFull = true;
    	for(let i=0; i< board.length; i++){
    		if (board[i] === " "){
    			isFull = false;
    		} 

    	}
    	return isFull;
    },

    flip: function(board,row,col){
    	let index = rev.rowColToIndex(board,row,col);
    	if (board[index] === 'X'){
    		board[index] = 'O';
    	} else if (board[index] === 'O'){
    		board[index] = 'X';
    	}
    	return board;
    },

    flipCells: function(board, cellsToFlip){
    	for(let i=0; i <cellsToFlip.length; i++){
    		for(let j=0; j<cellsToFlip[i].length;j++){
    			rev.flip(board, cellsToFlip[i][j][0], cellsToFlip[i][j][1]);
    		}

    	}
    	return board;

    },

    getCellsToFlip: function(board, lastRow, lastCol){
  		function searchMoves(direction, opponentLetter){
  			let increment = 0;
  			let finished = false;
  			let answers = [];
  			let nextRow = lastRow;
  			let nextCol = lastCol;
  			while (!finished){
  				increment +=1;
  				nextRow = lastRow;
  				nextCol = lastCol;
  				switch (direction){
  					case 'North':
  						nextRow -= increment;
  						nextCol = lastCol;
  						break;
  					case 'NorthWest':
  						nextRow -= increment;
  						nextCol -= increment;
  						break;
  					case 'West':
  						nextRow = lastRow;
  						nextCol -= increment;
  						break;
  					case 'NorthEast':
  						nextRow -= increment;
  						nextCol += increment;
  						break;
  					case 'East':
  						nextRow = lastRow;
  						nextCol += increment;
  						break;
  					case 'South':
  						nextRow += increment;
  						nextCol = lastCol;
  						break;
  					case 'SouthWest':
  						nextRow += increment;
  						nextCol -= increment;
  						break;
  					case 'SouthEast':
  						nextRow += increment;
  						nextCol += increment;
  						break;
  				}

       			let valid = true;
  				let size = Math.sqrt(board.length);
  				if (nextRow >= size) valid= false;
  				if (nextCol >= size) valid= false;
  				if (nextRow < 0) valid= false;
  				if (nextCol < 0) valid= false;

  				if (!valid){
  					return [];
  				}
  				if (!valid){
  					return [];
  				}

  				let nextIndex = rev.rowColToIndex(board, nextRow, nextCol);
  				if (board[nextIndex] === " "){
  					return [];
  				}	

  				if(board[nextIndex] !== opponentLetter){
  					finished = true;
  				};

  				if (board[nextIndex] === opponentLetter){
  					answers.push([nextRow, nextCol]);
  				}
  			}
  			return answers;
  		}

  		const index = rev.rowColToIndex(board, lastRow, lastCol);
  		const letter = board[index];

  		let oppLetter = 'X';
  		if (letter === 'X'){
  			oppLetter = 'O';
  		}
  		let dirArray = ['North', 'NorthWest', 'West', 'NorthEast', 'East', 'South', 'SouthWest', 'SouthEast'];
  		let cellsToFlip = [];

  		for (let i = 0; i < dirArray.length; i++){
  			let direction = dirArray[i];
  			let result = searchMoves(direction, oppLetter);
  			if (result.length !== 0){
  				cellsToFlip.push(result);
  			}
  		}
  		return cellsToFlip;
    },

    isValidMove: function(board, letter, row, col){

    	let index = rev.rowColToIndex(board, row, col);
    	let cell = board[index];
    	let availableMoves;
    	if (cell === ' '){
    		board[index] = letter;
    		availableMoves = rev.getCellsToFlip(board, row, col);
    		board[index]=' ';
    		if (availableMoves.length > 0){
    			return true;
    		} return false;
 		} else {
 			return false;
 		}
    },

    isValidMoveAlgebraicNotation: function(board, letter, algebraicNotation){
    	let rowCol = rev.algebraicToRowCol(algebraicNotation);
    	if (rowCol === undefined){
    		return false;
    	}
    	return rev.isValidMove (board, letter, rowCol['row'], rowCol['col']);
    },

    getLetterCounts: function(board){
    	let count = new Object();
    		count.x = 0;
    		count.o = 0;
    	for (let i=0; i< board.length; i++){
    		if(board[i]==='X'){
    			count.x++;
    		} else if (board[i]==='O'){
    			count.o++;
    		}
    	}
    	return{X: count.x, O: count.o};
    },

    getValidMoves(board,letter){
    	let moves = [];
    	for (let i = 0; i < board. length; i++){
    		if (board[i] === ' '){
    			let index = rev.indexToRowCol(board,i);
    			if (rev.isValidMove(board, letter, index['row'], index['col'])){
    				moves.push ([index['row'], index['col']]);
    			}
    		}   else continue;
    	}
    	return moves;
    },
}
    
module.exports = rev;