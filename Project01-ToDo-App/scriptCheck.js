document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskButton = document.getElementById('add-task');
  const taskList = document.getElementById('todo-list');
  const emptyImage = document.querySelector('.empty-image');
  const todosContainer = document.querySelector('.todos-container');
  const progressBar = document.getElementById('progress');
  const progressNumbers = document.getElementById('numbers');
  const progressHeading = document.querySelector('.details h3')

  const toggleEmptyState = () => {
    emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
  };

  const updateProgress = () => {
    const total = taskList.children.length;
    const completed = taskList.querySelectorAll('.completed').length;

    if (total === 0) {
      progressBar.style.width = '0%';
      progressNumbers.textContent = '0 / 0';
      progressHeading.textContent = 'Keep It Up!';
      return;
    }

    const percent = Math.round((completed / total) * 100);
    progressBar.style.width = percent + '%';
    progressNumbers.textContent = `${completed} / ${total}`; 
    
    if (completed === total) {
      progressHeading.textContent = "All Tasks Completed!"
      Celeberate();
    }

  };

  const addTask = (text, completed = false) => {
    // if first arg is a string use it, otherwise fall back to input value
    const taskText = (typeof text === 'string' && text.trim()) ? text.trim() : taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement('li');
    // create inner HTML (don't set textContent then innerHTML — that overwrote things before)
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
      <span>${taskText}</span>
      <div class="todo-buttons">
        <button class="edit-btn" type="button"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn" type="button"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector('.checkbox');
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    if (completed) {
      li.classList.add('completed');
      editBtn.disabled = true;
      editBtn.style.opacity = '0.2';
      editBtn.style.pointerEvents = 'none';
    }

    checkbox.addEventListener('change', () => {
      const isChecked = checkbox.checked;
      li.classList.toggle('completed', isChecked);
      editBtn.disabled = isChecked;         
      editBtn.style.opacity = isChecked ? '0.2' : '1';
      editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
      updateProgress();
    });

    editBtn.addEventListener('click', () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector('span').textContent;
        li.remove();
        toggleEmptyState();
      }
    });

    deleteBtn.addEventListener('click', () => {
      li.remove();
      toggleEmptyState();
      updateProgress();
    });

    taskList.appendChild(li);
    taskInput.value = '';
    toggleEmptyState();
    updateProgress();
  };

  // IMPORTANT: call addTask() without passing the event object, and prevent default form submit
  addTaskButton.addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
  });

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });

  toggleEmptyState();
});

const Celeberate = () => {
  const defaults = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  shapes: ["star"],
  colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
};

function shoot() {
  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    shapes: ["star"],
  });

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 0.75,
    shapes: ["circle"],
  });
}

setTimeout(shoot, 0);
setTimeout(shoot, 60);
setTimeout(shoot, 80);
}
