// Script pour résoudre les problèmes de clavier iOS en mode standalone PWA
(function() {
  // Fonction pour forcer l'affichage du clavier sur iOS
  function fixIOSKeyboard() {
    // S'exécute uniquement sur iOS en mode standalone
    if (
      (navigator.standalone || 
       window.matchMedia('(display-mode: standalone)').matches) && 
      /iPad|iPhone|iPod/.test(navigator.userAgent)
    ) {
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
        
        // Ajouter des gestionnaires d'événements pour forcer l'ouverture du clavier
        input.addEventListener('touchend', function(e) {
          // Petit délai pour s'assurer que le focus est appliqué correctement
          setTimeout(() => {
            this.focus();
            // Pour certains champs, un clic supplémentaire peut être nécessaire
            if (this.tagName === 'INPUT' && (this.type === 'text' || this.type === 'search')) {
              this.click();
            }
          }, 100);
        });
        
        // Empêcher le comportement par défaut qui peut interférer
        input.addEventListener('touchstart', function(e) {
          e.stopPropagation();
        }, { passive: false });
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
