// Constants
const ANIMATION_DURATION = 1000;
const ANIMATION_INTERVAL = 100;

const DICE_IMAGES = {
    regular: {
        '1-5': './images/drf.png',  // Regular Failure
        '6-9': './images/drs.png',  // Regular Success
        '10': './images/drc.png'    // Regular Critical
    },
    hunger: {
        '1': './images/dhbf.png',   // Hunger Bestial Failure
        '2-5': './images/dhf.png',  // Hunger Failure
        '6-9': './images/dhs.png',  // Hunger Success
        '10': './images/dgmc.png'   // Hunger Messy Critical
    }
};

// Utility functions
const rollDie = () => Math.floor(Math.random() * 10) + 1;

const getImageForResult = (result, isHunger) => {
    const diceType = isHunger ? 'hunger' : 'regular';
    if (isHunger) {
        if (result === 1) return DICE_IMAGES[diceType]['1'];
        if (result >= 2 && result <= 5) return DICE_IMAGES[diceType]['2-5'];
        if (result >= 6 && result <= 9) return DICE_IMAGES[diceType]['6-9'];
        return DICE_IMAGES[diceType]['10'];
    } else {
        if (result >= 1 && result <= 5) return DICE_IMAGES[diceType]['1-5'];
        if (result >= 6 && result <= 9) return DICE_IMAGES[diceType]['6-9'];
        return DICE_IMAGES[diceType]['10'];
    }
};

const animateDie = (dieElement, isHunger) => {
    const interval = setInterval(() => {
        const result = rollDie();
        const imageUrl = getImageForResult(result, isHunger);
        dieElement.style.backgroundImage = `url('${imageUrl}')`;
    }, ANIMATION_INTERVAL);
    return interval;
};

const createDieElement = (result, isHunger) => {
    const dieElement = document.createElement('div');
    dieElement.className = `dice ${isHunger ? 'hunger-die' : 'regular-die'}`;
    const imageUrl = getImageForResult(result, isHunger);
    dieElement.style.backgroundImage = `url('${imageUrl}')`;
    return dieElement;
};

// Core game logic
class VampireDiceRoller {
    constructor() {
        this.resultsContainer = document.getElementById('results');
        this.diceResultsContainer = document.getElementById('dice-results');
        this.outcomeContainer = document.getElementById('outcome');
        this.rollButton = document.getElementById('roll-button');
        this.regularDiceInput = document.getElementById('regular-dice');
        this.hungerDiceInput = document.getElementById('hunger-dice');
        this.difficultyInput = document.getElementById('difficulty');

        this.rollButton.addEventListener('click', () => this.rollDice());
    }

    rollDice() {
        const regularDiceCount = parseInt(this.regularDiceInput.value);
        const hungerDiceCount = parseInt(this.hungerDiceInput.value);
        const difficulty = parseInt(this.difficultyInput.value);

        this.diceResultsContainer.innerHTML = '';
        const diceResults = this.generateDiceResults(regularDiceCount, hungerDiceCount);
        const animationPromises = this.animateDiceRolls(diceResults);

        Promise.all(animationPromises).then(() => {
            this.displayFinalResults(diceResults, difficulty);
        });
    }

    generateDiceResults(regularCount, hungerCount) {
        return [
            ...Array(regularCount).fill().map(() => ({ result: rollDie(), isHunger: false })),
            ...Array(hungerCount).fill().map(() => ({ result: rollDie(), isHunger: true }))
        ];
    }

    animateDiceRolls(diceResults) {
        return diceResults.map(({ isHunger }) => {
            const dieElement = createDieElement(rollDie(), isHunger);
            this.diceResultsContainer.appendChild(dieElement);

            return new Promise(resolve => {
                const interval = animateDie(dieElement, isHunger);
                setTimeout(() => {
                    clearInterval(interval);
                    resolve(dieElement);
                }, ANIMATION_DURATION);
            });
        });
    }

    displayFinalResults(diceResults, difficulty) {
        diceResults.forEach(({ result, isHunger }, index) => {
            const dieElement = this.diceResultsContainer.children[index];
            const imageUrl = getImageForResult(result, isHunger);
            dieElement.style.backgroundImage = `url('${imageUrl}')`;
        });

        const { successes, criticals, messyCriticals, bestialFailures } = this.calculateResults(diceResults);
        const outcomeText = this.generateOutcomeText(successes, criticals, messyCriticals, bestialFailures, difficulty);
        this.outcomeContainer.innerHTML = `<strong>${outcomeText}</strong>`;
    }

    calculateResults(diceResults) {
        let successes = 0, criticals = 0, messyCriticals = 0, bestialFailures = 0;

        diceResults.forEach(({ result, isHunger }) => {
            if (result >= 6) successes++;
            if (result === 10) {
                criticals++;
                if (isHunger) messyCriticals++;
            }
            if (isHunger && result === 1) bestialFailures++;
        });

        successes += Math.floor(criticals / 2) * 2;
        return { successes, criticals, messyCriticals, bestialFailures };
    }

    generateOutcomeText(successes, criticals, messyCriticals, bestialFailures, difficulty) {
        let outcomeText = `Successes: ${successes}`;
        if (successes >= difficulty) {
            if (messyCriticals > 0 && criticals >= 2) {
                outcomeText += ' - Messy Critical';
            } else if (criticals >= 2) {
                outcomeText += ' - Critical Success';
            } else {
                outcomeText += ' - Success';
            }
        } else {
            if (bestialFailures > 0) {
                outcomeText += ' - Bestial Failure';
            } else {
                outcomeText += ' - Fail';
            }
        }
        return outcomeText;
    }
}

// Theme functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.loadTheme();
    }

    setTheme(theme) {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme');
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.className;
        const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
        this.setTheme(newTheme);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new VampireDiceRoller();
    new ThemeManager();
});