*Dutch version below*

English Version
---------------

Spotify Janitor (Angular)
=========================

Spotify Janitor is an Angular-based web application that helps you clean up and manage your Spotify library. You can log in with your Spotify account, fetch your saved tracks (complete with album artwork, title, artist, etc.), and easily search through them by artist or track title. The app provides swipe-to-remove functionality—swipe a track to the right to remove it—and includes an undo button to re-add the track if needed. Your login session is preserved to avoid re-authenticating every time. The app also includes a profile screen where you can view your account details (like profile picture, premium status, name, country, etc.), and you can search the entire Spotify library by title/artist to add new tracks.

### Table of Contents

1.  Setup
    
2.  Stack and Libraries
    
3.  Challenges and Key Decisions
    
4.  Additional Notes
    

### Setup

1.  git clone https://github.com/Temojikato/spotifyjanitor-angular.git
    cd spotifyjanitor-angular
    
2.  npm install
    
3.  ng serve 
This runs the app locally. Open http://localhost:4200 in your browser.
    
4.  ng test
By default, this uses Karma + Jasmine. Tests run in headless Chrome unless otherwise configured.
    
5.  ng build --configuration production
This creates a production-ready bundle in the dist/ folder, suitable for hosting (e.g., Firebase Hosting).
    

### Stack and Libraries

This Angular version of Spotify Janitor leverages the following:

*   **Angular & TypeScript**: A modern, opinionated framework with strong typing and a structured approach to building full applications.
    
*   **Angular Material**: For a clean, responsive UI with built-in Material design components (buttons, dialogs, forms, etc.).
    
*   **RxJS**: Standard with Angular for handling asynchronous operations, making it easy to deal with Spotify API calls.
    
*   **Angular CLI**: Simplifies the build process, testing, linting, and running the development server.
    
*   **Interact.js**: Enables swipe gestures on desktop for removing tracks.
    
*   **Custom Directives**:
    
    *   _PullToRefreshDirective_: For “pull-to-refresh” gestures on mobile.
        
    *   _SwipeToRemoveDirective_: For horizontal swipe gestures to remove saved tracks.
        
*   **Jasmine/Karma**: Default Angular test stack for unit and integration tests.
    

### Challenges and Key Decisions

1.  **Handling OAuth PKCE Flow**: We used Angular’s services and interceptors to manage token refresh, storing tokens in localStorage, and ensuring only one global HTTP interceptor.
    
2.  **Horizontal vs. Vertical Gestures**: Conflict arises when you have both “pull-to-refresh” and “swipe-to-remove” interactions. We resolved it by carefully checking gesture directions and stopping event propagation, ensuring they don’t conflict.
    
3.  **Minimizing Spotify API Calls**: We store tracks locally to avoid redundant fetches. We only fetch new data on refresh or after significant changes. We also deduplicate tracks in memory to avoid double-inserts.
    
4.  **Animations and Overlay**: Angular Material dialogs and toasts (snack-bars) needed stubs in unit tests to avoid NullInjectorErrors. We used global stubs or special test configurations to handle this elegantly.
    

Dutch Version
-------------

Spotify Janitor (Angular)
=========================

Spotify Janitor is een webapplicatie, gebouwd met Angular, die je helpt bij het beheren en opschonen van je Spotify-bibliotheek. Je kunt inloggen met je Spotify-account, je opgeslagen nummers ophalen (inclusief albumafbeelding, titel, artiest enzovoort) en ze eenvoudig doorzoeken op artiest of titel. De app biedt ‘swipe-to-remove’, waarbij je een track naar rechts kunt swipen om deze uit je opgeslagen nummers te verwijderen. Er verschijnt dan een undo-knop, zodat je een verwijderd nummer snel weer kunt toevoegen. Je inlogsessie wordt bewaard, zodat je niet iedere keer opnieuw hoeft in te loggen. Verder is er een profielfunctie om je accountgegevens in te zien (zoals profielfoto, premiumstatus, naam, land, enz.). Je kunt bovendien de hele Spotify-bibliotheek doorzoeken op titel of artiest en tracks toevoegen via een ‘add’-knop.

### Inhoudsopgave

1.  Setup
    
2.  Stack en Libraries
    
3.  Uitdagingen en Beslissingen
    
4.  Extra Opmerkingen
    

### Setup (NL)

1.  git clone https://github.com/Temojikato/spotifyjanitor-angular.git
    cd spotifyjanitor-angular
    
2.  npm install
    
3.  ng serve
Open http://localhost:4200 in je browser om de app te bekijken.
    
4.  ng test
Standaard draait dit de tests in Jasmine/Karma.
    
5.  ng build --configuration production
De productieklare bestanden worden in de map dist/ geplaatst.
    

### Stack en Libraries (NL)

*   **Angular & TypeScript**: Voor een gestructureerde, moderne aanpak en sterke typeveiligheid.
    
*   **Angular Material**: Biedt een reeks gebruiksklare componenten in Material-stijl (knoppen, formulieren, dialogen, snackbars, enz.).
    
*   **RxJS**: Standaard in Angular voor asynchrone operaties en datastromen.
    
*   **Angular CLI**: Vergemakkelijkt buildprocessen, testing, linting en hot-reload via ng serve.
    
*   **Interact.js**: Maakt swipe-gebaren mogelijk op desktops.
    
*   **Custom Directives**:
    
    *   _PullToRefreshDirective_: “Pull-to-refresh” op mobiele apparaten.
        
    *   _SwipeToRemoveDirective_: Horizontaal swipen om nummers te verwijderen.
        
*   **Jasmine/Karma**: Wordt standaard meegeleverd voor unit- en integratietests in Angular.
    

### Uitdagingen en Beslissingen (NL)

1.  **OAuth PKCE Flow**: We gebruiken Angular-services en een HTTP-interceptor voor tokenverversing en lokale opslag.
    
2.  **Horizontaal vs. Verticaal Swipen**: Er ontstond conflict tussen ‘pull-to-refresh’ en ‘swipe-to-remove’. We lossen dit op door de richting van de swipe te detecteren en events waar nodig te stoppen.
    
3.  **Minimaliseren van Spotify API Calls**: We cachen tracks lokaal en roepen de API alleen aan wanneer dat nodig is (bijvoorbeeld handmatige refresh). Duplicaten worden eruit gefilterd.
    
4.  **Testing met Material**: Bij tests op dialogs en snackbars hebben we mock-providers nodig voor MatDialogRef en MatSnackBarRef, zodat er geen NullInjectorError optreedt.
    