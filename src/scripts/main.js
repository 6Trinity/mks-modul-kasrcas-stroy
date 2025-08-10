import '@/styles/main.scss';

document.addEventListener('DOMContentLoaded', function() {
    const scrollThreshold = 50;
    const headers = document.querySelector('.appheader-content');
    const navg = document.querySelector('.nav-ul-g');
    const btnmenu = document.getElementById('btn');
    const menu = document.querySelector('.appheader-menu-nav');


    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            headers.classList.add('scrolled');
            navg.classList.add('scrolled');
        } else {
            headers.classList.remove('scrolled');
            navg.classList.remove('scrolled');
        }
    });

    btnmenu.addEventListener('click', () =>{
        menu.classList.toggle('active');
    })
});