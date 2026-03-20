import { UserProfile, ChatMessage, UI_TRANSLATIONS, Language } from "../types";

// Enhanced Drug Database based on Indian Pharmacopoeia (IP) & NLEM 2022 Standards
interface DrugInfo {
  class: string;
  indication: string;
  schedule: string; // Schedule H, H1, G, X etc.
  kidney: string;
  liver: string;
  interactions: string[];
  sideEffects: string[];
  warnings: string[];
  bbb: boolean;          // Blood Brain Barrier Crossing
  habitForming: boolean; // Addiction Risk
  pregnancyUnsafe: boolean; // Pregnancy Category D/X or generally unsafe
}

// Common Brand to Generic Mapping
const BRAND_MAPPINGS: Record<string, string> = {
  // --- US / Rare Disease ---
  "zokinvy": "lonafarnib",
  "vigadrone": "vigabatrin",
  "abecma": "idecabtagene vicleucel",
  "abilify": "aripiprazole",
  "amaryl": "glimepiride",
  
  // --- Common Indian Brands ---
  "dolo": "paracetamol",
  "dolo 650": "paracetamol",
  "crocin": "paracetamol",
  "calpol": "paracetamol",
  "saridon": "paracetamol",
  "tylenol": "paracetamol",
  "pcm": "paracetamol",
  "combiflam": "ibuprofen", // + Paracetamol
  "brufen": "ibuprofen",
  "advil": "ibuprofen",
  "flexon": "ibuprofen", // + Paracetamol
  "disprin": "aspirin",
  "ecosprin": "aspirin",
  "loprin": "aspirin",
  "meftal": "mefenamic acid",
  "pantocid": "pantoprazole",
  "pan 40": "pantoprazole",
  "pan d": "pantoprazole", // + Domperidone
  "pan-d": "pantoprazole",
  "omez": "omeprazole",
  "rantac": "ranitidine",
  "zinetac": "ranitidine",
  "aciloc": "ranitidine",
  "allegra": "fexofenadine",
  "cetzine": "cetirizine",
  "okacet": "cetirizine",
  "levocet": "levocetirizine",
  "benadryl": "diphenhydramine",
  "azithral": "azithromycin",
  "azee": "azithromycin",
  "aziwok": "azithromycin",
  "augmentin": "amoxicillin", // + Clavulanate
  "clavam": "amoxicillin",
  "mox": "amoxicillin",
  "taxim": "cefixime",
  "taxim-o": "cefixime",
  "cefix": "cefixime",
  "zifi": "cefixime",
  "suprax": "cefixime",
  "cefspan": "cefixime",
  "monocef": "ceftriaxone",
  "oflomac": "ofloxacin",
  "cifran": "ciprofloxacin",
  "levoflox": "levofloxacin",
  "roxid": "roxithromycin",
  "sporidex": "cephalexin",
  "ascoril": "terbutaline",
  "asthalin": "salbutamol", 
  "deriphyllin": "theophylline", // + Etophylline
  "foracort": "budesonide", // + Formoterol
  "budecort": "budesonide",
  "montair": "montelukast",
  "telekast": "montelukast",
  "sinarest": "paracetamol", // Cold combo
  "viagra": "sildenafil",
  "manforce": "sildenafil",
  "thyronorm": "thyroxine",
  "eltroxin": "thyroxine",
  "volini": "diclofenac",
  "voveran": "diclofenac",
  "dynapar": "diclofenac",
  "zerodol": "aceclofenac",
  "zerodol-sp": "aceclofenac",
  "dolokind": "ketorolac",
  "myospaz": "chlorzoxazone", // Combo
  "glycomet": "metformin",
  "gluconorm": "metformin",
  "obimet": "metformin",
  "istamet": "sitagliptin", // + Metformin
  "janumet": "sitagliptin", // + Metformin
  "galvus": "vildagliptin",
  "zoryl": "glimepiride",
  "euglim": "glimepiride",
  "telma": "telmisartan",
  "telma-am": "telmisartan", // + Amlodipine
  "amlong": "amlodipine",
  "storcad": "atorvastatin",
  "atorlip": "atorvastatin",
  "rosuvas": "rosuvastatin",
  "cardace": "ramipril",
  "arkamin": "clonidine",
  "concor": "bisoprolol",
  "nebicard": "nebivolol",
  "ulgel": "antacid", // Magaldrate etc
  "digene": "antacid",
  "sucral": "sucralfate",
  "ganaton": "itopride",
  "cremaffin": "laxative", // Liquid Paraffin
  "lactihep": "lactulose",
  "nexito": "escitalopram",
  "cipralex": "escitalopram",
  "rest mel": "melatonin",
  "sizodon": "risperidone",
  "oleanz": "olanzapine",
  "zapiz": "clonazepam",
  "lonazep": "clonazepam",
  "petril": "clonazepam",
  "ativan": "lorazepam",
  "frisium": "clobazam",
  "becosules": "multivitamin",
  "neurobion": "vitamin b complex",
  "becadexamin": "multivitamin",
  "shelcal": "calcium",
  "supradyn": "multivitamin",
  "revital": "multivitamin",
  "limcee": "vitamin c",
  "zincovit": "zinc",
  "liv 52": "herbal liver supplement",
  "dexorange": "iron",
};

// A comprehensive list of common drugs
const DRUG_DB: Record<string, DrugInfo> = {
  // --- SPECIALTY ---
  "lonafarnib": { class: "Farnesyltransferase Inhibitor", indication: "Hutchinson-Gilford Progeria Syndrome", schedule: "Prescription", kidney: "Caution", liver: "Hepatotoxic", interactions: ["CYP3A inhibitors", "Midazolam"], sideEffects: ["Vomiting", "Diarrhea", "Infection"], warnings: ["Monitor electrolytes.", "Eye toxicity."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "vigabatrin": { class: "Antiepileptic", indication: "Infantile Spasms, Seizures", schedule: "Prescription", kidney: "Adjust", liver: "Safe", interactions: ["Clonazepam"], sideEffects: ["Vision loss (Permanent)", "Fatigue"], warnings: ["REMS Program required due to vision loss risk."], bbb: true, habitForming: false, pregnancyUnsafe: true },

  // --- GENERAL ANESTHETICS ---
  "halothane": { class: "Inhalation Anesthetic", indication: "General Anesthesia", schedule: "Schedule H", kidney: "Safe", liver: "Hepatotoxic", interactions: ["Adrenaline", "Succinylcholine"], sideEffects: ["Hepatitis", "Malignant Hyperthermia", "Arrhythmias"], warnings: ["Avoid repeat exposure within 3 months."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "ketamine": { class: "Dissociative Anesthetic", indication: "Anesthesia, Pain", schedule: "Schedule X", kidney: "Caution", liver: "Caution", interactions: ["Theophylline"], sideEffects: ["Hallucinations", "Delirium"], warnings: ["Emergence phenomena."], bbb: true, habitForming: true, pregnancyUnsafe: false },
  
  // --- OPIOIDS ---
  "morphine": { class: "Opioid Agonist", indication: "Severe Pain", schedule: "Schedule H1", kidney: "Toxic metabolites", liver: "Caution", interactions: ["Alcohol", "Benzos"], sideEffects: ["Respiratory depression", "Constipation"], warnings: ["High addiction potential."], bbb: true, habitForming: true, pregnancyUnsafe: true },
  "tramadol": { class: "Opioid/SNRI", indication: "Moderate Pain", schedule: "Schedule H1", kidney: "Adjust", liver: "Adjust", interactions: ["SSRIs", "MAOIs"], sideEffects: ["Seizures", "Nausea"], warnings: ["Serotonin Syndrome risk."], bbb: true, habitForming: true, pregnancyUnsafe: true },
  "loperamide": { class: "Opioid", indication: "Diarrhea", schedule: "OTC", kidney: "Safe", liver: "Caution", interactions: ["P-gp inhibitors"], sideEffects: ["Constipation"], warnings: ["Cardiac arrest in overdose."], bbb: false, habitForming: false, pregnancyUnsafe: false },

  // --- NSAIDs & ANALGESICS ---
  "paracetamol": { class: "Analgesic", indication: "Fever, Mild Pain", schedule: "OTC", kidney: "Safe", liver: "Toxic in OD", interactions: ["Warfarin (long term)"], sideEffects: ["Nausea", "Liver damage (high dose)"], warnings: ["Max 4g/day. Liver toxicity in overdose."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "aspirin": { class: "Salicylate", indication: "Pain, Antiplatelet", schedule: "OTC", kidney: "Avoid", liver: "Caution", interactions: ["Warfarin", "Methotrexate"], sideEffects: ["GI Bleeding", "Tinnitus"], warnings: ["Reye's Syndrome in children."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "mefenamic acid": { class: "NSAID", indication: "Dysmenorrhea", schedule: "Schedule H", kidney: "Caution", liver: "Caution", interactions: ["Anticoagulants"], sideEffects: ["Diarrhea"], warnings: ["Take with food."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "diclofenac": { class: "NSAID", indication: "Pain, Inflammation", schedule: "Schedule H", kidney: "Nephrotoxic", liver: "Hepatotoxic", interactions: ["ACE Inhibitors", "Warfarin"], sideEffects: ["GI Ulcers", "CV Risk"], warnings: ["High cardiovascular risk."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "ibuprofen": { class: "NSAID", indication: "Pain, Fever", schedule: "Schedule H", kidney: "Nephrotoxic", liver: "Caution", interactions: ["ACE Inhibitors"], sideEffects: ["Ulcers"], warnings: ["CV risk."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "aceclofenac": { class: "NSAID", indication: "Pain, Inflammation", schedule: "Schedule H", kidney: "Caution", liver: "Caution", interactions: ["Lithium"], sideEffects: ["Dyspepsia"], warnings: ["Avoid in third trimester."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "ketorolac": { class: "NSAID", indication: "Severe Acute Pain", schedule: "Schedule H", kidney: "High Risk", liver: "Caution", interactions: ["Other NSAIDs"], sideEffects: ["GI Bleeding", "Renal Failure"], warnings: ["Max duration 5 days."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "chlorzoxazone": { class: "Muscle Relaxant", indication: "Muscle Spasm", schedule: "Schedule H", kidney: "Caution", liver: "Hepatotoxic", interactions: ["Alcohol"], sideEffects: ["Drowsiness", "Red urine"], warnings: ["Liver toxicity monitoring."], bbb: true, habitForming: false, pregnancyUnsafe: false },

  // --- ANTIHISTAMINES & RESPIRATORY ---
  "diphenhydramine": { class: "H1 Antagonist (1st Gen)", indication: "Allergy, Sleep", schedule: "OTC", kidney: "Safe", liver: "Caution", interactions: ["Alcohol", "MAOIs"], sideEffects: ["Sedation", "Dry mouth"], warnings: ["Anticholinergic effects in elderly."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "fexofenadine": { class: "H1 Antagonist (2nd Gen)", indication: "Allergy", schedule: "OTC", kidney: "Adjust", liver: "Safe", interactions: ["Ketoconazole", "Erythromycin"], sideEffects: ["Headache"], warnings: ["Avoid fruit juice."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "cetirizine": { class: "H1 Antagonist (2nd Gen)", indication: "Allergy", schedule: "OTC", kidney: "Adjust", liver: "Safe", interactions: ["Theophylline"], sideEffects: ["Drowsiness"], warnings: ["Some sedation possible."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "levocetirizine": { class: "H1 Antagonist", indication: "Allergy", schedule: "Schedule H", kidney: "Adjust", liver: "Safe", interactions: ["Alcohol"], sideEffects: ["Mild Drowsiness"], warnings: ["Caution driving."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "montelukast": { class: "Leukotriene Inhibitor", indication: "Asthma, Allergic Rhinitis", schedule: "Schedule H", kidney: "Safe", liver: "Caution", interactions: ["Phenobarbital"], sideEffects: ["Mood changes"], warnings: ["Neuropsychiatric events (Nightmares, Agitation)."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "terbutaline": { class: "Beta-2 Agonist", indication: "Asthma, COPD", schedule: "Schedule H", kidney: "Caution", liver: "Caution", interactions: ["Beta-blockers"], sideEffects: ["Tremor", "Tachycardia"], warnings: ["Hypokalemia."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "salbutamol": { class: "Beta-2 Agonist", indication: "Asthma", schedule: "Schedule H", kidney: "Safe", liver: "Safe", interactions: ["Beta-blockers", "Diuretics"], sideEffects: ["Tremors", "Palpitations"], warnings: ["Monitor Potassium."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "theophylline": { class: "Xanthine", indication: "COPD, Asthma", schedule: "Schedule H", kidney: "Caution", liver: "CYP1A2", interactions: ["Ciprofloxacin", "Caffeine"], sideEffects: ["Nausea", "Seizures (Toxic levels)"], warnings: ["Narrow therapeutic index."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "budesonide": { class: "Corticosteroid", indication: "Asthma, IBD", schedule: "Schedule H", kidney: "Safe", liver: "Caution", interactions: ["Ketoconazole"], sideEffects: ["Thrush (Oral)", "Hoarseness"], warnings: ["Rinse mouth after inhalation."], bbb: false, habitForming: false, pregnancyUnsafe: false },

  // --- GI DRUGS ---
  "ranitidine": { class: "H2 Blocker", indication: "Ulcers", schedule: "Schedule H", kidney: "Adjust", liver: "Caution", interactions: ["Antacids"], sideEffects: ["Headache"], warnings: ["NDMA impurity risk."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "omeprazole": { class: "PPI", indication: "GERD, Ulcers", schedule: "Schedule H", kidney: "Safe", liver: "Adjust", interactions: ["Clopidogrel"], sideEffects: ["B12 deficiency"], warnings: ["Bone fracture risk."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "pantoprazole": { class: "PPI", indication: "GERD", schedule: "Schedule H", kidney: "Safe", liver: "Safe", interactions: ["Methotrexate"], sideEffects: ["Diarrhea"], warnings: ["Safe for long term."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "dicyclomine": { class: "Anticholinergic", indication: "IBS, Cramps", schedule: "Schedule H", kidney: "Caution", liver: "Caution", interactions: ["Antihistamines"], sideEffects: ["Dry mouth", "Blurred vision"], warnings: ["Avoid in Glaucoma."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "antacid": { class: "Antacid", indication: "Heartburn", schedule: "OTC", kidney: "Avoid Magnesium/Aluminium types", liver: "Safe", interactions: ["Tetracyclines", "Iron"], sideEffects: ["Constipation/Diarrhea"], warnings: ["Space from other meds by 2 hours."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "sucralfate": { class: "Protectant", indication: "Ulcers", schedule: "Schedule H", kidney: "Caution (Aluminium)", liver: "Safe", interactions: ["Fluoroquinolones"], sideEffects: ["Constipation"], warnings: ["Contains Aluminium."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "itopride": { class: "Prokinetic", indication: "Dyspepsia", schedule: "Schedule H", kidney: "Adjust", liver: "Safe", interactions: ["Anticholinergics"], sideEffects: ["Abdominal pain"], warnings: ["Rule out GI bleed."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "laxative": { class: "Laxative", indication: "Constipation", schedule: "OTC", kidney: "Safe", liver: "Safe", interactions: [], sideEffects: ["Cramps"], warnings: ["Hydration important."], bbb: false, habitForming: true, pregnancyUnsafe: false },
  "lactulose": { class: "Osmotic Laxative", indication: "Constipation, Hepatic Encephalopathy", schedule: "OTC", kidney: "Safe", liver: "Safe", interactions: ["Anti-infectives"], sideEffects: ["Gas", "Bloating"], warnings: ["Caution in Diabetes (contains sugars)."], bbb: false, habitForming: false, pregnancyUnsafe: false },

  // --- CARDIOVASCULAR ---
  "sildenafil": { class: "PDE5 Inhibitor", indication: "ED, Pulmonary HTN", schedule: "Schedule H", kidney: "Adjust", liver: "Adjust", interactions: ["Nitrates", "Alpha-blockers"], sideEffects: ["Headache", "Blue vision"], warnings: ["Fatal hypotension with Nitrates."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "amlodipine": { class: "CCB (DHP)", indication: "HTN", schedule: "Schedule H", kidney: "Safe", liver: "Adjust", interactions: ["Simvastatin"], sideEffects: ["Ankle Edema"], warnings: ["Gradual onset."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "telmisartan": { class: "ARB", indication: "HTN", schedule: "Schedule H", kidney: "Caution", liver: "Caution", interactions: ["ACE Inhibitors", "Lithium"], sideEffects: ["Dizziness", "Hyperkalemia"], warnings: ["Fetal Toxicity (Cat D)."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "atorvastatin": { class: "Statin", indication: "High Cholesterol", schedule: "Schedule H", kidney: "Safe", liver: "Contraindicated", interactions: ["Gemfibrozil", "Clarithromycin"], sideEffects: ["Muscle pain", "Liver enzyme elevation"], warnings: ["Rhabdomyolysis risk."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "rosuvastatin": { class: "Statin", indication: "High Cholesterol", schedule: "Schedule H", kidney: "Adjust", liver: "Contraindicated", interactions: ["Antacids", "Warfarin"], sideEffects: ["Muscle pain"], warnings: ["Higher risk in Asians."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "ramipril": { class: "ACE Inhibitor", indication: "HTN, HF", schedule: "Schedule H", kidney: "Adjust", liver: "Safe", interactions: ["K+ Sparing Diuretics"], sideEffects: ["Dry Cough", "Angioedema"], warnings: ["Fetal Toxicity."], bbb: false, habitForming: false, pregnancyUnsafe: true },
  "bisoprolol": { class: "Beta-blocker", indication: "HF, HTN", schedule: "Schedule H", kidney: "Adjust", liver: "Adjust", interactions: ["Verapamil"], sideEffects: ["Bradycardia", "Fatigue"], warnings: ["Do not stop abruptly."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "nebivolol": { class: "Beta-blocker", indication: "HTN", schedule: "Schedule H", kidney: "Adjust", liver: "Adjust", interactions: ["CYP2D6 Inhibitors"], sideEffects: ["Headache", "Fatigue"], warnings: ["Nitric oxide vasodilation."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "clonidine": { class: "Alpha-2 Agonist", indication: "HTN", schedule: "Schedule H", kidney: "Adjust", liver: "Caution", interactions: ["CNS Depressants"], sideEffects: ["Dry mouth", "Sedation"], warnings: ["Rebound HTN if stopped abruptly."], bbb: true, habitForming: false, pregnancyUnsafe: false },

  // --- ANTIBIOTICS ---
  "amoxicillin": { class: "Penicillin", indication: "Infections", schedule: "Schedule H1", kidney: "Adjust", liver: "Safe", interactions: ["Allopurinol"], sideEffects: ["Rash"], warnings: ["Cross-sensitivity."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "azithromycin": { class: "Macrolide", indication: "Infections, STD", schedule: "Schedule H1", kidney: "Safe", liver: "Caution", interactions: ["Digoxin", "Warfarin"], sideEffects: ["GI Upset", "QT Prolongation"], warnings: ["Risk of arrhythmias."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "cefixime": { class: "Cephalosporin (3rd Gen)", indication: "Typhoid, UTI", schedule: "Schedule H1", kidney: "Adjust", liver: "Safe", interactions: ["Warfarin"], sideEffects: ["Diarrhea"], warnings: ["Penicillin allergy cross-reaction."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "ceftriaxone": { class: "Cephalosporin (3rd Gen)", indication: "Severe Infections", schedule: "Schedule H1", kidney: "Safe", liver: "Safe", interactions: ["Calcium IV"], sideEffects: ["Injection site pain", "Sludge in gallbladder"], warnings: ["Fatal with IV Calcium."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "ofloxacin": { class: "Fluoroquinolone", indication: "Typhoid, UTI", schedule: "Schedule H1", kidney: "Adjust", liver: "Caution", interactions: ["Antacids", "Theophylline"], sideEffects: ["Tendonitis", "Insomnia"], warnings: ["Tendon rupture risk."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "ciprofloxacin": { class: "Fluoroquinolone", indication: "UTI, Anthrax", schedule: "Schedule H1", kidney: "Adjust", liver: "Caution", interactions: ["Theophylline"], sideEffects: ["Tendonitis"], warnings: ["Tendon rupture risk."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "levofloxacin": { class: "Fluoroquinolone", indication: "Pneumonia", schedule: "Schedule H1", kidney: "Adjust", liver: "Safe", interactions: ["NSAIDs"], sideEffects: ["Tendonitis", "QT prolongation"], warnings: ["Myasthenia Gravis exacerbation."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "roxithromycin": { class: "Macrolide", indication: "Respiratory Infections", schedule: "Schedule H1", kidney: "Safe", liver: "Caution", interactions: ["Ergotamine"], sideEffects: ["Nausea"], warnings: ["Take before food."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "cephalexin": { class: "Cephalosporin (1st Gen)", indication: "Skin Infections", schedule: "Schedule H1", kidney: "Adjust", liver: "Safe", interactions: ["Metformin"], sideEffects: ["Diarrhea"], warnings: ["Safe in pregnancy (Cat B)."], bbb: false, habitForming: false, pregnancyUnsafe: false },

  // --- DIABETES ---
  "metformin": { class: "Biguanide", indication: "T2 Diabetes, PCOS", schedule: "Schedule H", kidney: "Contraindicated (eGFR<30)", liver: "Caution", interactions: ["Contrast Dye"], sideEffects: ["GI Upset", "Lactic Acidosis"], warnings: ["Hold before surgery/contrast."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "glimepiride": { class: "Sulfonylurea", indication: "T2 Diabetes", schedule: "Schedule H", kidney: "Caution", liver: "Caution", interactions: ["Alcohol", "Beta-blockers"], sideEffects: ["Hypoglycemia", "Weight gain"], warnings: ["High risk of lows."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "sitagliptin": { class: "DPP-4 Inhibitor", indication: "T2 Diabetes", schedule: "Schedule H", kidney: "Adjust", liver: "Safe", interactions: ["Digoxin"], sideEffects: ["Joint pain"], warnings: ["Pancreatitis risk."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "vildagliptin": { class: "DPP-4 Inhibitor", indication: "T2 Diabetes", schedule: "Schedule H", kidney: "Adjust", liver: "Monitor LFTs", interactions: ["ACE Inhibitors"], sideEffects: ["Tremor"], warnings: ["Liver monitoring required."], bbb: false, habitForming: false, pregnancyUnsafe: false },

  // --- CNS / PSYCH ---
  "escitalopram": { class: "SSRI", indication: "Depression, Anxiety", schedule: "Schedule H", kidney: "Safe", liver: "Caution", interactions: ["MAOIs", "NSAIDs"], sideEffects: ["Sexual dysfunction", "Insomnia"], warnings: ["Suicide risk in youth."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "melatonin": { class: "Supplement", indication: "Insomnia", schedule: "OTC", kidney: "Safe", liver: "Caution", interactions: ["Sedatives"], sideEffects: ["Drowsiness"], warnings: ["Hormone regulation."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "risperidone": { class: "Antipsychotic", indication: "Schizophrenia", schedule: "Schedule H", kidney: "Adjust", liver: "Caution", interactions: ["Levodopa"], sideEffects: ["EPS", "Weight gain"], warnings: ["Increased mortality in elderly dementia."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "olanzapine": { class: "Antipsychotic", indication: "Bipolar, Schizophrenia", schedule: "Schedule H", kidney: "Safe", liver: "Caution", interactions: ["Smoking (induces)"], sideEffects: ["Weight gain", "Sedation"], warnings: ["Metabolic syndrome."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "clonazepam": { class: "Benzodiazepine", indication: "Seizures, Panic", schedule: "Schedule H1/X", kidney: "Safe", liver: "Caution", interactions: ["Opioids", "Alcohol"], sideEffects: ["Sedation", "Amnesia"], warnings: ["High dependence risk."], bbb: true, habitForming: true, pregnancyUnsafe: true },
  "lorazepam": { class: "Benzodiazepine", indication: "Anxiety, Status Epilepticus", schedule: "Schedule H1/X", kidney: "Safe", liver: "Glucuronidation", interactions: ["Opioids"], sideEffects: ["Sedation"], warnings: ["Respiratory depression."], bbb: true, habitForming: true, pregnancyUnsafe: true },
  "clobazam": { class: "Benzodiazepine", indication: "Epilepsy", schedule: "Schedule H1/X", kidney: "Adjust", liver: "Caution", interactions: ["CYP2C19 inhibitors"], sideEffects: ["Drooling", "Aggression"], warnings: ["Withdrawal seizures."], bbb: true, habitForming: true, pregnancyUnsafe: true },

  // --- SUPPLEMENTS ---
  "multivitamin": { class: "Supplement", indication: "Deficiency", schedule: "OTC", kidney: "Safe", liver: "Safe", interactions: [], sideEffects: ["Nausea"], warnings: ["Check for fat-soluble vitamin toxicity."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "vitamin b complex": { class: "Vitamin", indication: "Neuropathy", schedule: "OTC", kidney: "Safe", liver: "Safe", interactions: ["Levodopa"], sideEffects: ["Bright urine"], warnings: ["Safe."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "calcium": { class: "Mineral", indication: "Osteoporosis", schedule: "OTC", kidney: "Stones", liver: "Safe", interactions: ["Tetracyclines", "Bisphosphonates"], sideEffects: ["Constipation"], warnings: ["Take with Vitamin D."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "vitamin c": { class: "Vitamin", indication: "Scurvy, Immunity", schedule: "OTC", kidney: "Stones (high dose)", liver: "Safe", interactions: ["Iron (increases absorption)"], sideEffects: ["Acidic stomach"], warnings: ["Kidney stones in mega doses."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "zinc": { class: "Mineral", indication: "Diarrhea, Immunity", schedule: "OTC", kidney: "Safe", liver: "Safe", interactions: ["Quinolones"], sideEffects: ["Metallic taste"], warnings: ["Copper deficiency if chronic."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "iron": { class: "Mineral", indication: "Anemia", schedule: "OTC", kidney: "Safe", liver: "Toxic in OD", interactions: ["Thyroxine", "Antacids"], sideEffects: ["Black stools", "Constipation"], warnings: ["Fatal in child overdose."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "herbal liver supplement": { class: "Ayurvedic", indication: "Liver Support", schedule: "OTC", kidney: "Safe", liver: "Safe", interactions: [], sideEffects: [], warnings: ["Evidence limited."], bbb: false, habitForming: false, pregnancyUnsafe: false },

  // --- MISC & ANTIDOTES ---
  "pralidoxime": { class: "Cholinesterase Reactivator", indication: "OP Poisoning", schedule: "Critical", kidney: "Adjust", liver: "Safe", interactions: ["Morphine"], sideEffects: ["Dizziness"], warnings: ["Use with Atropine."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "atropine": { class: "Anticholinergic", indication: "Bradycardia, Poisoning", schedule: "Schedule H", kidney: "Caution", liver: "Caution", interactions: ["Antihistamines"], sideEffects: ["Dry mouth", "Mydriasis"], warnings: ["Contraindicated in Glaucoma."], bbb: true, habitForming: false, pregnancyUnsafe: false },
  "thyroxine": { class: "Hormone", indication: "Hypothyroidism", schedule: "Schedule H", kidney: "Safe", liver: "Safe", interactions: ["Calcium", "Iron"], sideEffects: ["Palpitations"], warnings: ["Take on empty stomach."], bbb: false, habitForming: false, pregnancyUnsafe: false },
  "caffeine": { class: "Stimulant", indication: "Apnea, Fatigue", schedule: "OTC", kidney: "Safe", liver: "CYP1A2", interactions: ["Ciprofloxacin"], sideEffects: ["Insomnia", "Tachycardia"], warnings: ["Withdrawal headache."], bbb: true, habitForming: true, pregnancyUnsafe: false }
};

// --- HELPER FUNCTIONS ---

// Extract complete sentences to avoid truncation like "indicat..."
const formatSentences = (text: string, maxSentences: number = 2): string => {
    if (!text) return "Details not available in standard format.";
    
    // Remove trailing ellipses or junk
    let clean = text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
    clean = clean.replace(/\.\.\.$/, ""); // Remove "..." at end

    // Regex matches sequences that end with . ! or ?
    const matches = clean.match(/[^.!?]+[.!?]+/g);
    
    if (!matches) {
        // Fallback: If no punctuation, try to ensure it ends cleanly
        // If > 20 chars and no punctuation, append '.'
        return clean.length > 20 && !clean.endsWith('.') ? clean + '.' : clean;
    }
    
    // Join the desired number of sentences
    return matches.slice(0, maxSentences).join(" ");
};

// intelligently extract warning sentences
const extractWarnings = (text: string, limit: number = 3): string[] => {
    if (!text) return [];
    const clean = text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
    const sentences = clean.match(/[^.!?]+[.!?]+/g);
    if (!sentences) return [];

    const keywords = [
        "contraindicat", "avoid", "do not", "unsafe", "risk", "warning", 
        "danger", "prohibit", "consult", "harm", "monitor", "caution", 
        "severe", "fatal", "pregnancy", "breastfeeding", "allerg", "should not",
        "adverse", "stop"
    ];
    
    // Filter sentences containing keywords
    const found = sentences.filter(s => keywords.some(k => s.toLowerCase().includes(k)));
    
    // Deduplicate
    const unique = [...new Set(found)];
    
    // If we have less than 2, try to pad with generic warnings if text suggests risk
    if (unique.length < 2) {
       if (clean.toLowerCase().includes("doctor") && !unique.some(s => s.toLowerCase().includes("doctor"))) {
           unique.push("Consult your doctor for full safety profile.");
       }
       if (clean.toLowerCase().includes("label") && !unique.some(s => s.toLowerCase().includes("label"))) {
           unique.push("Refer to package insert for complete contraindications.");
       }
    }

    return unique.slice(0, limit);
};

function isMedicalContext(text: string): boolean {
    const medicalKeywords = [
        "drug", "medication", "medicine", "tablet", "capsule", "syrup", 
        "injection", "pharmaceutical", "treatment", "therapy", "dosage", 
        "side effect", "symptom", "disease", "disorder", "infection", 
        "antibiotic", "vitamin", "supplement", "vaccine", "analgesic",
        "antipyretic", "anti-inflammatory", "prescription", "otc", "medical"
    ];
    const lower = text.toLowerCase();
    return medicalKeywords.some(keyword => lower.includes(keyword));
}

async function fetchWikipediaData(query: string): Promise<{ title: string; extract: string; url: string } | null> {
    try {
        const cleanQuery = query.replace(/(side effects|dosage|uses|benefits|of|about|tell me|is|safe|medicine|tablet|syrup)/gi, '').trim();
        if (!cleanQuery) return null;

        const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQuery)}&limit=1&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        
        if (!searchData[1] || searchData[1].length === 0) return null;

        const title = searchData[1][0];
        const description = searchData[2][0] || "";
        const url = searchData[3][0];

        const nonMedicalKeywords = ["song", "album", "film", "movie", "book", "video game", "place", "city", "village", "river"];
        if (nonMedicalKeywords.some(kw => description.toLowerCase().includes(kw))) {
             return null;
        }

        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const summaryRes = await fetch(summaryUrl);
        const summaryData = await summaryRes.json();

        if (summaryData.type === 'standard' && summaryData.extract && !summaryData.extract.includes("may refer to")) {
            if (!isMedicalContext(summaryData.extract) && !isMedicalContext(description)) {
                return null;
            }

            return {
                title: summaryData.title,
                extract: summaryData.extract,
                url: url
            };
        }
    } catch (e) {
        console.error("Wiki fetch failed", e);
    }
    return null;
}

async function fetchOpenFDAData(query: string, apiKey?: string): Promise<{ brand: string; generic: string | null; purpose: string; warnings: string; class: string; sideEffects: string } | null> {
    try {
        const cleanQuery = query.replace(/(side effects|dosage|uses|benefits|of|about|tell me|is|safe|medicine|tablet|syrup)/gi, '').trim();
        if (!cleanQuery) return null;

        let searchUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(cleanQuery)}"+OR+openfda.generic_name:"${encodeURIComponent(cleanQuery)}"&limit=1`;
        
        if (apiKey && apiKey.trim() !== '') {
            searchUrl += `&api_key=${apiKey.trim()}`;
        }
        
        const res = await fetch(searchUrl);
        if (!res.ok) return null;
        
        const data = await res.json();
        if (!data.results || data.results.length === 0) return null;

        const info = data.results[0];
        const openfda = info.openfda || {};
        
        // Helper to get clean text and ensure it ends with a sentence boundary, max 1500 chars
        const getText = (arr: string[]) => {
            if (!arr || arr.length === 0) return "";
            let t = arr[0];
            if (t.length > 1500) {
                t = t.substring(0, 1500);
                // Cut at last period to avoid "indicat..."
                const lastDot = t.lastIndexOf('.');
                if (lastDot > 100) { // Ensure we have a decent chunk
                    t = t.substring(0, lastDot + 1);
                }
            }
            return t.replace(/(\r\n|\n|\r)/gm, " ");
        };
        
        // Extract Pharmacologic Class
        const pharmClass = openfda.pharm_class_epc ? openfda.pharm_class_epc[0] : (openfda.pharm_class_pe ? openfda.pharm_class_pe[0] : "Unspecified Pharmacologic Class");

        return {
            brand: openfda.brand_name ? openfda.brand_name[0] : (openfda.generic_name ? openfda.generic_name[0] : cleanQuery),
            generic: openfda.generic_name ? openfda.generic_name[0] : null,
            purpose: getText(info.indications_and_usage) || getText(info.purpose),
            warnings: getText(info.warnings) || getText(info.boxed_warning),
            class: pharmClass,
            sideEffects: getText(info.adverse_reactions) || "Refer to official labeling for side effect details."
        };

    } catch (e) {
        console.error("FDA fetch failed", e);
    }
    return null;
}

export const sendMessageToGemini = async (
  message: string,
  history: ChatMessage[],
  profile: UserProfile,
  language: string
): Promise<{ text: string; groundingSources?: { title: string; url: string }[] }> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerMsg = message.toLowerCase();
  
  // NORMALIZE INPUT: Remove salts to improve offline matching
  const cleanMsg = lowerMsg.replace(/ hydrochloride| sulphate| sodium| phosphate| tartrate| maleate| citrate| acetate| monohydrate| succinate| fumarate| palmitate| valerate/g, "");

  let responseText = "";

  // 1. Context Build-up (History & Profile)
  const contextDrugs = new Set<string>();
  if (profile.currentMeds) {
      profile.currentMeds.split(',').forEach(m => {
          const clean = m.trim().toLowerCase();
          if (clean) contextDrugs.add(clean);
      });
  }
  history.slice(-10).forEach(msg => {
      Object.keys(DRUG_DB).forEach(key => {
          if (msg.text.toLowerCase().includes(key)) {
              contextDrugs.add(key);
          }
      });
  });

  // Calculate Pregnancy Risk based on Profile
  const userAge = parseInt(profile.age || '0');
  const isFemale = profile.gender === 'Female';
  const isChildbearingAge = isFemale && userAge >= 18 && userAge <= 50;
  
  // Critical Profile Check
  const hasAge = !!profile.age;
  const hasGender = profile.gender !== 'Unknown';
  const profileIncomplete = !hasAge || !hasGender;

  // 2. Image handling
  const lastMsg = history[history.length - 1];
  if (lastMsg && lastMsg.image) {
      responseText += `**Image Detected**: Analyzing... Check Expiry & Red Line (Schedule H).\n\n`;
  }

  // 3. Identify Drugs in Query (Local DB + Brand Mapping)
  const foundDrugKeys = new Set<string>();

  // Check Direct Generics in DB
  Object.keys(DRUG_DB).forEach(key => {
      if (lowerMsg.includes(key) || cleanMsg.includes(key)) {
          foundDrugKeys.add(key);
      }
  });

  // Check Brands and Map to Generics
  Object.keys(BRAND_MAPPINGS).forEach(brand => {
      if (lowerMsg.includes(brand)) {
          foundDrugKeys.add(BRAND_MAPPINGS[brand]);
      }
  });

  const uniqueKeys = Array.from(foundDrugKeys);
  const foundLocalData = uniqueKeys.some(key => DRUG_DB[key]);
  
  if (foundLocalData) {
      // --- INTERACTION CHECKS (Top Priority) ---
      let interactionsDetected = false;
      let askForRiskProfile = false;

      // A. Query vs Query (Drug + Drug)
      for (let i = 0; i < uniqueKeys.length; i++) {
          for (let j = i + 1; j < uniqueKeys.length; j++) {
              const keyA = uniqueKeys[i];
              const keyB = uniqueKeys[j];
              const drugA = DRUG_DB[keyA];
              
              if (!drugA) continue; // Skip if mapped key has no DB entry (e.g. newly added map without data)

              const nameA = keyA.toUpperCase();
              const nameB = keyB.toUpperCase();

              // Check explicit interactions in DB
              const hasInteraction = drugA.interactions.some(int => keyB.includes(int.toLowerCase()) || int.toLowerCase().includes(keyB));
              
              // Check duplicate therapy
              const duplicate = (keyA === keyB);

              if (hasInteraction || duplicate) {
                  responseText += `[RED]⚠️ WARNING: CONTRAINDICATION DETECTED[/RED]\n`;
                  if (duplicate) {
                      responseText += `[RED]• Risk of Duplicate Therapy/Overdose (Both contain **${nameA}**).[/RED]\n`;
                  } else {
                      responseText += `[RED]• Interaction between **${nameA}** and **${nameB}**.[/RED]\n`;
                  }
                  interactionsDetected = true;
              }
          }
      }

      // B. Query vs Profile/History
      uniqueKeys.forEach(key => {
          const drug = DRUG_DB[key];
          if (!drug) return;

          contextDrugs.forEach(ctxDrug => {
             // Don't check against itself if it's in history
             if (uniqueKeys.includes(ctxDrug)) return; 

             const match = drug.interactions.find(i => ctxDrug.includes(i.toLowerCase()) || i.toLowerCase().includes(ctxDrug));
             if (match) {
                 responseText += `[RED]⚠️ WARNING: HISTORICAL INTERACTION[/RED]\n`;
                 responseText += `[RED]• **${key.toUpperCase()}** may interact with **${ctxDrug}** (from history/profile).[/RED]\n`;
                 interactionsDetected = true;
             }
          });

          // Check against raw profile string if not caught
          if (profile.currentMeds) {
              const meds = profile.currentMeds.toLowerCase();
              drug.interactions.forEach(i => {
                  if (meds.includes(i.toLowerCase()) && !uniqueKeys.includes(i.toLowerCase())) {
                       responseText += `[RED]⚠️ WARNING: PROFILE INTERACTION[/RED]\n`;
                       responseText += `[RED]• **${key.toUpperCase()}** interacts with **${i}**.[/RED]\n`;
                  }
              });
          }
          
          // Check for high risk flags to trigger prompt
          if (drug.habitForming || drug.bbb || drug.pregnancyUnsafe || key === 'alcohol') {
              askForRiskProfile = true;
          }
      });

      if (interactionsDetected) responseText += `\n`;

      // --- PER DRUG DETAILS ---
      uniqueKeys.forEach(key => {
          const drug = DRUG_DB[key];
          if (!drug) return; // Skip if missing data

          const drugName = key.charAt(0).toUpperCase() + key.slice(1);

          responseText += `**${drugName}**\n`;
          responseText += `**Class**: ${drug.class}\n\n`;
          
          // Uses
          responseText += `**Uses**: This medication is indicated for ${drug.indication}.\n\n`;

          if (drug.schedule.includes("Schedule")) {
             responseText += `**Regulatory**: [RED]${drug.schedule}[/RED]\n`;
          }

          if (drug.bbb) responseText += `CRITICAL: 🧠 Crosses Blood-Brain Barrier (BBB).\n`;
          if (drug.habitForming) responseText += `CRITICAL: ⛔ HABIT-FORMING / ADDICTION RISK.\n`;
          
          if (drug.pregnancyUnsafe && isChildbearingAge) {
               responseText += `CRITICAL: 🤰 UNSAFE FOR PREGNANCY (Check Category).\n`;
          }

          // --- Aggregated Contraindications ---
          const contraList: Set<string> = new Set();

          if (drug.kidney.toLowerCase().includes("contraindicated")) contraList.add(`Kidney: ${drug.kidney}`);
          if (drug.liver.toLowerCase().includes("contraindicated")) contraList.add(`Liver: ${drug.liver}`);
          if (drug.pregnancyUnsafe) contraList.add("Pregnancy: Potential risk (Category D/X)");
          drug.warnings.forEach(w => contraList.add(w));
          
          responseText += `**Contraindications**:\n`;
          if (contraList.size > 0) {
              contraList.forEach(c => responseText += `[RED]• ${c}[/RED]\n`);
          } else {
              responseText += `[RED]• No specific contraindications listed in database. Consult a doctor.[/RED]\n`;
          }
          
          // Side Effects
          responseText += `\n**Side Effects**: ${drug.sideEffects.slice(0, 3).join(", ")}\n`;
          
          responseText += `[BUY:${drugName}]\n`;
          responseText += `[WEB:${drugName}]\n\n`;
      });

      // --- SUMMARIES ---
      uniqueKeys.forEach(key => {
          const drug = DRUG_DB[key];
          if (!drug) return;
          const drugName = key.charAt(0).toUpperCase() + key.slice(1);
          responseText += `SUMMARY: **${drugName}** is classified as a ${drug.class} and is primarily used for ${drug.indication}. \n`;
      });
      
      // CRITICAL: Ask for Age/Pregnancy if needed and incomplete profile
      if (askForRiskProfile && profileIncomplete) {
          let missing = "";
          if (!hasAge && !hasGender) missing = "Age and Gender";
          else if (!hasAge) missing = "Age";
          else if (!hasGender) missing = "Gender (for Pregnancy Risk)";
          
          responseText += `\n[RED]CRITICAL: High risk medication detected. Please confirm your ${missing}.[/RED]`;
      }

  } else {
     // --- ONLINE FALLBACK ---
     
     // ADDED: Offline Check for APK stability
     if (typeof navigator !== 'undefined' && !navigator.onLine) {
         responseText += `⚠️ **Offline Mode Active**\n\n`;
         responseText += `I couldn't find details for "**${message}**" in the local database.\n`;
         responseText += `Please connect to the internet to search the comprehensive online medical database (Wikipedia/FDA).`;
         return {
            text: responseText,
            groundingSources: []
         };
     }

     const parts = lowerMsg.split(/ and | \+ | with | \& | vs /).map(s => s.trim()).filter(s => s.length > 2);
     const queries = parts.length > 1 ? parts : [message];
     
     let foundOnline = false;
     let onlineRiskDetected = false;

     for (const q of queries) {
         let wiki = await fetchWikipediaData(q);
         let fda = null;
         
         if (!wiki) fda = await fetchOpenFDAData(q, profile.openFdaKey);
         
         if (wiki) {
             foundOnline = true;
             const drugName = wiki.title;
             // Ensure complete sentences
             const cleanExtract = formatSentences(wiki.extract, 2);
             
             responseText += `**${drugName}** (Online)\n`;
             
             // Class (Wiki might not provide explicitly, but we attempt to follow format)
             responseText += `**Class**: See description below.\n\n`;

             responseText += `**Uses**: ${cleanExtract}\n\n`;
             
             // Dynamic Red Text
             const lowerEx = wiki.extract.toLowerCase();
             
             if (lowerEx.includes("blood-brain barrier")) {
                 responseText += `CRITICAL: 🧠 Crosses BBB.\n`;
                 onlineRiskDetected = true;
             }
             if (lowerEx.includes("addict") || lowerEx.includes("habit-forming") || lowerEx.includes("dependence")) {
                 responseText += `CRITICAL: ⛔ HABIT-FORMING / ADDICTION RISK.\n`;
                 onlineRiskDetected = true;
             }
             if (isChildbearingAge && (lowerEx.includes("pregnancy category d") || lowerEx.includes("pregnancy category x") || lowerEx.includes("fetal harm"))) {
                 responseText += `CRITICAL: 🤰 PREGNANCY WARNING DETECTED IN TEXT.\n`;
                 onlineRiskDetected = true;
             }
             
             responseText += `**Contraindications**:\n`;
             // Extract 2+ contraindications if possible
             const warnings = extractWarnings(wiki.extract);
             if (warnings.length > 0) {
                 warnings.forEach(w => responseText += `[RED]• ${w}[/RED]\n`);
                 if (warnings.length < 2) {
                    responseText += `[RED]• Consult doctor for additional safety information.[/RED]\n`;
                 }
             } else {
                 if (lowerEx.includes("contraindicat") || lowerEx.includes("warning")) {
                     responseText += `[RED]• Potential warnings detected. Check official sources.[/RED]\n`;
                     responseText += `[RED]• Consult doctor for details.[/RED]\n`;
                 } else {
                     responseText += `[RED]• No specific contraindications extracted. Consult a doctor.[/RED]\n`;
                     responseText += `[RED]• Check interactions manually.[/RED]\n`;
                 }
             }

             responseText += `\n**Side Effects**: Consult a physician for detailed side effects.\n`;

             responseText += `[BUY:${drugName}]\n`;
             responseText += `[WEB:${drugName}]\n`;
             responseText += `SUMMARY: **${drugName}**: ${formatSentences(wiki.extract, 1)} \n\n`;
         } 
         else if (fda) {
             foundOnline = true;
             responseText += `**${fda.brand}** (FDA)\n`;
             
             // DISPLAY ACTIVE INGREDIENTS IF DIFFERENT FROM BRAND (COMBINATION DRUGS)
             if (fda.generic && fda.brand && fda.generic.toLowerCase() !== fda.brand.toLowerCase()) {
                 responseText += `**Active Ingredients**: ${fda.generic}\n`;
             }

             responseText += `**Class**: ${fda.class}\n\n`;

             // Ensure complete sentences for Uses
             const purpose = formatSentences(fda.purpose, 2);
             responseText += `**Uses**: ${purpose}\n\n`;

             responseText += `**Contraindications / Warnings**:\n`;
             const warnings = extractWarnings(fda.warnings);
             
             if (warnings.length > 0) {
                 warnings.forEach(w => responseText += `[RED]• ${w}[/RED]\n`);
                 if (warnings.length < 2) responseText += `[RED]• Refer to official labeling for full list.[/RED]\n`;
             } else {
                 responseText += `[RED]• See official labeling for detailed contraindications.[/RED]\n`;
             }
             
             const combinedFDA = (fda.warnings + " " + fda.purpose).toLowerCase();
             if (isChildbearingAge && (combinedFDA.includes("pregnancy") && (combinedFDA.includes("unsafe") || combinedFDA.includes("avoid") || combinedFDA.includes("fetal")))) {
                 responseText += `CRITICAL: 🤰 FDA LABELING MENTIONS PREGNANCY RISKS.\n`;
                 onlineRiskDetected = true;
             }
             if (combinedFDA.includes("addict") || combinedFDA.includes("dependence")) {
                 responseText += `CRITICAL: ⛔ HABIT-FORMING / ADDICTION RISK.\n`;
                 onlineRiskDetected = true;
             }

             responseText += `\n**Side Effects**: ${formatSentences(fda.sideEffects, 2)}\n`;

             responseText += `[BUY:${fda.brand}]\n`;
             responseText += `[WEB:${fda.brand}]\n`;
             responseText += `SUMMARY: **${fda.brand}** is identified for: ${formatSentences(fda.purpose, 1)}\n\n`;
         }
     }

     if (onlineRiskDetected && profileIncomplete) {
          let missing = "";
          if (!hasAge && !hasGender) missing = "Age and Gender";
          else if (!hasAge) missing = "Age";
          else if (!hasGender) missing = "Gender (for Pregnancy Risk)";
          
          responseText += `\n[RED]CRITICAL: High risk medication detected. Please confirm your ${missing}.[/RED]`;
     }

     if (!foundOnline) {
         responseText += `I couldn't find specific details for "**${message}**" in the offline database.\n\n`;
         responseText += `[WEB:${message}]`;
     }
  }

  return {
    text: responseText,
    groundingSources: []
  };
};