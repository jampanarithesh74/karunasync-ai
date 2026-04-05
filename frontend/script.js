document.getElementById('analyzeBtn').addEventListener('click', analyzeReport);

async function analyzeReport() {
    const report = document.getElementById('report').value.trim();
    const resultsSection = document.getElementById('resultsSection');
    const needsContainer = document.getElementById('needsContainer');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (!report) {
        alert('Please enter an NGO report to analyze.');
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';

    try {
        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: report })
        });

        const data = await response.json();
        const needs = data.needs || [];
        
        needsContainer.innerHTML = '';

        if (needs.length === 0) {
            needsContainer.innerHTML = `
                <div class="need-card low">
                    <span class="priority-badge low">Low</span>
                    <div class="need-content">
                        <div class="need-title">No specific needs detected</div>
                        <div class="need-description">Try adding more details about specific requirements or challenges.</div>
                    </div>
                </div>
            `;
        } else {
            needs.forEach((need, index) => {
                const card = document.createElement('div');
                card.className = `need-card ${need.priority.toLowerCase()}`;
                card.style.animationDelay = `${index * 0.1}s`;

                card.innerHTML = `
                    <span class="priority-badge ${need.priority.toLowerCase()}">${need.priority}</span>
                    <div class="need-content">
                        <div class="need-title">${need.category}</div>
                    </div>
                `;

                needsContainer.appendChild(card);
            });
        }

        resultsSection.classList.remove('hidden');
    } catch (error) {
        alert('Failed to analyze report. Make sure the server is running.');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<span>Analyze Report</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
}