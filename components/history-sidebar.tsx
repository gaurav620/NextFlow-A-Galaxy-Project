'use client'

import { useEffect, useState } from 'react'
import {
  History,
  RotateCcw,
  Brain,
  ChevronDown,
  ChevronRight,
  Clock,
  Type,
  Image as ImageIcon,
  Video,
  BrainCircuit,
  Scissors,
  Film,
} from 'lucide-react'
import { formatDistanceToNow, format, differenceInMilliseconds } from 'date-fns'
import { useWorkflowStore } from '@/store/workflowStore'

interface NodeRunEntry {
  id: string
  nodeId: string
  nodeType: string
  status: 'success' | 'failed' | 'running'
  startedAt: string
  endedAt?: string
  error?: string
  inputs?: Record<string, any> | null
  outputs?: Record<string, any> | null
}

interface WorkflowRunEntry {
  id: string
  status: 'success' | 'failed' | 'running' | 'partial'
  scope: 'full' | 'partial' | 'single'
  startedAt: string
  endedAt?: string
  nodeRuns: NodeRunEntry[]
}

interface HistorySidebarProps {
  className?: string
}

const NODE_META: Record<string, { label: string; color: string }> = {
  textNode:        { label: 'Text',          color: 'text-blue-400' },
  imageUploadNode: { label: 'Upload Image',  color: 'text-green-400' },
  videoUploadNode: { label: 'Upload Video',  color: 'text-orange-400' },
  llmNode:         { label: 'Run Any LLM',   color: 'text-purple-400' },
  cropImageNode:   { label: 'Crop Image',    color: 'text-pink-400' },
  extractFrameNode:{ label: 'Extract Frame', color: 'text-yellow-400' },
}

const getNodeLabel = (nodeType: string) =>
  NODE_META[nodeType]?.label ?? nodeType

const getNodeIcon = (nodeType: string) => {
  const meta = NODE_META[nodeType]
  const cls = `w-3 h-3 ${meta?.color ?? 'text-gray-400'}`
  switch (nodeType) {
    case 'textNode':        return <Type className={cls} />
    case 'imageUploadNode': return <ImageIcon className={cls} />
    case 'videoUploadNode': return <Video className={cls} />
    case 'llmNode':         return <BrainCircuit className={cls} />
    case 'cropImageNode':   return <Scissors className={cls} />
    case 'extractFrameNode':return <Film className={cls} />
    default:                return <Type className={cls} />
  }
}

const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInHours = differenceInMilliseconds(now, dateObj) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return formatDistanceToNow(dateObj, { addSuffix: true })
  }
  return format(dateObj, 'MMM dd, h:mm a')
}

const formatDuration = (startedAt: string, endedAt?: string): string => {
  if (!endedAt) return 'Running...'
  const start = new Date(startedAt)
  const end = new Date(endedAt)
  const durationMs = differenceInMilliseconds(end, start)
  const seconds = durationMs / 1000
  return `${seconds.toFixed(2)}s`
}

const getScopeLabel = (scope: string): string => {
  switch (scope) {
    case 'full':
      return 'Full Run'
    case 'partial':
      return 'Partial'
    case 'single':
      return 'Single Node'
    default:
      return scope
  }
}

export default function HistorySidebar({ className }: HistorySidebarProps) {
  const { currentWorkflowId: workflowId } = useWorkflowStore()
  const [runs, setRuns] = useState<WorkflowRunEntry[]>([])
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!workflowId) return

    const fetchRuns = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/workflow/${workflowId}/runs`)
        if (response.ok) {
          const data = await response.json()
          setRuns(data.runs || [])
        }
      } catch (error) {
        console.error('Failed to fetch workflow runs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRuns()

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchRuns, 5000)

    return () => clearInterval(interval)
  }, [workflowId])

  const handleManualRefresh = async () => {
    if (!workflowId) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/workflow/${workflowId}/runs`)
      if (response.ok) {
        const data = await response.json()
        setRuns(data.runs || [])
      }
    } catch (error) {
      console.error('Failed to fetch workflow runs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpanded = (runId: string) => {
    setExpandedRunId(expandedRunId === runId ? null : runId)
  }

  return (
    <div className={`h-full flex flex-col bg-gray-950 border-l border-gray-800 ${className || ''}`}>
      {/* Header */}
      <div className="sticky top-0 p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-200">Workflow History</span>
        </div>
        <button
          onClick={handleManualRefresh}
          className="p-1 hover:text-white text-gray-600 transition-colors"
          title="Refresh history"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && runs.length === 0 ? (
          // Loading State
          <div className="space-y-2 p-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 rounded-xl mx-3 h-16 animate-pulse"
              />
            ))}
          </div>
        ) : runs.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Brain className="w-10 h-10 text-gray-800 mb-3" />
            <p className="text-gray-500 font-medium">No runs yet</p>
            <p className="text-gray-600 text-xs mt-1">Run a workflow to see history</p>
          </div>
        ) : (
          // Run List
          <div className="space-y-1 p-2">
            {runs.map((run) => (
              <div key={run.id}>
                {/* Run Card */}
                <div
                  onClick={() => toggleExpanded(run.id)}
                  className="bg-gray-800/40 hover:bg-gray-800/70 rounded-xl p-3 cursor-pointer border border-transparent hover:border-gray-700 transition-all"
                >
                  {/* Row 1: Status, Badge, Chevron */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        run.status === 'running'
                          ? 'bg-yellow-400 animate-pulse'
                          : run.status === 'success'
                            ? 'bg-green-400'
                            : 'bg-red-400'
                      }`}
                    />
                    <span
                      className={`text-xs rounded-md px-1.5 py-0.5 ${
                        run.status === 'success'
                          ? 'bg-green-500/20 text-green-300'
                          : run.status === 'failed'
                            ? 'bg-red-500/20 text-red-300'
                            : run.status === 'running'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                    </span>
                    <div className="flex-1" />
                    {expandedRunId === run.id ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  {/* Row 2: Scope, Timestamp, Node count */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">
                        {getScopeLabel(run.scope)}
                      </span>
                      {run.nodeRuns.length > 0 && (
                        <span className="text-[10px] text-gray-700">
                          · {run.nodeRuns.filter(n => n.status === 'success').length}/{run.nodeRuns.length} nodes
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600">
                      {formatTime(run.startedAt)}
                    </span>
                  </div>

                  {/* Row 3: Duration */}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-xs text-gray-600">
                      {formatDuration(run.startedAt, run.endedAt)}
                    </span>
                  </div>
                </div>

                {/* Expanded Node Runs */}
                {expandedRunId === run.id && (
                  <div className="bg-gray-900/50 rounded-b-xl border-t border-gray-800 p-3 space-y-2">
                    {run.nodeRuns.map((nodeRun, index) => (
                      <div key={nodeRun.id}>
                        <div className="flex items-center gap-2 py-1.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              nodeRun.status === 'running'
                                ? 'bg-yellow-400 animate-pulse'
                                : nodeRun.status === 'success'
                                  ? 'bg-green-400'
                                  : 'bg-red-400'
                            }`}
                          />
                          {getNodeIcon(nodeRun.nodeType)}
                          <span className="text-xs text-gray-400 flex-1">
                            {getNodeLabel(nodeRun.nodeType)}
                          </span>
                          <span className="text-xs text-gray-600">
                            {formatDuration(nodeRun.startedAt, nodeRun.endedAt)}
                          </span>
                        </div>
                        {nodeRun.error && (
                          <div className="text-xs text-red-400 mt-0.5 pl-6">
                            {nodeRun.error}
                          </div>
                        )}
                        {/* Outputs */}
                        {nodeRun.outputs && nodeRun.status === 'success' && (() => {
                          const result = (nodeRun.outputs as any).result
                          if (!result) return null
                          const strVal = String(result)
                          const isImage = strVal.startsWith('data:image') || /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(strVal)
                          return (
                            <div className="pl-6 mt-1">
                              {isImage ? (
                                <img src={strVal} alt="output" className="w-full max-w-50 rounded-lg border border-gray-700 mt-1" />
                              ) : (
                                <div className="text-[10px] text-gray-400 leading-relaxed bg-gray-800/40 rounded-md px-2 py-1.5 wrap-break-word whitespace-pre-wrap">
                                  {strVal.length > 200 ? strVal.slice(0, 200) + '…' : strVal}
                                </div>
                              )}
                            </div>
                          )
                        })()}
                        {/* Inputs summary — show meaningful fields only */}
                        {nodeRun.inputs && (() => {
                          const skipKeys = new Set(['imageUrl', 'videoUrl', 'imageData'])
                          const entries = Object.entries(nodeRun.inputs).filter(([k, v]) => {
                            if (skipKeys.has(k)) return false
                            const s = String(v ?? '').trim()
                            return s.length > 0 && s !== 'undefined' && s !== 'null'
                          })
                          if (entries.length === 0) return null
                          return (
                            <div className="pl-6 mt-1">
                              <div className="text-[10px] text-gray-600 bg-gray-800/30 rounded-md px-2 py-1 wrap-break-word">
                                {entries.map(([k, v]) => {
                                  const s = String(v)
                                  return (
                                    <span key={k} className="block">
                                      <span className="text-gray-500">{k}: </span>
                                      {s.length > 60 ? s.slice(0, 60) + '…' : s}
                                    </span>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })()}
                        {index < run.nodeRuns.length - 1 && (
                          <div className="border-b border-gray-800/50" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
