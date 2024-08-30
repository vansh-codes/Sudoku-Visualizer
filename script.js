// --------------- ================ SUDOKU LOGIC ================ ----------------
const liAroundSpeedDropdownMenu = document.querySelector("#nav-bar").children[1].children[3];
const solve = document.querySelector("#solve");
const clear = document.querySelector("#clear");
const generateBoard = document.querySelector("#generate-board");
const grid = document.querySelector("#grid");
const inputs = document.getElementsByTagName("input");
let soundPlayed = false;

// START Dropdown menu
const speedDropDown = document.querySelector("span.selected");
const speedOptions = document.querySelectorAll(".speed-options");
// Function to handle which speed is chosen
function handleSpeedOptionClick(event) {
    const selectedValue = event.target.innerHTML;
    speedDropDown.innerHTML = selectedValue;
}

// Adding click event listener to each option
speedOptions.forEach(option => {
    option.addEventListener("click", handleSpeedOptionClick);
});


// CONSTANT SPEED (The lower the faster. It actually is the time lapse between 2 animation)
const FAST_SPEED = 0.4;
const MEDIUM_SPEED = 10;
const SLOW_SPEED = 65;

var backtrackingCountToPreventHanging = 0;
var backtrackingDuration = 1;
var backtrackingTimeCount = 0;
var timeOutIDSameForAnyAnimation = 0;

// Add eventListener to navbar buttons
clear.addEventListener("click", clickedClear);
generateBoard.addEventListener("click", clickedGenerateBoard);
solve.addEventListener("click", clickedSolve);

// This function clears all timeouts, animation colors and allow to press Solve and Speed again
function clickedClear(e) {
    clearAllTimeOuts();
    clearAllColors();
    setAllowSolveSpeedAndAlgorithms();
    clear.textContent = "Clear";
    speedDropDown.innerHTML = "Speed";
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            grid.rows[i].cells[j].firstChild.value = "";
        }
    }
    soundPlayed = false;
}

// Resets the generated board to display a new one
function generateBoardReset() {
    clearAllTimeOuts();
    clearAllColors();
    setAllowSolveSpeedAndAlgorithms();
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            grid.rows[i].cells[j].firstChild.value = "";
        }
    }
}

// This function delete all timeOuts (animations)
function clearAllTimeOuts() {
    while (timeOutIDSameForAnyAnimation >= 0) {
        clearTimeout(timeOutIDSameForAnyAnimation);
        timeOutIDSameForAnyAnimation--;
    }
}

// Clear all colors from animations
function clearAllColors() {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove("active");
        inputs[i].classList.remove("succeeded");
        inputs[i].classList.remove("invalid");
    }
}

// Allow to click solve, choose speed and algorithms again
function setAllowSolveSpeedAndAlgorithms() {
    solve.setAttribute("style", "cursor: pointer"); // Allow to click solve button
    solve.addEventListener("click", clickedSolve); // Add back eventListener for solve button
    clear.textContent = "Clear";
    clear.style.backgroundColor = "";
    clear.removeAttribute("title");
    soundPlayed = false;

    solve.setAttribute("style", "cursor: pointer");
    generateBoard.setAttribute("style", "cursor: pointer");
    liAroundSpeedDropdownMenu.setAttribute("style", "cursor: pointer"); // enable dropdown (pointerEvent)
}

// Not allow to click solve, choose speed and algorithms
function setNotAllowSolveSpeedAndAlgorithms() {
    // solve.style.backgroundColor = "red";    // Turn solve button to red
    clear.textContent = "Stop & Clear";
    clear.setAttribute("title", "Sudoku solving is in process.");

    solve.style.cursor = "not-allowed";
    solve.removeEventListener("click", clickedSolve); // Remove any function when click

    solve.setAttribute("style", "pointer-events: none");
    generateBoard.setAttribute("style", "pointer-events: none");
    liAroundSpeedDropdownMenu.setAttribute("style", "pointer-events: none"); // Cannot click Speed menu
}

// This function is called when we click the "Generate Board" button
function clickedGenerateBoard(e) {
    generateBoardReset(); // Clear the board first
    fill80Succeed20NotSure();
}

// Fill the board with 80% probability that we will have a solution and 20% truly random
function fill80Succeed20NotSure() {
    let sudokuMatrix;
    if (Math.random() < 0.8) {
        // 80% guaranttee solution
        hasSolutionMatrix = [
            [8, 2, 5, 1, 9, 7, 3, 4, 6],
            [6, 1, 7, 3, 4, 2, 9, 5, 8],
            [4, 3, 9, 6, 8, 5, 7, 1, 2],
            [1, 9, 6, 5, 3, 8, 2, 7, 4],
            [2, 8, 3, 7, 6, 4, 5, 9, 1],
            [5, 7, 4, 9, 2, 1, 8, 6, 3],
            [7, 6, 1, 2, 5, 3, 4, 8, 9],
            [9, 4, 2, 8, 7, 6, 1, 3, 5],
            [3, 5, 8, 4, 1, 9, 6, 2, 7],
        ];
        sudokuMatrix = mixSudokuQuiz(hasSolutionMatrix);
    } // The rest 20% Just randomly fill
    else {
        sudokuMatrix = generateRandomBoard(); // This is random
        // //printBoardOnWeb(matrix);
    }
    printBoardOnWeb(sudokuMatrix);
}

// This function randomly swaps rows and columns of a sudoku board with a specific rule
// Rule: If a sudoku board has a solution, if we swap 2 rows (or 2 columns)  within the same
// 3x9 (or 9x3) "rectangle", our sudoku will preserve its solvability
function mixSudokuQuiz(matrix) {
    let numEntries = 20 + Math.floor(Math.random() * 8); // Number of entries to be kept
    mixRowsAndColumns(matrix); // Mix board
    keepSomeEntries(matrix, numEntries); // Keep some random Entries
    return matrix;
}

// This function randomly swaps different rows (or columns) with the "appropriate" rows(or columns)
function mixRowsAndColumns(matrix) {
    const numSwaps = Math.floor(Math.random() * 15) + 1;
    for (let i = 0; i < numSwaps; i++) {
        const isRowSwap = Math.random() < 0.5;
        const [index1, index2] = getRandomIndices();
        if (isRowSwap) {
            swap(matrix, index1, index2, true);
        } else {
            swap(matrix, index1, index2, false);
        }
    }
}

// Get 2 random indices
function getRandomIndices() {
    const index1 = Math.floor(Math.random() * 9);
    const index2 = Math.floor(index1 / 3) * 3 + Math.floor(Math.random() * 3);
    return [index1, index2];
}

// Swap 2 rows or 2 columns
function swap(matrix, index1, index2, isRow) {
    if (isRow) {
        for (let i = 0; i < 9; i++) {
            [matrix[index1][i], matrix[index2][i]] = [matrix[index2][i], matrix[index1][i]];
        }
    } else {
        for (let i = 0; i < 9; i++) {
            [matrix[i][index1], matrix[i][index2]] = [matrix[i][index2], matrix[i][index1]];
        }
    }
}

// Randomly keep some entries out of a full sudoku board
function keepSomeEntries(matrix, numEntriesKeep) {
    const numEntriesDelete = 81 - numEntriesKeep;
    let entriesToDelete = numEntriesDelete;
    while (entriesToDelete > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (matrix[row][col] !== 0) {
            matrix[row][col] = 0;
            entriesToDelete--;
        }
    }
}

// This function actually generate a random board
function generateRandomBoard() {
    let numFill = 20 + Math.floor(Math.random() * 8);
    let matrix = new Array(9);

    for (let i = 0; i < 9; i++) {
        matrix[i] = new Array(9);
        for (let j = 0; j < 9; j++) {
            matrix[i][j] = "";
        }
    }

    while (true) {
        if (numFill === 0) break;
        let i = Math.floor(Math.random() * 9);
        let j = Math.floor(Math.random() * 9);
        if (matrix[i][j] == "") {
            matrix[i][j] = Math.floor(Math.random() * 9) + 1;
            if (canBeCorrect(matrix, i, j)) numFill--;
            else matrix[i][j] = "";
        }
    }
    return matrix;
}

// This function is called when we click the "Solve" button
// It will call the proper algorithms, and using the proper speed
// By default, it will use Backtracking at Medium Speed
function clickedSolve(e) {
    // Verify input first
    if (verifyInput() == false) {
        for (let i = 0; i < 81; i++) {
            inputs[i].addEventListener("click", function () {
                inputs[i].style.border = "";
                inputs[i].classList.remove("shake");
            });
        }
        return;
    }

    if (speedDropDown.innerHTML === "Speed"){
        speedDropDown.innerHTML = "Medium";         // Set to medium
        showToast("Speed is set to Medium by default.", "info", 2000);
    }        // If haven't set speed

    solveByBacktracking();
}

// This function is called when we click the "Solve" button
function solveByBacktracking() {
    backtrackingCountToPreventHanging = 0;
    setNotAllowSolveSpeedAndAlgorithms(); // Disable some buttons
    let matrix = readValue(); // Read values from web board

    backtracking(matrix); // Solving sudoku

    let timeAfterAllDone = ++backtrackingTimeCount * backtrackingDuration;

    if (allBoardNonZero(matrix)) {
        // If We actually have a solution
            succeededNormalAnimation(backtrackingTimeCount, backtrackingDuration);
    } else {
        timeOutIDSameForAnyAnimation = setTimeout(alertNoSolution, timeAfterAllDone);
        timeOutIDSameForAnyAnimation = setTimeout(setAllowSolveSpeedAndAlgorithms, timeAfterAllDone);
    }
}

const SPEEDS = {
    Fast: FAST_SPEED,
    Medium: MEDIUM_SPEED,
    Slow: SLOW_SPEED
};

// This function is the main function for backtracking algorithm
function backtracking(matrix) {
    // Setting Speed
    backtrackingDuration = SPEEDS[speedDropDown.innerHTML] || MEDIUM_SPEED;

    backtrackingTimeCount = 0; // Time count for scheduling animation

    // Find out which entries are user input (isFixed===true), which are empty (isFixed===false)
    let isFixed = createFixedMatrix(matrix);
    let data = { cont: true };
    backtrackingHelper(matrix, isFixed, 0, 0, data);
}

// Create a matrix of boolean values to indicate which cells are fixed
function createFixedMatrix(matrix) {
    return matrix.map(row => row.map(cell => cell !== 0));
}

// This function is the helper function for backtracking algorithm
function backtrackingHelper(matrix, isFixed, row, col, data) {
    // If !data.cont or having our current entry at (row, col) lead to a clearly invalid sudoku board
    if (!data.cont || !canBeCorrect(matrix, row, col))     // 1st stopping point
        return;

    // Backtracking is a naive solution.
    backtrackingCountToPreventHanging++;

    if (backtrackingCountToPreventHanging > 100000) {   // Runs for too long without a solution
        data.cont = false; // Set the flag so that the rest of the recursive calls can stop at "stopping points"
        stopSolveSudokuBacktracking(); // Stop the program
        return;
    }

    if (row === 8 && col === 8) {
        // If reach the last entry
        if (isFixed[row][col]) {
            // The last entry is user input
            if (canBeCorrect(matrix, row, col)) {
                // And it doesn't create an invalid board
                data.cont = false; // Yesss!! Found the solution!
            }
            return;
        } // If it is not user input
        else {
            for (let i = 1; i <= 9; i++) {
                matrix[row][col] = i; // Try 1-9
                timeOutIDSameForAnyAnimation = setTimeout(() => fillCell(row,col,i), backtrackingTimeCount++ * backtrackingDuration);
                if (canBeCorrect(matrix, row, col)) {
                    data.cont = false;  // If found the solution
                    return;
                }
            }
            timeOutIDSameForAnyAnimation = setTimeout(() => emptyCell(row,col), backtrackingTimeCount++ * backtrackingDuration);
            matrix[row][col] = 0; // Otherwise, backtrack, reset the current entry to 0
        }
    }

    // Compute newRow and new Column coressponding to currentAlgorithm
    // Fill from left to right, from top to bottom
    let newRow = col === 8 ? row + 1 : row;
    let newCol = col === 8 ? 0 : col + 1;

    // If this entry is user input and is valid
    if (isFixed[row][col] && canBeCorrect(matrix, row, col)) {
        backtrackingHelper(matrix, isFixed, newRow, newCol, data); // Continue next entry
    }
    // If it is empty
    else {
        for (let i = 1; i <= 9; i++) {
            if (data.cont === false)
                return;     // Stopping entry 2
            timeOutIDSameForAnyAnimation = setTimeout(() => fillCell(row,col,i), backtrackingTimeCount++ * backtrackingDuration);
            matrix[row][col] = i; // Try 1-9

            if (canBeCorrect(matrix, row, col)) {   // If any of those values (1-9) can be valid
                backtrackingHelper(matrix, isFixed, newRow, newCol, data); // recursively move on to the next cell
            }
        }
        if (data.cont === false)
            return;     // Stopping entry 3
        timeOutIDSameForAnyAnimation = setTimeout(() => emptyCell(row,col), backtrackingTimeCount++ * backtrackingDuration);
        matrix[row][col] = 0; // Backtrack, set entry to 0
    }
}

// This function is called when backtracking function is running for too long
// It will stop the function to prevent hanging
function stopSolveSudokuBacktracking() {
    showToast("The program is taking too long to find a solution. It will be terminated to prevent hanging.", "danger");
    clickedClear();
}

// Normal animation when we have found the solution
function succeededNormalAnimation(currentTimeCount, currentDuration) {
    let currentTime = currentTimeCount * currentDuration;
    let succeededDuration = 20;
    let newCount = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            timeOutIDSameForAnyAnimation = setTimeout(colorCell, currentTime + newCount++ * succeededDuration, row, col);
        }
    }

    timeOutIDSameForAnyAnimation = setTimeout(setAllowSolveSpeedAndAlgorithms, currentTime + newCount++ * succeededDuration);
}

// This function is called when we click the "Clear" button
function emptyCell(row, col) {
    inputs[row * 9 + col].classList.remove("active");
    grid.rows[row].cells[col].firstChild.value = "";
}

function fillCell(row, col, val) {
    inputs[row * 9 + col].classList.add("active");
    grid.rows[row].cells[col].firstChild.value = val;
}

function playSound(){
    var succeedSound = new Audio();
    succeedSound.src = "/assets/success.mp3";
    succeedSound.preload = "auto";
    succeedSound.play();
}

const jsConfetti = new JSConfetti();
function colorCell(row, col) {
    if(!soundPlayed){
        soundPlayed = true;
        setTimeout(function(){
            playSound();
            showToast("Sudoku solved successfully!", "success");
        }, 700);
    }
    inputs[row * 9 + col].classList.add("succeeded");
    jsConfetti.addConfetti({
        confettiRadius: 6,
        confettiNumber: 5,
    });
    setTimeout(function () {
        jsConfetti.clearCanvas();
    }, 50 * 100); // to avoid system crash due to large amount of confetti
}

function canBeCorrect(matrix, row, col) {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (matrix[row][col] !== 0 && col !== c && matrix[row][col] === matrix[row][c])
            return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
        if (matrix[row][col] !== 0 && row !== r && matrix[row][col] === matrix[r][col])
            return false;
    }

    // Check 3x3 square
    let r = Math.floor(row / 3);
    let c = Math.floor(col / 3);
    for (let i = r * 3; i < r * 3 + 3; i++) {
        for (let j = c * 3; j < c * 3 + 3; j++) {
            if ((row !== i || col !== j) && matrix[i][j] !== 0 && matrix[i][j] === matrix[row][col])
                return false;
        }
    }

    return true;
}

function allBoardNonZero(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    return true;
}

// Read value from web board to 2d array
function readValue() {
    let matrix = new Array(9);
    for (let i = 0; i < 9; i++) {
        matrix[i] = new Array(9);
        for (let j = 0; j < 9; j++) {
            val = grid.rows[i].cells[j].firstChild.value;
            matrix[i][j] = val === "" ? 0 : parseInt(val);
        }
    }
    return matrix;
}

// See if the input is valid
function verifyInput() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let val = grid.rows[i].cells[j].firstChild.value;
            if ((val != "" && Number.isNaN(parseInt(val))) || 0 >= parseInt(val) || 9 < parseInt(val)) {
                inputs[i * 9 + j].style.border = "3px solid red";
                inputs[i * 9 + j].classList.add("shake");
                return false;
            }
        }
    }
    return true;
}

function alertNoSolution() {
    showToast("No solution exists for this Sudoku board.", "danger");
}

// Print the board on the web
function printBoardOnWeb(matrix) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (matrix[i][j] == 0) grid.rows[i].cells[j].firstChild.value = "";
            else grid.rows[i].cells[j].firstChild.value = matrix[i][j];
        }
    }
}

function hamburger() {
    const line = document.getElementById("line");
    const navLinks = document.querySelector(".nav-links");

    line.classList.toggle("change");
    navLinks.classList.toggle("active");
}
document.getElementById("line").addEventListener("click", hamburger);

document.addEventListener("DOMContentLoaded", function () {
    // Get some element from html
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');
    const body = document.body;
    
    const icon = {
        light: 'fa-moon',
        dark: 'fa-sun'
    };
    
    // Function to get the current system theme
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        } else {
            return 'no-preference';
        }
    }
    
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
        updateIcon(theme);
    }
    
    function updateIcon(theme) {
        const iconElement = toggleDarkModeButton.querySelector('i');
        iconElement.classList.remove('fa-moon', 'fa-sun');
        iconElement.classList.add(icon[theme]);
    }
    
    // Function to handle system theme change
    function handleSystemThemeChange(event) {
        const newColorScheme = event.matches ? 'dark' : 'light';
        applyTheme(newColorScheme);
        localStorage.setItem('theme', newColorScheme);
    }
    
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = getSystemTheme();
    const initialTheme = savedTheme || (systemTheme === 'no-preference' ? 'light' : systemTheme);
    
    // Apply the initial theme
    applyTheme(initialTheme);
    
    // Set up system theme change listener
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);
    }
    
    document.addEventListener('keydown', function (event) {
        // Check if the 'Q' key is pressed along with the 'Ctrl' key
        if (event.ctrlKey && (event.key === 'q' || event.key === 'Q')) {
            event.preventDefault(); // Prevent the default action (if any)
            toggleTheme(); // Call the function to toggle the theme
        }
    });
    
    // Handle dark mode toggle button click
    function toggleTheme(){
        const isDarkMode = body.classList.toggle('dark');
        const theme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        updateIcon(theme);
    };
    
    toggleDarkModeButton.addEventListener('click', toggleTheme);
    
    const cells = document.querySelectorAll("td input");
    
    cells.forEach((input, index) => {
        input.addEventListener("input", function () {
            const val = input.value;
            if (val === "") {
                input.classList.remove("invalid", "shake");
            } else if (!/^[1-9]$/.test(val)) {
                // Invalid input
                showToast("Incorrect input! Please enter a valid number from 1 to 9", "warning");
                input.classList.add("invalid", "shake");
                setTimeout(() => input.classList.remove("shake"), 500);
            } else {
                // Valid input
                input.classList.remove("invalid", "shake");
                if (index < cells.length - 1) {
                    cells[index + 1].focus();  // Move to the next cell
                }
            }
        });
        
        input.addEventListener("keydown", function (e) {
            const rowLength = 9; // Assuming a 9x9 grid
            switch (e.key) {
                case "Backspace":
                    if (input.value === "" && index > 0) {
                        cells[index - 1].focus();  // Move to the previous cell
                    }
                    break;
                case "ArrowRight":
                    if (index < cells.length - 1) {
                        cells[index + 1].focus();  // Move to the next cell
                    }
                    break;
                case "ArrowLeft":
                    if (index > 0) {
                        cells[index - 1].focus();  // Move to the previous cell
                    }
                    break;
                case "ArrowDown":
                    if (index + rowLength < cells.length) {
                        cells[index + rowLength].focus();  // Move to the cell below
                    }
                    break;
                case "ArrowUp":
                    if (index - rowLength >= 0) {
                        cells[index - rowLength].focus();  // Move to the cell above
                    }
                    break;
            }
        });
    });
    
    const driver = window.driver.js.driver;
    
    const driverObj = driver({
        showProgress: true,
        steps: [
            { popover: { title: 'Welcome', description: 'Quick overview to get you started.' }, skipIfFlagged: true },
            { element: '#generate-board', popover: { title: 'Generate Board', description: 'Create a random Sudoku board.', side: "left", align: 'start' }},
            { element: '#solve', popover: { title: 'Solve', description: 'Click to solve the Sudoku puzzle.', side: "bottom", align: 'start' }},
            { element: '#speed', popover: { title: 'Speed Control', description: 'Adjust solving speed here.', side: "left", align: 'start' }},
            { element: 'td input:first-child', popover: { title: 'Input Numbers', description: 'Enter your numbers directly.', side: "left", align: 'start' }},
            { element: '#clear', popover: { title: 'Clear Board', description: 'Reset the board and settings.', side: "right", align: 'start' }},
            { element: '#toggle-dark-mode', popover: { title: 'Toggle Theme', description: 'Switch between light and dark modes.<br>Tip: <strong>Use Ctrl+q</strong> to easily toggle', side: "top", align: 'start' }},
            { element: '#right-socials', popover: { title: 'Connect', description: 'Follow on GitHub and LinkedIn.', side: "top", align: 'start' }},
            { popover: { title: 'Happy Coding!', description: 'Enjoy solving Sudoku puzzles!' } }
        ]
    });
    
    const tutorialShown = localStorage.getItem('tutorial');
    if (!tutorialShown) {
        driverObj.drive();
        localStorage.setItem('tutorial', 'true');
    }
    
    const startTutorialButton = document.getElementById('tutorial');
    startTutorialButton.addEventListener('click', () => {
        driverObj.drive();
    });
});


// --------------- ================ SUDOKU LOGIC END ================ ----------------

let icon = {
    success:
    '<i class="fa-solid fa-check"></i>',
    danger:
    '<i class="fa-solid fa-circle-exclamation"></i>',
    warning:
    '<i class="fa-solid fa-triangle-exclamation"></i>',
    info:
    '<i class="fa-solid fa-info"></i>',
};

// Function to show toast message
const showToast = (message = "Sample Message", toastType = "info", duration = 5000) => {
    if (!Object.keys(icon).includes(toastType))
        toastType = "info";

    let box = document.createElement("div");
    box.classList.add("toast", `toast-${toastType}`);
    box.innerHTML = ` <div class="toast-content-wrapper">
                      <div class="toast-icon">
                      ${icon[toastType]}
                      </div>
                      <div class="toast-message">${message}</div>
                      <div class="toast-progress"></div>
                      </div>`;
    duration = duration || 5000;
    box.querySelector(".toast-progress").style.animationDuration = `${duration / 1000}s`;

    let toastAlready = document.body.querySelector(".toast");
    if (toastAlready) {
        toastAlready.remove();
    }

    document.body.appendChild(box)
};

// fetch data from github
async function fetchGitHubData() {
    try {
        const response = await fetch('https://api.github.com/users/vansh-codes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null; // Return null if the fetch fails
    }
}

// Populate the GitHub card with data
async function populateGitHubCard() {
    const card = document.getElementById('github-card');
    
    // Show skeleton loader
    card.innerHTML = `
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
    `;

    // Fetch the GitHub data
    const data = await fetchGitHubData();
    if (data) {
        // Populate card with actual data
        card.innerHTML = `
            <img src="${data.avatar_url}" alt="Profile Pic">
            <p><strong>${data.name}</strong></p>
            <!-- <p>${data.bio}</p> -->
            <p><strong>Followers:</strong> ${data.followers}</p>
            <p><strong>Following:</strong> ${data.following}</p>
            <a href="${data.html_url}" target="_blank">View Profile</a>
        `;
    } else {
        // Show an error message if the data fetch fails
        card.innerHTML = `
            <p>Failed to load data. Please try again later.</p>
        `;
    }
}

document.getElementById('github-link').addEventListener('mouseover', populateGitHubCard);

// --------------- ================ ParticleJS Code ================ ----------------

particlesJS("particles-js", {
    particles: {
        number: { value: 6, density: { enable: true, value_area: 800 } },
        color: { value: "#1b1e34" },
        shape: {
            type: "edge",
            stroke: { width: 0, color: "#000" },
            polygon: { nb_sides: 4 },
            image: { src: "img/github.svg", width: 90, height: 90 },
        },
        opacity: {
            value: 0.6,
            random: true,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
        },
        size: {
            value: 160,
            random: false,
            anim: { enable: true, speed: 10, size_min: 30, sync: false },
        },
        line_linked: {
            enable: false,
            distance: 200,
            color: "#ffffff",
            opacity: 1,
            width: 2,
        },
        move: {
            enable: true,
            speed: 8,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 },
        },
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true,
        },
        modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3,
            },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 3},
            remove: { particles_nb: 2 },
        },
    },
    retina_detect: true,
});