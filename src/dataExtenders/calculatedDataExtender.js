import merge from 'lodash/merge';
import {timeFrameToDate} from 'components/utils/objective';
import {getExtarpolateRatio} from 'components/utils/utils';
import sumBy from 'lodash/sumBy';
import {flattenObjectives} from 'components/utils/objective';
import {getDates} from 'components/utils/date';
import {getCommitedBudgets, getPlanBudgetsData} from 'components/utils/budget';
import {getDatesSpecific} from 'components/utils/date';
import isNil from 'lodash/isNil';
import sum from 'lodash/sum';

export function calculatedDataExtender(data) {

  const committedBudgets = getCommitedBudgets(data.planBudgets);
  const committedForecasting = data.forecastedIndicators.map(month => {
    const newMonth = {};
    Object.keys(month).forEach(indicator => newMonth[indicator] = month[indicator].committed);
    return newMonth;
  });

  const campaignsWithIndex = data.campaigns.map((campaign, index) => {
    return {...campaign, index: index};
  });
  const activeCampaigns = campaignsWithIndex.filter(campaign => campaign.isArchived !== true);
  const allBudgets = merge([], committedBudgets, data.planUnknownChannels);
  const monthlyBudget = sum(Object.values(allBudgets[0]));
  const monthlyExtarpolatedMoneySpent = calculateActualSpent(committedBudgets[0],
    data.planUnknownChannels[0],
    data.knownChannels,
    data.unknownChannels,
    data.planDate);
  const extarpolateRatio = getExtarpolateRatio(new Date(), data.planDate);

  const dates = getDates(data.planDate);
  const objectivesData = flattenObjectives(data.objectives, data.actualIndicators, dates, false);
  const collapsedObjectives = flattenObjectives(data.objectives, data.actualIndicators, dates, true);
  const funnelPossibleObjectives = ['newMCL', 'newMQL', 'newSQL', 'newOpps', 'newUsers'];
  const funnelObjectives = collapsedObjectives.filter(
    objective => funnelPossibleObjectives.includes(objective.indicator));

  const isTrial = new Date() < new Date(data.userAccount.trialEnd);
  const isAccountEnabled = isTrial || data.userAccount.isPaid;
  const annualBudget = getAnnualBudgetFromAppData(data);

  return {
    calculatedData: {
      campaignsWithIndex: campaignsWithIndex,
      committedBudgets: committedBudgets,
      committedForecasting: committedForecasting,
      activeCampaigns: activeCampaigns,
      annualBudget: annualBudget,
      annualBudgetLeftToPlan: annualBudget -
      allBudgets.reduce((annualSum, month) => Object.keys(month)
        .reduce((monthSum, channel) => monthSum + month[channel], 0) + annualSum, 0),
      monthlyBudget: monthlyBudget,
      monthlyExtarpolatedMoneySpent: monthlyExtarpolatedMoneySpent,
      monthlyExtapolatedTotalSpending: monthlyExtarpolatedMoneySpent / extarpolateRatio,
      extarpolateRatio: extarpolateRatio,
      monthlyBudgetLeftToInvest: activeCampaigns.reduce((res, campaign) => {
        if (!campaign.isArchived) {
          if (campaign.isOneTime) {
            if (campaign.dueDate && timeFrameToDate(campaign.dueDate).getMonth() === new Date().getMonth()) {
              res -= campaign.actualSpent || campaign.budget || 0;
            }
          }
          else {
            if (!campaign.dueDate || (campaign.dueDate && new Date() <= timeFrameToDate(campaign.dueDate))) {
              res -= campaign.actualSpent || campaign.budget || 0;
            }
          }
        }
        return res;
      }, monthlyBudget),
      objectives: {
        objectivesData: objectivesData,
        collapsedObjectives: collapsedObjectives,
        firstObjective: collapsedObjectives && collapsedObjectives.length > 0 ? collapsedObjectives[0].indicator : null,
        funnelObjectives: funnelObjectives,
        funnelFirstObjective: funnelObjectives.length > 0 ? funnelObjectives[0].indicator : 'newSQL'
      },
      historyData: calculateHistoryData(data, data.historyData, data.monthsExceptThisMonth),
      isTrial,
      isAccountEnabled,
      integrations: calculateAutomaticIntegration(data)
    },
    ...data
  };
}

export function getAnnualBudgetFromAppData(data) {
  return !isNil(data.annualBudget) ? data.annualBudget : sum(data.budgetArray);
}

function calculateHistoryData(currentData, historyData, monthExceptThisMonth = 0) {
  const historyDataLength = (data) => data.indicators.length;

  const historyDataWithCurrentMonth = {};
  Object.keys(historyData).forEach(key => {
    const sliceNumber = historyDataLength(historyData) - monthExceptThisMonth;
    // Indicators key in current month is actually "ActualIndicators" and not an array, that's why is has special treatment
    // All the other one's has the same exact name and are arrays.
    if (key === 'indicators') {
      historyDataWithCurrentMonth[key] = [...historyData[key], currentData.actualIndicators].slice(sliceNumber);
    }
    else {
      historyDataWithCurrentMonth[key] = [...historyData[key], currentData[key][0]].slice(sliceNumber);
    }
  });

  const months = getDatesSpecific(currentData.planDate, historyDataLength(historyDataWithCurrentMonth) - 1, 1);

  const {committedBudgets, sumBudgets, totalCost} = getPlanBudgetsData(historyDataWithCurrentMonth.planBudgets);

  const indicatorsDataPerMonth = months.map((month, monthIndex) => {
    return {
      name: months[monthIndex],
      ...historyData.indicators[monthIndex],
      ...committedBudgets[monthIndex],
      total: sumBy(Object.keys(committedBudgets[monthIndex]), (channelKey) => committedBudgets[monthIndex][channelKey])
    };
  });

  return {
    historyDataWithCurrentMonth,
    months,
    committedBudgets,
    sumBudgets,
    totalCost,
    indicatorsDataPerMonth,
    historyDataLength: historyDataLength(historyData)
  };
}

function calculateActualSpent(committedBudgets, planUnknownChannels, knownChannels, unknownChannels, planDate) {

  const extarpolateRatio = getExtarpolateRatio(new Date(), planDate);
  const approvedExtarpolate = {...committedBudgets};
  const planUnknownExtarpolate = {...planUnknownChannels};
  Object.keys(approvedExtarpolate).map((key) => {
    approvedExtarpolate[key] *= extarpolateRatio;
  });
  Object.keys(planUnknownExtarpolate).map((key) => {
    planUnknownExtarpolate[key] *= extarpolateRatio;
  });

  if (knownChannels) {
    Object.keys(knownChannels).forEach((key) => approvedExtarpolate[key] = knownChannels[key]);
  }

  if (unknownChannels) {
    Object.keys(unknownChannels).forEach((key) => planUnknownExtarpolate[key] = unknownChannels[key]);
  }

  return sumBy(Object.keys(approvedExtarpolate), (key) => approvedExtarpolate[key]) +
    sumBy(Object.keys(planUnknownExtarpolate), (key) => planUnknownExtarpolate[key]);
}

function calculateAutomaticIntegration(data) {
  const isTwitterAdsAuto = !!(data.twitteradsapi && data.twitteradsapi.oauthAccessToken && data.twitteradsapi.oauthAccessTokenSecret && data.twitteradsapi.accountId);
  const isLinkedinAdsAuto = !!(data.linkedinadsapi && data.linkedinadsapi.tokens && data.linkedinadsapi.accountId);
  const isFacebookAdsAuto = !!(data.facebookadsapi && data.facebookadsapi.accountId && data.facebookadsapi.token);
  const isAdwordsAuto = !!(data.adwordsapi && data.adwordsapi.tokens && data.adwordsapi.customerId);
  const isSalesforceCampaignsAuto = !!(data.salesforceapi && data.salesforceapi.tokens && data.salesforceapi.selectedCampaigns && data.salesforceapi.selectedCampaigns.length > 0);
  const isSalesforceAuto = !!(data.salesforceapi && data.salesforceapi.tokens && data.salesforceapi.mapping);
  const isMozAuto = !!(data.mozapi && data.mozapi.url);
  const isHubspotAuto = !!(data.hubspotapi && data.hubspotapi.mapping && data.hubspotapi.tokens);
  const isGoogleAuto = !!(data.googleapi && data.googleapi.tokens && data.googleapi.profileId);
  const isLinkedinAuto = !!(data.linkedinapi && data.linkedinapi.accountId && data.linkedinapi.tokens);
  const isFacebookAuto = !!(data.facebookapi && data.facebookapi.pageId);
  const isTwitterAuto = !!(data.twitterapi && data.twitterapi.accountName);
  const isYoutubeAuto = !!(data.youtubeapi && data.youtubeapi.type && data.youtubeapi.id);
  const isStripeAuto = !!(data.stripeapi && data.stripeapi.tokens);
  const isGoogleSheetsAuto = !!(data.googlesheetsapi && data.googlesheetsapi.tokens && data.googlesheetsapi.mapping);

  return {
    isTwitterAdsAuto,
    isLinkedinAdsAuto,
    isFacebookAdsAuto,
    isAdwordsAuto,
    isSalesforceCampaignsAuto,
    isSalesforceAuto,
    isMozAuto,
    isHubspotAuto,
    isGoogleAuto,
    isLinkedinAuto,
    isFacebookAuto,
    isTwitterAuto,
    isYoutubeAuto,
    isStripeAuto,
    isGoogleSheetsAuto
  };
}