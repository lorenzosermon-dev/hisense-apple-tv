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

Nel pannello: ↑/↓ selezionano i due pulsanti, ←/→ scorrono i risultati, OK conferma, Indietro/Esc chiude. Chiudendo torni a Impostazioni; ↓ riporta all'app selezionata. I risultati restano soltanto in memoria fino al ricaricamento. Il pannello può essere rimosso insieme al relativo blocco CSS e alle funzioni diagnostiche in `script.js` al termine dei test.
