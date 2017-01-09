module.exports = {
  "title": "Channels",
  "type": "object",
  "schemaName": "channels",
  "properties": {
    "advertising_displayAds_googleAdwords": {
      "type": "integer",
      "title": "Advertising / Display Ads / Google AdWords",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_socialAds_SEM_facebookAdvertising"
      ]
    },
    "advertising_displayAds_other": {
      "type": "integer",
      "title": "Advertising / Display Ads / Other",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_searchMarketing_SEO": {
      "type": "integer",
      "title": "Advertising / Search Marketing / SEO",
      "minMonthBudget": 100,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_searchMarketing_SEM_googleAdwords": {
      "type": "integer",
      "title": "Advertising / Search Marketing / SEM (PPC) / Google AdWords",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_searchMarketing_SEM_other": {
      "type": "integer",
      "title": "Advertising / Search Marketing / SEM (PPC) / Other",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_socialAds_SEM_facebookAdvertising": {
      "type": "integer",
      "title": "Advertising / Social Ads / SEM (PPC) / Facebook Advertising",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_socialAds_SEM_twitterAdvertising": {
      "type": "integer",
      "title": "Advertising / Social Ads / SEM (PPC) / Twitter Advertising",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_socialAds_SEM_linkedinAdvertising": {
      "type": "integer",
      "title": "Advertising / Social Ads / SEM (PPC) / LinkedIn Advertising",
      "minMonthBudget": 100,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_socialAds_SEM_instagramAdvertising": {
      "type": "integer",
      "title": "Advertising / Social Ads / SEM (PPC) / Instagram Advertising",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_socialAds_SEM_pinterestAdvertising": {
      "type": "integer",
      "title": "Advertising / Social Ads / SEM (PPC) / Pinterest Advertising",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_socialAds_SEM_GooglePlusAdvertising": {
      "type": "integer",
      "title": "Advertising / Social Ads / SEM (PPC) / Google+ Advertising",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_socialAds_SEM_youtubeAdvertising": {
      "type": "integer",
      "title": "Advertising / Social Ads / SEM (PPC) / YouTube Advertising",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_TV_local": {
      "type": "integer",
      "title": "Advertising / Offline Ads / TV / Local",
      "minMonthBudget": 1000,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_TV_nationwide": {
      "type": "integer",
      "title": "Advertising / Offline Ads / TV / Nationwide",
      "minMonthBudget": 25000,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_TV_international": {
      "type": "integer",
      "title": "Advertising / Offline Ads / TV / International",
      "minMonthBudget": 50000,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_radio": {
      "type": "integer",
      "title": "Advertising / Offline Ads / Radio",
      "minMonthBudget": 150,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_newspaper_local": {
      "type": "integer",
      "title": "Advertising / Offline Ads / Newspaper / Local",
      "minMonthBudget": 100,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_newspaper_nationwide": {
      "type": "integer",
      "title": "Advertising / Offline Ads / Newspaper / Nationwide",
      "minMonthBudget": 250,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_newspaper_international": {
      "type": "integer",
      "title": "Advertising / Offline Ads / Newspaper / International",
      "minMonthBudget": 500,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_billboard": {
      "type": "integer",
      "title": "Advertising / Offline Ads / Billboard",
      "minMonthBudget": 500,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_SMS": {
      "type": "integer",
      "title": "Advertising / Offline Ads / SMS",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"

      ]
    },
    "advertising_mobile_incentivizedCPI": {
      "type": "integer",
      "title": "Advertising / Mobile / Incentivized CPI",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_mobile_nonIncentivizedCPI": {
      "type": "integer",
      "title": "Advertising / Mobile / Non-Incentivized CPI",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_mobile_ASO": {
      "type": "integer",
      "title": "Advertising / Mobile / ASO (App Store Optimization)",
      "minMonthBudget": 100,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_mobile_inAppAds": {
      "type": "integer",
      "title": "Advertising / Mobile / In-app ads",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_magazines_consumers_local": {
      "type": "integer",
      "title": "Advertising / Magazines / Consumers / Local",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_magazines_consumers_nationwide": {
      "type": "integer",
      "title": "Advertising / Magazines / Consumers / Nationwide",
      "minMonthBudget": 100,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_magazines_consumers_international": {
      "type": "integer",
      "title": "Advertising / Magazines / Consumers / International",
      "minMonthBudget": 500,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_magazines_professional_local": {
      "type": "integer",
      "title": "Advertising / Magazines / Professional / Local",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_magazines_professional_nationwide": {
      "type": "integer",
      "title": "Advertising / Magazines / Professional / Nationwide",
      "minMonthBudget": 300,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_magazines_professional_international": {
      "type": "integer",
      "title": "Advertising / Magazines / Professional / International",
      "minMonthBudget": 500,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_paidReviews": {
      "type": "integer",
      "title": "Advertising / Paid reviews",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_celebrityEndorsements": {
      "type": "integer",
      "title": "Advertising / Celebrity Endorsements",
      "minMonthBudget": 500,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentPromotion_targetingBlogs": {
      "type": "integer",
      "title": "Content / Content Promotion / Targeting Blogs (guest)",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentPromotion_contentDiscovery_outbrain": {
      "type": "integer",
      "title": "Content / Content Promotion / Content Discovery / Outbrain",
      "minMonthBudget": 300,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentPromotion_contentDiscovery_taboola": {
      "type": "integer",
      "title": "Content / Content Promotion / Content Discovery / Taboola",
      "minMonthBudget": 300,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentPromotion_contentDiscovery_other": {
      "type": "integer",
      "title": "Content / Content Promotion / Content Discovery / Other",
      "minMonthBudget": 200,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentPromotion_forums_reddit": {
      "type": "integer",
      "title": "Content / Content Promotion / Forums / Reddit",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentPromotion_forums_quora": {
      "type": "integer",
      "title": "Content / Content Promotion / Forums / Quora",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentPromotion_forums_other": {
      "type": "integer",
      "title": "Content / Content Promotion / Forums / Other",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentCreation_companyBlog": {
      "type": "integer",
      "title": "Content / Content Creation / Blog Posts - Company Blog (on website)",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentCreation_imagesAndInfographics": {
      "type": "integer",
      "title": "Content / Content Creation / Images & Infographics",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentCreation_presentations": {
      "type": "integer",
      "title": "Content / Content Creation / Presentations",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentCreation_reportSponsorship": {
      "type": "integer",
      "title": "Content / Content Creation / Report Sponsorship",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentCreation_researchPaper": {
      "type": "integer",
      "title": "Content / Content Creation / Research Paper (Whitepaper)",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentCreation_eBook": {
      "type": "integer",
      "title": "Content / Content Creation / E-book",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentCreation_videos": {
      "type": "integer",
      "title": "Content / Content Creation / Videos",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "content_contentCreation_caseStudies": {
      "type": "integer",
      "title": "Content / Content Creation / Case Studies",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "email_marketingEmail": {
      "type": "integer",
      "title": "Email / Marketing email",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "email_transactionalEmail": {
      "type": "integer",
      "title": "Email / Transactional email",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "engineeringAsMarketing_professionalTool": {
      "type": "integer",
      "title": "Engineering as Marketing / Professional tool",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "engineeringAsMarketing_calculator": {
      "type": "integer",
      "title": "Engineering as Marketing / Calculator",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "engineeringAsMarketing_widget": {
      "type": "integer",
      "title": "Engineering as Marketing / Widget",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "engineeringAsMarketing_educationalMicrosites": {
      "type": "integer",
      "title": "Engineering as Marketing / Educational Microsites",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "engineeringAsMarketing_other": {
      "type": "integer",
      "title": "Engineering as Marketing / Other",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "events_offlineEvents_sponsorship": {
      "type": "integer",
      "title": "Events / Offline events / Sponsorship",
      "minMonthBudget": 250,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "events_offlineEvents_speakingEngagements": {
      "type": "integer",
      "title": "Events / Offline events / Speaking Engagements (Conferences)",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "events_offlineEvents_showcase": {
      "type": "integer",
      "title": "Events / Offline events / Showcase (Trade Shows / Exhibitions)",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "events_offlineEvents_running": {
      "type": "integer",
      "title": "Events / Offline events / Running",
      "minMonthBudget": 500,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "events_onlineEvents_webinar": {
      "type": "integer",
      "title": "Events / Online Events (running) / Webinar",
      "minMonthBudget": 250,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "events_onlineEvents_podcast": {
      "type": "integer",
      "title": "Events / Online Events (Running) / Podcast",
      "minMonthBudget": 200,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "events_onlineEvents_workshop": {
      "type": "integer",
      "title": "Events / Online Events (Running) / Workshop",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "mobile_mobileApp": {
      "type": "integer",
      "title": "Mobile / Mobile App",
      "minMonthBudget": 500,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "mobile_mobileSite": {
      "type": "integer",
      "title": "Mobile / Mobile Site",
      "minMonthBudget": 150,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "partners_affiliatePrograms": {
      "type": "integer",
      "title": "Partners / Affiliate Programs",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "PR_unconventionalPR_publicityStunts": {
      "type": "integer",
      "title": "PR / Unconventional PR / Publicity Stunts",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "PR_unconventionalPR_customerAppreciation": {
      "type": "integer",
      "title": "PR / Unconventional PR / Customer Appreciation",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "PR_publicity_pressReleases_local": {
      "type": "integer",
      "title": "PR / Publicity / Press Releases / Local",
      "minMonthBudget": 1000,
      "maxMatchValue": 5000,
      "alternatives": [
        "PR_publicity_pressReleases_nationwide",
        "PR_publicity_pressReleases_international"
      ]
    },
    "PR_publicity_pressReleases_nationwide": {
      "type": "integer",
      "title": "PR / Publicity / Press Releases / Nationwide",
      "minMonthBudget": 2000,
      "maxMatchValue": 5000,
      "alternatives": [
        "PR_publicity_pressReleases_local",
        "PR_publicity_pressReleases_international"
      ]
    },
    "PR_publicity_pressReleases_international": {
      "type": "integer",
      "title": "PR / Publicity / Press Releases / International",
      "minMonthBudget": 3500,
      "maxMatchValue": 5000,
      "alternatives": [
        "PR_publicity_pressReleases_local",
        "PR_publicity_pressReleases_nationwide"
      ]
    },
    "social_facebookPage": {
      "type": "integer",
      "title": "Social / Facebook Page",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_twitterAccount": {
      "type": "integer",
      "title": "Social / Twitter Account",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_youtubeChannel": {
      "type": "integer",
      "title": "Social / Youtube Channel",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_instagramAccount": {
      "type": "integer",
      "title": "Social / Instagram Account",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_googlePlusPage": {
      "type": "integer",
      "title": "Social / Google+ Page",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_pinterestPage": {
      "type": "integer",
      "title": "Social / Pinterest Page",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_linkedinCompanyProfile": {
      "type": "integer",
      "title": "Social / LinkedIn Company Profile",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_linkedinGroup": {
      "type": "integer",
      "title": "Social / LinkedIn Group",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_influencerOutreach": {
      "type": "integer",
      "title": "Social / Influencer Outreach",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_communityBuilding": {
      "type": "integer",
      "title": "Social / Community Building",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "social_productHunt": {
      "type": "integer",
      "title": "Social / Product Hunt (Launch)",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "telemarketing": {
      "type": "integer",
      "title": "Telemarketing",
      "minMonthBudget": 150,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "viral_recommendAFriend_referralProgram": {
      "type": "integer",
      "title": "Viral / Recommend a Friend / Referral Program (P2P)",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "web_companyWebsite": {
      "type": "integer",
      "title": "Web / Company’s Website",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    },
    "web_landingPages": {
      "type": "integer",
      "title": "Web / Landing Pages",
      "minMonthBudget": 50,
      "maxMatchValue": 5000,
      "alternatives": [
        "advertising_displayAds_googleAdwords"
      ]
    }
  }
}