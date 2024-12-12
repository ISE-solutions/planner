const fs = require('fs');

function zeroPad(num, numZeros) {
    var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
    var zeroString = Math.pow(10, zeros).toString().substr(1);
    if (num < 0) {
        zeroString = '-' + zeroString;
    }

    return zeroString + n;
}

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();
const hour = now.getHours();
const minutes = now.getMinutes();

const version = `${year}.${zeroPad(month, 2)}.${zeroPad(day, 2)}.${zeroPad(hour, 2)}${zeroPad(minutes, 2)}`;
const packageSolutionPath = './config/package-solution.json';
const packageSolutionContent = fs.readFileSync(packageSolutionPath, 'UTF-8');
const packageSolution = JSON.parse(packageSolutionContent);

packageSolution.solution.version = version;

fs.writeFileSync(packageSolutionPath, JSON.stringify(packageSolution, null, 2), 'UTF-8');