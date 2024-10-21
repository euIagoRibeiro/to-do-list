document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('input-new-task');
    const addTaskBtn = document.getElementById('btn-new-task');
    const taskList = document.getElementById('to-do-list');
    const filters = document.querySelectorAll('.content-buttons button');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all'; 
    let selectedTaskIndex = null; 

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = currentFilter) {
        taskList.innerHTML = ''; 
        let filteredTasks = tasks.filter(task =>
            filter === 'all' ||
            (filter === 'pending' && !task.completed) ||
            (filter === 'completed' && task.completed)
        );

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''} ${task.completed ? 'completed-task' : ''}`;
            li.innerHTML = `
        <div class='task-content'>
            <div class='task-itens'>
                <span class="custom-checkbox ${task.checked ? 'checked' : ''}"></span>
                <input type="checkbox" class="task-check" ${task.checked ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-actions" style="display: ${task.checked ? 'flex' : 'none'};">
                    <button class="done"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
</svg></button>
                    <button class="edit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg></button>
                    <button class="delete"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg></button>
            </div>
        </div>
            `;

            const checkbox = li.querySelector('.task-check');
            const customCheckbox = li.querySelector('.custom-checkbox');
            const taskActions = li.querySelector('.task-actions');
            const doneButton = li.querySelector('.done');

            customCheckbox.addEventListener('click', () => {
                if (selectedTaskIndex !== null) {
                    tasks[selectedTaskIndex].checked = false;
                }

                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));

                if (checkbox.checked) {
                    customCheckbox.classList.add('checked');
                    taskActions.style.display = 'flex'; 
                    selectedTaskIndex = index; 
                } else {
                    customCheckbox.classList.remove('checked');
                    taskActions.style.display = 'none'; 
                    selectedTaskIndex = null; 
                }

                tasks.forEach((task, i) => {
                    if (i !== index) {
                        task.checked = false;
                    }
                });

                saveTasks();
                renderTasks(currentFilter);
            });

            checkbox.addEventListener('change', () => {
                task.checked = checkbox.checked;
                saveTasks();
            });

            doneButton.addEventListener('click', () => {
                task.completed = true; 
                task.checked = false; 
                saveTasks();
                renderTasks(currentFilter);
            });

            li.querySelector('.edit').addEventListener('click', () => editTask(index));
            li.querySelector('.delete').addEventListener('click', () => removeTask(index));

            taskList.appendChild(li);
        });
    }

    function addTask() {
        const text = taskInput.value.trim();

        if (!text) {
            alert('É necessário preencher este campo para adicionar uma tarefa');
            return;
        }

        const taskExists = tasks.some(task => task.text.toLowerCase() === text.toLowerCase());
        if (taskExists) {
            alert('Essa task já existe');
            return;
        }

        tasks.push({ text, completed: false, checked: false });
        saveTasks();
        renderTasks(currentFilter);
        taskInput.value = ''; 
    }

    function editTask(index) {
        const newText = prompt('Editar tarefa:', tasks[index].text);
        if (newText) {
            tasks[index].text = newText;
            saveTasks();
            renderTasks(currentFilter);
        }
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(currentFilter);
    }

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filters.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            currentFilter = filter;
            renderTasks(currentFilter);
        });
    });

    renderTasks();
});
