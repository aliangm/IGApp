import merge from "lodash/merge";
import { timeFrameToDate } from '../components/utils/objective';

export function budgetExtend(data){
  const merged = merge(data.approvedBudgets, data.planUnknownChannels);

  const unknownChannels = data.planUnknownChannels && data.planUnknownChannels.length > 0 && data.planUnknownChannels[0] ? data.planUnknownChannels[0] : {};
  const approvedChannels = data.approvedBudgets && data.approvedBudgets.length > 0 && data.approvedBudgets[0] ? data.approvedBudgets[0] : {};
  const monthlyBudget = Object.keys(approvedChannels).reduce((sum, channel) => sum + approvedChannels[channel], 0) + Object.keys(unknownChannels).reduce((sum, channel) => sum + unknownChannels[channel], 0);

  return {
    annualBudgetLeftToPlan: data.annualBudget - merged.reduce((annualSum, month) => Object.keys(month).reduce((monthSum, channel) => monthSum + month[channel], 0) + annualSum, 0),
    monthlyBudget: monthlyBudget,
    monthlyBudgetLeftToInvest: data.activeCampaigns.reduce((res, campaign) => {
      if (!campaign.isArchived) {
        if (campaign.isOneTime) {
          if (campaign.dueDate && timeFrameToDate(campaign.dueDate).getMonth() === new Date().getMonth()) {
            res -= campaign.actualSpent || campaign.budget || 0;
          }
        }
        else {
          if (!campaign.dueDate || (campaign.dueDate &&  new Date() <= timeFrameToDate(campaign.dueDate))) {
            res -= campaign.actualSpent || campaign.budget || 0;
          }
        }
      }
      return res;
    }, monthlyBudget),
    ...data
  };
}