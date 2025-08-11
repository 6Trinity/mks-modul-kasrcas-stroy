import '@/styles/main.scss';

document.addEventListener('DOMContentLoaded', function() {
    const scrollThreshold = 50;
    const header = this.querySelector('.appheader-content');
    const menu = this.querySelector('.menu-nav');
    const btnmenu = this.querySelector('.button-menu');

    const toggleBodyScroll = (enable) => {
        document.body.style.overflow = enable ? '' : 'hidden';
    };

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    btnmenu.addEventListener('click', () =>{
        btnmenu.classList.toggle('active');
        menu.classList.toggle('active');
        toggleBodyScroll(!menu.classList.contains('active'));
    })

    document.querySelectorAll('.menu-nav a').forEach(link => {
        link.addEventListener('click', (e) => {

            menu.classList.remove('active');
            btnmenu.classList.remove('active');
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
});