<h1 align="center">Sudoku Visualizer</h1>

![Sudoku-Visualizer](https://socialify.git.ci/vansh-codes/Sudoku-Visualizer/image?name=1&owner=1&theme=Dark)

<div align="center">

<img src="https://forthebadge.com/images/badges/built-with-love.svg" height=40px/> <img src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Fvansh-codes%2FSudoku-Visualizer&label=visitors&countColor=%2337d67a&style=for-the-badge&labelStyle=upper" height=40px /> <img src="https://img.shields.io/github/last-commit/vansh-codes/Sudoku-Visualizer?style=for-the-badge" height=40px />
<img src="https://img.shields.io/github/repo-size/vansh-codes/Sudoku-Visualizer?style=for-the-badge" height=40px> <br/> <br/>
<img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" height=30px /> <img src="https://vercelbadge.vercel.app/api/vansh-codes/Sudoku-Visualizer?style=for-the-badge" height=30px />

</div>

<div align="center">
<h2>🎉 Welcome to the Sudoku Solver Visualizer! 🎉 This web-based app lets you visualize the solving process using backtracking. Features include 🔀 random puzzle generation, ⏩ variable solving speeds, and ✨ visual effects to celebrate a solved puzzle. Enjoy a fun and interactive Sudoku-solving experience!</h2>
</div>

## 📍Table of Contents
1. [Features](#Features)
2. [Technology Stack](#Technology-Stack)
3. [Getting Started](#Getting-Started)
4. [Web Application](#Web-Application)
5. [Usage](#Usage)
6. [Code Overview](#Code-Overview)
7. [Contributing](#Contributing)
8. [License](#License)
9. [Contact](#Contact)
10. [Links](#Links)

## ✨Features

- **🔢 Live Input Feedback**: Receive real-time feedback as you input numbers into the Sudoku grid.
- **🎨 Interactive UI**: Engage with an intuitive and visually appealing user interface designed for ease of use.
- **👌 Good UX**: Enjoy a seamless user experience with smooth interactions and clear instructions.
- **⚡ Fast Backtracking Algorithm**: Solve Sudoku puzzles quickly and efficiently using an optimized backtracking algorithm.
- **🌐 Cross-Platform**: Access the Sudoku visualizer on both web and mobile platforms for convenience.
- **🛠️ Customizable Settings**: Tailor the visualization settings to your preferences, including solving speed and difficulty level.
- **📚 Learn Mode**: Understand the backtracking process step-by-step with an educational mode that explains each move when speed set to Xtra slow.

## 💻Technology Stack

![JAVASCRIPT](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS5](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

## Getting Started

### Prerequisites

- Web browser (Google Chrome, Firefox, Safari, etc.)

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/vansh-codes/Sudoku-Visualizer.git
   ```

2. Navigate to the project directory:
   ```bash
   cd sudoku-visualizer
   ```

3. Open `index.html` in your web browser to start using the application.

## 🌐Web Application
1. Access here: [Sudoku-Visualizer](https://sudoku-visualizer.vercel.app/)

## Usage

1. **Clear Board**: Click the "Clear" button to clear the Sudoku board.
2. **Generate Board**: Click the "Generate Board" button to generate a new random Sudoku puzzle.
3. **Solve**: Click the "Solve" button to start solving the puzzle using the selected algorithm and speed.
4. **Select Speed**: Choose the speed of the solving animation from the dropdown menu (Fast, Medium, Slow, Extra Slow).
5. **Select Algorithm**: Choose the algorithm for solving the puzzle from the dropdown menu (currently supports Backtracking).
6. **Enjoy the Visual Effects**: Upon solving the puzzle, enjoy the fireworks effect celebrating your success.

## Code Overview

### HTML Elements

- `subMenu`: Refers to the submenu element inside the navigation bar.
- `speedButton`: Refers to the button for selecting speed inside the navigation bar.
- `speedDropDown`: Holds the current selected speed.
- `speedOptions`: List of all available speed options.
- `confetti`: Configures the confetti for celebrating the solved puzzle.
- `algorithmsDropDown`: Holds the current selected algorithm.
- `algorithmsOptions`: List of all available algorithm options.

### Speed Constants

Defines the different speeds for the solving animation:
- `FAST_SPEED`: 0.4 seconds
- `MEDIUM_SPEED`: 10 seconds
- `SLOW_SPEED`: 50 seconds

### Event Listeners

- `clear.addEventListener('click', clickedClear)`: Clears the board.
- `randomlyFill.addEventListener('click', clickedRandomlyFill)`: Fills the board with a random puzzle.
- `solve.addEventListener('click', clickedSolve)`: Starts solving the puzzle.

### Main Functions

- `clickedClear(e)`: Clears the board and resets the state.
- `clickedRandomlyFill(e)`: Clears the board and fills it with a random puzzle.
- `clickedSolve(e)`: Starts the solving process.
- `solveByBacktracking(algo)`: Solves the puzzle using the Backtracking algorithm.
- `backtracking(matrix, algo)`: Initializes and runs the backtracking algorithm.
- `backtrackingHelper(matrix, isFixed, i, j, data, algo)`: Recursively solves the puzzle using backtracking.

### Utility Functions

- `getFixedEntries(matrix)`: Returns an array indicating which entries are fixed.
- `canBeCorrect(matrix, i, j)`: Checks if the current state of the board is valid.
- `allBoardNonZero(matrix)`: Checks if all cells in the board are filled.
- `readValue()`: Reads the current values from the Sudoku board.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## 📞Contact

For any questions or feedback, please contact [vansh-codes](https://github.com/vansh-codes).

### - Created by **Vansh Chaurasiya** 
Show some ❤️ by starring this repository !



## 🔗Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vanshchaurasiya24)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://www.twitter.com/vanshchaurasiy4) <p align="right"><a href="#top">BACK TO TOP</a></p>
