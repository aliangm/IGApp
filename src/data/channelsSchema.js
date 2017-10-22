module.exports = {
  "schemaName": "channels",
  "type": "object",
  "title": "Channels",
  "_id": "58808f9e734d1d5b7d47b063",
  "properties": {
    "web_landingPages": {
      "maxMatchValue": 5000,
      "minMonthBudget": 200,
      "title": "Web \/ Landing Pages",
      "source": "landing page",
      "medium": "content",
      "nickname": "Landing page",
      "type": "integer",
      "alternatives": [
        "telemarketing",
        "advertising_searchMarketing_SEM_googleAdwords",
        "email"
      ]
    },
    "web_companyWebsite": {
      "maxMatchValue": 5000,
      "minMonthBudget": 200,
      "title": "Web \/ Company’s Website",
      "source": "website",
      "medium": "content",
      "nickname": "Company’s Website",
      "type": "integer",
      "alternatives": [
        "content_contentCreation_eBook",
        "content_contentCreation_imagesAndInfographics",
        "content_contentCreation_presentations"
      ]
    },
    "viral_recommendAFriend_referralProgram": {
      "maxMatchValue": 5000,
      "minMonthBudget": 750,
      "title": "Viral \/ Recommend a Friend \/ Referral Program (P2P)",
      "source": "viral",
      "medium": "referral",
      "nickname": "Referral Program",
      "type": "integer",
      "alternatives": [
        "engineeringAsMarketing",
        "partners_affiliatePrograms",
        "advertising_paidReviews"
      ]
    },
    "telemarketing": {
      "maxMatchValue": 5000,
      "minMonthBudget": 600,
      "title": "Telemarketing",
      "source": "telemarketing",
      "medium": "offline",
      "nickname": "Telemarketing",
      "type": "integer",
      "alternatives": [
        "web_landingPages",
        "email",
        "viral_recommendAFriend_referralProgram"
      ]
    },
    "social_quora": {
      "maxMatchValue": 5000,
      "minMonthBudget": 200,
      "title": "Social \/ Quora",
      "source": "quora",
      "medium": "social",
      "nickname": "Quora - organic",
      "type": "integer",
      "alternatives": [
        "social_reddit",
        "content_contentPromotion_forums_other",
        "content_contentPromotion_contentDiscovery_outbrain"
      ]
    },
    "social_reddit": {
      "maxMatchValue": 5000,
      "minMonthBudget": 200,
      "title": "Social \/ Reddit",
      "source": "reddit",
      "medium": "social",
      "nickname": "Reddit - organic",
      "type": "integer",
      "alternatives": [
        "social_quora",
        "content_contentPromotion_forums_other",
        "content_contentPromotion_contentDiscovery_outbrain"
      ]
    },
    "social_productHunt": {
      "maxMatchValue": 5000,
      "minMonthBudget": 5500,
      "title": "Social \/ Product Hunt (Launch)",
      "source": "product hunt",
      "medium": "social",
      "nickname": "Product Hunt",
      "type": "integer",
      "alternatives": [
        "content_contentPromotion_forums_other",
        "social_reddit",
        "engineeringAsMarketing"
      ]
    },
    "social_communityBuilding": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Social \/ Community Building",
      "source": "community",
      "medium": "social",
      "nickname": "Community Building",
      "type": "integer",
      "alternatives": [
        "social_linkedinCompanyProfile",
        "social_influencerOutreach",
        "social_twitterAccount"
      ]
    },
    "social_influencerOutreach": {
      "maxMatchValue": 5000,
      "minMonthBudget": 450,
      "title": "Social \/ Influencer Outreach",
      "source": "influencer",
      "medium": "social",
      "nickname": "Influencers Outreach",
      "type": "integer",
      "alternatives": [
        "social_communityBuilding",
        "social_linkedinCompanyProfile",
        "social_twitterAccount"
      ]
    },
    "social_linkedinCompanyProfile": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Social \/ LinkedIn Company Profile",
      "source": "linkedin",
      "medium": "social",
      "nickname": "LinkedIn - organic",
      "type": "integer",
      "alternatives": [
        "social_twitterAccount",
        "social_facebookPage",
        "social_twitterAccount"
      ]
    },
    "social_pinterestPage": {
      "maxMatchValue": 5000,
      "minMonthBudget": 1000,
      "title": "Social \/ Pinterest Page",
      "source": "pinterest",
      "medium": "social",
      "nickname": "Pinterest - organic",
      "type": "integer",
      "alternatives": [
        "social_googlePlusPage",
        "social_youtubeChannel",
        "social_instagramAccount"
      ]
    },
    "social_googlePlusPage": {
      "maxMatchValue": 5000,
      "minMonthBudget": 500,
      "title": "Social \/ Google+ Page",
      "source": "google plus",
      "medium": "social",
      "nickname": "Google+ - organic",
      "type": "integer",
      "alternatives": [
        "social_instagramAccount",
        "social_youtubeChannel",
        "social_pinterestPage"
      ]
    },
    "social_instagramAccount": {
      "maxMatchValue": 5000,
      "minMonthBudget": 900,
      "title": "Social \/ Instagram Account",
      "source": "instagram",
      "medium": "social",
      "nickname": "Instagram - organic",
      "type": "integer",
      "alternatives": [
        "social_googlePlusPage",
        "social_twitterAccount",
        "social_pinterestPage"
      ]
    },
    "social_youtubeChannel": {
      "maxMatchValue": 5000,
      "minMonthBudget": 400,
      "title": "Social \/ Youtube Channel",
      "source": "youtube",
      "medium": "social",
      "nickname": "Youtube - organic",
      "type": "integer",
      "alternatives": [
        "social_instagramAccount",
        "social_googlePlusPage",
        "social_pinterestPage"
      ]
    },
    "social_twitterAccount": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Social \/ Twitter Account",
      "source": "twitter",
      "medium": "social",
      "nickname": "Twitter - organic",
      "type": "integer",
      "alternatives": [
        "social_instagramAccount",
        "social_linkedinCompanyProfile",
        "social_youtubeChannel"
      ]
    },
    "social_facebookPage": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Social \/ Facebook Page",
      "source": "facebook",
      "medium": "social",
      "nickname": "Facebook - organic",
      "type": "integer",
      "alternatives": [
        "social_communityBuilding",
        "social_linkedinCompanyProfile",
        "social_twitterAccount"
      ]
    },
    "PR_publicity_pressReleases": {
      "maxMatchValue": 5000,
      "minMonthBudget": 3000,
      "title": "PR \/ Publicity \/ Press Releases",
      "source": "(publish network)",
      "medium": "press release",
      "nickname": "Press Release",
      "type": "integer",
      "alternatives": [
        "content_contentPromotion_targetingBlogs",
        "events_offlineEvents_running",
        "events_offlineEvents_sponsorship"
      ]
    },
    "PR_unconventionalPR_customerAppreciation": {
      "maxMatchValue": 5000,
      "minMonthBudget": 500,
      "title": "PR \/ Unconventional PR \/ Customer Appreciation",
      "source": "customer appreciation",
      "medium": "offline",
      "nickname": "Customer Appreciation",
      "type": "integer",
      "alternatives": [
        "PR_unconventionalPR_publicityStunts",
        "events_offlineEvents_showcase",
        "events_onlineEvents_workshop"
      ]
    },
    "PR_unconventionalPR_publicityStunts": {
      "maxMatchValue": 5000,
      "minMonthBudget": 15000,
      "title": "PR \/ Unconventional PR \/ Publicity Stunts",
      "source": "publicity stunt",
      "medium": "offline",
      "nickname": "Publicity Stunt",
      "type": "integer",
      "alternatives": [
        "events_onlineEvents_webinar",
        "events_onlineEvents_workshop",
        "social_influencerOutreach"
      ]
    },
    "partners_affiliatePrograms": {
      "maxMatchValue": 5000,
      "minMonthBudget": 450,
      "title": "Partners \/ Affiliate Programs",
      "source": "(affiliate id)",
      "medium": "affiliate",
      "nickname": "Affiliate Program",
      "type": "integer",
      "alternatives": [
        "viral_recommendAFriend_referralProgram",
        "email",
        "telemarketing"
      ]
    },
    "mobile_mobileSite": {
      "maxMatchValue": 5000,
      "minMonthBudget": 1200,
      "title": "Mobile \/ Mobile Site",
      "source": "mobile site",
      "medium": "content",
      "nickname": "Mobile Site",
      "type": "integer",
      "alternatives": [
        "mobile_mobileApp",
        "web_landingPages",
        "web_companyWebsite"
      ]
    },
    "mobile_mobileApp": {
      "maxMatchValue": 5000,
      "minMonthBudget": 1350,
      "title": "Mobile \/ Mobile App",
      "source": "app",
      "medium": "mobile ",
      "nickname": "Mobile App",
      "type": "integer",
      "alternatives": [
        "mobile_mobileSite",
        "web_landingPages",
        "web_companyWebsite"
      ]
    },
    "events_onlineEvents_workshop": {
      "maxMatchValue": 5000,
      "minMonthBudget": 400,
      "title": "Events \/ Online Events \/ Workshop",
      "source": "workshop",
      "medium": "online event",
      "nickname": "Online Workshop",
      "type": "integer",
      "alternatives": [
        "events_onlineEvents_webinar",
        "events_onlineEvents_podcast",
        "content_contentCreation_videos"
      ]
    },
    "events_onlineEvents_podcast": {
      "maxMatchValue": 5000,
      "minMonthBudget": 400,
      "title": "Events \/ Online Events \/ Podcast",
      "source": "podcast",
      "medium": "online event",
      "nickname": "Podcast",
      "type": "integer",
      "alternatives": [
        "events_onlineEvents_webinar",
        "events_onlineEvents_workshop",
        "social_communityBuilding"
      ]
    },
    "events_onlineEvents_webinar": {
      "maxMatchValue": 5000,
      "minMonthBudget": 350,
      "title": "Events \/ Online Events \/ Webinar",
      "source": "webinar",
      "medium": "online event",
      "nickname": "Webinar",
      "type": "integer",
      "alternatives": [
        "events_onlineEvents_podcast",
        "events_onlineEvents_workshop",
        "social_influencerOutreach"
      ]
    },
    "events_offlineEvents_running": {
      "maxMatchValue": 5000,
      "minMonthBudget": 500,
      "title": "Events \/ Offline Events \/ Organising",
      "source": "create event",
      "medium": "offline",
      "nickname": "Organising (Event)",
      "type": "integer",
      "alternatives": [
        "PR_publicity_pressReleases",
        "events_offlineEvents_sponsorship",
        "advertising_magazines_professional"
      ]
    },
    "events_offlineEvents_showcase": {
      "maxMatchValue": 5000,
      "minMonthBudget": 350,
      "title": "Events \/ Offline Events \/ Showcase",
      "source": "showcase event",
      "medium": "offline",
      "nickname": "Showcase (Event)",
      "type": "integer",
      "alternatives": [
        "events_offlineEvents_speakingEngagements",
        "mobile_mobileApp",
        "viral_recommendAFriend_referralProgram"
      ]
    },
    "events_offlineEvents_speakingEngagements": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Events \/ Offline Events \/ Speaking Engagements",
      "source": "speaking event",
      "medium": "offline",
      "nickname": "Speaking Engagement (Event)",
      "type": "integer",
      "alternatives": [
        "events_offlineEvents_sponsorship",
        "events_onlineEvents_workshop",
        "events_onlineEvents_podcast"
      ]
    },
    "events_offlineEvents_sponsorship": {
      "maxMatchValue": 5000,
      "minMonthBudget": 450,
      "title": "Events \/ Offline Events \/ Sponsorship",
      "source": "sponsorship event",
      "medium": "offline",
      "nickname": "Sponsorship (Event)",
      "type": "integer",
      "alternatives": [
        "events_offlineEvents_speakingEngagements",
        "events_onlineEvents_podcast",
        "social_communityBuilding"
      ]
    },
    "engineeringAsMarketing": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Engineering as Marketing",
      "source": "tool",
      "medium": "content",
      "nickname": "Engineering as Marketing (tool)",
      "type": "integer",
      "alternatives": [
        "content_contentPromotion_targetingBlogs",
        "partners_affiliatePrograms",
        "advertising_paidReviews"
      ]
    },
    "email": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Email",
      "source": "(email type - newsletter, etc)",
      "medium": "email",
      "nickname": "Email",
      "type": "integer",
      "alternatives": [
        "telemarketing",
        "web_landingPages",
        "partners_affiliatePrograms"
      ]
    },
    "content_contentCreation_caseStudies": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Content \/ Content Creation \/ Case Studies",
      "source": "case study",
      "medium": "content",
      "nickname": "Case Study",
      "type": "integer",
      "alternatives": [
        "content_contentCreation_companyBlog",
        "content_contentCreation_researchPaper",
        "content_contentCreation_videos"
      ]
    },
    "content_contentCreation_videos": {
      "maxMatchValue": 5000,
      "minMonthBudget": 550,
      "title": "Content \/ Content Creation \/ Videos",
      "source": "video",
      "medium": "content",
      "nickname": "Video",
      "type": "integer",
      "alternatives": [
        "content_contentCreation_eBook",
        "content_contentCreation_imagesAndInfographics",
        "content_contentCreation_presentations"
      ]
    },
    "content_contentCreation_eBook": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Content \/ Content Creation \/ E-book",
      "source": "e-book",
      "medium": "content",
      "nickname": "E-book",
      "type": "integer",
      "alternatives": [
        "content_contentCreation_imagesAndInfographics",
        "content_contentCreation_presentations",
        "content_contentCreation_researchPaper"
      ]
    },
    "content_contentCreation_researchPaper": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Content \/ Content Creation \/ Whitepaper",
      "source": "whitepaper",
      "medium": "content",
      "nickname": "Whitepaper",
      "type": "integer",
      "alternatives": [
        "content_contentCreation_eBook",
        "content_contentCreation_imagesAndInfographics",
        "content_contentCreation_presentations"
      ]
    },
    "content_contentCreation_reportSponsorship": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Content \/ Content Creation \/ Report Sponsorship",
      "source": "report-sponsorship",
      "medium": "content",
      "nickname": "Report Sponsorship",
      "type": "integer",
      "alternatives": [
        "content_contentCreation_presentations",
        "content_contentCreation_imagesAndInfographics",
        "content_contentCreation_eBook"
      ]
    },
    "content_contentCreation_presentations": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Content \/ Content Creation \/ Presentations",
      "source": "presentation",
      "medium": "content",
      "nickname": "Presentation",
      "type": "integer",
      "alternatives": [
        "content_contentCreation_imagesAndInfographics",
        "content_contentCreation_eBook",
        "content_contentCreation_reportSponsorship"
      ]
    },
    "content_contentCreation_imagesAndInfographics": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Content \/ Content Creation \/ Images & Infographics",
      "source": "image or infographic",
      "medium": "content",
      "nickname": "Image \/ Infographic",
      "type": "integer",
      "alternatives": [
        "content_contentCreation_eBook",
        "content_contentCreation_presentations",
        "content_contentCreation_researchPaper"
      ]
    },
    "content_contentCreation_companyBlog": {
      "maxMatchValue": 5000,
      "minMonthBudget": 200,
      "title": "Content \/ Content Creation \/ Blog Posts - Company Blog",
      "source": "website",
      "medium": "blog",
      "nickname": "Company Blog",
      "type": "integer",
      "alternatives": [
        "content_contentCreation_researchPaper",
        "content_contentCreation_caseStudies",
        "content_contentCreation_eBook"
      ]
    },
    "content_contentPromotion_forums_other": {
      "maxMatchValue": 5000,
      "minMonthBudget": 200,
      "title": "Content \/ Content Promotion \/ Forums \/ Niche Specific",
      "source": "(Forum name)",
      "medium": "forum",
      "nickname": "Forums - Niche Specific",
      "type": "integer",
      "alternatives": [
        "content_contentPromotion_contentDiscovery_other",
        "content_contentPromotion_contentDiscovery_taboola",
        "social_quora"
      ]
    },
    "content_contentPromotion_contentDiscovery_other": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Content \/ Content Promotion \/ Content Discovery \/ General",
      "source": "(content discovery platform\/network)",
      "medium": "content discovery",
      "nickname": "Content Discovery - General",
      "type": "integer",
      "alternatives": [
        "content_contentPromotion_contentDiscovery_taboola",
        "content_contentPromotion_contentDiscovery_outbrain",
        "content_contentPromotion_forums_other"
      ]
    },
    "content_contentPromotion_contentDiscovery_taboola": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Content \/ Content Promotion \/ Content Discovery \/ Taboola",
      "source": "taboola",
      "medium": "content discovery",
      "nickname": "Taboola",
      "type": "integer",
      "alternatives": [
        "content_contentPromotion_contentDiscovery_outbrain",
        "social_quora",
        "content_contentPromotion_contentDiscovery_other"
      ]
    },
    "content_contentPromotion_contentDiscovery_outbrain": {
      "maxMatchValue": 5000,
      "minMonthBudget": 300,
      "title": "Content \/ Content Promotion \/ Content Discovery \/ Outbrain",
      "source": "outbrain",
      "medium": "content discovery",
      "nickname": "Outbrain",
      "type": "integer",
      "alternatives": [
        "content_contentPromotion_contentDiscovery_taboola",
        "social_reddit",
        "social_quora"
      ]
    },
    "content_contentPromotion_targetingBlogs": {
      "maxMatchValue": 5000,
      "minMonthBudget": 350,
      "title": "Content \/ Content Promotion \/ Targeting Blogs (Guest)",
      "source": "guest",
      "medium": "paid content",
      "nickname": "Guest Post",
      "type": "integer",
      "alternatives": [
        "social_reddit",
        "social_quora",
        "content_contentPromotion_contentDiscovery_outbrain"
      ]
    },
    "advertising_celebrityEndorsements": {
      "maxMatchValue": 5000,
      "minMonthBudget": 20000,
      "title": "Advertising \/ Celebrity Endorsements",
      "source": "celebrity endorsement",
      "medium": "offline",
      "nickname": "Celebrity Endorsement",
      "type": "integer",
      "alternatives": [
        "advertising_paidReviews",
        "advertising_offlineAds_TV",
        "advertising_magazines_professional"
      ]
    },
    "advertising_paidReviews": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Advertising \/ Paid Reviews",
      "source": "(reviews website)",
      "medium": "paid review",
      "nickname": "Paid Reviews",
      "type": "integer",
      "alternatives": [
        "advertising_celebrityEndorsements",
        "advertising_offlineAds_TV",
        "advertising_magazines_professional"
      ]
    },
    "advertising_magazines_professional": {
      "maxMatchValue": 5000,
      "minMonthBudget": 750,
      "title": "Advertising \/ Magazines \/ Professional",
      "source": "(magazine)",
      "medium": "magazine",
      "nickname": "Magazine (Professional) Ad",
      "type": "integer",
      "alternatives": [
        "advertising_offlineAds_newspaper",
        "advertising_offlineAds_billboard",
        "advertising_offlineAds_TV"
      ]
    },
    "advertising_magazines_consumers": {
      "maxMatchValue": 5000,
      "minMonthBudget": 2000,
      "title": "Advertising \/ Magazines \/ Consumers",
      "source": "(magazine)",
      "medium": "magazine",
      "nickname": "Magazine (Consumers) Ad",
      "type": "integer",
      "alternatives": [
        "advertising_magazines_professional",
        "advertising_displayAds_googleAdwords",
        "advertising_paidReviews"
      ]
    },
    "advertising_mobile_inAppAds": {
      "maxMatchValue": 5000,
      "minMonthBudget": 1200,
      "title": "Advertising \/ Mobile \/ In-app ads",
      "source": "in-app",
      "medium": "paid",
      "nickname": "In-app ads",
      "type": "integer",
      "alternatives": [
        "advertising_displayAds_googleAdwords",
        "advertising_mobile_incentivizedCPI",
        "advertising_mobile_nonIncentivizedCPI"
      ]
    },
    "advertising_mobile_ASO": {
      "maxMatchValue": 5000,
      "minMonthBudget": 2300,
      "title": "Advertising \/ Mobile \/ ASO (App Store Optimization)",
      "source": "app store",
      "medium": "organic",
      "nickname": "ASO (App Store Optimization)",
      "type": "integer",
      "alternatives": [
        "advertising_mobile_inAppAds",
        "advertising_mobile_incentivizedCPI",
        "advertising_mobile_nonIncentivizedCPI"
      ]
    },
    "advertising_mobile_nonIncentivizedCPI": {
      "maxMatchValue": 5000,
      "minMonthBudget": 1300,
      "title": "Advertising \/ Mobile \/ Non-Incentivized CPI",
      "source": "CPI",
      "medium": "organic",
      "nickname": "Non-Incentivized CPI",
      "type": "integer",
      "alternatives": [
        "advertising_mobile_incentivizedCPI",
        "advertising_mobile_ASO",
        "advertising_mobile_inAppAds"
      ]
    },
    "advertising_mobile_incentivizedCPI": {
      "maxMatchValue": 5000,
      "minMonthBudget": 1500,
      "title": "Advertising \/ Mobile \/ Incentivized CPI",
      "source": "CPI",
      "medium": "paid",
      "nickname": "Incentivized CPI",
      "type": "integer",
      "alternatives": [
        "advertising_mobile_nonIncentivizedCPI",
        "advertising_mobile_inAppAds",
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_offlineAds_SMS": {
      "maxMatchValue": 5000,
      "minMonthBudget": 750,
      "title": "Advertising \/ Offline Ads \/ SMS",
      "source": "(sms type - newsletter, etc)",
      "medium": "sms",
      "nickname": "SMS",
      "type": "integer",
      "alternatives": [
        "advertising_offlineAds_newspaper",
        "advertising_magazines_consumers",
        "email"
      ]
    },
    "advertising_offlineAds_billboard": {
      "maxMatchValue": 5000,
      "minMonthBudget": 3500,
      "title": "Advertising \/ Offline Ads \/ Billboard",
      "source": "billboard",
      "medium": "offline",
      "nickname": "Billboard Ad",
      "type": "integer",
      "alternatives": [
        "advertising_magazines_consumers",
        "advertising_magazines_professional",
        "advertising_offlineAds_TV"
      ]
    },
    "advertising_offlineAds_newspaper": {
      "maxMatchValue": 5000,
      "minMonthBudget": 4000,
      "title": "Advertising \/ Offline Ads \/ Newspaper",
      "source": "(newspaper)",
      "medium": "newspaper",
      "nickname": "Newspaper Ad",
      "type": "integer",
      "alternatives": [
        "advertising_magazines_consumers",
        "advertising_displayAds_googleAdwords",
        "advertising_displayAds_other"
      ]
    },
    "advertising_offlineAds_radio": {
      "maxMatchValue": 5000,
      "minMonthBudget": 3000,
      "title": "Advertising \/ Offline Ads \/ Radio",
      "source": "(radio channel)",
      "medium": "radio",
      "nickname": "Radio Ad",
      "type": "integer",
      "alternatives": [
        "advertising_offlineAds_newspaper",
        "advertising_displayAds_googleAdwords",
        "advertising_magazines_consumers"
      ]
    },
    "advertising_offlineAds_TV": {
      "maxMatchValue": 5000,
      "minMonthBudget": 4500,
      "title": "Advertising \/ Offline Ads \/ TV",
      "source": "(tv channel)",
      "medium": "tv",
      "nickname": "TV Commercial",
      "type": "integer",
      "alternatives": [
        "advertising_celebrityEndorsements",
        "advertising_paidReviews",
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_socialAds_youtubeAdvertising": {
      "maxMatchValue": 5000,
      "minMonthBudget": 350,
      "title": "Advertising \/ Paid Social \/ YouTube Advertising",
      "source": "youtube",
      "medium": "social paid",
      "nickname": "YouTube - Paid",
      "type": "integer",
      "alternatives": [
        "advertising_socialAds_linkedinAdvertising",
        "advertising_socialAds_GooglePlusAdvertising",
        "advertising_socialAds_twitterAdvertising"
      ]
    },
    "advertising_socialAds_GooglePlusAdvertising": {
      "maxMatchValue": 5000,
      "minMonthBudget": 350,
      "title": "Advertising \/ Paid Social \/ Google+ Advertising",
      "source": "google plus",
      "medium": "social paid",
      "nickname": "Google+ - Paid",
      "type": "integer",
      "alternatives": [
        "advertising_socialAds_linkedinAdvertising",
        "advertising_socialAds_twitterAdvertising",
        "advertising_socialAds_facebookAdvertising"
      ]
    },
    "advertising_socialAds_pinterestAdvertising": {
      "maxMatchValue": 5000,
      "minMonthBudget": 900,
      "title": "Advertising \/ Paid Social \/ Pinterest Advertising",
      "source": "pinterest",
      "medium": "social paid",
      "nickname": "Pinterest - Paid",
      "type": "integer",
      "alternatives": [
        "advertising_socialAds_instagramAdvertising",
        "advertising_socialAds_facebookAdvertising",
        "advertising_socialAds_twitterAdvertising"
      ]
    },
    "advertising_socialAds_instagramAdvertising": {
      "maxMatchValue": 5000,
      "minMonthBudget": 800,
      "title": "Advertising \/ Paid Social \/ Instagram Advertising",
      "source": "instagram",
      "medium": "social paid",
      "nickname": "Instagram - Paid",
      "type": "integer",
      "alternatives": [
        "advertising_socialAds_pinterestAdvertising",
        "advertising_socialAds_facebookAdvertising",
        "advertising_socialAds_youtubeAdvertising"
      ]
    },
    "advertising_socialAds_linkedinAdvertising": {
      "maxMatchValue": 5000,
      "minMonthBudget": 350,
      "title": "Advertising \/ Paid Social \/ LinkedIn Advertising",
      "source": "linkedin",
      "medium": "social paid",
      "nickname": "LinkedIn - Paid",
      "type": "integer",
      "alternatives": [
        "advertising_socialAds_twitterAdvertising",
        "advertising_socialAds_facebookAdvertising",
        "advertising_socialAds_GooglePlusAdvertising"
      ]
    },
    "advertising_socialAds_twitterAdvertising": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Advertising \/ Paid Social \/ Twitter Advertising",
      "source": "twitter",
      "medium": "social paid",
      "nickname": "Twitter - Paid",
      "type": "integer",
      "alternatives": [
        "advertising_socialAds_linkedinAdvertising",
        "advertising_socialAds_facebookAdvertising",
        "advertising_socialAds_GooglePlusAdvertising"
      ]
    },
    "advertising_socialAds_facebookAdvertising": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Advertising \/ Paid Social \/ Facebook Advertising",
      "source": "facebook",
      "medium": "social paid",
      "nickname": "Facebook - Paid",
      "type": "integer",
      "alternatives": [
        "advertising_socialAds_linkedinAdvertising",
        "advertising_socialAds_instagramAdvertising",
        "advertising_socialAds_twitterAdvertising"
      ]
    },
    "advertising_searchMarketing_SEM_onlineDirectories": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Advertising \/ Search Marketing \/ SEM (PPC) \/ Online Directories",
      "source": "(online directory)",
      "medium": "cpc",
      "nickname": "PPC - Online Directories",
      "type": "integer",
      "alternatives": [
        "advertising_paidReviews",
        "advertising_searchMarketing_SEM_googleAdwords",
        "advertising_searchMarketing_SEM_bing"
      ]
    },
    "advertising_searchMarketing_SEM_other": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Advertising \/ Search Marketing \/ SEM (PPC) \/ Other (not Google Ads)",
      "source": "(cpc network)",
      "medium": "cpc",
      "nickname": "PPC - Generic",
      "type": "integer",
      "alternatives": [
        "advertising_searchMarketing_SEM_googleAdwords",
        "advertising_searchMarketing_SEM_bing",
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_searchMarketing_SEM_googleAdwords": {
      "maxMatchValue": 5000,
      "minMonthBudget": 200,
      "title": "Advertising \/ Search Marketing \/ SEM (PPC) \/ Google AdWords",
      "source": "google",
      "medium": "cpc",
      "nickname": "PPC - Google AdWords",
      "type": "integer",
      "alternatives": [
        "advertising_searchMarketing_SEM_bing",
        "advertising_searchMarketing_SEM_other",
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_searchMarketing_SEM_bing": {
      "maxMatchValue": 5000,
      "minMonthBudget": 200,
      "title": "Advertising \/ Search Marketing \/ SEM (PPC) \/ Bing",
      "source": "bing",
      "medium": "cpc",
      "nickname": "PPC - Bing",
      "type": "integer",
      "alternatives": [
        "advertising_searchMarketing_SEM_googleAdwords",
        "advertising_searchMarketing_SEM_other",
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_searchMarketing_SEO": {
      "maxMatchValue": 5000,
      "minMonthBudget": 250,
      "title": "Advertising \/ Search Marketing \/ SEO",
      "source": "search",
      "medium": "organic",
      "nickname": "SEO",
      "type": "integer",
      "alternatives": [
        "advertising_searchMarketing_SEM_googleAdwords",
        "advertising_searchMarketing_SEM_other",
        "advertising_displayAds_googleAdwords"
      ]
    },
    "advertising_displayAds_other": {
      "maxMatchValue": 5000,
      "minMonthBudget": 350,
      "title": "Advertising \/ Display Ads \/ Other (not Google Ads)",
      "source": "(display network)",
      "medium": "display",
      "nickname": "Display Ads - Generic",
      "type": "integer",
      "alternatives": [
        "advertising_displayAds_googleAdwords",
        "advertising_searchMarketing_SEM_googleAdwords",
        "advertising_searchMarketing_SEM_other"
      ]
    },
    "advertising_displayAds_googleAdwords": {
      "maxMatchValue": 5000,
      "minMonthBudget": 350,
      "title": "Advertising \/ Display Ads \/ Google AdWords",
      "source": "google",
      "medium": "display",
      "nickname": "Display Ads - Google AdWords",
      "type": "integer",
      "alternatives": [
        "advertising_displayAds_other",
        "advertising_searchMarketing_SEM_googleAdwords",
        "advertising_searchMarketing_SEM_other"
      ]
    }
  }
};