let currentRole = null;
let detectedNeeds = [];
let acceptedTasks = [];

// Global functions for inline onclick handlers
function selectRole(role) {
    currentRole = role;
    document.getElementById('roleScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    if (role === 'ngo') {
        renderNGODashboard();
    } else {
        renderVolunteerDashboard();
    }
}

function showRoleScreen(e) {
    if (e) e.preventDefault();
    currentRole = null;
    document.getElementById('roleScreen').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function renderNGODashboard() {
    const dashboard = document.getElementById('dashboard');
    
    dashboard.innerHTML = `
        <header class="header">
            <button class="back-btn" onclick="showRoleScreen()">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16 10H4M9 5L4 10l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="logo">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="12" stroke="white" stroke-width="2.5"/>
                    <path d="M16 10v12M10 16h12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
            </div>
            <h1>NGO Report Analyzer</h1>
        </header>

        <main class="main-content">
            <section class="input-section">
                <label for="report">Input NGO Report</label>
                <textarea id="report" placeholder="Paste your NGO report here...

Example: Our community in rural Kenya faces severe water shortage. The nearest borehole is 5km away. Children walk for hours to fetch water, missing school. We need at least 3 water tanks and a solar pump system. Also, the local clinic lacks basic medicines and medical supplies."></textarea>
                <button id="analyzeBtn" class="analyze-btn">
                    <span>Analyze Report</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </section>

            <section id="resultsSection" class="results-section hidden">
                <h2>Detected Needs</h2>
                <div id="needsContainer" class="needs-container"></div>
                <button id="switchToVolunteerBtn" class="switch-btn" onclick="switchToVolunteer()">
                    Switch to Volunteer to Match Tasks
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </section>
        </main>

        <footer class="footer">
            <p>KarunaSync AI &copy; 2026 &nbsp;|&nbsp; <a href="#" onclick="showRoleScreen(event)" class="switch-role">Switch Role</a></p>
        </footer>
    `;

    document.getElementById('analyzeBtn').addEventListener('click', analyzeReport);
}

function switchToVolunteer() {
    currentRole = 'volunteer';
    document.getElementById('roleScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    renderVolunteerDashboard(true);
}

function renderVolunteerDashboard(useSharedNeeds = false) {
    const dashboard = document.getElementById('dashboard');
    
    dashboard.innerHTML = `
        <header class="header">
            <button class="back-btn" onclick="showRoleScreen()">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16 10H4M9 5L4 10l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="logo volunteer">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <h1>Volunteer Dashboard</h1>
        </header>

        <main class="main-content">
            ${useSharedNeeds && detectedNeeds.length > 0 ? `
            <section class="shared-needs-banner">
                <div class="banner-icon">📋</div>
                <div class="banner-text">
                    <strong>Needs from NGO Report</strong>
                    <span>${detectedNeeds.length} needs detected</span>
                </div>
            </section>
            ` : ''}

            ${!useSharedNeeds || detectedNeeds.length === 0 ? `
            <section class="input-section purple-accent">
                <label for="report">NGO Report (Optional)</label>
                <textarea id="report" placeholder="Paste an NGO report here to see detected needs...

Example: Our community needs clean water. The local clinic lacks medical supplies."></textarea>
            </section>
            ` : ''}

            ${detectedNeeds.length > 0 ? `
            <section id="detectedNeedsSection" class="needs-section">
                <h2>Detected Needs</h2>
                <div id="needsContainer" class="needs-grid"></div>
            </section>
            ` : `
            <section id="detectedNeedsSection" class="needs-section hidden">
                <h2>Detected Needs</h2>
                <div id="needsContainer" class="needs-grid"></div>
            </section>
            `}

            <section class="volunteer-inputs-section">
                <h2>Volunteer Input</h2>
                <div class="volunteer-form">
                    <div class="input-group">
                        <label for="skills">Your Skills</label>
                        <input type="text" id="skills" placeholder="e.g. medical, food, water">
                    </div>
                    <div class="input-group">
                        <label for="location">Location</label>
                        <input type="text" id="location" placeholder="e.g. Nairobi, Kenya">
                    </div>
                </div>
                <button id="matchBtn" class="match-btn purple">Match Tasks</button>
            </section>

            <section id="matchedSection" class="matched-section hidden">
                <h2>Your Assigned Tasks</h2>
                <div id="matchedContainer" class="matched-grid"></div>
            </section>

            <section id="contributionsSection" class="contributions-section hidden">
                <h2>Your Contributions</h2>
                <div id="contributionsContainer" class="contributions-grid"></div>
            </section>
        </main>

        <footer class="footer">
            <p>KarunaSync AI &copy; 2026 &nbsp;|&nbsp; <a href="#" onclick="showRoleScreen(event)" class="switch-role">Switch Role</a></p>
        </footer>
    `;

    if (detectedNeeds.length > 0) {
        displayDetectedNeeds();
    }

    if (!useSharedNeeds || detectedNeeds.length === 0) {
        document.getElementById('report').addEventListener('input', handleReportInput);
    }
    document.getElementById('matchBtn').addEventListener('click', matchVolunteerTasks);
}

function displayDetectedNeeds() {
    const needsSection = document.getElementById('detectedNeedsSection');
    const needsContainer = document.getElementById('needsContainer');
    
    if (detectedNeeds.length === 0) {
        needsSection.classList.add('hidden');
        return;
    }

    needsContainer.innerHTML = '';
    const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
    const colors = { 'Water': '#3B82F6', 'Medical': '#8B5CF6', 'Food': '#F59E0B' };

    detectedNeeds.forEach((need, index) => {
        const card = document.createElement('div');
        card.className = 'need-card-purple';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="need-card-icon" style="background: ${colors[need.category]}20; color: ${colors[need.category]};">
                ${icons[need.category]}
            </div>
            <div class="need-card-info">
                <div class="need-card-name">${need.category}</div>
                <div class="need-card-priority" style="color: ${colors[need.category]};">${need.priority} Priority</div>
            </div>
        `;
        needsContainer.appendChild(card);
    });

    needsSection.classList.remove('hidden');
}

function handleReportInput() {
    const report = document.getElementById('report').value.trim().toLowerCase();
    const needsSection = document.getElementById('detectedNeedsSection');
    const needsContainer = document.getElementById('needsContainer');
    
    detectedNeeds = [];

    if (report.includes('water')) {
        detectedNeeds.push({ category: 'Water', priority: 'High' });
    }
    if (report.includes('medical') || report.includes('health')) {
        detectedNeeds.push({ category: 'Medical', priority: 'Medium' });
    }
    if (report.includes('food')) {
        detectedNeeds.push({ category: 'Food', priority: 'Low' });
    }

    if (detectedNeeds.length === 0) {
        needsSection.classList.add('hidden');
        return;
    }

    needsContainer.innerHTML = '';
    const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
    const colors = { 'Water': '#3B82F6', 'Medical': '#8B5CF6', 'Food': '#F59E0B' };

    detectedNeeds.forEach((need, index) => {
        const card = document.createElement('div');
        card.className = 'need-card-purple';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="need-card-icon" style="background: ${colors[need.category]}20; color: ${colors[need.category]};">
                ${icons[need.category]}
            </div>
            <div class="need-card-info">
                <div class="need-card-name">${need.category}</div>
                <div class="need-card-priority" style="color: ${colors[need.category]};">${need.priority} Priority</div>
            </div>
        `;
        needsContainer.appendChild(card);
    });

    needsSection.classList.remove('hidden');
}

function analyzeReport() {
    const report = document.getElementById('report').value.trim().toLowerCase();
    const resultsSection = document.getElementById('resultsSection');
    const needsContainer = document.getElementById('needsContainer');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (!report) {
        alert('Please enter an NGO report to analyze.');
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `
        <span>Analyzing</span>
        <span class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
        </span>
    `;

    needsContainer.innerHTML = `
        <div class="loading-card">
            <div class="spinner"></div>
            <span>Analyzing your report...</span>
        </div>
    `;
    resultsSection.classList.remove('hidden');

    setTimeout(() => {
        detectedNeeds = [];

        if (report.includes('water')) {
            detectedNeeds.push({ category: 'Water', priority: 'High' });
        }
        if (report.includes('medical')) {
            detectedNeeds.push({ category: 'Medical', priority: 'Medium' });
        }
        if (report.includes('food')) {
            detectedNeeds.push({ category: 'Food', priority: 'Low' });
        }

        needsContainer.innerHTML = '';

        if (detectedNeeds.length === 0) {
            needsContainer.innerHTML = `
                <div class="need-card low" style="border-left: 5px solid var(--gray-300);">
                    <div class="need-content">
                        <div class="need-icon" style="background: var(--gray-100);">🔍</div>
                        <div class="need-title" style="color: var(--gray-500);">No specific needs detected</div>
                    </div>
                </div>
            `;
        } else {
            const icons = {
                'Water': '💧',
                'Medical': '🏥',
                'Food': '🍞'
            };

            detectedNeeds.forEach((need, index) => {
                const card = document.createElement('div');
                card.className = `need-card ${need.priority.toLowerCase()}`;
                card.style.animationDelay = `${index * 0.1}s`;

                card.innerHTML = `
                    <div class="need-content">
                        <div class="need-icon">${icons[need.category] || '📌'}</div>
                        <div class="need-title">${need.category}</div>
                    </div>
                    <span class="priority-badge ${need.priority.toLowerCase()}">${need.priority}</span>
                `;

                needsContainer.appendChild(card);
            });
        }

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `
            <span>Analyze Report</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }, 1500);
}

function findTasks() {
    const report = document.getElementById('report').value.trim().toLowerCase();
    const findBtn = document.getElementById('findTasksBtn');

    if (!report) {
        alert('Please enter an NGO report to find matching tasks.');
        return;
    }

    findBtn.disabled = true;
    findBtn.innerHTML = `
        <span>Searching</span>
        <span class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
        </span>
    `;

    setTimeout(() => {
        detectedNeeds = [];

        if (report.includes('water')) {
            detectedNeeds.push({ category: 'Water', priority: 'High' });
        }
        if (report.includes('medical')) {
            detectedNeeds.push({ category: 'Medical', priority: 'Medium' });
        }
        if (report.includes('food')) {
            detectedNeeds.push({ category: 'Food', priority: 'Low' });
        }

        const tasksContainer = document.getElementById('tasksContainer');
        
        if (detectedNeeds.length === 0) {
            tasksContainer.innerHTML = `
                <div class="task-card unmatched">
                    <div class="task-content">
                        <div class="task-icon">⚠️</div>
                        <div class="task-info">
                            <div class="task-title">No tasks found in this report</div>
                            <div class="task-skill">Try entering a report with water, medical, or food needs</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const icons = {
                'Water': '💧',
                'Medical': '🏥',
                'Food': '🍞'
            };
            
            tasksContainer.innerHTML = `
                <div style="margin-bottom: 16px; padding: 16px; background: #F0FDF4; border-radius: 12px; border-left: 4px solid #10B981;">
                    <strong style="color: #059669;">${detectedNeeds.length}</strong> tasks detected. Enter your skills below to match!
                </div>
            `;
            
            detectedNeeds.forEach((need, index) => {
                const card = document.createElement('div');
                card.className = `task-card ${need.priority.toLowerCase()}`;
                card.style.animationDelay = `${index * 0.1}s`;

                card.innerHTML = `
                    <div class="task-content">
                        <div class="task-icon">${icons[need.category] || '📌'}</div>
                        <div class="task-info">
                            <div class="task-title">${need.category} Support Needed</div>
                            <div class="task-skill">Priority: ${need.priority}</div>
                        </div>
                    </div>
                    <span class="priority-badge ${need.priority.toLowerCase()}">${need.priority}</span>
                `;

                tasksContainer.appendChild(card);
            });
        }

        findBtn.disabled = false;
        findBtn.innerHTML = `
            <span>Find Matching Tasks</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }, 1200);
}

function matchVolunteerTasks() {
    const skills = document.getElementById('skills').value.toLowerCase();
    const location = document.getElementById('location').value.trim();
    const matchedSection = document.getElementById('matchedSection');
    const matchedContainer = document.getElementById('matchedContainer');
    const matchBtn = document.getElementById('matchBtn');

    if (!skills) {
        alert('Please enter your skills.');
        return;
    }

    if (detectedNeeds.length === 0) {
        alert('Please enter an NGO report first to detect needs.');
        return;
    }

    matchBtn.disabled = true;
    matchBtn.textContent = 'Matching...';

    setTimeout(() => {
        const skillKeywords = {
            'medical': 'Medical',
            'health': 'Medical',
            'doctor': 'Medical',
            'nurse': 'Medical',
            'food': 'Food',
            'nutrition': 'Food',
            'water': 'Water',
            'sanitation': 'Water'
        };

        const matchedTasks = [];
        const userSkills = skills.split(',').map(s => s.trim());

        detectedNeeds.forEach(need => {
            const matchedSkill = userSkills.find(skill => 
                skillKeywords[skill] === need.category
            );
            
            if (matchedSkill) {
                matchedTasks.push({
                    ...need,
                    matchedSkill: matchedSkill
                });
            }
        });

        matchedContainer.innerHTML = '';

        if (matchedTasks.length === 0) {
            matchedContainer.innerHTML = `
                <div class="no-match-card">
                    <div class="no-match-icon">⚠️</div>
                    <div class="no-match-text">No matching tasks found based on your skills</div>
                    <div class="no-match-hint">Try skills that match: ${detectedNeeds.map(n => n.category).join(', ')}</div>
                </div>
            `;
        } else {
            const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
            const colors = { 'Water': '#3B82F6', 'Medical': '#8B5CF6', 'Food': '#F59E0B' };

            matchedTasks.forEach((task, index) => {
                const card = document.createElement('div');
                card.className = 'matched-card';
                card.style.animationDelay = `${index * 0.1}s`;
                card.innerHTML = `
                    <div class="matched-card-icon" style="background: ${colors[task.category]}20; color: ${colors[task.category]};">
                        ${icons[task.category]}
                    </div>
                    <div class="matched-card-info">
                        <div class="matched-card-name">${task.category} Support</div>
                        <div class="matched-card-skill">Your skill: ${task.matchedSkill}</div>
                        ${location ? `<div class="matched-card-location">📍 ${location}</div>` : ''}
                    </div>
                    <div class="matched-card-actions">
                        <span class="matched-card-priority" style="background: ${colors[task.category]};">${task.priority}</span>
                        <button class="accept-btn" onclick="acceptTask(${index})">Accept Task</button>
                    </div>
                `;
                matchedContainer.appendChild(card);
            });
            
            window.currentMatchedTasks = matchedTasks;
            window.currentLocation = location;
        }

        matchedSection.classList.remove('hidden');
        matchBtn.disabled = false;
        matchBtn.textContent = 'Match Tasks';
    }, 800);
}

function acceptTask(index) {
    const task = window.currentMatchedTasks[index];
    const location = window.currentLocation;
    
    const acceptedTask = {
        ...task,
        acceptedAt: new Date().toLocaleDateString()
    };
    
    acceptedTasks.push(acceptedTask);
    
    alert('Task Accepted Successfully!');
    
    displayContributions();
}

function displayContributions() {
    const contributionsSection = document.getElementById('contributionsSection');
    const contributionsContainer = document.getElementById('contributionsContainer');
    
    if (acceptedTasks.length === 0) {
        contributionsSection.classList.add('hidden');
        return;
    }
    
    contributionsContainer.innerHTML = '';
    const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
    const colors = { 'Water': '#3B82F6', 'Medical': '#8B5CF6', 'Food': '#F59E0B' };
    
    acceptedTasks.forEach((task, index) => {
        const card = document.createElement('div');
        card.className = 'contribution-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="contribution-card-icon" style="background: ${colors[task.category]}20; color: ${colors[task.category]};">
                ${icons[task.category]}
            </div>
            <div class="contribution-card-info">
                <div class="contribution-card-name">${task.category} Support</div>
                <div class="contribution-card-meta">Accepted: ${task.acceptedAt}</div>
            </div>
            <div class="contribution-card-status">✓ Active</div>
        `;
        contributionsContainer.appendChild(card);
    });
    
    contributionsSection.classList.remove('hidden');
}