# Guida ai contenuti da inserire — Protocollo Pelle Sana

Questo file spiega **esattamente dove mettere** immagini, PDF e link quando
saranno disponibili i contenuti ufficiali. I nomi dei file indicati qui sotto
sono già referenziati nel codice (`script.js`): basta salvare il file con lo
stesso nome nella cartella corretta perché compaia automaticamente al posto
del placeholder "Immagine in arrivo".

## Logo

- `assets/img/logo/logo-protocollo-pelle-sana.png` — file usato nell'header.
  È stato generato automaticamente da `logo_ps.jpg` (ritaglio dello spazio
  vuoto + sfondo nero reso trasparente), perché il JPG originale è un poster
  a piena pagina su sfondo nero e il formato JPG non supporta la trasparenza.
  Essendo derivato da un JPEG, ha una qualità leggermente inferiore a un
  export vettoriale: **se in futuro sarà disponibile un export ufficiale
  in PNG/SVG a sfondo trasparente** (da Illustrator/Figma/Canva), sostituire
  questo file mantenendo lo stesso nome — comparirà automaticamente al posto
  di quello attuale, senza toccare il codice.
- `assets/img/logo/logo_ps.jpg` — file originale caricato (poster completo,
  sfondo nero), mantenuto come riferimento/sorgente.

## Visual principale della home

- `assets/img/hero/hero-main.jpg` (o aggiornare il riquadro placeholder in
  `index.html`, sezione `#hero`, con il tag `<img>` definitivo).

## Prodotti professionali (Schede Tecniche)

Cartella: `assets/img/products/professional/`
Un'immagine per prodotto, nome file = id prodotto in `script.js` + `.jpg`:

```
exobio-plus.jpg              adrn-plus.jpg                 nad-plus-glow.jpg
exohair-plus.jpg             antiaging-peeling-cocktail.jpg
depigmenting-peeling-plus.jpg  oily-skin-peeling-plus.jpg
hyaluronic-acid-3.jpg        organic-silicio-6.jpg         botx-like-argireline-10.jpg
brightening-cocktail.jpg     polyvitaminic.jpg             vitamin-c-10.jpg
tranexamic-acid.jpg          growth-factor-gf1.jpg         mix-ha-dmae-silicio.jpg
flash-eye.jpg                regenerating-hair-serum.jpg   mask-biogel-exoderm.jpg
peptigenol-skin-antiox.jpg   micro-peeling.jpg             neutralizing-solution.jpg
repair-balm.jpg              white-mousse-cleansing-foam.jpg
bioled-facial-mask.jpg       golden-kiss-lip-mask.jpg      golden-eye-patch.jpg
```

I PDF ufficiali delle schede tecniche vanno in
`assets/docs/schede-tecniche/<id-prodotto>.pdf` (stessi nomi di cui sopra).

## Prodotti home care (rivendita)

Cartella: `assets/img/products/retail/`

```
exobio-facial-cream.jpg   exobio-eye-contour.jpg   exobio-facial-serum.jpg
adrn-pro-facial-cream.jpg adrn-pro-eye-contour.jpg adrn-pro-facial-serum.jpg
```

Le schede scaricabili vanno in `assets/docs/home-care/<id-prodotto>.pdf`.

## Casi studio

Cartella: `assets/img/case-studies/`

```
adriana-prima.jpg    adriana-dopo.jpg
francesca-prima.jpg  francesca-dopo.jpg
```

I testi del caso studio (problematica, durata, piano, attivi, tecnologie,
home care, osservazioni, testimonianza) vanno aggiornati nell'oggetto
`caseStudies` in `script.js` (cercare i commenti `[... da inserire]`).
Per aggiungere un nuovo caso studio, duplicare un oggetto dell'array e
aggiornare `id`, immagini e testi: la card e lo slider prima/dopo vengono
generati automaticamente.

## Formazione e risorse

La sezione è organizzata in 4 aree fisse (tab): Video introduttivi, Video
training, Materiali marketing, Anamnesi. Ogni contenuto è un oggetto
nell'array `formazioneItems` in `script.js`, con campo `area` che determina
sotto quale tab compare. Per aggiornare un contenuto, modificare `titolo`,
`descrizione`, `durata`/`formato` e soprattutto `url` (link al video o al
documento) e, se scaricabile, `downloadUrl`. Per aggiungerne uno nuovo,
duplicare un oggetto esistente nell'area corretta.

I documenti scaricabili di quest'area vanno in `assets/docs/materiali/`
con i nomi già indicati nei campi `url`/`downloadUrl` (es.
`kit-social.zip`, `script-consulenza.pdf`, `guida-anamnesi.pdf`,
`consenso-immagini.pdf`, `checklist-valutazione.pdf`).

## Libreria materiali

Cartella: `assets/docs/materiali/` — i nomi file attesi sono già scritti nei
campi `apriUrl` / `scaricaUrl` dell'array `resources` in `script.js`
(`brochure.pdf`, `listino.pdf`, `modulo-consenso.pdf`, `scheda-anamnesi.pdf`,
`locandina.pdf`). I filtri ammessi in questa sezione sono solo cinque:
Brochure, Listini, Moduli, Schede anamnesi, Materiale stampabile — non
aggiungere altre categorie qui (le schede tecniche dei prodotti vivono già
nelle sezioni Attivi professionali e Home Care).

## Contatti di supporto

Aggiornare direttamente in `index.html`, sezione `#supporto` →
`.support-grid`, i placeholder `[Nome referente da inserire]`, `[Contatto
Master Trainer da inserire]`, indirizzo email e numero WhatsApp.

## Nota generale

Tutti i percorsi usati nel codice sono **relativi** (compatibili con GitHub
Pages). Se un'immagine non viene trovata, il sito mostra automaticamente un
placeholder elegante ("Immagine in arrivo") invece dell'icona di immagine
rotta: nessun errore in console, nessuna modifica al codice necessaria dopo
aver caricato i file nei percorsi indicati sopra.
