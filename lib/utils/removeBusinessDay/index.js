export default (originalDate, numDaysToAdd) => {
    const Sunday = 0;
    const Saturday = 6;
    let daysRemaining = numDaysToAdd;
    const newDate = originalDate.clone();
    while (daysRemaining > 0) {
        newDate.add(-1, 'days');
        if (newDate.day() !== Sunday && newDate.day() !== Saturday) {
            daysRemaining--;
        }
    }
    return newDate;
};
//# sourceMappingURL=index.js.map