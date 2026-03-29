import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDuration(startedAt: Date, endedAt?: Date | null): string {
  if (!endedAt) return 'Running...'
  const ms = new Date(endedAt).getTime() - new Date(startedAt).getTime()
  return `${(ms / 1000).toFixed(2)}s`
}
export function formatRelativeTime(date: Date): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return format(new Date(date), 'MMM d, h:mm a')
  }
}
export function getNodeLabel(type: string): string {
  const labels: Record<string, string> = {
    textNode: 'Text Node',
    imageUploadNode: 'Upload Image',
    videoUploadNode: 'Upload Video',
    llmNode: 'Run LLM',
    cropImageNode: 'Crop Image',
    extractFrameNode: 'Extract Frame',
  }
  return labels[type] || type
}
