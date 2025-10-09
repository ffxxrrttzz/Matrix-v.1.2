document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('#contact-form, #contact-form-sidebar');
    
    forms.forEach(contactForm => {
        if (!contactForm) return;
        
        contactForm.classList.add('enhanced');
        
        contactForm.addEventListener('submit', async function(e) {
            if (!contactForm.classList.contains('enhanced')) return;
            
            e.preventDefault();
            
            // Валидация основных полей
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            
            // Валидация чекбокса
            const checkbox = contactForm.querySelector('input[type="checkbox"]');
            if (checkbox && !checkbox.checked) {
                showMessage(contactForm, 'Пожалуйста, согласитесь с условиями', 'error');
                return;
            }
            
            // Отправка через Fetch API
            await handleFormSubmit(contactForm);
        });
    });
    
    async function handleFormSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Loading state
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Собираем данные в объект для JSON
            const formData = new FormData(form);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                agree: formData.get('agree') // преобразуем строку в boolean
            };
            
            console.log('Отправляемые данные:', data);
            
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            });
            
            console.log('Статус ответа:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Ответ сервера:', result);
                showMessage(form, 'Сообщение успешно отправлено!', 'success');
                form.reset();
            } else {
                const errorText = await response.text();
                console.error('Ошибка сервера:', errorText);
                throw new Error(`Server error: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Error:', error);
            showMessage(form, 'Ошибка отправки. Попробуйте еще раз.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    function showMessage(form, text, type) {
        // Удаляем предыдущие сообщения в этой форме
        const existingMsg = form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        // Создаем новое сообщение
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = text;
        
        // Находим контейнер с кнопкой отправки
        const submitContainer = form.querySelector('.message-btn') || 
                               form.querySelector('.more__buttons') || 
                               form.querySelector('button[type="submit"]').parentElement;
        
        // Добавляем сообщение перед кнопкой
        submitContainer.parentNode.insertBefore(messageEl, submitContainer);
        
        // Автоудаление через 5 сек
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }
});