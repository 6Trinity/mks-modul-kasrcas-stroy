import '@/styles/main.scss';

document.addEventListener('DOMContentLoaded', function() {
    const scrollThreshold = 50;
    const header = this.querySelector('.appheader-content')

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    btnmenu.addEventListener('click', () =>{
        btnmenu.classList.toggle('active');
        menunav.classList.toggle('active');
    })
});