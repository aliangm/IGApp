import merge from "lodash/merge";
import { timeFrameToDate } from 'components/utils/objective';
import { parsePlannedVsActual } from 'data/parsePlannedVsActual';
import { getExtarpolateRatio } from 'utils.js';
import sumBy from 'lodash/sumBy';
import {flattenObjectives} from '../components/utils/objective';
import {getDates} from 'components/utils/date';

export function calculatedDataExtender(data){

  const committedBudgets = data.planBudgets.map((month) => {
    const newMonth = {};
    Object.keys(month).map((key) => {
      const committedBudget = month[key].committedBudget;
      newMonth[key] = committedBudget ? committedBudget : 0
    });

    return newMonth;
  });

  const campaignsWithIndex = data.campaigns.map((campaign, index) => { return { ... campaign, index: index} });
  const activeCampaigns = campaignsWithIndex.filter(campaign => campaign.isArchived !== true);
  const merged = merge(committedBudgets, data.planUnknownChannels);
  const unknownChannels = data.planUnknownChannels && data.planUnknownChannels.length > 0 && data.planUnknownChannels[0] ? data.planUnknownChannels[0] : {};
  const approvedChannels = committedBudgets && committedBudgets.length > 0 && committedBudgets[0] ? committedBudgets[0] : {};
  const monthlyBudget = Object.keys(approvedChannels).reduce((sum, channel) => sum + approvedChannels[channel], 0) + Object.keys(unknownChannels).reduce((sum, channel) => sum + unknownChannels[channel], 0);
  const monthlyExtarpolatedMoneySpent = calculateActualSpent(committedBudgets[0],data.planUnknownChannels[0] ,data.knownChannels, data.unknownChannels, data.planDate);
  const extarpolateRatio = getExtarpolateRatio(new Date(),data.planDate);

  const dates = getDates(data.planDate);
  const objectivesData = flattenObjectives(data.objectives, data.actualIndicators, dates, false);
  const collapsedObjectives = flattenObjectives(data.objectives, data.actualIndicators, dates, true);
  const funnelPossibleObjectives = ['newMCL', 'newMQL', 'newSQL', 'newOpps', 'newUsers'];
  const funnelObjectives = collapsedObjectives.filter(objective => funnelPossibleObjectives.includes(objective.indicator));

  return {
    calculatedData: {
        campaignsWithIndex: campaignsWithIndex,
        committedBudgets: committedBudgets,
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
        objectives: {
          objectivesData: objectivesData,
          collapsedObjectives : collapsedObjectives,
          firstObjective: collapsedObjectives && collapsedObjectives.length > 0 ? collapsedObjectives[0].indicator: null,
          funnelObjectives: funnelObjectives,
          funnelFirstObjective: funnelObjectives.length > 0 ? funnelObjectives[0].indicator: 'newSQL'
        }
      },
      ...data
    }
}

function calculateActualSpent(committedBudgets, planUnknownChannels, knownChannels, unknownChannels, planDate){

  const extarpolateRatio = getExtarpolateRatio(new Date(),planDate);
  const approvedExtarpolate = {...committedBudgets};
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