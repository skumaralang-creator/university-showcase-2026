import dynamic from 'next/dynamic'
const Todo = dynamic(() => import('../ui/Todo'), { ssr: false })

export default function TodoPage(){
  return (
    <main className="container">
      <h1>To‑Do App</h1>
      <p>This React version supports drag & drop reordering, theme persistence, export/import and PWA offline support.</p>
      <Todo />
    </main>
  )
}
