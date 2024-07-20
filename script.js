const swiper = new Swiper('.swiper', {
    navigation: {
        nextEl: '.button-next',
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
        // Add a small delay to ensure the radio button is selected before sliding
        avertissement.style.visibility="hidden";
        setTimeout(() => {
            //updateNavigation();
            swiper.slideNext();
        }, 500);
    });
});