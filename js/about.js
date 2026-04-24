document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Aqui você pode adicionar a lógica para enviar o formulário
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    this.reset();
});

// Animação ao scroll
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    
    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Checar elementos visíveis no carregamento inicial
});
