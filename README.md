# UE-Game README

## Overview

UE-Game is a match-three puzzle game inspired by the popular Candy Crush. This project is crafted with modern web technologies including HTML, JavaScript, and SCSS, making it a lightweight and engaging game. The development environment leverages `npm` packages to streamline development and deployment processes.

## Features

- **Two Gameplay Modes:**
  - **Classic Mode:** In this mode, swapping tiles that do not result in a combo will revert the swap, maintaining the challenge of strategic movement.
  - **Infinite Mode:** Allows for unrestricted tile swapping, enabling a more relaxed gameplay experience where every move is permitted, regardless of combo outcomes.

- **Scoring System:** The game calculates scores based on the number of tiles matched in a single move, with additional multipliers for successive combos within a single turn. The scoring is as follows:
  - Match of 3 tiles: Score 3 * 10 points
  - Match of 4 tiles: Score 4 * 15 points
  - Match of 5 tiles: Score 5 * 20 points
  - Match of 6 or more tiles: Score x * 25 points, where x is the number of tiles matched
  - Each subsequent combo multiplies the score (e.g., the first combo is multiplied by 1, the second by 2, etc.)

## Technologies Used

- HTML: Structure of the game's interface.
- JavaScript: Core game logic and interactivity.
- SCSS: Styling of the game's UI for a more engaging user experience.

## Development Environment

The development setup includes essential `npm` packages for efficient development and deployment:

- `lodash`: A modern JavaScript utility library delivering modularity, performance & extras.
- `gh-pages`: Facilitates the deployment of projects to GitHub pages.
- `vite`: A modern frontend build tool that significantly improves the development experience.

## How to Play

Access the game through its homepage: [UE-Game](https://Tit0u4N.github.io/ue-game/). Choose your preferred mode (Classic or Infinite) and start matching tiles to score. Remember, strategy varies with the mode you select!

## Installation

To set up the project locally, clone the repository and install dependencies with npm:

```bash
git clone <repository-url>
cd ue-game
npm install
```

To run the development server:

```bash
npm run dev
```

To build the project for production:

```bash
npm run build
```

To deploy to GitHub Pages:

```bash
npm run deploy
```

Enjoy the game and aim for high scores!
