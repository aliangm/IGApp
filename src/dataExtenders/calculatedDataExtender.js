import merge from "lodash/merge";
import { timeFrameToDate } from 'components/utils/objective';
import { parsePlannedVsActual } from 'data/parsePlannedVsActual';
import { getExtarpolateRatio } from 'utils.js';
import sumBy from 'lodash/sumBy';
import {flattenObjectives} from '../components/utils/objective';
import {getDates} from 'components/utils/date';

export function calculatedDataExtender(data){

  const campaignsWithIndex = data.campaigns.map((campaign, index) => { return { ... campaign, index: index} });
  const activeCampaigns = campaignsWithIndex.filter(campaign => campaign.isArchived !== true);
  const merged = merge(data.approvedBudgets, data.planUnknownChannels);
  const unknownChannels = data.planUnknownChannels && data.planUnknownChannels.length > 0 && data.planUnknownChannels[0] ? data.planUnknownChannels[0] : {};
  const approvedChannels = data.approvedBudgets && data.approvedBudgets.length > 0 && data.approvedBudgets[0] ? data.approvedBudgets[0] : {};
  const monthlyBudget = Object.keys(approvedChannels).reduce((sum, channel) => sum + approvedChannels[channel], 0) + Object.keys(unknownChannels).reduce((sum, channel) => sum + unknownChannels[channel], 0);
  const monthlyExtarpolatedMoneySpent = calculateActualSpent(data.approvedBudgets[0],data.planUnknownChannels[0] ,data.knownChannels, data.unknownChannels, data.planDate);
  const extarpolateRatio = getExtarpolateRatio(new Date(),data.planDate);

  const dates = getDates(data.planDate);
  const objectivesData = flattenObjectives(data.objectives, data.actualIndicators, dates, false);
  const collapsedObjectives = flattenObjectives(data.objectives, data.actualIndicators, dates, true);

  return {
    calculatedData: {
        campaignsWithIndex: campaignsWithIndex,
        activeCampaigns: activeCampaigns,
        annualBudgetLeftToPlan: data.annualBudget - merged.reduce((annualSum, month) => Object.keys(month).reduce((monthSum, channel) => monthSum + month[channel], 0) + annualSum, 0),
        monthlyBudget: monthlyBudget,
        monthlyExtarpolatedMoneySpent: monthlyExtarpolatedMoneySpent,
        monthlyExtapolatedTotalSpending: monthlyExtarpolatedMoneySpent / extarpolateRatio,
        monthlyBudgetLeftToInvest: activeCampaigns.reduce((res, campaign) => {
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
        objectivesData: objectivesData,
        collapsedObjectives : collapsedObjectives
      },
      ...data
    }
}

function calculateActualSpent(approvedBudgets, planUnknownChannels, knownChannels, unknownChannels, planDate){

  const extarpolateRatio = getExtarpolateRatio(new Date(),planDate);
  const approvedExtarpolate = {...approvedBudgets};
  const planUnknownExtarpolate = {...planUnknownChannels};
  Object.keys(approvedExtarpolate).map((key) => { approvedExtarpolate[key] *= extarpolateRatio; });
  Object.keys(planUnknownExtarpolate).map((key) => { planUnknownExtarpolate[key] *= extarpolateRatio; });

  if(knownChannels) {
    Object.keys(knownChannels).forEach((key) => approvedExtarpolate[key] = knownChannels[key]);
  }

  if(unknownChannels){
    Object.keys(unknownChannels).forEach((key) => planUnknownExtarpolate[key] = unknownChannels[key]);
  }

  return sumBy(Object.keys(approvedExtarpolate), (key) => approvedExtarpolate[key]) + sumBy(Object.keys(planUnknownExtarpolate), (key) => planUnknownExtarpolate[key]);
}