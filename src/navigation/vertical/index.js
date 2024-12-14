export default [
  {
    title: 'Home',
    to: { name: 'root' },
    icon: { icon: 'ri-dashboard-line' },
    role: ['admin', 'user'],
  },
  {
    title: '考勤签到',
    to: { name: 'user-attendance-check' },
    icon: { icon: 'ri-calendar-check-line' },
    role: ['user'],
  },
  {
    title: '考勤记录',
    to: { name: 'user-attendance-record' },
    icon: { icon: 'ri-file-list-3-line' },
    role: ['user'],
  },
  {
    title: '请假申请',
    to: { name: 'user-leave-apply' },
    icon: { icon: 'ri-calendar-event-line' },
    role: ['user'],
  },
  {
    title: '我的周报',
    to: { name: 'user-weekly-report' },
    icon: { icon: 'ri-file-paper-line' },
    role: ['user'],
  },
  {
    title: '考勤管理',
    to: { name: 'admin-attendance-manage' },
    icon: { icon: 'ri-calendar-line' },
    role: ['admin'],
  },
  {
    title: '用户管理',
    to: { name: 'admin-user-manage' },
    icon: { icon: 'ri-team-line' },
    role: ['admin'],
  },
  {
    title: '项目组管理',
    to: { name: 'admin-group-manage' },
    icon: { icon: 'ri-folder-user-line' },
    role: ['admin'],
  },
  {
    title: '请假管理',
    to: { name: 'admin-leave-manage' },
    icon: { icon: 'ri-calendar-event-line' },
    role: ['admin'],
  },
  {
    title: '值日管理',
    to: { name: 'admin-duty-manage' },
    icon: { icon: 'ri-calendar-todo-line' },
    role: ['admin'],
  },
  {
    title: '周报管理',
    to: { name: 'admin-weekly-report' },
    icon: { icon: 'ri-file-paper-2-line' },
    role: ['admin'],
  },
]
