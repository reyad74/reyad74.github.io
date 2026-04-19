/**
 * REYAD Custom Admin Logic
 */

let currentData = {};
const REPO = "reyad74/reyad74.github.io";
const BRANCH = "main";

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
});

function showSection(id) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    
    // Find nav item by onclick or text
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('onclick')?.includes(id)) {
            item.classList.add('active');
        }
    });

    if (id === 'messages') {
        renderMessages();
    }
}

async function loadAllData() {
    try {
        const [profile, projects, experience, skills] = await Promise.all([
            fetch('../data/profile.json').then(r => r.json()),
            fetch('../data/projects.json').then(r => r.json()),
            fetch('../data/experience.json').then(r => r.json()),
            fetch('../data/skills.json').then(r => r.json())
        ]);

        currentData = { profile, projects, experience, skills };
        
        // Update Stats
        document.getElementById('stat-projects').textContent = projects.projects.length;
        document.getElementById('stat-skills').textContent = skills.skills.length;

        renderProfileForm(profile);
        renderProjectsForm(projects);
        renderExperienceForm(experience);
        renderSkillsForm(skills);
    } catch (err) {
        console.error("Failed to load data:", err);
    }
}

function renderProfileForm(data) {
    const container = document.getElementById('profile-form');
    container.innerHTML = `
        <div class="form-group">
            <label>Profile Image (Path or URL)</label>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <input type="text" id="prof-img" value="${data.image || 'images/profile.png'}" style="flex: 1;">
                <input type="file" id="prof-img-upload" accept="image/*" style="width: auto; padding: 0.5rem; background: rgba(255,255,255,0.05); color: var(--accent); border-radius: 0.5rem;" onchange="handleImageUpload(this, 'prof-img')">
            </div>
        </div>
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="prof-name" value="${data.name}">
        </div>
        <div class="form-group">
            <label>Job Role</label>
            <input type="text" id="prof-role" value="${data.role}">
        </div>
        <div class="form-group">
            <label>Bio</label>
            <textarea id="prof-bio" rows="5">${data.bio}</textarea>
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="text" id="prof-email" value="${data.email}">
        </div>
    `;
}

function renderProjectsForm(data) {
    const container = document.getElementById('projects-container');
    container.innerHTML = data.projects.map((p, i) => `
        <div style="padding-bottom: 2rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); position: relative;">
            <button onclick="deleteItem('projects', ${i})" style="position: absolute; right: 0; top: 0; background: #ef4444; color: white; border: none; border-radius: 0.25rem; cursor: pointer; padding: 0.25rem 0.5rem;">Delete</button>
            <div style="display: flex; gap: 2rem; align-items: flex-start;">
                <img src="../${p.image || 'images/proj_1.jpg'}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 0.5rem; border: 1px solid var(--border);">
                <div style="flex: 1;">
                    <div class="form-group">
                        <label>Project Image (Path or URL)</label>
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <input type="text" class="proj-img" value="${p.image || 'images/proj_1.jpg'}" style="flex: 1;">
                            <input type="file" accept="image/*" style="width: auto; padding: 0.5rem; background: rgba(255,255,255,0.05); color: var(--accent); border-radius: 0.5rem;" onchange="handleImageUpload(this, null, ${i})">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="proj-title" value="${p.title}">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="proj-desc" rows="2">${p.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Project Link</label>
                        <input type="text" class="proj-link" value="${p.link}">
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderExperienceForm(data) {
    const container = document.getElementById('experience-form');
    container.innerHTML = `
        <h3>Work Experience</h3>
        ${data.experience.map((e, i) => `
        <div style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); position: relative;">
            <button onclick="deleteItem('experience', ${i})" style="position: absolute; right: 0; top: 0; background: #ef4444; color: white; border: none; border-radius: 0.25rem; cursor: pointer; padding: 0.25rem 0.5rem;">Delete</button>
            <div class="form-group">
                <label>Role</label>
                <input type="text" class="exp-role" value="${e.role}">
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="exp-company" value="${e.company}">
            </div>
        </div>
        `).join('')}
    `;
}

function renderSkillsForm(data) {
    const container = document.getElementById('skills-form');
    container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            ${data.skills.map((s, i) => `
                <div style="background: rgba(255,255,255,0.05); padding: 0.5rem 1rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <input type="text" class="skill-name" value="${s.name}" style="background: transparent; border: none; width: 100px; padding: 0;">
                    <button onclick="deleteItem('skills', ${i})" style="background: transparent; color: #ef4444; border: none; cursor: pointer; font-size: 1.2rem;">&times;</button>
                </div>
            `).join('')}
        </div>
    `;
}

// GitHub API Logic
function saveToken() {
    const token = document.getElementById('gh-token').value;
    localStorage.setItem('gh_token', token);
    alert("Token saved locally!");
}

// Add New Item functions
function addProject() {
    currentData.projects.projects.push({
        title: "New Project",
        description: "Project description here...",
        image: "images/proj_1.jpg",
        link: "https://github.com/reyad74"
    });
    renderProjectsForm(currentData.projects);
    // Scroll to bottom
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function addItem(type) {
    if (type === 'experience') {
        currentData.experience.experience.push({
            role: "New Role",
            company: "Company Name",
            period: "2024 - Present",
            description: ["Key achievement..."]
        });
        renderExperienceForm(currentData.experience);
    } else if (type === 'skills') {
        currentData.skills.skills.push({ name: "New Skill" });
        renderSkillsForm(currentData.skills);
    }
}

function deleteItem(type, index) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    if (type === 'projects') {
        currentData.projects.projects.splice(index, 1);
        renderProjectsForm(currentData.projects);
    } else if (type === 'experience') {
        currentData.experience.experience.splice(index, 1);
        renderExperienceForm(currentData.experience);
    } else if (type === 'skills') {
        currentData.skills.skills.splice(index, 1);
        renderSkillsForm(currentData.skills);
    }
}

async function saveData(type) {
    const token = localStorage.getItem('gh_token');
    if (!token) return alert("Please set your GitHub Token in Settings first!");

    let dataToSave = {};
    if (type === 'profile') {
        dataToSave = {
            ...currentData.profile,
            image: document.getElementById('prof-img').value,
            name: document.getElementById('prof-name').value,
            role: document.getElementById('prof-role').value,
            bio: document.getElementById('prof-bio').value,
            email: document.getElementById('prof-email').value
        };
    } else if (type === 'projects') {
        const titles = document.querySelectorAll('.proj-title');
        const descs = document.querySelectorAll('.proj-desc');
        const links = document.querySelectorAll('.proj-link');
        const images = document.querySelectorAll('.proj-img');
        dataToSave = { projects: [] };
        titles.forEach((t, i) => {
            dataToSave.projects.push({
                title: t.value,
                description: descs[i].value,
                link: links[i].value,
                image: images[i] ? images[i].value : (currentData.projects.projects[i]?.image || "images/proj_1.jpg")
            });
        });
    }

    const path = `data/${type}.json`;
    try {
        const sha = await getFileSHA(path, token);
        await updateFile(path, dataToSave, sha, token);
        alert(`${type} updated successfully on GitHub!`);
    } catch (err) {
        alert("Error saving: " + err.message);
    }
}

async function getFileSHA(path, token) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
        headers: { 'Authorization': `token ${token}` }
    });
    const data = await res.json();
    return data.sha;
}

async function updateFile(path, content, sha, token) {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Update ${path} via Custom Admin`,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
            sha: sha,
            branch: BRANCH
        })
    });
    if (!res.ok) throw new Error(await res.text());
}

function renderMessages() {
    const container = document.getElementById('messages-container');
    const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    
    // Update badge
    const unreadCount = messages.filter(m => m.status === 'unread').length;
    const badge = document.getElementById('msg-count');
    if (badge) badge.textContent = unreadCount;

    if (messages.length === 0) {
        container.innerHTML = '<p style="color: var(--text-dim); text-align: center; padding: 2rem;">No inquiries yet.</p>';
        return;
    }

    container.innerHTML = messages.map((m, i) => `
        <div style="padding: 1.5rem; margin-bottom: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 1rem; border: 1px solid ${m.status === 'unread' ? 'var(--accent)' : 'var(--border)'};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <strong style="color: var(--accent);">${m.name}</strong>
                <span style="font-size: 0.8rem; color: var(--text-dim);">${m.date}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 1rem;">${m.email}</div>
            <p style="margin: 0; line-height: 1.6;">${m.message}</p>
            <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                ${m.status === 'unread' ? `<button onclick="markAsRead(${i})" class="btn" style="padding: 0.5rem 1rem; font-size: 0.7rem; background: var(--accent); color: var(--bg); border: none; cursor: pointer; border-radius: 4px;">Mark Read</button>` : ''}
                <button onclick="deleteMessage(${i})" class="btn" style="padding: 0.5rem 1rem; font-size: 0.7rem; background: #ef4444; color: white; border: none; cursor: pointer; border-radius: 4px;">Delete</button>
            </div>
        </div>
    `).join('');
}

function markAsRead(index) {
    const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    messages[index].status = 'read';
    localStorage.setItem('portfolio_messages', JSON.stringify(messages));
    renderMessages();
}

function deleteMessage(index) {
    if (!confirm("Delete this message?")) return;
    const messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    messages.splice(index, 1);
    localStorage.setItem('portfolio_messages', JSON.stringify(messages));
    renderMessages();
}

async function handleImageUpload(input, targetId, projectIndex) {
    const file = input.files[0];
    if (!file) return;

    const token = localStorage.getItem('gh_token');
    if (!token) {
        alert("Please set your GitHub Token in Settings first to upload images!");
        input.value = "";
        return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64Data = e.target.result.split(',')[1];
        // Clean filename, replace spaces with underscores
        const cleanName = file.name.replace(/\s+/g, '_');
        const filename = `images/${Date.now()}_${cleanName}`;
        
        try {
            input.disabled = true;
            input.style.opacity = "0.5";
            alert("Uploading image to GitHub... Please wait.");
            
            const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${filename}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Upload image ${cleanName} via Custom Admin`,
                    content: base64Data,
                    branch: BRANCH
                })
            });

            if (!res.ok) throw new Error(await res.text());

            alert(`Image uploaded successfully to GitHub!\nNote: It may take a minute to show on your live site. If you are developing locally, you will need to 'git pull' to download the image to your computer.`);
            
            // Update the corresponding input
            if (targetId) {
                document.getElementById(targetId).value = filename;
            } else if (projectIndex !== undefined) {
                document.querySelectorAll('.proj-img')[projectIndex].value = filename;
                // Update the preview image
                input.closest('.form-group').parentElement.previousElementSibling.src = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${filename}`;
            }

        } catch (err) {
            console.error(err);
            alert("Error uploading image: " + err.message);
        } finally {
            input.disabled = false;
            input.style.opacity = "1";
        }
    };
    reader.readAsDataURL(file);
}
