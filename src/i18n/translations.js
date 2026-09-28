/**
 * Static UI text, in both languages. Tamil (`ta`) is the primary language;
 * `en` is the fallback the site was originally written in.
 *
 * Usage: const { t } = useLanguage(); t("nav.home")
 *
 * Dynamic content coming from the backend (achievement titles, story
 * bodies, etc.) is NOT translated here — whatever a business types in
 * Tamil or English renders as-is, and the Tamil-only Arima font in
 * variables.css kicks in automatically per character. This file only
 * covers the fixed chrome around that content: nav, buttons, page titles.
 */
const translations = {
  ta: {
    "nav.home": "முகப்பு",
    "nav.business": "வணிகம்",
    "nav.community": "சமூகம்",
    "nav.resources": "வளங்கள்",
    "nav.login": "உள்நுழைய",
    "nav.join": "இணையுங்கள்",
    "nav.myAccount": "என் கணக்கு",
    "nav.logout": "வெளியேறு",
    "nav.joinNetwork": "நெட்வொர்க்கில் இணையுங்கள்",
    "nav.viewAllResources": "அனைத்து வளங்களையும் காண்க →",

    "mega.business.desc": "நிறுவனங்களின் கதைகள், வளர்ச்சி, தயாரிப்புகள் மற்றும் ஒரு வணிகம் பகிரும் அனைத்தும்.",
    "mega.community.desc": "வணிகங்களும் நிபுணர்களும் ஒருவருக்கொருவர் கேட்டு, பதிலளித்து, கற்றுக்கொள்ளும் இடம்.",
    "mega.resources.desc": "உள்ளூர் வணிகங்களுக்கு உண்மையில் தேவைப்படுவதை அடிப்படையாகக் கொண்ட அறிவு.",
    "mega.newsletter.desc": "வணிக செய்திகளும் நுண்ணறிவுகளும் உங்கள் இன்பாக்ஸில் — வாரம் ஒரு முறை.",

    "menu.stories.label": "வணிகக் கதைகள்",
    "menu.stories.desc": "வளர்ச்சிப் பயணங்களும் நிறுவனப் பின்னணியும்.",
    "menu.achievements.label": "சாதனைகள்",
    "menu.achievements.desc": "விருதுகள், சான்றிதழ்கள் மற்றும் மைல்கற்கள்.",
    "menu.strategies.label": "உத்திகள்",
    "menu.strategies.desc": "சந்தைப்படுத்தல் அணுகுமுறைகளும் பெற்ற பாடங்களும்.",
    "menu.products.label": "புதிய தயாரிப்புகள்",
    "menu.products.desc": "விரைவில் வரவுள்ள மற்றும் புதிதாக வெளியான தயாரிப்புகள்.",
    "menu.enquiries.label": "சப்ளையர் விசாரணைகள்",
    "menu.enquiries.desc": "வணிகங்கள் தேடும் தேவைகள்.",
    "menu.videos.label": "வணிக வீடியோக்கள்",
    "menu.videos.desc": "நிறுவனம், தயாரிப்பு மற்றும் அறிமுக வீடியோக்கள்.",
    "menu.qa.label": "வணிக கேள்வி பதில்",
    "menu.qa.desc": "ஒரு கேள்வியைக் கேளுங்கள் அல்லது பதிலளிக்க உதவுங்கள்.",

    "footer.tagline": "உள்ளூர் வணிக சமூகத்திற்கான வணிக ஊடகம், கதைகள் மற்றும் அறிவு.",
    "footer.explore": "ஆராயுங்கள்",
    "footer.resources": "வளங்கள்",
    "footer.community": "சமூகம்",
    "footer.rights": "© 2026 Vartha Business Network. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    "footer.disclaimer": "வணிகம், வரி மற்றும் சட்டத் தகவல்கள் வழிகாட்டுதலுக்காக மட்டுமே — அதிகாரப்பூர்வ ஆதாரங்களுடன் சரிபார்க்கவும்.",

    "achievements.eyebrow": "அங்கீகாரங்கள்",
    "achievements.title": "வணிக சாதனைகள்",
    "achievements.empty": "இன்னும் சாதனைகள் வெளியிடப்படவில்லை.",
    "achievements.seeAll": "அனைத்து சாதனைகளையும் காண்க →",
    "achievements.related": "தொடர்புடைய சாதனைகள்",
    "achievements.eyebrowDetail": "சாதனை",
    "achievements.awardedByPrefix": "வழங்கியவர்",

    "strategies.eyebrow": "உத்திகளும் நுண்ணறிவுகளும்",
    "strategies.title": "வணிக உத்திகள்",
    "strategies.eyebrowDetail": "உத்தி",

    "stories.eyebrow": "வணிக ஊடகம்",
    "stories.title": "வணிகக் கதைகள்",
    "stories.readNext": "அடுத்து படிக்க",
    "stories.empty": "இன்னும் கதைகள் வெளியிடப்படவில்லை.",

    "common.loading": "ஏற்றுகிறது…",
    "common.retry": "மீண்டும் முயற்சி",

    "newsletter.heading": "செய்திமடல்",
    "newsletter.blurb": "வணிக செய்திகளும் நுண்ணறிவுகளும் உங்கள் இன்பாக்ஸில் — வாரம் ஒரு முறை.",
    "newsletter.placeholder": "உங்கள் மின்னஞ்சல் முகவரி",
    "newsletter.button": "குழுசேர்",
    "newsletter.sending": "அனுப்புகிறது…",
    "newsletter.success": "நன்றி! நீங்கள் குழுசேர்ந்துவிட்டீர்கள்.",
    "newsletter.error": "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.",
    "newsletter.invalidEmail": "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
  },
  en: {
    "nav.home": "Home",
    "nav.business": "Business",
    "nav.community": "Community",
    "nav.resources": "Resources",
    "nav.login": "Log in",
    "nav.join": "Join",
    "nav.myAccount": "My Account",
    "nav.logout": "Log out",
    "nav.joinNetwork": "Join the Network",
    "nav.viewAllResources": "View All Resources →",

    "mega.business.desc": "Company stories, growth, products and everything a business shares.",
    "mega.community.desc": "Where businesses and professionals ask, answer and learn from each other.",
    "mega.resources.desc": "Knowledge grouped by what local businesses actually need.",
    "mega.newsletter.desc": "Business news and insights in your inbox, once a week.",

    "menu.stories.label": "Business Stories",
    "menu.stories.desc": "Growth journeys and company backgrounds.",
    "menu.achievements.label": "Achievements",
    "menu.achievements.desc": "Awards, certifications and milestones.",
    "menu.strategies.label": "Strategies",
    "menu.strategies.desc": "Marketing approaches and lessons learned.",
    "menu.products.label": "New Products",
    "menu.products.desc": "Upcoming and recently launched products.",
    "menu.enquiries.label": "Supplier Enquiries",
    "menu.enquiries.desc": "Requirements businesses are looking to fill.",
    "menu.videos.label": "Business Videos",
    "menu.videos.desc": "Company, product and introduction videos.",
    "menu.qa.label": "Business Q&A",
    "menu.qa.desc": "Ask a question or help answer one.",

    "footer.tagline": "Business media, stories and knowledge for the local business community.",
    "footer.explore": "Explore",
    "footer.resources": "Resources",
    "footer.community": "Community",
    "footer.rights": "© 2026 Vartha Business Network. All rights reserved.",
    "footer.disclaimer": "Business, tax and legal information is for guidance only — verify with official sources.",

    "achievements.eyebrow": "Recognitions",
    "achievements.title": "Business Achievements",
    "achievements.empty": "No achievements published yet.",
    "achievements.seeAll": "See all achievements →",
    "achievements.related": "Related Achievements",
    "achievements.eyebrowDetail": "Achievement",
    "achievements.awardedByPrefix": "Awarded by",

    "strategies.eyebrow": "Strategies & Insights",
    "strategies.title": "Business Strategies",
    "strategies.eyebrowDetail": "Strategy",

    "stories.eyebrow": "Business Media",
    "stories.title": "Business Stories",
    "stories.readNext": "Read Next",
    "stories.empty": "No stories published yet.",

    "common.loading": "Loading…",
    "common.retry": "Try again",

    "newsletter.heading": "Newsletter",
    "newsletter.blurb": "Business news and insights in your inbox, once a week.",
    "newsletter.placeholder": "Your email address",
    "newsletter.button": "Subscribe",
    "newsletter.sending": "Sending…",
    "newsletter.success": "Thanks! You're subscribed.",
    "newsletter.error": "Something went wrong. Please try again.",
    "newsletter.invalidEmail": "Enter a valid email address.",
  },
};

export default translations;
