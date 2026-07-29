/* =========================================================================
   PROTOCOLLO PELLE SANA — script.js
   FIDEST × InLab medical
   -------------------------------------------------------------------------
   Indice del file:
   1. DATI (array/oggetti — da aggiornare con i contenuti ufficiali)
   2. UTILITY
   3. NAVIGAZIONE (menu mobile, scroll attivo)
   4. TIMELINE "IL METODO"
   5. PIANI DI TRATTAMENTO (render, filtri, modal)
   6. PROTOCOL BUILDER
   7. SCHEDE TECNICHE — ATTIVI PROFESSIONALI (render, filtri, modal)
   8. HOME CARE (render, filtri) + ROUTINE BUILDER
   9. CASI STUDIO (render + slider prima/dopo)
   10. VIDEO E FORMAZIONE (render, filtri)
   11. MATERIALI (render, filtri)
   12. FAQ (render, filtri)
   13. INIT
   ========================================================================= */


/* =========================================================================
   1. DATI
   -------------------------------------------------------------------------
   I prodotti professionali e i prodotti domiciliari riportati qui sotto
   sono tratti dalle schede tecniche ufficiali InLab fornite da FIDEST
   (nome, quantità, attivi, funzione, INCI). I campi legati a come questi
   prodotti si inseriscono nel Protocollo Pelle Sana (uso nel protocollo,
   compatibilità, argomentazione commerciale, abbinamenti) sono contrassegnati
   "DA VALIDARE CON LA MASTER TRAINER" e vanno confermati prima della
   pubblicazione pubblica della piattaforma.
   ========================================================================= */

// Etichette leggibili per le categorie usate nei filtri
const CATEGORY_LABELS = {
    // Piani di trattamento — problematiche
    "pelle-spenta": "Pelle spenta",
    "disidratazione": "Disidratazione",
    "rughe-tono": "Rughe e perdita di tono",
    "fotoinvecchiamento": "Fotoinvecchiamento",
    "macchie-discromie": "Macchie e discromie",
    "texture-irregolare": "Texture irregolare",
    "cicatrici-post-acne": "Cicatrici ed esiti post-acne",
    "pelle-matura": "Pelle matura",
    "pelle-impura": "Pelle impura",
    "prevenzione-longevity": "Prevenzione e skin longevity",
    // Schede tecniche — attivi professionali
    "acidi-cosmetici": "Acidi cosmetici",
    "biorivitalizzanti": "Biorivitalizzanti",
    "fiale-sterili": "Fiale sterili",
    "illuminanti": "Illuminanti",
    "idratanti": "Idratanti",
    "ricostituenti": "Ricostituenti",
    "uniformanti": "Uniformanti",
    "complementari": "Prodotti complementari",
    // Home care
    "detergenza": "Detergenza",
    "sieri": "Sieri",
    "creme": "Creme",
    "contorno-occhi": "Contorno occhi",
    "post-trattamento": "Post trattamento",
    "mantenimento": "Mantenimento",
    "luminosita": "Luminosità",
    "idratazione": "Idratazione",
    "anti-age": "Anti-age",
    "protezione": "Protezione",
    // Video
    "video-introduttivi": "Video introduttivi",
    "reel-master-trainer": "Reel con la Master Trainer",
    "protocolli-pratici": "Protocolli pratici",
    "spiegazione-attivi": "Spiegazione degli attivi",
    "consulenza": "Consulenza",
    "anamnesi": "Anamnesi",
    "home-care-video": "Home care",
    "casi-studio-video": "Casi studio",
    // Materiali
    "schede-tecniche-doc": "Schede tecniche",
    "brochure": "Brochure",
    "protocolli-doc": "Protocolli",
    "listini": "Listini",
    "moduli": "Moduli",
    "script-consulenza": "Script consulenza",
    "materiale-social": "Materiale social",
    "materiale-stampabile": "Materiale stampabile",
    "guide": "Guide",
    // FAQ
    "faq-protocollo": "Protocollo",
    "faq-trattamenti": "Trattamenti",
    "faq-prodotti": "Prodotti",
    "faq-anamnesi": "Anamnesi",
    "faq-piattaforma": "Utilizzo della piattaforma",
    "faq-ordini": "Ordini",
    "faq-materiali": "Materiali"
};

// Le 6 fasi del metodo, riutilizzate sia dalla timeline sia dai piani di trattamento
const METODO_FASI = [
    {
        id: "analisi",
        numero: "01",
        nome: "Analisi",
        sintesi: "Valutazione approfondita della pelle e anamnesi della cliente.",
        dettaglio: "Osservazione dello stato cutaneo, raccolta dell'anamnesi, individuazione della problematica prevalente e definizione degli obiettivi realistici del percorso."
    },
    {
        id: "preparazione",
        numero: "02",
        nome: "Preparazione",
        sintesi: "La pelle viene preparata a ricevere i trattamenti successivi.",
        dettaglio: "Detersione profonda, eventuale esfoliazione e primi passaggi di riequilibrio, per rendere la cute ricettiva agli attivi professionali."
    },
    {
        id: "rivitalizzazione",
        numero: "03",
        nome: "Rivitalizzazione",
        sintesi: "Si riattivano i processi energetici e metabolici della pelle.",
        dettaglio: "Impiego di biorivitalizzanti, esosomi e complessi vitaminici per restituire energia cellulare e favorire i processi rigenerativi."
    },
    {
        id: "ricostituzione",
        numero: "04",
        nome: "Ricostituzione",
        sintesi: "Si ricostruisce la matrice cutanea (collagene, elastina, HA).",
        dettaglio: "Attivi mirati alla sintesi di collagene ed elastina e al ripristino della matrice extracellulare, per tono, densità ed elasticità."
    },
    {
        id: "mantenimento",
        numero: "05",
        nome: "Mantenimento",
        sintesi: "I risultati vengono consolidati nel tempo.",
        dettaglio: "Sedute di richiamo a intervalli programmati e home care mirata, per mantenere nel tempo i risultati ottenuti in cabina."
    },
    {
        id: "monitoraggio",
        numero: "06",
        nome: "Monitoraggio",
        sintesi: "Si osserva l'evoluzione della pelle e si aggiorna il piano.",
        dettaglio: "Verifica periodica dei progressi (anche fotografica), confronto con gli obiettivi iniziali ed eventuale aggiornamento del piano di trattamento."
    }
];

// -------------------------------------------------------------------------
// PIANI DI TRATTAMENTO
// Contenuto dimostrativo per mostrare la struttura del sistema.
// CONTENUTO DA VALIDARE CON LA MASTER TRAINER prima della pubblicazione.
// -------------------------------------------------------------------------
const treatmentPlans = [
    {
        id: "plan-pelle-spenta",
        nome: "Piano Luminosità",
        problematica: "pelle-spenta",
        obiettivo: "Restituire luminosità e uniformità all'incarnato spento.",
        condizioniIniziali: "Incarnato opaco, tono irregolare, pelle stanca e priva di vitalità.",
        durata: "6-8 settimane",
        numeroSedute: "4 sedute",
        frequenza: "Ogni 10-14 giorni",
        fasePreparatoria: "Detersione profonda + micro-esfoliazione con acidi cosmetici a bassa percentuale.",
        attiviUtilizzabili: ["Vitamina C 10%", "Brightening Cocktail"],
        tecnologiaAssociabile: "Dermapen / dermo-veicolazione",
        trattamentoCosmetico: "NAD Plus Glow",
        homeCare: "Exobio Facial Serum",
        risultatiAttesi: "Incarnato più luminoso e uniforme, pelle visibilmente più vitale.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    },
    {
        id: "plan-disidratazione",
        nome: "Piano Idratazione Profonda",
        problematica: "disidratazione",
        obiettivo: "Ripristinare i livelli di idratazione e la funzione barriera.",
        condizioniIniziali: "Pelle secca, tirante, con sensazione di disagio e desquamazione.",
        durata: "6 settimane",
        numeroSedute: "4 sedute",
        frequenza: "Settimanale",
        fasePreparatoria: "Detersione delicata, nessuna esfoliazione aggressiva.",
        attiviUtilizzabili: ["Hyaluronic Acid 3%", "Mask of Biogel Exoderm"],
        tecnologiaAssociabile: "Hydrapen / dermo-veicolazione",
        trattamentoCosmetico: "Polyvitaminic",
        homeCare: "Exobio Facial Cream",
        risultatiAttesi: "Pelle più morbida, idratata e confortevole, riduzione della tensione cutanea.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    },
    {
        id: "plan-rughe-tono",
        nome: "Piano Tono e Compattezza",
        problematica: "rughe-tono",
        obiettivo: "Attenuare le linee di espressione e migliorare tono ed elasticità.",
        condizioniIniziali: "Rilassamento cutaneo, rughe sottili, perdita di tono su viso e collo.",
        durata: "8-10 settimane",
        numeroSedute: "5 sedute",
        frequenza: "Ogni 10 giorni",
        fasePreparatoria: "Detersione + peeling anti-age leggero per favorire la penetrazione degli attivi.",
        attiviUtilizzabili: ["Botx Like Argireline 10%", "Mix 1% HA + DMAE + Silicio organico"],
        tecnologiaAssociabile: "Dermapen",
        trattamentoCosmetico: "ADRN Plus",
        homeCare: "ADRN Pro Facial Cream",
        risultatiAttesi: "Pelle più tonica e distesa, rughe sottili attenuate.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    },
    {
        id: "plan-fotoinvecchiamento",
        nome: "Piano Anti-Fotoinvecchiamento",
        problematica: "fotoinvecchiamento",
        obiettivo: "Contrastare i segni indotti dall'esposizione solare e dai radicali liberi.",
        condizioniIniziali: "Pelle disomogenea, texture irregolare, primi segni di fotoinvecchiamento.",
        durata: "8 settimane",
        numeroSedute: "4-5 sedute",
        frequenza: "Ogni 10-14 giorni",
        fasePreparatoria: "Detersione + esfoliazione con acidi antiossidanti.",
        attiviUtilizzabili: ["Vitamin C 10%", "Growth Factor GF#1"],
        tecnologiaAssociabile: "Dermapen",
        trattamentoCosmetico: "Peptigenol Skin Antiox Ampoules",
        homeCare: "ADRN Pro Facial Serum",
        risultatiAttesi: "Texture più uniforme e maggiore protezione antiossidante percepita.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    },
    {
        id: "plan-macchie-discromie",
        nome: "Piano Uniformità e Depigmentazione",
        problematica: "macchie-discromie",
        obiettivo: "Uniformare il tono della pelle e ridurre l'aspetto delle macchie.",
        condizioniIniziali: "Macchie solari, melasma o iperpigmentazione post-infiammatoria.",
        durata: "8-12 settimane",
        numeroSedute: "5-6 sedute",
        frequenza: "Ogni 14 giorni",
        fasePreparatoria: "Detersione + peeling depigmentante a bassa concentrazione.",
        attiviUtilizzabili: ["Tranexamic Acid", "Depigmenting Peeling Plus"],
        tecnologiaAssociabile: "Dermo-veicolazione",
        trattamentoCosmetico: "Brightening Cocktail",
        homeCare: "Exobio Facial Serum",
        risultatiAttesi: "Tono più uniforme, riduzione visibile delle discromie nel tempo.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    },
    {
        id: "plan-texture-irregolare",
        nome: "Piano Levigatezza",
        problematica: "texture-irregolare",
        obiettivo: "Migliorare la grana della pelle e ridurre la ruvidità superficiale.",
        condizioniIniziali: "Texture irregolare, pori dilatati, superficie cutanea ruvida.",
        durata: "6-8 settimane",
        numeroSedute: "4 sedute",
        frequenza: "Ogni 10 giorni",
        fasePreparatoria: "Detersione profonda + scrub meccanico delicato.",
        attiviUtilizzabili: ["Oily Skin Peeling Plus", "Organic Silicio 6%"],
        tecnologiaAssociabile: "Dermapen",
        trattamentoCosmetico: "Micro Peeling",
        homeCare: "Exobio Facial Cream",
        risultatiAttesi: "Grana della pelle più fine, superficie più levigata.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    },
    {
        id: "plan-cicatrici-post-acne",
        nome: "Piano Rigenerazione Post-Acne",
        problematica: "cicatrici-post-acne",
        obiettivo: "Favorire la rigenerazione cutanea negli esiti cicatriziali post-acne.",
        condizioniIniziali: "Esiti cicatriziali, discromie post-infiammatorie, texture irregolare.",
        durata: "10-12 settimane",
        numeroSedute: "6 sedute",
        frequenza: "Ogni 14 giorni",
        fasePreparatoria: "Detersione + peeling specifico per pelle impura/esiti da acne.",
        attiviUtilizzabili: ["Antiaging Peeling Cocktail", "Oily Skin Peeling Plus"],
        tecnologiaAssociabile: "Dermapen",
        trattamentoCosmetico: "Growth Factor GF#1",
        homeCare: "Exobio Facial Serum",
        risultatiAttesi: "Miglioramento della texture e dell'aspetto degli esiti cicatriziali.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    },
    {
        id: "plan-pelle-matura",
        nome: "Piano Pelle Matura",
        problematica: "pelle-matura",
        obiettivo: "Sostenere globalmente una pelle matura: tono, densità e luminosità.",
        condizioniIniziali: "Perdita di densità e tono, rughe più marcate, incarnato spento.",
        durata: "10-12 settimane",
        numeroSedute: "6 sedute",
        frequenza: "Ogni 10-14 giorni",
        fasePreparatoria: "Detersione + preparazione con complesso vitaminico.",
        attiviUtilizzabili: ["ADRN Plus", "Growth Factor GF#1"],
        tecnologiaAssociabile: "Dermapen",
        trattamentoCosmetico: "NAD Plus Glow",
        homeCare: "ADRN Pro Facial Cream + ADRN Pro Eye Contour",
        risultatiAttesi: "Pelle più densa, tonica e luminosa nel suo complesso.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    },
    {
        id: "plan-pelle-impura",
        nome: "Piano Riequilibrio Pelle Impura",
        problematica: "pelle-impura",
        obiettivo: "Riequilibrare la produzione di sebo e ridurre le imperfezioni.",
        condizioniIniziali: "Pelle grassa/impura, pori dilatati, tendenza acneica.",
        durata: "6-8 settimane",
        numeroSedute: "4-5 sedute",
        frequenza: "Ogni 10 giorni",
        fasePreparatoria: "Detersione profonda con schiuma purificante.",
        attiviUtilizzabili: ["Oily Skin Peeling Plus", "White Mousse Cleansing Foam"],
        tecnologiaAssociabile: "Dermapen",
        trattamentoCosmetico: "Oily Skin Peeling Plus",
        homeCare: "Exobio Facial Serum",
        risultatiAttesi: "Pelle più equilibrata, minor untuosità e minori imperfezioni.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    },
    {
        id: "plan-prevenzione-longevity",
        nome: "Piano Skin Longevity",
        problematica: "prevenzione-longevity",
        obiettivo: "Prevenire i segni dell'invecchiamento e mantenere la pelle in salute nel tempo.",
        condizioniIniziali: "Pelle ancora sana, in fase di prevenzione, senza problematiche acute.",
        durata: "Percorso continuativo",
        numeroSedute: "4 sedute + richiami",
        frequenza: "Ogni 3-4 settimane",
        fasePreparatoria: "Detersione + analisi periodica dello stato cutaneo.",
        attiviUtilizzabili: ["Exobio Plus", "Polyvitaminic"],
        tecnologiaAssociabile: "Dermapen / LED",
        trattamentoCosmetico: "Exobio Plus",
        homeCare: "Exobio Facial Cream + Exobio Facial Serum",
        risultatiAttesi: "Mantenimento nel tempo della qualità e della vitalità cutanea.",
        note: "CONTENUTO DA VALIDARE CON LA MASTER TRAINER.",
        stato: "bozza"
    }
];

// -------------------------------------------------------------------------
// SCHEDE TECNICHE — ATTIVI PROFESSIONALI
// Dati tratti dalle schede tecniche ufficiali InLab (FIDEST).
// I campi "utilizzoProtocollo" e "compatibilita" sono da validare.
// -------------------------------------------------------------------------
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Uso professionale topico su viso, con applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/exobio-plus.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Uso professionale topico su viso, dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/adrn-plus.pdf",
        videoUrl: ""
    },
    {
        id: "nad-plus-glow",
        nome: "NAD Plus Glow",
        categoria: ["fiale-sterili"],
        quantita: "Box 8x5ml",
        principiAttivi: "NAD (Nicotinamide Adenina Dinucleotide), complesso Fattori di Crescita Luminosi, vitamina C, glutatione",
        funzione: "Rivitalizza l'energia cellulare e migliora luminosità, uniformità e vitalità della pelle.",
        descrizione: "Trattamento in fiale per dermapen/microneedling che combina NAD e complesso illuminante.",
        indicazioni: "Pelle spenta, stanca, con segni di affaticamento e invecchiamento precoce.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Uso professionale topico su viso, dermapen/microneedling.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/nad-plus-glow.pdf",
        videoUrl: ""
    },
    {
        id: "exohair-plus",
        nome: "Exohair Plus",
        categoria: ["fiale-sterili"],
        quantita: "Box 8x5ml (4+4 fiale)",
        principiAttivi: "Esosomi, proteine di soia idrolizzate, Lactobacillus ferment, acido ialuronico, silicio organico, Ginkgo Biloba, Centella asiatica",
        funzione: "Rivitalizza il cuoio capelluto e rinforza il capello, contrastando la caduta.",
        descrizione: "Trattamento professionale capelli con esosomi rivitalizzanti + complesso rinforzante anticaduta.",
        indicazioni: "Capelli indeboliti, diradati, cuoio capelluto devitalizzato.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Uso professionale topico su cuoio capelluto.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/exohair-plus.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale su viso deterso; valutare neutralizzazione.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/antiaging-peeling-cocktail.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale su viso deterso; valutare neutralizzazione.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/depigmenting-peeling-plus.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale su viso deterso; valutare neutralizzazione.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/oily-skin-peeling-plus.pdf",
        videoUrl: ""
    },
    {
        id: "hyaluronic-acid-3",
        nome: "Hyaluronic Acid 3%",
        categoria: ["idratanti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido ialuronico ad alta concentrazione",
        funzione: "Idrata, dona volume e leviga la pelle.",
        descrizione: "Soluzione sterile ad alta concentrazione di acido ialuronico.",
        indicazioni: "Disidratazione, pelle spenta, prevenzione delle rughe.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/hyaluronic-acid-3.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/organic-silicio-6.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/botx-like-argireline-10.pdf",
        videoUrl: ""
    },
    {
        id: "brightening-cocktail",
        nome: "Brightening Cocktail",
        categoria: ["illuminanti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Kiwi, estratto di liquirizia (Glycyrrhiza Glabra), Sophora flavescens",
        funzione: "Schiarisce e uniforma il tono della pelle.",
        descrizione: "Siero viso con ingredienti naturali e attivi schiarenti.",
        indicazioni: "Macchie, discromie, incarnato spento.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/brightening-cocktail.pdf",
        videoUrl: ""
    },
    {
        id: "polyvitaminic",
        nome: "Polyvitaminic",
        categoria: ["fiale-sterili"],
        quantita: "Box 5x5ml",
        principiAttivi: "Vitamine, aminoacidi, peptidi, acido ialuronico, minerali",
        funzione: "Ripristina la matrice extracellulare, azione antiossidante anti-età.",
        descrizione: "Soluzione cosmetica completa per il ripristino dei processi vitali cutanei.",
        indicazioni: "Pelle disidratata, stanca, in fase di mantenimento.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/polyvitaminic.pdf",
        videoUrl: ""
    },
    {
        id: "vitamin-c-10",
        nome: "Vitamin C 10%",
        categoria: ["illuminanti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido ascorbico 10%",
        funzione: "Dona luminosità, uniforma il tono e migliora l'elasticità.",
        descrizione: "Soluzione sterile per una pelle radiosa e levigata.",
        indicazioni: "Fotoinvecchiamento, macchie, incarnato spento.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/vitamin-c-10.pdf",
        videoUrl: ""
    },
    {
        id: "tranexamic-acid",
        nome: "Tranexamic Acid",
        categoria: ["uniformanti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido tranexamico",
        funzione: "Riduce macchie scure, melasma e iperpigmentazione post-infiammatoria.",
        descrizione: "Utilizzato nel trattamento e nella prevenzione dell'iperpigmentazione cutanea.",
        indicazioni: "Melasma, macchie post-acne, discromie.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/tranexamic-acid.pdf",
        videoUrl: ""
    },
    {
        id: "growth-factor-gf1",
        nome: "Growth Factor GF#1",
        categoria: ["biorivitalizzanti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Peptidi biomimetici, vitamina C, glicogeno, Gatuline Spot-Light",
        funzione: "Ripristina i processi cutanei e ritarda gli effetti dell'invecchiamento.",
        descrizione: "Vitamine e peptidi identici ai fattori di crescita naturali.",
        indicazioni: "Fotoinvecchiamento, macchie, cicatrici post-acne.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/growth-factor-gf1.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/mix-ha-dmae-silicio.pdf",
        videoUrl: ""
    },
    {
        id: "flash-eye",
        nome: "Flash Eye",
        categoria: ["idratanti"],
        quantita: "Box 5x5ml",
        principiAttivi: "Peptidi, acido ialuronico, caffeina, niacinamide",
        funzione: "Riduce borse e occhiaie, azione antiossidante e anti-età per il contorno occhi.",
        descrizione: "Soluzione mirata per la delicata zona del contorno occhi.",
        indicazioni: "Borse, occhiaie, segni di stanchezza perioculare.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/flash-eye.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicare alcune gocce sui capelli asciutti o bagnati.",
        avvertenze: "Non ingerire. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/regenerating-hair-serum.pdf",
        videoUrl: ""
    },
    {
        id: "mask-biogel-exoderm",
        nome: "Mask of Biogel Exoderm",
        categoria: ["idratanti"],
        quantita: "Box 5x30ml",
        principiAttivi: "Acido ialuronico, collagene idrolizzato, Centella asiatica",
        funzione: "Idrata intensamente, uniforma il tono e leviga la texture. Sicura per rosacea.",
        descrizione: "Maschera idrogel Exoderm per pelle secca e disidratata.",
        indicazioni: "Disidratazione, pelle sensibile o con rosacea.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicare sul viso e lasciare in posa 15-30 minuti.",
        avvertenze: "Non usare su cute lesa. Evitare il contatto con gli occhi.",
        pdfUrl: "assets/docs/schede-tecniche/mask-biogel-exoderm.pdf",
        videoUrl: ""
    },
    {
        id: "peptigenol-skin-antiox",
        nome: "Peptigenol Skin Antiox Ampoules",
        categoria: ["biorivitalizzanti"],
        quantita: "Box 6x4ml",
        principiAttivi: "Proteine di soia idrolizzate, 3 peptidi sintetici, coenzima Q10, vitamina E, acido ialuronico",
        funzione: "Corregge le linee di espressione, nutre e idrata in profondità.",
        descrizione: "Complesso peptidico rigenerante con effetto antiossidante.",
        indicazioni: "Fotoinvecchiamento, cicatrici post-acne, pelle stanca.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Massaggiare sulla pelle fino a completo assorbimento.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "assets/docs/schede-tecniche/peptigenol-skin-antiox.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Massaggiare con movimenti circolari e risciacquare.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "assets/docs/schede-tecniche/micro-peeling.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Nebulizzare sul viso dopo aver protetto gli occhi, quindi risciacquare.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "assets/docs/schede-tecniche/neutralizing-solution.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Massaggiare sulle labbra fino a completo assorbimento.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "assets/docs/schede-tecniche/repair-balm.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Massaggiare delicatamente e risciacquare.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "assets/docs/schede-tecniche/white-mousse-cleansing-foam.pdf",
        videoUrl: ""
    },
    {
        id: "bioled-facial-mask",
        nome: "BioLed Facial Mask",
        categoria: ["complementari"],
        quantita: "Box 1x1",
        principiAttivi: "Tecnologia LED multicolore (rosso, blu, verde, giallo, viola, azzurro, bianco)",
        funzione: "Ogni colore agisce su un obiettivo specifico: elasticità, anti-acne, macchie, luminosità, rigenerazione, lenitivo, anti-età.",
        descrizione: "Maschera LED in silicone flessibile con cinturino regolabile.",
        indicazioni: "Complemento tecnologico ai trattamenti cosmetici, da abbinare secondo obiettivo.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Seguire le indicazioni del dispositivo per tempo di posa e colore.",
        avvertenze: "Consultare le istruzioni del dispositivo prima dell'uso.",
        pdfUrl: "assets/docs/schede-tecniche/bioled-facial-mask.pdf",
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
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicare sulle labbra deterse per 15-20 minuti.",
        avvertenze: "Non usare in presenza di ferite o herpes labiale.",
        pdfUrl: "assets/docs/schede-tecniche/golden-kiss-lip-mask.pdf",
        videoUrl: ""
    },
    {
        id: "golden-eye-patch",
        nome: "Golden Eye Patch",
        categoria: ["idratanti"],
        quantita: "Box 10pz",
        principiAttivi: "Alga rossa, aloe, burro di karité, collagene",
        funzione: "Combatte i principali segni del tempo nel contorno occhi, restituendo elasticità.",
        descrizione: "Coppia di patch in hydrogel ad alto potere idratante.",
        indicazioni: "Borse, occhiaie, contorno occhi disidratato.",
        utilizzoProtocollo: "DA VALIDARE CON LA MASTER TRAINER",
        compatibilita: "DA VALIDARE CON LA MASTER TRAINER",
        modalitaUtilizzo: "Applicare sotto l'area oculare e lasciare in posa 15-20 minuti.",
        avvertenze: "Non usare in presenza di ferite o irritazioni.",
        pdfUrl: "assets/docs/schede-tecniche/golden-eye-patch.pdf",
        videoUrl: ""
    }
];

// -------------------------------------------------------------------------
// HOME CARE — PRODOTTI DA RIVENDITA
// Dati tratti dalle schede tecniche ufficiali InLab (FIDEST).
// I campi commerciali/di abbinamento sono da validare.
// -------------------------------------------------------------------------
const retailProducts = [
    {
        id: "exobio-facial-cream",
        nome: "Exobio Facial Cream",
        categoria: ["creme", "anti-age", "mantenimento"],
        quantita: "50ml",
        funzione: "Trattamento antietà completo: attenua le rughe e dona un aspetto più tonico e levigato.",
        principiAttivi: "5% Exo-Vitalize, 2% Niacinamide, Vitamina E",
        quandoConsigliarlo: "DA VALIDARE CON LA MASTER TRAINER",
        pianoAbbinato: "Piano Luminosità, Piano Skin Longevity",
        modalitaUso: "Applicare mattina e/o sera su viso deterso.",
        routine: "mattina-sera",
        argomentazioneCommerciale: "DA VALIDARE CON LA MASTER TRAINER",
        prodottoComplementare: "Exobio Facial Serum",
        schedaUrl: "assets/docs/home-care/exobio-facial-cream.pdf"
    },
    {
        id: "exobio-eye-contour",
        nome: "Exobio Eye Contour",
        categoria: ["contorno-occhi"],
        quantita: "20ml",
        funzione: "Riduce gonfiore, attenua occhiaie e favorisce la rigenerazione cellulare del contorno occhi.",
        principiAttivi: "5% Exo-Vitalize, 2% Niacinamide, 1,5% Caffeina, Biophytonic",
        quandoConsigliarlo: "DA VALIDARE CON LA MASTER TRAINER",
        pianoAbbinato: "Piano Luminosità, Piano Pelle Matura",
        modalitaUso: "Applicare mattina e sera sul contorno occhi deterso.",
        routine: "mattina-sera",
        argomentazioneCommerciale: "DA VALIDARE CON LA MASTER TRAINER",
        prodottoComplementare: "Exobio Facial Cream",
        schedaUrl: "assets/docs/home-care/exobio-eye-contour.pdf"
    },
    {
        id: "exobio-facial-serum",
        nome: "Exobio Facial Serum",
        categoria: ["sieri", "luminosita"],
        quantita: "30ml",
        funzione: "Ringiovanisce e idrata intensamente, stimolando la rigenerazione cellulare.",
        principiAttivi: "7% Exo-Vitalize, 5% Centella asiatica, 2% Niacinamide, Vitamina E",
        quandoConsigliarlo: "DA VALIDARE CON LA MASTER TRAINER",
        pianoAbbinato: "Piano Uniformità e Depigmentazione, Piano Rigenerazione Post-Acne",
        modalitaUso: "Applicare mattina e/o sera prima della crema.",
        routine: "mattina-sera",
        argomentazioneCommerciale: "DA VALIDARE CON LA MASTER TRAINER",
        prodottoComplementare: "Exobio Facial Cream",
        schedaUrl: "assets/docs/home-care/exobio-facial-serum.pdf"
    },
    {
        id: "adrn-pro-facial-cream",
        nome: "ADRN Pro Facial Cream",
        categoria: ["creme", "anti-age"],
        quantita: "50ml",
        funzione: "Rivitalizza, idrata e migliora l'elasticità cutanea grazie al PDRN (DNA di salmone).",
        principiAttivi: "DNA di sodio 0,05%, Niacinamide 2%, Estratto di Dunaliella Salina 1,5%, Olio di mandorle dolci",
        quandoConsigliarlo: "DA VALIDARE CON LA MASTER TRAINER",
        pianoAbbinato: "Piano Tono e Compattezza, Piano Pelle Matura",
        modalitaUso: "Applicare mattina e/o sera su viso deterso.",
        routine: "mattina-sera",
        argomentazioneCommerciale: "DA VALIDARE CON LA MASTER TRAINER",
        prodottoComplementare: "ADRN Pro Facial Serum",
        schedaUrl: "assets/docs/home-care/adrn-pro-facial-cream.pdf"
    },
    {
        id: "adrn-pro-eye-contour",
        nome: "ADRN Pro Eye Contour",
        categoria: ["contorno-occhi"],
        quantita: "20ml",
        funzione: "Rigenera, illumina e protegge la pelle del contorno occhi con PDRN e niacinamide.",
        principiAttivi: "DNA di sodio, Niacinamide, Estratto di Dunaliella Salina, Squalano, Olio di Inca Inchi",
        quandoConsigliarlo: "DA VALIDARE CON LA MASTER TRAINER",
        pianoAbbinato: "Piano Pelle Matura",
        modalitaUso: "Applicare mattina e sera sul contorno occhi.",
        routine: "mattina-sera",
        argomentazioneCommerciale: "DA VALIDARE CON LA MASTER TRAINER",
        prodottoComplementare: "ADRN Pro Facial Cream",
        schedaUrl: "assets/docs/home-care/adrn-pro-eye-contour.pdf"
    },
    {
        id: "adrn-pro-facial-serum",
        nome: "ADRN Pro Facial Serum",
        categoria: ["sieri", "mantenimento"],
        quantita: "30ml",
        funzione: "Siero rigenerante e antiossidante ad alta efficacia con PDRN di salmone.",
        principiAttivi: "DNA di sodio (PDRN), Niacinamide, Estratto di Dunaliella Salina, Glicerina",
        quandoConsigliarlo: "DA VALIDARE CON LA MASTER TRAINER",
        pianoAbbinato: "Piano Anti-Fotoinvecchiamento",
        modalitaUso: "Applicare mattina e/o sera prima della crema.",
        routine: "mattina-sera",
        argomentazioneCommerciale: "DA VALIDARE CON LA MASTER TRAINER",
        prodottoComplementare: "ADRN Pro Facial Cream",
        schedaUrl: "assets/docs/home-care/adrn-pro-facial-serum.pdf"
    }
];

// -------------------------------------------------------------------------
// CASI STUDIO — CONTENUTO DA COMPLETARE
// Struttura predisposta, in attesa di foto, dati e testimonianze reali.
// -------------------------------------------------------------------------
const caseStudies = [
    {
        id: "caso-adriana",
        nome: "Adriana",
        fotoPrima: "assets/img/case-studies/adriana-prima.jpg",
        fotoDopo: "assets/img/case-studies/adriana-dopo.jpg",
        problematicaIniziale: "[Problematica iniziale da inserire]",
        durata: "[Durata del percorso da inserire]",
        pianoEffettuato: "[Piano di trattamento da collegare]",
        attivi: "[Attivi professionali utilizzati da inserire]",
        tecnologie: "[Tecnologie utilizzate da inserire]",
        homeCare: "[Prodotti home care abbinati da inserire]",
        osservazioni: "[Osservazioni della professionista da inserire]",
        testimonianza: "[Testimonianza della cliente da inserire]"
    },
    {
        id: "caso-francesca",
        nome: "Francesca",
        fotoPrima: "assets/img/case-studies/francesca-prima.jpg",
        fotoDopo: "assets/img/case-studies/francesca-dopo.jpg",
        problematicaIniziale: "[Problematica iniziale da inserire]",
        durata: "[Durata del percorso da inserire]",
        pianoEffettuato: "[Piano di trattamento da collegare]",
        attivi: "[Attivi professionali utilizzati da inserire]",
        tecnologie: "[Tecnologie utilizzate da inserire]",
        homeCare: "[Prodotti home care abbinati da inserire]",
        osservazioni: "[Osservazioni della professionista da inserire]",
        testimonianza: "[Testimonianza della cliente da inserire]"
    }
];

const CASE_STUDY_DISCLAIMER = "I risultati possono variare in base alle condizioni iniziali della pelle, alla risposta individuale e alla costanza nel seguire il percorso.";

// -------------------------------------------------------------------------
// VIDEO E FORMAZIONE — PLACEHOLDER, in attesa dei link definitivi.
// -------------------------------------------------------------------------
const videos = [
    { id: "video-01", titolo: "[Titolo da inserire] — Presentazione del Protocollo Pelle Sana", categoria: "video-introduttivi", durata: "--:--", livello: "Base", descrizione: "Video introduttivo al metodo Protocollo Pelle Sana. DA COMPLETARE.", thumbnail: "assets/img/video/video-01.jpg", url: "" },
    { id: "video-02", titolo: "[Titolo da inserire] — Reel con Annarita", categoria: "reel-master-trainer", durata: "--:--", livello: "Base", descrizione: "Reel formativo con la Master Trainer Annarita. DA COMPLETARE.", thumbnail: "assets/img/video/video-02.jpg", url: "" },
    { id: "video-03", titolo: "[Titolo da inserire] — Protocollo pratico in cabina", categoria: "protocolli-pratici", durata: "--:--", livello: "Intermedio", descrizione: "Dimostrazione pratica di un piano di trattamento. DA COMPLETARE.", thumbnail: "assets/img/video/video-03.jpg", url: "" },
    { id: "video-04", titolo: "[Titolo da inserire] — Approfondimento su un attivo InLab", categoria: "spiegazione-attivi", durata: "--:--", livello: "Intermedio", descrizione: "Approfondimento tecnico su un attivo professionale. DA COMPLETARE.", thumbnail: "assets/img/video/video-04.jpg", url: "" },
    { id: "video-05", titolo: "[Titolo da inserire] — Come condurre la consulenza", categoria: "consulenza", durata: "--:--", livello: "Base", descrizione: "Indicazioni pratiche per la consulenza in cabina. DA COMPLETARE.", thumbnail: "assets/img/video/video-05.jpg", url: "" },
    { id: "video-06", titolo: "[Titolo da inserire] — Anamnesi della cliente", categoria: "anamnesi", durata: "--:--", livello: "Base", descrizione: "Come raccogliere un'anamnesi completa. DA COMPLETARE.", thumbnail: "assets/img/video/video-06.jpg", url: "" },
    { id: "video-07", titolo: "[Titolo da inserire] — Costruire la routine domiciliare", categoria: "home-care-video", durata: "--:--", livello: "Base", descrizione: "Come proporre la routine home care alla cliente. DA COMPLETARE.", thumbnail: "assets/img/video/video-07.jpg", url: "" },
    { id: "video-08", titolo: "[Titolo da inserire] — Analisi di un caso studio", categoria: "casi-studio-video", durata: "--:--", livello: "Avanzato", descrizione: "Analisi commentata di un caso studio reale. DA COMPLETARE.", thumbnail: "assets/img/video/video-08.jpg", url: "" }
];

// -------------------------------------------------------------------------
// MATERIALI — PLACEHOLDER, in attesa dei documenti definitivi.
// -------------------------------------------------------------------------
const resources = [
    { id: "doc-01", titolo: "[Documento da inserire] — Schede tecniche prodotti professionali", categoria: "schede-tecniche-doc", descrizione: "Raccolta delle schede tecniche ufficiali InLab. DA COMPLETARE.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/schede-tecniche.pdf", scaricaUrl: "assets/docs/materiali/schede-tecniche.pdf" },
    { id: "doc-02", titolo: "[Documento da inserire] — Brochure Protocollo Pelle Sana", categoria: "brochure", descrizione: "Brochure di presentazione del protocollo per le clienti. DA COMPLETARE.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/brochure.pdf", scaricaUrl: "assets/docs/materiali/brochure.pdf" },
    { id: "doc-03", titolo: "[Documento da inserire] — Protocolli di trattamento dettagliati", categoria: "protocolli-doc", descrizione: "Protocolli operativi passo-passo. DA COMPLETARE.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/protocolli.pdf", scaricaUrl: "assets/docs/materiali/protocolli.pdf" },
    { id: "doc-04", titolo: "[Documento da inserire] — Listino prezzi professionale", categoria: "listini", descrizione: "Listino prodotti e trattamenti aggiornato. DA COMPLETARE.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/listino.pdf", scaricaUrl: "assets/docs/materiali/listino.pdf" },
    { id: "doc-05", titolo: "[Documento da inserire] — Modulo di anamnesi", categoria: "moduli", descrizione: "Modulo stampabile per la raccolta dati della cliente. DA COMPLETARE.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/modulo-anamnesi.pdf", scaricaUrl: "assets/docs/materiali/modulo-anamnesi.pdf" },
    { id: "doc-06", titolo: "[Documento da inserire] — Script di consulenza", categoria: "script-consulenza", descrizione: "Traccia di conversazione per la consulenza in cabina. DA COMPLETARE.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/script-consulenza.pdf", scaricaUrl: "assets/docs/materiali/script-consulenza.pdf" },
    { id: "doc-07", titolo: "[Documento da inserire] — Kit materiale social", categoria: "materiale-social", descrizione: "Grafiche pronte per i canali social dell'estetista. DA COMPLETARE.", formato: "ZIP", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/kit-social.zip", scaricaUrl: "assets/docs/materiali/kit-social.zip" },
    { id: "doc-08", titolo: "[Documento da inserire] — Locandina stampabile in cabina", categoria: "materiale-stampabile", descrizione: "Materiale da stampare ed esporre in cabina estetica. DA COMPLETARE.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/locandina.pdf", scaricaUrl: "assets/docs/materiali/locandina.pdf" },
    { id: "doc-09", titolo: "[Documento da inserire] — Guida rapida alla piattaforma", categoria: "guide", descrizione: "Guida all'utilizzo della piattaforma Protocollo Pelle Sana. DA COMPLETARE.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/guida-piattaforma.pdf", scaricaUrl: "assets/docs/materiali/guida-piattaforma.pdf" }
];

// -------------------------------------------------------------------------
// FAQ
// -------------------------------------------------------------------------
const faqItems = [
    { id: "faq-1", gruppo: "faq-protocollo", domanda: "Cos'è il Protocollo Pelle Sana?", risposta: "È un metodo ideato da FIDEST che utilizza i prodotti e gli attivi professionali InLab all'interno di un percorso strutturato in 6 fasi (analisi, preparazione, rivitalizzazione, ricostituzione, mantenimento, monitoraggio), pensato per lavorare sulla skin longevity e non su una singola seduta isolata." },
    { id: "faq-2", gruppo: "faq-protocollo", domanda: "Il Protocollo Pelle Sana è un trattamento anti-age generico?", risposta: "No. Non è un trattamento standard né un anti-age generico: è un sistema personalizzato in base alla problematica della cliente, che prevede analisi iniziale, un percorso dedicato, monitoraggio dei progressi e una fase di home care." },
    { id: "faq-3", gruppo: "faq-trattamenti", domanda: "Quante sedute richiede in media un piano di trattamento?", risposta: "Il numero di sedute varia in base alla problematica e alle condizioni iniziali della pelle. Ogni piano riporta un numero di sedute e una frequenza indicativi, da confermare con la Master Trainer prima dell'attivazione ufficiale del piano." },
    { id: "faq-4", gruppo: "faq-trattamenti", domanda: "Posso personalizzare un piano di trattamento?", risposta: "Sì. La sezione Protocol Builder permette di comporre un piano personalizzato selezionando problematica, fase, attivo professionale, tecnologia, trattamento cosmetico e home care." },
    { id: "faq-5", gruppo: "faq-prodotti", domanda: "Dove trovo le informazioni complete su un prodotto InLab?", risposta: "Nella sezione Schede Tecniche puoi filtrare i prodotti per categoria e aprire la scheda completa di ciascun attivo professionale, con composizione, benefici, modalità d'uso e avvertenze." },
    { id: "faq-6", gruppo: "faq-prodotti", domanda: "I prodotti professionali e i prodotti home care sono la stessa linea?", risposta: "Sono linee complementari: i prodotti professionali (fiale, peeling, maschere) sono ad uso esclusivo in cabina, mentre i prodotti home care sono pensati per il mantenimento quotidiano da parte della cliente." },
    { id: "faq-7", gruppo: "faq-anamnesi", domanda: "Perché l'anamnesi è così importante nel protocollo?", risposta: "L'anamnesi è la base della fase di Analisi: permette di individuare la problematica prevalente, eventuali controindicazioni e di costruire un piano realistico e sicuro per la cliente." },
    { id: "faq-8", gruppo: "faq-anamnesi", domanda: "Dove trovo un modulo di anamnesi da utilizzare in cabina?", risposta: "Nella sezione Materiali è disponibile un modulo di anamnesi scaricabile e stampabile (in fase di completamento)." },
    { id: "faq-9", gruppo: "faq-piattaforma", domanda: "Come sono organizzati i contenuti della piattaforma?", risposta: "La piattaforma è organizzata in sezioni: presentazione del metodo, piani di trattamento, protocol builder, schede tecniche, home care, casi studio, video formativi, materiali e FAQ, tutte raggiungibili dal menu di navigazione." },
    { id: "faq-10", gruppo: "faq-piattaforma", domanda: "I contenuti della piattaforma verranno aggiornati?", risposta: "Sì, la piattaforma è pensata per essere aggiornata nel tempo con nuovi piani, nuovi casi studio, nuovi video e nuovi materiali man mano che vengono validati dalla Master Trainer." },
    { id: "faq-11", gruppo: "faq-ordini", domanda: "Come posso ordinare i prodotti InLab?", risposta: "Per informazioni su ordini e listini contatta il tuo referente commerciale FIDEST di riferimento (vedi la sezione Supporto qui sotto)." },
    { id: "faq-12", gruppo: "faq-ordini", domanda: "Dove trovo il listino prezzi aggiornato?", risposta: "Il listino aggiornato è disponibile nella sezione Materiali, alla voce Listini (in fase di completamento)." },
    { id: "faq-13", gruppo: "faq-materiali", domanda: "Posso utilizzare i materiali della piattaforma per i miei canali social?", risposta: "Sì, nella sezione Materiali è disponibile un kit di materiale social pensato per essere utilizzato dalle professioniste che aderiscono al protocollo." },
    { id: "faq-14", gruppo: "faq-materiali", domanda: "I materiali sono scaricabili e stampabili?", risposta: "Sì, ogni documento nella sezione Materiali prevede un pulsante per l'apertura e uno per il download/stampa." }
];


/* =========================================================================
   2. UTILITY
   ========================================================================= */

const qs = (sel, ctx) => (ctx || document).querySelector(sel);
const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

// Placeholder immagine inline (SVG), usato come fallback quando un'immagine
// reale non è ancora stata caricata nel progetto.
const PLACEHOLDER_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
    '<rect width="400" height="300" fill="#efe7de"/>' +
    '<text x="50%" y="50%" font-family="Georgia, serif" font-size="18" fill="#213f5e" text-anchor="middle" dominant-baseline="middle">Immagine in arrivo</text>' +
    '</svg>'
);

// Restituisce il markup di un'immagine con fallback automatico
function imgTag(src, alt, cls) {
    const safeAlt = alt || "";
    const classAttr = cls ? ` class="${cls}"` : "";
    return `<img src="${src}" alt="${safeAlt}"${classAttr} loading="lazy" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';">`;
}

function labelFor(slug) {
    return CATEGORY_LABELS[slug] || slug;
}

// Costruisce una barra di filtri (pulsanti) dentro il container indicato
function buildFilterBar(container, categories, onFilter) {
    if (!container) return;
    const all = ["tutti"].concat(categories);
    container.innerHTML = all.map((cat, i) => {
        const label = cat === "tutti" ? "Tutti" : labelFor(cat);
        const active = i === 0 ? " is-active" : "";
        return `<button type="button" class="filter-chip${active}" data-filter="${cat}" aria-pressed="${i === 0}">${label}</button>`;
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
function openModal(html) {
    const dialog = qs("#detailModal");
    const body = qs("#modalBody");
    if (!dialog || !body) return;
    body.innerHTML = html;
    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    } else {
        dialog.setAttribute("open", "open");
    }
}

function initModal() {
    const dialog = qs("#detailModal");
    const closeBtn = qs("#modalClose");
    if (!dialog) return;
    if (closeBtn) closeBtn.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
        const rect = dialog.getBoundingClientRect();
        const inDialog = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inDialog) dialog.close();
    });
}


/* =========================================================================
   3. NAVIGAZIONE
   ========================================================================= */

function initNav() {
    const toggle = qs("#navToggle");
    const nav = qs("#siteNav");
    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });
        qsa("a", nav).forEach(a => a.addEventListener("click", () => {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        }));
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


/* =========================================================================
   4. TIMELINE "IL METODO"
   ========================================================================= */

function renderMetodoTimeline() {
    const container = qs("#metodoTimeline");
    if (!container) return;

    container.innerHTML = METODO_FASI.map((fase, i) => `
        <li class="timeline__item">
            <button type="button" class="timeline__step" data-step="${i}" aria-expanded="false" aria-controls="fase-detail-${fase.id}">
                <span class="timeline__number">${fase.numero}</span>
                <span class="timeline__name">${fase.nome}</span>
            </button>
            <div class="timeline__detail" id="fase-detail-${fase.id}" hidden>
                <p class="timeline__sintesi">${fase.sintesi}</p>
                <p class="timeline__dettaglio">${fase.dettaglio}</p>
            </div>
        </li>
    `).join("");

    qsa(".timeline__step", container).forEach(btn => {
        btn.addEventListener("click", () => {
            const detail = qs(`#${btn.getAttribute("aria-controls")}`);
            const isOpen = btn.getAttribute("aria-expanded") === "true";
            // chiudi tutti
            qsa(".timeline__step", container).forEach(b => b.setAttribute("aria-expanded", "false"));
            qsa(".timeline__detail", container).forEach(d => { d.hidden = true; });
            qsa(".timeline__item", container).forEach(li => li.classList.remove("is-active"));
            if (!isOpen) {
                btn.setAttribute("aria-expanded", "true");
                detail.hidden = false;
                btn.closest(".timeline__item").classList.add("is-active");
            }
        });
    });

    // Apri la prima fase di default
    const first = qs(".timeline__step", container);
    if (first) first.click();
}


/* =========================================================================
   5. PIANI DI TRATTAMENTO
   ========================================================================= */

function planCardHtml(plan) {
    return `
        <article class="card plan-card">
            <div class="card__top">
                <span class="badge badge--${plan.stato === 'validato' ? 'validato' : 'bozza'}">${plan.stato === 'validato' ? 'Validato' : 'Bozza'}</span>
                <span class="tag">${labelFor(plan.problematica)}</span>
            </div>
            <h3 class="card__title">${plan.nome}</h3>
            <p class="card__text">${plan.obiettivo}</p>
            <dl class="card__meta">
                <div><dt>Durata</dt><dd>${plan.durata}</dd></div>
                <div><dt>Sedute</dt><dd>${plan.numeroSedute}</dd></div>
            </dl>
            <button type="button" class="btn btn--ghost btn--small" data-plan-id="${plan.id}">Apri il piano</button>
        </article>
    `;
}

function planDetailHtml(plan) {
    return `
        <span class="badge badge--${plan.stato === 'validato' ? 'validato' : 'bozza'}">${plan.stato === 'validato' ? 'Validato' : 'Bozza'}</span>
        <h3 class="modal__title">${plan.nome}</h3>
        <p class="modal__subtitle">${labelFor(plan.problematica)}</p>
        <dl class="detail-list">
            <div><dt>Obiettivo</dt><dd>${plan.obiettivo}</dd></div>
            <div><dt>Condizioni iniziali</dt><dd>${plan.condizioniIniziali}</dd></div>
            <div><dt>Durata</dt><dd>${plan.durata}</dd></div>
            <div><dt>Numero di sedute</dt><dd>${plan.numeroSedute}</dd></div>
            <div><dt>Frequenza</dt><dd>${plan.frequenza}</dd></div>
            <div><dt>Fase preparatoria</dt><dd>${plan.fasePreparatoria}</dd></div>
            <div><dt>Attivi utilizzabili</dt><dd>${plan.attiviUtilizzabili.join(", ")}</dd></div>
            <div><dt>Tecnologia associabile</dt><dd>${plan.tecnologiaAssociabile}</dd></div>
            <div><dt>Trattamento cosmetico</dt><dd>${plan.trattamentoCosmetico}</dd></div>
            <div><dt>Home care</dt><dd>${plan.homeCare}</dd></div>
            <div><dt>Risultati attesi</dt><dd>${plan.risultatiAttesi}</dd></div>
        </dl>
        <p class="note-flag">${plan.note}</p>
    `;
}

function renderTreatmentPlans(filter) {
    const grid = qs("#piani-grid");
    if (!grid) return;
    const list = (!filter || filter === "tutti") ? treatmentPlans : treatmentPlans.filter(p => p.problematica === filter);
    grid.innerHTML = list.map(planCardHtml).join("") || `<p class="empty-state">Nessun piano trovato per questo filtro.</p>`;

    qsa("[data-plan-id]", grid).forEach(btn => {
        btn.addEventListener("click", () => {
            const plan = treatmentPlans.find(p => p.id === btn.dataset.planId);
            if (plan) openModal(planDetailHtml(plan));
        });
    });
}

function initPianiSection() {
    const filters = qs("#piani-filters");
    const categories = Array.from(new Set(treatmentPlans.map(p => p.problematica)));
    buildFilterBar(filters, categories, (filter) => renderTreatmentPlans(filter));
    renderTreatmentPlans("tutti");
}


/* =========================================================================
   6. PROTOCOL BUILDER
   ========================================================================= */

function populateSelect(select, options, placeholder) {
    if (!select) return;
    select.innerHTML = `<option value="">${placeholder}</option>` +
        options.map(o => `<option value="${o.value}">${o.label}</option>`).join("");
}

function initProtocolBuilder() {
    const form = qs("#protocolBuilder");
    if (!form) return;

    const selProblematica = qs("#pbProblematica");
    const selFase = qs("#pbFase");
    const selAttivo = qs("#pbAttivo");
    const selTecnologia = qs("#pbTecnologia");
    const selTrattamento = qs("#pbTrattamento");
    const selHomeCare = qs("#pbHomeCare");
    const summary = qs("#pbSummary");

    populateSelect(selProblematica, Array.from(new Set(treatmentPlans.map(p => p.problematica))).map(p => ({ value: p, label: labelFor(p) })), "Seleziona una problematica");
    populateSelect(selFase, METODO_FASI.map(f => ({ value: f.id, label: f.nome })), "Seleziona una fase");
    populateSelect(selAttivo, professionalProducts.map(p => ({ value: p.id, label: p.nome })), "Seleziona un attivo professionale");
    populateSelect(selTecnologia, [
        { value: "dermapen", label: "Dermapen / microneedling" },
        { value: "hydrapen", label: "Hydrapen" },
        { value: "dermoveicolazione", label: "Dermo-veicolazione" },
        { value: "led", label: "Maschera LED" }
    ], "Seleziona una tecnologia");
    populateSelect(selTrattamento, professionalProducts.map(p => ({ value: p.id, label: p.nome })), "Seleziona un trattamento cosmetico");
    populateSelect(selHomeCare, retailProducts.map(p => ({ value: p.id, label: p.nome })), "Seleziona un home care");

    function updateSummary() {
        const problematicaVal = selProblematica.value;
        const faseVal = selFase.value;
        const attivoVal = selAttivo.value;
        const tecnologiaVal = selTecnologia.value;
        const trattamentoVal = selTrattamento.value;
        const homeCareVal = selHomeCare.value;

        const nothingSelected = !problematicaVal && !faseVal && !attivoVal && !tecnologiaVal && !trattamentoVal && !homeCareVal;

        if (nothingSelected) {
            summary.innerHTML = `<p class="empty-state">Seleziona le voci qui sopra per costruire il tuo piano personalizzato.</p>`;
            return;
        }

        const attivo = professionalProducts.find(p => p.id === attivoVal);
        const trattamento = professionalProducts.find(p => p.id === trattamentoVal);
        const homeCare = retailProducts.find(p => p.id === homeCareVal);
        const fase = METODO_FASI.find(f => f.id === faseVal);
        const tecnologiaLabel = qs(`#pbTecnologia option[value="${tecnologiaVal}"]`);

        summary.innerHTML = `
            <h4 class="pb-summary__title">Riepilogo del piano personalizzato</h4>
            <dl class="detail-list">
                <div><dt>Problematica</dt><dd>${problematicaVal ? labelFor(problematicaVal) : "—"}</dd></div>
                <div><dt>Fase</dt><dd>${fase ? fase.nome : "—"}</dd></div>
                <div><dt>Attivo professionale</dt><dd>${attivo ? attivo.nome : "—"}</dd></div>
                <div><dt>Tecnologia</dt><dd>${tecnologiaVal ? tecnologiaLabel.textContent : "—"}</dd></div>
                <div><dt>Trattamento cosmetico</dt><dd>${trattamento ? trattamento.nome : "—"}</dd></div>
                <div><dt>Home care</dt><dd>${homeCare ? homeCare.nome : "—"}</dd></div>
            </dl>
            <p class="note-flag">CONTENUTO DA VALIDARE CON LA MASTER TRAINER prima dell'utilizzo con la cliente.</p>
        `;
    }

    [selProblematica, selFase, selAttivo, selTecnologia, selTrattamento, selHomeCare].forEach(sel => {
        sel.addEventListener("change", updateSummary);
    });

    updateSummary();

    const copyBtn = qs("#pbCopy");
    const printBtn = qs("#pbPrint");
    const resetBtn = qs("#pbReset");

    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            const text = summary.innerText;
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.textContent = "Copiato!";
                setTimeout(() => { copyBtn.textContent = "Copia riepilogo"; }, 2000);
            } catch (err) {
                copyBtn.textContent = "Copia non disponibile";
                setTimeout(() => { copyBtn.textContent = "Copia riepilogo"; }, 2000);
            }
        });
    }

    if (printBtn) {
        printBtn.addEventListener("click", () => window.print());
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            form.reset();
            updateSummary();
        });
    }
}


/* =========================================================================
   7. SCHEDE TECNICHE — ATTIVI PROFESSIONALI
   ========================================================================= */

function productCardHtml(product) {
    const imgPath = `assets/img/products/professional/${product.id}.jpg`;
    return `
        <article class="card product-card">
            ${imgTag(imgPath, product.nome, "card__img")}
            <div class="card__body">
                <span class="tag">${labelFor(product.categoria[0])}</span>
                <h3 class="card__title">${product.nome}</h3>
                <p class="card__text">${product.funzione}</p>
                <p class="card__meta-line"><strong>Attivi:</strong> ${product.principiAttivi}</p>
                <button type="button" class="btn btn--ghost btn--small" data-product-id="${product.id}">Apri scheda</button>
            </div>
        </article>
    `;
}

function productDetailHtml(product) {
    const imgPath = `assets/img/products/professional/${product.id}.jpg`;
    return `
        ${imgTag(imgPath, product.nome, "modal__img")}
        <span class="tag">${labelFor(product.categoria[0])}</span>
        <h3 class="modal__title">${product.nome}</h3>
        <p class="modal__subtitle">${product.quantita}</p>
        <dl class="detail-list">
            <div><dt>Descrizione</dt><dd>${product.descrizione}</dd></div>
            <div><dt>Attivi principali</dt><dd>${product.principiAttivi}</dd></div>
            <div><dt>Funzione</dt><dd>${product.funzione}</dd></div>
            <div><dt>Indicazioni</dt><dd>${product.indicazioni}</dd></div>
            <div><dt>Modalità di utilizzo</dt><dd>${product.modalitaUtilizzo}</dd></div>
            <div><dt>Utilizzo nel Protocollo Pelle Sana</dt><dd>${product.utilizzoProtocollo}</dd></div>
            <div><dt>Compatibilità</dt><dd>${product.compatibilita}</dd></div>
            <div><dt>Avvertenze</dt><dd>${product.avvertenze}</dd></div>
        </dl>
        <div class="modal__actions">
            <a class="btn btn--ghost btn--small" href="${product.pdfUrl}" target="_blank" rel="noopener">PDF ufficiale</a>
            ${product.videoUrl ? `<a class="btn btn--ghost btn--small" href="${product.videoUrl}" target="_blank" rel="noopener">Video tecnico</a>` : `<span class="note-flag">Video tecnico non ancora disponibile</span>`}
        </div>
    `;
}

function renderProfessionalProducts(filter) {
    const grid = qs("#schede-grid");
    if (!grid) return;
    const list = (!filter || filter === "tutti") ? professionalProducts : professionalProducts.filter(p => p.categoria.includes(filter));
    grid.innerHTML = list.map(productCardHtml).join("") || `<p class="empty-state">Nessun prodotto trovato per questo filtro.</p>`;

    qsa("[data-product-id]", grid).forEach(btn => {
        btn.addEventListener("click", () => {
            const product = professionalProducts.find(p => p.id === btn.dataset.productId);
            if (product) openModal(productDetailHtml(product));
        });
    });
}

function initSchedeTecnicheSection() {
    const filters = qs("#schede-filters");
    const categories = Array.from(new Set(professionalProducts.flatMap(p => p.categoria)));
    buildFilterBar(filters, categories, (filter) => renderProfessionalProducts(filter));
    renderProfessionalProducts("tutti");
}


/* =========================================================================
   8. HOME CARE + ROUTINE BUILDER
   ========================================================================= */

function retailCardHtml(product) {
    const imgPath = `assets/img/products/retail/${product.id}.jpg`;
    return `
        <article class="card product-card">
            ${imgTag(imgPath, product.nome, "card__img")}
            <div class="card__body">
                <span class="tag">${labelFor(product.categoria[0])}</span>
                <h3 class="card__title">${product.nome}</h3>
                <p class="card__text">${product.funzione}</p>
                <p class="card__meta-line"><strong>Attivi:</strong> ${product.principiAttivi}</p>
                <button type="button" class="btn btn--ghost btn--small" data-retail-id="${product.id}">Apri scheda</button>
            </div>
        </article>
    `;
}

function retailDetailHtml(product) {
    const imgPath = `assets/img/products/retail/${product.id}.jpg`;
    return `
        ${imgTag(imgPath, product.nome, "modal__img")}
        <span class="tag">${labelFor(product.categoria[0])}</span>
        <h3 class="modal__title">${product.nome}</h3>
        <p class="modal__subtitle">${product.quantita}</p>
        <dl class="detail-list">
            <div><dt>Funzione</dt><dd>${product.funzione}</dd></div>
            <div><dt>Principi attivi</dt><dd>${product.principiAttivi}</dd></div>
            <div><dt>Quando consigliarlo</dt><dd>${product.quandoConsigliarlo}</dd></div>
            <div><dt>Piano abbinato</dt><dd>${product.pianoAbbinato}</dd></div>
            <div><dt>Modalità d'uso</dt><dd>${product.modalitaUso}</dd></div>
            <div><dt>Routine</dt><dd>${product.routine === "mattina-sera" ? "Mattina e sera" : product.routine}</dd></div>
            <div><dt>Argomentazione commerciale</dt><dd>${product.argomentazioneCommerciale}</dd></div>
            <div><dt>Prodotto complementare</dt><dd>${product.prodottoComplementare}</dd></div>
        </dl>
        <div class="modal__actions">
            <a class="btn btn--ghost btn--small" href="${product.schedaUrl}" target="_blank" rel="noopener">Scheda scaricabile</a>
        </div>
    `;
}

function renderRetailProducts(filter) {
    const grid = qs("#homecare-grid");
    if (!grid) return;
    const list = (!filter || filter === "tutti") ? retailProducts : retailProducts.filter(p => p.categoria.includes(filter));
    grid.innerHTML = list.map(retailCardHtml).join("") || `<p class="empty-state">Nessun prodotto trovato per questo filtro. Categoria in fase di completamento.</p>`;

    qsa("[data-retail-id]", grid).forEach(btn => {
        btn.addEventListener("click", () => {
            const product = retailProducts.find(p => p.id === btn.dataset.retailId);
            if (product) openModal(retailDetailHtml(product));
        });
    });
}

function initHomeCareSection() {
    const filters = qs("#homecare-filters");
    const categories = ["detergenza", "sieri", "creme", "contorno-occhi", "post-trattamento", "mantenimento", "luminosita", "idratazione", "anti-age", "protezione"];
    buildFilterBar(filters, categories, (filter) => renderRetailProducts(filter));
    renderRetailProducts("tutti");
}

function initRoutineBuilder() {
    const form = qs("#routineBuilder");
    if (!form) return;

    const steps = [
        { select: qs("#rbDetersione"), categoria: "detergenza", label: "Detersione" },
        { select: qs("#rbTrattamento"), categoria: "sieri", label: "Trattamento" },
        { select: qs("#rbCrema"), categoria: "creme", label: "Crema" },
        { select: qs("#rbProtezione"), categoria: "protezione", label: "Protezione" }
    ];
    const result = qs("#rbResult");

    steps.forEach(step => {
        const options = retailProducts.filter(p => p.categoria.includes(step.categoria)).map(p => ({ value: p.id, label: p.nome }));
        if (!options.length) {
            options.push({ value: "", label: "Nessun prodotto disponibile — in arrivo" });
        }
        populateSelect(step.select, options, `Seleziona: ${step.label}`);
    });

    function updateResult() {
        const chosen = steps.map(step => {
            const product = retailProducts.find(p => p.id === step.select.value);
            return { label: step.label, product };
        });
        const anySelected = chosen.some(c => c.product);
        if (!anySelected) {
            result.innerHTML = `<p class="empty-state">Componi la routine selezionando un prodotto per ogni step.</p>`;
            return;
        }
        result.innerHTML = `
            <h4 class="pb-summary__title">La tua routine domiciliare</h4>
            <ol class="routine-list">
                ${chosen.map(c => `<li><strong>${c.label}:</strong> ${c.product ? c.product.nome : "—"}</li>`).join("")}
            </ol>
        `;
    }

    steps.forEach(step => step.select.addEventListener("change", updateResult));
    updateResult();
}


/* =========================================================================
   9. CASI STUDIO
   ========================================================================= */

function caseStudyCardHtml(caseStudy) {
    return `
        <article class="card case-card">
            <div class="ba-slider" data-case-id="${caseStudy.id}">
                <div class="ba-slider__after">${imgTag(caseStudy.fotoDopo, `${caseStudy.nome} — dopo`, "ba-slider__img")}</div>
                <div class="ba-slider__before" style="width:50%;">${imgTag(caseStudy.fotoPrima, `${caseStudy.nome} — prima`, "ba-slider__img")}</div>
                <span class="ba-slider__label ba-slider__label--before">Prima</span>
                <span class="ba-slider__label ba-slider__label--after">Dopo</span>
                <input type="range" min="0" max="100" value="50" class="ba-slider__range" aria-label="Confronta prima e dopo — ${caseStudy.nome}">
            </div>
            <div class="card__body">
                <h3 class="card__title">${caseStudy.nome}</h3>
                <p class="card__text"><strong>Problematica:</strong> ${caseStudy.problematicaIniziale}</p>
                <p class="card__text"><strong>Durata percorso:</strong> ${caseStudy.durata}</p>
                <p class="card__text"><strong>Piano effettuato:</strong> ${caseStudy.pianoEffettuato}</p>
                <p class="card__text"><strong>Attivi:</strong> ${caseStudy.attivi}</p>
                <p class="card__text"><strong>Tecnologie:</strong> ${caseStudy.tecnologie}</p>
                <p class="card__text"><strong>Home care:</strong> ${caseStudy.homeCare}</p>
                <p class="card__text"><strong>Osservazioni:</strong> ${caseStudy.osservazioni}</p>
                <blockquote class="case-testimonial">${caseStudy.testimonianza}</blockquote>
            </div>
        </article>
    `;
}

function renderCaseStudies() {
    const grid = qs("#casi-grid");
    if (!grid) return;
    grid.innerHTML = caseStudies.map(caseStudyCardHtml).join("");
    initBeforeAfterSliders();
}

function initBeforeAfterSliders() {
    qsa(".ba-slider").forEach(slider => {
        const range = qs(".ba-slider__range", slider);
        const before = qs(".ba-slider__before", slider);
        if (!range || !before) return;
        range.addEventListener("input", () => {
            before.style.width = `${range.value}%`;
        });
    });
}


/* =========================================================================
   10. VIDEO E FORMAZIONE
   ========================================================================= */

function videoCardHtml(video) {
    return `
        <article class="card video-card">
            <div class="video-card__thumb">
                ${imgTag(video.thumbnail, video.titolo, "card__img")}
                <span class="video-card__duration">${video.durata}</span>
            </div>
            <div class="card__body">
                <span class="tag">${labelFor(video.categoria)}</span>
                <h3 class="card__title">${video.titolo}</h3>
                <p class="card__meta-line"><strong>Livello:</strong> ${video.livello}</p>
                <p class="card__text">${video.descrizione}</p>
                ${video.url
                    ? `<a class="btn btn--ghost btn--small" href="${video.url}" target="_blank" rel="noopener">Guarda il video</a>`
                    : `<button type="button" class="btn btn--ghost btn--small" disabled>Video in arrivo</button>`}
            </div>
        </article>
    `;
}

function renderVideos(filter) {
    const grid = qs("#video-grid");
    if (!grid) return;
    const list = (!filter || filter === "tutti") ? videos : videos.filter(v => v.categoria === filter);
    grid.innerHTML = list.map(videoCardHtml).join("") || `<p class="empty-state">Nessun video trovato per questo filtro.</p>`;
}

function initFormazioneSection() {
    const filters = qs("#video-filters");
    const categories = Array.from(new Set(videos.map(v => v.categoria)));
    buildFilterBar(filters, categories, (filter) => renderVideos(filter));
    renderVideos("tutti");
}


/* =========================================================================
   11. MATERIALI
   ========================================================================= */

function resourceCardHtml(resource) {
    return `
        <article class="card resource-card">
            <span class="tag">${labelFor(resource.categoria)}</span>
            <h3 class="card__title">${resource.titolo}</h3>
            <p class="card__text">${resource.descrizione}</p>
            <p class="card__meta-line"><strong>Formato:</strong> ${resource.formato} · <strong>Aggiornato:</strong> ${resource.dataAggiornamento}</p>
            <div class="card__actions">
                <a class="btn btn--ghost btn--small" href="${resource.apriUrl}" target="_blank" rel="noopener">Apri</a>
                <a class="btn btn--ghost btn--small" href="${resource.scaricaUrl}" download>Scarica</a>
            </div>
        </article>
    `;
}

function renderResources(filter) {
    const grid = qs("#materiali-grid");
    if (!grid) return;
    const list = (!filter || filter === "tutti") ? resources : resources.filter(r => r.categoria === filter);
    grid.innerHTML = list.map(resourceCardHtml).join("") || `<p class="empty-state">Nessun documento trovato per questo filtro.</p>`;
}

function initMaterialiSection() {
    const filters = qs("#materiali-filters");
    const categories = Array.from(new Set(resources.map(r => r.categoria)));
    buildFilterBar(filters, categories, (filter) => renderResources(filter));
    renderResources("tutti");
}


/* =========================================================================
   12. FAQ
   ========================================================================= */

function faqItemHtml(item) {
    return `
        <details class="faq-item" data-group="${item.gruppo}">
            <summary>${item.domanda}</summary>
            <p>${item.risposta}</p>
        </details>
    `;
}

function renderFaq(filter) {
    const list = qs("#faq-list");
    if (!list) return;
    const items = (!filter || filter === "tutti") ? faqItems : faqItems.filter(f => f.gruppo === filter);
    list.innerHTML = items.map(faqItemHtml).join("") || `<p class="empty-state">Nessuna domanda trovata per questo filtro.</p>`;
}

function initFaqSection() {
    const filters = qs("#faq-filters");
    const categories = Array.from(new Set(faqItems.map(f => f.gruppo)));
    buildFilterBar(filters, categories, (filter) => renderFaq(filter));
    renderFaq("tutti");
}


/* =========================================================================
   13. INIT
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Anno corrente nel footer
    const yearEl = qs("#currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    initModal();
    initNav();
    renderMetodoTimeline();
    initPianiSection();
    initProtocolBuilder();
    initSchedeTecnicheSection();
    initHomeCareSection();
    initRoutineBuilder();
    renderCaseStudies();
    initFormazioneSection();
    initMaterialiSection();
    initFaqSection();
});
