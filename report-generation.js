// File: report-generation.js
// ===== Report Generation System =====

let currentReportType = 'summary';
let reportData = {};
let chartInstances = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Report Generation System Initialized');
    loadReportData();
});

// ===== REPORT TYPE SELECTION =====
function selectReportType(type) {
    currentReportType = type;
    
    // Update active button
    document.querySelectorAll('.report-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.report-type-btn[data-type="${type}"]`).classList.add('active');
    
    // Generate the selected report
    generateReport();
}

// ===== DATE RANGE MANAGEMENT =====
function applyDateRange() {
    generateReport();
}

// ===== DATA LOADING =====
async function loadReportData() {
    try {
        // Show loading indicator
        document.getElementById('loadingIndicator').style.display = 'block';
        
        // In a real application, these would be API calls
        const endpoints = {
            summary: '/api/reports/summary',
            requests: '/api/reports/requests',
            resources: '/api/reports/resources',
            volunteers: '/api/reports/volunteers',
            financial: '/api/reports/financial'
        };
        
        // Simulate API calls
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        reportData = await simulateReportData(currentReportType, startDate, endDate);
        
        // Update stats
        updateReportStats(reportData.stats);
        
        // Generate the report
        generateReport();
        
    } catch (error) {
        console.error('Error loading report data:', error);
        showNotification('Failed to load report data', 'error');
    } finally {
        document.getElementById('loadingIndicator').style.display = 'none';
    }
}

async function simulateReportData(type, startDate, endDate) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate sample data based on report type
    const baseData = {
        stats: {
            totalRequests: Math.floor(Math.random() * 500) + 100,
            totalRescues: Math.floor(Math.random() * 300) + 50,
            activeVolunteers: Math.floor(Math.random() * 100) + 20,
            resourcesDeployed: Math.floor(Math.random() * 200) + 30
        },
        period: {
            start: startDate,
            end: endDate
        },
        generatedOn: new Date().toLocaleDateString()
    };
    
    switch(type) {
        case 'summary':
            return {
                ...baseData,
                executiveSummary: "This report provides a comprehensive overview of emergency response activities during the specified period.",
                keyMetrics: [
                    { metric: "Response Time (Avg)", value: "18.4 minutes", trend: "↓ 5% from last period" },
                    { metric: "Request Resolution Rate", value: "87%", trend: "↑ 3% from last period" },
                    { metric: "Volunteer Utilization", value: "92%", trend: "↑ 2% from last period" },
                    { metric: "Resource Efficiency", value: "78%", trend: "↑ 4% from last period" }
                ],
                topZones: [
                    { zone: "Sylhet Division", requests: 142, priority: "High" },
                    { zone: "Dhaka Division", requests: 98, priority: "Medium" },
                    { zone: "Chattogram Division", requests: 76, priority: "High" },
                    { zone: "Khulna Division", requests: 54, priority: "Low" }
                ]
            };
            
        case 'requests':
            return {
                ...baseData,
                requestBreakdown: [
                    { type: "Medical Assistance", count: 156, percentage: 32 },
                    { type: "Rescue Operations", count: 124, percentage: 25 },
                    { type: "Food & Water", count: 98, percentage: 20 },
                    { type: "Shelter", count: 67, percentage: 14 },
                    { type: "Other", count: 45, percentage: 9 }
                ],
                priorityDistribution: [
                    { priority: "High", count: 189, percentage: 39 },
                    { priority: "Medium", count: 215, percentage: 44 },
                    { priority: "Low", count: 86, percentage: 17 }
                ],
                responseTimes: [
                    { zone: "Sylhet", avgTime: "22.3 min" },
                    { zone: "Dhaka", avgTime: "16.8 min" },
                    { zone: "Chattogram", avgTime: "19.5 min" },
                    { zone: "Khulna", avgTime: "24.1 min" }
                ]
            };
            
        case 'resources':
            return {
                ...baseData,
                resourceUtilization: [
                    { resource: "Medical Supplies", used: 78, available: 120, percentage: 65 },
                    { resource: "Food & Water", used: 145, available: 200, percentage: 72 },
                    { resource: "Rescue Equipment", used: 45, available: 60, percentage: 75 },
                    { resource: "Communication Devices", used: 32, available: 50, percentage: 64 },
                    { resource: "Transport Vehicles", used: 28, available: 35, percentage: 80 }
                ],
                distributionByZone: [
                    { zone: "Sylhet", medical: 45, food: 67, equipment: 23 },
                    { zone: "Dhaka", medical: 32, food: 45, equipment: 18 },
                    { zone: "Chattogram", medical: 28, food: 38, equipment: 15 },
                    { zone: "Khulna", medical: 15, food: 25, equipment: 9 }
                ]
            };
            
        case 'volunteers':
            return {
                ...baseData,
                volunteerStats: {
                    total: 156,
                    active: 87,
                    available: 42,
                    onBreak: 27
                },
                activityByZone: [
                    { zone: "Sylhet", volunteers: 45, hours: 320, tasks: 167 },
                    { zone: "Dhaka", volunteers: 32, hours: 245, tasks: 134 },
                    { zone: "Chattogram", volunteers: 28, hours: 198, tasks: 98 },
                    { zone: "Khulna", volunteers: 15, hours: 112, tasks: 67 }
                ],
                topPerformers: [
                    { name: "Abdul Rahman", zone: "Sylhet", tasks: 45, hours: 68 },
                    { name: "Fatima Begum", zone: "Dhaka", tasks: 38, hours: 52 },
                    { name: "Mohammad Ali", zone: "Chattogram", tasks: 32, hours: 48 },
                    { name: "Ayesha Khan", zone: "Sylhet", tasks: 29, hours: 42 }
                ]
            };
            
        case 'financial':
            return {
                ...baseData,
                financialSummary: {
                    totalDonations: 1250000,
                    expenses: 890000,
                    balance: 360000,
                    donationGrowth: "+12% from last period"
                },
                donationBreakdown: [
                    { type: "Cash Donations", amount: 750000, percentage: 60 },
                    { type: "Medical Supplies", amount: 250000, percentage: 20 },
                    { type: "Food & Water", amount: 150000, percentage: 12 },
                    { type: "Equipment", amount: 100000, percentage: 8 }
                ],
                expenseBreakdown: [
                    { category: "Medical Supplies", amount: 320000, percentage: 36 },
                    { category: "Food & Water", amount: 285000, percentage: 32 },
                    { category: "Transportation", amount: 145000, percentage: 16 },
                    { category: "Equipment", amount: 85000, percentage: 10 },
                    { category: "Administrative", amount: 55000, percentage: 6 }
                ]
            };
            
        default:
            return baseData;
    }
}

// ===== REPORT GENERATION =====
function generateReport() {
    // Clear existing charts
    chartInstances.forEach(chart => chart.destroy());
    chartInstances = [];
    
    const preview = document.getElementById('reportPreview');
    
    switch(currentReportType) {
        case 'summary':
            generateSummaryReport(preview);
            break;
        case 'requests':
            generateRequestsReport(preview);
            break;
        case 'resources':
            generateResourcesReport(preview);
            break;
        case 'volunteers':
            generateVolunteersReport(preview);
            break;
        case 'financial':
            generateFinancialReport(preview);
            break;
        case 'custom':
            generateCustomReport(preview);
            break;
    }
    
    // Update report metadata
    document.getElementById('reportDate').textContent = reportData.generatedOn;
    document.getElementById('reportPeriod').textContent = 
        `${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}`;
}

function generateSummaryReport(container) {
    container.innerHTML = `
        <div class="report-header-section">
            <h1>Emergency Response Summary Report</h1>
            <p>Comprehensive overview of emergency response activities</p>
            <div class="report-meta">
                <span>Generated on: ${reportData.generatedOn}</span>
                <span>Period: ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Executive Summary</h2>
            <p>${reportData.executiveSummary || "This report provides a comprehensive overview of emergency response activities during the specified period."}</p>
            
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Key Metric</th>
                            <th>Value</th>
                            <th>Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.keyMetrics || []).map(metric => `
                            <tr>
                                <td>${metric.metric}</td>
                                <td>${metric.value}</td>
                                <td>${metric.trend}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Top Emergency Zones</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Zone</th>
                            <th>Requests</th>
                            <th>Priority Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.topZones || []).map(zone => `
                            <tr>
                                <td>${zone.zone}</td>
                                <td>${zone.requests}</td>
                                <td>${zone.priority}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Performance Insights</h2>
            <div class="report-summary">
                <h3>Key Findings</h3>
                <ul>
                    <li>Response times improved by 5% compared to the previous period</li>
                    <li>Sylhet Division continues to be the highest priority zone with 142 emergency requests</li>
                    <li>Volunteer utilization reached 92%, indicating efficient resource allocation</li>
                    <li>Medical assistance remains the most requested service type (32% of all requests)</li>
                </ul>
            </div>
        </div>
        
        <div class="report-footer">
            <p>This report was automatically generated by the Emergency Response System</p>
            <p>For questions or additional information, contact the system administrator</p>
        </div>
    `;
}

function generateRequestsReport(container) {
    container.innerHTML = `
        <div class="report-header-section">
            <h1>Emergency Requests Report</h1>
            <p>Detailed analysis of emergency requests and response metrics</p>
            <div class="report-meta">
                <span>Generated on: ${reportData.generatedOn}</span>
                <span>Period: ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Request Breakdown by Type</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Request Type</th>
                            <th>Count</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.requestBreakdown || []).map(item => `
                            <tr>
                                <td>${item.type}</td>
                                <td>${item.count}</td>
                                <td>${item.percentage}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Priority Distribution</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Priority Level</th>
                            <th>Count</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.priorityDistribution || []).map(item => `
                            <tr>
                                <td>${item.priority}</td>
                                <td>${item.count}</td>
                                <td>${item.percentage}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Average Response Times by Zone</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Zone</th>
                            <th>Average Response Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.responseTimes || []).map(item => `
                            <tr>
                                <td>${item.zone}</td>
                                <td>${item.avgTime}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Request Analysis</h2>
            <div class="report-summary">
                <h3>Key Insights</h3>
                <ul>
                    <li>Medical assistance requests account for nearly one-third of all emergency calls</li>
                    <li>High-priority requests make up 39% of the total, requiring immediate attention</li>
                    <li>Response times vary by zone, with urban areas generally responding faster</li>
                    <li>Weekend requests show a 15% increase compared to weekdays</li>
                </ul>
            </div>
        </div>
        
        <div class="report-footer">
            <p>This report was automatically generated by the Emergency Response System</p>
            <p>For questions or additional information, contact the system administrator</p>
        </div>
    `;
}

function generateResourcesReport(container) {
    container.innerHTML = `
        <div class="report-header-section">
            <h1>Resource Utilization Report</h1>
            <p>Analysis of resource deployment and utilization efficiency</p>
            <div class="report-meta">
                <span>Generated on: ${reportData.generatedOn}</span>
                <span>Period: ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Resource Utilization Overview</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Resource Type</th>
                            <th>Used</th>
                            <th>Available</th>
                            <th>Utilization Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.resourceUtilization || []).map(item => `
                            <tr>
                                <td>${item.resource}</td>
                                <td>${item.used}</td>
                                <td>${item.available}</td>
                                <td>${item.percentage}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Resource Distribution by Zone</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Zone</th>
                            <th>Medical Supplies</th>
                            <th>Food & Water</th>
                            <th>Equipment</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.distributionByZone || []).map(item => `
                            <tr>
                                <td>${item.zone}</td>
                                <td>${item.medical}</td>
                                <td>${item.food}</td>
                                <td>${item.equipment}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Resource Management Insights</h2>
            <div class="report-summary">
                <h3>Key Findings</h3>
                <ul>
                    <li>Transport vehicles show the highest utilization rate at 80%</li>
                    <li>Sylhet Division received the largest share of resources due to high emergency volume</li>
                    <li>Medical supplies utilization is at 65%, indicating adequate stock levels</li>
                    <li>Communication devices have the lowest utilization, suggesting potential for redistribution</li>
                </ul>
            </div>
        </div>
        
        <div class="report-footer">
            <p>This report was automatically generated by the Emergency Response System</p>
            <p>For questions or additional information, contact the system administrator</p>
        </div>
    `;
}

function generateVolunteersReport(container) {
    container.innerHTML = `
        <div class="report-header-section">
            <h1>Volunteer Activity Report</h1>
            <p>Analysis of volunteer deployment, performance, and impact</p>
            <div class="report-meta">
                <span>Generated on: ${reportData.generatedOn}</span>
                <span>Period: ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Volunteer Statistics</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total Volunteers</td>
                            <td>${reportData.volunteerStats?.total || 0}</td>
                        </tr>
                        <tr>
                            <td>Active Volunteers</td>
                            <td>${reportData.volunteerStats?.active || 0}</td>
                        </tr>
                        <tr>
                            <td>Available Volunteers</td>
                            <td>${reportData.volunteerStats?.available || 0}</td>
                        </tr>
                        <tr>
                            <td>Volunteers on Break</td>
                            <td>${reportData.volunteerStats?.onBreak || 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Volunteer Activity by Zone</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Zone</th>
                            <th>Volunteers</th>
                            <th>Hours Logged</th>
                            <th>Tasks Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.activityByZone || []).map(item => `
                            <tr>
                                <td>${item.zone}</td>
                                <td>${item.volunteers}</td>
                                <td>${item.hours}</td>
                                <td>${item.tasks}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Top Performing Volunteers</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Volunteer Name</th>
                            <th>Zone</th>
                            <th>Tasks Completed</th>
                            <th>Hours Contributed</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.topPerformers || []).map(volunteer => `
                            <tr>
                                <td>${volunteer.name}</td>
                                <td>${volunteer.zone}</td>
                                <td>${volunteer.tasks}</td>
                                <td>${volunteer.hours}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Volunteer Impact Analysis</h2>
            <div class="report-summary">
                <h3>Key Insights</h3>
                <ul>
                    <li>56% of registered volunteers were active during this reporting period</li>
                    <li>Volunteers in Sylhet logged the highest number of hours (320) due to ongoing flood response</li>
                    <li>Top performers completed an average of 36 tasks each during the period</li>
                    <li>Volunteer retention rate improved by 8% compared to the previous period</li>
                </ul>
            </div>
        </div>
        
        <div class="report-footer">
            <p>This report was automatically generated by the Emergency Response System</p>
            <p>For questions or additional information, contact the system administrator</p>
        </div>
    `;
}

function generateFinancialReport(container) {
    container.innerHTML = `
        <div class="report-header-section">
            <h1>Financial Report</h1>
            <p>Overview of donations, expenses, and financial management</p>
            <div class="report-meta">
                <span>Generated on: ${reportData.generatedOn}</span>
                <span>Period: ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Financial Summary</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Amount (BDT)</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total Donations</td>
                            <td>${formatCurrency(reportData.financialSummary?.totalDonations || 0)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Total Expenses</td>
                            <td>${formatCurrency(reportData.financialSummary?.expenses || 0)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Current Balance</td>
                            <td>${formatCurrency(reportData.financialSummary?.balance || 0)}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Donation Growth</td>
                            <td colspan="2">${reportData.financialSummary?.donationGrowth || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Donation Breakdown</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Donation Type</th>
                            <th>Amount (BDT)</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.donationBreakdown || []).map(item => `
                            <tr>
                                <td>${item.type}</td>
                                <td>${formatCurrency(item.amount)}</td>
                                <td>${item.percentage}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Expense Breakdown</h2>
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Expense Category</th>
                            <th>Amount (BDT)</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(reportData.expenseBreakdown || []).map(item => `
                            <tr>
                                <td>${item.category}</td>
                                <td>${formatCurrency(item.amount)}</td>
                                <td>${item.percentage}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Financial Analysis</h2>
            <div class="report-summary">
                <h3>Key Insights</h3>
                <ul>
                    <li>Cash donations account for 60% of total contributions</li>
                    <li>Medical supplies represent the largest expense category at 36% of total spending</li>
                    <li>The organization maintains a healthy balance of ${formatCurrency(reportData.financialSummary?.balance || 0)} for future operations</li>
                    <li>Donation growth of 12% indicates increasing public support for emergency response efforts</li>
                </ul>
            </div>
        </div>
        
        <div class="report-footer">
            <p>This report was automatically generated by the Emergency Response System</p>
            <p>For questions or additional information, contact the system administrator</p>
        </div>
    `;
}

function generateCustomReport(container) {
    container.innerHTML = `
        <div class="report-header-section">
            <h1>Custom Report</h1>
            <p>Create a customized report based on specific criteria</p>
            <div class="report-meta">
                <span>Generated on: ${reportData.generatedOn}</span>
                <span>Period: ${new Date(reportData.period.start).toLocaleDateString()} - ${new Date(reportData.period.end).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div class="report-section">
            <h2>Custom Report Configuration</h2>
            <p>Select the data points you want to include in your custom report:</p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" checked> Emergency Requests
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" checked> Resource Utilization
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" checked> Volunteer Activity
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox"> Financial Data
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox"> Response Times
                </label>
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox"> Geographic Distribution
                </label>
            </div>
            
            <button class="btn-primary" onclick="generateCustomReportData()">Generate Custom Report</button>
        </div>
        
        <div class="report-section" id="customReportContent">
            <p>Configure your report options above and click "Generate Custom Report" to create your personalized report.</p>
        </div>
        
        <div class="report-footer">
            <p>This report was automatically generated by the Emergency Response System</p>
            <p>For questions or additional information, contact the system administrator</p>
        </div>
    `;
}

function generateCustomReportData() {
    const customContent = document.getElementById('customReportContent');
    customContent.innerHTML = `
        <h2>Custom Report Results</h2>
        <div class="report-summary">
            <h3>Selected Data Points</h3>
            <p>Based on your selection, here is a summary of the requested information:</p>
            
            <div class="report-table">
                <table>
                    <thead>
                        <tr>
                            <th>Data Category</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total Emergency Requests</td>
                            <td>${reportData.stats.totalRequests}</td>
                        </tr>
                        <tr>
                            <td>Active Volunteers</td>
                            <td>${reportData.stats.activeVolunteers}</td>
                        </tr>
                        <tr>
                            <td>Resources Deployed</td>
                            <td>${reportData.stats.resourcesDeployed}</td>
                        </tr>
                        <tr>
                            <td>Rescues Completed</td>
                            <td>${reportData.stats.totalRescues}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <h3 style="margin-top: 20px;">Custom Analysis</h3>
            <p>This custom report combines multiple data points to provide a comprehensive view of emergency response operations during the selected period.</p>
            
            <ul>
                <li>Each active volunteer handled an average of ${Math.round(reportData.stats.totalRequests / reportData.stats.activeVolunteers)} requests</li>
                <li>Resource deployment efficiency: ${Math.round((reportData.stats.resourcesDeployed / reportData.stats.totalRequests) * 100)}%</li>
                <li>Rescue success rate: ${Math.round((reportData.stats.totalRescues / reportData.stats.totalRequests) * 100)}%</li>
            </ul>
        </div>
    `;
}

// ===== REPORT ACTIONS =====
function saveReport() {
    // In a real application, this would save the report to a database
    showNotification('Report saved successfully', 'success');
}

function exportReport() {
    // In a real application, this would generate a PDF or Excel file
    const reportContent = document.getElementById('reportPreview').innerHTML;
    
    // Create a new window with the report content for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Emergency Response Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .report-header-section { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4dabf7; padding-bottom: 20px; }
                .report-section { margin-bottom: 25px; }
                .report-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
                .report-table th, .report-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                .report-table th { background: #f5f5f5; }
                .report-summary { background: #f9f9f9; padding: 15px; border-radius: 6px; }
                .report-footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${reportContent}
            <div class="no-print" style="margin-top: 20px; text-align: center;">
                <button onclick="window.print()">Print Report</button>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    
    showNotification('Report exported successfully', 'success');
}

// ===== UTILITY FUNCTIONS =====
function updateReportStats(stats) {
    if (!stats) return;
    
    document.getElementById('total-requests').textContent = stats.totalRequests || 0;
    document.getElementById('total-rescues').textContent = stats.totalRescues || 0;
    document.getElementById('active-volunteers').textContent = stats.activeVolunteers || 0;
    document.getElementById('resources-deployed').textContent = stats.resourcesDeployed || 0;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0
    }).format(amount);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add basic notification styles if not present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                background: #272727;
                color: white;
                padding: 12px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 300px;
            }
            .notification.success { border-left: 4px solid #2fb26a; }
            .notification.error { border-left: 4px solid #e02b2b; }
            .notification.info { border-left: 4px solid #3a86ff; }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== EXPORT FUNCTIONS =====
window.selectReportType = selectReportType;
window.applyDateRange = applyDateRange;
window.generateCustomReportData = generateCustomReportData;
window.saveReport = saveReport;
window.exportReport = exportReport;