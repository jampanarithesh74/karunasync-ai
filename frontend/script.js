document.getElementById('analyzeBtn').addEventListener('click', analyzeReport);

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
        const needs = [];

        if (report.includes('water')) {
            needs.push({ category: 'Water', priority: 'High' });
        }
        if (report.includes('medical')) {
            needs.push({ category: 'Medical', priority: 'Medium' });
        }
        if (report.includes('food')) {
            needs.push({ category: 'Food', priority: 'Low' });
        }

        needsContainer.innerHTML = '';

        if (needs.length === 0) {
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

            needs.forEach((need, index) => {
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