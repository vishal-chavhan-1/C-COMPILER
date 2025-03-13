// Initialize variables
let editor = null;
let programs = [];

const defaultProgram = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

// Functions
function openNewProgramModal(editProgram = null) {
    const programModal = document.getElementById('programModal');
    const programTitle = document.getElementById('programTitle');
    const programDescription = document.getElementById('programDescription');
    const saveProgram = document.getElementById('saveProgram');

    programModal.classList.remove('hidden');
    programModal.classList.add('flex');
    
    if (editProgram && typeof editProgram === 'object') {
        programTitle.value = editProgram.title || '';
        programDescription.value = editProgram.description || '';
        editor.setValue(editProgram.code || defaultProgram);
        saveProgram.dataset.editIndex = editProgram.index;
    } else {
        programTitle.value = '';
        programDescription.value = '';
        editor.setValue(defaultProgram);
        delete saveProgram.dataset.editIndex;
    }
    
    editor.clearSelection();
}

function closeProgramModal() {
    const programModal = document.getElementById('programModal');
    programModal.classList.add('hidden');
    programModal.classList.remove('flex');
}

async function saveProgramHandler() {
    const programTitle = document.getElementById('programTitle');
    const programDescription = document.getElementById('programDescription');
    const saveProgram = document.getElementById('saveProgram');

    const title = programTitle.value.trim();
    const description = programDescription.value.trim();
    const code = editor.getValue();

    if (!title) {
        alert('Please enter a program title');
        return;
    }

    if (!code) {
        alert('Please enter some code');
        return;
    }

    const programData = {
        title,
        description,
        code,
        timestamp: Date.now()
    };

    const editIndex = saveProgram.dataset.editIndex;
    if (editIndex !== undefined) {
        programs[editIndex] = programData;
    } else {
        programs.push(programData);
    }

    savePrograms();
    renderPrograms();
    closeProgramModal();
}

function loadPrograms() {
    const savedPrograms = localStorage.getItem('c-programs');
    if (savedPrograms) {
        try {
            programs = JSON.parse(savedPrograms);
            renderPrograms();
        } catch (error) {
            console.error('Error loading programs:', error);
            programs = [];
        }
    }
}

function savePrograms() {
    try {
        localStorage.setItem('c-programs', JSON.stringify(programs));
    } catch (error) {
        console.error('Error saving programs:', error);
    }
}

function deleteProgram(index) {
    if (confirm('Are you sure you want to delete this program?')) {
        programs.splice(index, 1);
        savePrograms();
        renderPrograms();
    }
}

async function compileProgram(code) {
    const compilationModal = document.getElementById('compilationModal');
    compilationModal.classList.remove('hidden');
    compilationModal.classList.add('flex');
    
    const compilationOutput = document.getElementById('compilationOutput');
    compilationOutput.innerHTML = 'Compiling...';
    compilationOutput.className = 'bg-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-auto';

    try {
        const result = await window.compiler.compile(code);
        compilationOutput.innerHTML = result.output.replace(/\n/g, '<br>');
        
        if (result.type === 'error') {
            compilationOutput.classList.add('text-red-600');
        } else {
            compilationOutput.classList.add('text-green-600');
        }
    } catch (error) {
        compilationOutput.innerHTML = `Error: ${error.message}`;
        compilationOutput.classList.add('text-red-600');
    }
}

function renderPrograms() {
    const programsContainer = document.getElementById('programsContainer');
    programsContainer.innerHTML = '';
    
    if (!programs || programs.length === 0) {
        programsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-code text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-500">No programs yet. Click "New Program" to add one!</p>
            </div>
        `;
        return;
    }

    programs.forEach((program, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
        card.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${escapeHtml(program.title)}</h3>
                        <p class="text-gray-600 mt-1">${escapeHtml(program.description) || 'No description'}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="openNewProgramModal({title: '${escapeHtml(program.title)}', description: '${escapeHtml(program.description)}', code: '${escapeHtml(program.code)}', index: ${index}})" 
                                class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteProgram(${index})" 
                                class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="bg-gray-100 rounded-lg p-4 mb-4 overflow-auto max-h-40">
                    <pre class="text-sm font-mono"><code>${escapeHtml(program.code)}</code></pre>
                </div>
                <button onclick="compileProgram('${escapeHtml(program.code)}')"
                        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 w-full flex items-center justify-center">
                    <i class="fas fa-play mr-2"></i>
                    Compile & Run
                </button>
            </div>
        `;
        programsContainer.appendChild(card);
    });
}

function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");
}

// Make functions globally accessible
window.openNewProgramModal = openNewProgramModal;
window.deleteProgram = deleteProgram;
window.compileProgram = compileProgram;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup Ace Editor
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/c_cpp");
    editor.setFontSize(14);
    editor.setShowPrintMargin(false);
    editor.setValue(defaultProgram);
    editor.clearSelection();

    // Add Event Listeners
    const newProgramBtn = document.getElementById('newProgramBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveProgram = document.getElementById('saveProgram');

    newProgramBtn.addEventListener('click', () => openNewProgramModal());
    closeModal.addEventListener('click', closeProgramModal);
    cancelBtn.addEventListener('click', closeProgramModal);
    saveProgram.addEventListener('click', saveProgramHandler);

    document.querySelectorAll('.closeCompilationModal').forEach(button => {
        button.addEventListener('click', () => {
            const compilationModal = document.getElementById('compilationModal');
            compilationModal.classList.add('hidden');
            compilationModal.classList.remove('flex');
        });
    });

    // Load saved programs
    loadPrograms();
});
