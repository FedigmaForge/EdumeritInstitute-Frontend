// Load dynamic content for pages
async function loadPageContent() {
    try {
        const response = await fetch('../api/content.php');
        const data = await response.json();
        
        // Update about content
        const aboutContent = document.getElementById('aboutContent');
        if (aboutContent && data.about) {
            aboutContent.innerHTML = `<p>${data.about}</p>`;
        }
        
        // Update courses
        const allCourses = document.getElementById('allCourses');
        if (allCourses && data.courses && data.courses.length > 0) {
            allCourses.innerHTML = data.courses.map(course => `
                <div class="course-card-detailed" data-aos="fade-up">
                    <div class="course-icon">
                        <i class="${course.icon}"></i>
                    </div>
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <ul class="course-features">
                        <li><i class="fas fa-check"></i> Expert Faculty</li>
                        <li><i class="fas fa-check"></i> Flexible Timings</li>
                        <li><i class="fas fa-check"></i> Study Materials</li>
                    </ul>
                    <a href="contact.html" class="enroll-btn">Enroll Now</a>
                </div>
            `).join('');
        }
        
        // Update current affairs
        const affairsList = document.getElementById('affairsList');
        if (affairsList && data.currentAffairs && data.currentAffairs.length > 0) {
            affairsList.innerHTML = data.currentAffairs.map(affair => {
                const date = new Date(affair.date);
                const day = date.getDate();
                const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
                const year = date.getFullYear();
                return `
                    <div class="affair-item" data-category="${affair.category.toLowerCase()}" data-aos="fade-up">
                        <div class="affair-date-badge">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                            <span class="year">${year}</span>
                        </div>
                        <div class="affair-details">
                            <span class="affair-tag ${affair.category.toLowerCase()}">${affair.category}</span>
                            <h3>${affair.title}</h3>
                            <p>${affair.description}</p>
                            <a href="#" class="read-more-link">Read Full Article <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Update blogs
        const blogGrid = document.getElementById('blogGrid');
        if (blogGrid && data.blogs && data.blogs.length > 0) {
            blogGrid.innerHTML = data.blogs.map(blog => `
                <article class="blog-card-full" data-aos="fade-up">
                    <div class="blog-image">
                        <img src="${blog.image || '../public/images/blog-placeholder.jpg'}" alt="${blog.title}">
                        <span class="blog-badge">Education</span>
                    </div>
                    <div class="blog-body">
                        <div class="blog-meta">
                            <span><i class="fas fa-calendar"></i> ${blog.date}</span>
                            <span><i class="fas fa-user"></i> Admin</span>
                        </div>
                        <h3>${blog.title}</h3>
                        <p>${blog.excerpt}</p>
                        <a href="#" class="read-more-btn">Read More <i class="fas fa-arrow-right"></i></a>
                    </div>
                </article>
            `).join('');
        }
        
        // Update contact info
        if (data.contact) {
            const ids = {
                contactPhone: data.contact.phone,
                contactEmail: data.contact.email,
                contactAddress: data.contact.address,
                footerPhone: data.contact.phone,
                footerEmail: data.contact.email,
                footerAddress: data.contact.address
            };
            Object.entries(ids).forEach(([id, val]) => {
                const el = document.getElementById(id);
                if (el && val) el.textContent = val;
            });
        }
        
        AOS.refresh();
    } catch (error) {
        console.log('Using default content');
    }
}

// Filter functionality for current affairs
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const items = document.querySelectorAll('.affair-item');
            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Subscribe form
const subscribeForm = document.querySelector('.subscribe-form');
if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing! You will receive daily updates.');
        subscribeForm.reset();
    });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Load content on page load
document.addEventListener('DOMContentLoaded', loadPageContent);
