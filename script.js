const input = document.querySelector("#tel");
const iti = window.intlTelInput(input, {
    onlyCountries: ["fr"],
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@17.0.0/build/js/utils.js" // Pour le formatage des numéros
});

const submitButton = document.getElementById('btnSubmit');
const nextButton = document.getElementById('next');
const loader = document.getElementById('loader');

const swiper = new Swiper('.swiper', {
    navigation: {
        nextEl: '.button-next',
        prevEl: '.button-prev',
        enabled: false // Initialement désactiver les boutons de navigation
    },
    speed: 600,
    allowTouchMove: false,
    autoHeight: true
});
let avertissement=document.querySelector(".avertissement");
function updateNavigation() {
    const currentSlide = swiper.slides[swiper.activeIndex];
    const slideIndex = swiper.activeIndex;

    let hasValidInput = false;
    
    if (slideIndex === 5 || slideIndex === 6) { // Slides 6 et 7 (index 5 et 6)
        // Slide 6 (index 5)
        if (slideIndex === 5) {
            const postalCodeInput = currentSlide.querySelector('input[type="number"]');
            hasValidInput = postalCodeInput && postalCodeInput.value.trim() !== '';
        }
        
        // Slide 7 (index 6)
        if (slideIndex === 6) {
            const requiredTextInputs = Array.from(currentSlide.querySelectorAll('input[type="text"], input[type="mail"], input[type="tel"]'));
            hasValidInput = requiredTextInputs.every(input => input.value.trim() !== '');
        }
    } else {
        // Vérifiez les boutons radio pour les autres diapositives
        const hasSelectedRadio = currentSlide.querySelector('input[type="radio"]:checked') !== null;
        hasValidInput = hasSelectedRadio;
    }

    // Activer ou désactiver la navigation en fonction de la validité des champs
    swiper.navigation.enabled = hasValidInput;
    
    // Gérer l'état visuel du bouton de navigation
    document.querySelector('.button-next').classList.toggle('swiper-button-disabled', !hasValidInput);

    if (slideIndex === swiper.slides.length - 1) {
        // Dernière diapositive
        document.getElementById('next').style.display = 'none';
        document.getElementById('btnSubmit').style.display = 'block';
    } else {
        // Autres diapositives
        document.getElementById('next').style.display = 'block';
        document.getElementById('btnSubmit').style.display = 'none';
    }
}

// Écouteur d'événement pour les changements de diapositive
swiper.on('slideChange', () => {
    updateNavigation();
});

// Mettre à jour la navigation lors du chargement initial
updateNavigation();

// Gestion des clics sur le bouton de navigation
document.querySelector('.button-next').addEventListener('click', () => {
    const currentSlide = swiper.slides[swiper.activeIndex];
    const slideIndex = swiper.activeIndex;

    let isValid = false;
    
    if (slideIndex === 5 || slideIndex === 6) { // Slides 6 et 7 (index 5 et 6)
        if (slideIndex === 5) { // Slide 6
            const postalCodeInput = currentSlide.querySelector('input[type="number"]');
            isValid = postalCodeInput && postalCodeInput.value.trim() !== '';
        } else if (slideIndex === 6) { // Slide 7
            const requiredTextInputs = Array.from(currentSlide.querySelectorAll('input[type="text"], input[type="mail"], input[type="tel"]'));
            isValid = requiredTextInputs.every(input => input.value.trim() !== '');
        }
    } else {
        const selectedRadio = currentSlide.querySelector('input[type="radio"]:checked');
        isValid = !!selectedRadio;
    }

    if (!isValid) {
        avertissement.style.visibility="visible";
        swiper.navigation.enabled = false;
        document.querySelector('.button-next').classList.add('swiper-button-disabled');
    } else {
        avertissement.style.visibility="hidden";
        swiper.slideNext();
        updateNavigation();
    }
});


document.querySelectorAll('.kililou-label').forEach(label => {
    label.addEventListener('click', () => {
        avertissement.style.visibility="hidden";
        setTimeout(() => {
            swiper.slideNext();
        }, 500);
    });
});
document.querySelectorAll('.label-finSimulation').forEach(label => {
    label.addEventListener('click', (event) => {
            event.preventDefault(); // Prévenir le comportement par défaut
            document.getElementById('next').style.display = 'none';
            window.location.href = 'https://www.ecoethabitation.com/pas-eligible'
    });
});

const scriptURL = 'https://script.google.com/macros/s/AKfycbzBnaoxPRD2MnDIddSzLQrX1wNqWsZ-q9go7_qpRSW49JSMi_eM3BMcD20nY2Ayxal0GA/exec'
const form = document.forms['formulaire']

form.addEventListener('submit', e => {
  e.preventDefault();

  submitButton.classList.add('loading');
  loader.style.display = 'inline-block';

  const tel = document.getElementById('tel');
  tel.value = iti.getNumber();
  const formData = new FormData(form);
  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => {
      if (response.ok) {
        window.location.href = 'https://www.ecoethabitation.com/remerciement-confirmation';
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    })
    .catch(error => {
      alert('Une erreur est survenue. Veuillez réessayer.');
      console.error('Error!', error.message);
    })
    .finally(() => {
        // Cacher le loader et réactiver le bouton de soumission
        submitButton.classList.remove('loading');
        loader.style.display = 'none';
    });
});
