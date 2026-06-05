import React, { useRef, useState } from 'react'
import { ProTable, ModalForm, ProFormText, ProFormSelect, type ActionType, type ProColumns } from '@ant-design/pro-components'
import { Button, Tag, message, Popconfirm } from 'antd'
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'
import { listJob, addJob, updateJob, deleteJob, updateJobStatus, triggerJob } from '@/services/schedule/job'

export default function JobPage() {
  const actionRef = useRef<ActionType>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [initialValues, setInitialValues] = useState<any>({})

  const columns: ProColumns[] = [
    { title: '任务名称', dataIndex: 'name', ellipsis: true },
    { title: '任务分组', dataIndex: 'group', width: 100 },
    { title: '调用目标', dataIndex: 'invokeTarget', ellipsis: true },
    { title: 'Cron表达式', dataIndex: 'cronExpression', width: 150 },
    { title: '状态', dataIndex: 'status', width: 80,
      render: (_, record) => <Tag color={record.status === 1 ? 'green' : 'red'}>{record.status === 1 ? '运行中' : '已暂停'}</Tag>,
    },
    {
      title: '操作', valueType: 'option', width: 300,
      render: (_, record) => [
        <Button key="trigger" type="link" size="small" icon={<PlayCircleOutlined />} onClick={async () => { await triggerJob(record.id); message.success('执行成功') }}>执行</Button>,
        record.status === 1
          ? <Button key="pause" type="link" size="small" icon={<PauseCircleOutlined />} onClick={async () => { await updateJobStatus({ status: 2 }, record.id); message.success('暂停成功'); actionRef.current?.reload() }}>暂停</Button>
          : <Button key="resume" type="link" size="small" icon={<PlayCircleOutlined />} onClick={async () => { await updateJobStatus({ status: 1 }, record.id); message.success('恢复成功'); actionRef.current?.reload() }}>恢复</Button>,
        <Button key="edit" type="link" size="small" onClick={() => { setModalTitle('编辑任务'); setEditingId(record.id); setInitialValues(record); setModalOpen(true) }}>编辑</Button>,
        <Popconfirm key="del" title="确认删除？" onConfirm={async () => { await deleteJob(record.id); message.success('删除成功'); actionRef.current?.reload() }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <>
      <ProTable headerTitle="任务调度" actionRef={actionRef} rowKey="id" columns={columns}
        request={async (params) => { const { current, pageSize, ...rest } = params; const res = await listJob({ page: current, size: pageSize, ...rest }); return { data: res.data?.list || [], total: res.data?.total || 0, success: true } }}
        pagination={{ defaultPageSize: 10 }} search={false}
        toolBarRender={() => [<Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setModalTitle('新增任务'); setEditingId(null); setInitialValues({ status: 1 }); setModalOpen(true) }}>新增</Button>]}
      />
      <ModalForm
        title={modalTitle}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onFinish={async (values: any) => {
          if (editingId) { await updateJob(values, editingId) } else { await addJob(values) }
          message.success(editingId ? '修改成功' : '新增成功')
          actionRef.current?.reload()
          return true
        }}
        width={600}
        initialValues={initialValues}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormText name="name" label="任务名称" rules={[{ required: true }]} />
        <ProFormText name="group" label="任务分组" rules={[{ required: true }]} />
        <ProFormText name="invokeTarget" label="调用目标" rules={[{ required: true }]} />
        <ProFormText name="cronExpression" label="Cron表达式" rules={[{ required: true }]} />
        <ProFormSelect name="status" label="状态" initialValue={1}
          options={[{ label: '运行中', value: 1 }, { label: '已暂停', value: 2 }]}
        />
      </ModalForm>
    </>
  )
}
