import { useState } from 'react'
import yaml from 'js-yaml'

const TEMPLATES = [
  {
    name: 'Deployment',
    icon: '🚀',
    yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: nginx:latest
          ports:
            - containerPort: 80
          resources:
            limits:
              memory: "128Mi"
              cpu: "250m"`,
  },
  {
    name: 'Service',
    icon: '🔗',
    yaml: `apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 80
      protocol: TCP`,
  },
  {
    name: 'ConfigMap',
    icon: '⚙️',
    yaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: production
  APP_PORT: "3000"
  LOG_LEVEL: info`,
  },
  {
    name: 'Ingress',
    icon: '🌐',
    yaml: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app-service
                port:
                  number: 80`,
  },
]

function TreeNode({ name, value, depth = 0 }) {
  const isObj = value && typeof value === 'object' && !Array.isArray(value)
  const isArr = Array.isArray(value)
  const indent = depth * 16

  if (isObj) {
    return (
      <div>
        <div style={{ paddingLeft: indent }} className="flex items-center gap-1.5 py-0.5">
          <span className="text-accent-yellow text-xs">▸</span>
          <span className="text-accent-blue text-sm font-medium">{name}</span>
        </div>
        {Object.entries(value).map(([k, v]) => (
          <TreeNode key={k} name={k} value={v} depth={depth + 1} />
        ))}
      </div>
    )
  }

  if (isArr) {
    return (
      <div>
        <div style={{ paddingLeft: indent }} className="flex items-center gap-1.5 py-0.5">
          <span className="text-accent-yellow text-xs">▸</span>
          <span className="text-accent-blue text-sm font-medium">{name}</span>
          <span className="text-stone text-xs">[{value.length}]</span>
        </div>
        {value.map((item, i) => (
          <TreeNode key={i} name={`[${i}]`} value={item} depth={depth + 1} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ paddingLeft: indent }} className="flex items-center gap-1.5 py-0.5">
      <span className="text-stone text-xs">─</span>
      <span className="text-mute text-sm">{name}:</span>
      <span className={`text-sm font-mono ${typeof value === 'number' ? 'text-accent-yellow' : typeof value === 'boolean' ? 'text-accent-green' : 'text-accent-green'}`}>
        {String(value)}
      </span>
    </div>
  )
}

export default function KubeCloud() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [validated, setValidated] = useState(false)

  const validate = () => {
    setValidated(true)
    try {
      const parsed = yaml.load(input)
      if (!parsed || typeof parsed !== 'object') {
        setError('YAML parsed but result is not an object/mapping.')
        setResult(null)
      } else {
        setResult(parsed)
        setError(null)
      }
    } catch (err) {
      setError(err.message)
      setResult(null)
    }
  }

  const loadTemplate = (tmpl) => {
    setInput(tmpl.yaml)
    setResult(null)
    setError(null)
    setValidated(false)
  }

  const lineCount = input ? input.split('\n').length : 0

  return (
    <div className="min-h-screen bg-canvas pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-surface-card rounded-md flex items-center justify-center border border-hairline"><span className="text-lg">☸️</span></div>
            <h1 className="text-ink text-2xl md:text-3xl font-semibold tracking-tight">Kube-Cloud</h1>
          </div>
          <p className="text-mute text-sm ml-11">YAML validator for Kubernetes manifests</p>
        </div>

        {/* Templates */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
          <span className="text-xs text-mute uppercase tracking-wider self-center mr-2">Templates:</span>
          {TEMPLATES.map(tmpl => (
            <button key={tmpl.name} onClick={() => loadTemplate(tmpl)}
              className="sentinel-btn-tertiary text-xs h-8 px-3">
              {tmpl.icon} {tmpl.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Input Panel */}
          <div className="sentinel-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-hairline bg-surface-elevated">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-red" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent-yellow" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent-green" />
                <span className="text-xs text-mute ml-3 font-mono">manifest.yaml</span>
              </div>
              <span className="text-xs text-stone">{lineCount} lines</span>
            </div>
            <div className="relative">
              {/* Line numbers */}
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-surface-elevated border-r border-hairline flex flex-col items-end pt-4 pr-2 overflow-hidden pointer-events-none">
                {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
                  <span key={i} className="text-xs text-stone leading-6 font-mono">{i + 1}</span>
                ))}
              </div>
              <textarea
                value={input}
                onChange={e => { setInput(e.target.value); setValidated(false) }}
                placeholder="Paste your Kubernetes YAML here…"
                className="w-full h-[420px] bg-transparent text-sm text-accent-green font-mono p-4 pl-14 leading-6 resize-none outline-none placeholder:text-stone"
                spellCheck={false}
              />
            </div>
            <div className="px-4 py-3 border-t border-hairline flex items-center gap-3">
              <button onClick={validate} disabled={!input.trim()} className="sentinel-btn-primary disabled:opacity-50">
                ✓ Validate YAML
              </button>
              <button onClick={() => { setInput(''); setResult(null); setError(null); setValidated(false) }} className="sentinel-btn-tertiary text-xs">
                Clear
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="sentinel-card overflow-hidden">
            <div className="flex items-center px-4 py-2.5 border-b border-hairline bg-surface-elevated">
              <span className="text-xs text-mute font-mono">Validation Result</span>
            </div>

            <div className="h-[420px] overflow-y-auto p-4">
              {!validated && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-5xl mb-4">☸️</div>
                  <p className="text-on-dark font-medium mb-1">Paste & Validate</p>
                  <p className="text-mute text-sm max-w-xs">Enter your Kubernetes YAML manifest and click Validate to check its structure</p>
                </div>
              )}

              {validated && error && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-accent-red-soft border border-accent-red/20 mb-4">
                    <span className="text-accent-red text-lg">✕</span>
                    <div>
                      <p className="text-accent-red text-sm font-medium">Invalid YAML</p>
                      <p className="text-accent-red/80 text-xs mt-0.5 font-mono">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {validated && result && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-accent-green-soft border border-accent-green/20 mb-4">
                    <span className="text-accent-green text-lg">✓</span>
                    <div>
                      <p className="text-accent-green text-sm font-medium">Valid YAML</p>
                      <p className="text-accent-green/80 text-xs mt-0.5">
                        {result.kind && `Kind: ${result.kind}`}
                        {result.apiVersion && ` · API: ${result.apiVersion}`}
                      </p>
                    </div>
                  </div>

                  {/* Parsed structure tree */}
                  <div className="mt-4">
                    <h4 className="text-xs text-mute uppercase tracking-wider mb-3">Parsed Structure</h4>
                    <div className="sentinel-code-block p-3 max-h-[300px] overflow-y-auto">
                      {Object.entries(result).map(([k, v]) => (
                        <TreeNode key={k} name={k} value={v} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-hairline flex items-center gap-2 text-xs text-stone">
              <span className="sentinel-keycap">js-yaml</span>
              <span>Pure client-side parsing — no data sent to server</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}