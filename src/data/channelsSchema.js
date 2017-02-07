module.exports = {
  "schemaName":"channels",
  "type":"object",
  "title":"Channels",
  "_id":"58808f9e734d1d5b7d47b063",
  "properties":{
    "web_landingPages":{
      "alternatives":[
        "telemarketing", "advertising_searchMarketing_SEM_googleAdwords", "email_marketingEmail"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Web / Landing Pages",
      "type":"integer"
    },
    "web_companyWebsite":{
      "alternatives":[
        "content_contentCreation_eBook", "content_contentCreation_imagesAndInfographics", "content_contentCreation_presentations"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Web / Company’s Website",
      "type":"integer"
    },
    "viral_recommendAFriend_referralProgram":{
      "alternatives":[
        "engineeringAsMarketing_professionalTool", "partners_affiliatePrograms", "engineeringAsMarketing_calculator"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Viral / Recommend a Friend / Referral Program (P2P)",
      "type":"integer"
    },
    "telemarketing":{
      "alternatives":[
        "web_landingPages", "email_marketingEmail", "email_transactionalEmail"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Telemarketing",
      "type":"integer"
    },
    "social_productHunt":{
      "alternatives":[
        "content_contentPromotion_forums_other", "content_contentPromotion_forums_reddit", "engineeringAsMarketing_other"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / Product Hunt (Launch)",
      "type":"integer"
    },
    "social_communityBuilding":{
      "alternatives":[
        "social_linkedinCompanyProfile", "social_influencerOutreach", "social_twitterAccount"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / Community Building",
      "type":"integer"
    },
    "social_influencerOutreach":{
      "alternatives":[
        "social_communityBuilding", "social_linkedinCompanyProfile", "social_twitterAccount"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / Influencer Outreach",
      "type":"integer"
    },
    "social_linkedinGroup":{
      "alternatives":[
        "social_linkedinCompanyProfile", "social_communityBuilding", "social_influencerOutreach"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / LinkedIn Group",
      "type":"integer"
    },
    "social_linkedinCompanyProfile":{
      "alternatives":[
        "social_twitterAccount", "social_facebookPage", "social_twitterAccount"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / LinkedIn Company Profile",
      "type":"integer"
    },
    "social_pinterestPage":{
      "alternatives":[
        "social_googlePlusPage", "social_youtubeChannel", "social_instagramAccount"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / Pinterest Page",
      "type":"integer"
    },
    "social_googlePlusPage":{
      "alternatives":[
        "social_instagramAccount", "social_youtubeChannel", "social_pinterestPage"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / Google+ Page",
      "type":"integer"
    },
    "social_instagramAccount":{
      "alternatives":[
        "social_googlePlusPage", "social_twitterAccount", "social_pinterestPage"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / Instagram Account",
      "type":"integer"
    },
    "social_youtubeChannel":{
      "alternatives":[
        "social_instagramAccount", "social_googlePlusPage", "social_pinterestPage"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / Youtube Channel",
      "type":"integer"
    },
    "social_twitterAccount":{
      "alternatives":[
        "social_instagramAccount", "social_linkedinCompanyProfile", "social_youtubeChannel"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / Twitter Account",
      "type":"integer"
    },
    "social_facebookPage":{
      "alternatives":[
        "social_linkedinGroup", "social_linkedinCompanyProfile", "social_twitterAccount"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Social / Facebook Page",
      "type":"integer"
    },
    "PR_publicity_pressReleases_international":{
      "alternatives":[
        "PR_publicity_pressReleases_nationwide", "events_offlineEvents_running", "events_offlineEvents_sponsorship"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"PR / Publicity / Press Releases / International",
      "type":"integer"
    },
    "PR_publicity_pressReleases_nationwide":{
      "alternatives":[
        "PR_publicity_pressReleases_international", "events_offlineEvents_running", "events_offlineEvents_sponsorship"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":1600,
      "title":"PR / Publicity / Press Releases / Nationwide",
      "type":"integer"
    },
    "PR_publicity_pressReleases_local":{
      "alternatives":[
        "PR_publicity_pressReleases_nationwide", "events_offlineEvents_running", "events_offlineEvents_sponsorship"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":350,
      "title":"PR / Publicity / Press Releases / Local",
      "type":"integer"
    },
    "PR_unconventionalPR_customerAppreciation":{
      "alternatives":[
        "PR_unconventionalPR_publicityStunts", "events_offlineEvents_showcase", "events_onlineEvents_workshop"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"PR / Unconventional PR / Customer Appreciation",
      "type":"integer"
    },
    "PR_unconventionalPR_publicityStunts":{
      "alternatives":[
        "events_onlineEvents_webinar", "events_onlineEvents_workshop", "social_influencerOutreach"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"PR / Unconventional PR / Publicity Stunts",
      "type":"integer"
    },
    "partners_affiliatePrograms":{
      "alternatives":[
        "viral_recommendAFriend_referralProgram", "email_transactionalEmail", "email_marketingEmail"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Partners / Affiliate Programs",
      "type":"integer"
    },
    "mobile_mobileSite":{
      "alternatives":[
        "mobile_mobileApp", "web_landingPages", "web_companyWebsite"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Mobile / Mobile Site",
      "type":"integer"
    },
    "mobile_mobileApp":{
      "alternatives":[
        "mobile_mobileSite", "web_landingPages", "web_companyWebsite"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Mobile / Mobile App",
      "type":"integer"
    },
    "events_onlineEvents_workshop":{
      "alternatives":[
        "events_onlineEvents_webinar", "events_onlineEvents_podcast", "content_contentCreation_videos"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Events / Online Events (Running) / Workshop",
      "type":"integer"
    },
    "events_onlineEvents_podcast":{
      "alternatives":[
        "events_onlineEvents_webinar", "events_onlineEvents_workshop", "social_linkedinGroup"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Events / Online Events (Running) / Podcast",
      "type":"integer"
    },
    "events_onlineEvents_webinar":{
      "alternatives":[
        "events_onlineEvents_podcast", "events_onlineEvents_workshop", "social_influencerOutreach"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":250,
      "title":"Events / Online Events (Running) / Webinar",
      "type":"integer"
    },
    "events_offlineEvents_running":{
      "alternatives":[
        "PR_publicity_pressReleases_international", "PR_publicity_pressReleases_nationwide", "events_offlineEvents_sponsorship"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":500,
      "title":"Events / Offline Events / Running",
      "type":"integer"
    },
    "events_offlineEvents_showcase":{
      "alternatives":[
        "events_offlineEvents_speakingEngagements", "mobile_mobileApp", "viral_recommendAFriend_referralProgram"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Events / Offline Events / Showcase (Trade Shows, Exhibitions)",
      "type":"integer"
    },
    "events_offlineEvents_speakingEngagements":{
      "alternatives":[
        "events_offlineEvents_sponsorship", "events_onlineEvents_workshop", "events_onlineEvents_podcast"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Events / Offline Events / Speaking Engagements (Conferences)",
      "type":"integer"
    },
    "events_offlineEvents_sponsorship":{
      "alternatives":[
        "events_offlineEvents_speakingEngagements", "events_onlineEvents_podcast", "social_linkedinGroup"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":250,
      "title":"Events / Offline Events / Sponsorship",
      "type":"integer"
    },
    "engineeringAsMarketing_other":{
      "alternatives":[
        "engineeringAsMarketing_calculator", "engineeringAsMarketing_educationalMicrosites", "engineeringAsMarketing_widget"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Engineering as Marketing / Any",
      "type":"integer"
    },
    "engineeringAsMarketing_educationalMicrosites":{
      "alternatives":[
        "engineeringAsMarketing_calculator", "engineeringAsMarketing_widget", "engineeringAsMarketing_other"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Engineering as Marketing / Educational Microsites",
      "type":"integer"
    },
    "engineeringAsMarketing_widget":{
      "alternatives":[
        "engineeringAsMarketing_calculator", "engineeringAsMarketing_educationalMicrosites", "engineeringAsMarketing_other"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Engineering as Marketing / Widget",
      "type":"integer"
    },
    "engineeringAsMarketing_calculator":{
      "alternatives":[
        "engineeringAsMarketing_educationalMicrosites", "engineeringAsMarketing_widget", "engineeringAsMarketing_other"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Engineering as Marketing / Calculator",
      "type":"integer"
    },
    "engineeringAsMarketing_professionalTool":{
      "alternatives":[
        "engineeringAsMarketing_calculator", "engineeringAsMarketing_educationalMicrosites", "engineeringAsMarketing_widget"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Engineering as Marketing / Professional Tool",
      "type":"integer"
    },
    "email_transactionalEmail":{
      "alternatives":[
        "email_marketingEmail", "partners_affiliatePrograms", "telemarketing"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Email / Transactional Email",
      "type":"integer"
    },
    "email_marketingEmail":{
      "alternatives":[
        "email_transactionalEmail", "web_landingPages", "viral_recommendAFriend_referralProgram"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Email / Marketing Email",
      "type":"integer"
    },
    "content_contentCreation_caseStudies":{
      "alternatives":[
        "content_contentCreation_companyBlog", "content_contentCreation_researchPaper", "content_contentCreation_videos"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Creation / Case Studies",
      "type":"integer"
    },
    "content_contentCreation_videos":{
      "alternatives":[
        "content_contentCreation_eBook", "content_contentCreation_imagesAndInfographics", "content_contentCreation_presentations"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Creation / Videos",
      "type":"integer"
    },
    "content_contentCreation_eBook":{
      "alternatives":[
        "content_contentCreation_imagesAndInfographics", "content_contentCreation_presentations", "content_contentCreation_researchPaper"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Creation / E-book",
      "type":"integer"
    },
    "content_contentCreation_researchPaper":{
      "alternatives":[
        "content_contentCreation_eBook", "content_contentCreation_imagesAndInfographics", "content_contentCreation_presentations"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Creation / Research Paper (Whitepaper)",
      "type":"integer"
    },
    "content_contentCreation_reportSponsorship":{
      "alternatives":[
        "content_contentCreation_presentations", "content_contentCreation_imagesAndInfographics", "content_contentCreation_eBook"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Creation / Report Sponsorship",
      "type":"integer"
    },
    "content_contentCreation_presentations":{
      "alternatives":[
        "content_contentCreation_imagesAndInfographics", "content_contentCreation_eBook", "content_contentCreation_reportSponsorship"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Creation / Presentations",
      "type":"integer"
    },
    "content_contentCreation_imagesAndInfographics":{
      "alternatives":[
        "content_contentCreation_eBook", "content_contentCreation_presentations", "content_contentCreation_researchPaper"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Creation / Images & Infographics",
      "type":"integer"
    },
    "content_contentCreation_companyBlog":{
      "alternatives":[
        "content_contentCreation_researchPaper", "content_contentCreation_caseStudies", "content_contentCreation_eBook"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Creation / Blog Posts - Company Blog (on website)",
      "type":"integer"
    },
    "content_contentPromotion_forums_other":{
      "alternatives":[
        "content_contentPromotion_contentDiscovery_other", "content_contentPromotion_contentDiscovery_taboola", "content_contentPromotion_forums_quora"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Promotion / Forums / Niche Specific",
      "type":"integer"
    },
    "content_contentPromotion_forums_quora":{
      "alternatives":[
        "content_contentPromotion_forums_reddit", "content_contentPromotion_forums_other", "content_contentPromotion_contentDiscovery_outbrain"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Promotion / Forums / Quora",
      "type":"integer"
    },
    "content_contentPromotion_forums_reddit":{
      "alternatives":[
        "content_contentPromotion_forums_quora", "content_contentPromotion_forums_other", "content_contentPromotion_contentDiscovery_outbrain"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Promotion / Forums / Reddit",
      "type":"integer"
    },
    "content_contentPromotion_contentDiscovery_other":{
      "alternatives":[
        "content_contentPromotion_contentDiscovery_taboola", "content_contentPromotion_contentDiscovery_outbrain", "content_contentPromotion_forums_other"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Promotion / Content Discovery / General",
      "type":"integer"
    },
    "content_contentPromotion_contentDiscovery_taboola":{
      "alternatives":[
        "content_contentPromotion_contentDiscovery_outbrain", "content_contentPromotion_forums_quora", "content_contentPromotion_contentDiscovery_other"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Promotion / Content Discovery / Taboola",
      "type":"integer"
    },
    "content_contentPromotion_contentDiscovery_outbrain":{
      "alternatives":[
        "content_contentPromotion_contentDiscovery_taboola", "content_contentPromotion_forums_reddit", "content_contentPromotion_forums_quora"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Promotion / Content Discovery / Outbrain",
      "type":"integer"
    },
    "content_contentPromotion_targetingBlogs":{
      "alternatives":[
        "content_contentPromotion_forums_reddit", "content_contentPromotion_forums_quora", "content_contentPromotion_contentDiscovery_outbrain"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Content / Content Promotion / Targeting Blogs (guest)",
      "type":"integer"
    },
    "advertising_celebrityEndorsements":{
      "alternatives":[
        "advertising_paidReviews", "advertising_offlineAds_TV_international", "advertising_magazines_professional_international"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Celebrity Endorsements",
      "type":"integer"
    },
    "advertising_paidReviews":{
      "alternatives":[
        "advertising_celebrityEndorsements", "advertising_offlineAds_TV_international", "advertising_magazines_professional_international"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Paid Reviews",
      "type":"integer"
    },
    "advertising_magazines_professional_international":{
      "alternatives":[
        "advertising_offlineAds_TV_international", "advertising_offlineAds_billboard", "advertising_offlineAds_newspaper_international"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Magazines / Professional / International",
      "type":"integer"
    },
    "advertising_magazines_professional_nationwide":{
      "alternatives":[
        "advertising_offlineAds_newspaper_international", "advertising_offlineAds_SMS", "advertising_offlineAds_billboard"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Magazines / Professional / Nationwide",
      "type":"integer"
    },
    "advertising_magazines_professional_local":{
      "alternatives":[
        "advertising_displayAds_googleAdwords", "advertising_offlineAds_newspaper_local", "advertising_offlineAds_radio"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Magazines / Professional / Local",
      "type":"integer"
    },
    "advertising_magazines_consumers_international":{
      "alternatives":[
        "advertising_magazines_consumers_nationwide", "advertising_magazines_professional_local", "advertising_displayAds_googleAdwords"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Magazines / Consumers / International",
      "type":"integer"
    },
    "advertising_magazines_consumers_nationwide":{
      "alternatives":[
        "advertising_magazines_consumers_international", "advertising_magazines_professional_local", "advertising_displayAds_googleAdwords"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Magazines / Consumers / Nationwide",
      "type":"integer"
    },
    "advertising_magazines_consumers_local":{
      "alternatives":[
        "advertising_displayAds_googleAdwords", "advertising_displayAds_other", "advertising_mobile_ASO"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Magazines / Consumers / Local",
      "type":"integer"
    },
    "advertising_mobile_inAppAds":{
      "alternatives":[
        "advertising_displayAds_googleAdwords", "advertising_mobile_incentivizedCPI", "advertising_mobile_nonIncentivizedCPI"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Mobile / In-app ads",
      "type":"integer"
    },
    "advertising_mobile_ASO":{
      "alternatives":[
        "advertising_mobile_inAppAds", "advertising_mobile_incentivizedCPI", "advertising_mobile_nonIncentivizedCPI"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Mobile / ASO (App Store Optimization)",
      "type":"integer"
    },
    "advertising_mobile_nonIncentivizedCPI":{
      "alternatives":[
        "advertising_mobile_incentivizedCPI", "advertising_mobile_ASO", "advertising_mobile_inAppAds"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Mobile / Non-Incentivized CPI",
      "type":"integer"
    },
    "advertising_mobile_incentivizedCPI":{
      "alternatives":[
        "advertising_mobile_nonIncentivizedCPI", "advertising_mobile_inAppAds", "advertising_displayAds_googleAdwords"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Mobile / Incentivized CPI",
      "type":"integer"
    },
    "advertising_offlineAds_SMS":{
      "alternatives":[
        "advertising_offlineAds_newspaper_international", "advertising_magazines_consumers_international", "email_marketingEmail"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Offline Ads / SMS",
      "type":"integer"
    },
    "advertising_offlineAds_billboard":{
      "alternatives":[
        "advertising_magazines_consumers_international", "advertising_magazines_professional_international", "advertising_magazines_professional_nationwide"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Offline Ads / Billboard",
      "type":"integer"
    },
    "advertising_offlineAds_newspaper_international":{
      "alternatives":[
        "advertising_magazines_consumers_international", "advertising_magazines_professional_nationwide", "advertising_offlineAds_SMS"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Offline Ads / Newspaper / International",
      "type":"integer"
    },
    "advertising_offlineAds_newspaper_nationwide":{
      "alternatives":[
        "advertising_magazines_consumers_nationwide", "advertising_displayAds_other", "advertising_displayAds_googleAdwords"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Offline Ads / Newspaper / Nationwide",
      "type":"integer"
    },
    "advertising_offlineAds_newspaper_local":{
      "alternatives":[
        "advertising_displayAds_googleAdwords", "advertising_displayAds_other", "advertising_offlineAds_radio"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Offline Ads / Newspaper / Local",
      "type":"integer"
    },
    "advertising_offlineAds_radio":{
      "alternatives":[
        "advertising_offlineAds_newspaper_nationwide", "advertising_displayAds_googleAdwords", "advertising_magazines_consumers_nationwide"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Offline Ads / Radio",
      "type":"integer"
    },
    "advertising_offlineAds_TV_international":{
      "alternatives":[
        "advertising_celebrityEndorsements", "advertising_paidReviews", "advertising_displayAds_googleAdwords"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Offline Ads / TV / International",
      "type":"integer"
    },
    "advertising_offlineAds_TV_nationwide":{
      "alternatives":[
        "advertising_celebrityEndorsements", "advertising_paidReviews", "advertising_displayAds_googleAdwords"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Offline Ads / TV / Nationwide",
      "type":"integer"
    },
    "advertising_offlineAds_TV_local":{
      "alternatives":[
        "advertising_offlineAds_TV_nationwide", "advertising_paidReviews", "advertising_displayAds_googleAdwords"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Offline Ads / TV / Local",
      "type":"integer"
    },
    "advertising_socialAds_youtubeAdvertising":{
      "alternatives":[
        "advertising_socialAds_linkedinAdvertising", "advertising_socialAds_GooglePlusAdvertising", "advertising_socialAds_twitterAdvertising"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Social Ads / YouTube Advertising",
      "type":"integer"
    },
    "advertising_socialAds_GooglePlusAdvertising":{
      "alternatives":[
        "advertising_socialAds_linkedinAdvertising", "advertising_socialAds_twitterAdvertising", "advertising_socialAds_facebookAdvertising"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Social Ads / Google+ Advertising",
      "type":"integer"
    },
    "advertising_socialAds_pinterestAdvertising":{
      "alternatives":[
        "advertising_socialAds_instagramAdvertising", "advertising_socialAds_facebookAdvertising", "advertising_socialAds_twitterAdvertising"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Social Ads / Pinterest Advertising",
      "type":"integer"
    },
    "advertising_socialAds_instagramAdvertising":{
      "alternatives":[
        "advertising_socialAds_pinterestAdvertising", "advertising_socialAds_facebookAdvertising", "advertising_socialAds_youtubeAdvertising"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Social Ads / Instagram Advertising",
      "type":"integer"
    },
    "advertising_socialAds_linkedinAdvertising":{
      "alternatives":[
        "advertising_socialAds_twitterAdvertising", "advertising_socialAds_facebookAdvertising", "advertising_socialAds_GooglePlusAdvertising"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Social Ads / LinkedIn Advertising",
      "type":"integer"
    },
    "advertising_socialAds_twitterAdvertising":{
      "alternatives":[
        "advertising_socialAds_linkedinAdvertising", "advertising_socialAds_facebookAdvertising", "advertising_socialAds_GooglePlusAdvertising"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Social Ads / Twitter Advertising",
      "type":"integer"
    },
    "advertising_socialAds_facebookAdvertising":{
      "alternatives":[
        "advertising_socialAds_linkedinAdvertising", "advertising_socialAds_instagramAdvertising", "advertising_socialAds_twitterAdvertising"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Social Ads / Facebook Advertising",
      "type":"integer"
    },
    "advertising_searchMarketing_SEM_other":{
      "alternatives":[
        "advertising_searchMarketing_SEM_googleAdwords", "advertising_displayAds_googleAdwords", "advertising_mobile_inAppAds"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Search Marketing / SEM (PPC) / Other (not Google Ads)",
      "type":"integer"
    },
    "advertising_searchMarketing_SEM_googleAdwords":{
      "alternatives":[
        "advertising_searchMarketing_SEM_other", "advertising_displayAds_googleAdwords", "advertising_mobile_inAppAds"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Search Marketing / SEM (PPC) / Google AdWords",
      "type":"integer"
    },
    "advertising_searchMarketing_SEO":{
      "alternatives":[
        "advertising_searchMarketing_SEM_googleAdwords", "advertising_searchMarketing_SEM_other", "advertising_displayAds_googleAdwords"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Search Marketing / SEO",
      "type":"integer"
    },
    "advertising_displayAds_other":{
      "alternatives":[
        "advertising_displayAds_googleAdwords", "advertising_searchMarketing_SEM_googleAdwords", "advertising_searchMarketing_SEM_other"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Display Ads / Other (not Google Ads)",
      "type":"integer"
    },
    "advertising_displayAds_googleAdwords":{
      "alternatives":[
        "advertising_displayAds_other", "advertising_searchMarketing_SEM_googleAdwords", "advertising_searchMarketing_SEM_other"
      ],
      "maxMatchValue":5000,
      "minMonthBudget":50,
      "title":"Advertising / Display Ads / Google AdWords",
      "type":"integer"
    }
  }
};