// DOM Elements
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const priorityInput = document.getElementById('priority-input');
const timeInput = document.getElementById('time-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const currentDateEl = document.getElementById('current-date');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const fileInput = document.getElementById('file-input');

// Modal Elements
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-form');
const editIdInput = document.getElementById('edit-id');
const editTaskInput = document.getElementById('edit-task');
const editPriorityInput = document.getElementById('edit-priority');
const editTimeInput = document.getElementById('edit-time');
const closeModalBtn = document.getElementById('close-modal');
const cancelEditBtn = document.getElementById('cancel-edit');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    renderTasks();
    updateProgress();

    // Filter Buttons Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');
            // Update filter state
            currentFilter = btn.dataset.filter;
            // Re-render
            renderTasks();
        });
    });
});

// Event Listeners
todoForm.addEventListener('submit', addTask);
editForm.addEventListener('submit', saveEdit);
closeModalBtn.addEventListener('click', closeEditModal);
cancelEditBtn.addEventListener('click', closeEditModal);
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
});

if (exportBtn) exportBtn.addEventListener('click', exportData);
if (importBtn) importBtn.addEventListener('click', () => fileInput.click());
if (fileInput) fileInput.addEventListener('change', importData);

// Functions

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (currentDateEl) currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateProgress();
}

function updateProgress() {
    if (!progressFill || !progressText) return;

    if (tasks.length === 0) {
        progressFill.style.width = '0%';
        progressText.textContent = '0% Done';
        return;
    }
    const completed = tasks.filter(t => t.completed).length;
    const percent = Math.round((completed / tasks.length) * 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${percent}% Done`;
}

function addTask(e) {
    e.preventDefault();

    const newTask = {
        id: Date.now().toString(),
        title: taskInput.value.trim(),
        priority: priorityInput.value,
        dueTime: timeInput.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    todoForm.reset();
    priorityInput.value = 'medium'; // Reset to default
}

function renderTasks() {
    if (!todoList) return;
    todoList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <button class="check-btn" onclick="toggleComplete('${task.id}')">
                    <i class="fa-solid fa-check"></i>
                </button>
                <div class="task-content">
                    <span class="task-text">${escapeHtml(task.title)}</span>
                    <div class="task-meta">
                        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                        ${task.dueTime ? `<span><i class="fa-regular fa-clock"></i> ${formatDate(task.dueTime)}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn reminder-btn" onclick="setReminder('${task.id}')" title="Send Reminder via Gmail">
                        <i class="fa-regular fa-bell"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="openEditModal('${task.id}')" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteTask('${task.id}')" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editIdInput.value = task.id;
        editTaskInput.value = task.title;
        editPriorityInput.value = task.priority;
        editTimeInput.value = task.dueTime;
        editModal.classList.add('active');
    }
}

function closeEditModal() {
    editModal.classList.remove('active');
}

function saveEdit(e) {
    e.preventDefault();
    const id = editIdInput.value;
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.title = editTaskInput.value.trim();
        task.priority = editPriorityInput.value;
        task.dueTime = editTimeInput.value;
        saveTasks();
        renderTasks();
        closeEditModal();
    }
}

function setReminder(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Create Gmail Compose Link
    const subject = encodeURIComponent(`Reminder: ${task.title}`);
    const body = encodeURIComponent(`Don't forget to complete this task!\n\nTask: ${task.title}\nPriority: ${task.priority}\nDue: ${task.dueTime ? new Date(task.dueTime).toLocaleString() : 'Not set'}`);

    // Opens Gmail compose window in a new tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;

    window.open(gmailUrl, '_blank');
}

function exportData() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const importedTasks = JSON.parse(event.target.result);
            if (Array.isArray(importedTasks)) {
                if (confirm('This will overwrite your current tasks. Continue?')) {
                    tasks = importedTasks;
                    saveTasks();
                    renderTasks();
                    alert('Data imported successfully!');
                }
            } else {
                alert('Invalid data file.');
            }
        } catch (error) {
            alert('Error reading file. Please make sure it is a valid JSON file.');
            console.error(error);
        }
        fileInput.value = ''; // Reset input
    };
    reader.readAsText(file);
}

// Utilities
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// Expose functions to global scope for HTML onclick handlers
window.toggleComplete = toggleComplete;
window.deleteTask = deleteTask;
window.openEditModal = openEditModal;
window.setReminder = setReminder;
