if (!sessionStorage.getItem('adminAuth')) {
    window.location.href = 'login.html';
}

let contentData = {
    banners: [
        { image: 'hero Banner section/Homepage Hero Banner- 1.png', title: 'Excellence in Education Starts Here', subtitle: 'Empowering students with knowledge, skills and values to succeed in every field.' },
        { image: 'hero Banner section/Homepage Hero Banner - 2.png', title: 'Crack Bank & SSC Exams with Expert Guidance', subtitle: 'Comprehensive coaching for IBPS, SBI, SSC CGL, CHSL and more competitive exams.' },
        { image: 'hero Banner section/Homepage Hero Banner - 3.png', title: 'Quality Education for Classes 1-12', subtitle: 'Personalized attention and concept-based learning for all school students.' }
    ],
    about: 'EduMerit Institute is dedicated to providing quality education and fostering excellence in learning. We believe in nurturing talent and building future leaders.',
    courses: [],
    currentAffairs: { daily: [], weekly: [], monthly: [] },
    resources: [],
    quiz: [],
    contact: { phone: '+1 234 567 8900', email: 'info@edumerit.com', address: '123 Education Street, City' }
};

const savedData = localStorage.getItem('edumeritContent');
if (savedData) {
    contentData = JSON.parse(savedData);
}

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initForms();
    loadContent();
    
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('adminAuth');
        window.location.href = 'login.html';
    });
});

function initNavigation() {
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(section).classList.add('active');
        });
    });
}

function initForms() {
    let currentBanner = 0;
    
    // Banner tabs
    document.querySelectorAll('.banner-tab').forEach((tab, index) => {
        tab.addEventListener('click', () => {
            currentBanner = index;
            document.querySelectorAll('.banner-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadBannerData(index);
        });
    });
    
    function loadBannerData(index) {
        const banner = contentData.banners[index];
        document.getElementById('bannerTitle').value = banner.title;
        document.getElementById('bannerSubtitle').value = banner.subtitle;
        document.getElementById('currentBannerImage').textContent = banner.image;
    }

    document.getElementById('bannerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        contentData.banners[currentBanner].title = document.getElementById('bannerTitle').value;
        contentData.banners[currentBanner].subtitle = document.getElementById('bannerSubtitle').value;
        saveContent('Banner updated successfully!');
    });

    document.getElementById('aboutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        contentData.about = document.getElementById('aboutContent').value;
        saveContent('About section updated successfully!');
    });

    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        contentData.contact.phone = document.getElementById('contactPhone').value;
        contentData.contact.email = document.getElementById('contactEmail').value;
        contentData.contact.address = document.getElementById('contactAddress').value;
        saveContent('Contact information updated successfully!');
    });

    document.getElementById('addCourse').addEventListener('click', () => {
        showModal('Add Course', createCourseForm());
    });

    document.getElementById('addResource').addEventListener('click', () => {
        showModal('Add Resource', createResourceForm());
    });

    document.getElementById('addQuiz').addEventListener('click', () => {
        showModal('Add Quiz Question', createQuizForm());
    });

    // Current Affairs tabs
    let currentAffairType = 'daily';
    document.querySelectorAll('.affairs-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentAffairType = tab.dataset.type;
            document.querySelectorAll('.affairs-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderAffairs();
        });
    });

    document.getElementById('addAffair').addEventListener('click', () => {
        showModal('Add Current Affair', createAffairForm(null, currentAffairType));
    });
}

function loadContent() {
    document.getElementById('bannerTitle').value = contentData.banners[0].title;
    document.getElementById('bannerSubtitle').value = contentData.banners[0].subtitle;
    document.getElementById('currentBannerImage').textContent = contentData.banners[0].image;
    document.getElementById('aboutContent').value = contentData.about;
    document.getElementById('contactPhone').value = contentData.contact.phone;
    document.getElementById('contactEmail').value = contentData.contact.email;
    document.getElementById('contactAddress').value = contentData.contact.address;
    
    renderCourses();
    renderAffairs();
    renderResources();
    renderQuiz();
}

function renderCourses() {
    const list = document.getElementById('coursesList');
    list.innerHTML = contentData.courses.map((course, index) => `
        <div class="item-card">
            <div>
                <h3>${course.title}</h3>
                <p>${course.description}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editCourse(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteCourse(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderQuiz() {
    const list = document.getElementById('quizList');
    list.innerHTML = (contentData.quiz || []).map((q, index) => `
        <div class="item-card">
            <div>
                <h3>Q${index + 1}. ${q.question}</h3>
                <p><strong>Category:</strong> ${q.category || 'General'}</p>
                <p><strong>A:</strong> ${q.options[0]} | <strong>B:</strong> ${q.options[1]} | <strong>C:</strong> ${q.options[2]} | <strong>D:</strong> ${q.options[3]}</p>
                <p><em>Answer: ${q.answer}</em></p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editQuiz(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteQuiz(${index})">Delete</button>
            </div>
        </div>
    `).join('') || '<p>No quiz questions added yet.</p>';
}

function createQuizForm(item = null, index = null) {
    return `
        <div class="form-group">
            <label>Question</label>
            <textarea id="quizQuestion" rows="3" required>${item?.question || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Option A</label>
            <input type="text" id="quizOptA" value="${item?.options?.[0] || ''}" required>
        </div>
        <div class="form-group">
            <label>Option B</label>
            <input type="text" id="quizOptB" value="${item?.options?.[1] || ''}" required>
        </div>
        <div class="form-group">
            <label>Option C</label>
            <input type="text" id="quizOptC" value="${item?.options?.[2] || ''}" required>
        </div>
        <div class="form-group">
            <label>Option D</label>
            <input type="text" id="quizOptD" value="${item?.options?.[3] || ''}" required>
        </div>
        <div class="form-group">
            <label>Category</label>
            <select id="quizCategory" required>
                <option value="Academic" ${(item?.category === 'Academic') ? 'selected' : ''}>Academic</option>
                <option value="Competitive" ${(item?.category === 'Competitive') ? 'selected' : ''}>Competitive</option>
                <option value="Current Affairs" ${(item?.category === 'Current Affairs') ? 'selected' : ''}>Current Affairs</option>
                <option value="General" ${(item?.category === 'General') ? 'selected' : ''}>General</option>
            </select>
        </div>
        <div class="form-group">
            <label>Correct Answer (A/B/C/D)</label>
            <input type="text" id="quizAnswer" pattern="[ABCDabcd]" value="${item?.answer || ''}" required>
        </div>
        <button type="submit" class="save-btn">${item ? 'Update' : 'Add'} Quiz Question</button>
    `;
}

function editQuiz(index) {
    showModal('Edit Quiz Question', createQuizForm(contentData.quiz[index], index));
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        contentData.quiz[index] = {
            question: document.getElementById('quizQuestion').value,
            options: [
                document.getElementById('quizOptA').value,
                document.getElementById('quizOptB').value,
                document.getElementById('quizOptC').value,
                document.getElementById('quizOptD').value
            ],
            answer: document.getElementById('quizAnswer').value.toUpperCase(),
            category: document.getElementById('quizCategory').value || 'General'
        };
        saveContent('Quiz question updated successfully!');
        renderQuiz();
        document.getElementById('modal').style.display = 'none';
    };
}

function deleteQuiz(index) {
    if (confirm('Delete this quiz question?')) {
        contentData.quiz.splice(index, 1);
        saveContent('Quiz question deleted successfully!');
        renderQuiz();
    }
}

function saveQuiz() {
    if (!contentData.quiz) contentData.quiz = [];
    contentData.quiz.push({
        question: document.getElementById('quizQuestion').value,
        options: [
            document.getElementById('quizOptA').value,
            document.getElementById('quizOptB').value,
            document.getElementById('quizOptC').value,
            document.getElementById('quizOptD').value
        ],
        answer: document.getElementById('quizAnswer').value.toUpperCase(),
        category: document.getElementById('quizCategory').value || 'General'
    });
    saveContent('Quiz question added successfully!');
    renderQuiz();
}

function renderAffairs() {
    const currentType = document.querySelector('.affairs-tab.active')?.dataset.type || 'daily';
    const list = document.getElementById('affairsList');
    const affairs = contentData.currentAffairs[currentType] || [];
    
    list.innerHTML = affairs.map((affair, index) => `
        <div class="item-card">
            <div>
                <h3>${affair.title}</h3>
                <span class="affair-category">${affair.category}</span>
                <p>${affair.description}</p>
                <small>${affair.date}</small>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editAffair(${index}, '${currentType}')">Edit</button>
                <button class="delete-btn" onclick="deleteAffair(${index}, '${currentType}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function createCourseForm(course = null, index = null) {
    return `
        <div class="form-group">
            <label>Course Title</label>
            <input type="text" id="courseTitle" value="${course?.title || ''}" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="courseDesc" rows="4" required>${course?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Category</label>
            <select id="courseCategory" required>
                <option value="Bank Exams" ${course?.category === 'Bank Exams' ? 'selected' : ''}>Bank Exams</option>
                <option value="SSC Exams" ${course?.category === 'SSC Exams' ? 'selected' : ''}>SSC Exams</option>
                <option value="Academic" ${course?.category === 'Academic' ? 'selected' : ''}>Academic (Classes 1-12)</option>
            </select>
        </div>
        <div class="form-group">
            <label>Icon (Font Awesome class)</label>
            <input type="text" id="courseIcon" value="${course?.icon || 'fas fa-book'}" required>
        </div>
        <button type="submit" class="save-btn">${course ? 'Update' : 'Add'} Course</button>
    `;
}

function createAffairForm(affair = null, type = 'daily') {
    return `
        <div class="form-group">
            <label>Title</label>
            <input type="text" id="affairTitle" value="${affair?.title || ''}" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="affairDesc" rows="3" required>${affair?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Category</label>
            <select id="affairCategory" required>
                <option value="Education" ${affair?.category === 'Education' ? 'selected' : ''}>Education</option>
                <option value="Technology" ${affair?.category === 'Technology' ? 'selected' : ''}>Technology</option>
                <option value="National" ${affair?.category === 'National' ? 'selected' : ''}>National</option>
                <option value="International" ${affair?.category === 'International' ? 'selected' : ''}>International</option>
            </select>
        </div>
        <div class="form-group">
            <label>Type</label>
            <select id="affairType" required>
                <option value="daily" ${type === 'daily' ? 'selected' : ''}>Daily</option>
                <option value="weekly" ${type === 'weekly' ? 'selected' : ''}>Weekly</option>
                <option value="monthly" ${type === 'monthly' ? 'selected' : ''}>Monthly</option>
            </select>
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="date" id="affairDate" value="${affair?.date || new Date().toISOString().split('T')[0]}" required>
        </div>
        <button type="submit" class="save-btn">${affair ? 'Update' : 'Add'} Current Affair</button>
    `;
}

function renderResources() {
    const list = document.getElementById('resourcesList');
    if (!list) return;
    list.innerHTML = (contentData.resources || []).map((res, index) => `
        <div class="item-card">
            <div>
                <h3>${res.title}</h3>
                <p>${res.description}</p>
                <small>Category: ${res.category}</small>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editResource(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteResource(${index})">Delete</button>
            </div>
        </div>
    `).join('') || '<p>No resources added yet.</p>';
}

function createResourceForm(res = null) {
    return `
        <div class="form-group">
            <label>Title</label>
            <input type="text" id="resTitle" value="${res?.title || ''}" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="resDesc" rows="3" required>${res?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Category</label>
            <select id="resCategory" required>
                <option value="Bank Exams" ${res?.category === 'Bank Exams' ? 'selected' : ''}>Bank Exams</option>
                <option value="SSC Exams" ${res?.category === 'SSC Exams' ? 'selected' : ''}>SSC Exams</option>
                <option value="Academic" ${res?.category === 'Academic' ? 'selected' : ''}>Academic</option>
                <option value="Current Affairs" ${res?.category === 'Current Affairs' ? 'selected' : ''}>Current Affairs</option>
            </select>
        </div>
        <div class="form-group">
            <label>Download Link (URL or #)</label>
            <input type="text" id="resLink" value="${res?.link || '#'}">
        </div>
        <button type="submit" class="save-btn">${res ? 'Update' : 'Add'} Resource</button>
    `;
}

function editResource(index) {
    showModal('Edit Resource', createResourceForm(contentData.resources[index]));
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        contentData.resources[index] = {
            title: document.getElementById('resTitle').value,
            description: document.getElementById('resDesc').value,
            category: document.getElementById('resCategory').value,
            link: document.getElementById('resLink').value
        };
        saveContent('Resource updated!');
        renderResources();
        document.getElementById('modal').style.display = 'none';
    };
}

function deleteResource(index) {
    if (confirm('Delete this resource?')) {
        contentData.resources.splice(index, 1);
        saveContent('Resource deleted!');
        renderResources();
    }
}

function saveResource() {
    if (!contentData.resources) contentData.resources = [];
    contentData.resources.push({
        title: document.getElementById('resTitle').value,
        description: document.getElementById('resDesc').value,
        category: document.getElementById('resCategory').value,
        link: document.getElementById('resLink').value
    });
    saveContent('Resource added!');
    renderResources();
}

function showModal(title, formHTML) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalForm').innerHTML = formHTML;
    modal.style.display = 'block';
    
    document.querySelector('.close').onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        if (title.includes('Course')) saveCourse();
        else if (title.includes('Affair')) saveAffair();
        else if (title.includes('Resource')) saveResource();
        else if (title.includes('Quiz')) saveQuiz();
        modal.style.display = 'none';
    };
}

function saveCourse() {
    const course = {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDesc').value,
        category: document.getElementById('courseCategory').value,
        icon: document.getElementById('courseIcon').value
    };
    contentData.courses.push(course);
    saveContent('Course added successfully!');
    renderCourses();
}

function editCourse(index) {
    showModal('Edit Course', createCourseForm(contentData.courses[index], index));
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        contentData.courses[index] = {
            title: document.getElementById('courseTitle').value,
            description: document.getElementById('courseDesc').value,
            category: document.getElementById('courseCategory').value,
            icon: document.getElementById('courseIcon').value
        };
        saveContent('Course updated successfully!');
        renderCourses();
        document.getElementById('modal').style.display = 'none';
    };
}

function deleteCourse(index) {
    if (confirm('Are you sure you want to delete this course?')) {
        contentData.courses.splice(index, 1);
        saveContent('Course deleted successfully!');
        renderCourses();
    }
}

function saveAffair() {
    const type = document.getElementById('affairType').value;
    const affair = {
        title: document.getElementById('affairTitle').value,
        description: document.getElementById('affairDesc').value,
        category: document.getElementById('affairCategory').value,
        date: document.getElementById('affairDate').value
    };
    if (!contentData.currentAffairs[type]) {
        contentData.currentAffairs[type] = [];
    }
    contentData.currentAffairs[type].push(affair);
    saveContent('Current affair added successfully!');
    renderAffairs();
}

function editAffair(index, type) {
    showModal('Edit Current Affair', createAffairForm(contentData.currentAffairs[type][index], type));
    document.getElementById('modalForm').onsubmit = (e) => {
        e.preventDefault();
        const newType = document.getElementById('affairType').value;
        contentData.currentAffairs[type].splice(index, 1);
        if (!contentData.currentAffairs[newType]) {
            contentData.currentAffairs[newType] = [];
        }
        contentData.currentAffairs[newType].push({
            title: document.getElementById('affairTitle').value,
            description: document.getElementById('affairDesc').value,
            category: document.getElementById('affairCategory').value,
            date: document.getElementById('affairDate').value
        });
        saveContent('Current affair updated successfully!');
        renderAffairs();
        document.getElementById('modal').style.display = 'none';
    };
}

function deleteAffair(index, type) {
    if (confirm('Are you sure you want to delete this current affair?')) {
        contentData.currentAffairs[type].splice(index, 1);
        saveContent('Current affair deleted successfully!');
        renderAffairs();
    }
}

function saveContent(message) {
    localStorage.setItem('edumeritContent', JSON.stringify(contentData));
    
    fetch('../api/save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData)
    }).catch(() => console.log('Using local storage'));
    
    showSuccessMessage(message);
}

function showSuccessMessage(message) {
    const existing = document.querySelector('.success-message');
    if (existing) existing.remove();
    
    const msg = document.createElement('div');
    msg.className = 'success-message';
    msg.textContent = message;
    document.querySelector('.section.active').insertBefore(msg, document.querySelector('.section.active').firstChild);
    
    setTimeout(() => msg.remove(), 3000);
}
