"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value) {
      res.json({ error: "Required field(s) missing" });
      return;
    }
    const row = coordinate[0];
    const column = coordinate[1];
    
    if (
      coordinate.length !== 2 ||
      !/[a-i]/i.test(row) ||
      !/[1-9]/i.test(column)
    ) {
      console.log("invalid coordinate :>> ");
      res.json({ error: "Invalid coordinate" });
      return;
    }
    if (!/[1-9]/i.test(value)) {
      res.json({ error: "Invalid value" });
      return;
    }
    if (isNaN(value) || value < 1 || value > 9) {
      res.json({ error: "Invalid value" });
      return;
    }
    
    if (puzzle.length != 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (/[^0-9.]/g.test(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }
        // New check for the validity of the submitted value
        if (parseInt(value) < 1 || parseInt(value) > 9) {
          res.json({ error: "Invalid value" });
          return;
        }
        const grid = solver.transform(puzzle);
        const rowIdx = row.charCodeAt(0) - 'A'.charCodeAt(0);
        const colIdx = parseInt(column) - 1;
        const cellValue = grid[rowIdx][colIdx];
        if (cellValue != 0 && cellValue == value) {
            res.json({ valid: true });
            return;
        }
           
    let validCol = solver.checkColPlacement(puzzle, row, column, value);
    let validReg = solver.checkRegionPlacement(puzzle, row, column, value);
    let validRow = solver.checkRowPlacement(puzzle, row, column, value);
    let conflicts = [];
    if (validCol && validReg && validRow) {
      res.json({ valid: true });
    } else {
      if (!validRow) {
        conflicts.push("row");
      }
      if (!validCol) {
        conflicts.push("column");
      }
      if (!validReg) {
        conflicts.push("region");
      }
      res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      res.json({ error: "Required field missing" });
      return;
    }
    if (puzzle.length != 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (/[^0-9.]/g.test(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }
    let solvedString = solver.solve(puzzle);
    if (!solvedString) {
      res.json({ error: "Puzzle cannot be solved" });
    } else {
      res.json({ solution: solvedString });
    }
  });
};