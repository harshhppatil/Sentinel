import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/axios'

const CATEGORIES = [
  { value: '', label: 'All', color: '#9c9c9d' },
  { value: 'linux', label: 'Linux', color: '#ffc533' },
  { value: 'docker', label: 'Docker', color: '#57c1ff' },
  { value: 'kubernetes', label: 'Kubernetes', color: '#59d499' },
  { value: 'networking', label: 'Networking', color: '#ff6161' },
  { value: 'security', label: 'Security', color: '#a1131a' },
  { value: 'monitoring', label: 'Monitoring', color: '#9c9c9d' },
]
const DIFFICULTIES = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner', color: '#59d499' },
  { value: 'intermediate', label: 'Intermediate', color: '#ffc533' },
  { value: 'advanced', label: 'Advanced', color: '#ff6161' },
]

function SnippetModal({ snippet, onClose, onSave }) {
  const isEdit = !!snippet?._id
  const [form, setForm] = useState({
    title: snippet?.title || '', command: snippet?.command || '',
    description: snippet?.description || '', category: snippet?.category || 'linux',
    difficulty: snippet?.difficulty || 'intermediate', tags: snippet?.tags?.join(', ') || '',
  })
  const [saving, setSaving] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
      if (isEdit) await api.put(`/api/snippets/${snippet._id}`, payload)
      else await api.post('/api/snippets', payload)
      onSave()
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }
  return (
    <div className="sentinel-overlay" onClick={onClose}>
      <div className="sentinel-modal animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
          <h2 className="text-on-dark text-lg font-medium">{isEdit ? 'Edit Snippet' : 'Add Snippet'}</h2>
          <button onClick={onClose} className="text-mute hover:text-on-dark transition-colors p-1">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-mute uppercase tracking-wider">Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="sentinel-input" placeholder="e.g. Find large files" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-mute uppercase tracking-wider">Command</label>
            <textarea value={form.command} onChange={e => setForm({...form, command: e.target.value})} required className="sentinel-input font-mono resize-none h-20" placeholder="e.g. find / -type f -size +100M" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-mute uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="sentinel-input resize-none h-16" placeholder="What does this command do?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-mute uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="sentinel-select">
                {CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-mute uppercase tracking-wider">Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="sentinel-select">
                {DIFFICULTIES.filter(d => d.value).map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-mute uppercase tracking-wider">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="sentinel-input" placeholder="#networking, #optimization" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="sentinel-btn-tertiary">Cancel</button>
            <button type="submit" disabled={saving} className="sentinel-btn-primary disabled:opacity-50">{saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SnippetCard({ snippet, onCopy, copiedId, onEdit, onDelete }) {
  const cat = CATEGORIES.find(c => c.value === snippet.category)
  const diff = DIFFICULTIES.find(d => d.value === snippet.difficulty)
  return (
    <div className="sentinel-card p-0 overflow-hidden animate-fade-in group">
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="sentinel-dot" style={{ background: cat?.color }} />
            <span className="text-xs text-mute font-medium uppercase tracking-wider">{cat?.label}</span>
            {diff && <span className="sentinel-badge ml-auto" style={{ background: diff.color + '22', color: diff.color }}>{diff.label}</span>}
          </div>
          <h3 className="text-on-dark text-base font-medium leading-snug">{snippet.title}</h3>
        </div>
      </div>
      <div className="mx-5 mb-3 relative group/code">
        <div className="sentinel-code-block text-xs leading-relaxed text-accent-green overflow-x-auto whitespace-pre-wrap break-all">
          <span className="text-mute select-none mr-2">$</span>{snippet.command}
        </div>
        <button onClick={() => onCopy(snippet)} className={`absolute top-2 right-2 p-1.5 rounded-md transition-all duration-150 ${copiedId === snippet._id ? 'bg-accent-green-soft text-accent-green' : 'bg-surface-elevated text-mute hover:text-on-dark opacity-0 group-hover/code:opacity-100'}`} title="Copy">
          {copiedId === snippet._id ? '✓' : '⎘'}
        </button>
      </div>
      {snippet.description && <p className="mx-5 mb-3 text-sm text-body leading-relaxed">{snippet.description}</p>}
      {snippet.tags?.length > 0 && (
        <div className="mx-5 mb-3 flex flex-wrap gap-1.5">
          {snippet.tags.map(tag => <span key={tag} className="text-xs text-mute bg-surface-elevated px-2 py-0.5 rounded-full">{tag}</span>)}
        </div>
      )}
      <div className="px-5 py-3 border-t border-hairline flex items-center justify-between text-xs">
        <span className="text-mute">{snippet.usageCount} copies</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(snippet)} className="text-mute hover:text-on-dark p-1 transition-colors" title="Edit">✎</button>
          <button onClick={() => onDelete(snippet._id)} className="text-mute hover:text-accent-red p-1 transition-colors" title="Delete">🗑</button>
        </div>
      </div>
    </div>
  )
}

export default function KernelVault() {
  const [snippets, setSnippets] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [sort, setSort] = useState('newest')
  const [copiedId, setCopiedId] = useState(null)
  const [modalSnippet, setModalSnippet] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const fetchSnippets = useCallback(async () => {
    try {
      setError('')
      const params = {}
      if (search) params.search = search
      if (category) params.category = category
      if (difficulty) params.difficulty = difficulty
      if (sort) params.sort = sort
      const { data } = await api.get('/snippets', { params })
      setSnippets(data)
    } catch { setError('Could not load snippets. Is the API service running?'); setSnippets([]) }
    finally { setLoading(false) }
  }, [search, category, difficulty, sort])

  useEffect(() => {
    fetchSnippets()
    api.get('/api/snippets/stats').then(r => setStats(r.data)).catch(() => {})
  }, [fetchSnippets])

  const handleCopy = async (snippet) => {
    try {
      await navigator.clipboard.writeText(snippet.command)
      setCopiedId(snippet._id)
      setTimeout(() => setCopiedId(null), 2000)
      api.put(`/api/snippets/${snippet._id}/copy`).catch(() => {})
    } catch {}
  }
  const handleDelete = async (id) => { try { await api.delete(`/api/snippets/${id}`); fetchSnippets() } catch {} }
  const handleModalSave = () => { setShowModal(false); setModalSnippet(null); fetchSnippets() }

  return (
    <div className="min-h-screen bg-canvas pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-surface-card rounded-md flex items-center justify-center border border-hairline"><span className="text-lg">🔐</span></div>
              <h1 className="text-ink text-2xl md:text-3xl font-semibold tracking-tight">Kernel Vault</h1>
            </div>
            <p className="text-mute text-sm ml-11">Linux commands, Docker snippets, and network optimizations</p>
          </div>
          <button onClick={() => { setModalSnippet(null); setShowModal(true) }} className="sentinel-btn-primary flex-shrink-0">+ Add Snippet</button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in">
            {stats.byCategory?.slice(0, 4).map(item => (
              <div key={item.category} className="sentinel-metric py-3 px-4">
                <span className="text-xs text-mute uppercase tracking-wider">{item.category}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-on-dark">{item.count}</span>
                  <span className="text-xs text-mute">snippets</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 mb-6 animate-fade-in">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-mute">🔍</div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search snippets…" className="sentinel-search pl-11" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-on-dark transition-colors">✕</button>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => setCategory(c.value)} className={`sentinel-pill ${category === c.value ? 'sentinel-pill-active' : 'sentinel-pill-inactive'}`}>
                <span className="flex items-center gap-1.5">
                  {c.value && <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />}
                  {c.label}
                </span>
              </button>
            ))}
            <div className="w-px h-5 bg-hairline mx-1" />
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="sentinel-select text-xs h-7 py-0 px-2">
              {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} className="sentinel-select text-xs h-7 py-0 px-2">
              <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="popular">Most copied</option><option value="az">A → Z</option>
            </select>
          </div>
        </div>

        {error && <div className="px-4 py-3 rounded-lg bg-accent-red-soft border border-accent-red/20 mb-6 text-accent-red text-sm animate-fade-in">{error}</div>}

        {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="sentinel-card p-5 flex flex-col gap-3"><div className="sentinel-skeleton h-3 w-16 rounded" /><div className="sentinel-skeleton h-5 w-3/4 rounded" /><div className="sentinel-skeleton h-16 w-full rounded-md" /><div className="sentinel-skeleton h-3 w-full rounded" /></div>)}</div>}

        {!loading && !error && snippets.length === 0 && (
          <div className="sentinel-card py-16 text-center animate-fade-in">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-on-dark font-medium mb-1">No snippets found</p>
            <p className="text-mute text-sm">{search || category || difficulty ? 'Try adjusting your filters' : 'Add your first snippet to get started'}</p>
          </div>
        )}

        {!loading && snippets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snippets.map(s => <SnippetCard key={s._id} snippet={s} copiedId={copiedId} onCopy={handleCopy} onEdit={sn => { setModalSnippet(sn); setShowModal(true) }} onDelete={handleDelete} />)}
          </div>
        )}

        {!loading && snippets.length > 0 && <div className="text-center text-xs text-stone mt-8">{snippets.length} snippet{snippets.length !== 1 ? 's' : ''}</div>}
      </div>
      {showModal && <SnippetModal snippet={modalSnippet} onClose={() => { setShowModal(false); setModalSnippet(null) }} onSave={handleModalSave} />}
    </div>
  )
}