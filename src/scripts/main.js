import '@/styles/main.scss';

let steps, prevBtn, nextBtn, counter, colc_form_button, 
currentStep, totalPrice, userSelections, popupForm, feedbackForm;

const GOOGLE_FORM_ID = '1FAIpQLSfv-nxvgjLHYWsg5nGpOkqsZk3voWtGDy30Rof2gHP65peyWA'; 
const GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;

const FIELD_IDS = {
    name: 'entry.38755223',      // Поле "Имя"
    phone: 'entry.1626865542',   // Поле "Телефон"
    email: 'entry.910260297',   // Поле "Email" 
    message: 'entry.1197614220', // Поле "Сообщение"
    testData: 'entry.574560963' // Для результатов теста
};

async function sendToGoogleForm(formData) {
    try {
        const formPayload = new URLSearchParams();
        
        formPayload.append(FIELD_IDS.name, formData.name || 'Не указано');
        formPayload.append(FIELD_IDS.phone, formData.phone || 'Не указано');
        formPayload.append(FIELD_IDS.email, formData.email || 'Не указано');
        formPayload.append(FIELD_IDS.message, formData.message || 'Не указано');
        
        if (userSelections.length > 0) {
            const testResults = userSelections.map(item => 
                `${item.name} - ${item.price.toLocaleString()} руб.`
            ).join('; ');
            
            formPayload.append(FIELD_IDS.testData, 
                `Опции: ${testResults}; Итого: ${totalPrice.toLocaleString()} руб.`);
        }

        await fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            body: formPayload,
            mode: 'no-cors'
        });

        return true;
        
    } catch (error) {
        console.log('Данные сохранены локально');
        saveToLocalStorage(formData);
        return true;
    }
}

const toggleBodyScroll = (enable) => {
    document.body.style.overflow = enable ? '' : 'hidden';
};

function initCalculator() {
    updateCounter();
    setupEventListeners();
};

function setupEventListeners() {

    document.querySelectorAll('.calculator-test__button').forEach(button => {
        button.addEventListener('click', function() {
            const price = parseInt(this.getAttribute('data-price'));
            const name = this.getAttribute('data-name');
        
            userSelections.push({
                step: currentStep,
                name: name,
                price: price
            });
            totalPrice += price;
            nextStep();
        })
    })
    
    prevBtn.addEventListener('click', prevStep);
    
    nextBtn.addEventListener('click', nextStep);

    const calculatorForm = document.querySelector('.calculator-form__feed');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('[name="name"]').value,
                phone: this.querySelector('[name="phone"]').value,
                email: this.querySelector('[name="email"]').value,
                message: 'Заявка из калькулятора'
            };
            
            await sendToGoogleForm(formData);
            this.reset();
        });
    }
};

function setupFormListeners(){

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('[name="name"]').value,
                phone: this.querySelector('[name="phone"]').value,
                email: this.querySelector('[name="email"]').value,
                message: this.querySelector('[name="message"]').value || ''
            };
            
            await sendToGoogleForm(formData);
            this.reset();
        });
    };

    if (popupForm) {
        popupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const modelInput = document.getElementById('model_name');
            const modelName = modelInput ? modelInput.value : 'Не указана';

            const formData = {
                name: this.querySelector('[name="name"]').value,
                phone: this.querySelector('[name="phone"]').value,
                email: this.querySelector('[name="email"]').value,
                message: this.querySelector('[name="message"]').value || ''
            };

            if (modelName !== 'Не указана') {
                formData.message = `Модель: ${modelName}. ${formData.message}`;
            }

            await sendToGoogleForm(formData);
            this.reset();
        });
    }
};

function nextStep() {
    if (currentStep < steps.length) {
        steps[currentStep - 1].classList.remove('active');
        steps[currentStep - 1].classList.add('hiding');
        currentStep++;
        setTimeout(() =>{
            steps[currentStep - 1].classList.remove('hiding');
            steps[currentStep - 1].classList.add('active');
        }, 350);

        updateCounter();

        if (currentStep === steps.length) {
            document.getElementById('total-price').textContent = totalPrice.toLocaleString();
            colc_form_button.classList.add('active');
            nextBtn.textContent = 'Завершить';
            const selectionsHTML = userSelections.map(item => 
                `<div class="flex gap-05">
                    <span>${item.name} ~ </span>
                    <span>${item.price.toLocaleString()} руб.</span>
                </div>`
            ).join('');

            const finalStep = document.getElementById('result-price');
            finalStep.innerHTML = `${selectionsHTML}`;
            }
    } else {
        resetCalculator();
        steps[currentStep - 1].classList.remove('hiding');
        steps[currentStep - 1].classList.add('active');
    }
};

function prevStep() {
    if (currentStep > 1) {
        resetCurrentStepSelection(currentStep);

        
        steps[currentStep - 1].classList.remove('active');;
        steps[currentStep - 1].classList.add('hiding');
        currentStep--;

        setTimeout(() =>{
            steps[currentStep - 1].classList.remove('hiding');;
            steps[currentStep - 1].classList.add('active');
        }, 350);

        updateCounter();
        
        resetCurrentStepSelection(currentStep);
        nextBtn.textContent = 'Следующий';
    }
};

function resetCurrentStepSelection(stepNumber) {
    userSelections = userSelections.filter(item => item.step !== stepNumber);
    totalPrice = userSelections.reduce((sum, item) => sum + item.price, 0);
};

function updateCounter() {
    if (counter) {
        counter.textContent = `${currentStep} / ${steps.length}`;
    }
};

function resetCalculator() {
    currentStep = 1;
    totalPrice = 0;
    userSelections = [];

    steps.forEach(step => step.classList.remove('active'));
    steps[0].classList.add('active');

    nextBtn.textContent = 'Следующий';
    updateCounter();

    document.getElementById('total-price').textContent = '0';
    const finalStep = document.getElementById('result-price');
    if (finalStep) {
        finalStep.innerHTML = '';
    }
};

function formatPhoneNumber(phone) {
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11 && cleaned[0] === '8') {
        cleaned = '7' + cleaned.slice(1);
    }
    
    let formattedValue = '+7';
    
    if (cleaned.length > 1) {
        const restNumbers = cleaned.substring(1);
        
        if (restNumbers.length > 0) {
            formattedValue += ' (' + restNumbers.substring(0, 3);
        }
        if (restNumbers.length > 3) {
            formattedValue += ') ' + restNumbers.substring(3, 6);
        }
        if (restNumbers.length > 6) {
            formattedValue += '-' + restNumbers.substring(6, 8);
        }
        if (restNumbers.length > 8) {
            formattedValue += '-' + restNumbers.substring(8, 10);
        }
    }
    
    return formattedValue;
};
class ScrollAnimator {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);
                }
            })
        },
        {
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.fade-in').forEach(element => {
            this.observer.observe(element);
        });
    }
};

class BanyaGallery {
    constructor(container) {
        this.mainPhoto = container.querySelector('#main-photo');
        this.thumbs = container.querySelectorAll('.thumb');
        this.prevBtn = container.querySelector('.banya-button_prev');
        this.nextBtn = container.querySelector('.banya-button_next');
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                this.setActivePhoto(index);
            });
        });
        
        this.prevBtn.addEventListener('click', () => this.prevPhoto());
        this.nextBtn.addEventListener('click', () => this.nextPhoto());
    }
    
    setActivePhoto(index) {
        this.currentIndex = index;
        
        this.mainPhoto.src = this.thumbs[index].src;
        
        this.thumbs.forEach(thumb => thumb.classList.remove('active'));
        this.thumbs[index].classList.add('active');
    }
    
    nextPhoto() {
        let nextIndex = (this.currentIndex + 1) % this.thumbs.length;
        this.setActivePhoto(nextIndex);
    }
    
    prevPhoto() {
        let prevIndex = (this.currentIndex - 1 + this.thumbs.length) % this.thumbs.length;
        this.setActivePhoto(prevIndex);
    }
};

class ReviewGallery {
    constructor(galleryContainer) {
        this.gallery = galleryContainer;
        this.items = this.gallery.querySelectorAll('.reviews-galery__item');
        this.prevBtn = this.gallery.querySelector('.reviews-galery__prev');
        this.nextBtn = this.gallery.querySelector('.reviews-galery__next');
        this.currentIndex = 0;
    
        this.init();
    }
  
    init() {

        this.prevBtn.addEventListener('click', () => {
            this.showPrevious();
        });
    
        this.nextBtn.addEventListener('click', () => {
            this.showNext();
        });
    
        this.updateGallery();
    }
  
    showPrevious() {
        this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.items.length - 1;
            }
        this.updateGallery();
    }
  
    showNext() {
        this.currentIndex++;
        if (this.currentIndex >= this.items.length) {
            this.currentIndex = 0;
        }
        this.updateGallery();
    }
  
    updateGallery() {

        this.items.forEach(item => {
            item.classList.remove('active');
        });

        this.items[this.currentIndex].classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', function() {

    const scrollThreshold = 50;
    const button_header = document.querySelector('.appheader-baner__button');
    const header = document.querySelector('.appheader-baner');
    const header_menu = document.querySelector('.appheader-baner__nav');
    const galleries = document.querySelectorAll('.reviews-baner__galery');
    const banyagalleries = document.querySelectorAll('.banya-baner__galery');
    const popup_button = document.querySelectorAll('.popup-button');
    const popup_baner = document.querySelector('.popup-baner'); 
    const popup_baner_close = document.querySelectorAll('.popup-button__close');
    const img_b_scale = document.querySelector('.img-big__scale');
    const img_scale = document.querySelector('.img-scale');

    currentStep = 1;
    totalPrice = 0;
    userSelections = [];

    colc_form_button = document.querySelector('.calculator-form__button');
    steps = document.querySelectorAll('.calculator-test__step');
    prevBtn = document.getElementById('calculator-test__prev');
    nextBtn = document.getElementById('calculator-test__next');
    counter = document.getElementById('nav-steps');

    popupForm = document.getElementById('popup-baner__form');
    feedbackForm = document.getElementById('feedbackForm');

    new ScrollAnimator();

    banyagalleries.forEach(gallery => new BanyaGallery(gallery));

    if(img_b_scale){
        img_b_scale.addEventListener('click', ()=>{
            img_scale.classList.add('active');
            toggleBodyScroll(false);
        })
    };

    if (img_scale) {
    img_scale.addEventListener('click', function() {
        this.classList.remove('active');
        toggleBodyScroll(true);
    });
}

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    button_header.addEventListener('click', () =>{
        button_header.classList.toggle('active');
        header_menu.classList.toggle('active');
        toggleBodyScroll(!header_menu.classList.contains('active'));
    });

    if(colc_form_button){
        colc_form_button.addEventListener('click', () =>{
            colc_form_button.classList.toggle('active');
        });
    }

    document.querySelectorAll('body a').forEach(link => {
        link.addEventListener('click', (e) => {

            header_menu.classList.remove('active');
            button_header.classList.remove('active');
            toggleBodyScroll(true);

            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    document.querySelectorAll('.userPhone').forEach(phoneInput => {
        if (!phoneInput.value) {
            phoneInput.value = '+7';
        }

        phoneInput.addEventListener('click', function(e) {
            if (e.target.value === '+7') {
                e.target.setSelectionRange(2, 2);
            }
        });

        phoneInput.addEventListener('focus', function(e) {
            if (e.target.value === '+7') {
                setTimeout(() => e.target.setSelectionRange(2, 2), 0);
            }
        });

        phoneInput.addEventListener('input', function(e) {
            const selectionStart = e.target.selectionStart;
            let value = e.target.value.replace(/\D/g, '');
            
            let formattedValue = formatPhoneNumber(value);
            e.target.value = formattedValue;
            
            if (selectionStart === 2 && formattedValue.length > 2) {
                e.target.setSelectionRange(2, 2);
            }
        });

        phoneInput.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && /[^\d]/.test(phoneInput.value[phoneInput.selectionStart - 1])) {
                e.preventDefault();
                const newPosition = phoneInput.selectionStart - 1;
                phoneInput.setSelectionRange(newPosition, newPosition);
            }
        });
    });

    galleries.forEach(gallery => {
        const reviewGallery = new ReviewGallery(gallery);
    });

    popup_button.forEach(button => {
        button.addEventListener('click', function() {
            popupForm.classList.add('active'); 
            popup_baner.classList.add('active');
            toggleBodyScroll(false);
        });
    });

    popup_baner_close.forEach(button => {
        button.addEventListener('click', function() {
            popupForm.classList.remove('active'); 
            popup_baner.classList.remove('active');
            toggleBodyScroll(true);
        });
    });

    document.addEventListener('click', function(e) {
        if (!popup_baner || !popup_baner.classList.contains('active')) return;
    
        const isClickInsideForm = popupForm.contains(e.target);
        const isClickOnPopupButton = e.target.closest('.popup-button');
        const isClickOnOpenButton = e.target.closest('.popup-form__button'); 
    
        if (!isClickInsideForm && !isClickOnPopupButton && !isClickOnOpenButton) {
            popup_baner.classList.remove('active');
            popupForm.classList.remove('active');
            toggleBodyScroll(true);
        } 
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup_baner && popup_baner.classList.contains('active')) {
            popup_baner.classList.remove('active');
            popupForm.classList.remove('active');
            toggleBodyScroll(true);
        }
        if (img_scale && e.key === 'Escape' && img_scale.classList.contains('active')) {
            img_scale.classList.remove('active');
            toggleBodyScroll(true);
        }
    });

    setupFormListeners();
    initCalculator();
});



