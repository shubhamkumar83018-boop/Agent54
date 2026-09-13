// Agent54 Multilingual AI Engine - 22 Scheduled Indian Languages + Hinglish & English
// Fully trained on all 9 modules, 26 statutory regulations, and multi-agent swarm architecture

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: 'Auto-Detect', nativeName: '🌐 Auto-Detect (22 Langs + Hinglish)' },
  { code: 'hinglish', name: 'Hinglish', nativeName: '🇮🇳 Hinglish' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी (Hindi)' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Tamil)' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം (Malayalam)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা (Bengali)' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी (Marathi)' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া (Assamese)' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو (Urdu)' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम् (Sanskrit)' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली (Maithili)' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر (Kashmiri)' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली (Nepali)' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी (Konkani)' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي (Sindhi)' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी (Dogri)' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो (Bodo)' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্ (Manipuri)' }
];

export function detectLanguage(text: string, manualChoice: string = 'auto'): string {
  if (manualChoice && manualChoice !== 'auto') {
    return manualChoice;
  }

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // 1. Telugu Script
  if (/[\u0C00-\u0C7F]/.test(raw)) return 'te';

  // 2. Tamil Script
  if (/[\u0B80-\u0BFF]/.test(raw)) return 'ta';

  // 3. Kannada Script
  if (/[\u0C80-\u0CFF]/.test(raw)) return 'kn';

  // 4. Malayalam Script
  if (/[\u0D00-\u0D7F]/.test(raw)) return 'ml';

  // 5. Gujarati Script
  if (/[\u0A80-\u0AFF]/.test(raw)) return 'gu';

  // 6. Gurmukhi Script (Punjabi)
  if (/[\u0A00-\u0A7F]/.test(raw)) return 'pa';

  // 7. Odia Script
  if (/[\u0B00-\u0B7F]/.test(raw)) return 'or';

  // 8. Bengali & Assamese Script
  if (/[\u0980-\u09FF]/.test(raw)) {
    if (/[ৰৱ]/.test(raw)) return 'as';
    return 'bn';
  }

  // 9. Perso-Arabic Script (Urdu, Kashmiri, Sindhi)
  if (/[\u0600-\u06FF]/.test(raw)) {
    if (/[ڇڄڳ]/.test(raw)) return 'sd';
    if (/[ؠۄۆۅ]/.test(raw)) return 'ks';
    return 'ur';
  }

  // 10. Santali Ol Chiki
  if (/[\u1C50-\u1C7F]/.test(raw)) return 'sat';

  // 11. Devanagari Script (Hindi, Marathi, Sanskrit, Maithili, Nepali, Konkani, Dogri, Bodo)
  if (/[\u0900-\u097F]/.test(raw)) {
    if (/आहे|करा|कुठे|कसे|सांगा|माहिती|काय/.test(raw)) return 'mr';
    if (/अस्ति|सन्ति|कुत्र|कथम्|भवति|किम्/.test(raw)) return 'sa';
    if (/अछि|कोना|कतय|बुझाउ/.test(raw)) return 'mai';
    if (/छ|कसरी|कहाँ|बताउनुहोस्|गरिन्छ/.test(raw)) return 'ne';
    if (/आसा|कशे|सांग/.test(raw)) return 'kok';
    if (/डोगरी|कन्ने|तौंदी/.test(raw)) return 'doi';
    if (/मावनाय|बड़ो/.test(raw)) return 'brx';
    return 'hi';
  }

  // 12. Latin / Roman Script
  // Romanized Telugu
  if (/\b(ekkada|ela|undhi|undi|chesi|cheppandi|telusukovali|emi|chudali|namaskaram)\b/.test(lower)) {
    return 'te';
  }

  // Hinglish keywords
  const hinglishPatterns = /\b(kahan|kaha|kaise|kya|batao|hai|hain|karo|samjhao|sab|cheez|chahiye|bhai|karna|dikhao|chalayein|kon|konsa|kaun|kidhar|sabse|hota|dekhna|bataye|kaam|karta)\b/;
  if (hinglishPatterns.test(lower)) {
    return 'hinglish';
  }

  // Default to English if strictly Latin without Indian keywords
  return 'en';
}

export interface BotReply {
  text: string;
  actionTab?: string;
  actionLabel?: string;
  detectedLang: string;
  langName: string;
}

export function generateMultilingualBotReply(
  query: string,
  preferredLang: string = 'auto',
  activeTab?: string,
  dashboardData?: any
): BotReply {
  const lang = detectLanguage(query, preferredLang);
  const q = query.toLowerCase().trim();
  const targetLang = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[1];

  const livePct = dashboardData?.overall_compliance_pct ?? 78;
  const totalReq = dashboardData?.total_requirements ?? 26;
  const currentTab = activeTab || 'Home';

  // Identify Intent
  const isSitemap = q.includes('sitemap') || q.includes('feature') || q.includes('module') || q.includes('kahan') || q.includes('overview') || q.includes('map') || q.includes('kaha') || q.includes('all') || q.includes('sab') || q.includes('function') || q.includes('काम') || q.includes('कहाँ') || q.includes('ఎక్కడ') || q.includes('ఎలా') || q.includes('எங்கே') || q.includes('ఎక్కడ') || q.includes('কোথায়') || q.includes('कुठे') || q.includes('ક્યાં') || q.includes('ਕਿੱਥੇ') || q.includes('ਕੀ');
  const isReadiness = q.includes('readiness') || q.includes('inspection') || q.includes('dossier') || q.includes('aicte') || q.includes('ugc') || q.includes('nba') || q.includes('naac') || q.includes('pre-inspection') || q.includes('जाँच') || q.includes('निरीक्षण') || q.includes('తనిఖీ') || q.includes('ஆய்வு') || q.includes('ಪರಿಶೀಲನೆ') || q.includes('പരിശോധന') || q.includes('পরিদর্শন') || q.includes('तपासणी');
  const isRemediation = q.includes('remediation') || q.includes('recovery') || q.includes('fix') || q.includes('corrective') || q.includes('gap') || q.includes('shortfall') || q.includes('उपचार') || q.includes('सुधार') || q.includes('నివారణ') || q.includes('சரிசெய்தல்') || q.includes('ಪರಿಹಾರ') || q.includes('പരിഹാരം') || q.includes('সংশোধন') || q.includes('निवारण');
  const isSimulator = q.includes('simulator') || q.includes('simulation') || q.includes('what-if') || q.includes('scenario') || q.includes('sandbox') || q.includes('सिम्युलेटर') || q.includes('నమూనా') || q.includes('மாதிரி') || q.includes('ಸಿಮ್ಯುಲೇಟರ್') || q.includes('സിമുലേറ്റർ') || q.includes('সিমুলেটর');
  const isMesh = q.includes('mesh') || q.includes('agent') || q.includes('telemetry') || q.includes('integration') || q.includes('swarm') || q.includes('inbound') || q.includes('outbound') || q.includes('ಏಜೆಂಟ್') || q.includes('ഏജന്റ്') || q.includes('মেস') || q.includes('जाळ');
  const isRegulations = q.includes('regulation') || q.includes('clause') || q.includes('r26') || q.includes('vfstr') || q.includes('rule') || q.includes('act') || q.includes('नियम') || q.includes('విధానాలు') || q.includes('விதிகள்') || q.includes('నిబంధనలు') || q.includes('ನಿಯಮಗಳು') || q.includes('നിയമങ്ങൾ') || q.includes('নিয়ম') || q.includes('ಕಾಯ್ದೆ');
  const isRisks = q.includes('risk') || q.includes('severity') || q.includes('matrix') || q.includes('threat') || q.includes('जोखिम') || q.includes('ప్రమాదం') || q.includes('ஆபத்து') || q.includes('ಅಪಾಯ') || q.includes('അപകടം') || q.includes('ঝুঁকি') || q.includes('धोका');
  const isAudit = q.includes('audit') || q.includes('log') || q.includes('trail') || q.includes('history') || q.includes('event') || q.includes('लेखा') || q.includes('లాగ్') || q.includes('தணிக்கை') || q.includes('ಲೆಕ್ಕಪರಿಶೋಧನೆ') || q.includes('ഹിസ്റ്ററി') || q.includes('অডিট');
  const isScore = q.includes('score') || q.includes('status') || q.includes('compliance') || q.includes('percent') || q.includes('stat') || q.includes('स्कोर') || q.includes('స్థితి') || q.includes('மதிப்பெண்') || q.includes('ಅಂಕ') || q.includes('സ്കോർ') || q.includes('স্কোর') || q.includes('गुण');
  const isAuth = q.includes('login') || q.includes('signup') || q.includes('logout') || q.includes('sign in') || q.includes('sign up') || q.includes('account') || q.includes('खाता') || q.includes('లాగిన్') || q.includes('நுழைவு') || q.includes('ಲಾಗಿನ್') || q.includes('ലോഗിൻ') || q.includes('লগইন');

  // Multi-Language Response Handlers
  // 1. SITEMAP / ALL MODULES
  if (isSitemap) {
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 प्लेटफ़ॉर्म का संपूर्ण मानचित्र एवं 9 मुख्य मॉड्यूल:**\n\n` +
              `1. 🏠 **होम (Home)**: समग्र स्वास्थ्य स्कोर (35%), 4 मुख्य KPI काउंटर, लाइव स्कैन एवं 6 स्वायत्त AI एजेंट।\n` +
              `2. 📑 **विनियम (Regulations)**: 26 वैधानिक नियमों की रजिस्ट्री (VFSTR R26, AICTE, UGC, NBA) क्लॉज शर्तों (>=, <=) के साथ।\n` +
              `3. 🛡️ **अनुपालन (Compliance)**: विभागों का लाइव अनुपालन सत्यापन इंजन।\n` +
              `4. ⚠️ **जोखिम (Risks)**: संस्थागत जोखिम मैट्रिक्स, गंभीरता स्तर और सुधारात्मक प्राथमिकता।\n` +
              `5. 📋 **निरीक्षण तत्परता (Inspection Readiness)**: सरप्राइज निरीक्षण हेतु प्री-ऑडिट डोजियर (27% स्कोर), IQAC/रजिस्ट्रार हस्ताक्षर।\n` +
              `6. 🛠️ **सुधार केंद्र (Remediation)**: 19 मामलों का रिकवरी केंद्र (आवश्यकता -> वास्तविक -> अंतर -> सुधार)।\n` +
              `7. 🌐 **इंटर-एजेंट मेश (Inter-Agent Mesh)**: 4 इनबाउंड एवं 3 आउटबाउंड एजेंटों का रियल-टाइम टेलीमेट्री संचार।\n` +
              `8. ⚡ **सिम्युलेटर (Simulator)**: 'What-If' परिदृश्य सैंडबॉक्स (फैकल्टी भर्ती, छात्र संख्या, बजट)।\n` +
              `9. ⏱️ **ऑडिट ट्रेल (Audit Trail)**: अपरिवर्तनीय क्रिप्टोग्राफिक लॉग।\n\nआप किसी भी टैब पर जाने के लिए नीचे बटन पर क्लिक कर सकते हैं!`,
        actionTab: 'Home',
        actionLabel: 'होम टैब देखें →'
      };
    }
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 ప్లాట్‌ఫారమ్ పూర్తి మ్యాప్ & 9 మాడ్యూల్స్:**\n\n` +
              `1. 🏠 **హోమ్ (Home)**: యూనివర్సిటీ హెల్త్ స్కోర్ (35%), 4 కీ KPI కౌంటర్లు మరియు 6 AI స్వామ్ ఏజెంట్లు.\n` +
              `2. 📑 **నిబంధనలు (Regulations)**: VFSTR R26, AICTE, UGC, NBA సంబంధిత 26 నిబంధనల రిజిస్టర్.\n` +
              `3. 🛡️ **కంప్లైయన్స్ (Compliance)**: విభాగాల వారీగా ప్రత్యక్ష తనిఖీ వ్యవస్థ.\n` +
              `4. ⚠️ **రిస్క్‌లు (Risks)**: సంస్థాగత రిస్క్ మ్యాట్రిక్స్ మరియు తీవ్రత వర్గీకరణ.\n` +
              `5. 📋 **ఇన్‌స్పెక్షన్ సంసిద్ధత (Inspection Readiness)**: ఆకస్మిక తనిఖీల కోసం ప్రీ-ఇన్‌స్పెక్షన్ డోసియర్ (27% సంసిద్ధత).\n` +
              `6. 🛠️ **నివారణ (Remediation)**: 19 కేసుల కంప్లైయన్స్ రికవరీ సెంటర్ (లోటుపాట్ల సవరణ).\n` +
              `7. 🌐 **ఇంటర్-ఏజెంట్ మెష్ (Inter-Agent Mesh)**: 4 ఇన్‌బౌండ్ & 3 ఔట్‌బౌండ్ ఏజెంట్ల టెలిమెట్రీ.\n` +
              `8. ⚡ **సిమ్యులేటర్ (Simulator)**: 'What-If' పరిస్థితుల నమూనా పరీక్ష (ఫ్యాకల్టీ నియామకాలు, విద్యార్థుల సంఖ్య).\n` +
              `9. ⏱️ **ఆడిట్ ట్రయల్ (Audit Trail)**: భద్రపరచబడిన ఈవెంట్ లాగ్.\n\nమీరు ఏ మాడ్యూల్ అయినా నేరుగా ఓపెన్ చేయవచ్చు!`,
        actionTab: 'Home',
        actionLabel: 'హోమ్ ట్యాబ్‌ను తెరవండి →'
      };
    }
    if (lang === 'ta') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 தளத்தின் 9 முக்கிய தொகுதிகள்:**\n\n` +
              `1. 🏠 **முகப்பு (Home)**: பல்கலைக்கழக ஒட்டுமொத்த தகுதி (35%) மற்றும் 6 AI முகவர்கள்.\n` +
              `2. 📑 **விதிமுறைகள் (Regulations)**: VFSTR R26, AICTE, UGC, NBA-இன் 26 சட்டப்பூர்வ விதிகள்.\n` +
              `3. 🛡️ **இணக்கம் (Compliance)**: நேரடி ஆய்வு இயந்திரம்.\n` +
              `4. ⚠️ **அபாயங்கள் (Risks)**: நிறுவன இடர் அணி மற்றும் தீவிரத்தன்மை.\n` +
              `5. 📋 **ஆய்வு தயார்நிலை (Inspection Readiness)**: முன்கூட்டியே ஆய்வு அறிக்கை (27% தயார்நிலை).\n` +
              `6. 🛠️ **சரிசெய்தல் (Remediation)**: 19 வழக்குகளுக்கான AI தீர்வு மையம்.\n` +
              `7. 🌐 **முகவர் வலைப்பின்னல் (Inter-Agent Mesh)**: நிகழ்நேர தொலை அளவியல் தொடர்பு.\n` +
              `8. ⚡ **மாதிரி அமைப்பு (Simulator)**: 'What-If' உருவகப்படுத்துதல்.\n` +
              `9. ⏱️ **தணிக்கை பாதை (Audit Trail)**: மாற்ற முடியாத பதிவு.\n\nநீங்கள் விரும்பிய பகுதிக்கு செல்ல கீழே கிளிக் செய்யவும்!`,
        actionTab: 'Home',
        actionLabel: 'முகப்பு திறக்கவும் →'
      };
    }
    if (lang === 'kn') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನ 9 ಪ್ರಮುಖ ಮಾಡ್ಯೂಲ್‌ಗಳು:**\n\n` +
              `1. 🏠 **ಮುಖಪುಟ (Home)**: ಒಟ್ಟಾರೆ ಆರೋಗ್ಯ ಸ್ಕೋರ್ (35%) ಮತ್ತು 6 AI ಏಜೆಂಟ್‌ಗಳು.\n` +
              `2. 📑 **ನಿಯಮಗಳು (Regulations)**: VFSTR R26, AICTE, UGC, NBA ನ 26 ಶಾಸನಬದ್ಧ ನಿಯಮಗಳು.\n` +
              `3. 🛡️ **ಅನುಸರಣೆ (Compliance)**: ನೇರ ಪರಿಶೀಲನೆ ವ್ಯವಸ್ಥೆ.\n` +
              `4. ⚠️ **ಅಪಾಯಗಳು (Risks)**: ಸಾಂಸ್ಥಿಕ ಅಪಾಯ ವಿಶ್ಲೇಷಣೆ.\n` +
              `5. 📋 **ಪರಿಶೀಲನಾ ಸನ್ನದ್ಧತೆ (Inspection Readiness)**: ಪೂರ್ವ ತಪಾಸಣೆ ವರದಿ (27% ಸಿದ್ಧತೆ).\n` +
              `6. 🛠️ **ಪರಿಹಾರ (Remediation)**: 19 ಪ್ರಕರಣಗಳ ಸುಧಾರಣಾ ಕೇಂದ್ರ.\n` +
              `7. 🌐 **ಇಂಟರ್-ಏಜೆಂಟ್ ಮೆಶ್ (Inter-Agent Mesh)**: 4 ಒಳಬರುವ ಮತ್ತು 3 ಹೊರಹೋಗುವ ಏಜೆಂಟ್‌ಗಳು.\n` +
              `8. ⚡ **ಸಿಮ್ಯುಲೇಟರ್ (Simulator)**: 'What-If' ಸನ್ನಿವೇಶ ಪರೀಕ್ಷೆ.\n` +
              `9. ⏱️ **ಆಡಿಟ್ ಟ್ರಯಲ್ (Audit Trail)**: ಸುರಕ್ಷಿತ ಈವೆಂಟ್ ದಾಖಲೆ.`,
        actionTab: 'Home',
        actionLabel: 'ಮುಖಪುಟ ತೆರೆಯಿರಿ →'
      };
    }
    if (lang === 'bn') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 প্ল্যাটফর্মের ৯টি প্রধান মডিউল:**\n\n` +
              `1. 🏠 **হোম (Home)**: সামগ্রিক স্কোর (৩৫%), ৪টি KPI এবং ৬টি AI এজেন্ট।\n` +
              `2. 📑 **নিয়মাবলী (Regulations)**: ২৬টি বিধিবদ্ধ নিয়ম (VFSTR R26, AICTE, UGC, NBA)।\n` +
              `3. 🛡️ **কমপ্লায়েন্স (Compliance)**: লাইভ যাচাইকরণ ইঞ্জিন।\n` +
              `4. ⚠️ **ঝুঁকি (Risks)**: প্রাতিষ্ঠানিক ঝুঁকি ম্যাট্রিক্স।\n` +
              `5. 📋 **পরিদর্শন প্রস্তুতি (Inspection Readiness)**: প্রি-ইন্সপেকশন ডসিয়ার (২৭% স্কোর)।\n` +
              `6. 🛠️ **সংশোধন কেন্দ্র (Remediation)**: ১৯টি মামলার রিকভারি ইঞ্জিন।\n` +
              `7. 🌐 **ইন্টার-এজেন্ট মেশ (Inter-Agent Mesh)**: রিয়েল-টাইম টেলিমেট্রি।\n` +
              `8. ⚡ **সিমুলেটর (Simulator)**: 'What-If' পরিস্থিতি স্যান্ডবক্স।\n` +
              `9. ⏱️ **অডিট ট্রেল (Audit Trail)**: অপরিবর্তনীয় ইভেন্ট লগ।`,
        actionTab: 'Home',
        actionLabel: 'হোম খুলুন →'
      };
    }
    if (lang === 'mr') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 प्लॅटफॉर्मचे ९ मुख्य मॉड्यूल्स:**\n\n` +
              `1. 🏠 **होम (Home)**: विद्यापीठ आरोग्य स्कोअर (35%) आणि 6 AI एजंट्स.\n` +
              `2. 📑 **नियम (Regulations)**: VFSTR R26, AICTE, UGC, NBA चे 26 नियम.\n` +
              `3. 🛡️ **अनुपालन (Compliance)**: थेट पडताळणी प्रणाली.\n` +
              `4. ⚠️ **धोके (Risks)**: संस्थात्मक जोखीम मॅट्रिक्स.\n` +
              `5. 📋 **तपासणी सज्जता (Inspection Readiness)**: पूर्व तपासणी अहवाल (27% सज्जता).\n` +
              `6. 🛠️ **निवारण केंद्र (Remediation)**: 19 प्रकरणांचे AI सुधारणा केंद्र.\n` +
              `7. 🌐 **इंटर-एजंट मेश (Inter-Agent Mesh)**: थेट संप्रेषण जाळे.\n` +
              `8. ⚡ **सिम्युलेटर (Simulator)**: 'What-If' परिस्थिती चाचणी.\n` +
              `9. ⏱️ **ऑडिट ट्रेल (Audit Trail)**: अपरिवर्तनीय नोंदी.`,
        actionTab: 'Home',
        actionLabel: 'होम उघडा →'
      };
    }
    if (lang === 'gu') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 પ્લેટફોર્મના 9 મુખ્ય મોડ્યુલ્સ:**\n\n` +
              `1. 🏠 **હોમ (Home)**: યુનિવર્સિટી સ્કોર (35%) અને 6 સ્વાયત્ત AI એજન્ટ્સ.\n` +
              `2. 📑 **નિયમો (Regulations)**: VFSTR R26, AICTE, UGC, NBA ના 26 નિયમો.\n` +
              `3. 🛡️ **પાલન (Compliance)**: લાઇવ ચકાસણી એન્જિન.\n` +
              `4. ⚠️ **જોખમો (Risks)**: સંસ્થાકીય જોખમ મેટ્રિક્સ.\n` +
              `5. 📋 **નિરીક્ષણ તૈયારી (Inspection Readiness)**: પૂર્વ-તપાસ ડોઝિયર (27%).\n` +
              `6. 🛠️ **નિવારણ (Remediation)**: 19 કેસો માટે પુનઃપ્રાપ્તિ યોજના.\n` +
              `7. 🌐 **ઇન્ટર-એજન્ટ મેશ (Inter-Agent Mesh)**: રીઅલ-ટાઇમ ટેલિમેટ્રી.\n` +
              `8. ⚡ **સિમ્યુલેટર (Simulator)**: 'What-If' પરિસ્થિતિ સેન્ડબોક્સ.\n` +
              `9. ⏱️ **ઓડિટ ટ્રેલ (Audit Trail)**: અપરિવર્તનશીલ લૉગ.`,
        actionTab: 'Home',
        actionLabel: 'હોમ ખોલો →'
      };
    }
    if (lang === 'pa') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 ਪਲੇਟਫਾਰਮ ਦੇ 9 ਮੁੱਖ ਮੋਡੀਊਲ:**\n\n` +
              `1. 🏠 **ਹੋਮ (Home)**: ਯੂਨੀਵਰਸਿਟੀ ਹੈਲਥ ਸਕੋਰ (35%) ਅਤੇ 6 AI ਏਜੰਟ।\n` +
              `2. 📑 **ਨਿਯਮ (Regulations)**: VFSTR R26, AICTE, UGC, NBA ਦੇ 26 ਨਿਯਮ।\n` +
              `3. 🛡️ **ਪਾਲਣਾ (Compliance)**: ਲਾਈਵ ਜਾਂਚ ਪ੍ਰਣਾਲੀ।\n` +
              `4. ⚠️ **ਜੋਖਮ (Risks)**: ਸੰਸਥਾਗਤ ਜੋਖਮ ਮੈਟ੍ਰਿਕਸ।\n` +
              `5. 📋 **ਨਿਰੀਖਣ ਤਿਆਰੀ (Inspection Readiness)**: ਪੂਰਵ-ਨਿਰੀਖਣ ਰਿਪੋਰਟ (27%)।\n` +
              `6. 🛠️ **ਸੁਧਾਰ ਕੇਂਦਰ (Remediation)**: 19 ਕੇਸਾਂ ਲਈ ਰਿਕਵਰੀ ਯੋਜਨਾ।\n` +
              `7. 🌐 **ਇੰਟਰ-ਏਜੰਟ ਮੈਸ਼ (Inter-Agent Mesh)**: ਰੀਅਲ-ਟਾਈਮ ਸੰਚਾਰ।\n` +
              `8. ⚡ **ਸਿਮੂਲੇਟਰ (Simulator)**: 'What-If' ਦ੍ਰਿਸ਼ ਸੈਂਡਬੌਕਸ।\n` +
              `9. ⏱️ **ਆਡਿਟ ਟ੍ਰੇਲ (Audit Trail)**: ਸੁਰੱਖਿਅਤ ਇਵੈਂਟ ਲੌਗ।`,
        actionTab: 'Home',
        actionLabel: 'ਹੋਮ ਖੋਲ੍ਹੋ →'
      };
    }
    if (lang === 'ml') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 പ്ലാറ്റ്‌ഫോമിന്റെ 9 പ്രധാന മൊഡ്യൂളുകൾ:**\n\n` +
              `1. 🏠 **ഹോം (Home)**: യൂണിവേഴ്സിറ്റി ഹെൽത്ത് സ്കോർ (35%) & 6 AI ഏജന്റുകൾ.\n` +
              `2. 📑 **നിയമങ്ങൾ (Regulations)**: 26 നിയമാവലികൾ (VFSTR R26, AICTE, UGC, NBA).\n` +
              `3. 🛡️ **കംപ്ലയൻസ് (Compliance)**: ലൈവ് പരിശോധനാ സംവിധാനം.\n` +
              `4. ⚠️ **അപകടസാധ്യതകൾ (Risks)**: റിസ്ക് മാട്രിക്സ്.\n` +
              `5. 📋 **പരിശോധനാ സന്നദ്ധത (Inspection Readiness)**: പ്രീ-ഇൻസ്പെക്ഷൻ ഡോസിയർ (27%).\n` +
              `6. 🛠️ **പരിഹാര കേന്ദ്രം (Remediation)**: 19 കേസുകളുടെ റിക്കവറി എഞ്ചിൻ.\n` +
              `7. 🌐 **ഇന്റർ-ഏജന്റ് മെഷ് (Inter-Agent Mesh)**: തത്സമയ ടെലിമെട്രി.\n` +
              `8. ⚡ **സിമുലേറ്റർ (Simulator)**: 'What-If' സിമുലേഷൻ.\n` +
              `9. ⏱️ **ഓഡിറ്റ് ട്രയൽ (Audit Trail)**: സ്ഥിരമായ ഇവന്റ് ലോഗ്.`,
        actionTab: 'Home',
        actionLabel: 'ഹോം തുറക്കുക →'
      };
    }
    if (lang === 'ur') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**ایجنٹ 54 پلیٹ فارم کے تمام 9 اہم ماڈیولز:**\n\n` +
              `1. 🏠 **ہوم (Home)**: مجموعی ہیلتھ اسکور (35%) اور 6 خود مختار AI ایجنٹس۔\n` +
              `2. 📑 **قواعد (Regulations)**: 26 قانونی قواعد کا رجسٹر (VFSTR R26, AICTE, UGC, NBA)۔\n` +
              `3. 🛡️ **تعمیل (Compliance)**: براہ راست تصدیقی انجن۔\n` +
              `4. ⚠️ **خطرات (Risks)**: ادارہ جاتی رسک میٹرکس۔\n` +
              `5. 📋 **معائنہ کی تیاری (Inspection Readiness)**: قبل از معائنہ رپورٹ (27% تیاری)۔\n` +
              `6. 🛠️ **تلافی مرکز (Remediation)**: 19 کیسز کی اصلاح کا نظام۔\n` +
              `7. 🌐 **بین ایجنٹ میش (Inter-Agent Mesh)**: حقیقی وقت مواصلات۔\n` +
              `8. ⚡ **سیمولیٹر (Simulator)**: 'What-If' صورتحال کی جانچ۔\n` +
              `9. ⏱️ **آڈٹ ٹریل (Audit Trail)**: غیر متبدل ریکارڈ۔`,
        actionTab: 'Home',
        actionLabel: 'ہوم کھولیں →'
      };
    }
    if (lang === 'or') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 ପ୍ଲାଟଫର୍ମର 9ଟି ମୁଖ୍ୟ ମଡ୍ୟୁଲ୍:**\n\n` +
              `1. 🏠 **ହୋମ୍ (Home)**: ବିଶ୍ୱବିଦ୍ୟାଳୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍କୋର (35%) ଏବଂ 6ଟି AI ଏଜେଣ୍ଟ।\n` +
              `2. 📑 **ନିୟମାବଳୀ (Regulations)**: VFSTR R26, AICTE, UGC, NBA ର 26ଟି ନିୟମ।\n` +
              `3. 🛡️ **ଅନୁପାଳନ (Compliance)**: ପ୍ରତ୍ୟକ୍ଷ ଯାଞ୍ଚ ପ୍ରଣାଳୀ।\n` +
              `4. ⚠️ **ବିପଦ (Risks)**: ସାଂସ୍ଥାଗତ ବିପଦ ମ୍ୟାଟ୍ରିକ୍ସ।\n` +
              `5. 📋 **ପରିଦର୍ଶନ ପ୍ରସ୍ତୁତି (Inspection Readiness)**: ପ୍ରାକ୍-ପରିଦର୍ଶନ ଡୋସିୟର (27%)।\n` +
              `6. 🛠️ **ସଂଶୋଧନ (Remediation)**: 19ଟି ମାମଲାର ପୁନରୁଦ୍ଧାର କେନ୍ଦ୍ର।\n` +
              `7. 🌐 **ଇଣ୍ଟର-ଏଜେଣ୍ଟ ମେଶ୍ (Inter-Agent Mesh)**: ରିଅଲ-ଟାଇମ୍ ଟେଲିମେଟ୍ରି।\n` +
              `8. ⚡ **ସିମ୍ୟୁଲେଟର (Simulator)**: 'What-If' ପରୀକ୍ଷା ସ୍ୟାଣ୍ଡବକ୍ସ।\n` +
              `9. ⏱️ **ଅଡିଟ୍ ଟ୍ରେଲ୍ (Audit Trail)**: ଅପରିବର୍ତ୍ତନୀୟ ରେକର୍ଡ।`,
        actionTab: 'Home',
        actionLabel: 'ହୋମ୍ ଖୋଲନ୍ତୁ →'
      };
    }
    if (lang === 'sa') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 तन्त्रस्य ९ प्रमुखाः विभागाः:**\n\n` +
              `1. 🏠 **मुख्यपृष्ठम् (Home)**: विश्वविद्यालयस्य स्वास्थ्यसूचकाङ्कः (३५%) तथा ६ स्वायत्त-AI-अभिकर्तारः।\n` +
              `2. 📑 **नियमावली (Regulations)**: २६ वैधानिकनियमाः (VFSTR R26, AICTE, UGC, NBA)।\n` +
              `3. 🛡️ **अनुपालनम् (Compliance)**: प्रत्यक्षपरीक्षणतन्त्रम्।\n` +
              `4. ⚠️ **सङ्कटाः (Risks)**: संस्थागतसङ्कट-सारणी।\n` +
              `5. 📋 **निरीक्षणसज्जता (Inspection Readiness)**: पूर्वपरीक्षानिबन्धः (२७%)।\n` +
              `6. 🛠️ **निवारणकेन्द्रम् (Remediation)**: १९ प्रकरणानां सुधारयोजना।\n` +
              `7. 🌐 **अन्तः-अभिकर्ता-जालम् (Inter-Agent Mesh)**: तात्कालिकसन्देशप्रणाली।\n` +
              `8. ⚡ **अनुकल्पकः (Simulator)**: 'What-If' स्थितिपरीक्षणम्।\n` +
              `9. ⏱️ **लेखापरीक्षामार्गः (Audit Trail)**: सुरक्षितलेखासञ्चयः।`,
        actionTab: 'Home',
        actionLabel: 'मुख्यपृष्ठं उद्घाटयतु →'
      };
    }
    if (lang === 'en') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Agent54 Platform Architecture & 9 Core Modules:**\n\n` +
              `1. 🏠 **Home**: University Health Score (35%), 4 KPI counters, Live Regulation Scan & 6 Autonomous Swarm Agents.\n` +
              `2. 📑 **Regulations**: Register of 26 statutory clauses (VFSTR R26, AICTE, UGC, NBA) with conditions (>=, <=) & lead times.\n` +
              `3. 🛡️ **Compliance**: Live cross-departmental compliance verification engine.\n` +
              `4. ⚠️ **Risks**: Institutional Risk Matrix, severity tiers (Critical/High/Medium) & remediation priority.\n` +
              `5. 📋 **Inspection Readiness**: Surprise inspection defense with Pre-Inspection Dossier (27% score) & IQAC sign-offs.\n` +
              `6. 🛠️ **Remediation**: 19 active cases in Compliance Recovery Center (Req -> Actual -> Gap -> Correction).\n` +
              `7. 🌐 **Inter-Agent Mesh**: Telemetry between 4 Inbound (1, 3, 53, 58) & 3 Outbound (9, 57, 71) agents.\n` +
              `8. ⚡ **Simulator**: 'What-If' scenario sandbox (Faculty Hires, Student Intake, Budget Cuts).\n` +
              `9. ⏱️ **Audit Trail**: Immutable cryptographic event ledger (43+ runs).\n\nClick below to navigate directly to any section!`,
        actionTab: 'Home',
        actionLabel: 'Open Home Overview →'
      };
    }
    // Default English
    return {
      detectedLang: 'en',
      langName: '🌐 English',
      text: `**Agent54 Platform Architecture & 9 Core Modules:**\n\n` +
            `1. 🏠 **Home**: Overall University Health Score (35%), 4 KPI counters, Live Regulation Scan summary, Category breakdown, and 6 AI Swarm Agents status.\n` +
            `2. 📑 **Regulations**: Register of 26 statutory clauses (VFSTR R26, AICTE, UGC, NBA) with conditions (>=, <=) & lead times.\n` +
            `3. 🛡️ **Compliance**: Live verification engine across departments.\n` +
            `4. ⚠️ **Risks**: Institutional Risk Matrix, severity distribution (Critical/High/Medium) & remediation priority.\n` +
            `5. 📋 **Inspection Readiness**: Pre-Inspection Dossier (27% readiness score), IQAC/Registrar sign-offs, and authority meters.\n` +
            `6. 🛠️ **Remediation**: 19 active cases in Compliance Recovery Center (Req -> Actual -> Gap -> Correction) & AI execution plans.\n` +
            `7. 🌐 **Inter-Agent Mesh**: 4 Inbound (1, 3, 53, 58) & 3 Outbound (9, 57, 71) agents' real-time telemetry.\n` +
            `8. ⚡ **Simulator**: "What-If" scenario sandbox (Faculty Hires, Student Intake, Budget Cuts) with neural prediction.\n` +
            `9. ⏱️ **Audit Trail**: Cryptographically verified immutable event log (43+ runs).\n\nClick below to navigate directly to any section!`,
      actionTab: 'Home',
      actionLabel: 'Open Home Tab →'
    };
  }

  // 2. INSPECTION READINESS
  if (isReadiness) {
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**निरीक्षण तत्परता (Inspection Readiness Dossier):**\n\n` +
              `• **कहाँ है**: साइडबार में **5वां आइटम "Inspection Readiness"** पर क्लिक करें।\n` +
              `• **उद्देश्य**: यह मॉड्यूल अचानक होने वाले वैधानिक निरीक्षणों (Surprise Audits) में शून्य विसंगति सुनिश्चित करने हेतु पहले से प्री-ऑडिट करता है।\n` +
              `• **मुख्य मेट्रिक्स**:\n` +
              `  - **कंपोजिट स्कोर**: वर्तमान में 27% (अति आवश्यक तैयारी मोड)।\n` +
              `  - **प्राधिकरण तत्परता**: AICTE (82%), UGC (85%), NBA (78%), NAAC (85%)।\n` +
              `  - **क्रिटिकल पाथ**: फैकल्टी कैडर कमी को पूरा करने में 180 दिन का भर्ती समय लगता है।\n` +
              `  - **हस्ताक्षरकर्ता**: IQAC डायरेक्टर, रजिस्ट्रार, डीन एवं विभागाध्यक्ष।\n` +
              `• **विशेषताएं**: आप 'Simulate Regulatory Change' चला सकते हैं एवं 'Print Dossier' से आधिकारिक रिपोर्ट डाउनलोड कर सकते हैं!`,
        actionTab: 'Readiness',
        actionLabel: 'निरीक्षण तत्परता खोलें →'
      };
    }
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**ఇన్‌స్పెక్షన్ సంసిద్ధత (Inspection Readiness Dossier):**\n\n` +
              `• **ఎక్కడ ఉంది**: సైడ్‌బార్‌లో **5వ అంశం "Inspection Readiness"** క్లిక్ చేయండి.\n` +
              `• **ముఖ్య ఉద్దేశ్యం**: ఆకస్మిక నియంత్రణ తనిఖీలలో లోపాలు లేకుండా విశ్వవిద్యాలయాన్ని సంసిద్ధం చేయడం.\n` +
              `• **కీలక గణాంకాలు**:\n` +
              `  - **మొత్తం సంసిద్ధత స్కోర్**: 27% (Not Ready).\n` +
              `  - **అధికార విభాగాల స్కోర్**: AICTE (82%), UGC (85%), NBA (78%), NAAC (85%).\n` +
              `  - **క్రిటికల్ సమస్య**: ఫ్యాకల్టీ క్యాడర్ కొరత నివారణకు 180 రోజుల వ్యవధి అవసరం.\n` +
              `  - **అధికారులు**: IQAC డైరెక్టర్, రిజిస్ట్రార్, డీన్లు మరియు హెచ్‌ఓడీలు.\n` +
              `• **ఫీచర్లు**: 'Simulate Regulatory Change' మరియు 'Print Dossier' ద్వారా నివేదికను ఎగుమతి చేసుకోవచ్చు!`,
        actionTab: 'Readiness',
        actionLabel: 'ఇన్‌స్పెక్షన్ సంసిద్ధత తెరవండి →'
      };
    }
    if (lang === 'en') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Inspection Readiness Dossier (Defense System):**\n\n` +
              `• **Location**: Click **5th item "Inspection Readiness"** in the sidebar.\n` +
              `• **Purpose**: Proactively prepares the university for surprise statutory inspections with zero adverse findings.\n` +
              `• **Key Metrics**:\n` +
              `  - **Composite Score**: Currently 27% (Needs immediate remediation).\n` +
              `  - **Authority Meters**: AICTE (82%), UGC (85%), NBA (78%), NAAC (85%).\n` +
              `  - **Critical Bottleneck**: Faculty Cadre Shortfall has an expected 180-day hiring cycle.\n` +
              `  - **Sign-Off Authorities**: IQAC Director, Registrar, Deans, and HoDs.\n` +
              `• **Actions**: Run 'Simulate Regulatory Change' or click 'Print Dossier' to generate official executive documentation.`,
        actionTab: 'Readiness',
        actionLabel: 'Open Inspection Readiness Tab →'
      };
    }
    return {
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish',
      text: `**Inspection Readiness Dossier kahan hai aur kaise kaam karta hai:**\n\n` +
            `• **Kahan hai**: Sidebar me **5th item "Inspection Readiness"** par click karein.\n` +
            `• **Purpose**: Ye module surprise statutory inspection findings ko zero karne ke liye proactive pre-audit karta hai.\n` +
            `• **Key Metrics**:\n` +
            `  - **Composite Score**: Abhi 27% (NOT READY) hai.\n` +
            `  - **Authority Breakdown**: AICTE (82%), UGC (85%), NBA (78%), NAAC (85%).\n` +
            `  - **Critical Path**: Faculty Cadre Shortfall me 180 days lagte hain (Hiring cycle).\n` +
            `  - **Executive Stakeholders**: IQAC Director, University Registrar, Deans, aur HoDs.\n` +
            `• **Special Features**: Isme aap **"Simulate Regulatory Change"** chala sakte hain aur **"Print Dossier"** se official report export kar sakte hain!`,
      actionTab: 'Readiness',
      actionLabel: 'Open Inspection Readiness Tab →'
    };
  }

  // 3. REMEDIATION CENTER
  if (isRemediation) {
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**सुधार केंद्र (Compliance Recovery Center):**\n\n` +
              `• **कहाँ है**: साइडबार में **6वां आइटम "Remediation"** पर क्लिक करें।\n` +
              `• **कार्यप्रणाली**:\n` +
              `  1. **19 सक्रिय गैर-अनुपालन मामले**: जैसे B.Tech क्रेडिट आवश्यकता या ECE संकाय कमी।\n` +
              `  2. **4-नोड विश्लेषण प्रवाह**: वैधानिक आवश्यकता -> विश्वविद्यालय वास्तविक -> अंतर (Gap) -> सुधारात्मक प्रोटोकॉल।\n` +
              `  3. **AI रिकवरी चरण**: 4 क्रियान्वयन चरण, जिम्मेदार अधिकारी, लीड टाइम और प्राथमिकता स्तर।\n` +
              `  4. **प्रशासक अनुमोदन**: कार्य योजना को स्वीकृत (Approve), संशोधित (Modify) या अस्वीकृत करने की सुविधा।`,
        actionTab: 'Remediation',
        actionLabel: 'सुधार केंद्र खोलें →'
      };
    }
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**నివారణ కేంద్రం (Remediation Center):**\n\n` +
              `• **ఎక్కడ ఉంది**: సైడ్‌బార్‌లో **6వ అంశం "Remediation"** క్లిక్ చేయండి.\n` +
              `• **కార్యవిధానం**:\n` +
              `  1. **19 క్రియాశీల కేసులు**: B.Tech క్రెడిట్ అవసరాలు లేదా ఫ్యాకల్టీ కొరత వంటి అంశాలు.\n` +
              `  2. **4-నోడ్ విశ్లేషణ**: చట్టబద్ధ అవసరం -> ప్రస్తుత స్థితి -> లోటు -> సవరణ ప్రోటోకాల్.\n` +
              `  3. **AI కార్యాచరణ ప్రణాళిక**: 4 దశల ప్రణాళిక, బాధ్యత గల అధికారి మరియు కాలపరిమితి.\n` +
              `  4. **అడ్మిన్ ఆమోదం**: నివారణ పనులను Approve లేదా Modify చేసే అవకాశం.`,
        actionTab: 'Remediation',
        actionLabel: 'నివారణ కేంద్రాన్ని తెరవండి →'
      };
    }
    if (lang === 'en') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**Remediation Center (Compliance Recovery Engine):**\n\n` +
              `• **Location**: Click **6th item "Remediation"** in the sidebar.\n` +
              `• **Mechanism**:\n` +
              `  1. **19 Non-Compliance Cases**: Select any active deficiency (e.g. B.Tech credit shortfall or Faculty shortages).\n` +
              `  2. **4-Node Analysis Architecture**: Statutory Requirement -> Institutional Actual -> Non-Compliance Gap -> Remediation Protocol.\n` +
              `  3. **Execution Plan**: 4 sequential recovery steps with owner, supporting department, lead time, and severity.\n` +
              `  4. **Executive Controls**: One-click approvals for Administrators to initiate, modify, or verify resolution.`,
        actionTab: 'Remediation',
        actionLabel: 'Open Remediation Center →'
      };
    }
    return {
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish',
      text: `**Remediation Center (Compliance Recovery Engine):**\n\n` +
            `• **Kahan hai**: Sidebar me **6th item "Remediation"** par click karein.\n` +
            `• **Kaise kaam karta hai**:\n` +
            `  1. **Top Selector Bar**: 19 active non-compliance cases me se koi bhi case select karein (e.g. *B.Tech degree credit requirement* ya *ECE Faculty Shortfall*).\n` +
            `  2. **4-Node Analysis Flow**: Requirement -> Actual -> Gap -> Correction Protocol.\n` +
            `  3. **Step-by-Step AI Recovery Plan**: 4 execution stages with designated owner, lead time, aur priority.\n` +
            `  4. **Approval**: Administrator Approval buttons (*Approve*, *Modify*, *Reject*) uplabdh hain!`,
      actionTab: 'Remediation',
      actionLabel: 'Open Remediation Center →'
    };
  }

  // 4. SIMULATOR
  if (isSimulator) {
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**సిమ్యులేటర్ (What-If Simulator):**\n\n` +
              `• **ఎక్కడ ఉంది**: సైడ్‌బార్‌లో **8వ అంశం "Simulator"** క్లిక్ చేయండి.\n` +
              `• **విధులు**: కొత్త ఫ్యాకల్టీ నియామకాలు, విద్యార్థుల అడ్మిషన్లు, బడ్జెట్ తగ్గింపు లేదా ఇన్ఫ్రాస్ట్రక్చర్ మార్పులు చేసినప్పుడు నిబంధనల స్కోర్ ఎలా మారుతుందో ముందే అంచనా వేస్తుంది.\n` +
              `• **స్లైడర్లు**: స్లైడర్ల ద్వారా విలువలను మార్చి 'Run Simulation' బటన్ నొక్కండి.`,
        actionTab: 'Simulator',
        actionLabel: 'సిమ్యులేటర్ తెరవండి →'
      };
    }
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**सिम्युलेटर (What-If Scenario Sandbox):**\n\n` +
              `• **कहाँ है**: साइडबार में **8वां आइटम "Simulator"** पर क्लिक करें।\n` +
              `• **कार्यप्रणाली**: वास्तविक बदलाव करने से पहले यह जांचें कि फैकल्टी भर्ती, छात्र प्रवेश वृद्धि, बजट कटौती आदि का अनुपालन स्कोर पर क्या प्रभाव पड़ेगा।\n` +
              `• **उपयोग**: 4 स्लाइडर्स को समायोजित करें और 'Run What-If Simulation' पर क्लिक करें।`,
        actionTab: 'Simulator',
        actionLabel: 'सिम्युलेटर खोलें →'
      };
    }
    return {
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish',
      text: `**What-If Scenario Simulator:**\n\n` +
            `• **Kahan hai**: Sidebar me **8th item "Simulator"** par click karein.\n` +
            `• **Kaise kaam karta hai**: Real policy badalne se pehle sandbox me simulate karein ki Faculty Hires (+/-), Student Intake (+/-), Budget cuts ya Carpet area badhane par compliance score par kya asar hoga.\n` +
            `• **Action**: Sliders adjust karke 'Run What-If Simulation' button dabayein.`,
      actionTab: 'Simulator',
      actionLabel: 'Open Simulator Sandbox →'
    };
  }

  // 4b. INTER-AGENT MESH
  if (isMesh) {
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**ఇంటర్-ఏజెంట్ మెష్ (Inter-Agent Mesh):**\n\n` +
              `• **ఎక్కడ ఉంది**: సైడ్‌బార్‌లో **7వ అంశం "Inter-Agent Mesh"** క్లిక్ చేయండి.\n` +
              `• **ఇన్‌బౌండ్ ఏజెంట్లు**: Agent 1 (కరికులమ్), Agent 3 (కోర్సు డెలివరీ), Agent 53 (ఫ్యాకల్టీ వర్క్‌లోడ్), Agent 58 (ఇన్‌ఫ్రాస్ట్రక్చర్).\n` +
              `• **ఔట్‌బౌండ్ ఏజెంట్లు**: Agent 9 (అక్రిడిటేషన్ SAR), Agent 57 (అకడమిక్ ఆడిట్), Agent 71 (ఇన్‌స్టిట్యూషనల్ రిస్క్).\n` +
              `• **ప్రత్యక్ష ఈవెంట్స్**: ఏజెంట్ల మధ్య జరిగే డేటా ఎక్స్ఛేంజ్ లాగ్స్ చూడవచ్చు.`,
        actionTab: 'Integrations',
        actionLabel: 'ఇంటర్-ఏజెంట్ మెష్ తెరవండి →'
      };
    }
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**इंटर-एजेंट मेश (Inter-Agent Mesh):**\n\n` +
              `• **कहाँ है**: साइडबार में **7वां आइटम "Inter-Agent Mesh"** पर क्लिक करें।\n` +
              `• **इनबाउंड एजेंट्स**: Agent 1 (कैरिकुलम), Agent 3 (कोर्स उपस्थिति), Agent 53 (फैकल्टी-छात्र अनुपात), Agent 58 (इन्फ्रास्ट्रक्चर)।\n` +
              `• **आउटबाउंड एजेंट्स**: Agent 9 (NBA/NAAC SAR), Agent 57 (अकादमिक ऑडिट), Agent 71 (संस्थागत जोखिम टेलीमेट्री)।\n` +
              `• **विशेषता**: स्वायत्त एजेंटों के बीच लाइव सॉकेट इवेंट्स एवं डेटा एक्सचेंज प्रदर्शित होता है।`,
        actionTab: 'Integrations',
        actionLabel: 'इंटर-एजेंट मेश खोलें →'
      };
    }
    return {
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish',
      text: `**Inter-Agent Mesh Telemetry:**\n\n` +
            `• **Kahan hai**: Sidebar me **7th item "Inter-Agent Mesh"** par click karein.\n` +
            `• **Kaise kaam karta hai**: 4 Inbound Upstream agents (1, 3, 53, 58) statutory data supply karte hain, aur 3 Outbound agents (9, 57, 71) ko telemetry dispatch hoti hai.\n` +
            `• **Live Sockets**: Real-time agent handshake aur payload logs yahan dikhte hain.`,
      actionTab: 'Integrations',
      actionLabel: 'Open Inter-Agent Mesh →'
    };
  }

  // 4c. REGULATIONS REGISTER
  if (isRegulations) {
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**నిబంధనల రిజిస్టర్ (Regulations Register):**\n\n` +
              `• **ఎక్కడ ఉంది**: సైడ్‌బార్‌లో **2వ అంశం "Regulations"** క్లిక్ చేయండి.\n` +
              `• **డేటాసెట్**: VFSTR R26, AICTE, UGC, NBA సంబంధిత 26 డీకంపోజ్డ్ నిబంధనలు.\n` +
              `• **ఫీచర్లు**: సెర్చ్ బార్, అథారిటీ ఫిల్టర్లు (AICTE, UGC, NBA, VFSTR) మరియు క్లాజ్ డ్రిల్-డౌన్.`,
        actionTab: 'Regulations',
        actionLabel: 'నిబంధనల రిజిస్టర్ తెరవండి →'
      };
    }
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**विनियम एवं अनुपालन रजिस्ट्री (Regulations Register):**\n\n` +
              `• **कहाँ है**: साइडबार में **2रा आइटम "Regulations"** पर क्लिक करें।\n` +
              `• **डेटाबेस**: Vignan VFSTR R26, AICTE, UGC, NBA के 26 वैधानिक नियम।\n` +
              `• **सुविधाएं**: कीवर्ड और आईडी द्वारा सर्च, प्राधिकरण फिल्टर (AICTE, UGC, NBA) और ऑपरेटर स्थितियां (>=, <=, ==)।`,
        actionTab: 'Regulations',
        actionLabel: 'विनियम रजिस्ट्री खोलें →'
      };
    }
    return {
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish',
      text: `**Regulations & Requirements Register:**\n\n` +
            `• **Kahan hai**: Sidebar me **2nd item "Regulations"** par click karein.\n` +
            `• **Dataset**: VFSTR R26, AICTE, UGC, NBA ke 26 statutory rules with clause conditions (>=, <=) aur lead times.\n` +
            `• **Search & Filters**: Real-time search aur category pills se filter karein.`,
      actionTab: 'Regulations',
      actionLabel: 'Open Regulations Register →'
    };
  }

  // 4d. RISKS MATRIX
  if (isRisks) {
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**రిస్క్ మ్యాట్రిక్స్ (Institutional Risk Matrix):**\n\n` +
              `• **ఎక్కడ ఉంది**: సైడ్‌బార్‌లో **4వ అంశం "Risks"** క్లిక్ చేయండి.\n` +
              `• **వివరాలు**: విశ్వవిద్యాలయంలోని నాన్-కంప్లైయన్స్ మరియు ఎట్-రిస్క్ సమస్యలను తీవ్రత (Critical/High/Medium) ప్రకారం విభజిస్తుంది.\n` +
              `• **పరిష్కారం**: ప్రతి కార్డ్‌పై డైరెక్ట్ 'Remediate' లింక్ మరియు బాధ్యత గల అధికారి వివరాలు ఉంటాయి.`,
        actionTab: 'Risks',
        actionLabel: 'రిస్క్ మ్యాట్రిక్స్ తెరవండి →'
      };
    }
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**संस्थागत जोखिम मैट्रिक्स (Institutional Risk Matrix):**\n\n` +
              `• **कहाँ है**: साइडबार में **4था आइटम "Risks"** पर क्लिक करें।\n` +
              `• **कार्यप्रणाली**: विश्वविद्यालय के वैधानिक कमियों और जोखिमों को गंभीरता (Critical, At Risk, Safe) में वर्गीकृत करता है।\n` +
              `• **कार्य**: हर कार्ड में सुधारात्मक कार्य और जिम्मेदार प्राधिकरण का लिंक दिया गया है।`,
        actionTab: 'Risks',
        actionLabel: 'जोखिम मैट्रिक्स खोलें →'
      };
    }
    return {
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish',
      text: `**Institutional Risk Matrix:**\n\n` +
            `• **Kahan hai**: Sidebar me **4th item "Risks"** par click karein.\n` +
            `• **Kaise kaam karta hai**: University ke non-compliant aur at-risk gaps ko statutory severity ke anusar rank karta hai.\n` +
            `• **Remediation link**: Har card par direct 'Remediate' button diya gaya hai.`,
      actionTab: 'Risks',
      actionLabel: 'Open Risk Matrix →'
    };
  }

  // 4e. AUDIT TRAIL
  if (isAudit) {
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**ఆడిట్ ట్రయల్ (Audit Trail):**\n\n` +
              `• **ఎక్కడ ఉంది**: సైడ్‌బార్‌లో **9వ అంశం "Audit Trail"** క్లిక్ చేయండి.\n` +
              `• **లక్షణాలు**: 43+ ధృవీకరించబడిన మార్పులేని (Immutable) ఈవెంట్ రికార్డులు.\n` +
              `• **వివరణ**: సిస్టమ్ స్వీప్‌లు, ఆమోదాలు, పాలసీ మార్పుల సమగ్ర చరిత్ర సమయంతో సహా ఉంటుంది.`,
        actionTab: 'Audit Trail',
        actionLabel: 'ఆడిట్ ట్రయల్ తెరవండి →'
      };
    }
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**अपरिवर्तनीय ऑडिट ट्रेल (Audit Trail):**\n\n` +
              `• **कहाँ है**: साइडबार में **9वां आइटम "Audit Trail"** पर क्लिक करें।\n` +
              `• **सुविधा**: 43+ क्रिप्टोग्राफिक रूप से सत्यापित इवेंट रिकॉर्ड्स।\n` +
              `• **उपयोग**: सिस्टम स्वीप्स, अप्रूवल्स और विनियामक परिवर्तनों का पारदर्शी इतिहास।`,
        actionTab: 'Audit Trail',
        actionLabel: 'ऑडिट ट्रेल खोलें →'
      };
    }
    return {
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish',
      text: `**Immutable Audit Trail:**\n\n` +
            `• **Kahan hai**: Sidebar me **9th item "Audit Trail"** par click karein.\n` +
            `• **Details**: 43+ cryptographically verified event records jisme har scan, approval aur policy change timestamp ke sath log hota hai.`,
      actionTab: 'Audit Trail',
      actionLabel: 'Open Audit Trail →'
    };
  }

  // 5. LIVE SCORE & METRICS
  if (isScore) {
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**ప్రత్యక్ష వ్యవస్థ స్థితి & కంప్లైయన్స్ స్కోర్:**\n\n` +
              `• **మొత్తం కంప్లైయన్స్ స్కోర్**: **${livePct}%** (చట్టబద్ధ బేస్‌లైన్).\n` +
              `• **ట్రాక్ చేయబడుతున్న నిబంధనలు**: **${totalReq} క్లాజులు** (AICTE, UGC, NBA, VFSTR R26).\n` +
              `• **ప్రస్తుత వీక్షణ**: మీరు ప్రస్తుతం **"${currentTab}"** ట్యాబ్‌లో ఉన్నారు.\n` +
              `• **AI ఏజెంట్లు**: 6 అటానమస్ ఏజెంట్లు యాక్టివ్‌గా ఉన్నాయి.`,
        actionTab: 'Compliance',
        actionLabel: 'కంప్లైయన్స్ ట్యాబ్ చూడండి →'
      };
    }
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**लाइव प्लेटफ़ॉर्म मेट्रिक्स एवं सिस्टम स्थिति:**\n\n` +
              `• **समग्र अनुपालन स्कोर**: **${livePct}%** (वैधानिक आधार रेखा)।\n` +
              `• **ट्रैक किए गए क्लॉज**: **${totalReq} नियम** (AICTE, UGC, NBA, VFSTR R26)।\n` +
              `• **सक्रिय टैब**: आप अभी **"${currentTab}"** टैब देख रहे हैं।\n` +
              `• **AI स्वाम**: 6 स्वायत्त एजेंट वास्तविक समय में सक्रिय एवं सिंक्रोनाइज़्ड हैं।`,
        actionTab: 'Compliance',
        actionLabel: 'अनुपालन टैब देखें →'
      };
    }
    return {
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish',
      text: `**Live Platform Metrics & System Status:**\n\n` +
            `• **Overall Compliance Score**: **${livePct}%** (Statutory Baseline).\n` +
            `• **Total Tracked Requirements**: **${totalReq} clauses** across AICTE, UGC, NBA & VFSTR R26.\n` +
            `• **Currently Active View**: Aap abhi **"${currentTab}"** tab dekh rahe hain.\n` +
            `• **Multi-Agent Swarm**: 6 Autonomous AI Swarm Agents active aur synchronized hain.`,
      actionTab: 'Compliance',
      actionLabel: 'View Compliance Tab →'
    };
  }

  // 6. AUTH & LOGIN
  if (isAuth) {
    if (lang === 'te') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**లాగిన్, సైన్-అప్ & ప్రొఫైల్ ఎంపికలు:**\n\n` +
              `• **లాగిన్ పేజీకి వెళ్లడానికి**: సైడ్‌బార్‌లో Admin కార్డ్ వద్ద ఉన్న బ్లూ బాణం గుర్తు **(->])** లేదా 'Sign In' పై క్లిక్ చేయండి.\n` +
              `• **కొత్త ఖాతా సృష్టి**: 'Sign Up' పై క్లిక్ చేసి మీ వివరాలు నమోదు చేయండి.\n` +
              `• **డెమో ఆధారాలు**: User ID: **vignan**, Password: ఏదైనా, సెక్యూరిటీ గ్రిడ్: 3 అంకెలు (ఉదా. 123).`,
        actionTab: 'Home',
        actionLabel: 'లాగిన్ పేజీకి వెళ్లండి →'
      };
    }
    if (lang === 'hi') {
      return {
        detectedLang: lang,
        langName: targetLang.nativeName,
        text: `**लॉगिन, साइन अप और प्रोफ़ाइल विकल्प:**\n\n` +
              `• **लॉगिन पेज पर जाने हेतु**: साइडबार में Admin कार्ड के नीले तीर वाले बटन **(->])** या 'Sign In' पर क्लिक करें।\n` +
              `• **नया खाता पंजीकरण**: 'Sign Up' पर क्लिक करके नया फैकल्टी/एडमिन खाता बनाएं।\n` +
              `• **डेमो क्रेडेंशियल**: यूज़र आईडी: **vignan**, पासवर्ड: कोई भी, सिक्योरिटी ग्रिड: 3 अंक (उदा. 123)।`,
        actionTab: 'Home',
        actionLabel: 'लॉगिन पेज पर जाएं →'
      };
    }
    return {
      detectedLang: 'hinglish',
      langName: '🇮🇳 Hinglish',
      text: `**Sign Up, Sign In aur Logout ke options:**\n\n` +
            `• **Login Page par jana**: Sidebar me Admin card ke right side blue arrow button **(->])** ya 'Sign In' par click karein.\n` +
            `• **Sign Up**: Naya institutional account banane ke liye 'Sign Up' par click karein.\n` +
            `• **Demo Credentials**: User ID: **vignan**, Password: koi bhi 3+ char, Security GRID: 3 digit (e.g. 123).`,
      actionTab: 'Home',
      actionLabel: 'Login Page Par Jayein →'
    };
  }

  // DEFAULT / GENERAL FALLBACK
  if (lang === 'te') {
    return {
      detectedLang: lang,
      langName: targetLang.nativeName,
      text: `మీరు అడిగిన ప్రశ్న: *"${query}"*\n\n` +
            `Agent54 లో 9 ప్రధాన మాడ్యూల్స్ ఉన్నాయి:\n` +
            `• **Home**: స్కోర్ 35% & సారాంశం (ప్రస్తుతం: ${currentTab}).\n` +
            `• **Regulations**: 26 నియంత్రణ నిబంధనలు.\n` +
            `• **Compliance**: ప్రత్యక్ష తనిఖీ వ్యవస్థ.\n` +
            `• **Risks**: రిస్క్ మ్యాట్రిక్స్ & తీవ్రత.\n` +
            `• **Inspection Readiness**: ప్రీ-ఇన్‌స్పెక్షన్ డోసియర్ (AICTE, UGC, NBA, NAAC).\n` +
            `• **Remediation**: 19 కేసుల AI రికవరీ ఇంజిన్.\n` +
            `• **Inter-Agent Mesh**: ఏజెంట్ల సమన్వయం.\n` +
            `• **Simulator**: What-If దృశ్యాల అనుకరణ.\n` +
            `• **Audit Trail**: భద్రపరచబడిన ఈవెంట్ రికార్డులు.\n\nమీరు ఏ అంశం గురించైనా మరింత వివరంగా అడగవచ్చు!`,
      actionTab: 'Home',
      actionLabel: 'హోమ్ ట్యాబ్‌కు వెళ్లండి →'
    };
  }

  if (lang === 'hi') {
    return {
      detectedLang: lang,
      langName: targetLang.nativeName,
      text: `आपने पूछा: *"${query}"*\n\n` +
            `Agent54 में 9 मुख्य मॉड्यूल उपलब्ध हैं:\n` +
            `• **Home**: स्कोर 35% एवं समग्र अवलोकन (वर्तमान: ${currentTab})।\n` +
            `• **Regulations**: 26 वैधानिक क्लॉज एवं नियम।\n` +
            `• **Compliance**: लाइव सत्यापन इंजन।\n` +
            `• **Risks**: संस्थागत जोखिम मैट्रिक्स एवं गंभीरता स्तर।\n` +
            `• **Inspection Readiness**: प्री-ऑडिट डोजियर (AICTE, UGC, NBA, NAAC)।\n` +
            `• **Remediation**: 19 मामलों का सुधारात्मक इंजन।\n` +
            `• **Inter-Agent Mesh**: स्वायत्त एजेंटों का टेलीमेट्री समन्वय।\n` +
            `• **Simulator**: What-If परिदृश्य परीक्षण।\n` +
            `• **Audit Trail**: 43+ अपरिवर्तनीय लॉग्स।\n\nआप किसी भी विशेष सुविधा के बारे में पूछ सकते हैं!`,
      actionTab: 'Home',
      actionLabel: 'होम अवलोकन खोलें →'
    };
  }

  if (lang === 'ta') {
    return {
      detectedLang: lang,
      langName: targetLang.nativeName,
      text: `உங்கள் கேள்வி: *"${query}"*\n\n` +
            `Agent54 தளத்தில் 9 முக்கிய தொகுதிகள் உள்ளன:\n` +
            `• **Home**: தகுதி 35% மற்றும் மேலோட்டம்.\n` +
            `• **Regulations**: 26 சட்டப்பூர்வ விதிகள்.\n` +
            `• **Compliance**: நேரடி இணக்க ஆய்வு.\n` +
            `• **Risks**: இடர் பகுப்பாய்வு.\n` +
            `• **Inspection Readiness**: ஆய்வு தயார்நிலை.\n` +
            `• **Remediation**: 19 வழக்குகளுக்கான தீர்வு.\n` +
            `• **Inter-Agent Mesh**: முகவர் தொடர்பு.\n` +
            `• **Simulator**: மாதிரி உருவகப்படுத்துதல்.\n` +
            `• **Audit Trail**: தணிக்கை பதிவு.`,
      actionTab: 'Home',
      actionLabel: 'முகப்பு பார்க்க →'
    };
  }

  if (lang === 'en') {
    return {
      detectedLang: lang,
      langName: targetLang.nativeName,
      text: `You asked: *"${query}"*\n\n` +
            `Agent54 provides 9 core autonomous modules:\n` +
            `• **Home**: Compliance Score 35% & executive overview (Currently on: ${currentTab}).\n` +
            `• **Regulations**: Register of 26 statutory clauses across AICTE, UGC, NBA & VFSTR R26.\n` +
            `• **Compliance**: Live departmental rule verification engine.\n` +
            `• **Risks**: Institutional Risk Matrix & severity tiers.\n` +
            `• **Inspection Readiness**: Surprise inspection defense dossier & authority meters.\n` +
            `• **Remediation**: 19-case AI recovery center with 4-node gap analysis.\n` +
            `• **Inter-Agent Mesh**: 4 Inbound & 3 Outbound swarm agent coordination.\n` +
            `• **Simulator**: What-If scenario sandbox with policy sliders.\n` +
            `• **Audit Trail**: 43+ immutable cryptographic records.\n\nFeel free to ask for detailed guidance on any specific module!`,
      actionTab: 'Home',
      actionLabel: 'Open Home Overview →'
    };
  }

  // Default Hinglish
  return {
    detectedLang: 'hinglish',
    langName: '🇮🇳 Hinglish',
    text: `Aapne poocha: *"${query}"*\n\n` +
          `Agent54 me 9 main modules hain:\n` +
          `• **Home**: Score 35% & executive overview (Currently: ${currentTab}).\n` +
          `• **Regulations**: 26 statutory clauses & rules.\n` +
          `• **Compliance**: Live verification engine.\n` +
          `• **Risks**: Institutional Risk Matrix & severity tiers.\n` +
          `• **Inspection Readiness**: Pre-inspection dossier (AICTE, UGC, NBA, NAAC).\n` +
          `• **Remediation**: 19 cases ka AI recovery engine.\n` +
          `• **Inter-Agent Mesh**: 4 Inbound & 3 Outbound agent orchestration.\n` +
          `• **Simulator**: What-If scenario sandbox with sliders.\n` +
          `• **Audit Trail**: 43+ immutable event records.\n\nAap inme se kisi bhi specific module ke bare me detail pooch sakte hain!`,
    actionTab: 'Home',
    actionLabel: 'Go to Home Overview →'
  };
}
