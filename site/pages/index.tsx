import Link from 'next/link'

export default function Home(){
  return (
    <main className="container">
      <h1>University Showcase — 2026</h1>
      <p>Demo site with a To‑Do app that you can show in your university presentation.</p>
      <ul>
        <li><Link href="/todo">Open To‑Do App (React + localStorage + PWA)</Link></li>
        <li><a href="/todo/index.html">Static fallback (original vanilla JS)</a></li>
      </ul>
    </main>
  )
}
