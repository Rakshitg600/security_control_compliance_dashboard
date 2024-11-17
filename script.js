// ISO 27001 control categories
const controlCategories = [
    'Information Security Policies',  // Category for security policies management
    'Organization of Information Security',  // Category for organizational security structure
    'Human Resource Security',  // Category for security related to employees
    'Asset Management',  // Category for managing security of assets
    'Access Control',  // Category for controlling access permissions
    'Cryptography',  // Category for encryption and data protection
    'Physical Security',  // Category for physical access and security measures
    'Operations Security'  // Category for operational security practices
];

// Sample control data structure
let controls = controlCategories.map(category => ({  // Mapping each category to an object
    category,  // Assign the current category name
    status: ['compliant', 'partial', 'non-compliant'][Math.floor(Math.random() * 3)],  // Randomly assign a status
    lastAssessed: new Date().toLocaleDateString(),  // Set current date as last assessed date
    findings: Math.floor(Math.random() * 5)  // Randomly assign number of findings (0 to 4)
}));

// Initialize dashboard
function initializeDashboard() {
    renderControls();  // Render the control cards
    renderComplianceChart();  // Render the compliance chart
    updateMetrics();  // Update the metric cards
}

// Render control cards
function renderControls() {
    const container = document.getElementById('controlsContainer');  // Get the container for control cards
    container.innerHTML = controls.map(control => `  // Create HTML for each control card
        <div class="control-card">
            <div class="control-header">
                <h3>${control.category}</h3>  // Display the category name
                <span class="status-indicator status-${control.status}">  // Add status badge with color
                    ${control.status.charAt(0).toUpperCase() + control.status.slice(1)}  // Capitalize first letter of status
                </span>
            </div>
            <p>Last Assessed: ${control.lastAssessed}</p>  // Show last assessed date
            <p>Findings: ${control.findings}</p>  // Show number of findings
        </div>
    `).join('');  // Join all cards into a single HTML string
}

// Render compliance chart
function renderComplianceChart() {
    const ctx = document.getElementById('complianceChart').getContext('2d');  // Get canvas context for Chart.js
    const statuses = ['compliant', 'partial', 'non-compliant'];  // Status categories
    const data = statuses.map(status =>  // Map each status to the number of controls with that status
        controls.filter(c => c.status === status).length  // Count controls matching the status
    );

    // Check if the chart exists and destroy it if it does
    if (window.complianceChart && typeof window.complianceChart.destroy === 'function') {
        window.complianceChart.destroy();  // Destroy the existing chart to prevent duplication
    }

    // Create new chart instance
    window.complianceChart = new Chart(ctx, {  // Create a new doughnut chart
        type: 'doughnut',  // Chart type
        data: {
            labels: ['Compliant', 'Partial', 'Non-Compliant'],  // Labels for the chart segments
            datasets: [{
                data: data,  // Data for each segment
                backgroundColor: [  // Background colors for each status
                    getComputedStyle(document.documentElement).getPropertyValue('--success-color'),
                    getComputedStyle(document.documentElement).getPropertyValue('--warning-color'),
                    getComputedStyle(document.documentElement).getPropertyValue('--danger-color')
                ]
            }]
        },
        options: {
            responsive: true,  // Make chart responsive to screen size
            plugins: {
                legend: {
                    position: 'bottom'  // Position the legend at the bottom
                }
            }
        }
    });
}

// Update metrics
function updateMetrics() {
    const compliant = controls.filter(c => c.status === 'compliant').length;  // Count compliant controls
    document.getElementById('overall-compliance').textContent = 
        Math.round((compliant / controls.length) * 100) + '%';  // Calculate and display compliance percentage
    document.getElementById('controls-assessed').textContent = 
        `${controls.length}/${controlCategories.length}`;  // Show total controls assessed
    document.getElementById('critical-findings').textContent = 
        controls.reduce((sum, control) => sum + control.findings, 0);  // Sum and display total findings
}

// Generate PDF report
function generateReport() {
    const reportData = {  // Gather data for the report
        timestamp: new Date().toLocaleString(),  // Current date and time
        compliance: document.getElementById('overall-compliance').textContent,  // Compliance percentage
        assessed: document.getElementById('controls-assessed').textContent,  // Number of controls assessed
        findings: document.getElementById('critical-findings').textContent,  // Total findings
        controls: controls  // List of all controls
    };

    // In a real application, this would generate a PDF
    console.log('Generating report with data:', reportData);  // Log the report data to the console
    alert('Report generated! Check console for details.');  // Notify user that the report is generated
}

// Assessment modal functions
function showAssessmentModal() {
    const modal = document.getElementById('assessmentModal');  // Get the modal element
    const form = document.getElementById('assessmentForm');  // Get the form container in the modal
    
    form.innerHTML = `  // Populate the form with category assessment fields
        <form onsubmit="submitAssessment(event)">
            ${controlCategories.map(category => `
                <div class="control-assessment">
                    <h3>${category}</h3>  // Display the category name
                    <select name="${category.replace(/\s+/g, '_')}">  // Dropdown to select status
                        <option value="compliant">Compliant</option>
                        <option value="partial">Partial</option>
                        <option value="non-compliant">Non-Compliant</option>
                    </select>
                    <input type="number" placeholder="Number of findings" min="0" max="10">  // Input for findings count
                </div>
            `).join('')}  // Join all fields into a single HTML string
            <button type="submit">Submit Assessment</button>  // Button to submit the form
        </form>
    `;
    
    modal.style.display = 'block';  // Show the modal
}

function hideAssessmentModal() {
    document.getElementById('assessmentModal').style.display = 'none';  // Hide the modal
}

function submitAssessment(event) {
    event.preventDefault();  // Prevent the form from refreshing the page
    const formElements = event.target.elements;  // Get the form elements
    
    controls = controlCategories.map(category => ({  // Update controls based on form input
        category,  // Assign the category name
        status: formElements[category.replace(/\s+/g, '_')].value,  // Get selected status
        lastAssessed: new Date().toLocaleDateString(),  // Update last assessed date
        findings: parseInt(formElements[category.replace(/\s+/g, '_')].nextElementSibling.value) || 0  // Get findings count or default to 0
    }));

    hideAssessmentModal();  // Hide the modal
    renderControls();  // Re-render control cards with new data
    renderComplianceChart();  // Re-render compliance chart with updated data
    updateMetrics();  // Update metrics with new values
}

// Initialize the dashboard when the page loads
window.onload = initializeDashboard;  // Call initializeDashboard on page load
