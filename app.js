// Global variables
let currentLanguage = 'en';
let clients = [];
let currentClientId = null;

// Language translations
const translations = {
    en: {
        pending: 'Pending',
        reminded: 'Reminded',
        completed: 'Completed',
        sendReminder: 'Send Reminder',
        markDone: 'Mark Done',
        edit: 'Edit',
        delete: 'Delete',
        sendWhatsApp: 'Send WhatsApp',
        markCompleted: 'Mark Completed',
        markReminded: 'Mark Reminded',
        today: 'Today',
        overdue: 'Overdue',
        noFollowups: 'No follow-ups for today',
        noClients: 'No clients found'
    },
    ml: {
        pending: 'തീർപ്പാക്കാത്തത്',
        reminded: 'ഓർമ്മപ്പെടുത്തിയത്',
        completed: 'പൂർത്തിയാക്കിയത്',
        sendReminder: 'ഓർമ്മപ്പെടുത്തൽ അയയ്ക്കുക',
        markDone: 'പൂർത്തിയാക്കി അടയാളപ്പെടുത്തുക',
        edit: 'എഡിറ്റ് ചെയ്യുക',
        delete: 'ഇല്ലാതാക്കുക',
        sendWhatsApp: 'WhatsApp അയയ്ക്കുക',
        markCompleted: 'പൂർത്തിയാക്കി അടയാളപ്പെടുത്തുക',
        markReminded: 'ഓർമ്മപ്പെടുത്തി അടയാളപ്പെടുത്തുക',
        today: 'ഇന്ന്',
        overdue: 'കാലഹരണപ്പെട്ടത്',
        noFollowups: 'ഇന്നത്തേക്ക് പിന്തുടർച്ചകളൊന്നുമില്ല',
        noClients: 'ക്ലയന്റുകളൊന്നും കണ്ടെത്തിയില്ല'
    }
};

// Message templates
const messageTemplates = {
    default: {
        en: "Hi {name}, your GST filing is due on {date}. Please complete it to avoid penalties. For assistance, call us.",
        ml: "Hi {name}, ningalude GST filing date {date} aanu. Penalty avoid cheyyan dayavayi complete cheyyuka. Sahayavarkk call cheyyu."
    },
    urgent: {
        en: "URGENT: Hi {name}, your GST filing is due TOMORROW ({date}). Please complete it immediately to avoid late fees and penalties under GST law.",
        ml: "അടിയന്തിരം: Hi {name}, ningalude GST filing date nale ({date}) aanu. GST law il late fees പിഴകൾ ഒഴിവാക്കാൻ ദയവായി ഉടൻ പൂർത്തിയാക്കുക."
    },
    gstr1: {
        en: "Hi {name}, your GSTR-1 filing for {period} is due on {date}. Please submit your outward supplies details.",
        ml: "Hi {name}, {period} കാലയളവിലെ GSTR-1 filing date {date} aanu. Outward supplies details submit cheyyuka."
    },
    gstr3b: {
        en: "Hi {name}, your GSTR-3B filing for {period} is due on {date}. Please complete your tax payment and return filing.",
        ml: "Hi {name}, {period} കാലയളവിലെ GSTR-3B filing date {date} aanu. Tax payment അടച്ച് return filing complete cheyyuka."
    }
};

// Indian states with GST codes
const indianStates = [
    { code: '01', name: 'Jammu & Kashmir' },
    { code: '02', name: 'Himachal Pradesh' },
    { code: '03', name: 'Punjab' },
    { code: '04', name: 'Chandigarh' },
    { code: '05', name: 'Uttarakhand' },
    { code: '06', name: 'Haryana' },
    { code: '07', name: 'Delhi' },
    { code: '08', name: 'Rajasthan' },
    { code: '09', name: 'Uttar Pradesh' },
    { code: '10', name: 'Bihar' },
    { code: '11', name: 'Sikkim' },
    { code: '12', name: 'Arunachal Pradesh' },
    { code: '13', name: 'Nagaland' },
    { code: '14', name: 'Manipur' },
    { code: '15', name: 'Mizoram' },
    { code: '16', name: 'Tripura' },
    { code: '17', name: 'Meghalaya' },
    { code: '18', name: 'Assam' },
    { code: '19', name: 'West Bengal' },
    { code: '20', name: 'Jharkhand' },
    { code: '21', name: 'Odisha' },
    { code: '22', name: 'Chhattisgarh' },
    { code: '23', name: 'Madhya Pradesh' },
    { code: '24', name: 'Gujarat' },
    { code: '25', name: 'Daman & Diu' },
    { code: '26', name: 'Dadra & Nagar Haveli' },
    { code: '27', name: 'Maharashtra' },
    { code: '28', name: 'Andhra Pradesh' },
    { code: '29', name: 'Karnataka' },
    { code: '30', name: 'Goa' },
    { code: '31', name: 'Lakshadweep' },
    { code: '32', name: 'Kerala' },
    { code: '33', name: 'Tamil Nadu' },
    { code: '34', name: 'Puducherry' },
    { code: '35', name: 'Andaman & Nicobar Islands' },
    { code: '36', name: 'Telangana' },
    { code: '37', name: 'Ladakh' }
];

// Business categories
const businessCategories = [
    'Manufacturer',
    'Trader',
    'Service Provider',
    'E-commerce Operator',
    'Restaurant/Catering',
    'Construction',
    'Healthcare',
    'Education',
    'Transportation',
    'IT Services',
    'Consulting',
    'Retail',
    'Wholesale',
    'Agriculture',
    'Textile',
    'Pharmaceutical',
    'Real Estate',
    'Banking/Finance',
    'Insurance',
    'Telecommunications'
];

// GST return types
const gstReturnTypes = [
    { type: 'GSTR-1', description: 'Outward Supplies' },
    { type: 'GSTR-3B', description: 'Monthly Return' },
    { type: 'GSTR-4', description: 'Composition Scheme' },
    { type: 'GSTR-5', description: 'Non-Resident' },
    { type: 'GSTR-6', description: 'Input Service Distributor' },
    { type: 'GSTR-7', description: 'Tax Deductor' },
    { type: 'GSTR-8', description: 'E-commerce Operator' },
    { type: 'GSTR-9', description: 'Annual Return' },
    { type: 'GSTR-9A', description: 'Composition Annual Return' },
    { type: 'GSTR-10', description: 'Final Return' }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateCurrentDate();
    loadDashboardData();
    loadClients();
    setupEventListeners();
    populateDropdowns();
    
    // Set default date to today for new clients
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dueDate').min = today;
}

function populateDropdowns() {
    // Populate Indian states
    const stateSelect = document.getElementById('clientState');
    if (stateSelect) {
        indianStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state.code;
            option.textContent = `${state.name} (${state.code})`;
            stateSelect.appendChild(option);
        });
    }

    // Populate business categories
    const categorySelect = document.getElementById('businessCategory');
    if (categorySelect) {
        businessCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    // Populate GST return types
    const returnTypeSelect = document.getElementById('returnType');
    if (returnTypeSelect) {
        gstReturnTypes.forEach(returnType => {
            const option = document.createElement('option');
            option.value = returnType.type;
            option.textContent = `${returnType.type} - ${returnType.description}`;
            returnTypeSelect.appendChild(option);
        });
    }
}

function setupEventListeners() {
    // Language toggle
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);
    
    // Client form submission
    document.getElementById('clientForm').addEventListener('submit', handleClientSubmit);
    
    // Message template change
    document.getElementById('messageTemplate').addEventListener('change', updateMessageTemplate);
    
    // Search and filter
    document.getElementById('searchInput').addEventListener('input', filterClients);
    document.getElementById('statusFilter').addEventListener('change', filterClients);
}

function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    dateElement.textContent = today;
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ml' : 'en';
    document.getElementById('langText').textContent = currentLanguage === 'en' ? 'English' : 'മലയാളം';
    updateLanguage();
    refreshCurrentSection();
}

function updateLanguage() {
    // Update all elements with data-en and data-ml attributes
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (element.tagName === 'INPUT' && element.type === 'text') {
            element.placeholder = text;
        } else if (element.tagName === 'OPTION') {
            element.textContent = text;
        } else {
            element.textContent = text;
        }
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('main > section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.remove('hidden');
    
    // Update sidebar buttons
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('bg-green-50', 'text-green-700', 'font-medium');
        btn.classList.add('text-gray-700');
    });
    
    const activeBtn = document.getElementById(sectionName + 'Btn');
    activeBtn.classList.add('bg-green-50', 'text-green-700', 'font-medium');
    activeBtn.classList.remove('text-gray-700');
    
    // Load section-specific data
    if (sectionName === 'dashboard') {
        loadDashboardData();
    } else if (sectionName === 'followups') {
        loadFollowups();
    } else if (sectionName === 'clients') {
        loadClients();
    }
}

function refreshCurrentSection() {
    const activeSection = document.querySelector('main > section:not(.hidden)').id;
    showSection(activeSection);
}

async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard');
        const stats = await response.json();
        
        document.getElementById('totalClients').textContent = stats.total;
        document.getElementById('dueToday').textContent = stats.dueToday;
        document.getElementById('dueInThreeDays').textContent = stats.dueInThreeDays;
        document.getElementById('overdue').textContent = stats.overdue;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function loadClients() {
    try {
        const response = await fetch('/api/clients');
        clients = await response.json();
        renderClientsTable();
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

function renderClientsTable(filteredClients = null) {
    const tbody = document.getElementById('clientsTableBody');
    const clientsToRender = filteredClients || clients;
    
    if (clientsToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    ${translations[currentLanguage].noClients}
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = clientsToRender.map(client => {
        const statusColor = getStatusColor(client.status);
        const isOverdue = new Date(client.dueDate) < new Date() && client.status !== 'completed';
        const rowClass = isOverdue ? 'bg-red-50' : '';
        
        return `
            <tr class="${rowClass} hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${client.businessName || client.name}</div>
                    ${client.gstin ? `<div class="text-xs text-gray-500">GSTIN: ${client.gstin}</div>` : ''}
                    ${client.businessCategory ? `<div class="text-xs text-gray-500">${client.businessCategory}</div>` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${client.name}</div>
                    <div class="text-xs text-gray-500">${client.phone}</div>
                    ${client.email ? `<div class="text-xs text-gray-500">${client.email}</div>` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${client.serviceType}</div>
                    ${client.returnType ? `<div class="text-xs text-gray-500">${client.returnType}</div>` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formatDate(client.dueDate)}</div>
                    ${client.financialYear ? `<div class="text-xs text-gray-500">FY: ${client.financialYear}</div>` : ''}
                    ${isOverdue ? '<span class="text-xs text-red-600 font-medium">Overdue</span>' : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}">
                        ${translations[currentLanguage][client.status]}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="openMessageModal('${client.id}')" class="btn-action text-green-600 hover:text-green-900 mr-2">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                    <button onclick="updateClientStatus('${client.id}', 'completed')" class="btn-action text-blue-600 hover:text-blue-900 mr-2">
                        <i class="fas fa-check"></i>
                    </button>
                    <button onclick="editClient('${client.id}')" class="btn-action text-yellow-600 hover:text-yellow-900 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteClient('${client.id}')" class="btn-action text-red-600 hover:text-red-900">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function getStatusColor(status) {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'reminded': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function filterClients() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filtered = clients;
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(client => 
            client.name.toLowerCase().includes(searchTerm) ||
            client.phone.includes(searchTerm) ||
            client.serviceType.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(client => client.status === statusFilter);
    }
    
    renderClientsTable(filtered);
}

async function loadFollowups() {
    try {
        const response = await fetch('/api/followups');
        const followups = await response.json();
        renderFollowups(followups);
    } catch (error) {
        console.error('Error loading follow-ups:', error);
    }
}

function renderFollowups(followups) {
    const container = document.getElementById('followupsList');
    
    if (followups.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-md p-8 text-center">
                <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
                <p class="text-gray-600 text-lg">${translations[currentLanguage].noFollowups}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = followups.map(client => {
        const isOverdue = new Date(client.dueDate) < new Date();
        const urgencyColor = isOverdue ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50';
        const urgencyIcon = isOverdue ? 'fa-exclamation-triangle text-red-600' : 'fa-clock text-yellow-600';
        const urgencyText = isOverdue ? translations[currentLanguage].overdue : translations[currentLanguage].today;
        
        return `
            <div class="bg-white rounded-xl shadow-md p-6 border-l-4 ${urgencyColor}">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <i class="fas ${urgencyIcon} mr-2"></i>
                            <span class="text-sm font-medium text-gray-600">${urgencyText}</span>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">${client.name}</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div><i class="fas fa-phone mr-1"></i> ${client.phone}</div>
                            <div><i class="fas fa-calendar mr-1"></i> ${formatDate(client.dueDate)}</div>
                            <div><i class="fas fa-briefcase mr-1"></i> ${client.serviceType}</div>
                        </div>
                        ${client.notes ? `<p class="text-sm text-gray-500 mt-2">${client.notes}</p>` : ''}
                    </div>
                    <div class="flex flex-col gap-2 ml-4">
                        <button onclick="openMessageModal('${client.id}')" class="btn-action px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                            <i class="fab fa-whatsapp mr-2"></i>
                            ${translations[currentLanguage].sendReminder}
                        </button>
                        <button onclick="updateClientStatus('${client.id}', 'completed')" class="btn-action px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                            <i class="fas fa-check mr-2"></i>
                            ${translations[currentLanguage].markDone}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openAddClientModal() {
    currentClientId = null;
    document.getElementById('modalTitle').setAttribute('data-en', 'Add New Client');
    document.getElementById('modalTitle').setAttribute('data-ml', 'പുതിയ ക്ലയന്റ് ചേർക്കുക');
    updateLanguage();
    document.getElementById('clientForm').reset();
    document.getElementById('clientModal').classList.remove('hidden');
}

function editClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    currentClientId = clientId;
    document.getElementById('modalTitle').setAttribute('data-en', 'Edit GST Client');
    document.getElementById('modalTitle').setAttribute('data-ml', 'Edit GST Client');
    updateLanguage();
    
    document.getElementById('clientId').value = client.id;
    
    // Basic Information
    document.getElementById('businessName').value = client.businessName || '';
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientPhone').value = client.phone;
    document.getElementById('clientEmail').value = client.email || '';
    
    // GST Details
    document.getElementById('gstin').value = client.gstin || '';
    document.getElementById('clientState').value = client.state || '';
    document.getElementById('businessCategory').value = client.businessCategory || '';
    document.getElementById('annualTurnover').value = client.annualTurnover || '';
    document.getElementById('gstScheme').value = client.gstScheme || '';
    document.getElementById('returnType').value = client.returnType || '';
    
    // Service Details
    document.getElementById('serviceType').value = client.serviceType;
    document.getElementById('dueDate').value = client.dueDate;
    document.getElementById('financialYear').value = client.financialYear || '';
    document.getElementById('taxPeriod').value = client.taxPeriod || '';
    
    // Address
    document.getElementById('address1').value = client.address1 || '';
    document.getElementById('address2').value = client.address2 || '';
    document.getElementById('city').value = client.city || '';
    document.getElementById('pincode').value = client.pincode || '';
    document.getElementById('pan').value = client.pan || '';
    
    // Additional
    document.getElementById('clientNotes').value = client.notes || '';
    
    document.getElementById('clientModal').classList.remove('hidden');
}

function closeClientModal() {
    document.getElementById('clientModal').classList.add('hidden');
    document.getElementById('clientForm').reset();
    currentClientId = null;
}

async function handleClientSubmit(e) {
    e.preventDefault();
    
    const clientData = {
        // Basic Information
        businessName: document.getElementById('businessName')?.value || '',
        name: document.getElementById('clientName').value,
        phone: document.getElementById('clientPhone').value,
        email: document.getElementById('clientEmail')?.value || '',
        
        // GST Details
        gstin: document.getElementById('gstin')?.value || '',
        state: document.getElementById('clientState')?.value || '',
        stateName: document.getElementById('clientState')?.selectedOptions?.[0]?.textContent || '',
        businessCategory: document.getElementById('businessCategory')?.value || '',
        annualTurnover: document.getElementById('annualTurnover')?.value || '',
        gstScheme: document.getElementById('gstScheme')?.value || '',
        returnType: document.getElementById('returnType')?.value || '',
        
        // Service Details
        serviceType: document.getElementById('serviceType').value,
        dueDate: document.getElementById('dueDate').value,
        financialYear: document.getElementById('financialYear')?.value || '',
        taxPeriod: document.getElementById('taxPeriod')?.value || '',
        
        // Address
        address1: document.getElementById('address1')?.value || '',
        address2: document.getElementById('address2')?.value || '',
        city: document.getElementById('city')?.value || '',
        pincode: document.getElementById('pincode')?.value || '',
        pan: document.getElementById('pan')?.value || '',
        
        // Additional
        notes: document.getElementById('clientNotes').value,
        status: 'pending'
    };
    
    // Validate GSTIN format if provided
    if (clientData.gstin && !validateGSTIN(clientData.gstin)) {
        showNotification('Invalid GSTIN format', 'error');
        return;
    }
    
    // Validate PAN format if provided
    if (clientData.pan && !validatePAN(clientData.pan)) {
        showNotification('Invalid PAN format', 'error');
        return;
    }
    
    try {
        if (currentClientId) {
            // Update existing client
            const response = await fetch(`/api/clients/${currentClientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });
        } else {
            // Add new client
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });
        }
        
        closeClientModal();
        loadClients();
        loadDashboardData();
        showNotification(currentClientId ? 'Client updated successfully!' : 'Client added successfully!');
    } catch (error) {
        console.error('Error saving client:', error);
        showNotification('Error saving client', 'error');
    }
}

function validateGSTIN(gstin) {
    const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstinPattern.test(gstin.toUpperCase());
}

function validatePAN(pan) {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panPattern.test(pan.toUpperCase());
}

async function updateClientStatus(clientId, newStatus) {
    try {
        const response = await fetch(`/api/clients/${clientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        loadClients();
        loadDashboardData();
        loadFollowups();
        showNotification(`Status updated to ${newStatus}!`);
    } catch (error) {
        console.error('Error updating status:', error);
        showNotification('Error updating status', 'error');
    }
}

async function deleteClient(clientId) {
    if (!confirm('Are you sure you want to delete this client?')) return;
    
    try {
        const response = await fetch(`/api/clients/${clientId}`, {
            method: 'DELETE'
        });
        
        loadClients();
        loadDashboardData();
        showNotification('Client deleted successfully!');
    } catch (error) {
        console.error('Error deleting client:', error);
        showNotification('Error deleting client', 'error');
    }
}

function openMessageModal(clientId) {
    currentClientId = clientId;
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    document.getElementById('messageTemplate').value = 'default';
    updateMessageTemplate();
    document.getElementById('messageModal').classList.remove('hidden');
}

function closeMessageModal() {
    document.getElementById('messageModal').classList.add('hidden');
    currentClientId = null;
}

function updateMessageTemplate() {
    const template = document.getElementById('messageTemplate').value;
    const messageTextarea = document.getElementById('customMessage');
    const client = clients.find(c => c.id === currentClientId);
    
    if (!client) return;
    
    if (template === 'custom') {
        messageTextarea.value = '';
        messageTextarea.focus();
    } else {
        const templateData = messageTemplates[template];
        let message = templateData[currentLanguage]
            .replace('{name}', client.name)
            .replace('{date}', formatDate(client.dueDate));
        
        // Add tax period for GSTR templates
        if (template === 'gstr1' || template === 'gstr3b') {
            const period = client.taxPeriod || 'Monthly';
            const month = new Date(client.dueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            message = message.replace('{period}', `${month} (${period})`);
        }
        
        messageTextarea.value = message;
    }
}

function sendWhatsAppMessage() {
    const client = clients.find(c => c.id === currentClientId);
    if (!client) return;
    
    const message = document.getElementById('customMessage').value;
    
    // Format Indian phone number properly
    let phoneNumber = client.phone.replace(/\D/g, ''); // Remove non-digits
    
    // Handle Indian phone numbers (10 digits, optionally starting with 91)
    if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
        phoneNumber = phoneNumber.substring(2); // Remove 91 prefix
    }
    
    // Validate Indian mobile number (should be 10 digits and start with 6,7,8, or 9)
    if (phoneNumber.length !== 10 || !['6','7','8','9'].includes(phoneNumber[0])) {
        showNotification('Invalid Indian mobile number format', 'error');
        return;
    }
    
    // Create WhatsApp URL with Indian country code
    const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Update status to reminded
    updateClientStatus(currentClientId, 'reminded');
    
    // Close modal
    closeMessageModal();
    
    showNotification('WhatsApp message sent!');
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Business Tools Functions
function openInvoiceTracker() {
    const invoiceTrackerHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-800">Invoice Tracker</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <!-- Invoice Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600" id="totalInvoices">0</div>
                    <div class="text-sm text-gray-600">Total Invoices</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-green-600" id="paidInvoices">0</div>
                    <div class="text-sm text-gray-600">Paid</div>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-yellow-600" id="pendingInvoices">0</div>
                    <div class="text-sm text-gray-600">Pending</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-purple-600" id="totalRevenue">Rs. 0</div>
                    <div class="text-sm text-gray-600">Total Revenue</div>
                </div>
            </div>
            
            <!-- Add New Invoice Form -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 class="font-semibold text-gray-800 mb-3">Add New Invoice</h4>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <select id="invoiceClient" class="px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Client</option>
                    </select>
                    <input type="text" id="invoiceNumber" placeholder="Invoice Number" class="px-3 py-2 border border-gray-300 rounded-lg">
                    <input type="number" id="invoiceAmount" placeholder="Amount (Rs.)" class="px-3 py-2 border border-gray-300 rounded-lg">
                    <input type="date" id="invoiceDueDate" class="px-3 py-2 border border-gray-300 rounded-lg">
                    <button onclick="addInvoice()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i class="fas fa-plus mr-2"></i>Add Invoice
                    </button>
                </div>
            </div>
            
            <!-- Invoices Table -->
            <div class="bg-white rounded-lg border">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Invoice #</th>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Client</th>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Due Date</th>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="invoicesTableBody" class="divide-y">
                        <!-- Invoices will be populated here -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    showModal(invoiceTrackerHTML);
    loadInvoiceData();
    populateClientDropdown();
}

// Invoice data storage
let invoices = JSON.parse(localStorage.getItem('invoices') || '[]');

function loadInvoiceData() {
    updateInvoiceSummary();
    renderInvoicesTable();
}

function updateInvoiceSummary() {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
    const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    
    document.getElementById('totalInvoices').textContent = totalInvoices;
    document.getElementById('paidInvoices').textContent = paidInvoices;
    document.getElementById('pendingInvoices').textContent = pendingInvoices;
    document.getElementById('totalRevenue').textContent = `Rs. ${totalRevenue.toLocaleString()}`;
}

function populateClientDropdown() {
    const clientSelect = document.getElementById('invoiceClient');
    if (!clientSelect) return;
    
    clientSelect.innerHTML = '<option value="">Select Client</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.businessName || client.name;
        clientSelect.appendChild(option);
    });
}

function addInvoice() {
    const clientId = document.getElementById('invoiceClient').value;
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const amount = parseFloat(document.getElementById('invoiceAmount').value);
    const dueDate = document.getElementById('invoiceDueDate').value;
    
    if (!clientId || !invoiceNumber || !amount || !dueDate) {
        showNotification('Please fill all invoice fields', 'error');
        return;
    }
    
    const client = clients.find(c => c.id === clientId);
    const invoice = {
        id: Date.now().toString(),
        invoiceNumber,
        clientId,
        clientName: client.businessName || client.name,
        amount,
        dueDate,
        status: 'pending',
        createdDate: new Date().toISOString()
    };
    
    invoices.push(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    // Clear form
    document.getElementById('invoiceClient').value = '';
    document.getElementById('invoiceNumber').value = '';
    document.getElementById('invoiceAmount').value = '';
    document.getElementById('invoiceDueDate').value = '';
    
    loadInvoiceData();
    showNotification('Invoice added successfully!');
}

function renderInvoicesTable() {
    const tbody = document.getElementById('invoicesTableBody');
    if (!tbody) return;
    
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No invoices found</td></tr>';
        return;
    }
    
    tbody.innerHTML = invoices.map(invoice => {
        const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status === 'pending';
        const statusColor = invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                           isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
        
        return `
            <tr class="${isOverdue ? 'bg-red-50' : ''}">
                <td class="px-4 py-3 text-sm font-medium">${invoice.invoiceNumber}</td>
                <td class="px-4 py-3 text-sm">${invoice.clientName}</td>
                <td class="px-4 py-3 text-sm">Rs. ${invoice.amount.toLocaleString()}</td>
                <td class="px-4 py-3 text-sm">${formatDate(invoice.dueDate)}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor}">
                        ${invoice.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                    </span>
                </td>
                <td class="px-4 py-3 text-sm">
                    ${invoice.status === 'pending' ? 
                        `<button onclick="markInvoicePaid('${invoice.id}')" class="text-green-600 hover:text-green-800 mr-2">
                            <i class="fas fa-check"></i>
                        </button>` : ''}
                    <button onclick="deleteInvoice('${invoice.id}')" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function markInvoicePaid(invoiceId) {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
        invoice.status = 'paid';
        invoice.paidDate = new Date().toISOString();
        localStorage.setItem('invoices', JSON.stringify(invoices));
        loadInvoiceData();
        showNotification('Invoice marked as paid!');
    }
}

function deleteInvoice(invoiceId) {
    if (confirm('Are you sure you want to delete this invoice?')) {
        invoices = invoices.filter(inv => inv.id !== invoiceId);
        localStorage.setItem('invoices', JSON.stringify(invoices));
        loadInvoiceData();
        showNotification('Invoice deleted!');
    }
}

function openGSTCalculator() {
    const calculatorHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">GST Calculator</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Amount (Rs.)</label>
                    <input type="number" id="calcAmount" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter amount">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">GST Rate</label>
                    <select id="gstRate" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Calculation Type</label>
                    <select id="calcType" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="exclusive">Exclusive (Amount + GST)</option>
                        <option value="inclusive">Inclusive (Amount includes GST)</option>
                    </select>
                </div>
                <button onclick="calculateGST()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Calculate GST
                </button>
                <div id="calcResult" class="hidden p-4 bg-gray-50 rounded-lg">
                    <!-- Results will be shown here -->
                </div>
            </div>
        </div>
    `;
    
    showModal(calculatorHTML);
}

function calculateGST() {
    const amount = parseFloat(document.getElementById('calcAmount').value);
    const rate = parseFloat(document.getElementById('gstRate').value);
    const type = document.getElementById('calcType').value;
    
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    let gstAmount, totalAmount, baseAmount;
    
    if (type === 'exclusive') {
        baseAmount = amount;
        gstAmount = (baseAmount * rate) / 100;
        totalAmount = baseAmount + gstAmount;
    } else {
        totalAmount = amount;
        gstAmount = (totalAmount * rate) / (100 + rate);
        baseAmount = totalAmount - gstAmount;
    }
    
    const resultDiv = document.getElementById('calcResult');
    resultDiv.innerHTML = `
        <h4 class="font-semibold text-gray-800 mb-2">Calculation Results</h4>
        <div class="space-y-1 text-sm">
            <div class="flex justify-between">
                <span>Base Amount:</span>
                <span class="font-semibold">Rs. ${baseAmount.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span>GST Amount (${rate}%):</span>
                <span class="font-semibold">Rs. ${gstAmount.toFixed(2)}</span>
            </div>
            <div class="flex justify-between border-t pt-1">
                <span>Total Amount:</span>
                <span class="font-semibold text-green-600">Rs. ${totalAmount.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span>CGST (${rate/2}%):</span>
                <span class="font-semibold">Rs. ${(gstAmount/2).toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
                <span>SGST (${rate/2}%):</span>
                <span class="font-semibold">Rs. ${(gstAmount/2).toFixed(2)}</span>
            </div>
        </div>
    `;
    resultDiv.classList.remove('hidden');
}

function openPaymentReminders() {
    const paymentRemindersHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-800">Payment Reminders</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <!-- Payment Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-red-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-red-600" id="overduePayments">0</div>
                    <div class="text-sm text-gray-600">Overdue</div>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-yellow-600" id="dueToday">0</div>
                    <div class="text-sm text-gray-600">Due Today</div>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-blue-600" id="dueThisWeek">0</div>
                    <div class="text-sm text-gray-600">Due This Week</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                    <div class="text-2xl font-bold text-purple-600" id="totalPending">Rs. 0</div>
                    <div class="text-sm text-gray-600">Total Pending</div>
                </div>
            </div>
            
            <!-- Add New Reminder Form -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 class="font-semibold text-gray-800 mb-3">Add Payment Reminder</h4>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <select id="reminderClient" class="px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Client</option>
                    </select>
                    <input type="text" id="reminderTitle" placeholder="Reminder Title" class="px-3 py-2 border border-gray-300 rounded-lg">
                    <input type="number" id="reminderAmount" placeholder="Amount (Rs.)" class="px-3 py-2 border border-gray-300 rounded-lg">
                    <input type="date" id="reminderDate" class="px-3 py-2 border border-gray-300 rounded-lg">
                    <button onclick="addPaymentReminder()" class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                        <i class="fas fa-plus mr-2"></i>Add Reminder
                    </button>
                </div>
            </div>
            
            <!-- Reminders List -->
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h4 class="font-semibold text-gray-800">Active Reminders</h4>
                    <div class="flex gap-2">
                        <button onclick="filterReminders('all')" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">All</button>
                        <button onclick="filterReminders('overdue')" class="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">Overdue</button>
                        <button onclick="filterReminders('today')" class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm">Today</button>
                        <button onclick="filterReminders('week')" class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">This Week</button>
                    </div>
                </div>
                <div id="remindersList" class="space-y-3">
                    <!-- Reminders will be populated here -->
                </div>
            </div>
        </div>
    `;
    
    showModal(paymentRemindersHTML);
    loadPaymentReminders();
    populateReminderClientDropdown();
}

// Payment reminders data storage
let paymentReminders = JSON.parse(localStorage.getItem('paymentReminders') || '[]');

function loadPaymentReminders() {
    updatePaymentSummary();
    renderRemindersList();
}

function updatePaymentSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    const overdue = paymentReminders.filter(reminder => 
        new Date(reminder.dueDate) < today && reminder.status !== 'completed'
    );
    const dueToday = paymentReminders.filter(reminder => 
        new Date(reminder.dueDate).toDateString() === today.toDateString() && reminder.status !== 'completed'
    );
    const dueThisWeek = paymentReminders.filter(reminder => 
        new Date(reminder.dueDate) >= today && 
        new Date(reminder.dueDate) <= weekFromNow && 
        reminder.status !== 'completed'
    );
    const totalPending = paymentReminders
        .filter(reminder => reminder.status !== 'completed')
        .reduce((sum, reminder) => sum + (reminder.amount || 0), 0);
    
    document.getElementById('overduePayments').textContent = overdue.length;
    document.getElementById('dueToday').textContent = dueToday.length;
    document.getElementById('dueThisWeek').textContent = dueThisWeek.length;
    document.getElementById('totalPending').textContent = `Rs. ${totalPending.toLocaleString()}`;
}

function populateReminderClientDropdown() {
    const clientSelect = document.getElementById('reminderClient');
    if (!clientSelect) return;
    
    clientSelect.innerHTML = '<option value="">Select Client</option>';
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.businessName || client.name;
        clientSelect.appendChild(option);
    });
}

function addPaymentReminder() {
    const clientId = document.getElementById('reminderClient').value;
    const title = document.getElementById('reminderTitle').value;
    const amount = parseFloat(document.getElementById('reminderAmount').value) || 0;
    const dueDate = document.getElementById('reminderDate').value;
    
    if (!clientId || !title || !dueDate) {
        showNotification('Please fill all required reminder fields', 'error');
        return;
    }
    
    const client = clients.find(c => c.id === clientId);
    const reminder = {
        id: Date.now().toString(),
        clientId,
        clientName: client.businessName || client.name,
        title,
        amount,
        dueDate,
        status: 'pending',
        createdDate: new Date().toISOString(),
        notifications: []
    };
    
    paymentReminders.push(reminder);
    localStorage.setItem('paymentReminders', JSON.stringify(paymentReminders));
    
    // Clear form
    document.getElementById('reminderClient').value = '';
    document.getElementById('reminderTitle').value = '';
    document.getElementById('reminderAmount').value = '';
    document.getElementById('reminderDate').value = '';
    
    loadPaymentReminders();
    showNotification('Payment reminder added successfully!');
}

function renderRemindersList(filter = 'all') {
    const remindersList = document.getElementById('remindersList');
    if (!remindersList) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    let filteredReminders = paymentReminders.filter(r => r.status !== 'completed');
    
    if (filter === 'overdue') {
        filteredReminders = filteredReminders.filter(r => new Date(r.dueDate) < today);
    } else if (filter === 'today') {
        filteredReminders = filteredReminders.filter(r => new Date(r.dueDate).toDateString() === today.toDateString());
    } else if (filter === 'week') {
        filteredReminders = filteredReminders.filter(r => 
            new Date(r.dueDate) >= today && new Date(r.dueDate) <= weekFromNow
        );
    }
    
    if (filteredReminders.length === 0) {
        remindersList.innerHTML = '<div class="text-center py-8 text-gray-500">No reminders found</div>';
        return;
    }
    
    remindersList.innerHTML = filteredReminders.map(reminder => {
        const dueDate = new Date(reminder.dueDate);
        const isOverdue = dueDate < today;
        const isToday = dueDate.toDateString() === today.toDateString();
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        let urgencyColor = 'bg-gray-100 text-gray-800';
        let urgencyText = 'Upcoming';
        
        if (isOverdue) {
            urgencyColor = 'bg-red-100 text-red-800';
            urgencyText = `${Math.abs(daysLeft)} days overdue`;
        } else if (isToday) {
            urgencyColor = 'bg-yellow-100 text-yellow-800';
            urgencyText = 'Due today';
        } else if (daysLeft <= 3) {
            urgencyColor = 'bg-orange-100 text-orange-800';
            urgencyText = `${daysLeft} days left`;
        } else {
            urgencyText = `${daysLeft} days left`;
        }
        
        return `
            <div class="bg-white border rounded-lg p-4 ${isOverdue ? 'border-red-200 bg-red-50' : ''}">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <div class="flex items-center mb-2">
                            <h5 class="font-semibold text-gray-800">${reminder.title}</h5>
                            <span class="ml-2 px-2 py-1 rounded-full text-xs font-medium ${urgencyColor}">
                                ${urgencyText}
                            </span>
                        </div>
                        <div class="text-sm text-gray-600 mb-1">
                            <i class="fas fa-user mr-2"></i>${reminder.clientName}
                        </div>
                        <div class="text-sm text-gray-600 mb-1">
                            <i class="fas fa-calendar mr-2"></i>Due: ${formatDate(reminder.dueDate)}
                        </div>
                        ${reminder.amount ? `
                            <div class="text-sm text-gray-600">
                                <i class="fas fa-rupee-sign mr-2"></i>Amount: Rs. ${reminder.amount.toLocaleString()}
                            </div>
                        ` : ''}
                    </div>
                    <div class="flex gap-2">
                        <button onclick="sendReminderNotification('${reminder.id}')" class="text-green-600 hover:text-green-800" title="Send Reminder">
                            <i class="fas fa-bell"></i>
                        </button>
                        <button onclick="markReminderCompleted('${reminder.id}')" class="text-blue-600 hover:text-blue-800" title="Mark Complete">
                            <i class="fas fa-check"></i>
                        </button>
                        <button onclick="deleteReminder('${reminder.id}')" class="text-red-600 hover:text-red-800" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterReminders(filter) {
    renderRemindersList(filter);
}

function sendReminderNotification(reminderId) {
    const reminder = paymentReminders.find(r => r.id === reminderId);
    if (reminder) {
        const client = clients.find(c => c.id === reminder.clientId);
        if (client) {
            // Send WhatsApp notification
            let phoneNumber = client.phone.replace(/\D/g, '');
            if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
                phoneNumber = phoneNumber.substring(2);
            }
            
            if (phoneNumber.length === 10 && ['6','7','8','9'].includes(phoneNumber[0])) {
                const message = `Hi ${client.name}, this is a reminder from Kisgston Association: "${reminder.title}" is due on ${formatDate(reminder.dueDate)}${reminder.amount ? `. Amount: Rs. ${reminder.amount.toLocaleString()}` : ''}. Please complete the payment to avoid penalties.`;
                const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                
                // Track notification
                reminder.notifications.push({
                    date: new Date().toISOString(),
                    type: 'whatsapp'
                });
                localStorage.setItem('paymentReminders', JSON.stringify(paymentReminders));
                
                showNotification('Reminder sent via WhatsApp!');
            } else {
                showNotification('Invalid phone number for WhatsApp', 'error');
            }
        }
    }
}

function markReminderCompleted(reminderId) {
    const reminder = paymentReminders.find(r => r.id === reminderId);
    if (reminder) {
        reminder.status = 'completed';
        reminder.completedDate = new Date().toISOString();
        localStorage.setItem('paymentReminders', JSON.stringify(paymentReminders));
        loadPaymentReminders();
        showNotification('Reminder marked as completed!');
    }
}

function deleteReminder(reminderId) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        paymentReminders = paymentReminders.filter(r => r.id !== reminderId);
        localStorage.setItem('paymentReminders', JSON.stringify(paymentReminders));
        loadPaymentReminders();
        showNotification('Reminder deleted!');
    }
}

function openReportGenerator() {
    const reportGeneratorHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-5xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-800">Report Generator</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <!-- Report Type Selection -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button onclick="generateClientReport()" class="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition">
                    <i class="fas fa-users text-blue-600 text-2xl mb-2"></i>
                    <h4 class="font-semibold text-blue-800">Client Report</h4>
                    <p class="text-sm text-gray-600">Comprehensive client analysis</p>
                </button>
                <button onclick="generateFinancialReport()" class="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition">
                    <i class="fas fa-chart-line text-green-600 text-2xl mb-2"></i>
                    <h4 class="font-semibold text-green-800">Financial Report</h4>
                    <p class="text-sm text-gray-600">Revenue and payment insights</p>
                </button>
                <button onclick="generateComplianceReport()" class="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition">
                    <i class="fas fa-shield-alt text-purple-600 text-2xl mb-2"></i>
                    <h4 class="font-semibold text-purple-800">Compliance Report</h4>
                    <p class="text-sm text-gray-600">GST compliance status</p>
                </button>
            </div>
            
            <!-- Report Display Area -->
            <div id="reportContent" class="bg-gray-50 rounded-lg p-6">
                <div class="text-center text-gray-500">
                    <i class="fas fa-chart-bar text-4xl mb-4"></i>
                    <p>Select a report type to generate detailed analytics</p>
                </div>
            </div>
        </div>
    `;
    
    showModal(reportGeneratorHTML);
}

function generateClientReport() {
    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return;
    
    const totalClients = clients.length;
    const keralaClients = clients.filter(c => c.state === '32').length;
    const completedClients = clients.filter(c => c.status === 'completed').length;
    const pendingClients = clients.filter(c => c.status === 'pending').length;
    const remindedClients = clients.filter(c => c.status === 'reminded').length;
    
    // Business categories analysis
    const categoryStats = {};
    clients.forEach(client => {
        const category = client.businessCategory || 'Uncategorized';
        categoryStats[category] = (categoryStats[category] || 0) + 1;
    });
    
    const topCategories = Object.entries(categoryStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    reportContent.innerHTML = `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <h4 class="text-lg font-semibold text-gray-800">Client Analytics Report</h4>
                <button onclick="downloadReport('client')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <i class="fas fa-download mr-2"></i>Download Report
                </button>
            </div>
            
            <!-- Client Overview -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-600">${totalClients}</div>
                    <div class="text-sm text-gray-600">Total Clients</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">${keralaClients}</div>
                    <div class="text-sm text-gray-600">Kerala Clients</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">${completedClients}</div>
                    <div class="text-sm text-gray-600">Completed</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-yellow-600">${pendingClients}</div>
                    <div class="text-sm text-gray-600">Pending</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-purple-600">${remindedClients}</div>
                    <div class="text-sm text-gray-600">Reminded</div>
                </div>
            </div>
            
            <!-- Business Categories -->
            <div class="bg-white p-4 rounded-lg">
                <h5 class="font-semibold text-gray-800 mb-3">Top Business Categories</h5>
                <div class="space-y-2">
                    ${topCategories.map(([category, count]) => `
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">${category}</span>
                            <div class="flex items-center">
                                <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${(count/totalClients)*100}%"></div>
                                </div>
                                <span class="text-sm font-medium">${count}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Client Status Distribution -->
            <div class="bg-white p-4 rounded-lg">
                <h5 class="font-semibold text-gray-800 mb-3">Status Distribution</h5>
                <div class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Completed</span>
                        <span class="text-sm font-medium text-green-600">${((completedClients/totalClients)*100).toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Pending</span>
                        <span class="text-sm font-medium text-yellow-600">${((pendingClients/totalClients)*100).toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Reminded</span>
                        <span class="text-sm font-medium text-purple-600">${((remindedClients/totalClients)*100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateFinancialReport() {
    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return;
    
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const pendingRevenue = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPendingPayments = paymentReminders
        .filter(r => r.status !== 'completed')
        .reduce((sum, r) => sum + (r.amount || 0), 0);
    
    // Monthly revenue calculation
    const monthlyRevenue = {};
    paidInvoices.forEach(invoice => {
        const month = new Date(invoice.paidDate || invoice.createdDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + invoice.amount;
    });
    
    const recentMonths = Object.entries(monthlyRevenue).slice(-6);
    
    reportContent.innerHTML = `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <h4 class="text-lg font-semibold text-gray-800">Financial Analytics Report</h4>
                <button onclick="downloadReport('financial')" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <i class="fas fa-download mr-2"></i>Download Report
                </button>
            </div>
            
            <!-- Financial Overview -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">Rs. ${totalRevenue.toLocaleString()}</div>
                    <div class="text-sm text-gray-600">Total Revenue</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-yellow-600">Rs. ${pendingRevenue.toLocaleString()}</div>
                    <div class="text-sm text-gray-600">Pending Invoices</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-red-600">Rs. ${totalPendingPayments.toLocaleString()}</div>
                    <div class="text-sm text-gray-600">Pending Payments</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-600">${paidInvoices.length}</div>
                    <div class="text-sm text-gray-600">Paid Invoices</div>
                </div>
            </div>
            
            <!-- Monthly Revenue Trend -->
            <div class="bg-white p-4 rounded-lg">
                <h5 class="font-semibold text-gray-800 mb-3">Monthly Revenue Trend</h5>
                <div class="space-y-2">
                    ${recentMonths.length > 0 ? recentMonths.map(([month, revenue]) => `
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">${month}</span>
                            <div class="flex items-center">
                                <div class="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                    <div class="bg-green-600 h-2 rounded-full" style="width: ${(revenue/Math.max(...recentMonths.map(r => r[1])))*100}%"></div>
                                </div>
                                <span class="text-sm font-medium">Rs. ${revenue.toLocaleString()}</span>
                            </div>
                        </div>
                    `).join('') : '<p class="text-gray-500 text-center py-4">No revenue data available</p>'}
                </div>
            </div>
            
            <!-- Invoice Status -->
            <div class="bg-white p-4 rounded-lg">
                <h5 class="font-semibold text-gray-800 mb-3">Invoice Status</h5>
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                        <div class="text-xl font-bold text-green-600">${paidInvoices.length}</div>
                        <div class="text-sm text-gray-600">Paid Invoices</div>
                    </div>
                    <div class="text-center p-4 bg-yellow-50 rounded-lg">
                        <div class="text-xl font-bold text-yellow-600">${pendingInvoices.length}</div>
                        <div class="text-sm text-gray-600">Pending Invoices</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateComplianceReport() {
    const reportContent = document.getElementById('reportContent');
    if (!reportContent) return;
    
    const today = new Date();
    const overdueClients = clients.filter(client => 
        new Date(client.dueDate) < today && client.status !== 'completed'
    );
    const compliantClients = clients.filter(client => client.status === 'completed');
    const keralaClients = clients.filter(c => c.state === '32');
    const keralaOverdue = keralaClients.filter(client => 
        new Date(client.dueDate) < today && client.status !== 'completed'
    );
    
    // GST return type analysis
    const returnTypeStats = {};
    clients.forEach(client => {
        const returnType = client.returnType || 'Not Specified';
        returnTypeStats[returnType] = (returnTypeStats[returnType] || 0) + 1;
    });
    
    reportContent.innerHTML = `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <h4 class="text-lg font-semibold text-gray-800">GST Compliance Report</h4>
                <button onclick="downloadReport('compliance')" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    <i class="fas fa-download mr-2"></i>Download Report
                </button>
            </div>
            
            <!-- Compliance Overview -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-red-600">${overdueClients.length}</div>
                    <div class="text-sm text-gray-600">Overdue Clients</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">${compliantClients.length}</div>
                    <div class="text-sm text-gray-600">Compliant Clients</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-600">${keralaClients.length}</div>
                    <div class="text-sm text-gray-600">Kerala Clients</div>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-orange-600">${keralaOverdue.length}</div>
                    <div class="text-sm text-gray-600">Kerala Overdue</div>
                </div>
            </div>
            
            <!-- Compliance Rate -->
            <div class="bg-white p-4 rounded-lg">
                <h5 class="font-semibold text-gray-800 mb-3">Overall Compliance Rate</h5>
                <div class="flex items-center">
                    <div class="flex-1 bg-gray-200 rounded-full h-4 mr-4">
                        <div class="bg-green-600 h-4 rounded-full" style="width: ${clients.length > 0 ? (compliantClients.length/clients.length)*100 : 0}%"></div>
                    </div>
                    <span class="text-lg font-bold text-green-600">${clients.length > 0 ? ((compliantClients.length/clients.length)*100).toFixed(1) : 0}%</span>
                </div>
            </div>
            
            <!-- GST Return Types -->
            <div class="bg-white p-4 rounded-lg">
                <h5 class="font-semibold text-gray-800 mb-3">GST Return Types</h5>
                <div class="space-y-2">
                    ${Object.entries(returnTypeStats).map(([type, count]) => `
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">${type}</span>
                            <div class="flex items-center">
                                <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                    <div class="bg-purple-600 h-2 rounded-full" style="width: ${(count/clients.length)*100}%"></div>
                                </div>
                                <span class="text-sm font-medium">${count}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Action Items -->
            <div class="bg-yellow-50 p-4 rounded-lg">
                <h5 class="font-semibold text-yellow-800 mb-2">Required Actions</h5>
                <ul class="text-sm space-y-1">
                    ${overdueClients.length > 0 ? `<li>Follow up with ${overdueClients.length} overdue clients immediately</li>` : ''}
                    ${keralaOverdue.length > 0 ? `<li>Priority: ${keralaOverdue.length} Kerala clients need attention</li>` : ''}
                    <li>Review compliance processes for better efficiency</li>
                    <li>Schedule regular compliance checks</li>
                </ul>
            </div>
        </div>
    `;
}

function downloadReport(reportType) {
    showNotification(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report downloaded successfully!`);
    // In a real implementation, this would generate and download a PDF/Excel file
}

function openTaxCalendar() {
    showNotification('Tax Calendar - Feature coming soon!', 'success');
    // TODO: Implement tax calendar modal
}

function openRevenueTracker() {
    showNotification('Revenue Tracker - Feature coming soon!', 'success');
    // TODO: Implement revenue tracker modal
}

// Kerala GST Functions
function generateKeralaReport() {
    const keralaClients = clients.filter(client => client.state === '32');
    const totalClients = keralaClients.length;
    const completedClients = keralaClients.filter(c => c.status === 'completed').length;
    const pendingClients = keralaClients.filter(c => c.status === 'pending').length;
    const remindedClients = keralaClients.filter(c => c.status === 'reminded').length;
    
    const reportHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">Kerala GST Report</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">Summary for Kisgston Association - Kerala</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">${totalClients}</div>
                            <div class="text-sm text-gray-600">Total Clients</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">${completedClients}</div>
                            <div class="text-sm text-gray-600">Completed</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-600">${pendingClients}</div>
                            <div class="text-sm text-gray-600">Pending</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl font-bold text-purple-600">${remindedClients}</div>
                            <div class="text-sm text-gray-600">Reminded</div>
                        </div>
                    </div>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">Compliance Status</h4>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span>Compliance Rate:</span>
                            <span class="font-semibold">${totalClients > 0 ? ((completedClients / totalClients) * 100).toFixed(1) : 0}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Follow-up Required:</span>
                            <span class="font-semibold text-yellow-600">${pendingClients + remindedClients}</span>
                        </div>
                    </div>
                </div>
                <button onclick="downloadKeralaReport()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <i class="fas fa-download mr-2"></i> Download Report
                </button>
            </div>
        </div>
    `;
    
    showModal(reportHTML);
}

function checkKeralaCompliance() {
    const today = new Date();
    const keralaClients = clients.filter(client => client.state === '32');
    const overdueClients = keralaClients.filter(client => 
        new Date(client.dueDate) < today && client.status !== 'completed'
    );
    
    const complianceHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">Kerala GST Compliance Check</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div class="${overdueClients.length > 0 ? 'bg-red-50' : 'bg-green-50'} p-4 rounded-lg">
                    <h4 class="font-semibold ${overdueClients.length > 0 ? 'text-red-800' : 'text-green-800'} mb-2">
                        ${overdueClients.length > 0 ? 'Compliance Issues Found' : 'All Compliant!'}
                    </h4>
                    <p class="text-sm">
                        ${overdueClients.length > 0 ? 
                            `${overdueClients.length} clients have overdue GST filings in Kerala.` : 
                            'All Kerala clients are compliant with GST regulations.'}
                    </p>
                </div>
                ${overdueClients.length > 0 ? `
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-yellow-800 mb-2">Required Actions</h4>
                        <ul class="text-sm space-y-1">
                            <li>Follow up with ${overdueClients.length} overdue clients</li>
                            <li>File GST returns to avoid penalties</li>
                            <li>Update client compliance status</li>
                        </ul>
                    </div>
                ` : ''}
                <button onclick="closeModal()" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Close
                </button>
            </div>
        </div>
    `;
    
    showModal(complianceHTML);
}

function viewKeralaNotifications() {
    const notificationsHTML = `
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-800">Kerala GST Notifications</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            <div class="space-y-3">
                <div class="bg-blue-50 p-3 rounded-lg">
                    <div class="flex items-start">
                        <i class="fas fa-info-circle text-blue-600 mt-1 mr-3"></i>
                        <div>
                            <h4 class="font-semibold text-blue-800">GSTR-3B Due Date</h4>
                            <p class="text-sm text-gray-600">Due on 20th of this month for all Kerala clients</p>
                        </div>
                    </div>
                </div>
                <div class="bg-yellow-50 p-3 rounded-lg">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-3"></i>
                        <div>
                            <h4 class="font-semibold text-yellow-800">Kerala GST Amendment</h4>
                            <p class="text-sm text-gray-600">New composition scheme rates effective from next quarter</p>
                        </div>
                    </div>
                </div>
                <div class="bg-green-50 p-3 rounded-lg">
                    <div class="flex items-start">
                        <i class="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
                        <div>
                            <h4 class="font-semibold text-green-800">GST Portal Update</h4>
                            <p class="text-sm text-gray-600">Kerala GST portal maintenance scheduled this weekend</p>
                        </div>
                    </div>
                </div>
                <button onclick="closeModal()" class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    Close
                </button>
            </div>
        </div>
    `;
    
    showModal(notificationsHTML);
}

function downloadKeralaReport() {
    showNotification('Report downloaded successfully!');
    closeModal();
}

// Modal helper functions
function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden z-50 modal-backdrop flex items-center justify-center px-4';
    modal.id = 'dynamicModal';
    modal.innerHTML = content;
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('dynamicModal');
    if (modal) {
        modal.remove();
    }
}
