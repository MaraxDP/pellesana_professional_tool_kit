param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$Only = ''
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = Join-Path $ProjectRoot 'assets\source-documents\procedure-trattamento'
$outputDir = Join-Path $ProjectRoot 'assets\documents\published\procedure-trattamento'
$buildDir = Join-Path $env:TEMP 'pellesana-procedure-pdf-build'
$logoPath = Join-Path $ProjectRoot 'assets\img\logo\logo-protocollo-pelle-sana.png'
$browserCandidates = @(
    'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    'C:\Program Files\Google\Chrome\Application\chrome.exe'
)
$browser = $browserCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $browser) { throw 'Chrome o Microsoft Edge non trovato.' }

$documents = @(
    @{ Source = 'procedura-acidi-cosmetici.docx'; Output = 'procedura-acidi-cosmetici.pdf'; Title = 'Acidi Cosmetici'; Label = 'Procedura professionale' },
    @{ Source = 'procedura-biorivitalizzazione-viso.docx'; Output = 'procedura-biorivitalizzazione-viso.pdf'; Title = 'Biorivitalizzazione Viso'; Label = 'Procedura professionale' },
    @{ Source = 'procedura-trattamento-viso-ricostituente.docx'; Output = 'procedura-trattamento-viso-ricostituente.pdf'; Title = 'Trattamento Viso Ricostituente'; Label = 'Procedura professionale' },
    @{ Source = 'procedura-exohair-plus.docx'; Output = 'procedura-exohair-plus.pdf'; Title = 'ExoHair Plus'; Label = 'Procedura professionale cuoio capelluto' },
    @{ Source = 'procedura-lip-volume-eye-care.docx'; Output = 'procedura-lip-volume-eye-care.pdf'; Title = 'LIP VOLUME & EYE CARE'; Subtitle = 'Trattamento combinato per labbra e contorno occhi'; Label = 'Procedura professionale' }
)
if ($Only) { $documents = @($documents | Where-Object Output -eq $Only) }
if (-not $documents.Count) { throw "Nessun documento corrisponde a: $Only" }
$correctionsPath = Join-Path $PSScriptRoot 'procedure-text-corrections.json'
$corrections = [Text.Encoding]::UTF8.GetString([IO.File]::ReadAllBytes($correctionsPath)) | ConvertFrom-Json

New-Item -ItemType Directory -Force -Path $outputDir, $buildDir | Out-Null
$browserProfile = Join-Path $buildDir ('browser-profile-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $browserProfile | Out-Null

function ConvertTo-DataUri([string]$Path, [string]$Mime) {
    $bytes = [IO.File]::ReadAllBytes($Path)
    return "data:$Mime;base64,$([Convert]::ToBase64String($bytes))"
}

function ConvertTo-HtmlText([string]$Text) {
    return [Net.WebUtility]::HtmlEncode($Text).Replace("`t", '&emsp;').Replace("`n", '<br>')
}

function Edit-ProofreadText([string]$Text) {
    foreach ($correction in $corrections) {
        $Text = $Text.Replace([string]$correction.find, [string]$correction.replace)
    }
    return $Text
}

$logoUri = ConvertTo-DataUri $logoPath 'image/png'
$fontDir = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Fonts'
$cinzelRegular = ConvertTo-DataUri (Join-Path $fontDir 'Cinzel-Regular.otf') 'font/otf'
$cinzelBold = ConvertTo-DataUri (Join-Path $fontDir 'Cinzel-Bold.otf') 'font/otf'
$openRegular = ConvertTo-DataUri (Join-Path $fontDir 'OpenSans-Regular.ttf') 'font/ttf'
$openSemiBold = ConvertTo-DataUri (Join-Path $fontDir 'OpenSans-SemiBold.ttf') 'font/ttf'

$css = @"
@font-face{font-family:Cinzel;src:url('$cinzelRegular') format('opentype');font-weight:400}
@font-face{font-family:Cinzel;src:url('$cinzelBold') format('opentype');font-weight:700}
@font-face{font-family:'Open Sans';src:url('$openRegular') format('truetype');font-weight:400}
@font-face{font-family:'Open Sans';src:url('$openSemiBold') format('truetype');font-weight:600}
@page{size:A4;margin:20mm 18mm 19mm;@bottom-left{content:'DOCUMENTO OPERATIVO PROTOCOLLO PELLE SANA';font:600 6.8pt 'Open Sans';letter-spacing:.8pt;color:#8d766d}@bottom-center{content:'VERSIONE ______  |  ULTIMO AGGIORNAMENTO ______';font:400 6.4pt 'Open Sans';color:#9b8b83}@bottom-right{content:'PAGINA ' counter(page) ' / ' counter(pages);font:600 6.8pt 'Open Sans';color:#8d766d}}
*{box-sizing:border-box}html{background:#eee}body{margin:0;color:#263b50;background:#fff;font:9.3pt/1.55 'Open Sans',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.watermark{position:fixed;top:43%;left:50%;z-index:0;width:170mm;transform:translate(-50%,-50%) rotate(-32deg);color:rgba(33,63,94,.055);font:700 31pt/1 Cinzel,serif;letter-spacing:3pt;text-align:center;white-space:nowrap;pointer-events:none}.cover,.content{position:relative;z-index:1}
.cover{height:257mm;display:flex;flex-direction:column;justify-content:center;position:relative;padding:12mm 10mm;background:linear-gradient(145deg,#fdfbf7 0%,#f7f0eb 60%,#ede1db 100%);page-break-after:always;overflow:hidden}
.cover:before{content:'';position:absolute;width:145mm;height:145mm;border:1px solid rgba(195,168,157,.38);border-radius:50%;right:-72mm;top:-56mm}.cover:after{content:'';position:absolute;left:10mm;right:10mm;bottom:12mm;border-bottom:1px solid #c3a89d}
.logo{width:46mm;height:auto;margin-bottom:23mm}.eyebrow{margin:0 0 4mm;color:#9b7e72;font-size:8pt;font-weight:600;letter-spacing:2.2pt;text-transform:uppercase}.cover h1{max-width:155mm;margin:0;color:#213f5e;font:700 25pt/1.22 Cinzel,serif;letter-spacing:.3pt}.rule{width:28mm;border-top:2px solid #c3a89d;margin:8mm 0}.cover-summary{max-width:145mm;color:#52677a;font-size:10pt}.cover-summary p{margin:1.8mm 0}.cover-summary p:first-child{font-weight:600;color:#213f5e}.cover-meta{position:absolute;bottom:18mm;left:10mm;color:#8d766d;font-size:7.5pt;letter-spacing:1.3pt;text-transform:uppercase}
.running-head{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #d9c9c1;padding-bottom:3mm;margin-bottom:8mm}.running-head img{width:30mm}.running-head span{font-size:7pt;letter-spacing:1.5pt;text-transform:uppercase;color:#9b7e72}
.content{padding:0}.section-title{margin:8mm 0 3.5mm;padding:3.2mm 4mm;border-left:2px solid #c3a89d;background:#f8f3ef;color:#213f5e;font:700 13pt/1.3 Cinzel,serif;break-after:avoid}.subheading{margin:5mm 0 2mm;color:#213f5e;font:700 10.5pt/1.35 Cinzel,serif;break-after:avoid}.body-copy{margin:0 0 3mm;orphans:3;widows:3}.bullet{position:relative;margin:0 0 2.5mm;padding-left:5mm;break-inside:avoid}.bullet:before{content:'';position:absolute;left:0;top:2.2mm;width:1.8mm;height:1.8mm;border-radius:50%;background:#c3a89d}.step{margin:3.2mm 0;padding:3.5mm 4mm;border:1px solid #ded2cc;border-radius:2.5mm;background:#fcfaf7;break-inside:avoid}.step strong{color:#213f5e}.source-image{display:block;max-width:155mm;max-height:85mm;width:auto;height:auto;margin:4mm auto 5mm;object-fit:contain;break-inside:avoid}.source-image.small{max-height:35mm}.data-table{width:100%;border-collapse:collapse;margin:4mm 0;break-inside:avoid}.data-table td{padding:2.5mm 3mm;border:1px solid #ded2cc;vertical-align:top}.data-table tr:nth-child(odd){background:#faf6f2}.note{padding:4mm;border-left:2px solid #c3a89d;background:#f8f3ef}.page-break{page-break-before:always}.active-list{display:flex;gap:3mm;flex-wrap:wrap;margin-top:5mm}.active-list span{padding:2mm 3.5mm;border:1px solid #d9c9c1;border-radius:99px;color:#213f5e;background:rgba(255,255,255,.55);font-size:8pt;font-weight:600}.timeline-step{position:relative;margin:4mm 0;padding:4mm 4mm 4mm 14mm;border:1px solid #ded2cc;border-radius:2.5mm;background:#fcfaf7;break-inside:avoid}.timeline-number{position:absolute;left:3.5mm;top:3.5mm;width:7mm;height:7mm;border-radius:50%;background:#213f5e;color:#fff;font:600 8pt/7mm 'Open Sans';text-align:center}.timeline-step strong{color:#213f5e}
"@

$wNs = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$rNs = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
$aNs = 'http://schemas.openxmlformats.org/drawingml/2006/main'
$pkgRelNs = 'http://schemas.openxmlformats.org/package/2006/relationships'

foreach ($doc in $documents) {
    $sourcePath = Join-Path $sourceDir $doc.Source
    if (-not (Test-Path -LiteralPath $sourcePath)) { throw "Sorgente mancante: $($doc.Source)" }
    $zip = [IO.Compression.ZipFile]::OpenRead($sourcePath)
    try {
        $documentEntry = $zip.GetEntry('word/document.xml')
        $relationshipsEntry = $zip.GetEntry('word/_rels/document.xml.rels')
        $reader = [IO.StreamReader]::new($documentEntry.Open())
        try { [xml]$xml = $reader.ReadToEnd() } finally { $reader.Dispose() }
        $relReader = [IO.StreamReader]::new($relationshipsEntry.Open())
        try { [xml]$relsXml = $relReader.ReadToEnd() } finally { $relReader.Dispose() }

        $mgr = [Xml.XmlNamespaceManager]::new($xml.NameTable)
        $mgr.AddNamespace('w', $wNs); $mgr.AddNamespace('r', $rNs); $mgr.AddNamespace('a', $aNs)
        $relMap = @{}
        foreach ($rel in $relsXml.Relationships.Relationship) { $relMap[$rel.Id] = $rel.Target }

        $blocks = [System.Collections.Generic.List[string]]::new()
        $coverLines = [System.Collections.Generic.List[string]]::new()
        $timelineNumber = 0
        # I sorgenti usano caselle di testo e contenitori OpenXML annidati:
        # selezioniamo ogni paragrafo del body in ordine documentale.
        $bodyNodes = $xml.SelectNodes('//w:body//w:p', $mgr)
        $paragraphIndex = 0
        foreach ($node in $bodyNodes) {
            if ($node.LocalName -eq 'tbl') {
                $rows = [System.Collections.Generic.List[string]]::new()
                foreach ($row in $node.SelectNodes('./w:tr', $mgr)) {
                    $cells = foreach ($cell in $row.SelectNodes('./w:tc', $mgr)) {
                        $cellText = ($cell.SelectNodes('.//w:t', $mgr) | ForEach-Object InnerText) -join ''
                        '<td>' + (ConvertTo-HtmlText $cellText) + '</td>'
                    }
                    $rows.Add('<tr>' + ($cells -join '') + '</tr>')
                }
                if ($rows.Count) { $blocks.Add('<table class="data-table">' + ($rows -join '') + '</table>') }
                continue
            }

            $paragraphIndex++
            $textParts = $node.SelectNodes('.//w:t | .//w:tab | .//w:br', $mgr) | ForEach-Object {
                if ($_.LocalName -eq 't') { $_.InnerText } elseif ($_.LocalName -eq 'tab') { "`t" } else { "`n" }
            }
            $plain = (($textParts -join '') -replace '[\u00A0\s]+', ' ').Trim()
            $plain = Edit-ProofreadText $plain
            if ($doc.Source -eq 'procedura-lip-volume-eye-care.docx') {
                $lipCorrections = [ordered]@{
                    'IL trattamento COMBINATO' = 'Il trattamento combinato'
                    'Trattamento rimpolpante LABBRA' = 'Trattamento rimpolpante labbra'
                    'Trattamento perfezionante del CONTORNO OCCHI' = 'Trattamento perfezionante del contorno occhi'
                    'mirato a migliora' = 'mirato a migliorare'
                    'Nanoneedling' = 'nanoneedling'
                    'nano-needling' = 'nanoneedling'
                    'Nano Needling' = 'Nanoneedling'
                    '5ml' = '5 ml'
                    '15gg' = '15 giorni'
                    'una apposita siringa' = 'un__APOSTROPHE__apposita siringa'
                    '0.5 ml' = '0,5 ml'
                    'Acido ialuronico 3%' = 'Acido Ialuronico 3%'
                    'acido ialuronico' = 'Acido Ialuronico'
                    'Contorno Occhi' = 'contorno occhi'
                    'ADRN pro' = 'ADRN Pro'
                    'dermapen' = 'Dermapen'
                    'ago NANO' = 'cartuccia nano'
                    'ferite, e con gli occhi' = 'ferite e con gli occhi'
                    'i patches dagli occhi' = 'i patch dagli occhi'
                    'Con la siringa estraiamo' = 'Con la siringa, estrarre'
                    'ed applicalo sulle labbra' = 'e applicarlo sulle labbra'
                }
                foreach ($item in $lipCorrections.GetEnumerator()) { $plain = $plain.Replace($item.Key, $item.Value) }
                $rightApostrophe = [char]0x2019
                $aGrave = [char]0x00E0
                $plain = $plain.Replace('__APOSTROPHE__', [string]$rightApostrophe)
                $plain = $plain.Replace("dall' umidit${aGrave}", "dall${rightApostrophe}umidit${aGrave}")
                $plain = $plain.Replace("profondit${aGrave} a 0.5", "profondit${aGrave} a 0,5")
                $plain = $plain.Replace("l${rightApostrophe}cartuccia nano", 'la cartuccia nano')
            }
            if ($doc.Source -eq 'procedura-acidi-cosmetici.docx' -and $plain -eq 'Benefici estetici dei trattamenti BIORIVITALIZZANTI') {
                $plain = 'Benefici estetici dei trattamenti con ACIDI COSMETICI'
            }
            $styleNode = $node.SelectSingleNode('./w:pPr/w:pStyle', $mgr)
            $style = if ($styleNode) { $styleNode.GetAttribute('val', $wNs) } else { '' }

            if ($paragraphIndex -le 12) {
                if ($plain -and $paragraphIndex -gt 2 -and $plain -notmatch '^Trattamenti di avanguardia') { $coverLines.Add((ConvertTo-HtmlText $plain)) }
            } elseif ($plain) {
                $encoded = ConvertTo-HtmlText $plain
                $isList = $style -match 'elenco'
                if ($doc.Source -eq 'procedura-lip-volume-eye-care.docx' -and $plain -eq 'Effetto Plumping Naturale: Volume visibilmente aumentato senza stravolgerne i tratti.') { $blocks.Add('<h2 class="section-title">Benefici del trattamento labbra</h2>') }
                if ($doc.Source -eq 'procedura-lip-volume-eye-care.docx' -and $plain -eq 'Sguardo subito riposato e fresco, come dopo un lungo sonno rigenerante.') { $blocks.Add('<h2 class="section-title">Benefici del trattamento contorno occhi</h2>') }
                $isMajor = $plain -match '^(Gli acidi cosmetici|I trattamenti (RICOSTITUENTI|di Biorivitalizzazione cutanea)|Il [Tt]rattamento|Trattamento (rimpolpante|perfezionante)|ACIDO IALURONICO 3%|FLASH EYE|Benefici estetici|Modo d.uso e avvertenze|Conservazione|Preparazione al trattamento|Protocollo di trattamento|Cosa NON fare)'
                $isSub = (-not $isList) -and $plain.Length -lt 72 -and ($style -match 'Titolo|k3ksmc' -or $plain -cmatch '^[A-Z0-9% +\-]{5,}$')
                $colonAt = $plain.IndexOf(':')
                $isStep = $isList -and $colonAt -gt 0 -and $colonAt -lt 42
                $isLipStep = $doc.Source -eq 'procedura-lip-volume-eye-care.docx' -and $plain -match '^(FIALA FLASH EYE|DERMAPEN|GOLDEN EYE PATCH|FIALA ACIDO IALURONICO 3%|GOLDEN KISS LIP MASK|FASE FINALE):'
                if ($isMajor) { $blocks.Add("<h2 class=`"section-title`">$encoded</h2>") }
                elseif ($isSub) { $blocks.Add("<h3 class=`"subheading`">$encoded</h3>") }
                elseif ($isLipStep) {
                    $timelineNumber++
                    $lead = ConvertTo-HtmlText $plain.Substring(0, $colonAt + 1)
                    $rest = ConvertTo-HtmlText $plain.Substring($colonAt + 1).Trim()
                    $blocks.Add("<div class=`"timeline-step`"><span class=`"timeline-number`">$timelineNumber</span><strong>$lead</strong> $rest</div>")
                }
                elseif ($isStep) {
                    $lead = ConvertTo-HtmlText $plain.Substring(0, $colonAt + 1)
                    $rest = ConvertTo-HtmlText $plain.Substring($colonAt + 1).Trim()
                    $blocks.Add("<div class=`"step`"><strong>$lead</strong> $rest</div>")
                }
                elseif ($isList) { $blocks.Add("<p class=`"bullet`">$encoded</p>") }
                else { $blocks.Add("<p class=`"body-copy`">$encoded</p>") }
            }

            foreach ($blip in $node.SelectNodes('.//a:blip', $mgr)) {
                $relId = $blip.GetAttribute('embed', $rNs)
                if (-not $relMap.ContainsKey($relId)) { continue }
                $target = $relMap[$relId] -replace '^\.\./', ''
                $entryPath = if ($target -like 'word/*') { $target } else { 'word/' + $target }
                $mediaEntry = $zip.GetEntry($entryPath)
                if (-not $mediaEntry) { continue }
                $stream = $mediaEntry.Open(); $memory = [IO.MemoryStream]::new()
                try { $stream.CopyTo($memory); $bytes = $memory.ToArray() } finally { $stream.Dispose(); $memory.Dispose() }
                $ext = [IO.Path]::GetExtension($entryPath).TrimStart('.').ToLowerInvariant()
                $mime = if ($ext -eq 'jpg' -or $ext -eq 'jpeg') { 'image/jpeg' } else { "image/$ext" }
                if ($paragraphIndex -gt 12) { $blocks.Add("<img class=`"source-image`" src=`"data:$mime;base64,$([Convert]::ToBase64String($bytes))`" alt=`"Schema operativo presente nel documento sorgente`">") }
            }
        }

        if ($doc.Source -eq 'procedura-lip-volume-eye-care.docx') {
            $summaryHtml = "<p>$($doc.Subtitle)</p><div class=`"active-list`"><span>Acido Ialuronico 3%</span><span>Flash Eye</span></div>"
        } else {
            $summaryHtml = ($coverLines | ForEach-Object { "<p>$_</p>" }) -join "`n"
        }
        $html = @"
<!doctype html><html lang="it"><head><meta charset="utf-8"><title>$($doc.Title) - Protocollo Pelle Sana</title><style>$css</style></head><body>
<div class="watermark" aria-hidden="true">PROTOCOLLO PELLE SANA</div>
<section class="cover"><img class="logo" src="$logoUri" alt="Protocollo Pelle Sana"><p class="eyebrow">$($doc.Label)</p><h1>$($doc.Title)</h1><div class="rule"></div><div class="cover-summary">$summaryHtml</div><p class="cover-meta">Documento operativo professionale | Versione da valorizzare | Ultimo aggiornamento da valorizzare</p></section>
<main class="content"><header class="running-head"><img src="$logoUri" alt="Protocollo Pelle Sana"><span>$($doc.Title)</span></header>$($blocks -join "`n")</main>
</body></html>
"@
        $htmlPath = Join-Path $buildDir ($doc.Output -replace '\.pdf$', '.html')
        [IO.File]::WriteAllText($htmlPath, $html, [Text.UTF8Encoding]::new($false))
        $pdfPath = Join-Path $outputDir $doc.Output
        $fileUrl = 'file:///' + ($htmlPath -replace '\\', '/')
        & $browser --headless=new --disable-gpu --no-pdf-header-footer --allow-file-access-from-files --user-data-dir="$browserProfile" --print-to-pdf="$pdfPath" $fileUrl | Out-Null
        if (-not (Test-Path -LiteralPath $pdfPath) -or (Get-Item $pdfPath).Length -lt 10000) { throw "PDF non generato correttamente: $($doc.Output)" }
        Write-Output "GENERATO $($doc.Output) $((Get-Item $pdfPath).Length) bytes"
    } finally {
        $zip.Dispose()
    }
}
