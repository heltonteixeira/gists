const regularDiceImages = {
    '1-5': 'https://imgur.com/x0rDGlG.png',
    '6-9': 'https://imgur.com/DConmlW.png',
    '10': 'https://imgur.com/AByS1LP.png'
};

const hungerDiceImages = {
    '1': 'https://imgur.com/WDpzkkt.png',
    '2-5': 'https://imgur.com/ws5Nxzw.png',
    '6-9': 'https://imgur.com/cR5OSSs.png',
    '10': 'https://imgur.com/UrbEja2.png'
};

document.getElementById('roll-button').addEventListener('click', () => {
    const regularDiceCount = parseInt(document.getElementById('regular-dice').value);
    const hungerDiceCount = parseInt(document.getElementById('hunger-dice').value);
    const difficulty = parseInt(document.getElementById('difficulty').value);
    const resultsContainer = document.getElementById('results');
    const diceResultsContainer = document.getElementById('dice-results');
    const outcomeContainer = document.getElementById('outcome');

    diceResultsContainer.innerHTML = '';

    const rollDie = () => Math.floor(Math.random() * 10) + 1;

    const rollDice = (count) => {
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(rollDie());
        }
        return results;
    };

    const getImageForResult = (result, isHunger) => {
        if (isHunger) {
            if (result === 1) return hungerDiceImages['1'];
            if (result >= 2 && result <= 5) return hungerDiceImages['2-5'];
            if (result >= 6 && result <= 9) return hungerDiceImages['6-9'];
            return hungerDiceImages['10'];
        } else {
            if (result >= 1 && result <= 5) return regularDiceImages['1-5'];
            if (result >= 6 && result <= 9) return regularDiceImages['6-9'];
            return regularDiceImages['10'];
        }
    };

    const animateDice = (dieElement, isHunger) => {
        const interval = setInterval(() => {
            const result = rollDie();
            dieElement.style.backgroundImage = `url(${getImageForResult(result, isHunger)})`;
        }, 100);

        return interval;
    };

    const animationDuration = 1000;

    const intervals = [];
    const diceResults = rollDice(regularDiceCount + hungerDiceCount);
    diceResults.forEach((die, index) => {
        const dieElement = document.createElement('div');
        dieElement.className = 'dice';
        diceResultsContainer.appendChild(dieElement);

        const interval = animateDice(dieElement, index >= regularDiceCount);
        intervals.push({ interval, dieElement, die, isHunger: index >= regularDiceCount });
    });

    setTimeout(() => {
        intervals.forEach(({ interval, dieElement, die, isHunger }) => {
            clearInterval(interval);
            dieElement.style.backgroundImage = `url(${getImageForResult(die, isHunger)})`;
        });

        let successes = 0;
        let criticals = 0;
        let messyCriticals = 0;
        let bestialFailures = 0;
        let hungerCriticals = 0;

        diceResults.forEach((die, index) => {
            if (die >= 6) successes++;
            if (die === 10) {
                criticals++;
                if (index >= regularDiceCount) {
                    hungerCriticals++;
                    messyCriticals++;
                }
            }
            if (index >= regularDiceCount && die === 1) bestialFailures++;
        });

        successes += Math.floor(criticals / 2) * 2;

        let outcomeText = `# Successes: ${successes}`;
        if (successes >= difficulty) {
            if (hungerCriticals > 0 && criticals >= 2) {
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

        outcomeContainer.innerHTML = `<strong>${outcomeText}</strong>`;
    }, animationDuration);
});
