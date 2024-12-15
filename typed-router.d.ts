/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    'root': RouteRecordInfo<'root', '/', Record<never, never>, Record<never, never>>,
    '$error': RouteRecordInfo<'$error', '/:error(.*)', { error: ParamValue<true> }, { error: ParamValue<false> }>,
    'admin-attendance-manage': RouteRecordInfo<'admin-attendance-manage', '/admin/AttendanceManage', Record<never, never>, Record<never, never>>,
    'admin-duty-manage': RouteRecordInfo<'admin-duty-manage', '/admin/DutyManage', Record<never, never>, Record<never, never>>,
    'admin-group-manage': RouteRecordInfo<'admin-group-manage', '/admin/GroupManage', Record<never, never>, Record<never, never>>,
    'admin-leave-manage': RouteRecordInfo<'admin-leave-manage', '/admin/LeaveManage', Record<never, never>, Record<never, never>>,
    'admin-project-manage': RouteRecordInfo<'admin-project-manage', '/admin/ProjectManage', Record<never, never>, Record<never, never>>,
    'admin-user-manage': RouteRecordInfo<'admin-user-manage', '/admin/UserManage', Record<never, never>, Record<never, never>>,
    'admin-weekly-report': RouteRecordInfo<'admin-weekly-report', '/admin/WeeklyReport', Record<never, never>, Record<never, never>>,
    'login': RouteRecordInfo<'login', '/login', Record<never, never>, Record<never, never>>,
    'register': RouteRecordInfo<'register', '/register', Record<never, never>, Record<never, never>>,
    'user-attendance-check': RouteRecordInfo<'user-attendance-check', '/user/AttendanceCheck', Record<never, never>, Record<never, never>>,
    'user-attendance-record': RouteRecordInfo<'user-attendance-record', '/user/AttendanceRecord', Record<never, never>, Record<never, never>>,
    'user-leave-apply': RouteRecordInfo<'user-leave-apply', '/user/LeaveApply', Record<never, never>, Record<never, never>>,
    'user-weekly-report': RouteRecordInfo<'user-weekly-report', '/user/WeeklyReport', Record<never, never>, Record<never, never>>,
  }
}
