// ISO 27001 control categories
const controlCategories = [
    'Information Security Policies',
    'Organization of Information Security',
    'Human Resource Security',
    'Asset Management',
    'Access Control',
    'Cryptography',
    'Physical Security',
    'Operations Security'
];

// Sample control data structure
let controls = controlCategories.map(category => ({
    category,
    status: ['compliant', 'partial', 'non-compliant'][Math.floor(Math.random() * 3)],
    lastAssessed: new Date().toLocaleDateString(),
    findings: Math.floor(Math.random() * 5)
}));

// Initialize dashboard
function initializeDashboard() {
    renderControls();
    renderComplianceChart();
    updateMetrics();
}

// Render control cards
function renderControls() {
    const container = document.getElementById('controlsContainer');
    container.innerHTML = controls.map(control => `
        <div class="control-card">
            <div class="control-header">
                <h3>${control.category}</h3>
                <span class="status-indicator status-${control.status}">
                    ${control.status.charAt(0).toUpperCase() + control.status.slice(1)}
                </span>
            </div>
            <p>Last Assessed: ${control.lastAssessed}</p>
            <p>Findings: ${control.findings}</p>
        </div>
    `).join('');
}

// Render compliance chart
function renderComplianceChart() {
    const ctx = document.getElementById('complianceChart').getContext('2d');
    const statuses = ['compliant', 'partial', 'non-compliant'];
    const data = statuses.map(status => 
        controls.filter(c => c.status === status).length
    );

    // Check if the chart exists and destroy it if it does
    if (window.complianceChart && typeof window.complianceChart.destroy === 'function') {
        window.complianceChart.destroy();
    }

    // Create new chart instance
    window.complianceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Compliant', 'Partial', 'Non-Compliant'],
            datasets: [{
                data: data,
                backgroundColor: [
                    getComputedStyle(document.documentElement).getPropertyValue('--success-color'),
                    getComputedStyle(document.documentElement).getPropertyValue('--warning-color'),
                    getComputedStyle(document.documentElement).getPropertyValue('--danger-color')
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


// Update metrics
function updateMetrics() {
    const compliant = controls.filter(c => c.status === 'compliant').length;
    document.getElementById('overall-compliance').textContent = 
        Math.round((compliant / controls.length) * 100) + '%';
    document.getElementById('controls-assessed').textContent = 
        `${controls.length}/${controlCategories.length}`;
    document.getElementById('critical-findings').textContent = 
        controls.reduce((sum, control) => sum + control.findings, 0);
}

// Generate PDF report
function generateReport() {
    const reportData = {
        timestamp: new Date().toLocaleString(),
        compliance: document.getElementById('overall-compliance').textContent,
        assessed: document.getElementById('controls-assessed').textContent,
        findings: document.getElementById('critical-findings').textContent,
        controls: controls
    };

    // In a real application, this would generate a PDF
    console.log('Generating report with data:', reportData);
    alert('Report generated! Check console for details.');
}

// Assessment modal functions
function showAssessmentModal() {
    const modal = document.getElementById('assessmentModal');
    const form = document.getElementById('assessmentForm');
    
    form.innerHTML = `
        <form onsubmit="submitAssessment(event)">
            ${controlCategories.map(category => `
                <div class="control-assessment">
                    <h3>${category}</h3>
                    <select name="${category.replace(/\s+/g, '_')}">
                        <option value="compliant">Compliant</option>
                        <option value="partial">Partial</option>
                        <option value="non-compliant">Non-Compliant</option>
                    </select>
                    <input type="number" placeholder="Number of findings" min="0" max="10">
                </div>
            `).join('')}
            <button type="submit">Submit Assessment</button>
        </form>
    `;
    
    modal.style.display = 'block';
}

function hideAssessmentModal() {
    document.getElementById('assessmentModal').style.display = 'none';
}

function submitAssessment(event) {
    event.preventDefault();
    const formElements = event.target.elements;
    
    controls = controlCategories.map(category => ({
        category,
        status: formElements[category.replace(/\s+/g, '_')].value,
        lastAssessed: new Date().toLocaleDateString(),
        findings: parseInt(formElements[category.replace(/\s+/g, '_')].nextElementSibling.value) || 0
    }));

    hideAssessmentModal();
    renderControls();
    renderComplianceChart();
    updateMetrics();
}

// Initialize the dashboard when the page loads
window.onload = initializeDashboard;