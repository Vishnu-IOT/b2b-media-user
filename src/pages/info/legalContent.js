/**
 * Privacy Policy and Terms & Conditions text, written by hand in English AND Tamil (no machine translation,
 * so the pages render instantly and never wait on a network call). The page shows the one for the current language.
 *
 * IMPORTANT: this is a good-faith starting draft written from what the platform does. Have a lawyer review
 * it (especially the governing-law, retention and grievance parts) before you rely on it.
 *
 * body items: a string = paragraph, { list: [...] } = bullet list, { contact: true } = contact card.
 */
const PRIVACY_EN = {
  title: "Privacy Policy",
  lead: "Your trust matters. This page explains what information Vartha Business Network collects, why we collect it, and the choices you have.",
  summary: [
    "We collect only what is needed to run your account, show business content and send the newsletter you ask for.",
    "Anything you publish (profile, questions, answers, enquiries) is public.",
    "You can unsubscribe, correct your details or ask us to delete your account at any time.",
  ],
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      body: [
        "Vartha Business Network (“Vartha”, “we”, “us”) is a business media and knowledge platform for the local business community. We publish business stories, achievements, strategies, new products, supplier enquiries, videos, resources and a business directory, and we run a Business Q&A space.",
        "For the personal information described in this policy, Vartha is the party that decides how and why it is used.",
      ],
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      body: [
        "We collect information in three ways: what you give us, what you create on the site, and a small amount of technical information.",
        {
          list: [
            "Account details: your name, e-mail address, account type and password when you register, plus the one-time code we e-mail you to verify your address.",
            "Business profile details: company name, logo, industry, location and descriptions you choose to add.",
            "Content you post: questions, answers, supplier enquiries and any other text or files you submit.",
            "Newsletter details: your e-mail address and your consent to receive the newsletter.",
            "Technical information: basic data our servers and your browser exchange to deliver pages, such as device and browser type, and the pages requested.",
          ],
        },
      ],
    },
    {
      id: "how-we-use-it",
      title: "How we use your information",
      body: [
        {
          list: [
            "To create and secure your account and to verify your e-mail address.",
            "To display your business profile, questions, answers and enquiries on the platform.",
            "To send the newsletter and service messages you have asked for.",
            "To keep the platform safe, prevent misuse and fix technical problems.",
            "To understand which sections are useful so that we can improve them.",
            "To meet our legal obligations.",
          ],
        },
        "We do not sell your personal information.",
      ],
    },
    {
      id: "public-content",
      title: "Public content",
      body: [
        "Business profiles, stories, questions, answers and supplier enquiries are published so that other people can read them. Anything you post may be seen by anyone, indexed by search engines and copied by others. Please do not post private or sensitive details such as bank or identity numbers.",
      ],
    },
    {
      id: "browser-storage",
      title: "Cookies and browser storage",
      body: [
        "We use your browser’s local storage, not advertising cookies, for the following purposes:",
        {
          list: [
            "Keeping you signed in (a login token).",
            "Remembering the interface text and translations we have already loaded, so pages open faster.",
            "Remembering short-lived choices during a visit.",
          ],
        },
        "You can clear this data at any time from your browser settings. If you do, you will simply be signed out and some pages may load a little slower the next time.",
      ],
    },
    {
      id: "third-parties",
      title: "Third-party services",
      body: [
        "We rely on a few outside services to run the platform. They receive only what they need to do their job.",
        {
          list: [
            "Translation: to show content in Tamil or English, text from public pages may be sent to a machine-translation service.",
            "Video: videos hosted on YouTube are played by YouTube, which may collect its own data when you press play. Please read its privacy policy.",
            "E-mail delivery: verification codes and the newsletter are sent through e-mail service providers.",
            "Social links: links to X, Facebook, Instagram and YouTube take you to those sites, which have their own policies.",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "When we share information",
      body: [
        "We share personal information only with the service providers described above, when the law requires it, or to protect the rights, safety and security of our users and the platform. If Vartha is ever merged with or taken over by another organisation, your information may be transferred to it, and we will tell you if that happens.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep information",
      body: [
        "We keep account and profile information while your account is active. If you delete your account, we remove or anonymise your personal information within a reasonable time, except where we must keep something to meet legal duties or to resolve a dispute. Newsletter details are kept until you unsubscribe.",
      ],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "We use reasonable technical and organisational measures to protect your information, including verifying e-mail addresses and limiting who can access our systems. No online service can be completely secure, so please use a strong, unique password and keep it private.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights and choices",
      body: [
        "You can ask us to:",
        {
          list: [
            "Show you the personal information we hold about you.",
            "Correct information that is wrong or out of date.",
            "Delete your account and personal information.",
            "Stop sending you the newsletter. Every newsletter has an unsubscribe link, and you can also use the Unsubscribe page on the site.",
            "Withdraw a consent you gave earlier. This does not affect what we did before you withdrew it.",
          ],
        },
        "These rights are in line with Indian data-protection law, including the Digital Personal Data Protection Act, 2023. To use any of them, or to raise a complaint, contact us using the details below.",
      ],
    },
    {
      id: "children",
      title: "Children",
      body: [
        "Vartha is meant for people running or working in businesses. It is not directed at children under 18, and we do not knowingly collect their personal information. If you believe a child has given us information, please contact us and we will delete it.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [
        "We may update this policy from time to time. When we make an important change, we will update the date at the top of this page and, where appropriate, tell you on the site or by e-mail.",
      ],
    },
    {
      id: "contact",
      title: "Contact and grievances",
      body: [
        "Questions, requests or complaints about your privacy? Write to us and we will reply as soon as we can.",
        { contact: true },
      ],
    },
  ],
};

const TERMS_EN = {
  title: "Terms & Conditions",
  lead: "These terms are the ground rules for using Vartha Business Network. They are written to be read, so please take a few minutes.",
  summary: [
    "Vartha is a content platform: there are no payments, bookings or marketplace deals on the site.",
    "You are responsible for what you post, so keep it truthful, lawful and respectful.",
    "Information here is guidance only. Check tax, legal and financial matters with official sources or a professional.",
  ],
  sections: [
    {
      id: "acceptance",
      title: "Accepting these terms",
      body: [
        "By visiting, registering on or using Vartha Business Network (the “Platform”), you agree to these Terms & Conditions and to our Privacy Policy. If you do not agree, please do not use the Platform.",
      ],
    },
    {
      id: "the-platform",
      title: "What the Platform is",
      body: [
        "Vartha publishes business stories, achievements, strategies, new products, supplier enquiries, videos, resources and a business directory, and hosts a Business Q&A space. It is a content and knowledge platform. We do not process payments, take bookings, run checkouts or operate a marketplace, and we are not a party to any dealings between users.",
      ],
    },
    {
      id: "accounts",
      title: "Accounts and eligibility",
      body: [
        {
          list: [
            "You must be at least 18 years old, or be acting for a business that is legally able to use the Platform.",
            "Give accurate information when you register and keep it up to date.",
            "Keep your password private. You are responsible for activity under your account, so tell us at once if you think it has been misused.",
            "One person or business should not hold several accounts to mislead others.",
          ],
        },
      ],
    },
    {
      id: "your-content",
      title: "Your content",
      body: [
        "You keep ownership of what you post, such as profile details, questions, answers and enquiries. By posting, you give Vartha a free, non-exclusive, worldwide licence to host, display, translate, adapt and share that content on the Platform and in our newsletters and social channels, so that we can run and promote the service.",
        "You promise that you have the right to post it and that it does not break the law or anyone else’s rights. You are responsible for your content, and we may remove content that breaks these terms.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      body: [
        "Please do not:",
        {
          list: [
            "Post false, misleading, defamatory, hateful, obscene or unlawful material.",
            "Impersonate a person or business, or claim a connection you do not have.",
            "Post spam, chain messages or unrelated advertising.",
            "Share other people’s private information without permission.",
            "Upload viruses, scrape the site at scale, or try to break or bypass its security.",
            "Use the Platform for anything illegal.",
          ],
        },
      ],
    },
    {
      id: "business-information",
      title: "Business information and enquiries",
      body: [
        "Business profiles and supplier enquiries are written by the businesses themselves. We do not check every detail and we do not endorse any business, product or supplier. Please do your own checks before you share money, goods or confidential information, and deal with others at your own risk.",
      ],
    },
    {
      id: "guidance-only",
      title: "Guidance only",
      body: [
        "Articles and resources about business, tax, GST, MSME schemes, finance and the law are general information. They are not professional advice and may be out of date. Always confirm important decisions with official sources or a qualified adviser.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Our intellectual property",
      body: [
        "The Vartha name, logo, design and the original material we publish belong to us or our licensors and are protected by law. You may read and share links to our content for personal, non-commercial use. You may not copy, republish or sell it without our written permission.",
      ],
    },
    {
      id: "translation-and-links",
      title: "Translations and third-party links",
      body: [
        "Some content is translated between Tamil and English by machine, which can contain mistakes. If the meaning matters, please check the original text. The Platform may link to or embed other sites and services, such as YouTube. We do not control them and are not responsible for what they say or do.",
      ],
    },
    {
      id: "communications",
      title: "Newsletter and messages",
      body: [
        "If you subscribe, we will send you the newsletter. You can unsubscribe at any time using the link in each e-mail or the Unsubscribe page. We may also send service messages, such as verification codes, that you need to use your account.",
      ],
    },
    {
      id: "suspension",
      title: "Suspension and ending your account",
      body: [
        "You can stop using the Platform and ask us to delete your account at any time. We may suspend or remove accounts or content that break these terms, put others at risk, or that we must remove by law.",
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      body: [
        "The Platform and everything on it are provided “as is” and “as available”. We work to keep it accurate and running, but we do not promise that it will be error-free, always available or free of harmful components.",
      ],
    },
    {
      id: "liability",
      title: "Limit of liability",
      body: [
        "To the fullest extent the law allows, Vartha and the people who work with it are not liable for indirect or consequential loss, loss of profit or data, or for anything that results from your dealings with other users or from relying on content. Nothing in these terms limits liability that cannot be limited by law.",
        "You agree to be responsible for any claim that arises because of content you post or because you broke these terms.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing law",
      body: [
        "These terms are governed by the laws of India. Any dispute will be handled by the courts that have jurisdiction at the location of our registered office.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: [
        "We may update these terms from time to time. The date at the top of this page shows when they last changed. If you keep using the Platform after a change, you accept the updated terms.",
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      body: [
        "Questions about these terms? We would be glad to help.",
        { contact: true },
      ],
    },
  ],
};

const PRIVACY_TA = {
  title: "தனியுரிமைக் கொள்கை",
  lead: "உங்கள் நம்பிக்கை எங்களுக்கு முக்கியம். வார்த்தா பிசினஸ் நெட்வொர்க் எந்தத் தகவலைச் சேகரிக்கிறது, ஏன் சேகரிக்கிறது, உங்களுக்கு என்ன தேர்வுகள் உள்ளன என்பதை இந்தப் பக்கம் விளக்குகிறது.",
  summary: [
    "உங்கள் கணக்கை இயக்கவும், வணிக உள்ளடக்கத்தைக் காட்டவும், நீங்கள் கேட்கும் செய்திமடலை அனுப்பவும் தேவையானதை மட்டுமே சேகரிக்கிறோம்.",
    "நீங்கள் வெளியிடும் அனைத்தும் (சுயவிவரம், கேள்விகள், பதில்கள், விசாரணைகள்) பொதுவில் தெரியும்.",
    "எந்த நேரத்திலும் குழுவிலகலாம், விவரங்களைத் திருத்தலாம் அல்லது கணக்கை நீக்கக் கோரலாம்.",
  ],
  sections: [
    {
      id: "who-we-are",
      title: "நாங்கள் யார்",
      body: [
        "வார்த்தா பிசினஸ் நெட்வொர்க் (“வார்த்தா”, “நாங்கள்”) என்பது உள்ளூர் வணிக சமூகத்திற்கான வணிக ஊடக மற்றும் அறிவுத் தளம். வணிகக் கதைகள், சாதனைகள், உத்திகள், புதிய தயாரிப்புகள், சப்ளையர் விசாரணைகள், வீடியோக்கள், வளங்கள் மற்றும் வணிக விவரக்குறிப்பை வெளியிடுகிறோம்; வணிக கேள்வி பதில் பகுதியையும் நடத்துகிறோம்.",
        "இந்தக் கொள்கையில் விவரிக்கப்படும் தனிப்பட்ட தகவல் எப்படி, எதற்காகப் பயன்படுத்தப்படுகிறது என்பதை முடிவு செய்பவர் வார்த்தா.",
      ],
    },
    {
      id: "information-we-collect",
      title: "நாங்கள் சேகரிக்கும் தகவல்",
      body: [
        "மூன்று வழிகளில் தகவலைச் சேகரிக்கிறோம்: நீங்கள் எங்களுக்குத் தருவது, நீங்கள் தளத்தில் உருவாக்குவது, மற்றும் சிறிதளவு தொழில்நுட்பத் தகவல்.",
        {
          list: [
            "கணக்கு விவரங்கள்: பதிவு செய்யும்போது உங்கள் பெயர், மின்னஞ்சல் முகவரி, கணக்கு வகை, கடவுச்சொல், மேலும் முகவரியைச் சரிபார்க்க அனுப்பும் ஒருமுறை குறியீடு.",
            "வணிக சுயவிவர விவரங்கள்: நீங்கள் சேர்க்க விரும்பும் நிறுவனப் பெயர், லோகோ, துறை, இருப்பிடம் மற்றும் விளக்கங்கள்.",
            "நீங்கள் பதிவிடும் உள்ளடக்கம்: கேள்விகள், பதில்கள், சப்ளையர் விசாரணைகள் மற்றும் நீங்கள் சமர்ப்பிக்கும் எந்த உரை அல்லது கோப்புகள்.",
            "செய்திமடல் விவரங்கள்: உங்கள் மின்னஞ்சல் முகவரி மற்றும் செய்திமடலைப் பெற நீங்கள் அளித்த சம்மதம்.",
            "தொழில்நுட்பத் தகவல்: பக்கங்களை வழங்க எங்கள் சேவையகங்களும் உங்கள் உலாவியும் பரிமாறும் அடிப்படைத் தரவு; சாதனம் மற்றும் உலாவி வகை, கோரப்பட்ட பக்கங்கள் போன்றவை.",
          ],
        },
      ],
    },
    {
      id: "how-we-use-it",
      title: "உங்கள் தகவலை எப்படிப் பயன்படுத்துகிறோம்",
      body: [
        {
          list: [
            "உங்கள் கணக்கை உருவாக்கவும் பாதுகாக்கவும், மின்னஞ்சல் முகவரியைச் சரிபார்க்கவும்.",
            "உங்கள் வணிக சுயவிவரம், கேள்விகள், பதில்கள் மற்றும் விசாரணைகளைத் தளத்தில் காட்ட.",
            "நீங்கள் கேட்ட செய்திமடலையும் சேவை செய்திகளையும் அனுப்ப.",
            "தளத்தைப் பாதுகாப்பாக வைத்திருக்கவும், தவறான பயன்பாட்டைத் தடுக்கவும், தொழில்நுட்பச் சிக்கல்களைச் சரிசெய்யவும்.",
            "எந்தப் பகுதிகள் பயனுள்ளவை என்பதைப் புரிந்து அவற்றை மேம்படுத்த.",
            "எங்கள் சட்டப்பூர்வக் கடமைகளை நிறைவேற்ற.",
          ],
        },
        "உங்கள் தனிப்பட்ட தகவலை நாங்கள் விற்பதில்லை.",
      ],
    },
    {
      id: "public-content",
      title: "பொது உள்ளடக்கம்",
      body: [
        "வணிக சுயவிவரங்கள், கதைகள், கேள்விகள், பதில்கள் மற்றும் சப்ளையர் விசாரணைகள் மற்றவர்கள் படிக்கும் வகையில் வெளியிடப்படுகின்றன. நீங்கள் பதிவிடும் எதையும் யார் வேண்டுமானாலும் பார்க்கலாம், தேடுபொறிகள் பட்டியலிடலாம், மற்றவர்கள் நகலெடுக்கலாம். வங்கி அல்லது அடையாள எண்கள் போன்ற தனிப்பட்ட, முக்கியமான விவரங்களைப் பதிவிட வேண்டாம்.",
      ],
    },
    {
      id: "browser-storage",
      title: "குக்கீகளும் உலாவி சேமிப்பும்",
      body: [
        "விளம்பரக் குக்கீகளை அல்லாமல், உங்கள் உலாவியின் உள்ளூர் சேமிப்பைக் கீழ்க்கண்ட நோக்கங்களுக்குப் பயன்படுத்துகிறோம்:",
        {
          list: [
            "நீங்கள் உள்நுழைந்த நிலையில் இருக்க (உள்நுழைவு டோக்கன்).",
            "ஏற்கனவே ஏற்றப்பட்ட இடைமுக உரைகளையும் மொழிபெயர்ப்புகளையும் நினைவில் வைத்து, பக்கங்களை விரைவாகத் திறக்க.",
            "ஒரு வருகையின் போது குறுகிய காலத் தேர்வுகளை நினைவில் வைக்க.",
          ],
        },
        "உங்கள் உலாவி அமைப்புகளில் இந்தத் தரவை எப்போது வேண்டுமானாலும் அழிக்கலாம். அழித்தால் நீங்கள் வெளியேற்றப்படுவீர்கள், அடுத்த முறை சில பக்கங்கள் சற்று மெதுவாக ஏற்றப்படலாம்.",
      ],
    },
    {
      id: "third-parties",
      title: "மூன்றாம் தரப்புச் சேவைகள்",
      body: [
        "தளத்தை இயக்க சில வெளிச் சேவைகளைச் சார்ந்துள்ளோம். அவை தங்கள் பணியைச் செய்யத் தேவையானதை மட்டுமே பெறுகின்றன.",
        {
          list: [
            "மொழிபெயர்ப்பு: உள்ளடக்கத்தை தமிழிலோ ஆங்கிலத்திலோ காட்ட, பொதுப் பக்கங்களின் உரை இயந்திர மொழிபெயர்ப்புச் சேவைக்கு அனுப்பப்படலாம்.",
            "வீடியோ: YouTube-இல் உள்ள வீடியோக்களை YouTube இயக்குகிறது; நீங்கள் இயக்கும்போது அது தனது சொந்தத் தரவைச் சேகரிக்கலாம். அதன் தனியுரிமைக் கொள்கையைப் படியுங்கள்.",
            "மின்னஞ்சல் அனுப்புதல்: சரிபார்ப்புக் குறியீடுகளும் செய்திமடலும் மின்னஞ்சல் சேவை வழங்குநர்கள் மூலம் அனுப்பப்படுகின்றன.",
            "சமூக இணைப்புகள்: X, Facebook, Instagram மற்றும் YouTube இணைப்புகள் உங்களை அந்தத் தளங்களுக்கு அழைத்துச் செல்லும்; அவற்றிற்குத் தனிக் கொள்கைகள் உள்ளன.",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "தகவலை எப்போது பகிர்கிறோம்",
      body: [
        "மேலே குறிப்பிட்ட சேவை வழங்குநர்களுடன், சட்டம் கோரும்போது, அல்லது எங்கள் பயனர்கள் மற்றும் தளத்தின் உரிமைகள், பாதுகாப்பைக் காக்க மட்டுமே தனிப்பட்ட தகவலைப் பகிர்கிறோம். வார்த்தா வேறொரு நிறுவனத்துடன் இணைந்தாலோ அதனால் கையகப்படுத்தப்பட்டாலோ, உங்கள் தகவல் அதற்கு மாற்றப்படலாம்; அப்போது உங்களுக்குத் தெரிவிப்போம்.",
      ],
    },
    {
      id: "retention",
      title: "தகவலை எவ்வளவு காலம் வைத்திருக்கிறோம்",
      body: [
        "உங்கள் கணக்கு செயலில் இருக்கும் வரை கணக்கு மற்றும் சுயவிவரத் தகவலை வைத்திருப்போம். கணக்கை நீக்கினால், சட்டக் கடமைகளுக்காக அல்லது சர்ச்சையைத் தீர்க்க வைத்திருக்க வேண்டியவை தவிர, உங்கள் தனிப்பட்ட தகவலை நியாயமான காலத்திற்குள் நீக்குவோம் அல்லது அடையாளம் நீக்குவோம். செய்திமடல் விவரங்கள் நீங்கள் குழுவிலகும் வரை வைக்கப்படும்.",
      ],
    },
    {
      id: "security",
      title: "பாதுகாப்பு",
      body: [
        "மின்னஞ்சல் முகவரிகளைச் சரிபார்த்தல், எங்கள் அமைப்புகளை அணுகக்கூடியவர்களை வரையறுத்தல் உள்ளிட்ட நியாயமான தொழில்நுட்ப மற்றும் நிர்வாக நடவடிக்கைகளால் உங்கள் தகவலைப் பாதுகாக்கிறோம். எந்த இணையச் சேவையும் முழுமையாகப் பாதுகாப்பானது அல்ல; எனவே வலுவான, தனித்துவமான கடவுச்சொல்லைப் பயன்படுத்தி அதை ரகசியமாக வையுங்கள்.",
      ],
    },
    {
      id: "your-rights",
      title: "உங்கள் உரிமைகளும் தேர்வுகளும்",
      body: [
        "நீங்கள் எங்களிடம் கோரலாம்:",
        {
          list: [
            "உங்களைப் பற்றி நாங்கள் வைத்திருக்கும் தனிப்பட்ட தகவலைக் காட்டுதல்.",
            "தவறான அல்லது காலாவதியான தகவலைத் திருத்துதல்.",
            "உங்கள் கணக்கையும் தனிப்பட்ட தகவலையும் நீக்குதல்.",
            "செய்திமடல் அனுப்புவதை நிறுத்துதல். ஒவ்வொரு செய்திமடலிலும் குழுவிலகல் இணைப்பு உள்ளது; தளத்தின் குழுவிலகல் பக்கத்தையும் பயன்படுத்தலாம்.",
            "முன்பு அளித்த சம்மதத்தைத் திரும்பப் பெறுதல். இது நீங்கள் திரும்பப் பெறும் முன் செய்தவற்றைப் பாதிக்காது.",
          ],
        },
        "இந்த உரிமைகள் டிஜிட்டல் தனிப்பட்ட தரவுப் பாதுகாப்புச் சட்டம், 2023 உள்ளிட்ட இந்தியத் தரவுப் பாதுகாப்புச் சட்டங்களுக்கு இணங்கியவை. இவற்றைப் பயன்படுத்த அல்லது புகார் அளிக்க, கீழுள்ள விவரங்களில் எங்களைத் தொடர்பு கொள்ளுங்கள்.",
      ],
    },
    {
      id: "children",
      title: "குழந்தைகள்",
      body: [
        "வார்த்தா வணிகம் நடத்துபவர்கள் அல்லது பணிபுரிபவர்களுக்கானது. 18 வயதுக்குட்பட்ட குழந்தைகளுக்காக இது வடிவமைக்கப்படவில்லை; அவர்களின் தனிப்பட்ட தகவலை அறிந்தே சேகரிப்பதில்லை. ஒரு குழந்தை தகவல் தந்துள்ளதாக நீங்கள் நம்பினால், எங்களைத் தொடர்பு கொள்ளுங்கள்; அதை நீக்குவோம்.",
      ],
    },
    {
      id: "changes",
      title: "இந்தக் கொள்கையில் மாற்றங்கள்",
      body: [
        "இந்தக் கொள்கையை அவ்வப்போது புதுப்பிக்கலாம். முக்கிய மாற்றம் செய்யும்போது, இந்தப் பக்கத்தின் மேலுள்ள தேதியைப் புதுப்பித்து, தேவையெனில் தளத்திலோ மின்னஞ்சலிலோ தெரிவிப்போம்.",
      ],
    },
    {
      id: "contact",
      title: "தொடர்பும் புகார்களும்",
      body: [
        "உங்கள் தனியுரிமை பற்றிய கேள்விகள், கோரிக்கைகள் அல்லது புகார்கள் உள்ளனவா? எங்களுக்கு எழுதுங்கள்; விரைவில் பதிலளிப்போம்.",
        { contact: true },
      ],
    },
  ],
};

const TERMS_TA = {
  title: "விதிமுறைகளும் நிபந்தனைகளும்",
  lead: "வார்த்தா பிசினஸ் நெட்வொர்க்கைப் பயன்படுத்துவதற்கான அடிப்படை விதிகள் இவை. படிக்கும்படி எழுதப்பட்டுள்ளன; சில நிமிடங்கள் ஒதுக்கிப் படியுங்கள்.",
  summary: [
    "வார்த்தா ஒரு உள்ளடக்கத் தளம்: இங்கு பணம் செலுத்துதல், முன்பதிவு அல்லது சந்தை வர்த்தகம் இல்லை.",
    "நீங்கள் பதிவிடுவதற்கு நீங்களே பொறுப்பு; உண்மையாகவும், சட்டப்படியும், மரியாதையுடனும் இருங்கள்.",
    "இங்குள்ள தகவல் வழிகாட்டுதல் மட்டுமே. வரி, சட்டம், நிதி விஷயங்களை அதிகாரப்பூர்வ ஆதாரங்களிலோ நிபுணரிடமோ சரிபாருங்கள்.",
  ],
  sections: [
    {
      id: "acceptance",
      title: "விதிமுறைகளை ஏற்றல்",
      body: [
        "வார்த்தா பிசினஸ் நெட்வொர்க்கை (“தளம்”) பார்வையிடுவதன் மூலமோ, அதில் பதிவு செய்வதன் மூலமோ, பயன்படுத்துவதன் மூலமோ, இந்த விதிமுறைகளுக்கும் எங்கள் தனியுரிமைக் கொள்கைக்கும் ஒப்புக்கொள்கிறீர்கள். ஒப்புக்கொள்ளவில்லை என்றால் தளத்தைப் பயன்படுத்த வேண்டாம்.",
      ],
    },
    {
      id: "the-platform",
      title: "தளம் என்றால் என்ன",
      body: [
        "வார்த்தா வணிகக் கதைகள், சாதனைகள், உத்திகள், புதிய தயாரிப்புகள், சப்ளையர் விசாரணைகள், வீடியோக்கள், வளங்கள் மற்றும் வணிக விவரக்குறிப்பை வெளியிடுகிறது; வணிக கேள்வி பதில் பகுதியையும் நடத்துகிறது. இது உள்ளடக்கம் மற்றும் அறிவுத் தளம். நாங்கள் பணம் செலுத்துதலை செயல்படுத்துவதில்லை, முன்பதிவு எடுப்பதில்லை, சந்தை நடத்துவதில்லை; பயனர்களுக்கு இடையிலான எந்த வர்த்தகத்திலும் நாங்கள் ஒரு தரப்பு அல்ல.",
      ],
    },
    {
      id: "accounts",
      title: "கணக்குகளும் தகுதியும்",
      body: [
        {
          list: [
            "நீங்கள் குறைந்தது 18 வயதுடையவராக இருக்க வேண்டும், அல்லது தளத்தைச் சட்டப்படி பயன்படுத்தக்கூடிய ஒரு வணிகத்தின் சார்பில் செயல்பட வேண்டும்.",
            "பதிவு செய்யும்போது சரியான தகவலைத் தந்து, அதைப் புதுப்பித்து வையுங்கள்.",
            "கடவுச்சொல்லை ரகசியமாக வையுங்கள். உங்கள் கணக்கில் நடப்பவற்றுக்கு நீங்களே பொறுப்பு; தவறாகப் பயன்படுத்தப்பட்டதாக நினைத்தால் உடனே தெரிவியுங்கள்.",
            "மற்றவர்களைத் தவறாக வழிநடத்த ஒருவர் அல்லது ஒரு வணிகம் பல கணக்குகளை வைத்திருக்கக் கூடாது.",
          ],
        },
      ],
    },
    {
      id: "your-content",
      title: "உங்கள் உள்ளடக்கம்",
      body: [
        "சுயவிவர விவரங்கள், கேள்விகள், பதில்கள், விசாரணைகள் போன்ற நீங்கள் பதிவிடுபவற்றுக்கு நீங்களே உரிமையாளர். பதிவிடுவதன் மூலம், சேவையை இயக்கவும் விளம்பரப்படுத்தவும், அந்த உள்ளடக்கத்தைத் தளத்திலும் எங்கள் செய்திமடல்கள் மற்றும் சமூக ஊடகங்களிலும் சேமிக்க, காட்ட, மொழிபெயர்க்க, மாற்றியமைக்க, பகிர வார்த்தாவுக்குக் கட்டணமற்ற, பிரத்தியேகமற்ற, உலகளாவிய உரிமம் வழங்குகிறீர்கள்.",
        "அதைப் பதிவிடும் உரிமை உங்களுக்கு உண்டு என்றும், அது சட்டத்தையோ பிறரின் உரிமைகளையோ மீறவில்லை என்றும் உறுதியளிக்கிறீர்கள். உங்கள் உள்ளடக்கத்திற்கு நீங்களே பொறுப்பு; இந்த விதிமுறைகளை மீறும் உள்ளடக்கத்தை நாங்கள் நீக்கலாம்.",
      ],
    },
    {
      id: "acceptable-use",
      title: "ஏற்கத்தக்க பயன்பாடு",
      body: [
        "தயவுசெய்து இவற்றைச் செய்யாதீர்கள்:",
        {
          list: [
            "பொய்யான, தவறாக வழிநடத்தும், அவதூறான, வெறுப்பு நிறைந்த, ஆபாசமான அல்லது சட்டவிரோதமான உள்ளடக்கத்தைப் பதிவிடுதல்.",
            "ஒருவர் அல்லது ஒரு வணிகம் போல ஆள்மாறாட்டம் செய்தல், அல்லது இல்லாத தொடர்பைக் கூறுதல்.",
            "ஸ்பேம், சங்கிலிச் செய்திகள் அல்லது தொடர்பற்ற விளம்பரங்களைப் பதிவிடுதல்.",
            "அனுமதியின்றி பிறரின் தனிப்பட்ட தகவலைப் பகிர்தல்.",
            "வைரஸ்களைப் பதிவேற்றுதல், தளத்தைப் பெருமளவில் நகலெடுத்தல், அல்லது அதன் பாதுகாப்பை உடைக்க முயல்தல்.",
            "சட்டவிரோதமான எதற்கும் தளத்தைப் பயன்படுத்துதல்.",
          ],
        },
      ],
    },
    {
      id: "business-information",
      title: "வணிகத் தகவலும் விசாரணைகளும்",
      body: [
        "வணிக சுயவிவரங்களையும் சப்ளையர் விசாரணைகளையும் வணிகங்களே எழுதுகின்றன. ஒவ்வொரு விவரத்தையும் நாங்கள் சரிபார்ப்பதில்லை; எந்த வணிகம், தயாரிப்பு அல்லது சப்ளையரையும் ஆதரிப்பதுமில்லை. பணம், பொருட்கள் அல்லது ரகசியத் தகவலைப் பகிரும் முன் நீங்களே சரிபார்த்துக் கொள்ளுங்கள்; மற்றவர்களுடனான வர்த்தகம் உங்கள் சொந்தப் பொறுப்பில்.",
      ],
    },
    {
      id: "guidance-only",
      title: "வழிகாட்டுதல் மட்டுமே",
      body: [
        "வணிகம், வரி, ஜிஎஸ்டி, MSME திட்டங்கள், நிதி மற்றும் சட்டம் பற்றிய கட்டுரைகளும் வளங்களும் பொதுத் தகவல்கள். அவை தொழில்முறை ஆலோசனை அல்ல; காலாவதியாகவும் இருக்கலாம். முக்கிய முடிவுகளை அதிகாரப்பூர்வ ஆதாரங்களிலோ தகுதியான ஆலோசகரிடமோ உறுதிப்படுத்துங்கள்.",
      ],
    },
    {
      id: "intellectual-property",
      title: "எங்கள் அறிவுசார் சொத்து",
      body: [
        "வார்த்தா பெயர், லோகோ, வடிவமைப்பு மற்றும் நாங்கள் வெளியிடும் அசல் உள்ளடக்கம் எங்களுக்கோ எங்கள் உரிமம் வழங்குநர்களுக்கோ சொந்தமானவை; சட்டத்தால் பாதுகாக்கப்பட்டவை. தனிப்பட்ட, வணிகம் சாராத பயன்பாட்டிற்காக எங்கள் உள்ளடக்கத்தைப் படிக்கலாம்; அதன் இணைப்புகளைப் பகிரலாம். எங்கள் எழுத்துப்பூர்வ அனுமதியின்றி நகலெடுக்க, மறுபதிப்பு செய்ய அல்லது விற்கக் கூடாது.",
      ],
    },
    {
      id: "translation-and-links",
      title: "மொழிபெயர்ப்புகளும் மூன்றாம் தரப்பு இணைப்புகளும்",
      body: [
        "சில உள்ளடக்கம் தமிழுக்கும் ஆங்கிலத்திற்கும் இடையே இயந்திரத்தால் மொழிபெயர்க்கப்படுகிறது; அதில் பிழைகள் இருக்கலாம். பொருள் முக்கியம் என்றால் அசல் உரையைச் சரிபாருங்கள். YouTube போன்ற பிற தளங்களுக்கு இணைப்புகள் அல்லது உட்பதிவுகள் இருக்கலாம். அவற்றை நாங்கள் கட்டுப்படுத்துவதில்லை; அவை சொல்வதற்கோ செய்வதற்கோ நாங்கள் பொறுப்பல்ல.",
      ],
    },
    {
      id: "communications",
      title: "செய்திமடலும் செய்திகளும்",
      body: [
        "நீங்கள் குழுசேர்ந்தால், செய்திமடலை அனுப்புவோம். ஒவ்வொரு மின்னஞ்சலிலும் உள்ள இணைப்பு அல்லது குழுவிலகல் பக்கம் மூலம் எப்போது வேண்டுமானாலும் குழுவிலகலாம். உங்கள் கணக்கைப் பயன்படுத்தத் தேவையான சரிபார்ப்புக் குறியீடுகள் போன்ற சேவைச் செய்திகளையும் அனுப்பலாம்.",
      ],
    },
    {
      id: "suspension",
      title: "இடைநீக்கமும் கணக்கை முடித்தலும்",
      body: [
        "தளத்தைப் பயன்படுத்துவதை எப்போது வேண்டுமானாலும் நிறுத்தலாம்; கணக்கை நீக்கக் கோரலாம். இந்த விதிமுறைகளை மீறும், பிறருக்கு ஆபத்து விளைவிக்கும், அல்லது சட்டப்படி நீக்க வேண்டிய கணக்குகளையும் உள்ளடக்கத்தையும் நாங்கள் இடைநீக்கலாம் அல்லது நீக்கலாம்.",
      ],
    },
    {
      id: "disclaimers",
      title: "மறுப்புகள்",
      body: [
        "தளமும் அதிலுள்ள அனைத்தும் “உள்ளபடி” மற்றும் “கிடைக்கும்படி” வழங்கப்படுகின்றன. துல்லியமாகவும் இயங்கும்படியும் வைக்க முயல்கிறோம்; ஆனால் அது பிழையற்றதாகவோ, எப்போதும் கிடைப்பதாகவோ, தீங்கு தரும் கூறுகளற்றதாகவோ இருக்கும் என்று உறுதி அளிப்பதில்லை.",
      ],
    },
    {
      id: "liability",
      title: "பொறுப்பின் வரம்பு",
      body: [
        "சட்டம் அனுமதிக்கும் அதிகபட்ச அளவில், மறைமுக அல்லது விளைவாக ஏற்படும் இழப்பு, லாபம் அல்லது தரவு இழப்பு, மற்ற பயனர்களுடனான உங்கள் வர்த்தகம் அல்லது உள்ளடக்கத்தை நம்பியதால் ஏற்படுவது ஆகியவற்றுக்கு வார்த்தாவும் அதனுடன் பணிபுரிபவர்களும் பொறுப்பல்ல. சட்டப்படி வரம்புக்குட்படுத்த முடியாத பொறுப்பை இந்த விதிமுறைகள் வரம்புக்குட்படுத்துவதில்லை.",
        "நீங்கள் பதிவிடும் உள்ளடக்கத்தாலோ இந்த விதிமுறைகளை மீறியதாலோ எழும் எந்தக் கோரிக்கைக்கும் நீங்களே பொறுப்பு என்று ஒப்புக்கொள்கிறீர்கள்.",
      ],
    },
    {
      id: "governing-law",
      title: "ஆளும் சட்டம்",
      body: [
        "இந்த விதிமுறைகள் இந்திய சட்டங்களால் நிர்வகிக்கப்படுகின்றன. எந்தச் சர்ச்சையும் எங்கள் பதிவு அலுவலகம் அமைந்துள்ள இடத்தில் அதிகாரம் கொண்ட நீதிமன்றங்களால் கையாளப்படும்.",
      ],
    },
    {
      id: "changes",
      title: "விதிமுறைகளில் மாற்றங்கள்",
      body: [
        "இந்த விதிமுறைகளை அவ்வப்போது புதுப்பிக்கலாம். இந்தப் பக்கத்தின் மேலுள்ள தேதி கடைசியாக மாற்றப்பட்ட நாளைக் காட்டும். மாற்றத்திற்குப் பின்னும் தளத்தைப் பயன்படுத்தினால், புதுப்பிக்கப்பட்ட விதிமுறைகளை ஏற்கிறீர்கள்.",
      ],
    },
    {
      id: "contact",
      title: "எங்களைத் தொடர்பு கொள்ள",
      body: [
        "இந்த விதிமுறைகள் பற்றிய கேள்விகளா? உதவ மகிழ்ச்சி.",
        { contact: true },
      ],
    },
  ],
};

export const PRIVACY = { en: PRIVACY_EN, ta: PRIVACY_TA };
export const TERMS = { en: TERMS_EN, ta: TERMS_TA };
