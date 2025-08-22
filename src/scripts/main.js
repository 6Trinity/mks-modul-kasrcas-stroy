import '@/styles/main.scss';

document.addEventListener('DOMContentLoaded', function() {
    const scrollThreshold = 50;
    const btn_menu = this.querySelector('.btn-toggle');
    const header = this.querySelector('.appheader-content');
    const menu = this.querySelector('.appheadermenu-nav');

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

    btn_menu.addEventListener('click', () =>{
        btn_menu.classList.toggle('active');
        menu.classList.toggle('active');
        toggleBodyScroll(!menu.classList.contains('active'));
    })

    document.querySelectorAll('.appheadermenu-nav a').forEach(link => {
        link.addEventListener('click', (e) => {

            menu.classList.remove('active');
            btn_menu.classList.remove('active');
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
    document.querySelectorAll('.appfooter-nav a').forEach(link => {
        link.addEventListener('click', (e) => {

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