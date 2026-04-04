'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react'

export default function WorkflowEditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Workflow Editor Error:', error)
  }, [error])

  return (
    <div className="h-full w-full flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-white text-lg font-semibold">Workflow failed to load</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Something went wrong while loading the workflow editor. This might be a temporary issue.
        </p>
        {error?.message && (
          <pre className="text-xs text-red-400/70 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 max-w-full overflow-auto">
            {error.message}
          </pre>
        )}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard/workflows')}
            className="flex items-center gap-2 text-sm text-gray-400 border border-white/10 rounded-full px-4 py-2 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 text-sm text-white bg-purple-600 rounded-full px-4 py-2 hover:bg-purple-500 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
