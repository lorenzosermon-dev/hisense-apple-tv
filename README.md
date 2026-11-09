# Vista — Home web per TV

Home alternativa ispirata a tvOS, realizzata solo con HTML, CSS e JavaScript. Non sostituisce il launcher VIDAA e non modifica firmware o impostazioni della TV.

## Avvio e configurazione

Apri `index.html` nel browser. I file `index.html`, `style.css` e `script.js` devono rimanere nella stessa cartella. Non servono build, pacchetti, font o risorse esterne.

Modifica `APP_LINKS` all'inizio di `script.js` per impostare i quattro indirizzi HTTPS. Una stringa vuota disabilita l'apertura e mostra un messaggio quando premi OK. I valori predefiniti aprono i siti dei servizi: non sono collegamenti alle app native VIDAA. Il supporto di login, video e DRM dipende dal servizio e dal browser della TV.

## Telecomando

- Freccia sinistra/destra: seleziona l'app precedente/successiva, con ritorno circolare.
- Freccia su/giù: mantiene il focus sulla sola riga disponibile.
- OK/Invio: apre il collegamento nella stessa finestra.
- Con un computer puoi usare anche Tab, Maiusc+Tab e il mouse.

Il tasto Indietro rimane gestito dal browser o dalla TV. Orologio e data usano l'ora locale impostata sul dispositivo.

## GitHub Pages

1. Carica i tre file nella radice di un repository GitHub.
2. In **Settings → Pages**, seleziona **Deploy from a branch**, il branch desiderato e la cartella **/(root)**.
3. Dopo la pubblicazione, apri l'indirizzo HTTPS fornito da GitHub Pages. I percorsi relativi funzionano anche sotto il nome del repository.

## Test su Hisense 32AE5500F / VIDAA

La compatibilità hardware non è stata verificata. Il codice usa JavaScript ES5, layout senza Grid/Flexbox, gradienti CSS e animazioni limitate al focus; l'aspetto esatto può variare sui browser meno recenti.

Se il firmware della tua TV espone già l'installer `hisense://debug`, puoi provare ad aprirlo dal browser TV e usare l'URL HTTPS di GitHub Pages nel flusso di test disponibile sul dispositivo. Disponibilità dell'installer, campi richiesti ed eventuali metadati dipendono dal firmware: questi tre file costituiscono una pagina web, non un pacchetto nativo VIDAA. Non si presume che basti l'URL per installarla su qualsiasi versione.

Verifica sulla TV:

- leggibilità e margini ai quattro lati, senza tagli da overscan;
- frecce e OK su tutti e quattro i collegamenti;
- data e ora, anche dopo il ritorno alla home;
- navigazione Indietro e comportamento dei siti dei servizi;
- messaggio con un collegamento impostato a stringa vuota.

Non sono necessarie modifiche al firmware o al launcher originale.

## Diagnostica VIDAA temporanea

Premi ↑ dalla riga delle app per raggiungere **Impostazioni**, poi OK. Il pulsante **Diagnostica VIDAA** controlla i tre nomi `Hisense_installApp`, `Hisense_GetModelName` e `Hisense_GetFirmWareVersion`, oltre agli ulteriori nomi globali con prefisso Hisense/VIDAA presenti sul dispositivo. Non viene eseguito alcun controllo all'avvio.

La verifica usa descrittori di proprietà, senza invocare funzioni native né getter. Una proprietà accessore, protetta o non ispezionabile viene indicata come non verificabile. La presenza di una funzione non prova che sia utilizzabile o autorizzata. Gli ulteriori nomi scoperti non vengono dichiarati API documentate. Non vengono caricati SDK, salvati risultati o effettuate richieste di rete dalla diagnostica.

Nel pannello: ↑/↓ selezionano i controlli e OK conferma. Nelle impostazioni ←/→ regolano la scala; nella diagnostica cambiano pagina. Indietro/Esc torna dalla diagnostica alle impostazioni e dalle impostazioni alla Home. Chiudendo torni a Impostazioni; ↓ riporta all'app selezionata. I risultati restano soltanto in memoria fino al ricaricamento. Il pannello può essere rimosso insieme al relativo blocco CSS e alle funzioni diagnostiche in `script.js` al termine dei test.


## Area sicura e scala

La Home e il pannello impostazioni vengono centrati nell'area sicura del browser: il 5% di larghezza e altezza rimane libero su ciascun bordo. Il rapporto della composizione resta 16:9 e il calcolo considera sia la larghezza sia l'altezza effettive, anche a 1366×768 o 1280×720. Il ridimensionamento si aggiorna all'avvio, al ritorno alla pagina e quando cambia il viewport.

In **Impostazioni**, seleziona **Scala Home** con ↑/↓ e regola con ←/→ da 70% a 100%, un punto percentuale per pressione. Il controllo funziona anche con mouse o touch. La scala agisce anche sul pannello impostazioni, mantenendolo dentro l'area sicura. La scelta viene salvata nella chiave `vista.displayScale` di localStorage; se l'archiviazione manca o è bloccata, rimane valida per la sessione. Il valore iniziale è 100% dell'area sicura, non dell'intero schermo.


## Diagnostica con paginazione

La diagnostica mostra al massimo cinque API per pagina, senza elenco da scorrere. Tutti i risultati originali restano in memoria; con 64 nomi si ottengono 13 pagine. I pulsanti **◀ Precedente** e **Successiva ▶**, oppure le frecce ←/→, cambiano pagina senza superare la prima o l'ultima. L'indicatore mostra **Pagina X di Y**.

Con ↑/↓ selezioni filtro, pulsanti pagina e ritorno alle impostazioni; OK attiva il controllo. **Solo API disponibili** filtra i risultati già raccolti, senza ripetere la diagnostica. Disattivandolo ritrovi tutti i nomi, inclusi quelli non verificabili. Le API disponibili sono verdi, quelle non disponibili grigie e quelle non verificabili color ambra, sempre accompagnate da una descrizione testuale. Se il filtro non trova funzioni, compare un messaggio e l'indicatore resta Pagina 1 di 1.

Il tasto Indietro (anche codici 461/10009), Esc o il pulsante **Impostazioni** riporta alle impostazioni. I controlli e le cinque righe occupano l'area sicura già prevista, anche a 1280×720. Nessuna API nativa viene invocata.
