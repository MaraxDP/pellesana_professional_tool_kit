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
    "prevenzione-skin-longevity": "Prevenzione e Skin Longevity",
    "rughe-perdita-tono": "Rughe e Perdita di Tono",
    "macchie-discromie": "Macchie e Discromie",
    "cicatrici-esiti-post-acne": "Cicatrici ed Esiti Post Acne",
    "colorito-spento": "Colorito Spento",
    "texture-irregolare": "Texture Irregolare",
    // Attivi professionali
    "acidi-cosmetici": "Acidi Cosmetici",
    "biorivitalizzanti": "Biorivitalizzanti",
    "fiale-sterili": "Fiale Sterili",
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

// Le 6 fasi del protocollo, riutilizzate sia dalla timeline sia dai piani di trattamento
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
// -------------------------------------------------------------------------

// Ordine fisso delle categorie mostrate nella barra filtri (oltre a "Tutti")
const PIANI_CATEGORIES = [
    "prevenzione-skin-longevity",
    "rughe-perdita-tono",
    "macchie-discromie",
    "cicatrici-esiti-post-acne",
    "colorito-spento",
    "texture-irregolare"
];

const treatmentPlans = [
    {
        id: "plan-pelle-spenta",
        nome: "Piano Luminosità",
        categorie: ["colorito-spento"],
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
        stato: "bozza"
    },
    {
        id: "plan-disidratazione",
        nome: "Piano Idratazione Profonda",
        categorie: ["colorito-spento", "texture-irregolare"],
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
        stato: "bozza"
    },
    {
        id: "plan-rughe-tono",
        nome: "Piano Tono e Compattezza",
        categorie: ["rughe-perdita-tono"],
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
        stato: "bozza"
    },
    {
        id: "plan-fotoinvecchiamento",
        nome: "Piano Anti-Fotoinvecchiamento",
        categorie: ["rughe-perdita-tono", "texture-irregolare"],
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
        stato: "bozza"
    },
    {
        id: "plan-macchie-discromie",
        nome: "Piano Uniformità e Depigmentazione",
        categorie: ["macchie-discromie"],
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
        stato: "bozza"
    },
    {
        id: "plan-texture-irregolare",
        nome: "Piano Levigatezza",
        categorie: ["texture-irregolare"],
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
        stato: "bozza"
    },
    {
        id: "plan-cicatrici-post-acne",
        nome: "Piano Rigenerazione Post-Acne",
        categorie: ["cicatrici-esiti-post-acne", "texture-irregolare"],
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
        stato: "bozza"
    },
    {
        id: "plan-pelle-matura",
        nome: "Piano Pelle Matura",
        categorie: ["rughe-perdita-tono", "colorito-spento"],
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
        stato: "bozza"
    },
    {
        id: "plan-pelle-impura",
        nome: "Piano Riequilibrio Pelle Impura",
        categorie: ["texture-irregolare"],
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
        stato: "bozza"
    },
    {
        id: "plan-prevenzione-longevity",
        nome: "Piano Skin Longevity",
        categorie: ["prevenzione-skin-longevity"],
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
        stato: "bozza"
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
    "fiale-sterili",
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
        modalitaUtilizzo: "Uso professionale topico su viso, dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/adrn-plus.pdf",
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
        pdfUrl: "assets/docs/schede-tecniche/nad-plus-glow.pdf",
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
        modalitaUtilizzo: "Applicazione manuale su viso deterso; valutare neutralizzazione.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/oily-skin-peeling-plus.pdf",
        videoUrl: ""
    },
    {
        id: "hyaluronic-acid-3",
        nome: "Hyaluronic Acid 3%",
        categoria: ["fiale-sterili"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido ialuronico ad alta concentrazione",
        funzione: "Idrata, dona volume e leviga la pelle.",
        descrizione: "Soluzione sterile ad alta concentrazione di acido ialuronico.",
        indicazioni: "Disidratazione, pelle spenta, prevenzione delle rughe.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/hyaluronic-acid-3.pdf",
        videoUrl: ""
    },
    {
        id: "organic-silicio-6",
        nome: "Organic Silicio 6%",
        categoria: ["fiale-sterili"],
        quantita: "Box 5x5ml",
        principiAttivi: "Silicio organico (Methylsilanol Mannuronate)",
        funzione: "Stimola collagene ed elastina, protegge l'architettura cutanea.",
        descrizione: "Sostanza versatile per migliorare tono e consistenza della pelle.",
        indicazioni: "Rughe, pelle secca, texture irregolare.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/organic-silicio-6.pdf",
        videoUrl: ""
    },
    {
        id: "botx-like-argireline-10",
        nome: "Botx Like Argireline 10%",
        categoria: ["fiale-sterili"],
        quantita: "Box 5x5ml",
        principiAttivi: "Argireline® (esapeptide), niacinamide",
        funzione: "Effetto tensore simile alla tossina botulinica, azione antiossidante.",
        descrizione: "Esapeptide antirughe che migliora tono e texture della pelle.",
        indicazioni: "Rughe di espressione, perdita di tono.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/botx-like-argireline-10.pdf",
        videoUrl: ""
    },
    {
        id: "brightening-cocktail",
        nome: "Brightening Cocktail",
        categoria: ["fiale-sterili"],
        quantita: "Box 5x5ml",
        principiAttivi: "Kiwi, estratto di liquirizia (Glycyrrhiza Glabra), Sophora flavescens",
        funzione: "Schiarisce e uniforma il tono della pelle.",
        descrizione: "Siero viso con ingredienti naturali e attivi schiarenti.",
        indicazioni: "Macchie, discromie, incarnato spento.",
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
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/polyvitaminic.pdf",
        videoUrl: ""
    },
    {
        id: "vitamin-c-10",
        nome: "Vitamin C 10%",
        categoria: ["fiale-sterili"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido ascorbico 10%",
        funzione: "Dona luminosità, uniforma il tono e migliora l'elasticità.",
        descrizione: "Soluzione sterile per una pelle radiosa e levigata.",
        indicazioni: "Fotoinvecchiamento, macchie, incarnato spento.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/vitamin-c-10.pdf",
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
        pdfUrl: "assets/docs/schede-tecniche/tranexamic-acid.pdf",
        videoUrl: ""
    },
    {
        id: "growth-factor-gf1",
        nome: "Growth Factor GF#1",
        categoria: ["fiale-sterili"],
        quantita: "Box 5x5ml",
        principiAttivi: "Peptidi biomimetici, vitamina C, glicogeno, Gatuline Spot-Light",
        funzione: "Ripristina i processi cutanei e ritarda gli effetti dell'invecchiamento.",
        descrizione: "Vitamine e peptidi identici ai fattori di crescita naturali.",
        indicazioni: "Fotoinvecchiamento, macchie, cicatrici post-acne.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/growth-factor-gf1.pdf",
        videoUrl: ""
    },
    {
        id: "mix-ha-dmae-silicio",
        nome: "Mix 1% HA + 1% DMAE + 0,5% Silicio Organico",
        categoria: ["fiale-sterili"],
        quantita: "Box 5x5ml",
        principiAttivi: "Acido ialuronico, DMAE, silicio organico",
        funzione: "Effetto lifting e idratazione profonda, stimola il metabolismo cellulare.",
        descrizione: "Proprietà tensorie e idratanti che contrastano la flaccidità di viso e corpo.",
        indicazioni: "Rughe, perdita di tono, flaccidità.",
        modalitaUtilizzo: "Applicazione manuale o dermapen/hydrapen/dermo-veicolatore.",
        avvertenze: "Non ingerire, non iniettare. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/mix-ha-dmae-silicio.pdf",
        videoUrl: ""
    },
    {
        id: "flash-eye",
        nome: "Flash Eye",
        categoria: ["fiale-sterili"],
        quantita: "Box 5x5ml",
        principiAttivi: "Peptidi, acido ialuronico, caffeina, niacinamide",
        funzione: "Riduce borse e occhiaie, azione antiossidante e anti-età per il contorno occhi.",
        descrizione: "Soluzione mirata per la delicata zona del contorno occhi.",
        indicazioni: "Borse, occhiaie, segni di stanchezza perioculare.",
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
        modalitaUtilizzo: "Applicare alcune gocce sui capelli asciutti o bagnati.",
        avvertenze: "Non ingerire. Evitare il contatto con mucose, ferite e occhi.",
        pdfUrl: "assets/docs/schede-tecniche/regenerating-hair-serum.pdf",
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
        pdfUrl: "assets/docs/schede-tecniche/mask-biogel-exoderm.pdf",
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
        modalitaUtilizzo: "Massaggiare delicatamente e risciacquare.",
        avvertenze: "Non ingerire. Evitare il contatto con gli occhi.",
        pdfUrl: "assets/docs/schede-tecniche/white-mousse-cleansing-foam.pdf",
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
        modalitaUtilizzo: "Applicare sulle labbra deterse per 15-20 minuti.",
        avvertenze: "Non usare in presenza di ferite o herpes labiale.",
        pdfUrl: "assets/docs/schede-tecniche/golden-kiss-lip-mask.pdf",
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
        pdfUrl: "assets/docs/schede-tecniche/golden-eye-patch.pdf",
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
        pdfUrl: "assets/docs/schede-tecniche/exobio-plus.pdf",
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
        pdfUrl: "assets/docs/schede-tecniche/dr-pen-ultima-a6.pdf",
        videoUrl: ""
    }
];

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
        schedaUrl: "assets/docs/home-care/exobio-facial-cream.pdf"
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
        schedaUrl: "assets/docs/home-care/exobio-eye-contour.pdf"
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
        schedaUrl: "assets/docs/home-care/exobio-facial-serum.pdf"
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
        schedaUrl: "assets/docs/home-care/adrn-pro-facial-cream.pdf"
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
        schedaUrl: "assets/docs/home-care/adrn-pro-eye-contour.pdf"
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
        schedaUrl: "assets/docs/home-care/adrn-pro-facial-serum.pdf"
    }
];

// -------------------------------------------------------------------------
// RISULTATI — CONTENUTO DA COMPLETARE
// Struttura predisposta, in attesa di foto, dati e testimonianze reali.
// -------------------------------------------------------------------------
const caseStudies = [
    {
        id: "caso-adriana",
        nome: "Adriana",
        fotoPrima: "assets/img/case-studies/adriana-prima.jpg",
        fotoDopo: "assets/img/case-studies/adriana-dopo.jpg",
        problematicaIniziale: "Pelle matura con rughe periorbitali e frontali marcate, perdita di tono e densità cutanea, incarnato spento e texture superficiale irregolare.",
        durata: "10 settimane",
        pianoEffettuato: "Fase preparatoria con complesso vitaminico seguita dal Piano Pelle Matura del Protocollo Pelle Sana: 6 sedute a cadenza di 10-14 giorni, con monitoraggio progressivo e mantenimento domiciliare.",
        attivi: "ADRN Plus, Growth Factor GF#1, trattamento cosmetico NAD Plus Glow",
        tecnologie: "Dermapen (microneedling) per la veicolazione degli attivi",
        homeCare: "ADRN Pro Facial Cream, ADRN Pro Eye Contour",
        osservazioni: "Nel corso delle sedute la pelle ha mostrato una risposta progressiva e costante: texture più levigata, incarnato più uniforme e luminoso, maggiore compattezza percepita su zigomi e contorno occhi. Il miglioramento della qualità cutanea è risultato coerente con la costanza mantenuta nella routine domiciliare consigliata.",
        testimonianza: "Ho iniziato questo percorso senza troppe aspettative, ma già dopo le prime sedute ho notato la pelle più morbida e riposata. Con il tempo il cambiamento è diventato evidente anche agli occhi di chi mi sta vicino. Quello che è cambiato di più, però, è come mi sento io: allo specchio non mi soffermo più sui segni del tempo, ma su quanto la mia pelle sia sana e curata. Un percorso fatto con calma, seduta dopo seduta, e ne è valsa davvero la pena."
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
// FORMAZIONE E RISORSE — 3 aree gestite da questo array (video introduttivi,
// materiali marketing, anamnesi). L'area "Video Training" ha una sorgente
// dati dedicata: vedi videoTrainingItems più sotto.
// PLACEHOLDER in attesa dei contenuti e link definitivi.
// -------------------------------------------------------------------------
const formazioneItems = [
    // A. Video introduttivi
    { id: "form-01", area: "introduttivi", tipo: "video", titolo: "[Titolo da inserire] — Cos'è il Protocollo Pelle Sana", durata: "--:--", formato: "", descrizione: "Presentazione generale del metodo: cos'è e come nasce.", url: "" },
    { id: "form-02", area: "introduttivi", tipo: "video", titolo: "[Titolo da inserire] — La filosofia Skin Longevity", durata: "--:--", formato: "", descrizione: "Perché il protocollo lavora sulla salute della pelle nel tempo.", url: "" },
    { id: "form-03", area: "introduttivi", tipo: "video", titolo: "[Titolo da inserire] — Come è strutturato il percorso", durata: "--:--", formato: "", descrizione: "Il ruolo della professionista e le fasi del percorso.", url: "" },

    // B. Materiali marketing
    { id: "form-07", area: "marketing", tipo: "documento", titolo: "[Materiale da inserire] — Kit visual social", durata: "", formato: "ZIP", descrizione: "Visual, Reel, caption e stories pronte per i social.", url: "assets/docs/materiali/kit-social.zip", downloadUrl: "assets/docs/materiali/kit-social.zip" },
    { id: "form-09", area: "marketing", tipo: "documento", titolo: "[Materiale da inserire] — Locandina Open Day", durata: "", formato: "PDF", descrizione: "Materiale stampabile per eventi Open Day in cabina.", url: "assets/docs/materiali/locandina-open-day.pdf", downloadUrl: "assets/docs/materiali/locandina-open-day.pdf" },

    // C. Anamnesi
    { id: "form-10", area: "anamnesi", tipo: "documento", titolo: "[Contenuto da inserire] — Guida alla raccolta anamnesi", durata: "", formato: "PDF", descrizione: "Come condurre un'anamnesi completa con la cliente.", url: "assets/docs/materiali/guida-anamnesi.pdf", downloadUrl: "assets/docs/materiali/guida-anamnesi.pdf" },
    { id: "form-11", area: "anamnesi", tipo: "documento", titolo: "Modulo di consenso trattamento", durata: "", formato: "PDF", descrizione: "Modulo completo di consenso informato: trattamento estetico professionale, dati anamnestici e utilizzo di fotografie e video. Da personalizzare con i dati del centro e sottoporre a verifica privacy/legale prima dell'uso.", url: "assets/docs/materiali/modulo-consenso.pdf", downloadUrl: "assets/docs/materiali/modulo-consenso.pdf" },
    { id: "form-12", area: "anamnesi", tipo: "documento", titolo: "Checklist di valutazione iniziale", durata: "", formato: "PDF", descrizione: "Scheda Anamnesi Cliente: raccolta dati, stile di vita, obiettivi, inestetismi e valutazione professionale per la pianificazione del percorso.", url: "assets/docs/materiali/scheda-anamnesi-cliente.pdf", downloadUrl: "assets/docs/materiali/scheda-anamnesi-cliente.pdf" }
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
        youtubeUrl: "https://www.youtube.com/embed/coxE8pImY-4",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
        coverImage: "assets/images/video-training/video-training-01.png",
        updatedAt: "2026-07-29"
    },
    {
        id: "video-training-02",
        title: "Biorivitalizzazione Viso",
        description: "Tecniche e indicazioni per i trattamenti biorivitalizzanti viso.",
        category: "Video Training",
        youtubeUrl: "https://www.youtube.com/embed/Fs_qGJiIBK4",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
        coverImage: "assets/images/video-training/video-training-02.png",
        updatedAt: "2026-07-29"
    },
    {
        id: "video-training-03",
        title: "Trattamento Viso Ricostituente",
        description: "Sequenza operativa del trattamento professionale ricostituente.",
        category: "Video Training",
        youtubeUrl: "https://www.youtube.com/embed/gw-HXZdVps0",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
        coverImage: "assets/images/video-training/video-training-03.png",
        updatedAt: "2026-07-29"
    },
    {
        id: "video-training-04",
        title: "Lip Volume & EyeCare",
        description: "Protocollo professionale dedicato alla zona labbra e contorno occhi.",
        category: "Video Training",
        youtubeUrl: "https://www.youtube.com/embed/TwNs_nLP0uk",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
        coverImage: "assets/images/video-training/video-training-04.png",
        updatedAt: "2026-07-29"
    },
    {
        id: "video-training-05",
        title: "ExoHair Plus",
        description: "Indicazioni operative per l'utilizzo professionale di ExoHair Plus.",
        category: "Video Training",
        youtubeUrl: "https://www.youtube.com/embed/kJgfP5uzHUY",
        downloadUrl: "", // INSERIRE QUI IL LINK DIRETTO PER IL DOWNLOAD DEL VIDEO
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
const resources = [
    { id: "doc-01", titolo: "[Documento da inserire] — Brochure Protocollo Pelle Sana", categoria: "brochure", descrizione: "Brochure di presentazione del protocollo per le clienti.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/brochure.pdf", scaricaUrl: "assets/docs/materiali/brochure.pdf" },
    { id: "doc-02", titolo: "[Documento da inserire] — Listino prezzi professionale", categoria: "listini", descrizione: "Listino prodotti e trattamenti aggiornato.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/listino.pdf", scaricaUrl: "assets/docs/materiali/listino.pdf" },
    { id: "doc-03", titolo: "Modulo di consenso trattamento", categoria: "moduli", descrizione: "Modulo completo di consenso informato: trattamento estetico professionale, dati anamnestici e utilizzo di fotografie e video. Da personalizzare con i dati del centro e sottoporre a verifica privacy/legale prima dell'uso.", formato: "PDF", dataAggiornamento: "2026-07-27", apriUrl: "assets/docs/materiali/modulo-consenso.pdf", scaricaUrl: "assets/docs/materiali/modulo-consenso.pdf" },
    { id: "doc-04", titolo: "Scheda Anamnesi Cliente", categoria: "schede-anamnesi", descrizione: "Scheda per la raccolta dati, stile di vita, obiettivi, inestetismi e valutazione professionale della cliente, con piano di trattamento.", formato: "PDF", dataAggiornamento: "2026-07-27", apriUrl: "assets/docs/materiali/scheda-anamnesi-cliente.pdf", scaricaUrl: "assets/docs/materiali/scheda-anamnesi-cliente.pdf" },
    { id: "doc-05", titolo: "[Documento da inserire] — Locandina stampabile in cabina", categoria: "materiale-stampabile", descrizione: "Materiale da stampare ed esporre in cabina estetica.", formato: "PDF", dataAggiornamento: "2026-07-23", apriUrl: "assets/docs/materiali/locandina.pdf", scaricaUrl: "assets/docs/materiali/locandina.pdf" }
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
    '<rect width="400" height="300" fill="#f7f2ee"/>' +
    '<text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#213f5e" text-anchor="middle" dominant-baseline="middle">In arrivo</text>' +
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
function openModal(html, variant) {
    const dialog = qs("#detailModal");
    const body = qs("#modalBody");
    if (!dialog || !body) return;
    body.innerHTML = html;
    dialog.classList.toggle("modal--video", variant === "video");
    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    } else {
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
    });
}


/* =========================================================================
   3. NAVIGAZIONE + TORNA IN ALTO
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

    container.innerHTML = METODO_FASI.map((fase, i) => `
        <li class="phases__item ${i % 2 === 0 ? "phases__item--right" : "phases__item--left"}">
            <span class="phases__marker" aria-hidden="true"></span>
            <div class="phases__content">
                <span class="phases__number">${fase.numero}</span>
                <h4 class="phases__name">${fase.nome}</h4>
                <p class="phases__sintesi">${fase.sintesi}</p>
                <p class="phases__dettaglio">${fase.dettaglio}</p>
            </div>
        </li>
    `).join("");

    initPhasesScrollReveal(container);
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


/* =========================================================================
   5. PIANI DI TRATTAMENTO (righe accordion + modal)
   ========================================================================= */

function planDetailHtml(plan) {
    return `
        <span class="badge badge--${plan.stato === 'validato' ? 'validato' : 'bozza'}">${plan.stato === 'validato' ? 'Validato' : 'Bozza'}</span>
        <h3 class="modal__title">${plan.nome}</h3>
        <p class="modal__subtitle">${labelFor(plan.categorie[0])}</p>
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
    `;
}

function planRowHtml(plan) {
    return `
        <details class="plan-row">
            <summary class="plan-row__summary">
                <div class="plan-row__summary-main">
                    <span class="badge badge--${plan.stato === 'validato' ? 'validato' : 'bozza'}">${plan.stato === 'validato' ? 'Validato' : 'Bozza'}</span>
                    <span class="tag">${labelFor(plan.categorie[0])}</span>
                    <h3 class="plan-row__title">${plan.nome}</h3>
                    <p class="plan-row__objective">${plan.obiettivo}</p>
                </div>
                <dl class="plan-row__meta">
                    <div><dt>Durata</dt><dd>${plan.durata}</dd></div>
                    <div><dt>Sedute</dt><dd>${plan.numeroSedute}</dd></div>
                </dl>
                <span class="plan-row__chevron" aria-hidden="true">⌄</span>
            </summary>
            <div class="plan-row__content">
                <dl class="detail-list">
                    <div><dt>Condizioni iniziali</dt><dd>${plan.condizioniIniziali}</dd></div>
                    <div><dt>Frequenza</dt><dd>${plan.frequenza}</dd></div>
                    <div><dt>Fase preparatoria</dt><dd>${plan.fasePreparatoria}</dd></div>
                    <div><dt>Attivi utilizzabili</dt><dd>${plan.attiviUtilizzabili.join(", ")}</dd></div>
                    <div><dt>Tecnologia associabile</dt><dd>${plan.tecnologiaAssociabile}</dd></div>
                    <div><dt>Trattamento cosmetico</dt><dd>${plan.trattamentoCosmetico}</dd></div>
                    <div><dt>Home care</dt><dd>${plan.homeCare}</dd></div>
                    <div><dt>Risultati attesi</dt><dd>${plan.risultatiAttesi}</dd></div>
                </dl>
                <button type="button" class="btn btn--outline btn--small" data-plan-id="${plan.id}">Apri il piano completo</button>
            </div>
        </details>
    `;
}

function renderTreatmentPlans(filter) {
    const list = qs("#piani-list");
    if (!list) return;
    const items = (!filter || filter === "tutti") ? treatmentPlans : treatmentPlans.filter(p => p.categorie.includes(filter));
    list.innerHTML = items.map(planRowHtml).join("") || `<p class="empty-state">Nessun piano trovato per questo filtro.</p>`;

    qsa("[data-plan-id]", list).forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const plan = treatmentPlans.find(p => p.id === btn.dataset.planId);
            if (plan) openModal(planDetailHtml(plan));
        });
    });
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
            <div><dt>Avvertenze</dt><dd>${product.avvertenze}</dd></div>
        </dl>
        <div class="modal__actions">
            <a class="btn btn--ghost btn--small" href="${product.pdfUrl}" target="_blank" rel="noopener">Scheda tecnica ufficiale</a>
            ${product.videoUrl ? `<a class="btn btn--ghost btn--small" href="${product.videoUrl}" target="_blank" rel="noopener">Video tecnico</a>` : `<span class="note-flag">Video tecnico non ancora disponibile</span>`}
        </div>
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
    return `
        ${imgTag(imgPath, product.nome, "modal__img")}
        <span class="tag">${labelFor(product.categoria[0])}</span>
        <h3 class="modal__title">${product.nome}</h3>
        <p class="modal__subtitle">${product.quantita}</p>
        <dl class="detail-list">
            <div><dt>Funzione</dt><dd>${product.funzione}</dd></div>
            <div><dt>Principi attivi</dt><dd>${product.principiAttivi}</dd></div>
            <div><dt>Piano abbinato</dt><dd>${product.pianoAbbinato}</dd></div>
            <div><dt>Modalità d'uso</dt><dd>${product.modalitaUso}</dd></div>
            <div><dt>Routine</dt><dd>${product.routine === "mattina-sera" ? "Mattina e sera" : product.routine}</dd></div>
            <div><dt>Prodotto complementare</dt><dd>${product.prodottoComplementare}</dd></div>
        </dl>
        <div class="modal__actions">
            <a class="btn btn--ghost btn--small" href="${product.schedaUrl}" target="_blank" rel="noopener">Scheda scaricabile</a>
        </div>
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
                <div class="ba-slider__before" style="width:50%;">${imgTag(caseStudy.fotoPrima, `${caseStudy.nome} — prima`, "ba-slider__img")}</div>
                <span class="ba-slider__label ba-slider__label--before">Prima</span>
                <span class="ba-slider__label ba-slider__label--after">Dopo</span>
                <input type="range" min="0" max="100" value="50" class="ba-slider__range" aria-label="Confronta prima e dopo — ${caseStudy.nome}">
            </div>
            <div class="case-split__body">
                <h3 class="case-split__name">${caseStudy.nome}</h3>
                <p class="case-split__row"><strong>Problematica:</strong> ${caseStudy.problematicaIniziale}</p>
                <p class="case-split__row"><strong>Durata percorso:</strong> ${caseStudy.durata}</p>
                <p class="case-split__row"><strong>Piano effettuato:</strong> ${caseStudy.pianoEffettuato}</p>
                <p class="case-split__row"><strong>Attivi:</strong> ${caseStudy.attivi}</p>
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
        const before = qs(".ba-slider__before", slider);
        if (!range || !before) return;
        range.addEventListener("input", () => {
            before.style.width = `${range.value}%`;
        });
    });
}


/* =========================================================================
   9. FORMAZIONE E RISORSE (tab + liste)
   ========================================================================= */

function formazioneRowHtml(item) {
    const metaParts = [];
    if (item.durata) metaParts.push(item.durata);
    if (item.formato) metaParts.push(item.formato);
    const metaLine = metaParts.length ? metaParts.join(" · ") : (item.tipo === "video" ? "Video" : "Documento");

    return `
        <article class="list-row">
            <div class="list-row__body">
                <h3 class="list-row__title">${item.titolo}</h3>
                <p class="list-row__text">${item.descrizione}</p>
                <p class="list-row__meta">${metaLine}</p>
            </div>
            <div class="list-row__actions">
                ${item.url
                    ? `<a class="btn btn--ghost btn--small" href="${item.url}" target="_blank" rel="noopener">${item.tipo === "video" ? "Guarda" : "Apri"}</a>`
                    : `<button type="button" class="btn btn--ghost btn--small" disabled>In arrivo</button>`}
                ${item.downloadUrl ? `<a class="btn btn--ghost btn--small" href="${item.downloadUrl}" download>Scarica</a>` : ""}
            </div>
        </article>
    `;
}

function videoTrainingItemHtml(item) {
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
                <div class="video-editorial__actions">
                    <button type="button" class="btn btn--primary btn--small" data-video-id="${item.id}">Guarda il video</button>
                    ${item.downloadUrl ? `<a class="btn btn--outline btn--small" href="${item.downloadUrl}" download>Scarica il video</a>` : ""}
                </div>
            </div>
        </article>
    `;
}

function videoModalHtml(item) {
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
        ${item.downloadUrl ? `<div class="modal__actions"><a class="btn btn--ghost btn--small" href="${item.downloadUrl}" download>Scarica il video</a></div>` : ""}
    `;
}

function renderVideoTraining(list) {
    list.innerHTML = videoTrainingItems.map(videoTrainingItemHtml).join("") || `<p class="empty-state">Contenuti in arrivo per quest'area.</p>`;

    qsa("[data-video-id]", list).forEach(el => {
        el.addEventListener("click", () => {
            const item = videoTrainingItems.find(v => v.id === el.dataset.videoId);
            if (item) openModal(videoModalHtml(item), "video");
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
                <h3 class="list-row__title">${resource.titolo}</h3>
                <p class="list-row__text">${resource.descrizione}</p>
                <p class="list-row__meta">${resource.formato} · Aggiornato il ${resource.dataAggiornamento}</p>
            </div>
            <div class="list-row__side">
                <span class="tag">${labelFor(resource.categoria)}</span>
                <div class="list-row__actions">
                    <a class="btn btn--ghost btn--small" href="${resource.apriUrl}" target="_blank" rel="noopener">Apri</a>
                    <a class="btn btn--ghost btn--small" href="${resource.scaricaUrl}" download>Scarica</a>
                </div>
            </div>
        </article>
    `;
}

function renderResources(filter) {
    const list = qs("#materiali-list");
    if (!list) return;
    const items = (!filter || filter === "tutti") ? resources : resources.filter(r => r.categoria === filter);
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

    initModal();
    initNav();
    initBackToTop();
    renderMetodoTimeline();
    initPianiSection();
    initSchedeTecnicheSection();
    initHomeCareSection();
    renderCaseStudies();
    initFormazioneSection();
    initMaterialiSection();
});
