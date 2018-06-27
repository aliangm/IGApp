
export function formatTextByType(textType, toFormat){
    if (toFormat == null){
        return '';
    }

    return typeFunctionMapping[textType](toFormat);
}

const typeFunctionMapping = {
    budget: budgetFormatting,
    budgetShortened: formatBudgetShortened,
    dateFormat :dateFormatter,
    percentage: percentageFormatting,
    percentageProjected: (number)=>{return (number < 0 ? '-' : '+')+percentageFormatting(number)}
}

function dateFormatter(text){
    if (dateStr) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const [monthNum, yearNum] = dateStr.split("/");

        return `${monthNames[monthNum - 1]}/${yearNum.substr(2,2)}`;
    }
    else return null;
}

function budgetFormatting(budget){
    return String(budget).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function percentageFormatting(budget){
    return Math.abs(budget)+'%';
}

function formatBudgetShortened(budget) {
    if (budget >= 1000000000) {
        return (budget / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (budget >= 1000000) {
        return (budget / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (budget >= 1000) {
        return (budget / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return budget;
}