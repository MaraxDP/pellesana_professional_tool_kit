/* =========================================================================
   PROTOCOLLO PELLE SANA — script.js
   FIDEST × InLab medical
   -------------------------------------------------------------------------
   Indice del file:
   1. DATI (array/oggetti — da aggiornare con i contenuti ufficiali)
   2. UTILITY
   3. NAVIGAZIONE + TORNA IN ALTO
   4. TIMELINE "IL PROTOCOLLO"
   5. PIANI DI TRATTAMENTO (righe accordion + modal)
   6. ATTIVI PROFESSIONALI (lista + modal)
   7. HOME CARE (lista + modal)
   8. RISULTATI (split prima/dopo)
   9. FORMAZIONE E RISORSE (tab + liste)
   10. LIBRERIA MATERIALI (lista + filtri)
   11. INIT
   ========================================================================= */


/* =========================================================================
   1. DATI
   -------------------------------------------------------------------------
   I prodotti professionali e i prodotti domiciliari riportati qui sotto
   sono tratti dalle schede tecniche ufficiali InLab fornite da FIDEST
   (nome, quantità, attivi, funzione, INCI, indicazioni, modalità d'uso).
   ========================================================================= */

// Etichette leggibili per le categorie usate nei filtri/tab
const CATEGORY_LABELS = {
    // Piani di trattamento — problematiche
    "prevenzione-skin-longevity": "Prevenzione & Skin Longevity",
    "invecchiamento-avanzato": "Invecchiamento Cutaneo Avanzato",
    "perdita-tono-compattezza": "Perdita di Tono e Compattezza",
    "discromie-colorito-spento": "Discromie Cutanee e Colorito Spento",
    "post-acne-texture": "Esiti Post-Acne e Irregolarità della Texture",
    "pelle-sensibile": "Pelle Sensibile",
    "sebo-pelle-acneica": "Eccesso di Sebo e Pelle a Tendenza Acneica",
    "diradamento-capelli": "Diradamento e Indebolimento dei Capelli",
    // Attivi professionali
    "acidi-cosmetici": "Acidi Cosmetici",
    "biorivitalizzanti": "Biorivitalizzanti",
    "ricostituenti": "Ricostituenti",
    "complementari": "Prodotti Complementari",
    "accessori-complementari": "Accessori Complementari",
    // Home care — le due linee professionali del protocollo + tipologia prodotto
    "esosomi": "Esosomi",
    "dna-salmone": "DNA di Salmone",
    "sieri": "Sieri",
    "creme": "Creme",
    "contorno-occhi": "Contorno occhi",
    // Formazione e risorse — le 4 aree
    "introduttivi": "Video introduttivi",
    "training": "Video training",
    "marketing": "Materiali marketing",
    "anamnesi": "Anamnesi",
    // Libreria materiali
    "brochure": "Brochure",
    "listini": "Listini",
    "moduli": "Moduli",
    "schede-anamnesi": "Schede anamnesi",
    "materiale-stampabile": "Materiale stampabile"
};

// Identità cromatica globale degli attivi. Le categorie di filtro esistenti
// restano invariate; questa mappa assegna a ogni prodotto la famiglia visiva
// specifica prevista dal color coding del Protocollo Pelle Sana.
const ACTIVE_COLOR_LABELS = {
    "biorivitalizzanti": "Biorivitalizzanti",
    "acidi-esfolianti": "Acidi esfolianti",
    "acido-depigmentante": "Acido depigmentante",
    "idratazione": "Idratazione",
    "vitamine": "Vitamine",
    "proteine": "Proteine",
    "depigmentante": "Depigmentante",
    "contorno-occhi": "Contorno occhi"
};

const ACTIVE_COLOR_BY_PRODUCT_ID = {
    "exobio-plus": "biorivitalizzanti",
    "adrn-plus": "biorivitalizzanti",
    "exobio-adrn-plus": "biorivitalizzanti",
    "nad-plus-glow": "biorivitalizzanti",
    "exohair-plus": "biorivitalizzanti",
    "depigmenting-peeling-plus": "acidi-esfolianti",
    "antiaging-peeling-cocktail": "acidi-esfolianti",
    "oily-skin-peeling-plus": "acidi-esfolianti",
    "tranexamic-acid": "acido-depigmentante",
    "hyaluronic-acid-3": "idratazione",
    "mix-ha-dmae-silicio": "idratazione",
    "organic-silicio-6": "idratazione",
    "vitamin-c-10": "vitamine",
    "polyvitaminic": "vitamine",
    "botx-like-argireline-10": "proteine",
    "growth-factor-gf1": "proteine",
    "brightening-cocktail": "depigmentante",
    "flash-eye": "contorno-occhi"
};

const ACTIVE_COLOR_BY_CODE = {
    EXO: "biorivitalizzanti", ADRN: "biorivitalizzanti", NAD: "biorivitalizzanti", EXHA: "biorivitalizzanti",
    DPP: "acidi-esfolianti", AAP: "acidi-esfolianti", OSPP: "acidi-esfolianti",
    TRAN: "acido-depigmentante",
    AI3: "idratazione", MIX: "idratazione", SO: "idratazione",
    "VIT C": "vitamine", POLI: "vitamine",
    BTX: "proteine", GF: "proteine",
    BRC: "depigmentante",
    FE: "contorno-occhi"
};

// Le 2 fasi del Protocollo Pelle Sana.
const METODO_FASI = [
    {
        id: "preparazione",
        numero: "Fase 1",
        nome: "Preparazione",
        sintesi: "La fase iniziale del percorso: si valuta la pelle e si preparano i tessuti ai trattamenti successivi.",
        dettaglio: "Comprende anamnesi professionale, valutazione iniziale della pelle e definizione del percorso personalizzato, seguite dal trattamento con acidi cosmetici e/o biorivitalizzanti in base alle esigenze cutanee.",
        piano: {
            titolo: "Cadenza dei trattamenti",
            opzioni: [
                { nome: "Acidi cosmetici (se ci sono)", frequenza: "Trattamento da ripetere con cadenza ogni 7–10 giorni" },
                { nome: "Biorivitalizzanti con microneedling", frequenza: "Ogni 14–21 giorni, a seconda dello spessore e dello stato della pelle" }
            ]
        }
    },
    {
        id: "ricostituzione",
        numero: "Fase 2",
        nome: "Ricostituente",
        sintesi: "Il ciclo di ricostituzione: una fase progressiva dedicata a migliorare idratazione, vitalità, compattezza e qualità generale della pelle.",
        dettaglio: "Il percorso prosegue per 6 mesi, con una seduta ogni circa 30 giorni.",
        piano: {
            titolo: "Successivi 6 mesi",
            nota: "Tre blocchi di attivi, in ordine progressivo:",
            opzioni: [
                { nome: "Mese 1–2", frequenza: "Attivi per l'idratazione" },
                { nome: "Mese 3–4", frequenza: "Attivi vitaminici" },
                { nome: "Mese 5–6", frequenza: "Attivi proteici" }
            ],
            chiusura: "Ricostituenti con microneedling: 1 seduta mensile, accompagnata da trattamenti cosmetici e/o con apparecchiature scelti dall’operatrice."
        }
    }
];

// -------------------------------------------------------------------------
// PIANI DI TRATTAMENTO
// -------------------------------------------------------------------------

// Ordine fisso delle categorie mostrate nella barra filtri (oltre a "Tutti")
const PIANI_CATEGORIES = [
    "prevenzione-skin-longevity",
    "invecchiamento-avanzato",
    "perdita-tono-compattezza",
    "discromie-colorito-spento",
    "post-acne-texture",
    "pelle-sensibile",
    "sebo-pelle-acneica",
    "diradamento-capelli"
];

const TREATMENT_LEGEND = {
    EXO: "Exobio Plus", ADRN: "ADRN Plus", NAD: "NAD Plus Glow", EXHA: "ExoHair Plus",
    AI3: "Acido Ialuronico 3%", MIX: "Acido Ialuronico 1% + DMAE 1% + Silicio Organico 0,5%",
    SO: "Silicio Organico", POLI: "Polivitaminico", GF: "Growth Factor GF#1",
    "VIT C": "Vitamina C 10%", BTX: "Botxlike Argireline 10%", FE: "Flash Eye",
    DPP: "Depigmenting Peeling Plus", TRAN: "Tranexamic Acid", OSPP: "Oily Skin Peeling Plus",
    BRC: "Brightening Cocktail", AAP: "Antiaging Peeling Plus"
};

const TREATMENT_PRODUCT_IDS = {
    EXO: "exobio-plus", ADRN: "adrn-plus", NAD: "nad-plus-glow", EXHA: "exohair-plus",
    AI3: "hyaluronic-acid-3", MIX: "mix-ha-dmae-silicio", SO: "organic-silicio-6",
    POLI: "polyvitaminic", GF: "growth-factor-gf1", "VIT C": "vitamin-c-10",
    BTX: "botx-like-argireline-10", FE: "flash-eye", DPP: "depigmenting-peeling-plus",
    TRAN: "tranexamic-acid", OSPP: "oily-skin-peeling-plus", BRC: "brightening-cocktail",
    AAP: "antiaging-peeling-cocktail"
};

const treatmentPlans = [
    {
        id: "protocollo-prevenzione", nome: "Protocollo Prevenzione", categorie: ["prevenzione-skin-longevity"],
        obiettivo: "Preservare nel tempo vitalità, idratazione e qualità cutanea, sostenendo precocemente i naturali processi di rinnovamento.",
        condizioniIniziali: "Pelle in buono stato generale, con primi segnali di disidratazione, stanchezza o perdita di luminosità e necessità di prevenzione evolutiva.",
        durata: "8 mesi + mantenimento domiciliare", note: "La scelta tra AI3 e MIX viene definita dalla professionista in base alla valutazione cutanea.",
        cicli: [
            { titolo: "Preparazione rivitalizzante", periodo: "Primi 2 mesi", sedute: [
                { label: "Seduta 1", fase: "B.R.", attivi: ["EXO", "ADRN"] }, { label: "Seduta 2", fase: "B.R.", attivi: ["EXO", "ADRN"] },
                { label: "Seduta 3", fase: "B.R.", attivi: ["NAD", "NAD"] }, { label: "Seduta 4", fase: "B.R.", attivi: ["NAD", "NAD"] }
            ]},
            { titolo: "Ricostituente", periodo: "Secondi 6 mesi", sedute: [
                { label: "Seduta 5", fase: "IDR", attivi: ["AI3 / MIX"] }, { label: "Dopo 21 gg", fase: "IDR", attivi: ["AI3 / MIX"] },
                { label: "Seduta 7", fase: "VIT", attivi: ["POLI"] }, { label: "Seduta 8", fase: "VIT", attivi: ["POLI"] },
                { label: "Seduta 9", fase: "PRO", attivi: ["GF"] }, { label: "Seduta 10", fase: "PRO", attivi: ["GF"] }
            ]}
        ],
        homeCareIds: ["exobio-facial-cream", "exobio-eye-contour", "exobio-facial-serum", "adrn-pro-facial-cream", "adrn-pro-eye-contour", "adrn-pro-facial-serum"]
    },
    {
        id: "protocollo-lip-eye", nome: "Protocollo Lip Volume & Eye Care", categorie: ["prevenzione-skin-longevity"],
        obiettivo: "Idratare e valorizzare l'area labbra e migliorare l'aspetto del contorno occhi con un percorso mirato e progressivo.",
        condizioniIniziali: "Labbra disidratate o poco definite e contorno occhi segnato da secchezza, stanchezza, borse o occhiaie.",
        durata: "2 mesi", note: "Trattamenti di nano needling effettuati con cadenza settimanale.",
        cicli: [{ titolo: "Nano needling", periodo: "Cadenza settimanale in 2 mesi", sedute: Array.from({length: 8}, (_, i) => ({ label: `Seduta ${i + 1}`, fase: i < 8 ? "LABBRA / C. OCCHI" : "", attivi: ["AI3", "FE"] })) }],
        homeCareIds: []
    },
    {
        id: "protocollo-antiaging", nome: "Protocollo Antiaging", categorie: ["invecchiamento-avanzato"],
        obiettivo: "Intervenire sui segni avanzati dell'invecchiamento sostenendo rivitalizzazione, idratazione, compattezza e qualità della texture.",
        condizioniIniziali: "Pelle matura con rughe visibili, perdita di densità, disidratazione e riduzione della luminosità.",
        durata: "8 mesi", note: "Le alternative indicate con la barra devono essere selezionate secondo la valutazione professionale.",
        cicli: [
            { titolo: "Preparazione rivitalizzante", periodo: "Primi 2 mesi", sedute: Array.from({length: 4}, (_, i) => ({ label: `Seduta ${i + 1}`, fase: "B.R. / ACIDI", attivi: ["EXO / NAD", "AAP"] })) },
            { titolo: "Mantenimento ricostituzione", periodo: "Secondi 6 mesi", sedute: [
                {label:"Seduta 5",fase:"IDR",attivi:["AI3 / SO"]},{label:"Dopo 21 gg",fase:"IDR",attivi:["AI3 / SO"]},
                {label:"Seduta 7",fase:"VIT",attivi:["VIT C"]},{label:"Seduta 8",fase:"VIT",attivi:["VIT C"]},
                {label:"Seduta 9",fase:"PRO",attivi:["BTX"]},{label:"Seduta 10",fase:"PRO",attivi:["BTX"]}
            ]}
        ], homeCareIds: []
    },
    {
        id: "protocollo-lifting-volume", nome: "Protocollo Lifting & Volume", categorie: ["perdita-tono-compattezza"],
        obiettivo: "Migliorare tono, compattezza e percezione dei volumi attraverso una progressione rivitalizzante e ricostituente.",
        condizioniIniziali: "Rilassamento cutaneo, perdita di compattezza e volumi meno definiti su viso e collo.",
        durata: "8 mesi", note: "La scelta tra AI3 e SO viene definita dalla professionista in base alla condizione cutanea.",
        cicli: [
            { titolo:"Preparazione rivitalizzante",periodo:"Primi 2 mesi",sedute:Array.from({length:4},(_,i)=>({label:`Seduta ${i+1}`,fase:"B.R.",attivi:["ADRN"]})) },
            { titolo:"Mantenimento ricostituzione",periodo:"Secondi 6 mesi",sedute:[
                {label:"Seduta 5",fase:"IDR",attivi:["AI3 / SO"]},{label:"Dopo 21 gg",fase:"IDR",attivi:["AI3 / SO"]},
                {label:"Seduta 7",fase:"VIT",attivi:["POLI"]},{label:"Seduta 8",fase:"VIT",attivi:["POLI"]},
                {label:"Seduta 9",fase:"PRO",attivi:["BTX"]},{label:"Seduta 10",fase:"PRO",attivi:["BTX"]}
            ]}
        ], homeCareIds:["adrn-pro-facial-cream","adrn-pro-eye-contour","adrn-pro-facial-serum"]
    },
    {
        id:"protocollo-depigmentante",nome:"Protocollo Depigmentante & Illuminante",categorie:["discromie-colorito-spento"],
        obiettivo:"Uniformare progressivamente l'incarnato e sostenere luminosità e qualità cutanea nel trattamento professionale delle discromie.",
        condizioniIniziali:"Macchie, tono disomogeneo, colorito spento o iperpigmentazione visibile.",durata:"8 mesi",
        note:"Le alternative EXO/NAD e DPP/TRAN devono essere selezionate secondo la valutazione professionale.",
        cicli:[
            {titolo:"Preparazione rivitalizzante",periodo:"Primi 2 mesi",sedute:Array.from({length:4},(_,i)=>({label:`Seduta ${i+1}`,fase:"B.R. / ACIDI",attivi:["EXO / NAD","DPP / TRAN"]}))},
            {titolo:"Mantenimento ricostituzione",periodo:"Secondi 6 mesi",sedute:[
                {label:"Seduta 5",fase:"IDR",attivi:["AI3","BRC"]},{label:"Dopo 21 gg",fase:"IDR",attivi:["AI3","BRC"]},
                {label:"Seduta 7",fase:"VIT",attivi:["VIT C","BRC"]},{label:"Seduta 8",fase:"VIT",attivi:["VIT C","BRC"]},
                {label:"Seduta 9",fase:"PRO",attivi:["GF","BRC"]},{label:"Seduta 10",fase:"PRO",attivi:["GF","BRC"]}
            ]}
        ],homeCareIds:[]
    },
    {
        id:"protocollo-skin-repair",nome:"Protocollo Skin Repair",categorie:["post-acne-texture"],
        obiettivo:"Favorire il miglioramento progressivo della texture e dell'aspetto degli esiti post-acne.",
        condizioniIniziali:"Esiti post-acne, irregolarità superficiali e texture disomogenea.",durata:"8 mesi",
        cicli:[
            {titolo:"Preparazione rivitalizzante",periodo:"Primi 2 mesi",sedute:Array.from({length:4},(_,i)=>({label:`Seduta ${i+1}`,fase:"B.R. / ACIDI",attivi:["ADRN","TRAN"]}))},
            {titolo:"Mantenimento ricostituzione",periodo:"Secondi 6 mesi",sedute:[
                {label:"Seduta 5",fase:"IDR",attivi:["AI3 / MIX"]},{label:"Dopo 21 gg",fase:"IDR",attivi:["AI3 / MIX"]},
                {label:"Seduta 7",fase:"VIT",attivi:["VIT C"]},{label:"Seduta 8",fase:"VIT",attivi:["VIT C"]},
                {label:"Seduta 9",fase:"PRO",attivi:["GF"]},{label:"Seduta 10",fase:"PRO",attivi:["GF"]}
            ]}
        ],
        homeCareIds:["adrn-pro-facial-cream","adrn-pro-eye-contour","adrn-pro-facial-serum"],
        note:"La scelta tra AI3 e MIX viene definita dalla professionista in base alla valutazione cutanea."
    },
    {
        id:"protocollo-pelle-sensibile",nome:"Protocollo Pelle Sensibile",categorie:["pelle-sensibile"],
        obiettivo:"Sostenere comfort, equilibrio e qualità della pelle rispettandone la particolare reattività.",
        condizioniIniziali:"Pelle fragile, reattiva o soggetta a rossore e sensazioni di discomfort.",durata:"8 mesi",
        cicli:[
            {titolo:"Preparazione rivitalizzante",periodo:"Primi 2 mesi",sedute:Array.from({length:4},(_,i)=>({label:`Seduta ${i+1}`,fase:"B.R.",attivi:["ADRN"]}))},
            {titolo:"Mantenimento ricostituzione",periodo:"Secondi 6 mesi",sedute:[
                {label:"Seduta 5",fase:"IDR",attivi:["AI3 / MIX"]},{label:"Dopo 21 gg",fase:"IDR",attivi:["AI3 / MIX"]},
                {label:"Seduta 7",fase:"VIT",attivi:["POLI"]},{label:"Seduta 8",fase:"VIT",attivi:["POLI"]},
                {label:"Seduta 9",fase:"PRO",attivi:["GF"]},{label:"Seduta 10",fase:"PRO",attivi:["GF"]}
            ]}
        ],
        homeCareIds:["adrn-pro-facial-cream","adrn-pro-eye-contour","adrn-pro-facial-serum"],
        note:"La scelta tra AI3 e MIX viene definita dalla professionista in base alla valutazione cutanea."
    },
    {
        id:"protocollo-sebo-balance",nome:"Protocollo Sebo Balance",categorie:["sebo-pelle-acneica"],
        obiettivo:"Riequilibrare l'eccesso di sebo e migliorare progressivamente l'aspetto delle imperfezioni.",
        condizioniIniziali:"Pelle lucida, impura, con pori visibili e tendenza acneica.",durata:"8 mesi",
        cicli:[
            {titolo:"Preparazione rivitalizzante",periodo:"Primi 2 mesi",sedute:Array.from({length:4},(_,i)=>({label:`Seduta ${i+1}`,fase:"B.R. / ACIDI",attivi:["EXO","OSPP"]}))},
            {titolo:"Mantenimento ricostituzione",periodo:"Secondi 6 mesi",sedute:[
                {label:"Seduta 5",fase:"IDR",attivi:["AI3"]},{label:"Dopo 21 gg",fase:"IDR",attivi:["AI3"]},
                {label:"Seduta 7",fase:"VIT",attivi:["POLI"]},{label:"Seduta 8",fase:"VIT",attivi:["POLI"]},
                {label:"Seduta 9",fase:"PRO",attivi:["GF"]},{label:"Seduta 10",fase:"PRO",attivi:["GF"]}
            ]}
        ],
        homeCareIds:["exobio-facial-cream","exobio-eye-contour","exobio-facial-serum"],
        note:"L'impiego degli attivi segue la sequenza professionale indicata nel documento ufficiale."
    },
    {
        id:"protocollo-anti-hair-loss",nome:"Protocollo Anti Hair Loss",categorie:["diradamento-capelli"],
        obiettivo:"Sostenere vitalità del cuoio capelluto e qualità del capello in presenza di diradamento o indebolimento.",
        condizioniIniziali:"Capelli indeboliti o diradati e cuoio capelluto devitalizzato.",durata:"8 mesi",
        cicli:[
            {titolo:"Preparazione rivitalizzante",periodo:"Primi 2 mesi",sedute:Array.from({length:4},(_,i)=>({label:`Seduta ${i+1}`,fase:"B.R.",attivi:["EXHA"]}))},
            {titolo:"Mantenimento ricostituzione",periodo:"Secondi 6 mesi",sedute:[
                {label:"Seduta 5",fase:"IDR",attivi:["AI3 / MIX"]},{label:"Dopo 21 gg",fase:"IDR",attivi:["AI3 / MIX"]},
                {label:"Seduta 7",fase:"VIT",attivi:["POLI"]},{label:"Seduta 8",fase:"VIT",attivi:["POLI"]},
                {label:"Seduta 9",fase:"PRO",attivi:["GF"]},{label:"Seduta 10",fase:"PRO",attivi:["GF"]}
            ]}
        ],
        homeCareIds:[],
        note:"Il PDF non specifica un Home Care per questo protocollo; la scelta tra AI3 e MIX dipende dalla valutazione professionale."
    }
];
// -------------------------------------------------------------------------
// ATTIVI PROFESSIONALI
// Dati tratti dalle schede tecniche ufficiali InLab (FIDEST).
// -------------------------------------------------------------------------

// Ordine fisso delle categorie mostrate nella barra filtri (oltre a "Tutti")
const SCHEDE_CATEGORIES = [
    "acidi-cosmetici",
    "biorivitalizzanti",
    "ricostituenti",
    "complementari",
    "accessori-complementari"
];

const professionalProducts = [
    {
        id: "exobio-plus",
        nome: "Exobio Plus",
        categoria: ["biorivitalizzanti"],
        quantita: "Box 8x5ml",
        principiAttivi: "Esosomi (Exo-Vitalize), proteine di soia idrolizzate, Lactobacillus ferment, complesso vitalizzante",
        funzione: "Rigenera e rivitalizza la pelle a livello cellulare, agendo su imperfezioni e irregolarità.",
        descrizione: "L'effetto rigenerante degli esosomi unito al complesso di vitamine, aminoacidi e oligopeptidi rinnova e rivitalizza la pelle.",
        indicazioni: "Pelle spenta, priva di energia, in fase di prevenzione e mantenimento.",
        modalitaUtilizzo: "Uso professionale topico su viso, con applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "adrn-plus",
        nome: "ADRN Plus",
        categoria: ["biorivitalizzanti"],
        quantita: "Box 8x5ml",
        principiAttivi: "DNA sodico (polinucleotidi marini), acido ialuronico multi-peso molecolare, vitamina C, DMAE, Centella asiatica",
        funzione: "Bio-costruttore dermico: stimola riparazione tessutale, idratazione e tono.",
        descrizione: "Trattamento intensivo in due formule complementari (DNA Pro + Firming Complex) pensato per dermapen.",
        indicazioni: "Rughe, perdita di tono, pelle matura.",
        modalitaUtilizzo: "Uso professionale topico su viso, dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "nad-plus-glow",
        nome: "NAD Plus Glow",
        categoria: ["biorivitalizzanti"],
        quantita: "Box 8x5ml",
        principiAttivi: "NAD (Nicotinamide Adenina Dinucleotide), complesso Fattori di Crescita Luminosi, vitamina C, glutatione",
        funzione: "Rivitalizza l'energia cellulare e migliora luminosità, uniformità e vitalità della pelle.",
        descrizione: "Trattamento in fiale per dermapen/microneedling che combina NAD e complesso illuminante.",
        indicazioni: "Pelle spenta, stanca, con segni di affaticamento e invecchiamento precoce.",
        modalitaUtilizzo: "Uso professionale topico su viso, dermapen/microneedling.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "exohair-plus",
        nome: "Exohair Plus",
        categoria: ["biorivitalizzanti"],
        quantita: "Box 8x5ml (4+4 fiale)",
        principiAttivi: "Esosomi, proteine di soia idrolizzate, Lactobacillus ferment, acido ialuronico, silicio organico, Ginkgo Biloba, Centella asiatica",
        funzione: "Rivitalizza il cuoio capelluto e rinforza il capello, contrastando la caduta.",
        descrizione: "Trattamento professionale capelli con esosomi rivitalizzanti + complesso rinforzante anticaduta.",
        indicazioni: "Capelli indeboliti, diradati, cuoio capelluto devitalizzato.",
        modalitaUtilizzo: "Uso professionale topico su cuoio capelluto.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "antiaging-peeling-cocktail",
        nome: "Antiaging Peeling Cocktail",
        categoria: ["acidi-cosmetici"],
        quantita: "Box 5x5ml",
        principiAttivi: "AHA 15% (acido mandelico, ferulico, citrico) + DMAE 2%",
        funzione: "Attenua le linee sottili di espressione e rassoda la pelle.",
        descrizione: "Peeling che idrata ed esfolia delicatamente, favorendo il rinnovamento cellulare.",
        indicazioni: "Rughe sottili, perdita di tono, prima fase di preparazione della pelle.",
        modalitaUtilizzo: "Applicazione manuale su viso deterso; valutare neutralizzazione.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "depigmenting-peeling-plus",
        nome: "Depigmenting Peeling Plus",
        categoria: ["acidi-cosmetici"],
        quantita: "Box 5x5ml",
        principiAttivi: "AHA 25% (acido glicolico, lattico, tranexamico, cogico)",
        funzione: "Rimuove le cellule con eccesso di melanina e previene la comparsa di macchie.",
        descrizione: "Peeling depigmentante che aiuta a uniformare il tono della pelle.",
        indicazioni: "Macchie, melasma, discromie.",
        modalitaUtilizzo: "Applicazione manuale su viso deterso; valutare neutralizzazione.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "oily-skin-peeling-plus",
        nome: "Oily Skin Peeling Plus",
        categoria: ["acidi-cosmetici"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido mandelico, lattico, citrico, salicilico",
        funzione: "Tratta le imperfezioni e migliora tono e consistenza della pelle grassa/impura.",
        descrizione: "Peeling versatile con azione antiossidante, comedolitica e cheratolitica.",
        indicazioni: "Pelle impura, acneica, pori dilatati.",
        modalitaUtilizzo: "Applicazione manuale su viso deterso; valutare neutralizzazione.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "hyaluronic-acid-3",
        nome: "Hyaluronic Acid 3%",
        categoria: ["ricostituenti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido ialuronico ad alta concentrazione",
        funzione: "Idrata, dona volume e leviga la pelle.",
        descrizione: "Soluzione sterile ad alta concentrazione di acido ialuronico.",
        indicazioni: "Disidratazione, pelle spenta, prevenzione delle rughe.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "organic-silicio-6",
        nome: "Organic Silicio 6%",
        categoria: ["ricostituenti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Silicio organico (Methylsilanol Mannuronate)",
        funzione: "Stimola collagene ed elastina, protegge l'architettura cutanea.",
        descrizione: "Sostanza versatile per migliorare tono e consistenza della pelle.",
        indicazioni: "Rughe, pelle secca, texture irregolare.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "botx-like-argireline-10",
        nome: "Botx Like Argireline 10%",
        categoria: ["ricostituenti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Argireline® (esapeptide), niacinamide",
        funzione: "Effetto tensore simile alla tossina botulinica, azione antiossidante.",
        descrizione: "Esapeptide antirughe che migliora tono e texture della pelle.",
        indicazioni: "Rughe di espressione, perdita di tono.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "brightening-cocktail",
        nome: "Brightening Cocktail",
        categoria: ["ricostituenti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Kiwi, estratto di liquirizia (Glycyrrhiza Glabra), Sophora flavescens",
        funzione: "Schiarisce e uniforma il tono della pelle.",
        descrizione: "Siero viso con ingredienti naturali e attivi schiarenti.",
        indicazioni: "Macchie, discromie, incarnato spento.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "polyvitaminic",
        nome: "Polyvitaminic",
        categoria: ["ricostituenti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Vitamine, aminoacidi, peptidi, acido ialuronico, minerali",
        funzione: "Ripristina la matrice extracellulare, azione antiossidante anti-età.",
        descrizione: "Soluzione cosmetica completa per il ripristino dei processi vitali cutanei.",
        indicazioni: "Pelle disidratata, stanca, in fase di mantenimento.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "vitamin-c-10",
        nome: "Vitamin C 10%",
        categoria: ["ricostituenti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido ascorbico 10%",
        funzione: "Dona luminosità, uniforma il tono e migliora l'elasticità.",
        descrizione: "Soluzione sterile per una pelle radiosa e levigata.",
        indicazioni: "Fotoinvecchiamento, macchie, incarnato spento.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "tranexamic-acid",
        nome: "Tranexamic Acid",
        categoria: ["acidi-cosmetici"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido tranexamico",
        funzione: "Riduce macchie scure, melasma e iperpigmentazione post-infiammatoria.",
        descrizione: "Utilizzato nel trattamento e nella prevenzione dell'iperpigmentazione cutanea.",
        indicazioni: "Melasma, macchie post-acne, discromie.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "growth-factor-gf1",
        nome: "Growth Factor GF#1",
        categoria: ["ricostituenti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Peptidi biomimetici, vitamina C, glicogeno, Gatuline Spot-Light",
        funzione: "Ripristina i processi cutanei e ritarda gli effetti dell'invecchiamento.",
        descrizione: "Vitamine e peptidi identici ai fattori di crescita naturali.",
        indicazioni: "Fotoinvecchiamento, macchie, cicatrici post-acne.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "mix-ha-dmae-silicio",
        nome: "Mix 1% HA + 1% DMAE + 0,5% Silicio Organico",
        categoria: ["ricostituenti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido ialuronico, DMAE, silicio organico",
        funzione: "Effetto lifting e idratazione profonda, stimola il metabolismo cellulare.",
        descrizione: "Proprietà tensorie e idratanti che contrastano la flaccidità di viso e corpo.",
        indicazioni: "Rughe, perdita di tono, flaccidità.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "flash-eye",
        nome: "Flash Eye",
        categoria: ["ricostituenti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Peptidi, acido ialuronico, caffeina, niacinamide",
        funzione: "Riduce borse e occhiaie, azione antiossidante e anti-età per il contorno occhi.",
        descrizione: "Soluzione mirata per la delicata zona del contorno occhi.",
        indicazioni: "Borse, occhiaie, segni di stanchezza perioculare.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "regenerating-hair-serum",
        nome: "Regenerating Hair Serum",
        categoria: ["complementari"],
        quantita: "30ml",
        principiAttivi: "Cheratina idrolizzata, pantenolo, estratto di Jatropha Macrantha",
        funzione: "Ripara la fibra capillare e previene l'effetto crespo.",
        descrizione: "Siero per capelli che dona forza ed elasticità.",
        indicazioni: "Capelli sfibrati, secchi o trattati chimicamente.",
        modalitaUtilizzo: "Applicare alcune gocce sui capelli asciutti o bagnati.",
        avvertenze: "Non ingerire. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "mask-biogel-exoderm",
        nome: "Mask of Biogel Exoderm",
        categoria: ["complementari"],
        quantita: "Box 5x30ml",
        principiAttivi: "Acido ialuronico, collagene idrolizzato, Centella asiatica",
        funzione: "Idrata intensamente, uniforma il tono e leviga la texture. Sicura per rosacea.",
        descrizione: "Maschera idrogel Exoderm per pelle secca e disidratata.",
        indicazioni: "Disidratazione, pelle sensibile o con rosacea.",
        modalitaUtilizzo: "Applicare sul viso e lasciare in posa 15-30 minuti.",
        avvertenze: "Non usare su cute lesa. Evitare il contatto con gli occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "peptigenol-skin-antiox",
        nome: "Peptigenol Skin Antiox Ampoules",
        categoria: ["complementari"],
        quantita: "Box 6x4ml",
        principiAttivi: "Proteine di soia idrolizzate, 3 peptidi sintetici, coenzima Q10, vitamina E, acido ialuronico",
        funzione: "Corregge le linee di espressione, nutre e idrata in profondità.",
        descrizione: "Complesso peptidico rigenerante con effetto antiossidante.",
        indicazioni: "Fotoinvecchiamento, cicatrici post-acne, pelle stanca.",
        modalitaUtilizzo: "Massaggiare sulla pelle fino a completo assorbimento.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "micro-peeling",
        nome: "Micro Peeling",
        categoria: ["complementari"],
        quantita: "Box 1x200ml",
        principiAttivi: "Olio di Argan, tè verde, vitamina E, burro di karité",
        funzione: "Esfolia lo strato corneo e ripristina l'equilibrio fisiologico della pelle.",
        descrizione: "Scrub meccanico delicato per morbidezza e luminosità.",
        indicazioni: "Texture irregolare, fase di preparazione della pelle.",
        modalitaUtilizzo: "Massaggiare con movimenti circolari e risciacquare.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "neutralizing-solution",
        nome: "Neutralizing Solution",
        categoria: ["complementari"],
        quantita: "Box 1x110ml",
        principiAttivi: "Sodium bicarbonate, glicerina",
        funzione: "Neutralizza l'effetto degli acidi durante i trattamenti.",
        descrizione: "Protegge da possibili effetti avversi nei trattamenti con acidi.",
        indicazioni: "Da usare al termine dei peeling con acidi.",
        modalitaUtilizzo: "Nebulizzare sul viso dopo aver protetto gli occhi, quindi risciacquare.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "repair-balm",
        nome: "Repair Balm",
        categoria: ["complementari"],
        quantita: "Box 1x15ml",
        principiAttivi: "Argireline, ribes nero, vitamina E, lampone nero, acido salicilico",
        funzione: "Idrata, nutre e protegge le labbra dopo i trattamenti.",
        descrizione: "Balsamo riparatore post-trattamento per le labbra.",
        indicazioni: "Post-trattamento labbra.",
        modalitaUtilizzo: "Massaggiare sulle labbra fino a completo assorbimento.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "white-mousse-cleansing-foam",
        nome: "White Mousse Cleansing Foam",
        categoria: ["complementari"],
        quantita: "Box 1x200ml",
        principiAttivi: "Olio di Argan 100%, acido ferulico, fitosteroli, squalene",
        funzione: "Rimuove impurità e sebo in eccesso, deterge in profondità.",
        descrizione: "Schiuma detergente che riequilibra lo strato superficiale della pelle.",
        indicazioni: "Fase di preparazione, pelle impura.",
        modalitaUtilizzo: "Massaggiare delicatamente e risciacquare.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "bioled-facial-mask",
        nome: "BioLed Facial Mask",
        categoria: ["accessori-complementari"],
        quantita: "Box 1x1",
        principiAttivi: "Tecnologia LED multicolore (rosso, blu, verde, giallo, viola, azzurro, bianco)",
        funzione: "Ogni colore agisce su un obiettivo specifico: elasticità, anti-acne, macchie, luminosità, rigenerazione, lenitivo, anti-età.",
        descrizione: "Maschera LED in silicone flessibile con cinturino regolabile.",
        indicazioni: "Complemento tecnologico ai trattamenti cosmetici, da abbinare secondo obiettivo.",
        modalitaUtilizzo: "Seguire le indicazioni del dispositivo per tempo di posa e colore.",
        avvertenze: "Consultare le istruzioni del dispositivo prima dell'uso.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "golden-kiss-lip-mask",
        nome: "Golden Kiss Lip Mask",
        categoria: ["complementari"],
        quantita: "Box 10pz",
        principiAttivi: "Alga rossa, Polygonum cuspidatum, Centella asiatica, liquirizia, camomilla, rosmarino",
        funzione: "Idrata e nutre le labbra, riducendo i segni della disidratazione.",
        descrizione: "Maschera in patch per labbra morbide e levigate.",
        indicazioni: "Post-trattamento labbra, home spa in cabina.",
        modalitaUtilizzo: "Applicare sulle labbra deterse per 15-20 minuti.",
        avvertenze: "Non usare in presenza di ferite o herpes labiale.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        id: "golden-eye-patch",
        nome: "Golden Eye Patch",
        categoria: ["complementari"],
        quantita: "Box 10pz",
        principiAttivi: "Alga rossa, aloe, burro di karité, collagene",
        funzione: "Combatte i principali segni del tempo nel contorno occhi, restituendo elasticità.",
        descrizione: "Coppia di patch in hydrogel ad alto potere idratante.",
        indicazioni: "Borse, occhiaie, contorno occhi disidratato.",
        modalitaUtilizzo: "Applicare sotto l'area oculare e lasciare in posa 15-20 minuti.",
        avvertenze: "Non usare in presenza di ferite o irritazioni.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        // Protocollo combinato Exobio Plus + ADRN Plus: non è una scheda tecnica
        // a sé stante, ma l'uso sinergico dei due biorivitalizzanti già presenti
        // sopra (esosomi rigeneranti + bio-costruttore dermico a base di DNA).
        id: "exobio-adrn-plus",
        nome: "Exobio + ADRN Plus",
        categoria: ["biorivitalizzanti"],
        quantita: "Box 8x5ml Exobio Plus + Box 8x5ml ADRN Plus",
        principiAttivi: "Esosomi (Exo-Vitalize), proteine di soia idrolizzate, complesso vitalizzante + DNA sodico (polinucleotidi marini), acido ialuronico multi-peso molecolare, vitamina C, DMAE, Centella asiatica",
        funzione: "Combina la rigenerazione cellulare di Exobio Plus con l'azione bio-costruttrice di ADRN Plus per un effetto rivitalizzante e riparatore completo.",
        descrizione: "Protocollo sinergico che unisce l'effetto rigenerante degli esosomi di Exobio Plus al bio-costruttore dermico di ADRN Plus, per un risultato più completo su rigenerazione, tono e idratazione.",
        indicazioni: "Pelle spenta e priva di energia con concomitante perdita di tono o pelle matura: indicato quando è utile agire sia sulla rivitalizzazione sia sulla ricostruzione della matrice dermica.",
        modalitaUtilizzo: "Uso professionale topico su viso, applicando in sequenza i due prodotti con dermapen/hydrapen/dermo-veicolatore, secondo protocollo abbinato.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "",
        videoUrl: ""
    },
    {
        // Contenuti tratti dal Catalogo InLab Medical ufficiale (sezione
        // "Accessori complementari").
        id: "dr-pen-ultima-a6",
        nome: "Dr. Pen Ultima A6",
        categoria: ["accessori-complementari"],
        quantita: "Manipolo + cartucce di aghi intercambiabili, con custodia",
        principiAttivi: "Dispositivo professionale per microneedling (non un attivo cosmetico)",
        funzione: "Strumento professionale per microneedling, ideale per il miglioramento della texture cutanea.",
        descrizione: "Dotato di velocità regolabili e profondità degli aghi personalizzabile, consente trattamenti mirati su diverse aree del viso e del corpo.",
        indicazioni: "Texture cutanea irregolare; trattamenti di dermo-veicolazione mirati su viso e corpo, in abbinamento agli attivi InLab.",
        modalitaUtilizzo: "Regolare velocità e profondità degli aghi in base all'area trattata e al protocollo scelto; utilizzare con cartucce sterili monouso.",
        avvertenze: "Consultare le istruzioni ufficiali del dispositivo prima dell'uso. Utilizzare esclusivamente cartucce sterili monouso.",
        pdfUrl: "",
        videoUrl: ""
    }
].map(product => ({
    ...product,
    name: product.nome,
    category: product.categoria,
    description: product.descrizione,
    image: `assets/img/products/professional/${product.id}.jpg`,
    pdfUrl: product.pdfUrl || "",
    videoUrl: product.videoUrl || ""
}));

// -------------------------------------------------------------------------
// HOME CARE — PRODOTTI DA RIVENDITA
// Dati tratti dalle schede tecniche ufficiali InLab (FIDEST).
// Organizzati per le due linee del protocollo (Esosomi / DNA di Salmone),
// ciascun prodotto appartiene anche alla propria tipologia (sieri/creme/
// contorno occhi) tramite l'array "categoria".
// -------------------------------------------------------------------------
const retailProducts = [
    {
        id: "exobio-facial-cream",
        nome: "Exobio Facial Cream",
        categoria: ["esosomi", "creme"],
        quantita: "50ml",
        funzione: "Trattamento antietà completo: attenua le rughe e dona un aspetto più tonico e levigato.",
        principiAttivi: "5% Exo-Vitalize, 2% Niacinamide, Vitamina E",
        pianoAbbinato: "Piano Luminosità, Piano Skin Longevity",
        modalitaUso: "Applicare mattina e/o sera su viso deterso.",
        routine: "mattina-sera",
        prodottoComplementare: "Exobio Facial Serum",
        pdfUrl: ""
    },
    {
        id: "exobio-eye-contour",
        nome: "Exobio Eye Contour",
        categoria: ["esosomi", "contorno-occhi"],
        quantita: "20ml",
        funzione: "Riduce gonfiore, attenua occhiaie e favorisce la rigenerazione cellulare del contorno occhi.",
        principiAttivi: "5% Exo-Vitalize, 2% Niacinamide, 1,5% Caffeina, Biophytonic",
        pianoAbbinato: "Piano Luminosità, Piano Pelle Matura",
        modalitaUso: "Applicare mattina e sera sul contorno occhi deterso.",
        routine: "mattina-sera",
        prodottoComplementare: "Exobio Facial Cream",
        pdfUrl: ""
    },
    {
        id: "exobio-facial-serum",
        nome: "Exobio Facial Serum",
        categoria: ["esosomi", "sieri"],
        quantita: "30ml",
        funzione: "Ringiovanisce e idrata intensamente, stimolando la rigenerazione cellulare.",
        principiAttivi: "7% Exo-Vitalize, 5% Centella asiatica, 2% Niacinamide, Vitamina E",
        pianoAbbinato: "Piano Uniformità e Depigmentazione, Piano Rigenerazione Post-Acne",
        modalitaUso: "Applicare mattina e/o sera prima della crema.",
        routine: "mattina-sera",
        prodottoComplementare: "Exobio Facial Cream",
        pdfUrl: ""
    },
    {
        id: "adrn-pro-facial-cream",
        nome: "ADRN Pro Facial Cream",
        categoria: ["dna-salmone", "creme"],
        quantita: "50ml",
        funzione: "Rivitalizza, idrata e migliora l'elasticità cutanea grazie al PDRN (DNA di salmone).",
        principiAttivi: "DNA di sodio 0,05%, Niacinamide 2%, Estratto di Dunaliella Salina 1,5%, Olio di mandorle dolci",
        pianoAbbinato: "Piano Tono e Compattezza, Piano Pelle Matura",
        modalitaUso: "Applicare mattina e/o sera su viso deterso.",
        routine: "mattina-sera",
        prodottoComplementare: "ADRN Pro Facial Serum",
        pdfUrl: ""
    },
    {
        id: "adrn-pro-eye-contour",
        nome: "ADRN Pro Eye Contour",
        categoria: ["dna-salmone", "contorno-occhi"],
        quantita: "20ml",
        funzione: "Rigenera, illumina e protegge la pelle del contorno occhi con PDRN e niacinamide.",
        principiAttivi: "DNA di sodio, Niacinamide, Estratto di Dunaliella Salina, Squalano, Olio di Inca Inchi",
        pianoAbbinato: "Piano Pelle Matura",
        modalitaUso: "Applicare mattina e sera sul contorno occhi.",
        routine: "mattina-sera",
        prodottoComplementare: "ADRN Pro Facial Cream",
        pdfUrl: ""
    },
    {
        id: "adrn-pro-facial-serum",
        nome: "ADRN Pro Facial Serum",
        categoria: ["dna-salmone", "sieri"],
        quantita: "30ml",
        funzione: "Siero rigenerante e antiossidante ad alta efficacia con PDRN di salmone.",
        principiAttivi: "DNA di sodio (PDRN), Niacinamide, Estratto di Dunaliella Salina, Glicerina",
        pianoAbbinato: "Piano Anti-Fotoinvecchiamento",
        modalitaUso: "Applicare mattina e/o sera prima della crema.",
        routine: "mattina-sera",
        prodottoComplementare: "ADRN Pro Facial Cream",
        pdfUrl: ""
    }
].map(product => ({
    ...product,
    name: product.nome,
    line: product.categoria[0],
    type: product.categoria[1],
    description: product.funzione,
    image: `assets/img/products/retail/${product.id}.jpg`,
    pdfUrl: product.pdfUrl || ""
}));

// -------------------------------------------------------------------------
// RISULTATI — CONTENUTO DA COMPLETARE
// Struttura predisposta, in attesa di foto, dati e testimonianze reali.
// -------------------------------------------------------------------------
const caseStudies = [
    {
        id: "caso-adriana",
        nome: "Adriana",
        fotoPrima: "assets/img/case-studies/adriana-prima-optimized.jpg",
        fotoDopo: "assets/img/case-studies/adriana-dopo-optimized.jpg",
        problematicaIniziale: "Inizialmente la paziente presentava un crono e foto-invecchiamento visibile, con rughe, discromie cutanee e imperfezioni legate all'età e alle abitudini quotidiane. Fin dai primi trattamenti si è registrato un incremento della luminosità e della compattezza della texture cutanea",
        durata: "6 trattamenti in 2 mesi mezzo",
        pianoEffettuato: "Con lei abbiamo realizzato un programma iniziale di 6 trattamenti seguendo il Piano Antiageing Pelle Matura del Protocollo Pelle Sana: 2 sedute di preparazione con acidi cosmetici a cadenza settimanale più 4 sedute di biorivitalizzanti con gli esosomi ogni 21 giorni. Le foto sono state scattate al temine di questa prima fase. Successivamente ha proseguito con il ciclo ricostituente di mantenimento",
        attivi: "Antiaging Peeling Plus, Exobio Plus",
        tecnologie: "Micro-needling con Dermapen per la veicolazione degli attivi nei trattamenti biorivtalizzanti",
        homeCare: "Crema, siero e contorno occhi EXOBIO",
        osservazioni: "Nel corso delle sedute la pelle ha mostrato una risposta progressiva e costante: texture più levigata, incarnato più uniforme e luminoso, maggiore compattezza percepita su guance, zigomi e contorno occhi. Il miglioramento della qualità cutanea è risultato coerente con la costanza mantenuta nle seguire il piano di trattamento professionale e domiciliare.",
        testimonianza: "Sapevo che la mia pelle era segnata da rughe, macchie e imperfezioni dovute all’età e allo stile di vita. Ho iniziato questo percorso senza troppe aspettative, ma già dalle prime sedute la pelle è diventata più liscia e luminosa. Con il tempo, il cambiamento è stato evidente anche a chi mi sta vicino. La svolta vera, però, è interiore: oggi allo specchio non cerco più i segni del tempo, ma vedo un viso sano. Il trattamento non è stato impegnativo in termini di tempo e, seduta dopo seduta, posso dire che ne è valsa davvero la pena. Per questo ho scelto di proseguire con le sedute mensili di mantenimento, che continuano a preservare la salute e la bellezza della mia pelle."
    },
    {
        id: "caso-francesca",
        nome: "Francesca",
        fotoPrima: "assets/img/case-studies/francesca-prima-optimized.jpg",
        fotoDopo: "assets/img/case-studies/francesca-dopo-optimized.jpg",
        problematicaIniziale: "Il viso della cliente mostrava i classici segni di stanchezza e invecchiamento cutaneo precoce. Si evidenziava un incarnato opaco e disomogeneo, caratterizzato da discromie diffuse e da un'iperpigmentazione marcata nella zona perioculare. Strutturalmente, si riscontravano i primi segnali di lassità cutanea con una iniziale perdita di definizione dell'ovale facciale.",
        durata: "8 settimane",
        pianoEffettuato: "Il protocollo personalizzato ha mirato al ripristino della luminosità, dell'uniformità del tono e al rimodellamento dei contorni del viso utilizzando una formula mista tra il Piano Depigmentante e quello Lifting del Protocollo Pelle Sana: 1 seduta iniziale di acido esfoliante più 4 sedute di biorivitalizzanti a cadenza di 21 giorni con esosomi e dna di salmone.",
        attivi: "Depigmenting Peeling Plus, Exobio Plus, Adrn Plus",
        tecnologie: "Micro-needling con Dermapen per la veicolazione degli attivi nei trattamenti biorivtalizzanti",
        homeCare: "Crema, siero e contorno occhi linea ADRN PLUS",
        osservazioni: "Seduta dopo seduta l'incarnato è apparso progressivamente più uniforme e luminoso, con una visibile riduzione dell'aspetto stanco nella zona perioculare. La pelle ha mostrato una texture più levigata e un miglioramento del tono complessivo, con un ovale rimpolpato ed un aspetto più fresco e riposato.",
        testimonianza: "Non mi riconoscevo più quando mi guardavo allo specchio: la pelle mi sembrava sempre spenta, anche quando dormivo bene. Con questo percorso ho visto un cambiamento reale, non solo nelle foto ma ogni giorno: l'incarnato è più luminoso e uniforme, ha ripreso una sua forma e finalmente non ho più quell'aria stanca sotto gli occhi. Mi sento più a mio agio con la mia pelle."
    }
];

const CASE_STUDY_DISCLAIMER = "I risultati possono variare in base alle condizioni iniziali della pelle, alla risposta individuale e alla costanza nel seguire il percorso.";

// Registro documentale unico. Qualunque sezione mostri uno stesso documento
// lo richiama tramite id, così stato e collegamenti non possono divergere.
const DOCUMENTS = [
    { id: "procedure-acidi", title: "Procedura Acidi Cosmetici", category: "procedure", format: "PDF", description: "Procedura professionale collegata al video training Acidi Cosmetici.", status: "Aggiornato", version: "", updatedAt: "2026-07-29", validatedBy: "", fileUrl: "assets/documents/published/procedure-trattamento/procedura-acidi-cosmetici.pdf" },
    { id: "procedure-biorivitalizzazione", title: "Procedura Biorivitalizzazione Viso", category: "procedure", format: "PDF", description: "Procedura professionale collegata al video training Biorivitalizzazione Viso.", status: "Aggiornato", version: "", updatedAt: "2026-07-29", validatedBy: "", fileUrl: "assets/documents/published/procedure-trattamento/procedura-biorivitalizzazione-viso.pdf" },
    { id: "procedure-ricostituente", title: "Procedura Trattamento Viso Ricostituente", category: "procedure", format: "PDF", description: "Procedura professionale collegata al video training Trattamento Viso Ricostituente.", status: "Aggiornato", version: "", updatedAt: "2026-07-29", validatedBy: "", fileUrl: "assets/documents/published/procedure-trattamento/procedura-trattamento-viso-ricostituente.pdf" },
    { id: "procedure-exohair", title: "Procedura ExoHair Plus", category: "procedure", format: "PDF", description: "Procedura professionale collegata al video training ExoHair Plus.", status: "Aggiornato", version: "", updatedAt: "2026-07-29", validatedBy: "", fileUrl: "assets/documents/published/procedure-trattamento/procedura-exohair-plus.pdf" },
    { id: "brochure", title: "Brochure Protocollo Pelle Sana", category: "brochure", format: "PDF", description: "Brochure di presentazione del protocollo per le clienti.", status: "Non disponibile", version: "", updatedAt: "", validatedBy: "", fileUrl: "" },
    { id: "listino-professionale", title: "Listino prezzi professionale InLab Italia", category: "listini", format: "PDF", description: "Listino professionale InLab Italia con prodotti, formati e prezzi destinati agli operatori.", status: "Disponibile", version: "", updatedAt: "2026-07-30", validatedBy: "", fileUrl: "assets/docs/materiali/listino-prezzi-professionale.pdf" },
    { id: "modulo-consenso", title: "Modulo di consenso trattamento", category: "moduli", format: "PDF", description: "Modulo da personalizzare con i dati del centro e sottoporre a verifica privacy e legale prima dell’uso.", status: "Da validare", version: "", updatedAt: "2026-07-27", validatedBy: "", fileUrl: "assets/docs/materiali/modulo-consenso.pdf" },
    { id: "scheda-anamnesi", title: "Scheda Anamnesi Cliente", category: "schede-anamnesi", format: "PDF", description: "Scheda per la raccolta dei dati e la valutazione professionale della cliente.", status: "Da validare", version: "", updatedAt: "2026-07-27", validatedBy: "", fileUrl: "assets/docs/materiali/scheda-anamnesi-cliente.pdf" },
    { id: "locandina", title: "Locandina stampabile in cabina", category: "materiale-stampabile", format: "PDF", description: "Materiale da stampare ed esporre in cabina estetica.", status: "Non disponibile", version: "", updatedAt: "", validatedBy: "", fileUrl: "" },
    { id: "kit-social", title: "Kit visual social", category: "marketing", format: "ZIP", description: "Visual, Reel, caption e stories per i social.", status: "Non disponibile", version: "", updatedAt: "", validatedBy: "", fileUrl: "" },
    { id: "locandina-open-day", title: "Locandina Open Day", category: "marketing", format: "PDF", description: "Materiale stampabile per eventi Open Day in cabina.", status: "Non disponibile", version: "", updatedAt: "", validatedBy: "", fileUrl: "" },
    { id: "guida-anamnesi", title: "Guida alla raccolta anamnesi", category: "anamnesi", format: "PDF", description: "Come condurre un’anamnesi completa con la cliente.", status: "Non disponibile", version: "", updatedAt: "", validatedBy: "", fileUrl: "" }
];

const documentById = id => DOCUMENTS.find(documentItem => documentItem.id === id);

// -------------------------------------------------------------------------
// FORMAZIONE E RISORSE — 3 aree gestite da questo array (video introduttivi,
// materiali marketing, anamnesi). L'area "Video Training" ha una sorgente
// dati dedicata: vedi videoTrainingItems più sotto.
// PLACEHOLDER in attesa dei contenuti e link definitivi.
// -------------------------------------------------------------------------
const formazioneItems = [
    // A. Video introduttivi
    { id: "form-01", area: "introduttivi", tipo: "video", titolo: "Protocollo Pelle Sana: metodo, visione e microneedling", durata: "--:--", formato: "", descrizione: "Introduzione al progetto, alla filosofia e al ruolo del microneedling nel percorso professionale.", url: "" },
    { id: "form-02", area: "introduttivi", tipo: "video", titolo: "Acidi cosmetici: preparare la pelle al trattamento", durata: "--:--", formato: "", descrizione: "Funzione degli acidi cosmetici, criteri di utilizzo e ruolo nella fase preparatoria del protocollo.", url: "" },
    { id: "form-03", area: "introduttivi", tipo: "video", titolo: "Biorivitalizzanti: energia e rinnovamento cutaneo", durata: "--:--", formato: "", descrizione: "Spiegazione degli attivi biorivitalizzanti e del loro impiego.", url: "" },
    { id: "form-04", area: "introduttivi", tipo: "video", titolo: "Ricostituenti: sostegno, compattezza e rigenerazione", durata: "--:--", formato: "", descrizione: "Focus sugli attivi ricostituenti e sul loro ruolo nel miglioramento progressivo della struttura cutanea.", url: "" },
    { id: "form-05", area: "introduttivi", tipo: "video", titolo: "Piani di trattamento: dalla valutazione al percorso personalizzato", durata: "--:--", formato: "", descrizione: "Come leggere le problematiche della pelle, scegliere il protocollo più adatto e costruire una strategia di trattamento su misura.", url: "" },

    // B. Materiali marketing
    { id: "form-07", area: "marketing", tipo: "documento", documentId: "kit-social" },
    { id: "form-09", area: "marketing", tipo: "documento", documentId: "locandina-open-day" },

    // C. Anamnesi
    { id: "form-10", area: "anamnesi", tipo: "documento", documentId: "guida-anamnesi" }
];

// -------------------------------------------------------------------------
// VIDEO TRAINING — libreria video ufficiale del Protocollo Pelle Sana
// (canale YouTube Fidest Srls, visibilità "non in elenco"). Ogni video è
// definito una sola volta; downloadUrl resta vuoto finché non sarà
// disponibile il link diretto al file scaricabile.
// -------------------------------------------------------------------------
const videoTrainingItems = [
    {
        id: "video-training-01",
        title: "Acidi Cosmetici",
        description: "Panoramica operativa sull'utilizzo professionale degli acidi cosmetici.",
        category: "Video Training",
        youtubeUrl: "https://www.youtube-nocookie.com/embed/coxE8pImY-4",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
        procedureDocumentId: "procedure-acidi",
        coverImage: "assets/images/video-training/video-training-01.png",
        updatedAt: "2026-07-29"
    },
    {
        id: "video-training-02",
        title: "Biorivitalizzazione Viso",
        description: "Tecniche e indicazioni per i trattamenti biorivitalizzanti viso.",
        category: "Video Training",
        youtubeUrl: "https://www.youtube-nocookie.com/embed/Fs_qGJiIBK4",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
        procedureDocumentId: "procedure-biorivitalizzazione",
        coverImage: "assets/images/video-training/video-training-02.png",
        updatedAt: "2026-07-29"
    },
    {
        id: "video-training-03",
        title: "Trattamento Viso Ricostituente",
        description: "Sequenza operativa del trattamento professionale ricostituente.",
        category: "Video Training",
        youtubeUrl: "https://www.youtube-nocookie.com/embed/gw-HXZdVps0",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
        procedureDocumentId: "procedure-ricostituente",
        coverImage: "assets/images/video-training/video-training-03.png",
        updatedAt: "2026-07-29"
    },
    {
        id: "video-training-04",
        title: "Lip Volume & EyeCare",
        description: "Protocollo professionale dedicato alla zona labbra e contorno occhi.",
        category: "Video Training",
        youtubeUrl: "https://www.youtube-nocookie.com/embed/TwNs_nLP0uk",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
        procedureDocumentId: "",
        coverImage: "assets/images/video-training/video-training-04.png",
        updatedAt: "2026-07-29"
    },
    {
        id: "video-training-05",
        title: "ExoHair Plus",
        description: "Indicazioni operative per l'utilizzo professionale di ExoHair Plus.",
        category: "Video Training",
        youtubeUrl: "https://www.youtube-nocookie.com/embed/kJgfP5uzHUY",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
        procedureDocumentId: "procedure-exohair",
        coverImage: "assets/images/video-training/video-training-05.png",
        updatedAt: "2026-07-29"
    }
];

const FORMAZIONE_AREE = ["introduttivi", "training", "marketing", "anamnesi"];

// -------------------------------------------------------------------------
// LIBRERIA MATERIALI — solo le categorie ammesse: brochure, listini, moduli,
// schede anamnesi, materiale stampabile. PLACEHOLDER in attesa dei documenti
// definitivi.
// -------------------------------------------------------------------------
const resources = DOCUMENTS.filter(documentItem => ["brochure", "listini", "moduli", "schede-anamnesi", "materiale-stampabile"].includes(documentItem.category));


/* =========================================================================
   2. UTILITY
   ========================================================================= */

const qs = (sel, ctx) => (ctx || document).querySelector(sel);
const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

// Placeholder immagine inline (SVG), usato come fallback quando un'immagine
// reale non è ancora stata caricata nel progetto.
const PLACEHOLDER_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
    '<rect width="400" height="300" fill="#f7f2ee"/>' +
    '<text x="50%" y="50%" font-family="Open Sans, sans-serif" font-size="18" fill="#213f5e" text-anchor="middle" dominant-baseline="middle">In arrivo</text>' +
    '</svg>'
);

// Restituisce il markup di un'immagine con fallback automatico
function imgTag(src, alt, cls) {
    const safeAlt = alt || "";
    const classAttr = cls ? ` class="${cls}"` : "";
    return `<img src="${src}" alt="${safeAlt}"${classAttr} loading="lazy" data-fallback-image>`;
}

function initImageFallbacks() {
    document.addEventListener("error", event => {
        const image = event.target;
        if (!(image instanceof HTMLImageElement)) return;
        if (image.matches("[data-fallback-image]") && image.src !== PLACEHOLDER_IMG) {
            image.src = PLACEHOLDER_IMG;
        }
        if (image.matches("[data-brand-logo]")) {
            image.hidden = true;
            const fallback = image.nextElementSibling;
            if (fallback) fallback.hidden = false;
        }
        if (image.matches("[data-hero-poster]")) {
            image.closest(".video-hero__media")?.classList.add("is-fallback");
        }
    }, true);
}

function labelFor(slug) {
    return CATEGORY_LABELS[slug] || slug;
}

function statusClass(status) {
    return {
        "Disponibile": "available",
        "Aggiornato": "updated",
        "In revisione": "review",
        "Da validare": "validate",
        "Non disponibile": "unavailable"
    }[status] || "unavailable";
}

function formatDocumentDate(value) {
    if (!value) return "";
    const parts = value.split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
}

function documentMetaHtml(documentItem) {
    if (!documentItem) return "";
    const details = [
        documentItem.version ? `Versione ${documentItem.version}` : "",
        documentItem.updatedAt ? `Aggiornato il ${formatDocumentDate(documentItem.updatedAt)}` : "",
        documentItem.validatedBy ? `Validato da ${documentItem.validatedBy}` : ""
    ].filter(Boolean);
    return `
        <div class="document-meta">
            <span class="document-status document-status--${statusClass(documentItem.status)}">${documentItem.status}</span>
            ${details.length ? `<span>${details.join(" · ")}</span>` : ""}
        </div>
        ${documentItem.status === "Da validare" ? `<p class="document-note">Documento non ancora destinato all’uso operativo.</p>` : ""}
    `;
}

function documentActionsHtml(documentItem, buttonClass = "btn--ghost") {
    if (!documentItem?.fileUrl) return "";
    if (documentItem.status === "In revisione" && !documentItem.allowPreview) return "";
    return `
        <a class="btn ${buttonClass} btn--small" href="${documentItem.fileUrl}" target="_blank" rel="noopener noreferrer">Apri</a>
        <a class="btn ${buttonClass} btn--small" href="${documentItem.fileUrl}" download>Scarica</a>
    `;
}

function activeColorClass(category) {
    return category ? ` active-color active-color--${category}` : "";
}

function activeCategoryForProduct(productOrId) {
    const id = typeof productOrId === "string" ? productOrId : productOrId?.id;
    return ACTIVE_COLOR_BY_PRODUCT_ID[id] || "";
}

function activeCategoryForCodeGroup(codeGroup) {
    return String(codeGroup)
        .split("/")
        .map(code => ACTIVE_COLOR_BY_CODE[code.trim()])
        .find(Boolean) || "";
}

function activeCategoryForName(name) {
    const normalized = String(name).toLowerCase().trim();
    const product = professionalProducts.find(item => item.nome.toLowerCase() === normalized);
    if (product) return activeCategoryForProduct(product);
    if (normalized.includes("antiaging peeling")) return "acidi-esfolianti";
    if (normalized.includes("depigmenting peeling")) return "acidi-esfolianti";
    if (normalized.includes("oily skin peeling")) return "acidi-esfolianti";
    if (normalized.includes("acido tranexamico") || normalized.includes("tranexamic acid")) return "acido-depigmentante";
    if (normalized.startsWith("biorivitalizzanti")) return "biorivitalizzanti";
    if (normalized.startsWith("acidi cosmetici")) return "acidi-esfolianti";
    return "";
}

function activeNamesHtml(names) {
    return String(names).split(",").map(name => {
        const cleanName = name.trim();
        return `<span class="active-name${activeColorClass(activeCategoryForName(cleanName))}">${cleanName}</span>`;
    }).join("");
}

function activeTagHtml(product) {
    const category = activeCategoryForProduct(product);
    const label = ACTIVE_COLOR_LABELS[category] || labelFor(product.categoria[0]);
    return `<span class="tag${activeColorClass(category)}">${label}</span>`;
}

// Collegamenti cliccabili tra sezioni (piani ↔ attivi professionali ↔ home
// care): riusati sia nelle liste sia nel modal generico. Ogni chip apre la
// scheda corrispondente nello stesso modal, senza aprirne uno nuovo.
function crossLinkChipsHtml(ids, list, attr) {
    if (!ids || !ids.length) return "";
    return ids.map(id => {
        const item = list.find(p => p.id === id);
        const category = item ? activeCategoryForProduct(item) : "";
        return item ? `<button type="button" class="tag tag--link${activeColorClass(category)}" data-${attr}="${id}">${item.nome}</button>` : "";
    }).join("");
}

function relatedPlanChipsHtml(productId, idsField) {
    const related = treatmentPlans.filter(p => (p[idsField] || []).includes(productId));
    return related.map(p => `<button type="button" class="tag tag--link" data-open-plan="${p.id}">${p.nome}</button>`).join("");
}

function relatedPlansHtml(productId, idsField) {
    const chips = relatedPlanChipsHtml(productId, idsField);
    if (!chips) return "";
    return `
        <div class="modal__related">
            <span class="modal__related-label">Utilizzato nei piani di trattamento</span>
            <div class="modal__related-chips">${chips}</div>
        </div>
    `;
}

function wireCrossLinks(scope) {
    qsa("[data-open-plan]", scope).forEach(el => el.addEventListener("click", (e) => {
        e.preventDefault();
        const plan = treatmentPlans.find(p => p.id === el.dataset.openPlan);
        if (plan) openModal(planDetailHtml(plan));
    }));
    qsa("[data-open-product]", scope).forEach(el => el.addEventListener("click", (e) => {
        e.preventDefault();
        const product = professionalProducts.find(p => p.id === el.dataset.openProduct);
        if (product) openModal(productDetailHtml(product));
    }));
    qsa("[data-open-retail]", scope).forEach(el => el.addEventListener("click", (e) => {
        e.preventDefault();
        const product = retailProducts.find(p => p.id === el.dataset.openRetail);
        if (product) openModal(retailDetailHtml(product));
    }));
}

// Costruisce una barra di filtri (pulsanti) dentro il container indicato
function buildFilterBar(container, categories, onFilter) {
    if (!container) return;
    const all = ["tutti"].concat(categories);
    container.innerHTML = all.map((cat, i) => {
        const label = cat === "tutti" ? "Tutti" : labelFor(cat);
        const active = i === 0 ? " is-active" : "";
        const colorCategory = cat === "acidi-cosmetici" ? "acidi-esfolianti" : (cat === "biorivitalizzanti" ? cat : "");
        return `<button type="button" class="filter-chip${active}${activeColorClass(colorCategory)}" data-filter="${cat}" aria-pressed="${i === 0}">${label}</button>`;
    }).join("");

    qsa(".filter-chip", container).forEach(btn => {
        btn.addEventListener("click", () => {
            qsa(".filter-chip", container).forEach(b => {
                b.classList.remove("is-active");
                b.setAttribute("aria-pressed", "false");
            });
            btn.classList.add("is-active");
            btn.setAttribute("aria-pressed", "true");
            onFilter(btn.dataset.filter);
        });
    });
}

// Generic modal (dialog) handling
function openModal(html, variant) {
    const dialog = qs("#detailModal");
    const body = qs("#modalBody");
    if (!dialog || !body) return;
    body.innerHTML = html;
    wireCrossLinks(body);
    dialog.classList.toggle("modal--video", variant === "video");
    document.body.classList.add("modal-open");
    if (typeof dialog.showModal === "function" && !dialog.open) {
        dialog.showModal();
    } else if (!dialog.open) {
        dialog.setAttribute("open", "open");
    }
}

function initModal() {
    const dialog = qs("#detailModal");
    const closeBtn = qs("#modalClose");
    const body = qs("#modalBody");
    if (!dialog) return;
    if (closeBtn) closeBtn.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
        const rect = dialog.getBoundingClientRect();
        const inDialog = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inDialog) dialog.close();
    });
    // Svuota il contenuto alla chiusura (pulsante, ESC o click fuori):
    // interrompe automaticamente qualsiasi video incorporato in riproduzione.
    dialog.addEventListener("close", () => {
        if (body) body.innerHTML = "";
        document.body.classList.remove("modal-open");
    });
}

function initHorizontalScrollControls() {
    qsa(".filter-scroll-wrapper").forEach(wrapper => {
        const track = qs(".filter-scroll-track", wrapper);
        if (!track || wrapper.querySelector(".scroll-control")) return;

        const previous = document.createElement("button");
        previous.type = "button";
        previous.className = "scroll-control scroll-control--previous";
        previous.setAttribute("aria-label", "Scorri verso sinistra");
        previous.textContent = "‹";

        const next = document.createElement("button");
        next.type = "button";
        next.className = "scroll-control scroll-control--next";
        next.setAttribute("aria-label", "Scorri verso destra");
        next.textContent = "›";

        wrapper.append(previous, next);

        const updateControls = () => {
            const hasOverflow = track.scrollWidth > track.clientWidth + 2;
            wrapper.classList.toggle("has-horizontal-overflow", hasOverflow);
            previous.disabled = !hasOverflow || track.scrollLeft <= 2;
            next.disabled = !hasOverflow || track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
        };

        const scrollByPage = direction => {
            track.scrollBy({ left: direction * Math.max(220, track.clientWidth * 0.72), behavior: "smooth" });
        };

        previous.addEventListener("click", () => scrollByPage(-1));
        next.addEventListener("click", () => scrollByPage(1));
        track.addEventListener("scroll", updateControls, { passive: true });
        track.addEventListener("wheel", event => {
            if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || track.scrollWidth <= track.clientWidth) return;
            const atStart = track.scrollLeft <= 2;
            const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
            if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return;
            event.preventDefault();
            track.scrollLeft += event.deltaY;
        }, { passive: false });

        new ResizeObserver(updateControls).observe(track);
        updateControls();
    });
}

function initInLabPartnerReveal() {
    const content = qs("[data-inlab-reveal]");
    if (!content) return;
    if (!("IntersectionObserver" in window)) {
        content.classList.add("is-visible");
        return;
    }
    const observer = new IntersectionObserver(entries => {
        if (!entries[0]?.isIntersecting) return;
        content.classList.add("is-visible");
        observer.disconnect();
    }, { threshold: 0.18 });
    observer.observe(content);
}


/* =========================================================================
   3. NAVIGAZIONE + TORNA IN ALTO
   ========================================================================= */

function initNav() {
    const toggle = qs("#navToggle");
    const nav = qs("#siteNav");
    if (toggle && nav) {
        const closeNav = () => {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("nav-open");
        };

        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("nav-open", isOpen);
        });
        qsa("a", nav).forEach(a => a.addEventListener("click", () => {
            closeNav();
        }));
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && nav.classList.contains("is-open")) {
                closeNav();
                toggle.focus();
            }
        });

        const desktopNav = window.matchMedia("(min-width: 1151px)");
        desktopNav.addEventListener("change", event => {
            if (event.matches) closeNav();
        });
    }

    // Evidenzia la voce di menu attiva in base alla sezione visibile
    const sections = qsa("main section[id]");
    const links = qsa("#siteNav a[href^='#']");
    if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                links.forEach(link => {
                    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(sec => observer.observe(sec));
}

function initBackToTop() {
    const btn = qs("#backToTop");
    if (!btn) return;
    window.addEventListener("scroll", () => {
        btn.classList.toggle("is-visible", window.scrollY > 480);
    });
    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* =========================================================================
   4. TIMELINE "IL PROTOCOLLO"
   ========================================================================= */

function renderMetodoTimeline() {
    const container = qs("#metodoTimeline");
    if (!container) return;

    container.innerHTML = METODO_FASI.map(fase => `
        <li class="phases__item${fase.finale ? " phases__item--finale" : ""}">
            <span class="phases__marker" aria-hidden="true"></span>
            <div class="phases__content">
                <span class="phases__number">${fase.numero}</span>
                <h4 class="phases__name">${fase.nome}</h4>
                <p class="phases__sintesi">${fase.sintesi}</p>
                <p class="phases__dettaglio">${fase.dettaglio}</p>
                ${fase.piano ? phasePlanHtml(fase.piano) : ""}
            </div>
        </li>
    `).join("");

    initPhasesScrollReveal(container);
}

// Sotto-timeline di una fase, resa come semplice elenco tipografico (senza
// card): una riga per opzione, con un separatore testuale solo quando le
// opzioni sono alternative tra loro (vedi piano.separatore).
function phasePlanHtml(piano) {
    const optionsHtml = piano.opzioni.map((opzione, i) => `
        ${i > 0 && piano.separatore ? `<li class="phase-plan__divider" aria-hidden="true">${piano.separatore}</li>` : ""}
        <li class="phase-plan__option">
            <span class="phase-plan__option-name">${opzione.nome}</span>
            <span class="phase-plan__option-freq">${opzione.frequenza}</span>
        </li>
    `).join("");

    return `
        <div class="phase-plan">
            <span class="phase-plan__title">${piano.titolo}</span>
            ${piano.nota ? `<span class="phase-plan__note">${piano.nota}</span>` : ""}
            <ul class="phase-plan__options">
                ${optionsHtml}
            </ul>
            ${piano.chiusura ? `<p class="phase-plan__closing">${piano.chiusura}</p>` : ""}
        </div>
    `;
}

// Rivela le fasi con una leggera animazione all'ingresso durante lo scroll
function initPhasesScrollReveal(container) {
    const items = qsa(".phases__item", container);
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
        items.forEach(item => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: "0px 0px -80px 0px" });

    items.forEach(item => observer.observe(item));
}

// Card Filosofia/Metodo/Obiettivo: ogni bottone apre/chiude il proprio
// pannello in modo indipendente (nessun comportamento "solo uno aperto").
function initProtocolCards() {
    qsa(".protocol-card__trigger").forEach(trigger => {
        const card = trigger.closest(".protocol-card");
        const panel = qs(`#${trigger.getAttribute("aria-controls")}`);
        if (!card || !panel) return;

        trigger.addEventListener("click", () => {
            const isOpen = card.classList.toggle("is-open");
            trigger.setAttribute("aria-expanded", String(isOpen));
            panel.setAttribute("aria-hidden", String(!isOpen));
        });
    });
}


/* =========================================================================
   5. PIANI DI TRATTAMENTO (righe accordion + modal)
   ========================================================================= */

function planCodes(plan) {
    const codes = new Set();
    (plan.cicli || []).forEach(ciclo => ciclo.sedute.forEach(seduta => {
        seduta.attivi.forEach(group => group.split("/").forEach(code => codes.add(code.trim())));
    }));
    return [...codes].filter(code => TREATMENT_LEGEND[code]);
}

function initProtocolDiscovery() {
    qsa(".protocol-principle").forEach(item => {
        const summary = qs("summary", item);
        if (!summary) return;

        const syncExpandedState = () => {
            summary.setAttribute("aria-expanded", String(item.open));
        };

        syncExpandedState();
        item.addEventListener("toggle", syncExpandedState);
    });
}

function treatmentTimelineHtml(plan) {
    if (!plan.cicli.length) return `<p class="plan-source-note">${plan.note}</p>`;
    return plan.cicli.map((ciclo, cycleIndex) => `
        <section class="treatment-cycle" aria-labelledby="${plan.id}-cycle-${cycleIndex}">
            <div class="treatment-cycle__head">
                <span class="treatment-cycle__number">Ciclo ${cycleIndex + 1}</span>
                <h4 id="${plan.id}-cycle-${cycleIndex}">${ciclo.titolo}</h4>
                <p>${ciclo.periodo}</p>
            </div>
            <ol class="treatment-timeline">
                ${ciclo.sedute.map(seduta => `
                    <li class="treatment-timeline__item">
                        <span class="treatment-timeline__marker" aria-hidden="true"></span>
                        <div class="treatment-timeline__content">
                            <span class="treatment-timeline__session">${seduta.label}</span>
                            <span class="treatment-timeline__phase">${seduta.fase}</span>
                            <div class="treatment-timeline__badges">${seduta.attivi.map(code => `<span class="treatment-code${activeColorClass(activeCategoryForCodeGroup(code))}">${code}</span>`).join("")}</div>
                        </div>
                    </li>`).join("")}
            </ol>
        </section>`).join("");
}

function planLegendHtml(plan) {
    const codes = planCodes(plan);
    if (!codes.length) return "";
    return `<div class="treatment-legend"><h4>Legenda delle sigle</h4><dl>
        ${codes.map(code => `<div class="${activeColorClass(ACTIVE_COLOR_BY_CODE[code]).trim()}"><dt>${code}</dt><dd>${TREATMENT_LEGEND[code]}</dd></div>`).join("")}
    </dl></div>`;
}

function professionalProductsHtml(plan) {
    const codes = planCodes(plan);
    if (!codes.length) return "";
    return `<div class="treatment-products"><h4>Prodotti professionali</h4><div class="detail-list__chips">
        ${codes.map(code => {
            const id = TREATMENT_PRODUCT_IDS[code];
            return id ? `<button type="button" class="tag tag--link${activeColorClass(ACTIVE_COLOR_BY_CODE[code])}" data-open-product="${id}">${TREATMENT_LEGEND[code]}</button>` : "";
        }).join("")}
    </div></div>`;
}

function planDetailHtml(plan) {
    const homeCareHtml = plan.homeCareIds.length
        ? `<div class="treatment-homecare"><h4>Home Care</h4><div class="detail-list__chips">${crossLinkChipsHtml(plan.homeCareIds, retailProducts, "open-retail")}</div></div>`
        : "";
    return `
        <span class="tag">${labelFor(plan.categorie[0])}</span>
        <h3 class="modal__title">${plan.nome}</h3>
        <p class="modal__subtitle">${plan.durata}</p>
        <dl class="detail-list plan-overview">
            <div><dt>Obiettivo</dt><dd>${plan.obiettivo}</dd></div>
            <div><dt>Condizioni iniziali</dt><dd>${plan.condizioniIniziali}</dd></div>
        </dl>
        <div class="treatment-plan__timeline"><h4>Timeline del trattamento</h4>${treatmentTimelineHtml(plan)}</div>
        ${professionalProductsHtml(plan)}
        ${homeCareHtml}
        ${planLegendHtml(plan)}
        ${plan.cicli.length ? `<p class="plan-professional-note"><strong>Note professionali:</strong> ${plan.note}</p>` : ""}
    `;
}

function planRowHtml(plan) {
    const homeCareHtml = plan.homeCareIds.length
        ? `<div class="treatment-homecare"><h4>Home Care</h4><div class="detail-list__chips">${crossLinkChipsHtml(plan.homeCareIds, retailProducts, "open-retail")}</div></div>`
        : "";
    return `
        <details class="plan-row">
            <summary class="plan-row__summary" aria-label="Apri ${plan.nome}">
                <div class="plan-row__summary-main">
                    <span class="tag">${labelFor(plan.categorie[0])}</span>
                    <h3 class="plan-row__title">${plan.nome}</h3>
                    <p class="plan-row__objective">${plan.obiettivo}</p>
                </div>
                <dl class="plan-row__meta"><div><dt>Durata</dt><dd>${plan.durata}</dd></div></dl>
                <span class="plan-row__chevron" aria-hidden="true">⌄</span>
            </summary>
            <div class="plan-row__content">
                <dl class="detail-list plan-overview">
                    <div><dt>Obiettivo</dt><dd>${plan.obiettivo}</dd></div>
                    <div><dt>Condizioni iniziali</dt><dd>${plan.condizioniIniziali}</dd></div>
                </dl>
                <div class="treatment-plan__timeline"><h4>Timeline del trattamento</h4>${treatmentTimelineHtml(plan)}</div>
                ${professionalProductsHtml(plan)}
                ${homeCareHtml}
                ${planLegendHtml(plan)}
                ${plan.cicli.length ? `<p class="plan-professional-note"><strong>Note professionali:</strong> ${plan.note}</p>` : ""}
            </div>
        </details>`;
}
function renderTreatmentPlans(filter) {
    const list = qs("#piani-list");
    if (!list) return;
    const items = (!filter || filter === "tutti") ? treatmentPlans : treatmentPlans.filter(p => p.categorie.includes(filter));
    list.innerHTML = items.map(planRowHtml).join("") || `<p class="empty-state">Nessun piano trovato per questo filtro.</p>`;

    wireCrossLinks(list);
}

function initPianiSection() {
    const filters = qs("#piani-filters");
    buildFilterBar(filters, PIANI_CATEGORIES, (filter) => renderTreatmentPlans(filter));
    renderTreatmentPlans("tutti");
}


/* =========================================================================
   6. ATTIVI PROFESSIONALI (lista + modal)
   ========================================================================= */

function productRowHtml(product) {
    const imgPath = `assets/img/products/professional/${product.id}.jpg`;
    const category = activeCategoryForProduct(product);
    return `
        <article class="list-row${activeColorClass(category)}">
            ${imgTag(imgPath, product.nome, `list-row__thumb${activeColorClass(category)}`)}
            <div class="list-row__body">
                <h3 class="list-row__title">${product.nome}</h3>
                <p class="list-row__text">${product.funzione}</p>
                <p class="list-row__meta"><strong>Attivi:</strong> ${product.principiAttivi}</p>
            </div>
            <div class="list-row__side">
                ${activeTagHtml(product)}
                <button type="button" class="btn btn--ghost btn--small" data-product-id="${product.id}">Apri scheda</button>
            </div>
        </article>
    `;
}

function productDetailHtml(product) {
    const imgPath = `assets/img/products/professional/${product.id}.jpg`;
    const category = activeCategoryForProduct(product);
    const actions = [];
    if (product.pdfUrl) {
        actions.push(
            `<a class="btn btn--ghost btn--small" href="${product.pdfUrl}" target="_blank" rel="noopener noreferrer" aria-label="Visualizza la scheda tecnica di ${product.nome}">Visualizza scheda tecnica</a>`,
            `<a class="btn btn--ghost btn--small" href="${product.pdfUrl}" download aria-label="Scarica la scheda tecnica di ${product.nome}">Scarica scheda tecnica</a>`
        );
    }
    if (product.videoUrl) {
        actions.push(
            `<a class="btn btn--ghost btn--small" href="${product.videoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Guarda il video tecnico di ${product.nome}">Video tecnico</a>`
        );
    }
    const actionsHtml = actions.length
        ? `<div class="modal__actions">${actions.join("")}</div>`
        : "";

    return `
        ${imgTag(imgPath, product.nome, `modal__img${activeColorClass(category)}`)}
        ${activeTagHtml(product)}
        <h3 class="modal__title">${product.nome}</h3>
        <p class="modal__subtitle">${product.quantita}</p>
        <dl class="detail-list">
            <div><dt>Descrizione</dt><dd>${product.descrizione}</dd></div>
            <div><dt>Attivi principali</dt><dd>${product.principiAttivi}</dd></div>
            <div><dt>Funzione</dt><dd>${product.funzione}</dd></div>
            <div><dt>Indicazioni</dt><dd>${product.indicazioni}</dd></div>
            <div><dt>Modalità di utilizzo</dt><dd>${product.modalitaUtilizzo}</dd></div>
            <div><dt>Avvertenze</dt><dd>${product.avvertenze}</dd></div>
        </dl>
        ${relatedPlansHtml(product.id, "attiviIds")}
        ${actionsHtml}
    `;
}

function renderProfessionalProducts(filter) {
    const list = qs("#schede-list");
    if (!list) return;
    const items = (!filter || filter === "tutti") ? professionalProducts : professionalProducts.filter(p => p.categoria.includes(filter));
    list.innerHTML = items.map(productRowHtml).join("") || `<p class="empty-state">Nessun prodotto trovato per questo filtro.</p>`;

    qsa("[data-product-id]", list).forEach(btn => {
        btn.addEventListener("click", () => {
            const product = professionalProducts.find(p => p.id === btn.dataset.productId);
            if (product) openModal(productDetailHtml(product));
        });
    });
}

function initSchedeTecnicheSection() {
    const filters = qs("#schede-filters");
    buildFilterBar(filters, SCHEDE_CATEGORIES, (filter) => renderProfessionalProducts(filter));
    renderProfessionalProducts("tutti");
}


/* =========================================================================
   7. HOME CARE (lista + modal)
   ========================================================================= */

function retailRowHtml(product) {
    const imgPath = `assets/img/products/retail/${product.id}.jpg`;
    return `
        <article class="list-row">
            ${imgTag(imgPath, product.nome, "list-row__thumb")}
            <div class="list-row__body">
                <h3 class="list-row__title">${product.nome}</h3>
                <p class="list-row__text">${product.funzione}</p>
                <p class="list-row__meta"><strong>Attivi:</strong> ${product.principiAttivi}</p>
            </div>
            <div class="list-row__side">
                <span class="tag">${labelFor(product.categoria[0])}</span>
                <button type="button" class="btn btn--ghost btn--small" data-retail-id="${product.id}">Apri scheda</button>
            </div>
        </article>
    `;
}

function retailDetailHtml(product) {
    const imgPath = `assets/img/products/retail/${product.id}.jpg`;
    const pdfActionsHtml = product.pdfUrl
        ? `<div class="modal__actions">
            <a class="btn btn--ghost btn--small" href="${product.pdfUrl}" target="_blank" rel="noopener noreferrer" aria-label="Visualizza la scheda prodotto di ${product.nome}">Visualizza scheda prodotto</a>
            <a class="btn btn--ghost btn--small" href="${product.pdfUrl}" download aria-label="Scarica la scheda prodotto ${product.nome}">Scarica scheda prodotto</a>
        </div>`
        : "";

    return `
        ${imgTag(imgPath, product.nome, "modal__img")}
        <span class="tag">${labelFor(product.categoria[0])}</span>
        <h3 class="modal__title">${product.nome}</h3>
        <p class="modal__subtitle">${product.quantita}</p>
        <dl class="detail-list">
            <div><dt>Funzione</dt><dd>${product.funzione}</dd></div>
            <div><dt>Principi attivi</dt><dd>${product.principiAttivi}</dd></div>
            <div><dt>Piano abbinato</dt><dd class="detail-list__chips">${relatedPlanChipsHtml(product.id, "homeCareIds") || product.pianoAbbinato}</dd></div>
            <div><dt>Modalità d'uso</dt><dd>${product.modalitaUso}</dd></div>
            <div><dt>Routine</dt><dd>${product.routine === "mattina-sera" ? "Mattina e sera" : product.routine}</dd></div>
            <div><dt>Prodotto complementare</dt><dd>${product.prodottoComplementare}</dd></div>
        </dl>
        ${pdfActionsHtml}
    `;
}

function renderRetailProducts(filter) {
    const list = qs("#homecare-list");
    if (!list) return;
    const items = (!filter || filter === "tutti") ? retailProducts : retailProducts.filter(p => p.categoria.includes(filter));
    list.innerHTML = items.map(retailRowHtml).join("") || `<p class="empty-state">Nessun prodotto trovato per questo filtro. Categoria in fase di completamento.</p>`;

    qsa("[data-retail-id]", list).forEach(btn => {
        btn.addEventListener("click", () => {
            const product = retailProducts.find(p => p.id === btn.dataset.retailId);
            if (product) openModal(retailDetailHtml(product));
        });
    });
}

function initHomeCareSection() {
    const filters = qs("#homecare-filters");
    const categories = ["esosomi", "dna-salmone", "creme", "contorno-occhi", "sieri"];
    buildFilterBar(filters, categories, (filter) => renderRetailProducts(filter));
    renderRetailProducts("tutti");
}


/* =========================================================================
   8. RISULTATI (split prima/dopo)
   ========================================================================= */

function caseSplitHtml(caseStudy) {
    return `
        <article class="case-split">
            <div class="ba-slider" data-case-id="${caseStudy.id}">
                <div class="ba-slider__after">${imgTag(caseStudy.fotoDopo, `${caseStudy.nome} — dopo`, "ba-slider__img")}</div>
                <div class="ba-slider__before">${imgTag(caseStudy.fotoPrima, `${caseStudy.nome} — prima`, "ba-slider__img")}</div>
                <span class="ba-slider__label ba-slider__label--before">Prima</span>
                <span class="ba-slider__label ba-slider__label--after">Dopo</span>
                <input type="range" min="0" max="100" value="50" class="ba-slider__range" aria-label="Confronta prima e dopo — ${caseStudy.nome}">
            </div>
            <div class="case-split__body">
                <h3 class="case-split__name">${caseStudy.nome}</h3>
                <p class="case-split__row"><strong>Problematica:</strong> ${caseStudy.problematicaIniziale}</p>
                <p class="case-split__row"><strong>Durata percorso:</strong> ${caseStudy.durata}</p>
                <p class="case-split__row"><strong>Piano effettuato:</strong> ${caseStudy.pianoEffettuato}</p>
                <p class="case-split__row case-split__row--actives"><strong>Attivi:</strong> <span class="active-name-list">${activeNamesHtml(caseStudy.attivi)}</span></p>
                <p class="case-split__row"><strong>Tecnologie:</strong> ${caseStudy.tecnologie}</p>
                <p class="case-split__row"><strong>Home care:</strong> ${caseStudy.homeCare}</p>
                <p class="case-split__row"><strong>Osservazioni:</strong> ${caseStudy.osservazioni}</p>
                <blockquote class="case-testimonial">${caseStudy.testimonianza}</blockquote>
            </div>
        </article>
    `;
}

function renderCaseStudies() {
    const list = qs("#casi-list");
    if (!list) return;
    list.innerHTML = caseStudies.map(caseSplitHtml).join("");
    initBeforeAfterSliders();
}

function initBeforeAfterSliders() {
    qsa(".ba-slider").forEach(slider => {
        const range = qs(".ba-slider__range", slider);
        if (!range) return;
        const updateSplit = () => slider.style.setProperty("--split", `${range.value}%`);
        range.addEventListener("input", updateSplit);
        updateSplit();
    });
}

function initMobileCaseCards() {
    const mobileQuery = window.matchMedia("(max-width: 720px)");
    qsa(".case-split").forEach(card => {
        const trigger = qs(".case-split__body", card);
        if (!trigger) return;
        let pointerStartX = 0;

        const syncAccessibility = () => {
            if (mobileQuery.matches) {
                trigger.tabIndex = 0;
                trigger.setAttribute("role", "button");
                trigger.setAttribute("aria-expanded", String(card.classList.contains("is-mobile-open")));
            } else {
                trigger.removeAttribute("tabindex");
                trigger.removeAttribute("role");
                trigger.removeAttribute("aria-expanded");
                card.classList.remove("is-mobile-open");
            }
        };

        const toggleCard = () => {
            if (!mobileQuery.matches) return;
            card.classList.toggle("is-mobile-open");
            trigger.setAttribute("aria-expanded", String(card.classList.contains("is-mobile-open")));
        };

        trigger.addEventListener("pointerdown", event => {
            pointerStartX = event.clientX;
        });
        trigger.addEventListener("click", event => {
            if (event.target.closest("input, button, a")) return;
            if (Math.abs(event.clientX - pointerStartX) > 8) return;
            toggleCard();
        });
        trigger.addEventListener("keydown", event => {
            if (event.target !== trigger || (event.key !== "Enter" && event.key !== " ")) return;
            event.preventDefault();
            toggleCard();
        });
        mobileQuery.addEventListener?.("change", syncAccessibility);
        syncAccessibility();
    });
}

function initHeroMobilePlayback() {
    const video = qs("#heroVideo");
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.controls = false;
    video.preload = "auto";
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.removeAttribute("controls");

    const tryPlayback = () => {
        const playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
            playAttempt.catch(() => {});
        }
    };

    video.addEventListener("loadedmetadata", tryPlayback);
    video.addEventListener("canplay", tryPlayback, { once: true });
    video.addEventListener("ended", () => {
        video.currentTime = 0;
        tryPlayback();
    });
    video.addEventListener("pause", () => {
        if (!document.hidden && video.ended) tryPlayback();
    });
    window.addEventListener("pageshow", tryPlayback);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) tryPlayback();
    });
    document.addEventListener("touchstart", tryPlayback, { once: true, passive: true });
    tryPlayback();
}


/* =========================================================================
   9. FORMAZIONE E RISORSE (tab + liste)
   ========================================================================= */

function formazioneRowHtml(item) {
    const linkedDocument = item.documentId ? documentById(item.documentId) : null;
    const title = linkedDocument?.title || item.titolo;
    const description = linkedDocument?.description || item.descrizione;
    const format = linkedDocument?.format || item.formato;
    const category = activeCategoryForName(title);
    const metaParts = [];
    if (item.durata) metaParts.push(item.durata);
    if (format) metaParts.push(format);
    const metaLine = metaParts.length ? metaParts.join(" · ") : (item.tipo === "video" ? "Video" : "Documento");

    return `
        <article class="list-row${activeColorClass(category)}">
            <div class="list-row__body">
                <h3 class="list-row__title">${title}</h3>
                <p class="list-row__text">${description}</p>
                <p class="list-row__meta">${metaLine}</p>
                ${documentMetaHtml(linkedDocument)}
            </div>
            <div class="list-row__actions">
                ${linkedDocument ? documentActionsHtml(linkedDocument) : (item.url
                    ? `<a class="btn btn--ghost btn--small" href="${item.url}" target="_blank" rel="noopener noreferrer">${item.tipo === "video" ? "Guarda" : "Apri"}</a>`
                    : `<button type="button" class="btn btn--ghost btn--small" disabled>In arrivo</button>`)}
            </div>
        </article>
    `;
}

function videoTrainingItemHtml(item) {
    const procedureDocument = documentById(item.procedureDocumentId);
    return `
        <article class="video-editorial__item">
            <button type="button" class="video-editorial__cover" data-video-id="${item.id}" aria-label="Guarda il video: ${item.title}">
                <img src="${item.coverImage}" alt="Copertina del video ${item.title} — Protocollo Pelle Sana" loading="lazy">
                <span class="video-editorial__play" aria-hidden="true"></span>
            </button>
            <div class="video-editorial__body">
                <p class="video-editorial__eyebrow">${item.category}</p>
                <h3 class="video-editorial__title">${item.title}</h3>
                <p class="video-editorial__desc">${item.description}</p>
                ${documentMetaHtml(procedureDocument)}
                <div class="video-editorial__actions">
                    <button type="button" class="btn btn--primary btn--small" data-video-id="${item.id}">Guarda il video</button>
                    ${item.downloadUrl ? `<a class="btn btn--outline btn--small" href="${item.downloadUrl}" download>Scarica il video</a>` : ""}
                    ${documentActionsHtml(procedureDocument, "btn--outline")}
                </div>
            </div>
        </article>
    `;
}

function videoModalHtml(item) {
    const procedureDocument = documentById(item.procedureDocumentId);
    return `
        <div class="video-frame">
            <iframe
                src="${item.youtubeUrl}?autoplay=1&rel=0"
                title="${item.title}"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
            ></iframe>
        </div>
        <h3 class="modal__title">${item.title}</h3>
        <p class="modal__subtitle">${item.category}</p>
        <p class="list-row__text">${item.description}</p>
        ${(item.downloadUrl || procedureDocument?.fileUrl) ? `<div class="modal__actions">
            ${item.downloadUrl ? `<a class="btn btn--ghost btn--small" href="${item.downloadUrl}" download>Scarica il video</a>` : ""}
            ${documentActionsHtml(procedureDocument)}
        </div>` : ""}
    `;
}

function externalContentPlaceholderHtml(item) {
    return `
        <div class="external-content-placeholder">
            <p class="eyebrow">Contenuto esterno</p>
            <h3 class="modal__title">${item.title}</h3>
            <p>Per visualizzare il video è necessario autorizzare i contenuti esterni.</p>
            <button type="button" class="btn btn--primary" data-authorize-video="${item.id}">Autorizza e guarda il video</button>
        </div>
    `;
}

function openTrainingVideo(item) {
    const hasConsent = window.PPSConsent?.hasExternalContent();
    openModal(hasConsent ? videoModalHtml(item) : externalContentPlaceholderHtml(item), "video");
    if (hasConsent) return;
    const authorizeButton = qs(`[data-authorize-video="${item.id}"]`, qs("#modalBody"));
    authorizeButton?.addEventListener("click", () => {
        window.PPSConsent?.save(true);
        openModal(videoModalHtml(item), "video");
    });
}

function renderVideoTraining(list) {
    list.innerHTML = videoTrainingItems.map(videoTrainingItemHtml).join("") || `<p class="empty-state">Contenuti in arrivo per quest'area.</p>`;

    qsa("[data-video-id]", list).forEach(el => {
        el.addEventListener("click", () => {
            const item = videoTrainingItems.find(v => v.id === el.dataset.videoId);
            if (item) openTrainingVideo(item);
        });
    });
}

function renderFormazione(area) {
    const list = qs("#formazione-list");
    if (!list) return;

    if (area === "training") {
        list.className = "video-editorial";
        renderVideoTraining(list);
        return;
    }

    list.className = "list";
    const items = formazioneItems.filter(f => f.area === area);
    list.innerHTML = items.map(formazioneRowHtml).join("") || `<p class="empty-state">Contenuti in arrivo per quest'area.</p>`;
}

function initFormazioneSection() {
    const tabsBar = qs("#formazione-tabs");
    if (!tabsBar) return;

    tabsBar.innerHTML = FORMAZIONE_AREE.map((area, i) => `
        <button type="button" class="tab-btn${i === 0 ? " is-active" : ""}" data-tab="${area}" aria-pressed="${i === 0}">${labelFor(area)}</button>
    `).join("");

    qsa(".tab-btn", tabsBar).forEach(btn => {
        btn.addEventListener("click", () => {
            qsa(".tab-btn", tabsBar).forEach(b => {
                b.classList.remove("is-active");
                b.setAttribute("aria-pressed", "false");
            });
            btn.classList.add("is-active");
            btn.setAttribute("aria-pressed", "true");
            renderFormazione(btn.dataset.tab);
        });
    });

    renderFormazione(FORMAZIONE_AREE[0]);
}


/* =========================================================================
   10. LIBRERIA MATERIALI (lista + filtri)
   ========================================================================= */

function resourceRowHtml(resource) {
    return `
        <article class="list-row">
            <div class="list-row__body">
                <h3 class="list-row__title">${resource.title}</h3>
                <p class="list-row__text">${resource.description}</p>
                <p class="list-row__meta">${resource.format}</p>
                ${documentMetaHtml(resource)}
            </div>
            <div class="list-row__side">
                <span class="tag">${labelFor(resource.category)}</span>
                <div class="list-row__actions">
                    ${documentActionsHtml(resource)}
                </div>
            </div>
        </article>
    `;
}

function renderResources(filter) {
    const list = qs("#materiali-list");
    if (!list) return;
    const items = (!filter || filter === "tutti") ? resources : resources.filter(r => r.category === filter);
    list.innerHTML = items.map(resourceRowHtml).join("") || `<p class="empty-state">Nessun documento trovato per questo filtro.</p>`;
}

function initMaterialiSection() {
    const filters = qs("#materiali-filters");
    const categories = ["brochure", "listini", "moduli", "schede-anamnesi", "materiale-stampabile"];
    buildFilterBar(filters, categories, (filter) => renderResources(filter));
    renderResources("tutti");
}


/* =========================================================================
   11. INIT
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Anno corrente nel footer
    const yearEl = qs("#currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    initImageFallbacks();
    initModal();
    initNav();
    initBackToTop();
    initProtocolDiscovery();
    renderMetodoTimeline();
    initProtocolCards();
    initPianiSection();
    initSchedeTecnicheSection();
    initHomeCareSection();
    renderCaseStudies();
    initMobileCaseCards();
    initHeroMobilePlayback();
    initFormazioneSection();
    initMaterialiSection();
    initHorizontalScrollControls();
    initInLabPartnerReveal();

    window.addEventListener("pps:consent-changed", event => {
        if (event.detail?.externalContent) return;
        const modalBody = qs("#modalBody");
        if (modalBody?.querySelector("iframe")) qs("#detailModal")?.close();
    });
});
