import '@/styles/main.scss';

let steps, prevBtn, nextBtn, counter, colc_form_button, 
currentStep, totalPrice, userSelections;

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
};

function nextStep() {
    if (currentStep < steps.length) {
        steps[currentStep - 1].classList.remove('active');
        currentStep++;
        steps[currentStep - 1].classList.add('active');
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
    }
};

function prevStep() {
    if (currentStep > 1) {
        resetCurrentStepSelection(currentStep);

        steps[currentStep - 1].classList.remove('active');
        currentStep--;
        steps[currentStep - 1].classList.add('active');
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

document.addEventListener('DOMContentLoaded', function() {

    const scrollThreshold = 50;
    const button_header = document.querySelector('.appheader_menu-button');
    const header = document.querySelector('.appheader_section');
    const header_menu = document.querySelector('.appheader_menu-nav');
    colc_form_button = document.querySelector('.calculator-form__button');

    currentStep = 1;
    totalPrice = 0;
    userSelections = [];

    steps = document.querySelectorAll('.calculator-test__step');
    prevBtn = document.getElementById('calculator-test__prev');
    nextBtn = document.getElementById('calculator-test__next');
    counter = document.getElementById('nav-steps');

    new ScrollAnimator();

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

    colc_form_button.addEventListener('click', () =>{
        colc_form_button.classList.toggle('active');
    });

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

    initCalculator();
})



