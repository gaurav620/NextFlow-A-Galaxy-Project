'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Loader2, Workflow } from 'lucide-react'

// Dynamically import the entire WorkflowCanvas component with SSR disabled
// to prevent ReactFlow (v11) from crashing during server-side rendering
// in Next.js 16 + React 19 environment
const WorkflowCanvas = dynamic(
  () => import('@/components/workflow-canvas'),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-gray-500 text-sm">Loading workflow editor...</p>
        </div>
      </div>
    ),
  }
)

export default function WorkflowEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const router = useRouter()

  return <WorkflowCanvas id={id} router={router} />
}
