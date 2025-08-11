import '@/styles/main.scss';

document.addEventListener('DOMContentLoaded', function() {
    const scrollThreshold = 50;
    const menu = document.querySelector('.appheader-menu');
    const ulg = document.querySelector('.ul-g');

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            menu.classList.add('scrolled');
            ulg.classList.add('scrolled');
        } else {
            menu.classList.remove('scrolled');
            ulg.classList.remove('scrolled');
        }
    });
});