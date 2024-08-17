document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.querySelector('.sidebar');
  const menuIcon = document.querySelector('#menu-icon');
  const closeIcon = document.querySelector('#close-icon');
  const plusIcon = document.querySelector('#plus-icon');
  const taskContainer = document.querySelector('#task-container');
  const taskModalElement = document.getElementById('taskModal');
  const taskModal = new bootstrap.Modal(taskModalElement);
  let editTaskCard = null; // Variable to keep track of the task card being edited

  menuIcon.addEventListener('click', function() {
      sidebar.classList.toggle('active');
  });

  closeIcon.addEventListener('click', function() {
      sidebar.classList.remove('active');
  });

  plusIcon.addEventListener('click', function() {
      taskModal.show();
  });

  document.getElementById('taskForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const listName = document.getElementById('listName').value;
      const tagColor = document.getElementById('tagColor').value;
      const fontStyle = document.getElementById('fontStyle').value;
      const date = document.getElementById('date').value;
      const category = document.getElementById('category').value;
      const tasks = document.getElementById('tasks').value.split('\n').filter(task => task.trim() !== ''); // Remove empty tasks

      const taskCard = editTaskCard || document.createElement('div');
      taskCard.classList.add('task-card');
      taskCard.style.backgroundColor = tagColor; // Apply tag color to background
      taskCard.innerHTML = `
          <div style="font-family: ${fontStyle}; color: black;">
              <h5>${listName}</h5>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Category:</strong> <span class="category-item category-${category.toLowerCase()}">${category}</span></p>
              <div class="task-content">
                  <ul>
                      ${tasks.map(task => `<li><input type="checkbox"> ${task}</li>`).join('')}
                  </ul>
              </div>
          </div>
      `;

      if (!editTaskCard) {
          taskCard.addEventListener('click', function() {
              this.classList.toggle('expanded');
          });

          taskCard.addEventListener('contextmenu', function(event) {
              event.preventDefault();
              showContextMenu(event, taskCard);
          });

          taskContainer.appendChild(taskCard);
      }

      taskModal.hide();
      document.getElementById('taskForm').reset();
      editTaskCard = null; // Reset the edit task card
  });

  function showContextMenu(event, taskCard) {
      const contextMenu = document.createElement('div');
      contextMenu.classList.add('context-menu');
      contextMenu.innerHTML = '<div class="context-menu-item">Edit</div>';
      document.body.appendChild(contextMenu);

      contextMenu.style.top = `${event.clientY}px`;
      contextMenu.style.left = `${event.clientX}px`;

      contextMenu.querySelector('.context-menu-item').addEventListener('click', function() {
          editTask(taskCard);
          document.body.removeChild(contextMenu);
      });

      document.addEventListener('click', function() {
          document.body.removeChild(contextMenu);
      }, { once: true });
  }

  function editTask(taskCard) {
      const listName = taskCard.querySelector('h5').innerText;
      const date = taskCard.querySelector('p strong:contains("Date:")').nextSibling.nodeValue.trim();
      const category = taskCard.querySelector('.category-item').innerText;
      const tasks = Array.from(taskCard.querySelectorAll('.task-content li')).map(li => li.innerText.trim());

      document.getElementById('listName').value = listName;
      document.getElementById('date').value = date;
      document.getElementById('category').value = category;
      document.getElementById('tasks').value = tasks.join('\n');

      const fontStyle = taskCard.querySelector('div').style.fontFamily;
      const tagColor = taskCard.style.backgroundColor;

      document.getElementById('fontStyle').value = fontStyle;
      document.getElementById('tagColor').value = tagColor;

      editTaskCard = taskCard;
      taskModal.show();
  }
});
