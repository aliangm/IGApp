import merge from "lodash/merge";

export function budgetExtend(data){
  const merged = merge(data.approvedBudgets, data.planUnknownChannels);

  return {
    //annualBudget: annualBudget,
    annualBudgetLeftToPlan: data.annualBudget - merged.reduce((annualSum, month) => Object.keys(month).reduce((monthSum, channel) => monthSum + month[channel], 0) + annualSum, 0),
    ...data
  };
}