class SudokuSolver {
  validate(puzzleString) {
    // Check puzzle string length
    if (puzzleString.length !== 81) {
      return "Invalid puzzle length";
    }
  
    // Check for valid characters
    if (/[^0-9.]/g.test(puzzleString)) {
      return "Invalid characters in puzzle";
    }
  
    // Convert puzzle string to a 2D array
    const grid = this.transform(puzzleString);
  
    // Check for duplicates in rows and columns
    for (let i = 0; i < 9; i++) {
      const rowSet = new Set();
      const colSet = new Set();
      for (let j = 0; j < 9; j++) {
        const cellValue = grid[i][j];
        if (cellValue !== 0) {
          if (rowSet.has(cellValue) || colSet.has(cellValue)) {
            return "Duplicate values in row or column";
          }
          rowSet.add(cellValue);
          colSet.add(cellValue);
        }
      }
    }
  
    // Check for duplicates in sub-grids
    for (let rowStart = 0; rowStart < 7; rowStart += 3) {
      for (let colStart = 0; colStart < 7; colStart += 3) {
        const subGridSet = new Set();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const cellValue = grid[rowStart + i][colStart + j];
            if (cellValue !== 0 && subGridSet.has(cellValue)) {
              return "Duplicate values in sub-grid";
            }
            subGridSet.add(cellValue);
          }
        }
      }
    }
  
    // If all checks pass, return "Valid"
    return "Valid";
  }
  

  letterToNumber(row) {
    switch (row.toUpperCase()) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      case "G":
        return 7;
      case "H":
        return 8;
      case "I":
        return 9;
      default:
        return "none";
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);
    
    for (let i = 0; i < 9; i++) {
      if (grid[row - 1][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);
   
    for (let i = 0; i < 9; i++) {
      if (grid[i][column - 1] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);
    
    let startRow = row - (row % 3),
      startCol = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == value) return false;
    return true;
  }

  solveSuduko(grid, row, col) {
    const N = 9;

    if (row == N - 1 && col == N) return grid;

    if (col == N) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0) return this.solveSuduko(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSuduko(grid, row, col + 1)) return grid;
      }

      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    // Check if we find the same num
    // in the similar row , we
    // return false
    for (let x = 0; x <= 8; x++) if (grid[row][x] == num) return false;

    // Check if we find the same num
    // in the similar column ,
    // we return false
    for (let x = 0; x <= 8; x++) if (grid[x][col] == num) return false;

    // Check if we find the same num
    // in the particular 3*3
    // matrix, we return false
    let startRow = row - (row % 3),
      startCol = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num) return false;

    return true;
  }

  transform(puzzleString) {
    // take ..53..23.23. => [[0,0,5,3,0,0,2,3,0],
    // [2,3,0]
    let grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    let row = -1;
    let col = 0;
    for (let i = 0; i < puzzleString.length; i++) {
      if (i % 9 == 0) {
        row++;
      }
      if (col % 9 == 0) {
        col = 0;
      }

      grid[row][col] = puzzleString[i] === "." ? 0 : +puzzleString[i];
      col++;
    }
    return grid;
  }
  complete(puzzleString) {
    if (this.validate(puzzleString) !== "Valid") {
      return false;
    }
    const board = this.stringtoBoard(puzzleString);
    const solvedBoard = this.solveSuduko(board);
    if (!solvedBoard)  return false;
    return solvedBoard.flat().join("");
    }

  transformBack(grid) {
    return grid.flat().join("");
  }

  solve(puzzleString) {
    if (puzzleString.length != 81) {
      return false;
    }
    if (/[^0-9.]/g.test(puzzleString)) {
      return false;
    }
    let grid = this.transform(puzzleString);
     // Validate input value before checking placement
    for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      let cellValue = grid[row][col];
      if (cellValue !== 0 && (isNaN(cellValue) || cellValue < 1 || cellValue > 9)) {
        return false; 
      }
     }
   } 

    let solved = this.solveSuduko(grid, 0, 0);
    if (!solved) {
      return false;
    }
    let solvedString = this.transformBack(solved);
    console.log("solvedString :>> ", solvedString);
    return solvedString;
}
}
module.exports = SudokuSolver;