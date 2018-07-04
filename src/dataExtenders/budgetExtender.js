import merge from "lodash/merge";

export function budgetExtend(data){
  const merged = merge(data.approvedBudgets, data.planUnknownChannels);

  const unknownChannels = data.planUnknownChannels && data.planUnknownChannels.length > 0 && data.planUnknownChannels[0] ? data.planUnknownChannels[0] : {};
  const approvedChannels = data.approvedBudgets && data.approvedBudgets.length > 0 && data.approvedBudgets[0] ? data.approvedBudgets[0] : {};
  const monthlyBudget = Object.keys(approvedChannels).reduce((sum, channel) => sum + approvedChannels[channel], 0) + Object.keys(unknownChannels).reduce((sum, channel) => sum + unknownChannels[channel], 0);

  return {
    annualBudgetLeftToPlan: data.annualBudget - merged.reduce((annualSum, month) => Object.keys(month).reduce((monthSum, channel) => monthSum + month[channel], 0) + annualSum, 0),
    monthlyBudget: monthlyBudget,
    ...data
  };
}