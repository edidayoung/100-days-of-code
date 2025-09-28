document.addEventListener('DOMContentLoaded', () => {
  const taskInput =document.getElementById('task-input');
  const addTaskButton = document.getElementById('add-task');
  const taskList = document.getElementById('todo-list');
  const emptyImage = document.querySelector('.empty-image');
  const todosContainer = document.querySelector('.todos-container');
  const progressBar = document.getElementById('progress');
  const progressNumbers = getElementById('numbers');

  const toggleEmptyState = () => {
    emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
  }

  const updateProgress = (checkCompletion = true) => {
    const totalTasks = taskList.children.length;
    const completedTasks = taskList.querySelectorAll('.checkbox:checked').length

    progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
    progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;
  }
  
  const addTask = (text, completed = false, checkCompletion = true) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) {
      return;
    }

    const li = document.createElement('li');
    li.textContent = taskText;
    li.innerHTML = `
    <input type="checkbox" class="checkbox" 
    ${completed ? 'checked' : ''} />
    <span>${taskText}</span>
    <div class="todo-buttons">
      <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
      <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    </div>
    `;

    const checkbox = li.querySelector('.checkbox')
    const editBtn = li.querySelector('.edit-btn');

    if (completed) {
      li.classList.add('completed');
      editBtn.disabled = true;
      editBtn.style.opacity = '0.3';
      editBtn.style.pointerEvent = 'none';
    }

    checkbox.addEventListener('change', () => {
      const isChecked = checkbox.checked; 
      li.classList.toggle('completed', isChecked);
      editBtn.disabled = isChecked; 
      editBtn.style.opacity = isChecked ? '0.3' : '1';
      editBtn.style.pointerEvents = isChecked ? 'none' : 'auto'; 
      updateProgress();
    });

    editBtn.addEventListener('click', () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector('span').textContent;
        li.remove();
        toggleEmptyState();
        updateProgress(false);
      }
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
    })

    taskList.appendChild(li);
    taskInput.value = '';
    toggleEmptyState();
    updateProgress(checkCompletion);
    };

  console.log(addTaskButton.addEventListener('click', () => addTask));
  taskInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  })  

});