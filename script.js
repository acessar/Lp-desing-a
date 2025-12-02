// Loader
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 800);
});

// Fade-in no scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar elementos fade-in
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.fade-in-element').forEach(el => {
        observer.observe(el);
    });
});

// Parallax effect suave
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const banner = document.querySelector('.hero-banner');
    if (banner) {
        const rate = scrolled * -0.3;
        banner.style.transform = `translateY(${rate}px)`;
    }
});

// Abrir e fechar modal
function openModal() {
    document.getElementById('formModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('formModal').classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('whatsappForm').reset();
    document.getElementById('successMessage').classList.remove('show');
    const submitButton = document.querySelector('.submit-button');
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
}

// Fechar modal ao clicar fora
document.getElementById('formModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Máscara para telefone
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
        formattedValue = '(' + value.substring(0, 2);
    }
    if (value.length > 2) {
        formattedValue += ') ' + value.substring(2, 7);
    }
    if (value.length > 7) {
        formattedValue += '-' + value.substring(7, 11);
    }
    
    e.target.value = formattedValue;
});

// Validar telefone
function isValidPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
}

// Enviar formulário
document.getElementById('whatsappForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitButton = document.querySelector('.submit-button');
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Coletar dados
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const tamanho = document.getElementById('tamanho').value;
    const mensagem = document.getElementById('mensagem').value.trim();
    
    // Validações
    if (!nome || !telefone) {
        alert('Por favor, preencha seu nome e telefone.');
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        return;
    }
    
    if (!isValidPhone(telefone)) {
        alert('Por favor, digite um telefone válido.');
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        return;
    }
    
    // Montar mensagem
    let whatsappMessage = `👔 *Style Men - Interesse em Nossos Produtos*\n\n`;
    whatsappMessage += `👤 *Nome:* ${nome}\n`;
    whatsappMessage += `📱 *Telefone:* ${telefone}\n`;
    
    if (endereco) {
        whatsappMessage += `📍 *Endereço:* ${endereco}\n`;
    }
    if (tamanho) {
        whatsappMessage += `👕 *Categoria de Interesse:* ${tamanho}\n`;
    }
    if (mensagem) {
        whatsappMessage += `💬 *Detalhes:* ${mensagem}\n`;
    }
    
    whatsappMessage += `\n_Gostaria de conhecer nossos produtos e receber ofertas! 🛍️_`;
    
    const whatsappNumber = '5583991816152';
    
    // Processar e redirecionar
    setTimeout(() => {
        document.getElementById('successMessage').classList.add('show');
        
        setTimeout(() => {
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            
            try {
                const newWindow = window.open(whatsappURL, '_blank');
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    window.location.href = whatsappURL;
                }
            } catch (error) {
                window.location.href = whatsappURL;
            }
            
            setTimeout(closeModal, 500);
        }, 1000);
    }, 600);
});

// ESC para fechar modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Otimização para dispositivos móveis
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// --- CARROSSEL DE SERVIÇOS COM DRAG ---
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('servicesCarousel');
    
    // Se não houver carrossel na página, encerra a função
    if (!carousel) return;

    // Forçar o início no zero
    carousel.scrollLeft = 0;

    let currentIndex = 0;
    const cards = carousel.querySelectorAll('.service-card');
    const totalCards = cards.length;
    let isScrolling = false;
    let autoScrollInterval;
    
    // Variáveis para Drag (Arrastar)
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let startScrollLeft = 0;
    
    // Função para mover o scroll até um card específico
    function scrollToCard(index) {
        if (isScrolling || isDragging) return;
        
        // Proteção: verifica se o card existe
        if (!cards[index]) return;

        isScrolling = true;
        
        const card = cards[index];
        const cardWidth = card.offsetWidth;
        
        // Cálculo para centralizar ou focar o card
        const scrollPosition = card.offsetLeft - (carousel.offsetWidth - cardWidth) / 2;
        
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
        }, 500);
    }
    
    // Função para ir ao próximo card
    function nextCard() {
        if (isDragging) return;
        currentIndex = (currentIndex + 1) % totalCards;
        scrollToCard(currentIndex);
    }
    
    // Iniciar rolagem automática
    function startAutoScroll() {
        if (isDragging) return;
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(nextCard, 4000); // 4 segundos
    }
    
    // Parar rolagem automática
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Resetar timer de inatividade
    let inactivityTimer;
    function resetAutoScroll() {
        stopAutoScroll();
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (!isDragging) {
                startAutoScroll();
            }
        }, 5000);
    }
    
    // --- Eventos de Mouse (Desktop) ---
    let mouseDown = false;
    let mouseMoved = false;
    let dragStartTime = 0;
    
    carousel.addEventListener('mousedown', function(e) {
        mouseDown = true;
        mouseMoved = false;
        dragStartTime = Date.now();
        isDragging = true;
        carousel.classList.add('dragging');
        startX = e.pageX - carousel.offsetLeft;
        startScrollLeft = carousel.scrollLeft;
        resetAutoScroll();
    });
    
    carousel.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            mouseDown = false;
            carousel.classList.remove('dragging');
        }
    });
    
    carousel.addEventListener('mouseup', function(e) {
        if (isDragging) {
            const dragDuration = Date.now() - dragStartTime;
            isDragging = false;
            mouseDown = false;
            carousel.classList.remove('dragging');
            
            // Se não moveu significativamente e foi um click rápido, permite o click no card
            if (!mouseMoved && dragDuration < 300) {
                setTimeout(() => {
                    const card = e.target.closest('.service-card');
                    if (card) {
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        card.dispatchEvent(clickEvent);
                    }
                }, 10);
            }
            
            resetAutoScroll();
        }
        mouseMoved = false;
    });
    
    carousel.addEventListener('mousemove', function(e) {
        if (!isDragging || !mouseDown) return;
        
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Velocidade do arrasto
        
        // Se moveu mais de 3px, considera como drag
        if (Math.abs(walk) > 3) {
            mouseMoved = true;
            e.preventDefault();
            e.stopPropagation();
            carousel.scrollLeft = startScrollLeft - walk;
        }
    });
    
    // --- Eventos de Touch (Celular) ---
    let touchStartX = 0;
    let touchStartScrollLeft = 0;
    let touchMoved = false;
    let touchStartTime = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        isDragging = true;
        touchMoved = false;
        touchStartTime = Date.now();
        carousel.classList.add('dragging');
        touchStartX = e.touches[0].pageX - carousel.offsetLeft;
        touchStartScrollLeft = carousel.scrollLeft;
        resetAutoScroll();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - touchStartX) * 2;
        
        // Se moveu mais de 3px, considera como drag
        if (Math.abs(walk) > 3) {
            touchMoved = true;
            carousel.scrollLeft = touchStartScrollLeft - walk;
        }
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
        if (isDragging) {
            const touchDuration = Date.now() - touchStartTime;
            isDragging = false;
            carousel.classList.remove('dragging');
            
            // Se não moveu significativamente e foi um tap rápido, permite o click no card
            if (!touchMoved && touchDuration < 300) {
                setTimeout(() => {
                    const card = e.target.closest('.service-card');
                    if (card) {
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        card.dispatchEvent(clickEvent);
                    }
                }, 10);
            }
            
            resetAutoScroll();
        }
        touchMoved = false;
    });
    
    // Detectar scroll manual para atualizar o índice atual
    let scrollTimeout;
    carousel.addEventListener('scroll', function() {
        // Pausa o automático se o usuário scrollar
        resetAutoScroll();
        
        // Atualiza qual é o card "ativo" (o mais centralizado)
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const carouselCenter = carousel.scrollLeft + carousel.offsetWidth / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;
            
            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const distance = Math.abs(carouselCenter - cardCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });
            currentIndex = closestIndex;
        }, 100);
    });
    
    // Inicialização final do carrossel
    setTimeout(() => {
        carousel.scrollLeft = 0; // Garante mais uma vez que começa do início
        startAutoScroll();
    }, 1000);
});

