import '@/styles/main.scss';

document.addEventListener('DOMContentLoaded', function() {
    const scrollThreshold = 50;
    const button_header = this.querySelector('.appheader_menu-button');
    const header = this.querySelector('.appheader-section');
    const header_menu = this.querySelector('.appheader_menu-nav');
    const phoneInput = document.getElementById('userPhone');

    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '+7';
    
        if (value.length > 1) {
            const restNumbers = value.substring(1);
      
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
        e.target.value = formattedValue;
    })

    phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && /[^\d]/.test(phoneInput.value[phoneInput.selectionStart - 1])) {
            e.preventDefault();
            phoneInput.selectionStart = phoneInput.selectionStart - 1;
            phoneInput.selectionEnd = phoneInput.selectionStart - 1;
        }
    })

    const toggleBodyScroll = (enable) => {
        document.body.style.overflow = enable ? '' : 'hidden';
    }

     window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    })

    button_header.addEventListener('click', () =>{
        button_header.classList.toggle('active');
        header_menu.classList.toggle('active');
        toggleBodyScroll(!header_menu.classList.contains('active'));
    })

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
    })

    document.getElementById('feedbackForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const message = `
            📞 *Новая заявка с сайта!* 
            Имя: ${formData.get('name')|| 'Не указано'}
            Телефон: ${formData.get('phone')|| 'Не указано'}
            Почта: ${formData.get('email')|| 'Не указано'}
            Сообщение: ${formData.get('message') || 'Не указано'}
        `;

        fetch(`https://api.telegram.org/bot8210299195:AAHiZvBiyoP7qIqx8-hIS5R-yu9OZ7IMoPk/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: '6706938155',
                text: message,
                parse_mode: 'Markdown'
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Заявка отправлена! Мы скоро вам перезвоним.');
            this.reset();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Что-то пошло не так. Попробуйте позвонить нам по телефону или отправить письмо на почту.');
        })
    })
})