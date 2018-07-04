
export function campaignsExtend(data){
  const campaignsWithIndex = data.campaigns.map((campaign, index) => { return { ... campaign, index: index} });
  return {
    campaignsWithIndex: campaignsWithIndex,
    activeCampaigns: campaignsWithIndex.filter(campaign => campaign.isArchived !== true),
    ...data
  };
}