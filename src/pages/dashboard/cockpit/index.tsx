import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components'
import {
  Card, Tag, Badge, Avatar, Button, Space, Input, Modal, Form, Select, DatePicker,
  message, Popconfirm, Tooltip, Progress, Timeline, Segmented, Empty, Spin, Tabs,
  Typography, Divider, Row, Col, Alert,
} from 'antd'
import {
  PlusOutlined, SearchOutlined, ReloadOutlined, AppstoreOutlined, TableOutlined,
  BarChartOutlined, DeleteOutlined, BellOutlined, UserOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  WarningOutlined, PlayCircleOutlined, PauseCircleOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  listTaskItems, getTaskItem, createTaskItem, updateTaskItem, deleteTaskItem,
  updateTaskProgress, getTaskStats, urgeTaskItem, listTaskOwners, listTaskCategories,
} from '@/services/task'
import {
  STATUS_MAP, STATUS_COLOR_MAP, PRIORITY_COLOR_MAP, URGEABLE_STATUSES,
  type TaskStatus, type TaskPriority,
} from '@/constants/task'

const { Text, Title } = Typography
const { TextArea } = Input
const { RangePicker } = DatePicker

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface TaskItem {
  id: string
  title: string
  code?: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  categoryId?: string
  categoryName?: string
  ownerIds?: string[]
  ownerNames?: string[]
  startDate?: string
  deadline?: string
  progress?: number
  latestProgress?: string
  authorized?: boolean
  progressHistory?: ProgressRecord[]
  createTime?: string
  updateTime?: string
}

interface ProgressRecord {
  id?: string
  content: string
  operator?: string
  createTime?: string
}

interface TaskStatsData {
  total?: number
  inProgress?: number
  completed?: number
  atRisk?: number
  blocked?: number
  overdue?: number
  p0Count?: number
}

interface OwnerOption {
  id: string
  name: string
}

interface CategoryOption {
  id: string
  name: string
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const VIEW_KANBAN = 'kanban'
const VIEW_TABLE = 'table'
const VIEW_GANTT = 'gantt'

const PRIORITY_STYLES: Record<TaskPriority, { color: string; bg: string; border: string }> = {
  P0: { color: '#cf1322', bg: '#fff1f0', border: '#ffa39e' },
  P1: { color: '#d46b08', bg: '#fff7e6', border: '#ffd591' },
  P2: { color: '#096dd9', bg: '#e6f7ff', border: '#91d5ff' },
  P3: { color: '#8c8c8c', bg: '#fafafa', border: '#d9d9d9' },
}

const GANTT_MODES = ['day', 'week', 'month'] as const
type GanttMode = typeof GANTT_MODES[number]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const isOverdue = (item: TaskItem) => {
  if (!item.deadline) return false
  return item.status !== 'completed' && dayjs(item.deadline).isBefore(dayjs(), 'day')
}

const getPriorityLabel = (p: TaskPriority) => p

const statusIcon = (s: TaskStatus) => {
  const map: Record<TaskStatus, React.ReactNode> = {
    pending: <PauseCircleOutlined />, in_progress: <PlayCircleOutlined />,
    submitted: <ClockCircleOutlined />, completed: <CheckCircleOutlined />,
    at_risk: <WarningOutlined />, blocked: <CloseCircleOutlined />,
  }
  return map[s] || null
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Stat Card */
const StatCard: React.FC<{
  title: string; value: number; icon: React.ReactNode; color: string; bgColor: string
}> = ({ title, value, icon, color, bgColor }) => (
  <Card size="small" style={{ borderTop: `3px solid ${color}` }} bodyStyle={{ padding: '12px 16px' }}>
    <div className="flex items-center justify-between">
      <div>
        <Text type="secondary" style={{ fontSize: 13 }}>{title}</Text>
        <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.3 }}>{value}</div>
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color }}>
        {icon}
      </div>
    </div>
  </Card>
)

/** Kanban Card */
const KanbanCardComp: React.FC<{
  item: TaskItem; onUpdate: (item: TaskItem) => void; onDelete: (id: string) => void; onUrge: (id: string) => void
}> = ({ item, onUpdate, onDelete, onUrge }) => {
  const pStyle = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.P3
  const overdue = isOverdue(item)
  return (
    <Card
      size="small"
      hoverable
      className="mb-3"
      style={{ borderLeft: `4px solid ${pStyle.color}`, borderRadius: 6, cursor: 'pointer' }}
      bodyStyle={{ padding: '10px 12px' }}
      onClick={() => onUpdate(item)}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            {item.code && <Tag style={{ margin: 0, fontSize: 11, lineHeight: '18px' }}>{item.code}</Tag>}
            <Text strong ellipsis style={{ flex: 1, fontSize: 14 }}>{item.title}</Text>
          </div>
          {item.description && (
            <Text type="secondary" ellipsis style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
              {item.description}
            </Text>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        <Tag color={STATUS_COLOR_MAP[item.status]} style={{ margin: 0, fontSize: 11 }}>{STATUS_MAP[item.status]}</Tag>
        <Tag color={pStyle.color} style={{ margin: 0, fontSize: 11 }}>{item.priority}</Tag>
        {item.categoryName && <Tag style={{ margin: 0, fontSize: 11 }}>{item.categoryName}</Tag>}
        {overdue && <Tag color="red" style={{ margin: 0, fontSize: 11 }}>已逾期</Tag>}
      </div>
      <div className="flex items-center justify-between">
        <Space size={4}>
          {(item.ownerNames || []).slice(0, 3).map((name, i) => (
            <Tooltip key={i} title={name}>
              <Avatar size={22} style={{ fontSize: 11, background: '#1890ff' }}>
                {name?.slice(-1)}
              </Avatar>
            </Tooltip>
          ))}
          {(item.ownerNames || []).length > 3 && (
            <Avatar size={22} style={{ fontSize: 11, background: '#d9d9d9', color: '#666' }}>
              +{item.ownerNames!.length - 3}
            </Avatar>
          )}
        </Space>
        <Space size={0}>
          {item.deadline && (
            <Text type={overdue ? 'danger' : 'secondary'} style={{ fontSize: 11 }}>
              {dayjs(item.deadline).format('MM-DD')}
            </Text>
          )}
          {URGEABLE_STATUSES.includes(item.status) && (
            <Tooltip title="催办">
              <Button type="text" size="small" icon={<BellOutlined />} onClick={(e) => { e.stopPropagation(); onUrge(item.id) }} />
            </Tooltip>
          )}
          <Popconfirm title="确认删除？" onConfirm={(e) => { e?.stopPropagation(); onDelete(item.id) }} onCancel={(e) => e?.stopPropagation()}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
          </Popconfirm>
        </Space>
      </div>
    </Card>
  )
}

/** Kanban View */
const KanbanView: React.FC<{
  items: TaskItem[]; onUpdate: (item: TaskItem) => void; onDelete: (id: string) => void; onUrge: (id: string) => void
}> = ({ items, onUpdate, onDelete, onUrge }) => {
  const grouped = useMemo(() => {
    const groups: Record<string, TaskItem[]> = {}
    const statusOrder: TaskStatus[] = ['in_progress', 'pending', 'submitted', 'at_risk', 'blocked', 'completed']
    statusOrder.forEach((s) => { groups[s] = [] })
    items.forEach((item) => {
      const key = item.status || 'pending'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })
    return statusOrder.filter((s) => groups[s]?.length).map((s) => ({ status: s, items: groups[s] }))
  }, [items])

  if (!items.length) return <Empty description="暂无任务" style={{ padding: 60 }} />

  return (
    <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
      {grouped.map((group) => (
        <div key={group.status} style={{ minWidth: 280, flex: '1 1 0', maxWidth: 360 }}>
          <div className="flex items-center justify-between mb-3 px-1">
            <Space size={6}>
              {statusIcon(group.status)}
              <Text strong>{STATUS_MAP[group.status]}</Text>
              <Badge count={group.items.length} style={{ backgroundColor: '#d9d9d9' }} />
            </Space>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 360px)' }}>
            {group.items.map((item) => (
              <KanbanCardComp key={item.id} item={item} onUpdate={onUpdate} onDelete={onDelete} onUrge={onUrge} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Table View */
const TableView: React.FC<{
  actionRef: React.RefObject<ActionType | undefined>
  onEdit: (item: TaskItem) => void
  onDelete: (id: string) => void
  onUrge: (id: string) => void
  categories: CategoryOption[]
}> = ({ actionRef, onEdit, onDelete, onUrge, categories }) => {
  const columns: ProColumns<TaskItem>[] = [
    { title: '编号', dataIndex: 'code', width: 100, ellipsis: true, search: false },
    { title: '标题', dataIndex: 'title', ellipsis: true, search: false },
    {
      title: '状态', dataIndex: 'status', width: 100, search: false,
      render: (_, r) => <Tag color={STATUS_COLOR_MAP[r.status]}>{STATUS_MAP[r.status]}</Tag>,
      filters: Object.entries(STATUS_MAP).map(([k, v]) => ({ text: v, value: k })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '重要程度', dataIndex: 'priority', width: 90, search: false,
      render: (_, r) => <Tag color={PRIORITY_COLOR_MAP[r.priority]}>{r.priority}</Tag>,
      sorter: (a, b) => ['P0', 'P1', 'P2', 'P3'].indexOf(a.priority) - ['P0', 'P1', 'P2', 'P3'].indexOf(b.priority),
    },
    {
      title: '分类', dataIndex: 'categoryName', width: 100, search: false,
      filters: categories.map((c) => ({ text: c.name, value: c.id })),
      onFilter: (value, record) => record.categoryId === value,
    },
    {
      title: '负责人', dataIndex: 'ownerNames', width: 120, search: false,
      render: (_, r) => (r.ownerNames || []).join('、') || '-',
    },
    {
      title: '截止日期', dataIndex: 'deadline', width: 110, search: false,
      render: (_, r) => {
        if (!r.deadline) return '-'
        const od = isOverdue(r)
        return <Text type={od ? 'danger' : undefined}>{dayjs(r.deadline).format('YYYY-MM-DD')}</Text>
      },
      sorter: (a, b) => dayjs(a.deadline || 0).valueOf() - dayjs(b.deadline || 0).valueOf(),
    },
    {
      title: '主要内容', dataIndex: 'description', width: 180, ellipsis: true, search: false,
    },
    {
      title: '最新进展', dataIndex: 'latestProgress', width: 180, ellipsis: true, search: false,
    },
    {
      title: '操作', valueType: 'option', width: 200, fixed: 'right', search: false,
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => onEdit(record)}>详情</Button>
          {URGEABLE_STATUSES.includes(record.status) && (
            <Button type="link" size="small" onClick={() => onUrge(record.id)}>催办</Button>
          )}
          <Popconfirm title="确认删除？" onConfirm={() => onDelete(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <ProTable<TaskItem>
      headerTitle={null}
      actionRef={actionRef as any}
      rowKey="id"
      columns={columns}
      request={async (params) => {
        const { current, pageSize, ...rest } = params
        const res = await listTaskItems({ page: current, size: pageSize, ...rest })
        return { data: res.data?.list || res.data || [], total: res.data?.total || 0, success: true }
      }}
      pagination={{ defaultPageSize: 10, showSizeChanger: true }}
      search={false}
      scroll={{ x: 1200 }}
      size="small"
    />
  )
}

/** Gantt View */
const GanttView: React.FC<{
  items: TaskItem[]; onUpdate: (item: TaskItem) => void
}> = ({ items, onUpdate }) => {
  const [mode, setMode] = useState<GanttMode>('week')

  const { rangeStart, rangeEnd, columns } = useMemo(() => {
    if (!items.length) return { rangeStart: dayjs(), rangeEnd: dayjs(), columns: [] as dayjs.Dayjs[] }
    const dates = items.flatMap((i) => [i.startDate, i.deadline]).filter(Boolean).map((d) => dayjs(d))
    const minDate = dates.length ? dayjs.min(dates)!.subtract(3, 'day') : dayjs().subtract(1, 'month')
    const maxDate = dates.length ? dayjs.max(dates)!.add(3, 'day') : dayjs().add(1, 'month')

    const cols: dayjs.Dayjs[] = []
    let cursor = minDate.startOf('day')
    const step = mode === 'day' ? 1 : mode === 'week' ? 7 : 30
    const unit = mode === 'day' ? 'day' : 'day'
    while (cursor.isBefore(maxDate)) {
      cols.push(cursor)
      cursor = cursor.add(step, unit)
    }
    return { rangeStart: minDate, rangeEnd: maxDate, columns: cols }
  }, [items, mode])

  const totalDays = rangeEnd.diff(rangeStart, 'day') || 1

  const grouped = useMemo(() => {
    const map = new Map<string, TaskItem[]>()
    items.forEach((item) => {
      const cat = item.categoryName || '未分类'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(item)
    })
    return Array.from(map.entries())
  }, [items])

  if (!items.length) return <Empty description="暂无任务" style={{ padding: 60 }} />

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <Text strong>甘特图</Text>
        <Segmented options={[
          { label: '日', value: 'day' },
          { label: '周', value: 'week' },
          { label: '月', value: 'month' },
        ]} value={mode} onChange={(v) => setMode(v as GanttMode)} size="small" />
      </div>
      <div className="border rounded overflow-hidden" style={{ maxHeight: 'calc(100vh - 360px)', overflow: 'auto' }}>
        {/* Header */}
        <div className="flex" style={{ minWidth: 900 }}>
          <div style={{ width: 200, flexShrink: 0 }} className="border-r border-b bg-gray-50 px-3 py-2">
            <Text strong style={{ fontSize: 13 }}>任务</Text>
          </div>
          <div className="flex-1 flex border-b bg-gray-50">
            {columns.map((col, i) => (
              <div key={i} className="flex-1 text-center px-1 py-2" style={{ fontSize: 12, borderRight: '1px solid #f0f0f0', minWidth: 60 }}>
                <Text type="secondary">
                  {mode === 'day' ? col.format('MM/DD') : mode === 'week' ? col.format('MM/DD') : col.format('YYYY/MM')}
                </Text>
              </div>
            ))}
          </div>
        </div>
        {/* Rows */}
        {grouped.map(([cat, catItems]) => (
          <React.Fragment key={cat}>
            <div className="flex" style={{ minWidth: 900 }}>
              <div style={{ width: 200, flexShrink: 0 }} className="border-r border-b bg-gray-100 px-3 py-1.5">
                <Text strong style={{ fontSize: 12, color: '#666' }}>{cat}</Text>
              </div>
              <div className="flex-1 border-b" style={{ height: 28 }} />
            </div>
            {catItems.map((item) => {
              const start = item.startDate ? dayjs(item.startDate) : rangeStart
              const end = item.deadline ? dayjs(item.deadline) : start.add(7, 'day')
              const leftPct = Math.max(0, start.diff(rangeStart, 'day') / totalDays * 100)
              const widthPct = Math.max(1, end.diff(start, 'day') / totalDays * 100)
              const pStyle = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.P3
              return (
                <div key={item.id} className="flex hover:bg-blue-50 cursor-pointer" style={{ minWidth: 900 }} onClick={() => onUpdate(item)}>
                  <div style={{ width: 200, flexShrink: 0 }} className="border-r border-b px-3 py-1.5 flex items-center gap-1">
                    <Tag color={PRIORITY_COLOR_MAP[item.priority]} style={{ margin: 0, fontSize: 11, lineHeight: '16px', padding: '0 4px' }}>{item.priority}</Tag>
                    <Text ellipsis style={{ fontSize: 12, flex: 1 }}>{item.title}</Text>
                  </div>
                  <div className="flex-1 border-b relative" style={{ height: 32, padding: '4px 0' }}>
                    <Tooltip title={`${item.title} (${dayjs(item.startDate).format('MM/DD')} - ${dayjs(item.deadline).format('MM/DD')})`}>
                      <div
                        style={{
                          position: 'absolute', top: 6, left: `${leftPct}%`, width: `${widthPct}%`,
                          height: 20, borderRadius: 4, background: pStyle.bg, border: `1px solid ${pStyle.border}`,
                          display: 'flex', alignItems: 'center', padding: '0 6px', overflow: 'hidden',
                        }}
                      >
                        <div style={{
                          width: `${item.progress || 0}%`, height: '100%', background: pStyle.color, borderRadius: 3, opacity: 0.25,
                        }} />
                        <span style={{ position: 'absolute', left: 6, fontSize: 11, color: pStyle.color, whiteSpace: 'nowrap', fontWeight: 500 }}>
                          {item.title}
                        </span>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Modals                                                             */
/* ------------------------------------------------------------------ */

/** Add / Edit Task Modal */
const TaskFormModal: React.FC<{
  open: boolean; title: string; initialValues?: Partial<TaskItem>
  owners: OwnerOption[]; categories: CategoryOption[]
  onOk: (values: any) => Promise<void>; onCancel: () => void
}> = ({ open, title, initialValues, owners, categories, onOk, onCancel }) => {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      if (initialValues?.id) {
        form.setFieldsValue({
          ...initialValues,
          dateRange: initialValues.startDate && initialValues.deadline
            ? [dayjs(initialValues.startDate), dayjs(initialValues.deadline)]
            : undefined,
        })
      } else {
        form.resetFields()
      }
    }
  }, [open, initialValues])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setSubmitting(true)
      const { dateRange, ...rest } = values
      const payload = {
        ...rest,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        deadline: dateRange?.[1]?.format('YYYY-MM-DD'),
      }
      await onOk(payload)
      form.resetFields()
    } catch {
      // validation error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={title} open={open} onOk={handleOk} onCancel={onCancel} width={640} confirmLoading={submitting} destroyOnClose>
      <Form form={form} layout="vertical" initialValues={{ priority: 'P2', ...initialValues }}>
        <Form.Item name="title" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
          <Input placeholder="请输入任务名称" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="ownerIds" label="负责人" rules={[{ required: true, message: '请选择负责人' }]}>
              <Select mode="multiple" placeholder="请选择负责人" allowClear showSearch optionFilterProp="label"
                options={owners.map((o) => ({ label: o.name, value: o.id }))} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
              <Select options={['P0', 'P1', 'P2', 'P3'].map((p) => ({ label: p, value: p }))} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="categoryId" label="所属分类">
              <Select placeholder="请选择分类" allowClear showSearch optionFilterProp="label"
                options={categories.map((c) => ({ label: c.name, value: c.id }))} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dateRange" label="起止日期">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="description" label="事项描述">
          <TextArea rows={3} placeholder="请输入事项描述" />
        </Form.Item>
        {!initialValues?.id && (
          <Form.Item name="latestProgress" label="当前进展">
            <TextArea rows={2} placeholder="请输入当前进展" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

/** Task Detail / Update Modal */
const TaskDetailModal: React.FC<{
  open: boolean; task: TaskItem | null
  onClose: () => void; onUpdate: () => void
}> = ({ open, task, onClose, onUpdate }) => {
  const [progressForm] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [detail, setDetail] = useState<TaskItem | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && task?.id) {
      setLoading(true)
      getTaskItem(task.id).then((res) => {
        setDetail(res.data || task)
      }).catch(() => setDetail(task)).finally(() => setLoading(false))
      progressForm.resetFields()
    }
  }, [open, task])

  const handleAddProgress = async () => {
    try {
      const values = await progressForm.validateFields()
      setSubmitting(true)
      await updateTaskProgress(task!.id, values)
      message.success('进展更新成功')
      progressForm.resetFields()
      // Refresh detail
      const res = await getTaskItem(task!.id)
      setDetail(res.data)
      onUpdate()
    } catch {
      // validation
    } finally {
      setSubmitting(false)
    }
  }

  if (!task) return null
  const data = detail || task

  return (
    <Modal title="任务详情" open={open} onCancel={onClose} width={720} footer={null} destroyOnClose>
      <Spin spinning={loading}>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {data.code && <Tag>{data.code}</Tag>}
            <Tag color={STATUS_COLOR_MAP[data.status]}>{STATUS_MAP[data.status]}</Tag>
            <Tag color={PRIORITY_COLOR_MAP[data.priority]}>{data.priority}</Tag>
            {isOverdue(data) && <Tag color="red">已逾期</Tag>}
          </div>
          <Title level={4} style={{ marginBottom: 8 }}>{data.title}</Title>
          {data.description && <Text type="secondary">{data.description}</Text>}
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <Row gutter={[16, 12]} className="mb-4">
          <Col span={8}><Text type="secondary">负责人：</Text><Text>{(data.ownerNames || []).join('、') || '-'}</Text></Col>
          <Col span={8}><Text type="secondary">分类：</Text><Text>{data.categoryName || '-'}</Text></Col>
          <Col span={8}><Text type="secondary">截止日期：</Text><Text type={isOverdue(data) ? 'danger' : undefined}>{data.deadline || '-'}</Text></Col>
          <Col span={8}><Text type="secondary">开始日期：</Text><Text>{data.startDate || '-'}</Text></Col>
          <Col span={8}><Text type="secondary">创建时间：</Text><Text>{data.createTime || '-'}</Text></Col>
        </Row>
        {typeof data.progress === 'number' && (
          <div className="mb-4">
            <Text type="secondary">完成进度：</Text>
            <Progress percent={data.progress} size="small" status={data.status === 'completed' ? 'success' : 'active'} />
          </div>
        )}
        <Divider style={{ margin: '12px 0' }} />
        <div className="mb-4">
          <Text strong style={{ marginBottom: 8, display: 'block' }}>进展记录</Text>
          {(data.progressHistory || []).length > 0 ? (
            <Timeline
              items={(data.progressHistory || []).reverse().map((p) => ({
                children: (
                  <div>
                    <div>{p.content}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {p.operator && `${p.operator} · `}{p.createTime || ''}
                    </Text>
                  </div>
                ),
              }))}
            />
          ) : (
            <Text type="secondary">暂无进展记录</Text>
          )}
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div>
          <Text strong style={{ marginBottom: 8, display: 'block' }}>添加进展</Text>
          <Form form={progressForm} layout="inline" style={{ width: '100%' }}>
            <Form.Item name="content" rules={[{ required: true, message: '请输入进展内容' }]} style={{ flex: 1 }}>
              <TextArea rows={2} placeholder="请输入最新进展" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" loading={submitting} onClick={handleAddProgress}>提交</Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function CockpitPage() {
  // State
  const [view, setView] = useState<string>(VIEW_KANBAN)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<TaskItem[]>([])
  const [stats, setStats] = useState<TaskStatsData>({})
  const [owners, setOwners] = useState<OwnerOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [keyword, setKeyword] = useState('')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | ''>('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Modal state
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [formModalTitle, setFormModalTitle] = useState('新增任务')
  const [editingItem, setEditingItem] = useState<Partial<TaskItem> | undefined>()

  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<TaskItem | null>(null)

  const actionRef = useRef<ActionType>()

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [itemsRes, statsRes, ownersRes, catsRes] = await Promise.all([
        listTaskItems({ size: 1000 }).catch(() => ({ data: { list: [] } })),
        getTaskStats().catch(() => ({ data: {} })),
        listTaskOwners().catch(() => ({ data: [] })),
        listTaskCategories().catch(() => ({ data: [] })),
      ])
      setItems(itemsRes.data?.list || itemsRes.data || [])
      setStats(statsRes.data || {})
      setOwners(ownersRes.data || [])
      setCategories(catsRes.data || [])
    } catch {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Filtered items
  const filteredItems = useMemo(() => {
    let list = [...items]
    if (keyword) {
      const kw = keyword.toLowerCase()
      list = list.filter((i) =>
        (i.title || '').toLowerCase().includes(kw) ||
        (i.code || '').toLowerCase().includes(kw) ||
        (i.description || '').toLowerCase().includes(kw)
      )
    }
    if (filterStatus) list = list.filter((i) => i.status === filterStatus)
    if (filterPriority) list = list.filter((i) => i.priority === filterPriority)
    if (activeCategory && activeCategory !== 'all') list = list.filter((i) => i.categoryId === activeCategory)
    return list
  }, [items, keyword, filterStatus, filterPriority, activeCategory])

  // Handlers
  const handleRefresh = () => {
    fetchData()
    actionRef.current?.reload()
  }

  const handleAddTask = () => {
    setFormModalTitle('新增任务')
    setEditingItem(undefined)
    setFormModalOpen(true)
  }

  const handleEditTask = (item: TaskItem) => {
    setDetailItem(item)
    setDetailModalOpen(true)
  }

  const handleFormSubmit = async (values: any) => {
    if (editingItem?.id) {
      await updateTaskItem(editingItem.id, values)
      message.success('修改成功')
    } else {
      await createTaskItem(values)
      message.success('新增成功')
    }
    setFormModalOpen(false)
    handleRefresh()
  }

  const handleDelete = async (id: string) => {
    await deleteTaskItem(id)
    message.success('删除成功')
    handleRefresh()
  }

  const handleUrge = async (id: string) => {
    await urgeTaskItem(id)
    message.success('催办成功')
  }

  // Status count helpers
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    items.forEach((i) => { counts[i.status] = (counts[i.status] || 0) + 1 })
    return counts
  }, [items])

  // Render
  return (
    <div className="flex h-full" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Left Sidebar */}
      <div style={{ width: 220, flexShrink: 0, background: '#fff', borderRight: '1px solid #f0f0f0' }} className="flex flex-col">
        {/* Brand */}
        <div className="px-4 py-5 border-b">
          <Title level={5} style={{ marginBottom: 2 }}>任务看板</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>董事长会议跟踪</Text>
        </div>

        {/* Add button */}
        <div className="px-4 py-3">
          <Button type="primary" icon={<PlusOutlined />} block onClick={handleAddTask}>
            新增任务
          </Button>
        </div>

        {/* Status filters */}
        <div className="px-4 flex-1 overflow-y-auto">
          <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>按状态筛选</Text>
          <div className="flex flex-col gap-1 mb-4">
            <div
              className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer ${!filterStatus ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              onClick={() => setFilterStatus('')}
            >
              <Text style={{ fontSize: 13 }}>全部</Text>
              <Badge count={items.length} style={{ backgroundColor: '#d9d9d9' }} />
            </div>
            {(Object.entries(STATUS_MAP) as [TaskStatus, string][]).map(([key, label]) => (
              <div
                key={key}
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer ${filterStatus === key ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                onClick={() => setFilterStatus(filterStatus === key ? '' : key)}
              >
                <Space size={6}>
                  {statusIcon(key)}
                  <Text style={{ fontSize: 13 }}>{label}</Text>
                </Space>
                <Badge count={statusCounts[key] || 0} style={{ backgroundColor: '#d9d9d9' }} />
              </div>
            ))}
          </div>

          <Divider style={{ margin: '8px 0' }} />
          <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>按优先级筛选</Text>
          <div className="flex flex-col gap-1 mb-4">
            <div
              className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer ${!filterPriority ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              onClick={() => setFilterPriority('')}
            >
              <Text style={{ fontSize: 13 }}>全部</Text>
            </div>
            {(['P0', 'P1', 'P2', 'P3'] as TaskPriority[]).map((p) => {
              const cnt = items.filter((i) => i.priority === p).length
              return (
                <div
                  key={p}
                  className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer ${filterPriority === p ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setFilterPriority(filterPriority === p ? '' : p)}
                >
                  <Space size={6}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_STYLES[p].color }} />
                    <Text style={{ fontSize: 13 }}>{p}</Text>
                  </Space>
                  <Badge count={cnt} style={{ backgroundColor: '#d9d9d9' }} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t">
          <Space>
            <Avatar size={28} icon={<UserOutlined />} />
            <Text style={{ fontSize: 13 }}>管理员</Text>
          </Space>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white px-6 py-4 border-b flex items-center justify-between">
          <div>
            <Title level={4} style={{ marginBottom: 0 }}>董事长会议跟踪看板</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>实时跟踪任务进展，高效管理会议事项</Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>刷新</Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <Row gutter={[16, 16]} className="mb-4">
            <Col span={4}><StatCard title="任务总数" value={stats.total || items.length} icon={<AppstoreOutlined />} color="#1890ff" bg="#e6f7ff" /></Col>
            <Col span={4}><StatCard title="进行中" value={stats.inProgress || statusCounts['in_progress'] || 0} icon={<PlayCircleOutlined />} color="#1890ff" bg="#e6f7ff" /></Col>
            <Col span={4}><StatCard title="已完成" value={stats.completed || statusCounts['completed'] || 0} icon={<CheckCircleOutlined />} color="#52c41a" bg="#f6ffed" /></Col>
            <Col span={4}><StatCard title="有风险" value={stats.atRisk || statusCounts['at_risk'] || 0} icon={<WarningOutlined />} color="#faad14" bg="#fffbe6" /></Col>
            <Col span={4}><StatCard title="已阻塞" value={stats.blocked || statusCounts['blocked'] || 0} icon={<CloseCircleOutlined />} color="#ff4d4f" bg="#fff2f0" /></Col>
            <Col span={4}><StatCard title="已逾期" value={stats.overdue || items.filter(isOverdue).length} icon={<ExclamationCircleOutlined />} color="#ff4d4f" bg="#fff2f0" /></Col>
          </Row>

          {/* P0 Alert */}
          {(stats.p0Count || items.filter((i) => i.priority === 'P0').length) >= 5 && (
            <Alert
              type="warning"
              showIcon
              icon={<ExclamationCircleOutlined />}
              message={`当前有 ${stats.p0Count || items.filter((i) => i.priority === 'P0').length} 个 P0 级任务，请重点关注！`}
              className="mb-4"
              closable
            />
          )}

          {/* Category Tabs */}
          <div className="mb-4">
            <Tabs
              activeKey={activeCategory}
              onChange={setActiveCategory}
              items={[
                { key: 'all', label: `全部 (${items.length})` },
                ...categories.map((c) => ({
                  key: c.id,
                  label: `${c.name} (${items.filter((i) => i.categoryId === c.id).length})`,
                })),
              ]}
              size="small"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <Space>
              <Input
                placeholder="搜索任务..."
                prefix={<SearchOutlined />}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                allowClear
                style={{ width: 240 }}
              />
              {filterStatus && (
                <Tag closable onClose={() => setFilterStatus('')} color={STATUS_COLOR_MAP[filterStatus]}>
                  {STATUS_MAP[filterStatus]}
                </Tag>
              )}
              {filterPriority && (
                <Tag closable onClose={() => setFilterPriority('')} color={PRIORITY_STYLES[filterPriority].color}>
                  {filterPriority}
                </Tag>
              )}
            </Space>
            <Segmented
              options={[
                { label: <span><AppstoreOutlined /> 看板</span>, value: VIEW_KANBAN },
                { label: <span><TableOutlined /> 表格</span>, value: VIEW_TABLE },
                { label: <span><BarChartOutlined /> 甘特</span>, value: VIEW_GANTT },
              ]}
              value={view}
              onChange={(v) => setView(v as string)}
            />
          </div>

          {/* Views */}
          <Spin spinning={loading}>
            {view === VIEW_KANBAN && (
              <KanbanView items={filteredItems} onUpdate={handleEditTask} onDelete={handleDelete} onUrge={handleUrge} />
            )}
            {view === VIEW_TABLE && (
              <TableView actionRef={actionRef} onEdit={handleEditTask} onDelete={handleDelete} onUrge={handleUrge} categories={categories} />
            )}
            {view === VIEW_GANTT && (
              <GanttView items={filteredItems} onUpdate={handleEditTask} />
            )}
          </Spin>
        </div>
      </div>

      {/* Modals */}
      <TaskFormModal
        open={formModalOpen}
        title={formModalTitle}
        initialValues={editingItem}
        owners={owners}
        categories={categories}
        onOk={handleFormSubmit}
        onCancel={() => setFormModalOpen(false)}
      />
      <TaskDetailModal
        open={detailModalOpen}
        task={detailItem}
        onClose={() => { setDetailModalOpen(false); setDetailItem(null) }}
        onUpdate={handleRefresh}
      />
    </div>
  )
}
