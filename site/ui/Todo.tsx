import { useEffect, useRef, useState } from 'react'

type Task = { id: string; text: string; completed: boolean; createdAt: string }
const STORAGE_KEY = 'todo.tasks.v1'
const THEME_KEY = 'site.theme'

export default function Todo(){
  const [tasks, setTasks] = useState<Task[]>([])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<'all'|'active'|'completed'>('all')
  const dragIndex = useRef<number | null>(null)

  useEffect(()=>{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw) setTasks(JSON.parse(raw))
    // apply theme
    const theme = localStorage.getItem(THEME_KEY) || 'light'
    if(theme === 'dark') document.documentElement.classList.add('dark')
  }, [])

  useEffect(()=>{ localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) }, [tasks])

  function addTask(e?: any){
    if(e) e.preventDefault()
    const v = text.trim()
    if(!v) return
    const t: Task = { id: Date.now().toString(), text: v, completed:false, createdAt:new Date().toISOString() }
    setTasks(prev => [t, ...prev])
    setText('')
  }

  function toggle(id:string){ setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t)) }
  function remove(id:string){ setTasks(prev => prev.filter(t=>t.id!==id)) }

  function onDragStart(e: React.DragEvent, index:number){ dragIndex.current = index; e.dataTransfer.effectAllowed = 'move' }
  function onDragOver(e: React.DragEvent, index:number){ e.preventDefault(); e.dataTransfer.dropEffect = 'move' }
  function onDrop(e: React.DragEvent, index:number){
    e.preventDefault()
    const from = dragIndex.current
    if(from === null) return
    const copy = [...tasks]
    const [moved] = copy.splice(from,1)
    copy.splice(index,0,moved)
    setTasks(copy)
    dragIndex.current = null
  }

  function exportTasks(){
    const data = JSON.stringify(tasks, null, 2)
    const blob = new Blob([data], {type:'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'tasks.json'; a.click(); URL.revokeObjectURL(url)
  }

  function importTasks(file: File | null){
    if(!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try{
        const parsed = JSON.parse(String(reader.result))
        if(Array.isArray(parsed)) setTasks(parsed)
      }catch(e){ alert('Invalid file') }
    }
    reader.readAsText(file)
  }

  function clearCompleted(){ setTasks(prev => prev.filter(t=>!t.completed)) }

  function toggleTheme(){
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }

  const visible = tasks.filter(t => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed)

  return (
    <section className="todo">
      <div className="toolbar">
        <form onSubmit={addTask} className="add-form">
          <input aria-label="New task" value={text} onChange={e=>setText(e.target.value)} placeholder="Add a task and press Enter" />
          <button type="submit">Add</button>
        </form>
        <div className="tools">
          <button onClick={toggleTheme} aria-pressed={undefined}>Toggle theme</button>
          <button onClick={exportTasks}>Export</button>
          <label className="import">Import<input type="file" accept="application/json" onChange={e=>importTasks(e.target.files?.[0] ?? null)} /></label>
        </div>
      </div>

      <div className="filters">
        <button className={filter==='all' ? 'active' : ''} onClick={()=>setFilter('all')}>All</button>
        <button className={filter==='active' ? 'active' : ''} onClick={()=>setFilter('active')}>Active</button>
        <button className={filter==='completed' ? 'active' : ''} onClick={()=>setFilter('completed')}>Completed</button>
        <div className="spacer" />
        <button onClick={clearCompleted}>Clear completed</button>
      </div>

      <ul className="list" aria-live="polite">
        {visible.length === 0 && <li className="empty">No tasks</li>}
        {visible.map((t, i) => (
          <li key={t.id} draggable onDragStart={e=>onDragStart(e,i)} onDragOver={e=>onDragOver(e,i)} onDrop={e=>onDrop(e,i)} className={`item ${t.completed ? 'done' : ''}`}>
            <label>
              <input type="checkbox" checked={t.completed} onChange={()=>toggle(t.id)} />
              <span className="text">{t.text}</span>
            </label>
            <div className="actions">
              <button onClick={()=>remove(t.id)} className="danger">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <footer className="status">{tasks.filter(t=>!t.completed).length} tasks remaining</footer>
    </section>
  )
}
