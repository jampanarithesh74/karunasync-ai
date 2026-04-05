let currentRole = null;
let detectedNeeds = [];
let allTasks = [];

function selectRole(role) {
    currentRole = role;
    allTasks = [];
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
    detectedNeeds = [];
    allTasks = [];
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
                <p class="section-subtitle">AI-detected needs from NGO report</p>
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
            <p>KarunaSync AI &copy; 2026</p>
            <button class="role-switch-btn" onclick="showRoleScreen()">Switch Role</button>
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
    analyzeBtn.innerHTML = '<span>Analyzing</span><span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
    needsContainer.innerHTML = '<div class="loading-card"><div class="spinner"></div><span>Analyzing your report...</span></div>';
    resultsSection.classList.remove('hidden');

    setTimeout(function() {
        detectedNeeds = [];
        if (report.includes('water')) detectedNeeds.push({ category: 'Water', priority: 'High' });
        if (report.includes('medical')) detectedNeeds.push({ category: 'Medical', priority: 'Medium' });
        if (report.includes('food')) detectedNeeds.push({ category: 'Food', priority: 'Low' });

        needsContainer.innerHTML = '';

        if (detectedNeeds.length === 0) {
            needsContainer.innerHTML = '<div class="need-card clickable" style="border-left: 5px solid var(--gray-300);"><div class="need-content"><div class="need-icon" style="background: var(--gray-100);">🔍</div><div class="need-title" style="color: var(--gray-500);">No specific needs detected</div></div></div>';
        } else {
            const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
            detectedNeeds.forEach(function(need, index) {
                const card = document.createElement('div');
                card.className = 'need-card clickable ' + need.priority.toLowerCase();
                card.style.animationDelay = (index * 0.1) + 's';
                card.innerHTML = '<div class="need-content"><div class="need-icon">' + icons[need.category] + '</div><div class="need-title">' + need.category + '</div></div><span class="priority-badge ' + need.priority.toLowerCase() + '">' + need.priority + '</span>';
                needsContainer.appendChild(card);
            });
        }

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span>Analyze Report</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }, 1500);
}

function renderVolunteerDashboard(useSharedNeeds) {
    useSharedNeeds = useSharedNeeds || false;
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
            </div>
            <h1>Volunteer Dashboard</h1>
        </header>

        <main class="main-content">
            ${useSharedNeeds && detectedNeeds.length > 0 ? '<section class="shared-needs-banner"><div class="banner-icon">📋</div><div class="banner-text"><strong>Needs from NGO Report</strong><span>' + detectedNeeds.length + ' needs detected</span></div></section>' : ''}

            ${(!useSharedNeeds || detectedNeeds.length === 0) ? '<section class="input-section purple-accent"><label for="report">NGO Report (Optional)</label><textarea id="report" placeholder="Paste an NGO report here to see detected needs..."></textarea></section>' : ''}

            ${detectedNeeds.length > 0 ? '<section id="detectedNeedsSection" class="needs-section"><h2>Detected Needs</h2><p class="section-subtitle">AI-detected needs from NGO report</p><div id="needsContainer" class="needs-grid"></div></section>' : '<section id="detectedNeedsSection" class="needs-section hidden"><h2>Detected Needs</h2><p class="section-subtitle">AI-detected needs from NGO report</p><div id="needsContainer" class="needs-grid"></div></section>'}

            <section class="volunteer-inputs-section">
                <h2>Volunteer Input</h2>
                <div class="volunteer-form">
                    <div class="input-group" style="flex: 1;">
                        <label for="skills">Your Skills</label>
                        <input type="text" id="skills" placeholder="e.g., medical, water supply, food distribution">
                    </div>
                </div>
                <button id="matchBtn" class="match-btn purple">Match Tasks</button>
            </section>

            <div id="successMessage" class="success-message hidden">
                <span>✅ Task accepted successfully</span>
            </div>

            <section id="matchedSection" class="matched-section hidden">
                <h2>Matched Tasks</h2>
                <div id="matchedContainer" class="matched-grid"></div>
            </section>

            <section id="assignedSection" class="assigned-section hidden">
                <h2>Your Assigned Tasks</h2>
                <div id="assignedContainer" class="assigned-grid"></div>
            </section>

            <section id="inProgressSection" class="in-progress-section hidden">
                <h2>In Progress Tasks</h2>
                <div id="inProgressContainer" class="in-progress-grid"></div>
            </section>

            <section id="contributionsSection" class="contributions-section hidden">
                <h2>Completed Tasks</h2>
                <div class="status-filters">
                    <button class="filter-btn active" data-filter="all" onclick="filterContributions('all')">All</button>
                    <button class="filter-btn" data-filter="active" onclick="filterContributions('active')">Active</button>
                    <button class="filter-btn" data-filter="completed" onclick="filterContributions('completed')">Completed</button>
                </div>
                <div id="contributionsContainer" class="contributions-grid"></div>
            </section>
        </main>

        <footer class="footer">
            <p>KarunaSync AI &copy; 2026</p>
            <button class="role-switch-btn" onclick="showRoleScreen()">Switch Role</button>
        </footer>
    `;

    if (detectedNeeds.length > 0) {
        renderDetectedNeeds();
    }

    if (!useSharedNeeds || detectedNeeds.length === 0) {
        const reportEl = document.getElementById('report');
        if (reportEl) {
            reportEl.addEventListener('input', handleReportInput);
        }
    }
    document.getElementById('matchBtn').addEventListener('click', matchTasks);
}

function renderDetectedNeeds() {
    const needsSection = document.getElementById('detectedNeedsSection');
    const needsContainer = document.getElementById('needsContainer');
    
    if (!needsContainer) return;
    
    needsContainer.innerHTML = '';
    const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
    const colors = { 'Water': '#3B82F6', 'Medical': '#8B5CF6', 'Food': '#F59E0B' };

    detectedNeeds.forEach(function(need, index) {
        const card = document.createElement('div');
        card.className = 'need-card-purple clickable';
        card.style.animationDelay = (index * 0.1) + 's';
        card.style.marginBottom = '20px';
        card.innerHTML = '<div class="need-card-icon" style="background: ' + colors[need.category] + '20; color: ' + colors[need.category] + ';">' + icons[need.category] + '</div><div class="need-card-info"><div class="need-card-name">' + need.category + '</div><div class="need-card-priority" style="color: ' + colors[need.category] + ';">' + need.priority + ' Priority</div></div>';
        needsContainer.appendChild(card);
    });

    if (needsSection) needsSection.classList.remove('hidden');
}

function handleReportInput() {
    const reportEl = document.getElementById('report');
    if (!reportEl) return;
    
    const report = reportEl.value.trim().toLowerCase();
    if (!report) return;
    
    detectedNeeds = [];
    if (report.includes('water')) detectedNeeds.push({ category: 'Water', priority: 'High' });
    if (report.includes('medical')) detectedNeeds.push({ category: 'Medical', priority: 'Medium' });
    if (report.includes('food')) detectedNeeds.push({ category: 'Food', priority: 'Low' });

    renderDetectedNeeds();
}

function matchTasks() {
    const skillsInput = document.getElementById('skills');
    const skills = skillsInput ? skillsInput.value.toLowerCase() : '';
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

    setTimeout(function() {
        const skillKeywords = {
            'medical': 'Medical', 'health': 'Medical', 'doctor': 'Medical', 'nurse': 'Medical',
            'food': 'Food', 'nutrition': 'Food',
            'water': 'Water', 'water supply': 'Water', 'sanitation': 'Water'
        };

        const userSkills = skills.split(',').map(function(s) { return s.trim(); });
        
        allTasks = allTasks.filter(function(t) { return t.status !== 'matched'; });

        detectedNeeds.forEach(function(need) {
            const matchedSkill = userSkills.find(function(skill) { return skillKeywords[skill] === need.category; });
            if (matchedSkill) {
                const existingTask = allTasks.find(function(t) { return t.category === need.category; });
                if (!existingTask) {
                    allTasks.push({ 
                        category: need.category, 
                        priority: need.priority,
                        matchedSkill: matchedSkill, 
                        status: 'matched',
                        acceptedAt: null,
                        startedAt: null,
                        completedAt: null
                    });
                }
            }
        });

        renderMatchedTasks();
        renderAssignedTasks();
        renderInProgressTasks();
        renderContributions();
        
        matchBtn.disabled = false;
        matchBtn.textContent = 'Match Tasks';
    }, 800);
}

function renderMatchedTasks() {
    const matchedSection = document.getElementById('matchedSection');
    const matchedContainer = document.getElementById('matchedContainer');
    const matchedTasks = allTasks.filter(function(t) { return t.status === 'matched'; });

    if (matchedTasks.length === 0) {
        matchedContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-text">Great job! You\'ve accepted all matching tasks</div></div>';
        matchedSection.classList.remove('hidden');
        return;
    }

    matchedContainer.innerHTML = '';
    const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
    const colors = { 'Water': '#3B82F6', 'Medical': '#8B5CF6', 'Food': '#F59E0B' };

    matchedTasks.forEach(function(task, index) {
        const actualIndex = allTasks.indexOf(task);
        const card = document.createElement('div');
        card.className = 'task-card';
        card.style.animationDelay = (index * 0.1) + 's';
        card.innerHTML = '<div class="task-card-icon" style="background: ' + colors[task.category] + '20; color: ' + colors[task.category] + ';">' + icons[task.category] + '</div><div class="task-card-info"><div class="task-card-name">' + task.category + ' Support</div><div class="task-card-matched">✔ Matched because: skill = ' + task.matchedSkill + '</div></div><button class="accept-btn" onclick="acceptTask(' + actualIndex + ')">Accept Task</button>';
        matchedContainer.appendChild(card);
    });

    matchedSection.classList.remove('hidden');
}

function acceptTask(index) {
    allTasks[index].status = 'accepted';
    allTasks[index].acceptedAt = new Date().toLocaleDateString();
    
    showSuccessMessage();
    renderMatchedTasks();
    renderAssignedTasks();
    renderContributions();
}

function showSuccessMessage() {
    const msg = document.getElementById('successMessage');
    if (msg) {
        msg.classList.remove('hidden');
        setTimeout(function() { msg.classList.add('hidden'); }, 3000);
    }
}

function renderAssignedTasks() {
    const assignedSection = document.getElementById('assignedSection');
    const assignedContainer = document.getElementById('assignedContainer');
    const acceptedTasks = allTasks.filter(function(t) { return t.status === 'accepted'; });

    if (acceptedTasks.length === 0) {
        assignedSection.classList.add('hidden');
        return;
    }

    assignedContainer.innerHTML = '';
    const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
    const colors = { 'Water': '#3B82F6', 'Medical': '#8B5CF6', 'Food': '#F59E0B' };

    acceptedTasks.forEach(function(task, idx) {
        const card = document.createElement('div');
        card.className = 'assigned-card';
        card.style.animationDelay = (idx * 0.1) + 's';
        card.innerHTML = '<div class="assigned-card-icon" style="background: ' + colors[task.category] + '20; color: ' + colors[task.category] + ';">' + icons[task.category] + '</div><div class="assigned-card-info"><div class="assigned-card-name">' + task.category + ' Support</div><div class="assigned-card-date">Accepted: ' + task.acceptedAt + '</div></div><span class="status-badge" style="background: #3B82F6;">Accepted</span><button class="action-btn" onclick="startTask(' + allTasks.indexOf(task) + ')">Start Task</button>';
        assignedContainer.appendChild(card);
    });

    assignedSection.classList.remove('hidden');
}

function renderInProgressTasks() {
    const inProgressSection = document.getElementById('inProgressSection');
    const inProgressContainer = document.getElementById('inProgressContainer');
    const inProgressTasks = allTasks.filter(function(t) { return t.status === 'in-progress'; });

    if (inProgressTasks.length === 0) {
        inProgressSection.classList.add('hidden');
        return;
    }

    inProgressContainer.innerHTML = '';
    const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
    const colors = { 'Water': '#3B82F6', 'Medical': '#8B5CF6', 'Food': '#F59E0B' };

    inProgressTasks.forEach(function(task, idx) {
        const card = document.createElement('div');
        card.className = 'in-progress-card';
        card.style.animationDelay = (idx * 0.1) + 's';
        card.innerHTML = '<div class="in-progress-card-icon" style="background: ' + colors[task.category] + '20; color: ' + colors[task.category] + ';">' + icons[task.category] + '</div><div class="in-progress-card-info"><div class="in-progress-card-name">' + task.category + ' Support</div><div class="in-progress-card-date">Started: ' + task.startedAt + '</div></div><span class="status-badge" style="background: #F59E0B;">In Progress</span><button class="action-btn" onclick="completeTask(' + allTasks.indexOf(task) + ')">Mark as Completed</button>';
        inProgressContainer.appendChild(card);
    });

    inProgressSection.classList.remove('hidden');
}

function startTask(index) {
    allTasks[index].status = 'in-progress';
    allTasks[index].startedAt = new Date().toLocaleDateString();
    renderAssignedTasks();
    renderInProgressTasks();
}

function completeTask(index) {
    allTasks[index].status = 'completed';
    allTasks[index].completedAt = new Date().toLocaleDateString();
    renderInProgressTasks();
    renderContributions();
}

function filterContributions(filter) {
    document.querySelectorAll('.filter-btn').forEach(function(btn) { btn.classList.remove('active'); });
    var activeBtn = document.querySelector('[data-filter="' + filter + '"]');
    if (activeBtn) activeBtn.classList.add('active');
    renderContributions(filter);
}

function renderContributions(filter) {
    filter = filter || 'all';
    const contributionsSection = document.getElementById('contributionsSection');
    const contributionsContainer = document.getElementById('contributionsContainer');

    let filteredTasks = allTasks.filter(function(t) { return t.status === 'accepted' || t.status === 'in-progress' || t.status === 'completed'; });
    if (filter === 'active') filteredTasks = allTasks.filter(function(t) { return t.status === 'accepted' || t.status === 'in-progress'; });
    if (filter === 'completed') filteredTasks = allTasks.filter(function(t) { return t.status === 'completed'; });

    if (filteredTasks.length === 0) {
        contributionsContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-text">All tasks completed!</div></div>';
        contributionsSection.classList.remove('hidden');
        return;
    }

    contributionsContainer.innerHTML = '';
    const icons = { 'Water': '💧', 'Medical': '🏥', 'Food': '🍞' };
    const colors = { 'Water': '#3B82F6', 'Medical': '#8B5CF6', 'Food': '#F59E0B' };

    filteredTasks.forEach(function(task, index) {
        const card = document.createElement('div');
        card.className = 'contribution-card';
        card.style.animationDelay = (index * 0.1) + 's';
        
        let statusText, statusColor;
        if (task.status === 'completed') {
            statusText = 'Completed';
            statusColor = '#10B981';
        } else if (task.status === 'in-progress') {
            statusText = 'In Progress';
            statusColor = '#F59E0B';
        } else {
            statusText = 'Accepted';
            statusColor = '#3B82F6';
        }

        card.innerHTML = '<div class="contribution-card-icon" style="background: ' + colors[task.category] + '20; color: ' + colors[task.category] + ';">' + icons[task.category] + '</div><div class="contribution-card-info"><div class="contribution-card-name">' + task.category + ' Support</div><div class="contribution-card-meta">' + (task.acceptedAt || task.startedAt) + '</div></div><span class="contribution-status" style="background: ' + statusColor + ';">✔ ' + statusText + '</span>';
        contributionsContainer.appendChild(card);
    });

    contributionsSection.classList.remove('hidden');
}
