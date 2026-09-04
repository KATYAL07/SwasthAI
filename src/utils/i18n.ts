/**
 * Comprehensive i18n Translation Dictionary & Auto-Translator Engine for SwasthAI
 * Supports complete bilingual experience between English (en) and Hindi (hi).
 */

export type LanguageCode = "en" | "hi";

export interface TranslationDictionary {
  // Brand & Header
  brandName: string;
  regionalNetwork: string;
  metropolitanGrid: string;
  reconnectGrid: string;
  rolePatient: string;
  roleDoctor: string;
  roleHospital: string;
  roleAdmin: string;
  profilePrimary: string;
  addPatient: string;
  profileSettings: string;
  searchStaffDoctors: string;

  // Sidebar Tabs & Groups
  groupCare: string;
  groupRecords: string;
  groupExplore: string;
  groupStaff: string;
  tabOverview: string;
  tabSuperApp: string;
  tabSmartNetwork: string;
  tabSymptoms: string;
  tabTrends: string;
  tabBeds: string;
  tabConsultation: string;
  tabPharmacy: string;
  tabRecords: string;
  tabInsurance: string;
  tabSos: string;
  tabAdmin: string;
  tabChn: string;
  tabDeveloperHub: string;

  // Dashboard Overview Cards
  diagnosticsChecks: string;
  pharmacyOrders: string;
  adherenceQuotient: string;
  liveTracking: string;
  reductionVsTarget: string;
  activeStatusChecks: string;
  activeAlarmsSet: string;
  copilotTelemetry: string;
  hospitalOccupancy: string;
  cityHealthTwin: string;
  activeConsultations: string;
  aiHealthStatus: string;
  emergencySos: string;
  liveOpdProgression: string;
  needCustomMedicines: string;
  findNearestHospital: string;
  viewLiveMapLocator: string;
  launchCityTwinHub: string;
  enterMedicalPharmacy: string;
  aiPrediction: string;

  // Bed Triage
  bedTriageTitle: string;
  bedTriageSubtitle: string;
  traumaRegistriesTitle: string;
  availableBedsLabel: string;
  icuReserveLabel: string;
  emergencyOccupancyLabel: string;
  callDeskBtn: string;
  mapDispatchBtn: string;
  sosDirectBtn: string;
  googleMapsLiveRouteBtn: string;

  // Settings Panel
  settingsPanelTitle: string;
  settingsTabProfiles: string;
  settingsTabActivity: string;
  settingsTabFeatures: string;
  settingsTabSystem: string;
  uiPreferencesHeader: string;
  displayAestheticsTitle: string;
  displayAestheticsDesc: string;
  biometricGateTitle: string;
  biometricGateDesc: string;
  preferredBiometricTitle: string;
  lastChanged: string;
  closeBtn: string;
  
  // Language Selector
  languageSettingsLabel: string;
  languageSelectDesc: string;
  enLabel: string;
  hiLabel: string;
  toastLangSuccess: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    brandName: "SwasthAI",
    regionalNetwork: "Live Regional Network Connection",
    metropolitanGrid: "/ Metropolitan Medical Grid",
    reconnectGrid: "Reconnect clinical grid",
    rolePatient: "Patient / Self",
    roleDoctor: "Doctor Core",
    roleHospital: "Hospital staff",
    roleAdmin: "Admin hub",
    profilePrimary: "Self (Primary User",
    addPatient: "Add Patient",
    profileSettings: "Profile Settings",
    searchStaffDoctors: "Search staff, doctors...",

    groupCare: "Care",
    groupRecords: "Records & orders",
    groupExplore: "Explore",
    groupStaff: "Staff tools",

    tabOverview: "Home",
    tabSuperApp: "Features",
    tabSmartNetwork: "Doctor network",
    tabSymptoms: "Check symptoms",
    tabTrends: "Health trends",
    tabBeds: "Hospital beds",
    tabConsultation: "Find a doctor",
    tabPharmacy: "Medicines",
    tabRecords: "My records",
    tabInsurance: "Insurance",
    tabSos: "Emergency",
    tabAdmin: "Hospitals & staff",
    tabChn: "City health map",
    tabDeveloperHub: "Developer console",

    diagnosticsChecks: "CUSTOM DIAGNOSTICS CHECKS",
    pharmacyOrders: "E-PHARMACY PLACED ORDERS",
    adherenceQuotient: "AVERAGED ADHERENCE QUOTIENT",
    liveTracking: "LIVE TRACKING FEED",
    reductionVsTarget: "reduction vs. standard target",
    activeStatusChecks: "Active status checks",
    activeAlarmsSet: "Active dosage alarms set",
    copilotTelemetry: "Clinical copilot active metrics",
    hospitalOccupancy: "HOSPITAL OCCUPANCY",
    cityHealthTwin: "CITY HEALTH TWIN (CHN)",
    activeConsultations: "Active Consultations",
    aiHealthStatus: "AI HEALTH STATUS",
    emergencySos: "EMERGENCY SOS",
    liveOpdProgression: "LIVE OPD PROGRESSION",
    needCustomMedicines: "Need custom medicines? Place express order at pharmacy grid!",
    findNearestHospital: "Find Nearest Hospital",
    viewLiveMapLocator: "View Live Map Locator",
    launchCityTwinHub: "Launch City Twin HUB",
    enterMedicalPharmacy: "Enter Medical Pharmacy",
    aiPrediction: "AI PREDICTION",

    bedTriageTitle: "Metropolitan Live Bed Triage Grid",
    bedTriageSubtitle: "Live operational census for hospital bed allocation. Patients can map vacancies and coordinate emergency transit.",
    traumaRegistriesTitle: "TRAUMA CENTERS & HOSPITAL REGISTRIES",
    availableBedsLabel: "Available Beds",
    icuReserveLabel: "ICU Reserve",
    emergencyOccupancyLabel: "Emergency Occupancy",
    callDeskBtn: "Call Desk",
    mapDispatchBtn: "Map & Track Dispatch",
    sosDirectBtn: "SOS Direct",
    googleMapsLiveRouteBtn: "Open Google Maps Live Route",

    settingsPanelTitle: "Settings Panel",
    settingsTabProfiles: "Identity Profiles",
    settingsTabActivity: "Activity Log",
    settingsTabFeatures: "Copilot Config",
    settingsTabSystem: "System Preferences",
    uiPreferencesHeader: "Security & UI Preferences",
    displayAestheticsTitle: "App Display Aesthetics",
    displayAestheticsDesc: "Toggle high-contrast surgical dark canvas to reduce optic fatigue during late-night clinical shifts.",
    biometricGateTitle: "Simulated Biometric Auth Gateway",
    biometricGateDesc: "Enable immediate bypass credentials using local hardware Touch ID or facial cameras when launching secure sessions.",
    preferredBiometricTitle: "Preferred Biometric Method",
    lastChanged: "Last changed",
    closeBtn: "Close panel",

    languageSettingsLabel: "Application Interface Language",
    languageSelectDesc: "Choose the default localized language for display headers, dashboard charts, and control labels.",
    enLabel: "English (US)",
    hiLabel: "हिन्दी (Hindi)",
    toastLangSuccess: "Interface language updated to English.",
  },
  hi: {
    brandName: "स्वास्थ एआई (SwasthAI)",
    regionalNetwork: "लाइव क्षेत्रीय नेटवर्क कनेक्शन",
    metropolitanGrid: "/ महानगरीय चिकित्सा ग्रिड",
    reconnectGrid: "क्लिनिकल ग्रिड पुनः कनेक्ट करें",
    rolePatient: "मरीज़ / स्वयं",
    roleDoctor: "मुख्य डॉक्टर",
    roleHospital: "अस्पताल स्टाफ",
    roleAdmin: "प्रशासन केंद्र",
    profilePrimary: "स्वयं (प्राथमिक उपयोगकर्ता",
    addPatient: "मरीज जोड़ें",
    profileSettings: "प्रोफ़ाइल सेटिंग्स",
    searchStaffDoctors: "स्टाफ, डॉक्टर खोजें...",

    groupCare: "स्वास्थ्य देखभाल",
    groupRecords: "रिकॉर्ड और ऑर्डर",
    groupExplore: "एक्सप्लोर करें",
    groupStaff: "स्टाफ उपकरण",

    tabOverview: "होम",
    tabSuperApp: "सुविधाएँ",
    tabSmartNetwork: "डॉक्टर नेटवर्क",
    tabSymptoms: "लक्षण जाँचें",
    tabTrends: "स्वास्थ्य रुझान",
    tabBeds: "अस्पताल बेड",
    tabConsultation: "डॉक्टर खोजें",
    tabPharmacy: "दवाइयाँ",
    tabRecords: "मेरे रिकॉर्ड",
    tabInsurance: "बीमा",
    tabSos: "आपातकाल",
    tabAdmin: "अस्पताल और स्टाफ",
    tabChn: "शहर स्वास्थ्य मानचित्र",
    tabDeveloperHub: "डेवलपर कंसोल",

    diagnosticsChecks: "कस्टम डायग्नोस्टिक्स जांचें",
    pharmacyOrders: "ई-फार्मेसी ऑर्डर संख्या",
    adherenceQuotient: "औसत दवा अनुपालन गुणांक",
    liveTracking: "लाइव ट्रैकिंग फीड",
    reductionVsTarget: "मानक लक्ष्य की तुलना में कमी",
    activeStatusChecks: "सक्रिय स्थिति जांच",
    activeAlarmsSet: "सक्रिय खुराक अलार्म सेट",
    copilotTelemetry: "क्लीनिकल कोपायलट सक्रिय मीट्रिक",
    hospitalOccupancy: "अस्पताल बेड उपलब्धता",
    cityHealthTwin: "सिटी हेल्थ ट्विन (CHN)",
    activeConsultations: "सक्रिय परामर्श",
    aiHealthStatus: "एआई स्वास्थ्य स्थिति",
    emergencySos: "आपातकालीन एसओएस (SOS)",
    liveOpdProgression: "लाइव ओपीडी प्रगति",
    needCustomMedicines: "कस्टम दवाइयों की आवश्यकता है? फार्मेसी ग्रिड से एक्सप्रेस ऑर्डर करें!",
    findNearestHospital: "निकटतम अस्पताल खोजें",
    viewLiveMapLocator: "लाइव मानचित्र लोकेटर देखें",
    launchCityTwinHub: "सिटी ट्विन हब खोलें",
    enterMedicalPharmacy: "मेडिकल फार्मेसी में प्रवेश करें",
    aiPrediction: "एआई भविष्यवाणी",

    bedTriageTitle: "महानगरीय लाइव बेड ट्राइएज ग्रिड",
    bedTriageSubtitle: "अस्पताल बेड आवंटन के लिए लाइव परिचालन गणना। मरीज रिक्तियों का नक्शा देख सकते हैं और आपातकालीन पारगमन का समन्वय कर सकते हैं।",
    traumaRegistriesTitle: "ट्रॉमा सेंटर और अस्पताल पंजीयन",
    availableBedsLabel: "उपलब्ध बेड",
    icuReserveLabel: "आईसीयू रिजर्व",
    emergencyOccupancyLabel: "आपातकालीन ऑक्यूपेंसी",
    callDeskBtn: "कॉल डेस्क",
    mapDispatchBtn: "मानचित्र व डिस्पैच ट्रैक करें",
    sosDirectBtn: "सीधा एसओएस (SOS)",
    googleMapsLiveRouteBtn: "गूगल मैप्स लाइव रूट खोलें",

    settingsPanelTitle: "सेटिंग्स पैनल",
    settingsTabProfiles: "पहचान प्रोफ़ाइल",
    settingsTabActivity: "गतिविधि लॉग",
    settingsTabFeatures: "कोपायलट कॉन्फ़िगरेशन",
    settingsTabSystem: "सिस्टम प्राथमिकताएं",
    uiPreferencesHeader: "सुरक्षा और यूआई प्राथमिकताएं",
    displayAestheticsTitle: "ऐप डिस्प्ले सौंदर्यशास्त्र",
    displayAestheticsDesc: "देर रात की क्लीनिकल शिफ्ट के दौरान आंखों की थकान को कम करने के लिए उच्च-विपरीत डार्क कैनवास चालू करें।",
    biometricGateTitle: "सिम्युलेटेड बायोमेट्रिक प्रमाणीकरण गेटवे",
    biometricGateDesc: "सुरक्षित सत्र शुरू करते समय स्थानीय हार्डवेयर टच आईडी या फेसियल कैमरे का उपयोग करके तत्काल बाईपास सक्षम करें।",
    preferredBiometricTitle: "पसंदीदा बायोमेट्रिक तरीका",
    lastChanged: "अंतिम परिवर्तन",
    closeBtn: "पैनल बंद करें",

    languageSettingsLabel: "एप्लिकेशन इंटरफ़ेस भाषा",
    languageSelectDesc: "डिस्प्ले हेडर, डैशबोर्ड चार्ट और नियंत्रण लेबल के लिए डिफ़ॉल्ट स्थानीयकृत भाषा चुनें।",
    enLabel: "English (अंग्रेज़ी)",
    hiLabel: "हिन्दी (Hindi)",
    toastLangSuccess: "इंटरफ़ेस की भाषा हिन्दी में बदल दी गई है।",
  }
};

export const HINDI_DICTIONARY: Record<string, string> = {
  "URGENT METROPOLITAN EMERGENCY TRIGGER": "तत्काल महानगर आपातकालीन ट्रिगर",
  "REPORT DISTRESS INFORMATION": "संकट की जानकारी रिपोर्ट करें",
  "Patient Emergency phone line": "मरीज आपातकालीन फोन लाइन",
  "Associated Danger condition trigger": "संबंधित खतरे की स्थिति ट्रिगर",
  "Distress Location Address Coordinates": "संकट स्थान पता निर्देशांक",
  "TRIGGER SOS DISTRESS PANIC": "एसओएस संकट पैनिक ट्रिगर करें",
  "SOS PROTOCOL STATUS": "एसओएस प्रोटोकॉल स्थिति",
  "REGIONAL DISTRESS LOG LINES": "क्षेत्रीय संकट लॉग लाइनें",
  "Clinical Health Ledger": "क्लिनिकल स्वास्थ्य खाता",
  "PULSE RATE": "नाड़ी की दर",
  "BLOOD OXYGEN": "रक्त ऑक्सीजन",
  "BLOOD PRESSURE": "रक्तचाप",
  "AIR SMOG ASTHMA WARNING": "वायु स्मॉग अस्थमा चेतावनी",
  "Interactive Clinical Vitals History & Trends": "इंटरएक्टिव क्लिनिकल विटल्स इतिहास और रुझान",
  "TRACK VITAL READING": "महत्वपूर्ण रीडिंग ट्रैक करें",
  "Express Pharmacy Marketplace": "एक्सप्रेस फार्मेसी मार्केटप्लेस",
  "SHOPPING BASKET": "खरीदारी की टोकरी",
  "RECENT ORDER DISPATCHES": "हाल के ऑर्डर प्रेषण",
  "Unified Health Insurance Exchange hub": "एकीकृत स्वास्थ्य बीमा एक्सचेंज हब",
  "TOP-TIER CASHLESS HEALTH PLANS FOR DELHI NCR": "दिल्ली एनसीआर के लिए शीर्ष स्तरीय कैशलेस स्वास्थ्य योजनाएं",
  "INSURETECH AI UNDERWRITING ADVISER": "इंश्योरटेक एआई अंडरराइटिंग एडवाइजर",
  "CASHLESS CLAIMS TRACKER: SELF": "कैशलेस दावा ट्रैकर: स्वयं",
  "TIER-1 SUPER-APP SUITE": "टियर-1 सुपर-ऐप सूट",
  "City Healer Differentiators": "सिटी हीलर डिफरेंशिएटर्स",
  "Resident AI Health Copilot": "निवासी एआई स्वास्थ्य कोपायलट",
  "LAB ANALYZER BOX (NODE 1)": "लैब एनालाइजर बॉक्स (नोड 1)",
  "AI PRESCRIPTION CHECKER": "एआई नुस्खा चेकर",
  "POST-VIRAL RECOVERY PROTOCOL": "पोस्ट-वायरल रिकवरी प्रोटोकॉल",
  "AI-POWERED PILL INSPECTION & VERIFICATION ACTIVE": "एआई-पावर्ड पिल निरीक्षण और सत्यापन सक्रिय",
  "DEFAULT STANDARD INDIAN CATALOGUE": "डिफ़ॉल्ट मानक भारतीय कैटलॉग",
  "No active sirens dispatches connected currently in your region.": "आपके क्षेत्र में वर्तमान में कोई सक्रिय सायरन प्रेषण कनेक्ट नहीं है।",
  "Note: Dispatcher monitors physical coordinates directly. Tap red panic button to simulate ambulance router.": "नोट: डिस्पैचर सीधे भौतिक निर्देशांक की निगरानी करता है। एम्बुलेंस राउटर को अनुकरण करने के लिए लाल पैनिक बटन पर टैप करें।",
  "No telemetry log alerts available.": "कोई टेलीमेट्री लॉग अलर्ट उपलब्ध नहीं है।",
  "Your shopping cart is empty.": "आपकी खरीदारी कार्ट खाली है।",
  "No active pharmacy orders.": "कोई सक्रिय फार्मेसी ऑर्डर नहीं है।",
  "AI Diagnostic & Clinical Feedback Loop": "एआई डायग्नोस्टिक और क्लिनिकल फीडबैक लूप",
  "Clinical Data Period": "क्लिनिकल डेटा अवधि",
  "Select Simulation Scenario": "सिमुलेशन परिदृश्य का चयन करें",
  "7 Days": "7 दिन",
  "30 Days": "30 दिन",
  "90 Days": "90 दिन",
  "Baseline Steady": "बेसलाइन स्थिर",
  "Flu Season Spike": "फ्लू सीजन स्पाइक",
  "Allergy Dust Outbreak": "एलर्जी धूल का प्रकोप",
  "Drug Adherence Drop": "दवा पालन में कमी",
  "Clinical Insights & Telemetry Forecast": "क्लिनिकल इनसाइट्स और टेलीमेट्री पूर्वानुमान",
  "Trend Activity Visualizer": "प्रवृत्ति गतिविधि विज़ुअलाइज़र",
  "Symptom Checks": "लक्षण जांच",
  "Medicine Orders": "दवा आदेश",
  "Adherence Rate": "पालन दर",
  "Data Privacy & Protection Ledger": "डेटा गोपनीयता और सुरक्षा खाता",
  "All vital trends, symptom telemetry, and pharmaceutical compliance patterns are anonymized and mathematically hashed to your private City Healer vault.": "सभी महत्वपूर्ण रुझान, लक्षण टेलीमेट्री, और दवा अनुपालन पैटर्न को आपके निजी सिटी हीलर वॉल्ट में गुमनाम और गणितीय रूप से हैश किया गया है।",
  "City Healer Live Command Center": "सिटी हीलर लाइव कमांड सेंटर",
  "Active City Healer Node": "सक्रिय सिटी हीलर नोड",
  "Switch Regional Grid": "क्षेत्रीय ग्रिड बदलें",
  "Dashboard": "डैशबोर्ड",
  "City Twin Map": "सिटी ट्विन मैप",
  "Ambulance Routes": "एम्बुलेंस रूट",
  "Copilot Intel": "कोपायलट इंटेल",
  "Safety Hub": "सुरक्षा हब",
  "Nutrition Lab": "पोषण लैब",
  "AI Clinical Overview": "एआई क्लिनिकल अवलोकन",
  "City Health Score": "शहर स्वास्थ्य स्कोर",
  "Clinical Index": "क्लिनिकल सूचकांक",
  "Live Available Beds": "लाइव उपलब्ध बेड",
  "Dispatched Ambulances": "प्रेषित एम्बुलेंस",
  "Active Online Doctors": "सक्रिय ऑनलाइन डॉक्टर",
  "AQI Monitor": "एक्यूआई मॉनिटर",
  "Real-Time Subregion Scan": "रीयल-टाइम उपक्षेत्र स्कैन",
  "Subregion Clinical Capacity": "उपक्षेत्र क्लिनिकल क्षमता",
  "Outbreak Monitoring": "प्रकोप निगरानी",
  "Disease Vectors": "रोग वैक्टर",
  "Emergency Contacts": "आपातकालीन संपर्क",
  "Grid Communications": "ग्रिड संचार",
  "Regional Danger Alerts": "क्षेत्रीय खतरे की चेतावनी",
  "System Diagnostics": "सिस्टम डायग्नोस्टिक्स",
  "AI Clinical Dispatch": "एआई क्लिनिकल प्रेषण",
  // Navigation & Groups
  "Care": "स्वास्थ्य देखभाल",
  "CARE": "स्वास्थ्य देखभाल",
  "Records & orders": "रिकॉर्ड और ऑर्डर",
  "RECORDS & ORDERS": "रिकॉर्ड और ऑर्डर",
  "Records & Orders": "रिकॉर्ड और ऑर्डर",
  "Explore": "एक्सप्लोर करें",
  "EXPLORE": "एक्सप्लोर करें",
  "Staff tools": "स्टाफ उपकरण",
  "STAFF TOOLS": "स्टाफ उपकरण",
  "Staff Tools": "स्टाफ उपकरण",
  "Home": "होम",
  "Features": "सुविधाएँ",
  "Doctor network": "डॉक्टर नेटवर्क",
  "Doctor Network": "डॉक्टर नेटवर्क",
  "Check symptoms": "लक्षण जाँचें",
  "Health trends": "स्वास्थ्य रुझान",
  "Hospital beds": "अस्पताल बेड",
  "Find a doctor": "डॉक्टर खोजें",
  "Medicines": "दवाइयाँ",
  "My records": "मेरे रिकॉर्ड",
  "Insurance": "बीमा",
  "Emergency": "आपातकाल",
  "Hospitals & staff": "अस्पताल और स्टाफ",
  "City health map": "शहर स्वास्थ्य मानचित्र",
  "Developer console": "डेवलपर कंसोल",
  "Developer Hub": "डेवलपर हब",

  // Header & Top Controls
  "HUB SERVICE CONTROL": "हब सेवा नियंत्रण",
  "Search staff, doctors...": "स्टाफ, डॉक्टर खोजें...",
  "Reconnect clinical grid": "क्लिनिकल ग्रिड पुनः कनेक्ट करें",
  "Live Regional Network Connection": "लाइव क्षेत्रीय नेटवर्क कनेक्शन",
  "/ Metropolitan Medical Grid": "/ महानगरीय चिकित्सा ग्रिड",
  "Role:": "भूमिका:",
  "ROLE:": "भूमिका:",
  "Profile:": "प्रोफ़ाइल:",
  "PROFILE:": "प्रोफ़ाइल:",
  "Patient / Self": "मरीज़ / स्वयं",
  "Doctor Core": "मुख्य डॉक्टर",
  "Hospital staff": "अस्पताल स्टाफ",
  "Admin hub": "प्रशासन केंद्र",
  "Profile Settings": "प्रोफ़ाइल सेटिंग्स",
  "Add Patient": "मरीज जोड़ें",
  "+ Add Patient": "+ मरीज जोड़ें",
  "Sign Out": "साइन आउट",
  "Sign In": "साइन इन",
  "Log Out": "लॉग आउट",
  "Login": "लॉगिन",
  "Register": "पंजीकरण करें",
  "Switch to Dark Mode": "डार्क मोड चालू करें",
  "Switch to Light Mode": "लाइट मोड चालू करें",
  "Profile & Security Settings": "प्रोफ़ाइल और सुरक्षा सेटिंग्स",
  "Delete Active Patient Profile": "सक्रिय मरीज प्रोफ़ाइल हटाएं",
  "Self (Primary User (City Healer User))": "स्वयं (प्राथमिक उपयोगकर्ता)",
  "Self (Primary User)": "स्वयं (प्राथमिक उपयोगकर्ता)",
  "Self": "स्वयं",

  // Hero Card & Copilot
  "Hello, City Healer User": "नमस्ते, सिटी हीलर उपयोगकर्ता",
  "Hello, City": "नमस्ते, सिटी",
  "Hello, there": "नमस्ते",
  "AI POWERED": "एआई संचालित",
  "AI Powered": "एआई संचालित",
  "AI Health Copilot": "एआई स्वास्थ्य कोपायलट",
  "Unified Health ID": "एकीकृत स्वास्थ्य पहचान (Health ID)",
  "Your last clinical review was 14 days ago. Overall health is optimal.": "आपकी पिछली क्लीनिकल समीक्षा 14 दिन पहले हुई थी। समग्र स्वास्थ्य उत्तम है।",

  // Emergency SOS Card
  "EMERGENCY SOS": "आपातकालीन एसओएस (SOS)",
  "Emergency SOS": "आपातकालीन एसओएस (SOS)",
  "ONE-TAP RESPONSE DISPATCHED": "एक-टैप त्वरित प्रतिक्रिया प्रेषित",
  "Dispatch Ambulance": "एम्बुलेंस भेजें",
  "Emergency Response": "आपातकालीन प्रतिक्रिया",
  "Live SOS Tracking": "लाइव एसओएस ट्रैकिंग",
  "Emergency Contact": "आपातकालीन संपर्क",
  "Ambulance Dispatched": "एम्बुलेंस रवाना हो गई",

  // Live OPD Progression
  "LIVE OPD PROGRESSION": "लाइव ओपीडी प्रगति",
  "Live OPD Progression": "लाइव ओपीडी प्रगति",
  "Token #00": "टोकन #00",
  "No active clinics waiting token queue": "कोई सक्रिय क्लीनिक प्रतीक्षा टोकन कतार नहीं",
  "Get Virtual OPD token": "वर्चुअल ओपीडी टोकन प्राप्त करें",
  "Estimated Wait Time": "अनुमानित प्रतीक्षा समय",
  "Current Token": "वर्तमान टोकन",
  "Your Position": "आपकी स्थिति",
  "Queue Position": "कतार में स्थिति",

  // Hospital Occupancy & Bed Triage Grid
  "HOSPITAL OCCUPANCY": "अस्पताल में बेड उपलब्धता",
  "Hospital Occupancy": "अस्पताल में बेड उपलब्धता",
  "Find Nearest Hospital": "निकटतम अस्पताल खोजें",
  "View Live Map Locator": "लाइव मानचित्र लोकेटर देखें",
  "Metropolitan Live Bed Triage Grid": "महानगरीय लाइव बेड ट्राइएज ग्रिड",
  "Live operational census for hospital bed allocation. Patients can map vacancies and coordinate emergency transit.": "अस्पताल बेड आवंटन के लिए लाइव परिचालन गणना। मरीज रिक्तियों का नक्शा देख सकते हैं और आपातकालीन पारगमन का समन्वय कर सकते हैं।",
  "TRAUMA CENTERS & HOSPITAL REGISTRIES": "ट्रॉमा सेंटर और अस्पताल पंजीयन",
  "Trauma Centers & Hospital Registries": "ट्रॉमा सेंटर और अस्पताल पंजीयन",
  "Available Beds": "उपलब्ध बेड",
  "Total Beds": "कुल बेड",
  "ICU Reserve": "आईसीयू रिजर्व",
  "ICU Available": "आईसीयू उपलब्ध",
  "General Beds": "सामान्य बेड",
  "Oxygen Beds": "ऑक्सीजन बेड",
  "Ventilator Beds": "वेंटिलेटर बेड",
  "vacant": "रिक्त",
  "beds left": "बेड शेष",
  "Emergency Ward": "आपातकालीन वार्ड",
  "Emergency Occupancy": "आपातकालीन ऑक्यूपेंसी",
  "EMERGENCY OCCUPANCY": "आपातकालीन ऑक्यूपेंसी",
  "OCCUPANCY": "ऑक्यूपेंसी",
  "Occupancy": "ऑक्यूपेंसी",
  "Call Desk": "कॉल डेस्क",
  "Map & Track Dispatch": "मानचित्र व डिस्पैच ट्रैक करें",
  "SOS Direct": "सीधा एसओएस (SOS)",
  "Open Google Maps Live Route": "गूगल मैप्स लाइव रूट खोलें",
  "GOOGLE MAPS API LINKED": "गूगल मैप्स एपीआई लिंक्ड",
  "Google Maps API Linked": "गूगल मैप्स एपीआई लिंक्ड",
  "OSM Network Linked": "ओएसएम नेटवर्क लिंक्ड",
  "LOCATING...": "स्थान खोज रहे हैं...",
  "Locating...": "स्थान खोज रहे हैं...",
  "Delhi NCR LIVE TRAUMA MAP": "दिल्ली एनसीआर लाइव ट्रॉमा मैप",
  "DELHI NCR LIVE TRAUMA MAP": "दिल्ली एनसीआर लाइव ट्रॉमा मैप",
  "NCR LIVE TRAUMA MAP": "एनसीआर लाइव ट्रॉमा मैप",
  "Target Node: None Selected": "लक्षित केंद्र: कोई चयनित नहीं",
  "Target Node:": "लक्षित केंद्र:",
  "None Selected": "कोई चयनित नहीं",
  "RADIUS": "दायरा (Radius)",
  "Radius": "दायरा",
  "ALL": "सभी",
  "All": "सभी",
  "Unlimited": "असीमित",
  "EST. DISTANCE": "अनुमानित दूरी",
  "Est. Distance": "अनुमानित दूरी",
  "EST. TRANSIT DURATION": "अनुमानित यात्रा समय",
  "Est. Transit Duration": "अनुमानित यात्रा समय",
  "LIVE DRIVING ESCORT": "लाइव ड्राइविंग सुरक्षा एस्कॉर्ट",
  "Reset Search Radius": "खोज दायरा रीसेट करें",

  // City Health Twin (CHN)
  "CITY HEALTH TWIN (CHN)": "सिटी हेल्थ ट्विन (सीएचएन)",
  "City Health Twin (CHN)": "सिटी हेल्थ ट्विन (सीएचएन)",
  "SELECTED NCR CITY": "चयनित एनसीआर शहर",
  "Selected NCR City": "चयनित एनसीआर शहर",
  "HEALTH RATING": "स्वास्थ्य रेटिंग",
  "Operating Index": "ऑपरेटिंग इंडेक्स",
  "ATMOSPHERE AQI": "वायु गुणवत्ता सूचकांक (AQI)",
  "Atmosphere AQI": "वायु गुणवत्ता सूचकांक (AQI)",
  "CLEAR AREA": "स्वच्छ क्षेत्र",
  "Alerts: Water-borne (Sohna)": "अलर्ट: जल-जनित (सोहना)",
  "Launch City Twin HUB": "सिटी ट्विन हब खोलें",
  "Disease Outbreak Risk": "बीमारी प्रकोप का जोखिम",
  "Air Quality": "वायु गुणवत्ता",
  "AQI Level": "एक्यूआई स्तर",

  // Active Consultations
  "Active Consultations": "सक्रिय परामर्श",
  "ACTIVE CONSULTATIONS": "सक्रिय परामर्श",
  "No active scheduled consultations": "कोई सक्रिय निर्धारित परामर्श नहीं है",
  "AI Matcher": "एआई मैचर",
  "Book Standard": "सामान्य बुकिंग",
  "To request medications or look up digital records, verify Doctor updates or select Doctor simulate role at the top header list!": "दवाइयों के अनुरोध या डिजिटल रिकॉर्ड देखने के लिए, डॉक्टर अपडेट सत्यापित करें या शीर्ष हेडर सूची में डॉक्टर अनुकरण भूमिका चुनें!",

  // AI Health Status
  "AI HEALTH STATUS": "एआई स्वास्थ्य स्थिति",
  "AI Health Status": "एआई स्वास्थ्य स्थिति",
  "AI PREDICTION": "एआई भविष्यवाणी",
  "AI Prediction": "एआई भविष्यवाणी",
  "Recover rate has advanced 4% over the past fortnight. Keep consistent cardiovascular metrics.": "पिछले पखवाड़े में रिकवरी दर 4% बढ़ी है। स्थिर हृदय संबंधी मेट्रिक्स बनाए रखें।",
  "Minimal regional influenza exposure based on localized sewage analytics.": "स्थानीयकृत सीवेज विश्लेषण के आधार पर न्यूनतम क्षेत्रीय इन्फ्लूएंजा जोखिम।",
  "Model: Gemini 1.5 Med-Spec": "मॉडल: जेमिनी 1.5 मेड-स्पेक",
  "Model: Gemini 3.5 Med-Spec": "मॉडल: जेमिनी 3.5 मेड-स्पेक",
  "SAFE INDEX": "सुरक्षा सूचकांक",
  "Safe Index": "सुरक्षा सूचकांक",

  // Bottom Pharmacy Banner
  "Need custom medicines? Place express order at pharmacy grid!": "कस्टम दवाइयों की आवश्यकता है? फार्मेसी ग्रिड से एक्सप्रेस ऑर्डर करें!",
  "Browse standard painkillers, antibiotic segments, first-aid remedies, or connect verified clinical prescription tags from your reports list immediately.": "मानक दर्द निवारक, एंटीबायोटिक्स, प्राथमिक उपचार दवाएं ब्राउज़ करें, या अपनी रिपोर्ट सूची से तुरंत सत्यापित पर्चे जोड़ें।",
  "Enter Medical Pharmacy": "मेडिकल फार्मेसी में प्रवेश करें",

  // Hospital Names & Variations
  "Indraprastha Apollo Hospital | Best Hospital in Delhi": "इंद्रप्रस्थ अपोलो अस्पताल | दिल्ली का सर्वश्रेष्ठ अस्पताल",
  "Indraprastha Apollo Hospital": "इंद्रप्रस्थ अपोलो अस्पताल",
  "Max Super Speciality Hospital, Saket (Max Saket)": "मैक्स सुपर स्पेशियलिटी अस्पताल, साकेत (मैक्स साकेत)",
  "Max Super Speciality Hospital": "मैक्स सुपर स्पेशियलिटी अस्पताल",
  "BLK-Max Super Speciality Hospital Delhi": "बीएलके-मैक्स सुपर स्पेशियलिटी अस्पताल दिल्ली",
  "BLK-Max Super Speciality Hospital": "बीएलके-मैक्स सुपर स्पेशियलिटी अस्पताल",
  "Fortis Flt Lt Rajan Dhall Hospital, Vasant Kunj - Best Hospital in New Delhi": "फोर्टिस एफएलटी एलटी राजन ढल अस्पताल, वसंत कुंज - नई दिल्ली का सर्वश्रेष्ठ अस्पताल",
  "Fortis Flt Lt Rajan Dhall Hospital": "फोर्टिस एफएलटी एलटी राजन ढल अस्पताल",
  "Dharamshila Narayana Superspeciality Hospital, Delhi": "धर्मशिला नारायणा सुपरस्पेशियलिटी अस्पताल, दिल्ली",
  "Dharamshila Narayana Superspeciality Hospital": "धर्मशिला नारायणा सुपरस्पेशियलिटी अस्पताल",
  "Primus Super Speciality Hospital": "प्राइमस सुपर स्पेशियलिटी अस्पताल",
  "Aakash Healthcare Super Speciality Hospital": "आकाश हेल्थकेयर सुपर स्पेशियलिटी अस्पताल",
  "CK Birla Hospital, Delhi": "सीके बिड़ला अस्पताल, दिल्ली",
  "CK Birla Hospital": "सीके बिड़ला अस्पताल",
  "SCI International Hospital": "एससीआई इंटरनेशनल अस्पताल",
  "Saroj Super Speciality Hospital": "सरोज सुपर स्पेशियलिटी अस्पताल",
  "PSRI Multispeciality Hospital Delhi": "पीएसआरआई मल्टीस्पेशियलिटी अस्पताल दिल्ली",
  "PSRI Hospital": "पीएसआरआई अस्पताल",
  "Manipal Hospital Dwarka": "मणिपाल अस्पताल द्वारका",
  "Sir Ganga Ram Hospital, Old Rajinder Nagar, Delhi": "सर गंगा राम अस्पताल, ओल्ड राजेंद्र नगर, दिल्ली",
  "Sir Ganga Ram Hospital": "सर गंगा राम अस्पताल",
  "Medanta - The Medicity, Gurugram": "मेदांता - द मेडिसिटी, गुरुग्राम",
  "Medanta - The Medicity": "मेदांता - द मेडिसिटी",
  "Medanta": "मेदांता",
  "Artemis Hospital, Gurugram": "आर्टेमिस अस्पताल, गुरुग्राम",
  "Artemis Hospital": "आर्टेमिस अस्पताल",
  "Fortis Memorial Research Institute (FMRI), Gurugram": "फोर्टिस मेमोरियल रिसर्च इंस्टीट्यूट (FMRI), गुरुग्राम",
  "Fortis Memorial Research Institute": "फोर्टिस मेमोरियल रिसर्च इंस्टीट्यूट",
  "Max Hospital, Gurgaon": "मैक्स अस्पताल, गुड़गांव",
  "Paras Health, Gurugram": "पारस हेल्थ, गुरुग्राम",
  "Paras Hospital": "पारस अस्पताल",
  "Jaypee Hospital, Noida": "जेपी अस्पताल, नोएडा",
  "Jaypee Hospital": "जेपी अस्पताल",
  "Fortis Hospital, Sector 62, Noida": "फोर्टिस अस्पताल, सेक्टर 62, नोएडा",
  "Felix Hospital, Sector 137, Noida": "फेलिक्स अस्पताल, सेक्टर 137, नोएडा",
  "Yashoda Super Speciality Hospital, Kaushambi, Ghaziabad": "यशोदा सुपर स्पेशियलिटी अस्पताल, कौशाम्बी, गाजियाबाद",
  "Yashoda Super Speciality Hospital": "यशोदा सुपर स्पेशियलिटी अस्पताल",
  "Max Super Speciality Hospital, Vaishali, Ghaziabad": "मैक्स सुपर स्पेशियलिटी अस्पताल, वैशाली, गाजियाबाद",
  "Sarvodaya Hospital, Sector 8, Faridabad": "सर्वोदय अस्पताल, सेक्टर 8, फरीदाबाद",
  "Sarvodaya Hospital": "सर्वोदय अस्पताल",
  "Amrita Hospital, Sector 88, Faridabad": "अमृता अस्पताल, सेक्टर 88, फरीदाबाद",
  "Amrita Hospital": "अमृता अस्पताल",
  "All India Institute of Medical Sciences (AIIMS), New Delhi": "अखिल भारतीय आयुर्विज्ञान संस्थान (एम्स), नई दिल्ली",
  "AIIMS New Delhi": "एम्स नई दिल्ली",
  "AIIMS": "एम्स (AIIMS)",
  "Safdarjung Hospital, New Delhi": "सफदरजंग अस्पताल, नई दिल्ली",
  "Safdarjung Hospital": "सफदरजंग अस्पताल",
  "Dr. Ram Manohar Lohia Hospital (RML), New Delhi": "डॉ. राम मनोहर लोहिया अस्पताल (आरएमएल), नई दिल्ली",
  "RML Hospital": "आरएमएल अस्पताल",
  "Lok Nayak Hospital (LNJP), Delhi": "लोक नायक अस्पताल (एलएनजेपी), दिल्ली",
  "LNJP Hospital": "एलएनजेपी अस्पताल",
  "Guru Teg Bahadur Hospital (GTB), Dilshad Garden": "गुरु तेग बहादुर अस्पताल (जीटीबी), दिलशाद गार्डन",
  "GTB Hospital": "जीटीबी अस्पताल",

  // Hospital Addresses & Localities
  "Sarita Vihar, Delhi-Mathura Road, New Delhi, Delhi 110076": "सरिता विहार, दिल्ली-मथुरा रोड, नई दिल्ली, दिल्ली 110076",
  "1-2, Press Enclave Road, Saket Institutional Area, New Delhi, Delhi 110017": "1-2, प्रेस एन्क्लेव रोड, साकेत इंस्टीट्यूशनल एरिया, नई दिल्ली, दिल्ली 110017",
  "Pusa Road, Radha Soami Satsang, Rajendra Place, New Delhi, Delhi 110005": "पूसा रोड, राधा स्वामी सत्संग, राजेंद्र प्लेस, नई दिल्ली, दिल्ली 110005",
  "Aruna Asaf Ali Marg, Sector B, Pocket 1, Vasant Kunj, New Delhi, Delhi 110070": "अरुणा आसफ अली मार्ग, सेक्टर बी, पॉकेट 1, वसंत कुंज, नई दिल्ली, दिल्ली 110070",
  "Metro Station Budh Vihar, Dharamshila Marg, Vasundhara Enclave, Delhi 110096": "मेट्रो स्टेशन बुध विहार, धर्मशिला मार्ग, वसुंधरा एन्क्लेव, दिल्ली 110096",
  "Chandragupta Marg, Chanakyapuri, New Delhi, Delhi 110021": "चंद्रगुप्त मार्ग, चाणक्यपुरी, नई दिल्ली, दिल्ली 110021",
  "Road No. 201, Sector 3, Dwarka, New Delhi, Delhi 110075": "रोड नं. 201, सेक्टर 3, द्वारका, नई दिल्ली, दिल्ली 110075",
  "Block AG, Shalimar Bagh, New Delhi, Delhi 110088": "ब्लॉक एजी, शालीमार बाग, नई दिल्ली, दिल्ली 110088",
  "M-4, Greater Kailash-I, New Delhi, Delhi 110048": "एम-4, ग्रेटर कैलाश-1, नई दिल्ली, दिल्ली 110048",
  "Madhuban Chowk, Bhagwan Mahavir Marg, Sector 14, Rohini, Delhi 110085": "मधुबन चौक, भगवान महावीर मार्ग, सेक्टर 14, रोहिणी, दिल्ली 110085",
  "Press Enclave Marg, JNS Marg, Sheikh Sarai Phase II, New Delhi, Delhi 110017": "प्रेस एन्क्लेव मार्ग, जेएनएस मार्ग, शेख सराय फेज 2, नई दिल्ली, दिल्ली 110017",
  "Sector 6, Dwarka, New Delhi, Delhi 110075": "सेक्टर 6, द्वारका, नई दिल्ली, दिल्ली 110075",
  "Sir Ganga Ram Hospital Marg, Old Rajinder Nagar, New Delhi, Delhi 110060": "सर गंगा राम अस्पताल मार्ग, ओल्ड राजेंद्र नगर, नई दिल्ली, दिल्ली 110060",
  "CH Bakhtawar Singh Rd, Medicity, Islampur Colony, Sector 38, Gurugram, Haryana 122001": "सीएच बख्तावर सिंह रोड, मेडिसिटी, इस्लामपुर कॉलोनी, सेक्टर 38, गुरुग्राम, हरियाणा 122001",
  "Sector 51, Gurugram, Haryana 122001": "सेक्टर 51, गुरुग्राम, हरियाणा 122001",
  "Sector 44, Opposite HUDA City Centre, Gurugram, Haryana 122002": "सेक्टर 44, हुडा सिटी सेंटर के सामने, गुरुग्राम, हरियाणा 122002",
  "B-Block, Sushant Lok I, Sector 43, Gurugram, Haryana 122002": "बी-ब्लॉक, सुशांत लोक 1, सेक्टर 43, गुरुग्राम, हरियाणा 122002",
  "C-1, Sushant Lok-I, Sector 43, Phase-I, Gurugram, Haryana 122002": "सी-1, सुशांत लोक-1, सेक्टर 43, फेज-1, गुरुग्राम, हरियाणा 122002",
  "Wish Town, Sector 128, Noida, Uttar Pradesh 201304": "विश टाउन, सेक्टर 128, नोएडा, उत्तर प्रदेश 201304",
  "B-22, Sector 62, Gautam Buddha Nagar, Noida, Uttar Pradesh 201301": "बी-22, सेक्टर 62, गौतम बुद्ध नगर, नोएडा, उत्तर प्रदेश 201301",
  "Sector 137, Expressway, Noida, Uttar Pradesh 201305": "सेक्टर 137, एक्सप्रेसवे, नोएडा, उत्तर प्रदेश 201305",
  "Kaushambi, Near Anand Vihar ISBT, Ghaziabad, Uttar Pradesh 201010": "कौशाम्बी, आनंद विहार आईएसबीटी के पास, गाजियाबाद, उत्तर प्रदेश 201010",
  "W-3, Sector 1, Vaishali, Ghaziabad, Uttar Pradesh 201012": "डब्ल्यू-3, सेक्टर 1, वैशाली, गाजियाबाद, उत्तर प्रदेश 201012",
  "YMCA Road, Sector 8, Faridabad, Haryana 121006": "वाईएमसीए रोड, सेक्टर 8, फरीदाबाद, हरियाणा 121006",
  "Mata Amritanandamayi Marg, Sector 88, Faridabad, Haryana 121002": "माता अमृतानंदमयी मार्ग, सेक्टर 88, फरीदाबाद, हरियाणा 121002",
  "Sri Aurobindo Marg, Ansari Nagar, New Delhi, Delhi 110029": "श्री अरबिंदो मार्ग, अंसारी नगर, नई दिल्ली, दिल्ली 110029",
  "Ring Road, Opposite AIIMS, Safdarjung Enclave, New Delhi, Delhi 110029": "रिंग रोड, एम्स के सामने, सफदरजंग एन्क्लेव, नई दिल्ली, दिल्ली 110029",
  "Baba Kharak Singh Marg, Connaught Place, New Delhi, Delhi 110001": "बाबा खड़क सिंह मार्ग, कनॉट प्लेस, नई दिल्ली, दिल्ली 110001",
  "Jawaharlal Nehru Marg, Delhi Gate, New Delhi, Delhi 110002": "जवाहरलाल नेहरू मार्ग, दिल्ली गेट, नई दिल्ली, दिल्ली 110002",
  "Tahirpur Rd, Dilshad Garden, Shahdara, Delhi 110095": "ताहिरपुर रोड, दिलशाद गार्डन, शाहदरा, दिल्ली 110095",

  // Doctor Names & Titles
  "Dr. Naresh Trehan": "डॉ. नरेश त्रेहन",
  "Dr. Rajesh Sharma": "डॉ. राजेश शर्मा",
  "Dr. Sushant Aggarwal": "डॉ. सुशांत अग्रवाल",
  "Dr. Ashok Seth": "डॉ. अशोक सेठ",
  "Dr. Sandeep Vaishya": "डॉ. संदीप वैश्य",
  "Dr. Arvinder Singh Soin": "डॉ. अरविंदर सिंह सोइन",
  "Dr. Pradeep Chowbey": "डॉ. प्रदीप चौबे",
  "Dr. Balbir Singh": "डॉ. बलबीर सिंह",
  "Dr. Vinod Raina": "डॉ. विनोद रैना",
  "Dr. Subhash Chandra": "डॉ. सुभाष चंद्रा",
  "Dr. Ajay Kaul": "डॉ. अजय कौल",
  "Dr. Sanjay Tyagi": "डॉ. संजय त्यागी",
  "Dr. Vivek Raj": "डॉ. विवेक राज",
  "Dr. Amit Agarwal": "डॉ. अमित अग्रवाल",
  "Dr. Priya Sharma": "डॉ. प्रिया शर्मा",
  "Dr. Sunita Verma": "डॉ. सुनीता वर्मा",
  "Dr. Anjali Gupta": "डॉ. अंजलि गुप्ता",
  "Dr. Neha Mehta": "डॉ. नेहा मेहता",
  "Dr. Pooja Rao": "डॉ. पूजा राव",
  "Dr. Ramesh Kumar": "डॉ. रमेश कुमार",

  // Medicine Names
  "Paracetamol 650mg": "पैरासिटामोल 650mg",
  "Amoxicillin 500mg": "एमोक्सिसिलिन 500mg",
  "Azithromycin 500mg": "एज़िथ्रोमाइसिन 500mg",
  "Metformin 500mg": "मेटफॉर्मिन 500mg",
  "Atorvastatin 10mg": "एटोरवास्टेटिन 10mg",
  "Pantoprazole 40mg": "पेंटोप्राजोल 40mg",
  "Omeprazole 20mg": "ओमेप्राजोल 20mg",
  "Ciprofloxacin 500mg": "सिप्रोफ्लोक्सासिन 500mg",
  "Cetirizine 10mg": "सिटिरिज़िन 10mg",
  "Montelukast 10mg": "मोंटेलुकास्ट 10mg",
  "Losartan 50mg": "लोसार्टन 50mg",
  "Amlodipine 5mg": "एम्लोडिपिन 5mg",
  "Telmisartan 40mg": "टेल्मीसार्टन 40mg",
  "Ibuprofen 400mg": "इबुप्रोफेन 400mg",
  "Diclofenac 50mg": "डाइक्लोफेनाक 50mg",
  "Tramadol 50mg": "ट्रामाडोल 50mg",
  "Dolo 650": "डोलो 650",
  "Crocin 650": "क्रोसिन 650",
  "Combiflam": "कॉम्बीफ्लाम",
  "Pan 40": "पैन 40",
  "Pan D": "पैन डी",
  "Augmentin 625 Duo": "ऑगमेंटिन 625 डुओ",

  // Common UI Labels, Actions & Verbs
  "Book Appointment": "अपॉइंटमेंट बुक करें",
  "Find Doctors": "डॉक्टर खोजें",
  "Search doctors by name, specialty, hospital...": "नाम, विशेषज्ञता, अस्पताल से डॉक्टर खोजें...",
  "Filter by Specialty": "विशेषज्ञता के अनुसार फ़िल्टर करें",
  "Filter Doctors": "डॉक्टर फ़िल्टर करें",
  "Select Specialty": "विशेषज्ञता चुनें",
  "Experience": "अनुभव",
  "Rating": "रेटिंग",
  "Patients Served": "इलाज किए गए मरीज",
  "Online Now": "अभी ऑनलाइन",
  "Offline": "ऑफ़लाइन",
  "Consultation Fee": "परामर्श शुल्क",
  "Join Queue": "कतार में शामिल हों",
  "Video Consult": "वीडियो परामर्श",
  "In-Clinic Visit": "क्लिनिक विज़िट",
  "Available Slots": "उपलब्ध स्लॉट",
  "Confirmed": "पुष्टि की गई",
  "Pending": "लंबित",
  "Cancelled": "रद्द किया गया",
  "Completed": "पूर्ण",
  "Accepted": "स्वीकृत",
  "Upcoming Appointments": "आगामी अपॉइंटमेंट्स",
  "Past Consultations": "पिछले परामर्श",
  "Clinical Summary": "क्लीनिकल सारांश",
  "Write Prescription": "पर्चा (प्रिस्क्रिप्शन) लिखें",
  "Symptoms Description": "लक्षणों का विवरण",

  // Medical Specialties
  "Cardiology": "कार्डियोलॉजी (हृदय रोग)",
  "Cardiologist": "हृदय रोग विशेषज्ञ",
  "Neurology": "न्यूरोलॉजी (तंत्रिका रोग)",
  "Neurologist": "तंत्रिका रोग विशेषज्ञ",
  "Orthopedics": "ऑर्थोपेडिक्स (हड्डी रोग)",
  "Orthopedic": "हड्डी रोग विशेषज्ञ",
  "Pediatrics": "बाल रोग (पीडियाट्रिक्स)",
  "Pediatrician": "बाल रोग विशेषज्ञ",
  "Dermatology": "त्वचा रोग (डर्मेटोलॉजी)",
  "Dermatologist": "त्वचा रोग विशेषज्ञ",
  "General Medicine": "सामान्य चिकित्सा (जनरल मेडिसिन)",
  "General Physician": "सामान्य चिकित्सक",
  "Gynecology": "स्त्री एवं प्रसूति रोग",
  "Gynecologist": "स्त्री रोग विशेषज्ञ",
  "ENT Specialist": "ईएनटी (नाक, कान, गला) विशेषज्ञ",
  "ENT": "ईएनटी (नाक, कान, गला)",
  "Ophthalmology": "नेत्र रोग (ऑप्थल्मोलॉजी)",
  "Ophthalmologist": "नेत्र रोग विशेषज्ञ",
  "Oncology": "कैंसर रोग (ऑन्कोलॉजी)",
  "Oncologist": "कैंसर रोग विशेषज्ञ",
  "Psychiatry": "मनोचिकित्सा (साइकियाट्री)",
  "Psychiatrist": "मनोचिकित्सक",
  "Pulmonology": "श्वसन रोग (पल्मोनोलॉजी)",
  "Pulmonologist": "श्वसन रोग विशेषज्ञ",
  "Gastroenterology": "गैस्ट्रोएंटरोलॉजी (पेट रोग)",
  "Nephrology": "नेफ्रोलॉजी (गुर्दा रोग)",
  "Urology": "यूरोलॉजी (मूत्र रोग)",
  "Dentistry": "दंत चिकित्सा (डेंटिस्ट)",

  // Symptom Checker & Triage
  "AI Symptom Checker": "एआई लक्षण जांचकर्ता",
  "Describe your symptoms in detail...": "अपने लक्षणों का विस्तार से वर्णन करें...",
  "Analyze Symptoms": "लक्षणों का विश्लेषण करें",
  "Triage Assessment": "ट्राइएज मूल्यांकन",
  "Severity Level": "गंभीरता स्तर",
  "Mild": "हल्का (Mild)",
  "Moderate": "मध्यम (Moderate)",
  "Severe": "गंभीर (Severe)",
  "Critical": "अति गंभीर (Critical)",
  "Recommended Specialist": "अनुशंसित विशेषज्ञ",
  "Suggested Actions": "सुझाए गए कदम",
  "Home Care Advice": "घरेलू देखभाल सलाह",
  "Seek Immediate Medical Attention": "तत्काल चिकित्सा सहायता लें",
  "AI Diagnostic Assistant": "एआई डायग्नोस्टिक सहायक",
  "Symptom Assessment": "लक्षण मूल्यांकन",

  // Pharmacy & Medicines
  "E-Pharmacy": "ई-फार्मेसी",
  "Search medicines, salts, brands...": "दवाइयाँ, साल्ट, ब्रांड खोजें...",
  "Add to Cart": "कार्ट में जोड़ें",
  "Buy Now": "अभी खरीदें",
  "Prescription Required": "पर्चा (प्रिस्क्रिप्शन) आवश्यक",
  "No Prescription Required": "पर्चे की आवश्यकता नहीं",
  "In Stock": "उपलब्ध है",
  "Out of Stock": "उपलब्ध नहीं है",
  "Price": "कीमत",
  "Dosage Form": "दवा का प्रकार",
  "Tablet": "टैबलेट",
  "Capsule": "कैप्सूल",
  "Syrup": "सिरप",
  "Injection": "इंजेक्शन",
  "Ointment": "मलहम (ऑइंटमेंट)",
  "Drops": "ड्रॉप्स",
  "Order Placed": "ऑर्डर दे दिया गया",
  "Delivered": "डिलीवर हो गया",
  "Track Order": "ऑर्डर ट्रैक करें",
  "Upload Prescription": "पर्चा अपलोड करें",
  "Cart Total": "कुल कार्ट राशि",
  "Checkout": "चेकआउट",
  "Place Order": "ऑर्डर दें",
  "Order Summary": "ऑर्डर सारांश",

  // Medical Records & Health Locker
  "My Medical Records": "मेरे मेडिकल रिकॉर्ड्स",
  "Upload Medical Record": "मेडिकल रिकॉर्ड अपलोड करें",
  "Prescriptions": "पर्चे (प्रिस्क्रिप्शन)",
  "Lab Reports": "लैब रिपोर्ट",
  "Scans & X-Rays": "स्कैन और एक्स-रे",
  "Discharge Summary": "डिस्चार्ज सारांश",
  "Doctor Notes": "डॉक्टर के नोट्स",
  "Download PDF": "पीडीएफ डाउनलोड करें",
  "Share with Doctor": "डॉक्टर के साथ साझा करें",
  "Date of Report": "रिपोर्ट की तिथि",
  "Diagnosed by": "निदानकर्ता डॉक्टर",
  "Attach Document": "दस्तावेज़ संलग्न करें",
  "Sync Records": "रिकॉर्ड सिंक करें",
  "ABHA Health Locker": "आभा (ABHA) हेल्थ लॉकर",
  "ABHA ID": "आभा (ABHA) आईडी",

  // Insurance & Claims
  "Health Insurance": "स्वास्थ्य बीमा",
  "Active Policy": "सक्रिय पॉलिसी",
  "Sum Insured": "बीमा राशि",
  "Claim Status": "दावा (क्लेम) स्थिति",
  "Cashless Hospitals": "कैशलेस अस्पताल",
  "File a Claim": "दावा (क्लेम) दर्ज करें",
  "Policy Number": "पॉलिसी नंबर",
  "Coverage Details": "कवरेज विवरण",
  "Network Hospitals": "नेटवर्क अस्पताल",
  "Cashless Approval": "कैशलेस स्वीकृति",

  // General Actions & Controls
  "Submit": "जमा करें",
  "Save": "सहेजें",
  "Cancel": "रद्द करें",
  "Delete": "हटाएं",
  "Edit": "संपादित करें",
  "Update": "अपडेट करें",
  "Close": "बंद करें",
  "Back": "पीछे जाएं",
  "Next": "आगे बढ़ें",
  "Filter": "फ़िल्टर",
  "Sort": "क्रमबद्ध करें",
  "Search": "खोजें",
  "View Details": "विवरण देखें",
  "Show More": "और दिखाएं",
  "Show Less": "कम दिखाएं",
  "Details": "विवरण",
  "Status": "स्थिति",
  "Action": "कार्रवाई",
  "Actions": "कार्रवाइयाँ",
  "Loading...": "लोड हो रहा है...",
  "Please wait...": "कृपया प्रतीक्षा करें...",
  "Success": "सफलता",
  "Error": "त्रुटि",
  "Warning": "चेतावनी",
  "Yes": "हाँ",
  "No": "नहीं",
  "Confirm": "पुष्टि करें",
  "Name": "नाम",
  "Age": "उम्र",
  "Gender": "लिंग",
  "Male": "पुरुष",
  "Female": "महिला",
  "Other": "अन्य",
  "Blood Group": "रक्त समूह",
  "Phone Number": "फ़ोन नंबर",
  "Email Address": "ईमेल पता",
  "Password": "पासवर्ड",
  "Address": "पता",
  "City": "शहर",
  "Pincode": "पिनकोड",

  // Cities & Regions
  "Delhi": "दिल्ली",
  "New Delhi": "नई दिल्ली",
  "Gurugram": "गुरुग्राम",
  "Gurgaon": "गुड़गांव",
  "Noida": "नोएडा",
  "Greater Noida": "ग्रेटर नोएडा",
  "Faridabad": "फरीदाबाद",
  "Ghaziabad": "गाजियाबाद",
  "Saket": "साकेत",
  "Vasant Kunj": "वसंत कुंज",
  "Dwarka": "द्वारका",
  "Rohini": "रोहिणी",
  "Chanakyapuri": "चाणक्यपुरी",
  "Greater Kailash": "ग्रेटर कैलाश",
  "Shalimar Bagh": "शालीमार बाग",
  "Rajendra Place": "राजेंद्र प्लेस",
  "Sarita Vihar": "सरिता विहार",
  "Dilshad Garden": "दिलशाद गार्डन",
  "Connaught Place": "कनॉट प्लेस",

  // Common Dialogs & Messages
  "Are you sure?": "क्या आप सुनिश्चित हैं?",
  "Changes saved successfully.": "परिवर्तन सफलतापूर्वक सहेजे गए।",
  "Operation completed.": "कार्रवाई पूरी हुई।",
  "Invalid input.": "अमान्य इनपुट।",
  "No records found.": "कोई रिकॉर्ड नहीं मिला।",
  "No doctors found matching your criteria.": "आपके मानदंडों से मेल खाता कोई डॉक्टर नहीं मिला।"
};

/**
 * Word and token mappings used during regex replacements for compound addresses and titles
 */
export const TOKEN_DICTIONARY: Record<string, string> = {
  "Hospital": "अस्पताल",
  "Hospitals": "अस्पताल",
  "Super Speciality": "सुपर स्पेशियलिटी",
  "Superspeciality": "सुपर स्पेशियलिटी",
  "Multispeciality": "मल्टीस्पेशियलिटी",
  "Multi-speciality": "मल्टीस्पेशियलिटी",
  "Multi Speciality": "मल्टीस्पेशियलिटी",
  "Best Hospital in": "का सर्वश्रेष्ठ अस्पताल",
  "Best Hospital": "सर्वश्रेष्ठ अस्पताल",
  "Road": "रोड",
  "Rd": "रोड",
  "Marg": "मार्ग",
  "Street": "स्ट्रीट",
  "Enclave": "एन्क्लेव",
  "Vihar": "विहार",
  "Nagar": "नगर",
  "Place": "प्लेस",
  "Chowk": "चौक",
  "Sector": "सेक्टर",
  "Block": "ब्लॉक",
  "Pocket": "पॉकेट",
  "Phase": "फेज",
  "Institutional Area": "इंस्टीट्यूशनल एरिया",
  "Metro Station": "मेट्रो स्टेशन",
  "Memorial": "मेमोरियल",
  "Research Institute": "रिसर्च इंस्टीट्यूट",
  "Institute": "संस्थान",
  "Medical Sciences": "आयुर्विज्ञान संस्थान",
  "Trauma Center": "ट्रॉमा सेंटर",
  "Trauma Centers": "ट्रॉमा सेंटर",
  "Center": "केंद्र",
  "Centre": "केंद्र",
  "Clinic": "क्लीनिक",
  "Clinics": "क्लीनिक",
  "Care": "केयर",
  "Healthcare": "हेल्थकेयर",
  "Health": "हेल्थ",
  "Apollo": "अपोलो",
  "Max": "मैक्स",
  "Fortis": "फोर्टिस",
  "Medanta": "मेदांता",
  "Artemis": "आर्टेमिस",
  "Manipal": "मणिपाल",
  "Yashoda": "यशोदा",
  "Sarvodaya": "सर्वोदय",
  "Amrita": "अमृता",
  "Jaypee": "जेपी",
  "Felix": "फेलिक्स",
  "Primus": "प्राइमस",
  "Aakash": "आकाश",
  "Saroj": "सरोज",
  "CK Birla": "सीके बिड़ला",
  "SCI International": "एससीआई इंटरनेशनल",
  "Dharamshila Narayana": "धर्मशिला नारायणा",
  "Narayana": "नारायणा",
  "Sir Ganga Ram": "सर गंगा राम",
  "Safdarjung": "सफदरजंग",
  "AIIMS": "एम्स (AIIMS)",
  "RML": "आरएमएल",
  "LNJP": "एलएनजेपी",
  "GTB": "जीटीबी",
  "Dr.": "डॉ.",
  "Dr": "डॉ.",
  "Doctor": "डॉक्टर",
  "Doctors": "डॉक्टर",
  "Prof.": "प्रो.",
  "Prof": "प्रो.",
  "Consultant": "परामर्शदाता",
  "Surgeon": "सर्जन",
  "Specialist": "विशेषज्ञ",
  "Private": "निजी",
  "Government": "सरकारी",
  "Available": "उपलब्ध",
  "Occupancy": "ऑक्यूपेंसी",
  "OCCUPANCY": "ऑक्यूपेंसी",
  "Reserve": "रिजर्व",
  "RESERVE": "रिजर्व",
  "vacant": "रिक्त",
  "beds left": "बेड शेष",
  "km away": "किमी दूर",
  "mins": "मिनट",
  "Mins": "मिनट",
  "min": "मिनट",
  "Min": "मिनट",
  "hours": "घंटे",
  "Hours": "घंटे",
  "days": "दिन",
  "Days": "दिन",
  "ago": "पहले",
  "Live": "लाइव",
  "LIVE": "लाइव",
  "Grid": "ग्रिड",
  "GRID": "ग्रिड",
  "Triage": "ट्राइएज",
  "TRIAGE": "ट्राइएज",
  "Map": "मानचित्र",
  "MAP": "मानचित्र",
  "Dispatch": "डिस्पैच",
  "DISPATCH": "डिस्पैच",
  "Track": "ट्रैक",
  "TRACK": "ट्रैक",
  "Route": "रूट",
  "ROUTE": "रूट",
  "Online": "ऑनलाइन",
  "Offline": "ऑफ़लाइन",
  "Pending": "लंबित",
  "Confirmed": "पुष्ट",
  "Cancelled": "रद्द",
  "Completed": "पूर्ण",
  "Accepted": "स्वीकृत",
  "None": "कोई नहीं",
  "Selected": "चयनित",
  "Target": "लक्षित",
  "Node": "केंद्र",
  "Radius": "दायरा",
  "RADIUS": "दायरा",
  "ALL": "सभी",
  "Unlimited": "असीमित",
  "Distance": "दूरी",
  "DISTANCE": "दूरी",
  "Transit": "यात्रा",
  "TRANSIT": "यात्रा",
  "Duration": "समय",
  "DURATION": "समय",

  // Consultation / Doctor Tab
  "Queue Size": "कतार का आकार",
  "patients": "मरीज़",
  "Clinic Wait": "क्लिनिक प्रतीक्षा",
  "Book a date": "तारीख बुक करें",
  "Join today's queue": "आज की कतार में शामिल हों",
  "Dynamic Token Dispenser": "डायनेमिक टोकन डिस्पेंसर",
  "Active Queue Session Info": "सक्रिय कतार सत्र जानकारी",
  "Generate live tokens for digital consult pathways straight to clinical OPD queues. Avoid sitting in physical hospital queue delays.": "डिजिटल परामर्श मार्ग के लिए लाइव टोकन जनरेट करें। शारीरिक अस्पताल कतार में बैठने से बचें।",
  "Issued Token": "जारी टोकन",
  "Available metropolitan doctors & clinics": "उपलब्ध महानगरीय डॉक्टर और क्लीनिक",
  "Unified Health ID": "एकीकृत स्वास्थ्य पहचान",
  "AI Health Copilot": "एआई स्वास्थ्य कोपायलट",
  "Scheduled Consultations": "निर्धारित परामर्श",
  "SCHEDULED CONSULTATIONS": "निर्धारित परामर्श",
  "Active Consultations": "सक्रिय परामर्श",
  "ACTIVE CONSULTATIONS": "सक्रिय परामर्श",
  "To reschedule or update a header, click into the consultation.": "पुनर्निर्धारित करने या अपडेट करने के लिए, परामर्श पर क्लिक करें।",
  "Hub Service Control": "हब सेवा नियंत्रण",
  "HUB SERVICE CONTROL": "हब सेवा नियंत्रण",
  "Sign Out": "साइन आउट",
  "Profile Settings": "प्रोफ़ाइल सेटिंग्स",
  "Search staff, doctors...": "स्टाफ, डॉक्टर खोजें...",
  "Role:": "भूमिका:",
  "ROLE:": "भूमिका:",
  "Explore in Demo / Sandbox Mode": "डेमो / सैंडबॉक्स मोड में एक्सप्लोर करें",

  // Dashboard Home Cards
  "Hello,": "नमस्ते,",
  "Your last clinical review was 14 days ago. Overall health is optimal.": "आपकी अंतिम चिकित्सा समीक्षा 14 दिन पहले थी। समग्र स्वास्थ्य उत्तम है।",
  "AI Powered": "एआई संचालित",
  "EMERGENCY SOS": "आपातकालीन एसओएस",
  "One-Tap Response Dispatched": "वन-टैप प्रतिक्रिया भेजी गई",
  "Live OPD Progression": "लाइव ओपीडी प्रगति",
  "Token #00": "टोकन #00",
  "No active clinics waiting token queue": "कोई सक्रिय क्लिनिक टोकन कतार नहीं",
  "Get Virtual OPD token": "वर्चुअल ओपीडी टोकन प्राप्त करें",
  "Review wait line": "प्रतीक्षा पंक्ति देखें",

  // Hospital Occupancy
  "Hospital Occupancy": "अस्पताल अधिभोग",
  "HOSPITAL OCCUPANCY": "अस्पताल अधिभोग",
  "Find Nearest Hospital": "निकटतम अस्पताल खोजें",
  "View Live Map Locator": "लाइव मैप लोकेटर देखें",

  // City Health Twin
  "City Health Twin (CHN)": "सिटी हेल्थ ट्विन (CHN)",
  "Selected NCR City": "चयनित NCR शहर",
  "SELECTED NCR CITY": "चयनित NCR शहर",
  "Health Rating": "स्वास्थ्य रेटिंग",
  "HEALTH RATING": "स्वास्थ्य रेटिंग",
  "Operating Index": "ऑपरेटिंग इंडेक्स",
  "Atmosphere AQI": "वायुमंडलीय AQI",
  "ATMOSPHERE AQI": "वायुमंडलीय AQI",
  "Severe Danger": "गंभीर खतरा",
  "Poor / Warning": "खराब / चेतावनी",
  "Clear Area": "स्वच्छ क्षेत्र",
  "CLEAR AREA": "स्वच्छ क्षेत्र",
  "Alerts:": "अलर्ट:",
  "Launch City Twin HUB": "सिटी ट्विन HUB लॉन्च करें",

  // Active Consultations
  "AI Matcher": "एआई मैचर",
  "Book Standard": "मानक बुक करें",
  "No active scheduled consultations.": "कोई सक्रिय निर्धारित परामर्श नहीं।",
  "Join chat": "चैट में शामिल हों",
  "To request medications or look up digital records, verify Doctor updates or select": "दवाओं का अनुरोध करने या डिजिटल रिकॉर्ड देखने के लिए, डॉक्टर अपडेट सत्यापित करें या चुनें",
  "Doctor simulate role": "डॉक्टर सिमुलेट भूमिका",
  "at the top header list!": "शीर्ष हेडर सूची में!",

  // AI Health Status
  "AI Health Status": "एआई स्वास्थ्य स्थिति",
  "AI HEALTH STATUS": "एआई स्वास्थ्य स्थिति",
  "Safe Index": "सुरक्षा सूचकांक",
  "Recover rate has advanced 4% over the past fortnight. Keep consistent cardiovascular metrics.": "पिछले पखवाड़े में रिकवरी दर 4% बढ़ी है। हृदय मापदंड स्थिर रखें।",
  "AI Prediction": "एआई भविष्यवाणी",
  "AI PREDICTION": "एआई भविष्यवाणी",
  "Minimal regional influenza exposure based on localized sewage analytics.": "स्थानीय सीवेज विश्लेषण के आधार पर न्यूनतम क्षेत्रीय इन्फ्लूएंजा जोखिम।",

  // Pharmacy
  "Need custom medicines? Place express order at pharmacy grid!": "कस्टम दवाइयाँ चाहिए? फार्मेसी ग्रिड पर एक्सप्रेस ऑर्डर दें!",
  "Browse standard painkillers, antibiotic segments, first-aid remedies, or connect verified clinical prescription tags from your reports list immediately.": "मानक दर्द निवारक, एंटीबायोटिक सेगमेंट, प्राथमिक चिकित्सा उपचार ब्राउज़ करें, या अपनी रिपोर्ट सूची से सत्यापित प्रिस्क्रिप्शन टैग तुरंत कनेक्ट करें।",
  "Enter Medical Pharmacy": "मेडिकल फार्मेसी में प्रवेश करें",

  // Booking Modal
  "Request consultation slot": "परामर्श स्लॉट का अनुरोध",
  "Scheduling slot with": "के साथ स्लॉट शेड्यूलिंग",
  "Choose date": "तारीख चुनें",
  "Choose preferred time": "पसंदीदा समय चुनें",
  "Select Session Type": "सत्र प्रकार चुनें",
  "Virtual Chat Room & Prescriptions": "वर्चुअल चैट रूम और प्रिस्क्रिप्शन",
  "In-Person Clinical Attendance": "व्यक्तिगत क्लिनिकल उपस्थिति",
  "Current active symptoms or reason for visit": "वर्तमान सक्रिय लक्षण या मिलने का कारण",
  "Fever symptoms, joint pain review...": "बुखार के लक्षण, जोड़ों के दर्द की समीक्षा...",
  "Cancel": "रद्द करें",
  "Book Appointment": "अपॉइंटमेंट बुक करें",

  // Profile Area
  "Profile:": "प्रोफ़ाइल:",
  "PROFILE:": "प्रोफ़ाइल:",
  "Add Patient": "मरीज़ जोड़ें",
  "Reconnect clinical grid": "क्लिनिकल ग्रिड पुनः कनेक्ट करें"
};

/**
 * Returns the localized text for a given key and language code.
 * Falls back to English if key is missing in Hindi.
 */
export function getTranslation(language: LanguageCode, key: keyof TranslationDictionary): string {
  const dictionary = translations[language] || translations.en;
  return dictionary[key] || translations.en[key] || String(key);
}

/**
 * Inverted dictionary for Hindi -> English translation
 */
export const ENGLISH_DICTIONARY: Record<string, string> = {};

// Populate English reverse map
for (const [en, hi] of Object.entries(HINDI_DICTIONARY)) {
  if (hi && en && !ENGLISH_DICTIONARY[hi]) {
    ENGLISH_DICTIONARY[hi] = en;
  }
}
for (const [en, hi] of Object.entries(TOKEN_DICTIONARY)) {
  if (hi && en && !ENGLISH_DICTIONARY[hi]) {
    ENGLISH_DICTIONARY[hi] = en;
  }
}

// Ensure critical UI phrases are explicitly in reverse map
ENGLISH_DICTIONARY["होम"] = "Home";
ENGLISH_DICTIONARY["सुविधाएँ"] = "Features";
ENGLISH_DICTIONARY["डॉक्टर नेटवर्क"] = "Doctor network";
ENGLISH_DICTIONARY["लक्षण जाँचें"] = "Check symptoms";
ENGLISH_DICTIONARY["स्वास्थ्य रुझान"] = "Health trends";
ENGLISH_DICTIONARY["अस्पताल बेड"] = "Hospital beds";
ENGLISH_DICTIONARY["डॉक्टर खोजें"] = "Find a doctor";
ENGLISH_DICTIONARY["दवाइयाँ"] = "Medicines";
ENGLISH_DICTIONARY["मेरे रिकॉर्ड"] = "My records";
ENGLISH_DICTIONARY["बीमा"] = "Insurance";
ENGLISH_DICTIONARY["आपातकाल"] = "Emergency";
ENGLISH_DICTIONARY["अस्पताल और स्टाफ"] = "Hospitals & staff";
ENGLISH_DICTIONARY["शहर स्वास्थ्य मानचित्र"] = "City health map";
ENGLISH_DICTIONARY["डेवलपर कंसोल"] = "Developer console";
ENGLISH_DICTIONARY["स्वास्थ्य देखभाल"] = "Care";
ENGLISH_DICTIONARY["रिकॉर्ड और ऑर्डर"] = "Records & orders";
ENGLISH_DICTIONARY["एक्सप्लोर करें"] = "Explore";
ENGLISH_DICTIONARY["स्टाफ उपकरण"] = "Staff tools";
ENGLISH_DICTIONARY["मरीज़ / स्वयं"] = "Patient / Self";
ENGLISH_DICTIONARY["मरीज / स्वयं"] = "Patient / Self";
ENGLISH_DICTIONARY["मुख्य डॉक्टर"] = "Doctor Core";
ENGLISH_DICTIONARY["अस्पताल स्टाफ"] = "Hospital staff";
ENGLISH_DICTIONARY["प्रशासन केंद्र"] = "Admin hub";
ENGLISH_DICTIONARY["लाइव क्षेत्रीय नेटवर्क कनेक्शन"] = "Live Regional Network Connection";
ENGLISH_DICTIONARY["/ महानगरीय चिकित्सा ग्रिड"] = "/ Metropolitan Medical Grid";
ENGLISH_DICTIONARY["क्लिनिकल ग्रिड पुनः कनेक्ट करें"] = "Reconnect clinical grid";
ENGLISH_DICTIONARY["प्रोफ़ाइल सेटिंग्स"] = "Profile Settings";
ENGLISH_DICTIONARY["मरीज जोड़ें"] = "Add Patient";
ENGLISH_DICTIONARY["+ मरीज जोड़ें"] = "+ Add Patient";
ENGLISH_DICTIONARY["साइन आउट"] = "Sign Out";
ENGLISH_DICTIONARY["स्वयं (प्राथमिक उपयोगकर्ता)"] = "Self (Primary User)";
ENGLISH_DICTIONARY["स्वयं (प्राथमिक उपयोगकर्ता"] = "Self (Primary User";

/**
 * Clean & normalize a string for dictionary lookup
 */
function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Smart Bidirectional Text Translation function (English <-> Hindi)
 */
export function translateText(text: string, language: LanguageCode): string {
  if (!text) return text;
  
  const trimmed = normalizeText(text);
  if (!trimmed) return text;

  if (language === "hi") {
    // ------------------- TRANSLATE TO HINDI -------------------
    // 1. Direct full match in main dictionary
    if (HINDI_DICTIONARY[trimmed]) {
      return HINDI_DICTIONARY[trimmed];
    }

    // 2. Case-insensitive match check in main dictionary
    const lower = trimmed.toLowerCase();
    for (const [key, val] of Object.entries(HINDI_DICTIONARY)) {
      if (key.toLowerCase() === lower) {
        return val;
      }
    }

    // 3. Dynamic regex-based templates
    const distAwayMatch = trimmed.match(/^([\d.]+)\s*km\s*away$/i);
    if (distAwayMatch) return `${distAwayMatch[1]} किमी दूर`;

    const distMatch = trimmed.match(/^([\d.]+)\s*km$/i);
    if (distMatch) return `${distMatch[1]} किमी`;

    const minsMatch = trimmed.match(/^(\d+)\s*mins?$/i);
    if (minsMatch) return `${minsMatch[1]} मिनट`;

    const hoursMatch = trimmed.match(/^(\d+)\s*hours?$/i);
    if (hoursMatch) return `${hoursMatch[1]} घंटे`;

    const tokenMatch = trimmed.match(/^Token\s*#(\d+)$/i);
    if (tokenMatch) return `टोकन #${tokenMatch[1]}`;

    const bedsMatch = trimmed.match(/^(\d+)\s+beds\s+left$/i);
    if (bedsMatch) return `${bedsMatch[1]} बेड शेष`;

    const icuVacantMatch = trimmed.match(/^ICU:\s*(\d+)\s+vacant$/i);
    if (icuVacantMatch) return `आईसीयू: ${icuVacantMatch[1]} रिक्त`;

    const daysAgoMatch = trimmed.match(/^(\d+)\s+days\s+ago$/i);
    if (daysAgoMatch) return `${daysAgoMatch[1]} दिन पहले`;

    const minsAgoMatch = trimmed.match(/^(\d+)\s+mins?\s+ago$/i);
    if (minsAgoMatch) return `${minsAgoMatch[1]} मिनट पहले`;

    const waitTimeMatch = trimmed.match(/^(\d+)\s+mins?\s+wait$/i);
    if (waitTimeMatch) return `${waitTimeMatch[1]} मिनट प्रतीक्षा`;

    const ratingMatch = trimmed.match(/^Rating:\s*([\d.]+)$/i);
    if (ratingMatch) return `रेटिंग: ${ratingMatch[1]}`;

    const expMatch = trimmed.match(/^(\d+)\+?\s*years?\s*exp(?:erience)?$/i);
    if (expMatch) return `${expMatch[1]}+ वर्ष का अनुभव`;

    const patientsServedMatch = trimmed.match(/^(\d+)\+?\s*patients\s*served$/i);
    if (patientsServedMatch) return `${patientsServedMatch[1]}+ मरीजों का उपचार`;

    const helloNameMatch = trimmed.match(/^Hello,\s*(.+)$/i);
    if (helloNameMatch) return `नमस्ते, ${helloNameMatch[1]}`;

    // 4. Sub-phrase & Token Replacements
    let translated = trimmed;
    let hasReplaced = false;

    const allEntries: Array<[string, string]> = [
      ...Object.entries(HINDI_DICTIONARY),
      ...Object.entries(TOKEN_DICTIONARY)
    ].sort((a, b) => b[0].length - a[0].length);

    for (const [key, val] of allEntries) {
      if (key.length >= 2 && translated.toLowerCase().includes(key.toLowerCase())) {
        const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp(`(?<=^|[^a-zA-Z0-9])${escaped}(?=[^a-zA-Z0-9]|$)`, 'gi');
        if (reg.test(translated)) {
          translated = translated.replace(reg, val);
          hasReplaced = true;
        }
      }
    }

    return hasReplaced ? translated : text;
  } else {
    // ------------------- TRANSLATE TO ENGLISH -------------------
    // If no Devanagari characters, it's already English
    if (!/[\u0900-\u097F]/.test(trimmed)) {
      return text;
    }

    // 1. Direct full match in reverse dictionary
    if (ENGLISH_DICTIONARY[trimmed]) {
      return ENGLISH_DICTIONARY[trimmed];
    }

    // 2. Dynamic regex templates for Hindi -> English
    const distAwayHi = trimmed.match(/^([\d.]+)\s*किमी\s*दूर$/);
    if (distAwayHi) return `${distAwayHi[1]} km away`;

    const distHi = trimmed.match(/^([\d.]+)\s*किमी$/);
    if (distHi) return `${distHi[1]} km`;

    const minsHi = trimmed.match(/^(\d+)\s*मिनट$/);
    if (minsHi) return `${minsHi[1]} Mins`;

    const hoursHi = trimmed.match(/^(\d+)\s*घंटे$/);
    if (hoursHi) return `${hoursHi[1]} hours`;

    const tokenHi = trimmed.match(/^टोकन\s*#(\d+)$/);
    if (tokenHi) return `Token #${tokenHi[1]}`;

    const bedsHi = trimmed.match(/^(\d+)\s*बेड\s*शेष$/);
    if (bedsHi) return `${bedsHi[1]} beds left`;

    const icuHi = trimmed.match(/^आईसीयू:\s*(\d+)\s*रिक्त$/);
    if (icuHi) return `ICU: ${icuHi[1]} vacant`;

    const daysAgoHi = trimmed.match(/^(\d+)\s*दिन\s*पहले$/);
    if (daysAgoHi) return `${daysAgoHi[1]} days ago`;

    const minsAgoHi = trimmed.match(/^(\d+)\s*मिनट\s*पहले$/);
    if (minsAgoHi) return `${minsAgoHi[1]} mins ago`;

    const waitTimeHi = trimmed.match(/^(\d+)\s*मिनट\s*प्रतीक्षा$/);
    if (waitTimeHi) return `${waitTimeHi[1]} mins wait`;

    const ratingHi = trimmed.match(/^रेटिंग:\s*([\d.]+)$/);
    if (ratingHi) return `Rating: ${ratingHi[1]}`;

    const expHi = trimmed.match(/^(\d+)\+?\s*वर्ष\s*का\s*अनुभव$/);
    if (expHi) return `${expHi[1]}+ years exp`;

    const patientsHi = trimmed.match(/^(\d+)\+?\s*मरीजों\s*का\s*उपचार$/);
    if (patientsHi) return `${patientsHi[1]}+ patients served`;

    const helloHi = trimmed.match(/^नमस्ते,\s*(.+)$/);
    if (helloHi) return `Hello, ${helloHi[1]}`;

    // 3. Sub-phrase replacements for Hindi -> English
    let translated = trimmed;
    let hasReplaced = false;

    const reverseEntries = Object.entries(ENGLISH_DICTIONARY).sort((a, b) => b[0].length - a[0].length);
    for (const [hiKey, enVal] of reverseEntries) {
      if (hiKey.length >= 2 && translated.includes(hiKey)) {
        const escaped = hiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp(escaped, 'g');
        translated = translated.replace(reg, enVal);
        hasReplaced = true;
      }
    }

    return hasReplaced ? translated : text;
  }
}

let isAutoTranslating = false;

/**
 * Traverse the DOM and apply real-time bidirectional translation to text nodes and attributes
 */
export function applyDOMTranslation(root: Element | Document = document, language: LanguageCode): void {
  if (typeof window === "undefined" || !document.body) return;
  if (isAutoTranslating) return;

  isAutoTranslating = true;

  try {
    const targetLang = language;

    // 1. Walk all visible Text Nodes
    const walker = document.createTreeWalker(
      root === document ? document.body : root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          const tagName = parent.tagName.toLowerCase();
          // Skip non-translatable tags and elements marked with notranslate
          if (
            tagName === "script" ||
            tagName === "style" ||
            tagName === "code" ||
            tagName === "pre" ||
            tagName === "svg" ||
            tagName === "path" ||
            parent.closest(".notranslate")
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          const text = (node.nodeValue || "").trim();
          if (!text || /^[\d\s.,:;!@#$%^&*()_+\-=[\]{}|\\/<>?`~"']+$/.test(text)) {
            return NodeFilter.FILTER_SKIP;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let currentNode: Node | null = walker.nextNode();
    while (currentNode) {
      const textNode = currentNode as Text;
      const currentVal = textNode.nodeValue || "";

      if (currentVal.trim()) {
        const translated = translateText(currentVal, targetLang);
        if (textNode.nodeValue !== translated) {
          textNode.nodeValue = translated;
        }
      }

      currentNode = walker.nextNode();
    }

    // 2. Translate Input Placeholders
    const queryRoot = root instanceof Element ? root : document.body;
    const inputElements = queryRoot.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[placeholder], textarea[placeholder]");
    inputElements.forEach((el) => {
      const currentPlaceholder = el.getAttribute("placeholder") || "";
      if (currentPlaceholder.trim()) {
        const translated = translateText(currentPlaceholder, targetLang);
        if (el.getAttribute("placeholder") !== translated) {
          el.setAttribute("placeholder", translated);
        }
      }
    });

    // 3. Translate elements with titles
    const titledElements = queryRoot.querySelectorAll<HTMLElement>("[title]");
    titledElements.forEach((el) => {
      const currentTitle = el.getAttribute("title") || "";
      if (currentTitle.trim()) {
        const translated = translateText(currentTitle, targetLang);
        if (el.getAttribute("title") !== translated) {
          el.setAttribute("title", translated);
        }
      }
    });
  } catch (err) {
    console.error("[i18n Auto-Translator Error]:", err);
  } finally {
    isAutoTranslating = false;
  }
}

/**
 * Setup a continuous MutationObserver to translate any dynamically added or modified DOM nodes
 */
export function setupAutoTranslator(language: LanguageCode): () => void {
  if (typeof window === "undefined" || !document.body) return () => {};

  // Initial full pass
  applyDOMTranslation(document.body, language);

  // Debounced translation runner for mutations
  let timeoutId: any = null;
  const debouncedTranslate = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      applyDOMTranslation(document.body, language);
    }, 25);
  };

  const observer = new MutationObserver((mutations) => {
    if (isAutoTranslating) return;

    let hasRelevantChanges = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        hasRelevantChanges = true;
        break;
      }
      if (mutation.type === "characterData") {
        hasRelevantChanges = true;
        break;
      }
    }

    if (hasRelevantChanges) {
      debouncedTranslate();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    observer.disconnect();
  };
}

