import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Task } from "../../shared/types";
import { api } from "./api";

type Filter = "All" | "Active" | "Completed";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const [items] = await Promise.all([api.listTasks(), api.health()]);
      setTasks(items);
      setConnected(true);
    } catch (error) {
      setConnected(false);
      setError(`Could not load tasks. Check that the backend is running. ${errorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function mutate(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      setConnected(true);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || busy) return;
    await mutate(async () => {
      const task = await api.createTask(title.trim());
      setTasks((current) => [task, ...current]);
      setTitle("");
    });
  }

  const completed = tasks.filter((task) => task.completed).length;
  const visibleTasks = tasks.filter((task) =>
    filter === "Active" ? !task.completed : filter === "Completed" ? task.completed : true,
  );
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Daybook home">
          <span className="brand-mark" aria-hidden="true">✓</span>
          daybook<span className="brand-dot">.</span>
        </a>
        <span className="header-note">A little structure. A clearer day.</span>
        <span className={`status ${connected ? "online" : ""}`} role="status">
          <span className="status-dot" />
          {loading ? "Connecting" : connected ? "API connected" : "API unavailable"}
        </span>
      </header>

      <main>
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">YOUR EVERYDAY WORKSPACE</p>
          <h1 id="page-title">Small steps.<br /><span>Good things ahead.</span></h1>
          <p className="intro-copy">Make room for what matters. Get your thoughts into a list,<br className="desktop-break" /> take one thing at a time, and enjoy the progress.</p>
        </section>

        <div className="workspace">
          <section className="task-panel panel" aria-labelledby="tasks-title">
            <div className="panel-heading">
              <div><p className="eyebrow">LET’S MAKE IT HAPPEN</p><h2 id="tasks-title">My tasks <span className="count">{tasks.length}</span></h2></div>
              <span className="small-label">One step at a time</span>
            </div>

            <form className="add-task" onSubmit={addTask}>
              <label className="sr-only" htmlFor="task-title">New task</label>
              <input id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What would you like to get done?" maxLength={120} required disabled={busy || loading} autoComplete="off" />
              <button className="primary-button" type="submit" disabled={busy || loading || !title.trim()}><span aria-hidden="true">+</span> Add task</button>
            </form>

            {error && <div className="error-message" role="alert">{error} <button onClick={() => void loadTasks()} disabled={loading || busy}>Retry loading</button></div>}

            <div className="filter-bar">
              <div className="filters" role="group" aria-label="Filter tasks">
                {(["All", "Active", "Completed"] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "selected" : ""} aria-pressed={filter === item}>{item}</button>)}
              </div>
              <span className="remaining">{tasks.length - completed} remaining</span>
            </div>

            <div aria-live="polite" aria-busy={loading || busy}>
              {loading ? <p className="empty-state">Loading your tasks…</p> : visibleTasks.length === 0 ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">✓</span><h3>{filter === "Completed" ? "Good things take a first step." : filter === "Active" && tasks.length ? "You’re all caught up." : "A fresh start awaits."}</h3><p>{filter === "Completed" ? "Completed tasks will appear here." : filter === "Active" && tasks.length ? "Take a moment to enjoy your progress." : "Add a task above to get your day moving."}</p></div> : (
                <ul className="task-list">
                  {visibleTasks.map((task) => (
                    <li key={task.id} className={task.completed ? "task completed" : "task"}>
                      <label className="task-label"><input type="checkbox" checked={task.completed} disabled={busy} onChange={() => void mutate(async () => { const updated = await api.updateTask(task.id, !task.completed); setTasks((current) => current.map((item) => item.id === task.id ? updated : item)); })} /><span>{task.title}</span></label>
                      <button className="delete-button" disabled={busy} aria-label={`Delete ${task.title}`} onClick={() => void mutate(async () => { await api.deleteTask(task.id); setTasks((current) => current.filter((item) => item.id !== task.id)); })}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6" /></svg></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="panel-footer"><span aria-hidden="true">↳</span> Your list is saved for this server session.</div>
          </section>

          <aside className="sidebar">
            <section className="progress-card" aria-labelledby="progress-title">
              <div className="progress-heading"><span className="eyebrow">A LITTLE MOMENTUM</span><span aria-hidden="true">↗</span></div>
              <h2 id="progress-title">Every step counts.</h2>
              <p>You’ve completed <strong>{completed} of {tasks.length}</strong> tasks.<br />Keep going. You’re building something.</p>
              <div className="progress-numbers"><span>Today’s progress</span><strong>{progress}%</strong></div>
              <progress value={completed} max={tasks.length || 1} aria-label="Tasks completed" />
            </section>

            <section className="stack-card panel" aria-labelledby="stack-title">
              <p className="eyebrow">SIMPLE BY DESIGN</p>
              <h2 id="stack-title">A small app.<br />A solid foundation.</h2>
              <p>A working frontend and backend,<br />ready for your next idea.</p>
              <dl className="stack-list"><div><dt><span className="tech-icon react-icon">R</span>React</dt><dd>The interface</dd></div><div><dt><span className="tech-icon ts-icon">TS</span>TypeScript</dt><dd>The confidence</dd></div><div><dt><span className="tech-icon bun-icon">B</span>Bun</dt><dd>The engine</dd></div></dl>
              <p className="readme-note">Make it yours → start with README.md</p>
            </section>
          </aside>
        </div>
        <footer className="site-footer"><span>Built to learn. Ready to grow.</span><span>React + TypeScript + Bun</span></footer>
      </main>
    </div>
  );
}
