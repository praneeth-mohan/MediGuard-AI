
export type Language = 
  | 'en' | 'es' | 'hi' | 'te' | 'ta' | 'kn' | 'ml' | 'mr' | 'gu' | 'pa' 
  | 'bn' | 'ur' | 'or' | 'as' | 'mai' | 'sat' | 'ks' | 'ne' | 'kok' | 'sd' 
  | 'doi' | 'mni' | 'bo' | 'sa';

export interface EmergencyContact {
  name: string;
  number: string;
}

export interface UserProfile {
  name: string;
  email: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other' | 'Unknown';
  kidneyFunction: 'Normal' | 'Impaired' | 'Unknown';
  liverFunction: 'Normal' | 'Impaired' | 'Unknown';
  currentMeds: string;
  contacts: [EmergencyContact, EmergencyContact];
  language?: string;
  openFdaKey?: string;
  themeColor?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  image?: string; // Base64
  groundingSources?: Array<{
    title: string;
    url: string;
  }>;
}

export type AppScreen = 'dashboard' | 'chat' | 'emergency' | 'credits' | 'settings';

export const SUPPORTED_LANGUAGES: Record<Language, string> = {
  en: 'English', es: 'Español', hi: 'हिंदी', te: 'తెలుగు', ta: 'தமிழ்',
  kn: 'ಕನ್ನಡ', ml: 'മലയാളം', mr: 'മറാഠി', gu: 'ગુજરાતી', pa: 'ਪੰਜਾਬੀ',
  bn: 'বাংলা', ur: 'اردو', or: 'ଓଡ଼ିଆ', as: 'অসমীয়া', mai: 'मैथिली',
  sat: 'संथाली', ks: 'कश्मीरी', ne: 'नेपाली', kok: 'कोंकणी', sd: 'सिंधी',
  doi: 'डोगरी', mni: 'मणिपुरी', bo: 'बोडो', sa: 'संस्कृत'
};

export const UI_TRANSLATIONS: Record<Language, any> = {
  en: {
    welcome: "Hello",
    dashboard: "Dashboard",
    chat: "Chatbot",
    settings: "Settings",
    emergency: "Emergency",
    credits: "Credits",
    logout: "Logout",
    signIn: "Sign In",
    guest: "Guest",
    subtitle: "Your personal medical assistant",
    checkInteraction: "Drug Interactions",
    safeDosage: "Safe Dosage",
    sideEffects: "Side Effects",
    join: "Join MediGuard",
    joinSub: "Sync your health profile for accurate AI analysis.",
    support: "24/7 Support",
    callSupport: "Call Support",
    findMeds: "Find your medication\nat your fingertips",
    searchDrugs: "Search Drugs",
    profileActive: "Profile Active",
    createProfile: "Create Profile",
    fullName: "Full Name",
    email: "Email",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    start: "Start",
    cancel: "Cancel",
    install: "Install App",
    medicalProfile: "Medical Profile",
    kidneyFunction: "Kidney Function",
    currentMeds: "Current Meds",
    editProfile: "Edit Profile",
    typeQuery: "Type drug name or query...",
    analyzing: "Analyzing safety...",
    language: "Language",
    dataSources: "Data Sources",
    openFda: "OpenFDA API Key (Optional)",
    openFdaDesc: "Adding a key increases search limits for US drug data. Leave empty for standard access.",
    emergencyContacts: "Emergency Contacts",
    contact1: "Contact 1",
    contact2: "Contact 2",
    name: "Name",
    number: "Number",
    autoSaved: "Auto-saved",
    immediateAssist: "Immediate Assistance",
    call112: "CALL 112",
    savedContacts: "Saved Contacts",
    meetTeam: "Meet the Team",
    doubleTap: "(Double tap names)",
    madeWith: "Made with",
    askRisk: "CRITICAL: High risk medication detected. Please confirm your Age and Pregnancy Status.",
    years: "years",
    enterSearch: "Start Search",
    sos: "SOS",
    setupRequired: "Setup Required",
    saveContacts: "Save Contacts",
    saved: "Saved!",
    priorityCall: "Priority Call",
    theme: "App Theme",
    thanksAvanthi: "Special thanks to Avanthi Institute of Pharmaceutical Sciences, Thagarapuvalasa",
    thankYouTitle: "A Heartfelt Thank You",
    thankYouBody: "We extend our deepest gratitude to the Avanthi Institute of Pharmaceutical Sciences, Thagarapuvalasa for their invaluable support, guidance, and inspiration in the development of MediGuard AI. Your commitment to excellence in pharmaceutical education has been our guiding light."
  },
  hi: {
    welcome: "नमस्ते",
    dashboard: "डैशबोर्ड",
    chat: "चैटबॉट",
    settings: "सेटिंग्स",
    emergency: "आपातकालीन",
    credits: "क्रेडिट्स",
    logout: "लॉग आउट",
    signIn: "साइन इन",
    guest: "अतिथि",
    subtitle: "आपका व्यक्तिगत चिकित्सा सहायक",
    checkInteraction: "दवा पारस्परिक क्रिया",
    safeDosage: "सुरक्षित खुराक",
    sideEffects: "दुष्प्रभाव",
    join: "मेडिगार्ड से जुड़ें",
    joinSub: "सटीक एआई विश्लेषण के लिए अपनी स्वास्थ्य प्रोफ़ाइल सिंक करें।",
    support: "24/7 सहायता",
    callSupport: "सपोर्ट कॉल करें",
    findMeds: "अपनी दवा ढूंढे\nबस एक क्लिक पर",
    searchDrugs: "दवा खोजें",
    profileActive: "प्रोफ़ाइल सक्रिय",
    createProfile: "प्रोफ़ाइल बनाएं",
    fullName: "पूरा नाम",
    email: "ईमेल",
    age: "उम्र",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    start: "शुरू करें",
    cancel: "रद्द करें",
    install: "ऐप इंस्टॉल करें",
    medicalProfile: "मेडिकल प्रोफ़ाइल",
    kidneyFunction: "गुर्दे का कार्य",
    currentMeds: "वर्तमान दवाएं",
    editProfile: "प्रोफ़ाइल संपादित करें",
    typeQuery: "दवा का नाम लिखें...",
    analyzing: "सुरक्षा विश्लेषण कर रहा है...",
    language: "भाषा",
    dataSources: "डेटा स्रोत",
    openFda: "OpenFDA API कुंजी (वैकल्पिक)",
    openFdaDesc: "कुंजी जोड़ने से अमेरिकी दवा डेटा के लिए खोज सीमा बढ़ जाती है। मानक पहुंच के लिए खाली छोड़ दें।",
    emergencyContacts: "आपातकालीन संपर्क",
    contact1: "संपर्क 1",
    contact2: "संपर्क 2",
    name: "नाम",
    number: "नंबर",
    autoSaved: "स्वत: सहेजा गया",
    immediateAssist: "तत्काल सहायता",
    call112: "112 डायल करें",
    savedContacts: "सहेजे गए संपर्क",
    meetTeam: "टीम से मिलें",
    doubleTap: "(नामों पर दो बार टैप करें)",
    madeWith: "के साथ बनाया गया",
    askRisk: "चेतावनी: उच्च जोखिम वाली दवा। कृपया अपनी आयु और गर्भावस्था की स्थिति की पुष्टि करें।",
    years: "वर्ष",
    enterSearch: "खोज शुरू करें",
    sos: "एसओएस",
    setupRequired: "सेटअप आवश्यक",
    saveContacts: "संपर्क सहेजें",
    saved: "सहेजा गया!",
    priorityCall: "प्राथमिकता कॉल",
    theme: "ऐप थीम",
    thanksAvanthi: "अदांथी इंस्टीट्यूट ऑफ फार्मास्युटिकल साइंसेज, तगरपुवलसा का विशेष धन्यवाद",
    thankYouTitle: "दिल से धन्यवाद",
    thankYouBody: "हम मेडिगार्ड एआई के विकास में अमूल्य समर्थन, मार्गदर्शन और प्रेरणा के लिए अवंती इंस्टीट्यूट ऑफ फार्मास्युटिकल साइंसेज, तगरपुवलसा के प्रति अपनी गहरी कृतज्ञता व्यक्त करते हैं।"
  }
} as any;
