import sumBy from 'lodash/sumBy';

export function formatNumber(budget) {
  if (budget == null) {
    return '';
  }

  return String(budget).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatBudget(budget) {
  return '$' + formatNumber(budget);
}

export function formatBudgetShortened(budget) {
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

export function extractNumberFromBudget(budget, defaultValue = 0) {
  return parseInt(budget.toString().replace(/\D+/g, '')) || defaultValue;
}

export function getPlanBudgetsData(planBudgets){
  const committedBudgets = getCommitedBudgets(planBudgets);

  const sumBudgets = {};
  committedBudgets.forEach(month => {
    Object.keys(month).forEach(channel => {
      if (!sumBudgets[channel]) {
        sumBudgets[channel] = 0;
      }
      sumBudgets[channel] += month[channel];
    });
  });

  const totalCost = sumBy(Object.keys(sumBudgets), key => sumBudgets[key]);

  return {
    committedBudgets,
    sumBudgets,
    totalCost
  };
}

export function getCommitedBudgets(planBudgets) {
  return planBudgets.map((month) => {
    const newMonth = {};
    Object.keys(month).map((key) => {
      const committedBudget = month[key].committedBudget;
      newMonth[key] = committedBudget || 0;
    });

    return newMonth;
  });
}