// Mobile menu toggle
let edumeritData = null;
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Banner Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    const activeSlide = slides[currentSlide];
    // Restart zoom animation
    activeSlide.style.animation = 'none';
    activeSlide.offsetHeight; // reflow
    activeSlide.style.animation = '';
    activeSlide.classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

if (sliderNext) {
    sliderNext.addEventListener('click', nextSlide);
}

if (sliderPrev) {
    sliderPrev.addEventListener('click', prevSlide);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Initialize slider on page load
showSlide(currentSlide);

let slideInterval = setInterval(nextSlide, 5000);

// Pause on hover for better UX
const hero = document.getElementById('heroBanner');
if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(slideInterval));
    hero.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// Counter animation
const counters = document.querySelectorAll('.counter');

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 200;

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => animateCounter(counter), 10);
    } else {
        counter.innerText = target;
    }
};

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            if (counter.innerText === '0') {
                animateCounter(counter);
            }
        }
    });
}, observerOptions);

counters.forEach(counter => observer.observe(counter));

// Course category filter
const categoryTabs = document.querySelectorAll('.cat-tab');
const courseCards = document.querySelectorAll('.course-card');

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-cat');
        
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        courseCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-cat') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Scroll to top button
const scrollTop = document.getElementById('scrollTop');

if (scrollTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTop.classList.add('show');
        } else {
            scrollTop.classList.remove('show');
        }
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        }
    });
});

// Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing! We will keep you updated.');
        newsletterForm.reset();
    });
}

// Contact / marketing forms
const apiBase = window.location.pathname.includes('/pages/') ? '../' : '';
const saveEndpoint = apiBase + 'api/save.php';

const submitForm = async (form, data, messageEl) => {
    try {
        const response = await fetch(saveEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (response.ok && result.success) {
            messageEl.style.display = 'block';
            messageEl.className = 'form-message success';
            messageEl.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your request has been received. We will contact you soon.';
            form.reset();
        } else {
            throw new Error(result.message || 'Submission failed.');
        }
    } catch (error) {
        console.error(error);
        messageEl.style.display = 'block';
        messageEl.className = 'form-message error';
        messageEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Sorry, an error occurred. Please try again later.';
    }
};

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            type: 'contact_us',
            name: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            subject: contactForm.querySelector('input[placeholder="Subject"]').value,
            message: contactForm.querySelector('textarea').value
        };
        let messageEl = document.getElementById('formMessage');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'formMessage';
            messageEl.className = 'form-message';
            contactForm.parentElement.appendChild(messageEl);
        }
        submitForm(contactForm, data, messageEl);
    });
}

const dmForm = document.getElementById('digitalMarketingForm');
if (dmForm) {
    dmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            type: 'digital_marketing',
            name: dmForm.querySelector('#name').value,
            email: dmForm.querySelector('#email').value,
            phone: dmForm.querySelector('#phone').value,
            company: dmForm.querySelector('#company').value,
            service: dmForm.querySelector('#service').value,
            message: dmForm.querySelector('#message').value
        };
        const messageEl = document.getElementById('formMessage');
        submitForm(dmForm, data, messageEl);
    });
}

// Load dynamic content from API
async function loadDynamicContent() {
    try {
        const response = await fetch('api/content.php');
        let data = await response.json();

        // Local overrides from dashboard localStorage if present
        const stored = localStorage.getItem('edumeritContent');
        if (stored) {
            try {
                const localData = JSON.parse(stored);
                data = { ...data, ...localData };
                if (localData.courses) data.courses = localData.courses;
                if (localData.currentAffairs) data.currentAffairs = localData.currentAffairs;
                if (localData.resources) data.resources = localData.resources;
                if (localData.quiz) data.quiz = localData.quiz;
            } catch (e) {
                console.warn('Invalid local edumeritContent JSON');
            }
        }

        window.edumeritData = data;

        // Update content wherever relevant
        updateSharedContent(data);
        renderAcademicOrCompetitive(data);
        renderCurrentAffairs(data);
        renderResources(data);
        renderQuizPage(data);

    } catch (error) {
        console.log('Using default content');
    }
}

function updateSharedContent(data) {
    // Update banners for homepage
    if (data.banners && data.banners.length >= 3) {
        const setTextSafe = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        setTextSafe('banner1Title', data.banners[0].title);
        setTextSafe('banner1Subtitle', data.banners[0].subtitle);
        setTextSafe('banner2Title', data.banners[1].title);
        setTextSafe('banner2Subtitle', data.banners[1].subtitle);
        setTextSafe('banner3Title', data.banners[2].title);
        setTextSafe('banner3Subtitle', data.banners[2].subtitle);
    }

    if (data.about) {
        const aboutPreview = document.getElementById('aboutPreview');
        if (aboutPreview) aboutPreview.textContent = data.about;
    }

    const courseGrid = document.getElementById('featuredCourses');
    if (courseGrid && data.courses && data.courses.length > 0) {
        courseGrid.innerHTML = data.courses.map(course => `
            <div class="course-card" data-cat="${(course.category || 'Academic').toLowerCase()}">
                <div class="course-icon"><i class="${course.icon || 'fas fa-book'}"></i></div>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <span class="course-badge">${course.category || 'Academic'}</span>
                <a href="pages/courses.html" class="course-link">View Details <i class="fas fa-arrow-right"></i></a>
            </div>
        `).join('');
    }

    if (data.contact) {
        const footerPhone = document.getElementById('footerPhone');
        const footerEmail = document.getElementById('footerEmail');
        const footerAddress = document.getElementById('footerAddress');

        if (footerPhone) footerPhone.textContent = data.contact.phone;
        if (footerEmail) footerEmail.textContent = data.contact.email;
        if (footerAddress) footerAddress.textContent = data.contact.address;
    }
}

function renderAcademicOrCompetitive(data) {
    const path = window.location.pathname;
    let category = null;

    if (path.includes('academic.html')) category = 'Academic';
    if (path.includes('competitive.html')) category = 'Competitive';

    if (!category) return;

    const container = document.getElementById('programCards');
    if (!container) return;

    const allCourses = data.courses || [];
    const filtered = allCourses.filter(c => (c.category || '').toLowerCase() === category.toLowerCase());

    if (!filtered.length) {
        container.innerHTML = `<p class="empty-state">No ${category} courses available yet. Add via the admin dashboard.</p>`;
        return;
    }

    container.innerHTML = filtered.map(course => `
        <div class="class-card">
            <div class="class-header">
                <h3>${course.title}</h3>
                <div class="class-icon"><i class="${course.icon || 'fas fa-book-open'}"></i></div>
            </div>
            <div class="class-details">
                <p>${course.description}</p>
            </div>
            <a href="contact.html" class="btn-primary">Enroll Now</a>
        </div>
    `).join('');
}

function renderCurrentAffairs(data) {
    if (!document.getElementById('dailyGrid') && !document.getElementById('weeklyGrid') && !document.getElementById('monthlyGrid')) {
        return;
    }

    const formatCard = (item) => `
        <div class="affair-card">
            <div class="affair-date">${item.date || 'Date not set'}</div>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <a href="${item.link || '#'}" class="btn-download"><i class="fas fa-download"></i> ${item.link ? 'Download' : 'Details'}</a>
        </div>
    `;

    const affairs = data.currentAffairs || { daily: [], weekly: [], monthly: [] };
    const dailyGrid = document.getElementById('dailyGrid');
    const weeklyGrid = document.getElementById('weeklyGrid');
    const monthlyGrid = document.getElementById('monthlyGrid');
    const quizGrid = document.getElementById('quizGrid');

    if (dailyGrid) dailyGrid.innerHTML = (affairs.daily || []).map(formatCard).join('') || '<p>No daily current affairs yet.</p>';
    if (weeklyGrid) weeklyGrid.innerHTML = (affairs.weekly || []).map(formatCard).join('') || '<p>No weekly current affairs yet.</p>';
    if (monthlyGrid) monthlyGrid.innerHTML = (affairs.monthly || []).map(formatCard).join('') || '<p>No monthly current affairs yet.</p>';

    if (quizGrid) {
        const curQuiz = (data.quiz || []).filter(q => (q.category || '').toLowerCase() === 'current affairs');
        quizGrid.innerHTML = curQuiz.length ? curQuiz.slice(0, 3).map(q => `
            <div class="affair-card">
                <div class="affair-date">Quiz</div>
                <h4>${q.question}</h4>
                <p>Type: ${q.category}</p>
                <a href="quiz.html" class="btn-download"><i class="fas fa-play"></i> Try Quiz</a>
            </div>
        `).join('') : '<p>No Current Affairs quiz items yet.</p>';
    }
}

function renderResources(data) {
    const grid = document.getElementById('resourcesGrid');
    if (!grid) return;

    const resources = data.resources || [];
    if (!resources.length) {
        grid.innerHTML = '<p>No resources available yet. Add via the admin dashboard.</p>';
        return;
    }

    grid.innerHTML = resources.map(res => {
        const cv = res.category ? res.category.toLowerCase().replace(' ', '-') : 'general';
        return `
            <div class="resource-card" data-category="${cv}">
                <div class="resource-icon pdf"><i class="fas fa-file-pdf"></i></div>
                <div class="resource-info">
                    <h4>${res.title}</h4>
                    <p>${res.description}</p>
                    <span class="resource-meta"><i class="fas fa-file"></i> PDF &nbsp;|&nbsp; <i class="fas fa-download"></i> Free</span>
                </div>
                <a href="${res.link || '#'}" class="btn-download"><i class="fas fa-download"></i> Download</a>
            </div>
        `;
    }).join('');

    const categoryBtns = document.querySelectorAll('.category-btn');
    if (categoryBtns.length) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                document.querySelectorAll('.resource-card').forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

function renderQuizPage(data) {
    const quizCard = document.getElementById('quizCard');
    if (!quizCard) return;

    const quizWidget = document.getElementById('quizWidget');
    if (quizWidget) {
        // Not needed for now; quiz page handles its own UI.
    }
}

// Load content on page load
document.addEventListener('DOMContentLoaded', loadDynamicContent);

// Tab functionality for course pages
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    });
});
