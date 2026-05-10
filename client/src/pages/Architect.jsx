import { useState, useEffect } from 'react'
import { architectApi } from '../api/axios'

const LANG_ICONS = { nodejs: '🟢', python: '🐍', go: '🔵', java: '☕' }

export default function Architect() {
  const [options, setOptions] = useState(null)
  const [form, setForm] = useState({ language: 'nodejs', database: 'mongodb', port: 3000, packageManager: 'npm', nodeVersion: '20', pythonVersion: '3.12', includeCompose: true })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('dockerfile')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    architectApi.get('/api/architect/options').then(r => setOptions(r.data)).catch(() => {})
  }, [])

  const handleGenerate = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await architectApi.post('/api/architect/generate', form)
      setResult(data)
      setActiveTab('dockerfile')
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed. Is the Architect service running?')
    } finally { setLoading(false) }
  }

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(''), 2000)
    } catch {}
  }

  const selectedLang = options?.languages?.find(l => l.value === form.language)

  return (
    <div className="min-h-screen bg-canvas pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-surface-card rounded-md flex items-center justify-center border border-hairline"><span className="text-lg">🏗️</span></div>
            <h1 className="text-ink text-2xl md:text-3xl font-semibold tracking-tight">The Architect</h1>
          </div>
          <p className="text-mute text-sm ml-11">Generate production-ready Dockerfiles and docker-compose configs via Spring Boot</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
          {/* Config Panel */}
          <div className="lg:col-span-2">
            <div className="sentinel-card p-5">
              <h2 className="text-on-dark font-medium text-sm mb-5 flex items-center gap-2">
                <span className="sentinel-dot bg-accent-red" /> Configuration
              </h2>

              {/* Language */}
              <div className="mb-4">
                <label className="text-xs text-mute uppercase tracking-wider block mb-2">Language</label>
                <div className="grid grid-cols-2 gap-2">
                  {(options?.languages || [{ value: 'nodejs', label: 'Node.js' }, { value: 'python', label: 'Python' }, { value: 'go', label: 'Go' }, { value: 'java', label: 'Java' }]).map(lang => (
                    <button key={lang.value} onClick={() => setForm({ ...form, language: lang.value })}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 border ${form.language === lang.value ? 'bg-surface-elevated border-hairline-strong text-on-dark' : 'bg-transparent border-hairline text-mute hover:text-on-dark hover:border-hairline-strong'}`}>
                      <span>{LANG_ICONS[lang.value] || '📦'}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Version */}
              {selectedLang?.versions && (
                <div className="mb-4">
                  <label className="text-xs text-mute uppercase tracking-wider block mb-2">Version</label>
                  <div className="flex gap-2">
                    {selectedLang.versions.map(v => (
                      <button key={v} onClick={() => setForm({...form, ...(form.language === 'nodejs' ? { nodeVersion: v } : { pythonVersion: v })})}
                        className={`sentinel-pill ${(form.language === 'nodejs' ? form.nodeVersion : form.pythonVersion) === v ? 'sentinel-pill-active' : 'sentinel-pill-inactive'}`}>
                        v{v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Package Manager (Node.js only) */}
              {form.language === 'nodejs' && (
                <div className="mb-4">
                  <label className="text-xs text-mute uppercase tracking-wider block mb-2">Package Manager</label>
                  <div className="flex gap-2">
                    {(options?.packageManagers || ['npm', 'yarn', 'pnpm']).map(pm => (
                      <button key={pm} onClick={() => setForm({...form, packageManager: pm})}
                        className={`sentinel-pill ${form.packageManager === pm ? 'sentinel-pill-active' : 'sentinel-pill-inactive'}`}>
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Database */}
              <div className="mb-4">
                <label className="text-xs text-mute uppercase tracking-wider block mb-2">Database</label>
                <select value={form.database} onChange={e => setForm({...form, database: e.target.value})} className="sentinel-select w-full">
                  {(options?.databases || [{ value: 'mongodb', label: 'MongoDB' }, { value: 'postgresql', label: 'PostgreSQL' }, { value: 'mysql', label: 'MySQL' }, { value: 'none', label: 'No Database' }]).map(db => (
                    <option key={db.value} value={db.value}>{db.label}</option>
                  ))}
                </select>
              </div>

              {/* Port */}
              <div className="mb-4">
                <label className="text-xs text-mute uppercase tracking-wider block mb-2">Port</label>
                <input type="number" value={form.port} onChange={e => setForm({...form, port: parseInt(e.target.value) || 3000})}
                  className="sentinel-input w-full font-mono" min={1024} max={65535} />
              </div>

              {/* Include Compose */}
              <div className="mb-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <button type="button" onClick={() => setForm({...form, includeCompose: !form.includeCompose})}
                    className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center ${form.includeCompose ? 'bg-accent-green justify-end' : 'bg-surface-elevated justify-start'}`}>
                    <span className="w-4 h-4 bg-white rounded-full mx-0.5 shadow-sm transition-all" />
                  </button>
                  <span className="text-sm text-body">Include docker-compose.yml</span>
                </label>
              </div>

              {/* Generate button */}
              <button onClick={handleGenerate} disabled={loading} className="sentinel-btn-primary w-full disabled:opacity-50">
                {loading ? '⏳ Generating…' : '⚡ Generate'}
              </button>

              {error && <div className="mt-4 px-3 py-2 rounded-md bg-accent-red-soft border border-accent-red/20 text-accent-red text-sm animate-fade-in">{error}</div>}
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-3">
            {!result && !loading && (
              <div className="sentinel-card py-24 text-center animate-fade-in">
                <div className="text-5xl mb-4">🐳</div>
                <p className="text-on-dark font-medium mb-1">Configure & Generate</p>
                <p className="text-mute text-sm">Choose your stack and hit Generate to create your Docker config</p>
              </div>
            )}

            {loading && (
              <div className="sentinel-card p-6 animate-fade-in">
                <div className="sentinel-skeleton h-4 w-32 rounded mb-4" />
                <div className="sentinel-skeleton h-64 w-full rounded-md" />
              </div>
            )}

            {result && (
              <div className="sentinel-card overflow-hidden animate-slide-up">
                {/* Tabs */}
                <div className="flex border-b border-hairline bg-surface-elevated">
                  <button onClick={() => setActiveTab('dockerfile')}
                    className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === 'dockerfile' ? 'text-on-dark border-b-2 border-primary' : 'text-mute hover:text-on-dark'}`}>
                    Dockerfile
                  </button>
                  {result.dockerCompose && (
                    <button onClick={() => setActiveTab('compose')}
                      className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === 'compose' ? 'text-on-dark border-b-2 border-primary' : 'text-mute hover:text-on-dark'}`}>
                      docker-compose.yml
                    </button>
                  )}
                </div>

                {/* Code output */}
                <div className="relative">
                  <pre className="p-5 font-mono text-xs leading-relaxed text-accent-green overflow-x-auto whitespace-pre max-h-[400px] overflow-y-auto">
                    {activeTab === 'dockerfile' ? result.dockerfile : result.dockerCompose}
                  </pre>
                  <button onClick={() => copyToClipboard(activeTab === 'dockerfile' ? result.dockerfile : result.dockerCompose, activeTab)}
                    className={`absolute top-3 right-3 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${copied === activeTab ? 'bg-accent-green-soft text-accent-green' : 'bg-surface-elevated text-mute hover:text-on-dark border border-hairline'}`}>
                    {copied === activeTab ? '✓ Copied' : '⎘ Copy'}
                  </button>
                </div>

                {/* Tips */}
                {result.tips?.length > 0 && (
                  <div className="border-t border-hairline p-5">
                    <h4 className="text-xs text-mute uppercase tracking-wider mb-3">💡 Tips</h4>
                    <div className="flex flex-col gap-2">
                      {result.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-body">
                          <span className="text-accent-green flex-shrink-0 mt-0.5">•</span>
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta */}
                <div className="border-t border-hairline px-5 py-3 flex items-center gap-4 text-xs text-stone">
                  <span>Language: <span className="text-mute">{result.language}</span></span>
                  <span>Database: <span className="text-mute">{result.database}</span></span>
                  <span>Port: <span className="text-mute font-mono">{result.port}</span></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}