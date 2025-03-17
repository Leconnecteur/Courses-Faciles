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
      
      // Technique spéciale pour iOS 18+
      if (isIOS18Plus) {
        console.log("iOS Input Fix: Utilisation de la technique pour iOS 18+");
        
        // Patch global pour tous les événements de focus
        const originalFocus = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function() {
          console.log("iOS Input Fix: Focus appelé sur", this.tagName);
          
          if (this.tagName === 'INPUT' || this.tagName === 'TEXTAREA') {
            // Créer un input temporaire pour "réveiller" le clavier iOS
            const tempInput = document.createElement('input');
            tempInput.setAttribute('type', 'text');
            tempInput.style.position = 'fixed';
            tempInput.style.top = '0';
            tempInput.style.left = '0';
            tempInput.style.opacity = '0.01';
            tempInput.style.height = '1px';
            tempInput.style.width = '1px';
            tempInput.style.pointerEvents = 'none';
            tempInput.style.zIndex = '-1';
            
            document.body.appendChild(tempInput);
            
            // Focus sur l'input temporaire
            originalFocus.call(tempInput);
            
            // Puis focus sur l'élément réel
            setTimeout(() => {
              originalFocus.call(this);
              
              // Supprimer l'input temporaire après utilisation
              setTimeout(() => {
                document.body.removeChild(tempInput);
              }, 100);
            }, 50);
          } else {
            // Pour les autres éléments, comportement normal
            originalFocus.call(this);
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
        
        // Désactiver l'autocorrection et l'autocomplétion qui peuvent interférer
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('spellcheck', 'false');
        
        // Ajouter des gestionnaires d'événements pour forcer l'ouverture du clavier
        const forceKeyboard = function(e) {
          console.log("iOS Input Fix: Tentative d'ouverture du clavier pour", input.tagName);
          
          // Empêcher le comportement par défaut qui peut interférer
          e.preventDefault();
          e.stopPropagation();
          
          if (isIOS18Plus) {
            // Pour iOS 18+, nous utilisons une technique spéciale
            const tempInput = document.createElement('input');
            tempInput.setAttribute('type', 'text');
            tempInput.style.position = 'fixed';
            tempInput.style.top = '0';
            tempInput.style.left = '0';
            tempInput.style.opacity = '0.01';
            tempInput.style.height = '1px';
            tempInput.style.width = '1px';
            tempInput.style.pointerEvents = 'none';
            
            document.body.appendChild(tempInput);
            tempInput.focus();
            
            setTimeout(() => {
              input.focus();
              input.click();
              
              // Supprimer l'input temporaire
              document.body.removeChild(tempInput);
            }, 50);
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
    }
  }
  
  // Exécuter la fonction lorsque le DOM est chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixIOSKeyboard);
  } else {
    fixIOSKeyboard();
  }
})();
