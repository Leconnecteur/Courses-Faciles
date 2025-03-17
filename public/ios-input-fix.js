// Script pour résoudre les problèmes de clavier iOS en mode standalone PWA
(function() {
  // Fonction pour forcer l'affichage du clavier sur iOS
  function fixIOSKeyboard() {
    // S'exécute uniquement sur iOS en mode standalone
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    const isIOS18Plus = isIOS && /OS 18_/.test(navigator.userAgent);
    
    if (isIOS && isStandalone) {
      console.log("iOS Input Fix: Activé pour iOS en mode standalone");
      console.log("Version iOS détectée:", isIOS18Plus ? "iOS 18+" : "iOS <18");
      
      // Créer un élément input caché qui sera utilisé pour déclencher le clavier
      const hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'text');
      hiddenInput.style.position = 'fixed';
      hiddenInput.style.top = '0';
      hiddenInput.style.left = '0';
      hiddenInput.style.opacity = '0';
      hiddenInput.style.height = '1px';
      hiddenInput.style.width = '1px';
      hiddenInput.style.pointerEvents = 'none';
      hiddenInput.style.zIndex = '-1';
      hiddenInput.setAttribute('inputmode', 'text');
      hiddenInput.setAttribute('enterkeyhint', 'done');
      
      // Ajouter l'input au DOM
      document.body.appendChild(hiddenInput);
      
      // Technique spéciale pour iOS 18+
      if (isIOS18Plus) {
        console.log("iOS Input Fix: Utilisation de la technique pour iOS 18+");
        
        // Patch global pour tous les événements de focus
        const originalFocus = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function() {
          console.log("iOS Input Fix: Focus appelé sur", this.tagName);
          
          if (this.tagName === 'INPUT' || this.tagName === 'TEXTAREA') {
            // Forcer l'affichage du clavier en utilisant un input natif
            hiddenInput.focus();
            hiddenInput.click();
            hiddenInput.value = ' '; // Ajouter un espace pour forcer le clavier
            
            // Simuler une frappe pour forcer l'apparition du clavier
            const inputEvent = new InputEvent('input', {
              bubbles: true,
              cancelable: true,
              data: ' '
            });
            hiddenInput.dispatchEvent(inputEvent);
            
            // Puis focus sur l'élément réel après un court délai
            setTimeout(() => {
              originalFocus.call(this);
              
              // Simuler une interaction utilisateur
              this.click();
              
              // Simuler une frappe pour forcer l'apparition du clavier
              const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                data: ' '
              });
              this.dispatchEvent(inputEvent);
              
              // Vider l'input caché
              hiddenInput.value = '';
            }, 100);
          } else {
            // Pour les autres éléments, comportement normal
            originalFocus.call(this);
          }
        };
        
        // Remplacer également la méthode click pour les inputs
        const originalClick = HTMLElement.prototype.click;
        HTMLElement.prototype.click = function() {
          console.log("iOS Input Fix: Click appelé sur", this.tagName);
          
          if ((this.tagName === 'INPUT' || this.tagName === 'TEXTAREA') && 
              (this === document.activeElement)) {
            // Si l'élément est déjà focus, forcer l'apparition du clavier
            hiddenInput.focus();
            hiddenInput.click();
            
            // Simuler une frappe
            hiddenInput.value = ' ';
            const inputEvent = new InputEvent('input', {
              bubbles: true,
              cancelable: true,
              data: ' '
            });
            hiddenInput.dispatchEvent(inputEvent);
            
            // Puis revenir à l'élément réel
            setTimeout(() => {
              originalClick.call(this);
              originalFocus.call(this);
              
              // Vider l'input caché
              hiddenInput.value = '';
            }, 100);
          } else {
            // Comportement normal
            originalClick.call(this);
          }
        };
      }
      
      // Observer pour détecter les nouveaux champs de saisie
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              const node = mutation.addedNodes[i];
              if (node.nodeType === 1) { // Element node
                setupInputs(node.querySelectorAll('input, textarea'));
                if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                  setupInput(node);
                }
              }
            }
          }
        });
      });
      
      // Configuration de l'observer
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Configurer les champs existants
      setupInputs(document.querySelectorAll('input, textarea'));
      
      // Fonction pour configurer plusieurs champs
      function setupInputs(inputs) {
        for (let i = 0; i < inputs.length; i++) {
          setupInput(inputs[i]);
        }
      }
      
      // Fonction pour configurer un champ individuel
      function setupInput(input) {
        // Éviter de configurer plusieurs fois le même élément
        if (input.dataset.iosFix) return;
        input.dataset.iosFix = 'true';
        
        // Configurer l'input pour maximiser les chances d'afficher le clavier
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('spellcheck', 'false');
        input.setAttribute('inputmode', 'text');
        input.setAttribute('enterkeyhint', 'done');
        
        // Ajouter des gestionnaires d'événements pour forcer l'ouverture du clavier
        const forceKeyboard = function(e) {
          console.log("iOS Input Fix: Tentative d'ouverture du clavier pour", input.tagName);
          
          // Empêcher le comportement par défaut qui peut interférer
          e.preventDefault();
          e.stopPropagation();
          
          if (isIOS18Plus) {
            // Pour iOS 18+, utiliser l'input caché
            hiddenInput.focus();
            hiddenInput.click();
            
            // Simuler une frappe
            hiddenInput.value = ' ';
            const inputEvent = new InputEvent('input', {
              bubbles: true,
              cancelable: true,
              data: ' '
            });
            hiddenInput.dispatchEvent(inputEvent);
            
            // Puis focus sur l'input réel
            setTimeout(() => {
              input.focus();
              input.click();
              
              // Simuler une frappe sur l'input réel
              const realInputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                data: ' '
              });
              input.dispatchEvent(realInputEvent);
              
              // Vider l'input caché
              hiddenInput.value = '';
            }, 100);
          } else {
            // Pour les versions iOS antérieures
            input.focus();
            input.click();
          }
          
          return false;
        };
        
        // Ajouter plusieurs gestionnaires d'événements pour maximiser les chances
        input.addEventListener('touchstart', forceKeyboard, { passive: false });
        input.addEventListener('touchend', forceKeyboard, { passive: false });
        input.addEventListener('mousedown', forceKeyboard, { passive: false });
        input.addEventListener('mouseup', forceKeyboard, { passive: false });
        input.addEventListener('click', forceKeyboard, { passive: false });
      }
      
      // Ajouter un gestionnaire global pour les clics sur le document
      document.addEventListener('click', function(e) {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          // Ne rien faire, l'élément a déjà son propre gestionnaire
        } else if (target.closest('input, textarea')) {
          // Si le clic est sur un élément à l'intérieur d'un input (comme un icône)
          const input = target.closest('input, textarea');
          input.focus();
          input.click();
        }
      });
    }
  }
  
  // Exécuter la fonction lorsque le DOM est chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixIOSKeyboard);
  } else {
    fixIOSKeyboard();
  }
})();
