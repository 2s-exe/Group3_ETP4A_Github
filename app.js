/**
 * assets/app.js
 *
 * Frontend interactions pour Buzz Share.
 * Incluut : compteur de caractères, prévisualisation d'image, auto-hide des alertes.
 */

document.addEventListener('DOMContentLoaded', function () {
  // ---- COMPTEUR DE CARACTÈRES ----
  // Met à jour en temps réel le nombre de caractères saisis dans la description.
  const descriptionInput = document.getElementById('description');
  // Support des deux variantes d'ID (kebab-case vs camelCase) pour robustesse
  const charCountDisplay = document.getElementById('char-count') || document.getElementById('charCount');
  const charCounter = document.querySelector('.char-counter') || document.getElementById('char-counter');

  if (descriptionInput && charCountDisplay) {
    const updateCharCount = () => {
      const count = descriptionInput.value.length;
      charCountDisplay.textContent = count;

      // Changement de couleur selon le nombre de caractères
      if (charCounter) {
        charCounter.classList.remove('warning', 'danger');
        if (count > 220) {
          charCounter.classList.add('danger');
        } else if (count > 200) {
          charCounter.classList.add('warning');
        }
      }
    };

    descriptionInput.addEventListener('input', updateCharCount);
    updateCharCount(); // Initialize on page load
  }

  // ---- PRÉVISUALISATION D'IMAGE ----
  // Affiche un aperçu de l'image sélectionnée avant upload.
  const imageInput = document.getElementById('image');
  // L'HTML utilise parfois "image-preview-container" ; on accepte aussi "preview".
  const previewContainer = document.getElementById('image-preview-container') || document.getElementById('preview');

  if (imageInput && previewContainer) {
    imageInput.addEventListener('change', function () {
      const file = this.files && this.files[0];

      // Réinitialiser la prévisualisation
      previewContainer.innerHTML = '';

      if (!file) {
        return;
      }

      // Vérifier que c'est une image
      if (!file.type.startsWith('image/')) {
        previewContainer.textContent = '⚠️ Veuillez sélectionner une image.';
        return;
      }

      // Créer et afficher l'image
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Aperçu de l\'image';
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  // ---- AUTO-HIDE DES ALERTES ----
  // Les alertes avec data-auto-hide disparaissent automatiquement apres un délai.
  document.querySelectorAll('[data-auto-hide]').forEach(function (alert) {
    const duration = parseInt(alert.getAttribute('data-auto-hide')) || 3500; // 3.5s par défaut
    setTimeout(() => {
      // Fade out animation
      alert.style.opacity = '0';
      alert.style.transition = 'opacity 300ms ease-out';

      // Supprimer aprés l'animation
      setTimeout(() => {
        alert.remove();
      }, 300);
    }, duration);
  });

  // ---- FORMULAIRE : Soumission avec feedback ----
  // Ajoute un feedback visuel lors de la soumission du formulaire.
  const addForm = document.getElementById('addForm');
  if (addForm) {
    addForm.addEventListener('submit', function (e) {
      const submitBtn = addForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        // Optionnel: afficher un loader ou désactiver le bouton
        // submitBtn.disabled = true;
        // submitBtn.textContent = 'Envoi...';
      }
    });
  }

  // ---- SCROLL SMOOTH (fallback pour les vieux navigateurs) ----
  // Améliore l'UX sur les liens internes et les scrolls.
  if (!CSS.supports('scroll-behavior', 'smooth')) {
    // Fallback pour navigateurs qui ne supportent pas scroll-behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ---- GESTION DES ÉLÉMENTS VIDES ----
  // Améliore l'accessibilité des sections vides.
  const emptyStates = document.querySelectorAll('.empty-state');
  emptyStates.forEach(state => {
    state.setAttribute('role', 'status');
    state.setAttribute('aria-live', 'polite');
  });
});
