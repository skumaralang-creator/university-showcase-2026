// app.js - To-do app with localStorage
const STORAGE_KEY = 'todo.tasks.v1'

// Elements
const taskForm = document.getElementById('task-form')
const taskInput = document.getElementById('task-input')
const taskList = document.getElementById('task-list')
const taskCount = document.getElementById('task-count')
const filterButtons = document.querySelectorAll('.filter-buttons button')
const clearCompletedBtn = document.getElementById('clear-completed')
const themeToggle = document.getElementById('theme-toggle')

let tasks = loadTasks()
let filter = 'all'

render()

// Event listeners
taskForm.addEventListener('submit', e => {
  e.preventDefault()
  const text = taskInput.value.trim()
  if(!text) return
  addTask(text)
  taskInput.value = ''
})

taskList.addEventListener('click', e => {
  const id = e.target.closest('[data-id]')?.dataset?.id
  if(!id) return

  if(e.target.matches('.toggle')) toggleTask(id)
  if(e.target.matches('.delete')) deleteTask(id)
  if(e.target.matches('.edit')) startEdit(id)
})

taskList.addEventListener('keydown', e => {
  if(e.target.matches('.edit-input') && e.key === 'Enter') finishEdit(e.target)
  if(e.target.matches('.edit-input') && e.key === 'Escape') cancelEdit(e.target)
})

filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b=>b.classList.remove('active'))
  btn.classList.add('active')
  filter = btn.dataset.filter
  render()
}))

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed)
  saveTasks()
  render()
})

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark')
  themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false')
})

// CRUD
function addTask(text){
  const task = { id: Date.now().toString(), text, completed:false, createdAt: new Date().toISOString() }
  tasks.unshift(task)
  saveTasks()
  render()
}

function toggleTask(id){
  tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t)
  saveTasks()
  render()
}

function deleteTask(id){
  tasks = tasks.filter(t => t.id !== id)
  saveTasks()
  render()
}

function startEdit(id){
  const li = taskList.querySelector(`[data-id="${id}"]`)
  const textEl = li.querySelector('.text')
  const current = textEl.textContent
  li.classList.add('editing')
  const input = document.createElement('input')
  input.type = 'text'
  input.value = current
  input.className = 'edit-input'
  textEl.replaceWith(input)
  input.focus()
  input.setSelectionRange(current.length, current.length)
}

function finishEdit(input){
  const li = input.closest('li')
  const id = li.dataset.id
  const newText = input.value.trim()
  if(!newText){ // empty => delete
    deleteTask(id)
    return
  }
  tasks = tasks.map(t => t.id === id ? {...t, text: newText} : t)
  saveTasks()
  render()
}

function cancelEdit(input){
  render()
}

// Storage
function loadTasks(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }catch(e){
    console.error('Failed to load tasks', e)
    return []
  }
}

function saveTasks(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) }
  catch(e){ console.error('Failed to save tasks', e) }
}

// Render
function render(){
  taskList.innerHTML = ''
  const visible = tasks.filter(t => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed)
  if(visible.length === 0){
    const empty = document.createElement('li')
    empty.className = 'task-item'
    empty.textContent = 'No tasks — add one above.'
    taskList.appendChild(empty)
  } else {
    visible.forEach(t => taskList.appendChild(renderTask(t)))
  }

  const remaining = tasks.filter(t => !t.completed).length
  taskCount.textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'}`
}

function renderTask(t){
  const li = document.createElement('li')
  li.className = 'task-item' + (t.completed ? ' completed' : '')
  li.dataset.id = t.id

  const label = document.createElement('div')
  label.className = 'label'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'toggle'
  checkbox.checked = !!t.completed
  checkbox.setAttribute('aria-label', 'Mark task completed')

  const text = document.createElement('div')
  text.className = 'text'
  text.textContent = t.text

  label.appendChild(checkbox)
  label.appendChild(text)

  const actions = document.createElement('div')
  actions.className = 'task-actions'

  const editBtn = document.createElement('button')
  editBtn.className = 'edit'
  editBtn.type = 'button'
  editBtn.title = 'Edit'
  editBtn.textContent = 'Edit'

  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'delete'
  deleteBtn.type = 'button'
  deleteBtn.title = 'Delete'
  deleteBtn.textContent = 'Delete'

  actions.appendChild(editBtn)
  actions.appendChild(deleteBtn)

  li.appendChild(label)
  li.appendChild(actions)

  return li
}
