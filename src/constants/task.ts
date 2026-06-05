export type TaskStatus = 'pending' | 'in_progress' | 'submitted' | 'completed' | 'at_risk' | 'blocked'
export type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3'

export const STATUS_MAP: Record<TaskStatus, string> = {
  pending: '待开始',
  in_progress: '进行中',
  submitted: '已提报',
  completed: '已完成',
  at_risk: '有风险',
  blocked: '已阻塞',
}

export const STATUS_REVERSE_MAP = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, k]),
) as Record<string, TaskStatus>

export const STATUS_COLOR_MAP: Record<TaskStatus, string> = {
  pending: 'default',
  in_progress: 'processing',
  submitted: 'warning',
  completed: 'success',
  at_risk: 'error',
  blocked: 'error',
}

export const PRIORITY_COLOR_MAP: Record<TaskPriority, string> = {
  P0: 'red',
  P1: 'orange',
  P2: 'blue',
  P3: 'default',
}

export const URGEABLE_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'at_risk', 'blocked']
