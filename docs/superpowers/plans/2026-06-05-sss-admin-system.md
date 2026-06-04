# SSS Admin System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replicate the complete `sss-task-web` (Vue 3 + Arco Design) backend management system as a Umi 4 + Ant Design + TailwindCSS + TypeScript + ProComponents + Ant Design X project.

**Architecture:** Umi 4 SPA with dynamic backend-driven routing, Ant Design 5 UI, ProComponents for tables/forms, Ant Design X for AI/chat features. State via zustand. HTTP via umi-request. The source project has 40+ pages, 100+ API endpoints, 6 stores, 30+ shared components. We replicate ALL functionality.

**Tech Stack:** Umi 4, React 18, TypeScript 5, Ant Design 5, ProComponents, Ant Design X, TailwindCSS 3, zustand, umi-request, dayjs, ECharts, jsencrypt

---

## ⚠️ SCOPE NOTICE

This project contains **11 independent subsystems**. Each should be implemented as a separate sub-plan for manageable execution:

| # | Subsystem | Pages | Complexity | Sub-plan |
|---|-----------|-------|------------|----------|
| 1 | **Foundation & Infrastructure** | 0 (scaffolding) | Medium | `01-foundation.md` |
| 2 | **Auth & Login** | 4 pages | Medium | `02-auth-login.md` |
| 3 | **Layout & Navigation** | 4 layouts + components | Medium | `03-layout-navigation.md` |
| 4 | **Dashboard - Cockpit (Kanban)** | 3 views + modals | **Very High** | `04-cockpit-dashboard.md` |
| 5 | **Dashboard - Task & Category** | 2 pages | Medium | `05-task-category.md` |
| 6 | **System Management** | 12 pages | High | `06-system-management.md` |
| 7 | **Monitor Module** | 4 pages | Low | `07-monitor-module.md` |
| 8 | **Schedule Module** | 2 pages | Low | `08-schedule-module.md` |
| 9 | **Open API & Tenant** | 4 pages | Medium | `09-open-tenant.md` |
| 10 | **Code Generator** | 1 page | Medium | `10-code-generator.md` |
| 11 | **User Profile & Messages** | 3 pages | Medium | `11-user-profile-messages.md` |

**Recommended execution order:** 1 → 2 → 3 → then 4–11 in any order (they're independent once foundation exists).

---

## FILE STRUCTURE OVERVIEW

```
D:\code\umi4-admin\
├── .umirc.ts                    # Umi config (routes, plugins, proxy, tailwindcss)
├── .env.development             # Dev env vars
├── .env.production              # Prod env vars
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── src/
│   ├── app.tsx                  # Umi runtime config (layout, request, render)
│   ├── global.less              # Global styles
│   ├── tailwind.css             # Tailwind imports
│   ├── constants/               # Shared constants
│   │   ├── common.ts            # Status, gender enums
│   │   ├── file.ts              # File type mappings
│   │   └── task.ts              # Task status/priority maps
│   ├── services/                # API layer (replaces Vue's apis/)
│   │   ├── api.ts               # Request wrapper (umi-request based)
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── captcha.ts           # Captcha endpoints
│   │   ├── dashboard.ts         # Dashboard analytics
│   │   ├── task.ts              # Task CRUD + progress + comments
│   │   ├── system/
│   │   │   ├── user.ts
│   │   │   ├── role.ts
│   │   │   ├── menu.ts
│   │   │   ├── dept.ts
│   │   │   ├── dict.ts
│   │   │   ├── notice.ts
│   │   │   ├── file.ts
│   │   │   ├── storage.ts
│   │   │   ├── client.ts
│   │   │   ├── option.ts
│   │   │   ├── common.ts
│   │   │   ├── smsConfig.ts
│   │   │   ├── smsLog.ts
│   │   │   ├── userProfile.ts
│   │   │   └── userMessage.ts
│   │   ├── monitor/
│   │   │   ├── online.ts
│   │   │   └── log.ts
│   │   ├── schedule/
│   │   │   ├── job.ts
│   │   │   └── log.ts
│   │   ├── open/
│   │   │   └── app.ts
│   │   ├── tenant/
│   │   │   ├── common.ts
│   │   │   ├── management.ts
│   │   │   └── package.ts
│   │   ├── code/
│   │   │   └── generator.ts
│   │   └── area.ts
│   ├── stores/                  # Zustand stores (replaces Pinia)
│   │   ├── useAppStore.ts       # Theme, layout, site config
│   │   ├── useUserStore.ts      # Auth, user info, permissions
│   │   ├── useRouteStore.ts     # Dynamic routes, menu tree
│   │   ├── useTabsStore.ts      # Multi-tab navigation
│   │   ├── useDictStore.ts      # Dictionary cache
│   │   └── useTenantStore.ts    # Multi-tenant state
│   ├── hooks/                   # Custom hooks
│   │   ├── useLoading.ts
│   │   ├── usePagination.ts
│   │   ├── useTable.ts
│   │   ├── useRequest.ts
│   │   ├── useBreakpoint.ts
│   │   ├── useDevice.ts
│   │   ├── useDownload.ts
│   │   ├── useDict.ts
│   │   ├── useDept.ts
│   │   ├── useMenu.ts
│   │   ├── useRole.ts
│   │   └── usePermission.ts
│   ├── components/              # Shared components
│   │   ├── GiTable/             # Enhanced ProTable wrapper
│   │   ├── GiForm/              # Enhanced ProForm wrapper
│   │   ├── GiPageLayout/        # Page layout with sidebar
│   │   ├── GiCell/              # Cell renderers (Avatar, Status, Tag, Gender)
│   │   ├── GiFooter/            # Copyright footer
│   │   ├── Breadcrumb/          # Navigation breadcrumb
│   │   ├── UserSelect/          # User selection component
│   │   ├── FilePreview/         # File preview
│   │   ├── Chart/               # ECharts wrapper
│   │   ├── DateRangePicker/     # Date range
│   │   ├── GenCron/             # Cron expression builder
│   │   ├── JsonPretty/          # JSON viewer
│   │   ├── MultipartUpload/     # Chunked upload
│   │   ├── Verify/              # Captcha verification
│   │   └── icons/               # SVG icon components
│   ├── layouts/                 # Layout components
│   │   ├── index.tsx            # Layout selector
│   │   ├── DefaultLayout.tsx    # Sidebar + header + tabs
│   │   ├── MixLayout.tsx        # Mixed horizontal/vertical
│   │   ├── TopLayout.tsx        # Top navigation
│   │   ├── ColumnsLayout.tsx    # Multi-column
│   │   └── components/
│   │       ├── Asider/          # Left sidebar
│   │       ├── Header/          # Top header bar
│   │       ├── Tabs/            # Multi-tab bar
│   │       ├── Menu/            # Navigation menu
│   │       └── HeaderRightBar/  # Search, settings, notifications
│   ├── pages/                   # Page components
│   │   ├── login/               # Login page
│   │   ├── 403.tsx
│   │   ├── 404.tsx
│   │   ├── redirect/
│   │   ├── user/
│   │   │   ├── profile/         # User profile center
│   │   │   ├── message/         # Message center
│   │   │   └── notice/          # View notice
│   │   ├── dashboard/
│   │   │   ├── cockpit/         # Chairman tracking kanban (CORE)
│   │   │   │   ├── index.tsx
│   │   │   │   ├── TaskKanban.tsx
│   │   │   │   ├── TaskTable.tsx
│   │   │   │   ├── TaskGantt.tsx
│   │   │   │   ├── AddTaskModal.tsx
│   │   │   │   ├── UpdateTaskModal.tsx
│   │   │   │   └── hooks/
│   │   │   │       ├── useTasks.ts
│   │   │   │       └── useUrge.ts
│   │   │   ├── task/            # Task list management
│   │   │   ├── category/        # Category management
│   │   │   ├── workplace/       # Workplace dashboard
│   │   │   ├── analysis/        # Analytics dashboard
│   │   │   ├── project-schedule/
│   │   │   └── resource-board/
│   │   ├── system/
│   │   │   ├── user/            # User management
│   │   │   ├── role/            # Role management
│   │   │   ├── menu/            # Menu management
│   │   │   ├── dept/            # Department management
│   │   │   ├── dict/            # Dictionary management
│   │   │   ├── notice/          # Notice management
│   │   │   ├── file/            # File management
│   │   │   └── config/          # System config (7 sub-pages)
│   │   ├── monitor/
│   │   │   ├── online/          # Online users
│   │   │   └── log/             # Login/operation logs
│   │   ├── schedule/
│   │   │   ├── job/             # Job management
│   │   │   └── log/             # Job logs
│   │   ├── open/
│   │   │   └── app/             # Open API apps
│   │   ├── tenant/
│   │   │   ├── management/      # Tenant management
│   │   │   └── package/         # Tenant packages
│   │   └── code/
│   │       └── generator/       # Code generator
│   ├── types/                   # TypeScript types
│   │   ├── api.d.ts             # API response envelope
│   │   ├── global.d.ts          # Shared types
│   │   └── env.d.ts             # Environment types
│   └── utils/                   # Utilities
│       ├── auth.ts              # Token management
│       ├── encrypt.ts           # RSA/AES/MD5 encryption
│       ├── has.ts               # Permission checks
│       ├── http.ts              # Request interceptor
│       ├── validate.ts          # Validation helpers
│       └── index.ts             # General utilities
└── mock/                        # Mock data
    └── cockpit.ts               # Cockpit task mocks
```

---

## SUB-PLAN 01: FOUNDATION & INFRASTRUCTURE

**Files:**
- Create: `.umirc.ts`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- Create: `.env.development`, `.env.production`
- Create: `src/app.tsx`, `src/global.less`, `src/tailwind.css`
- Create: `src/types/api.d.ts`, `src/types/global.d.ts`, `src/types/env.d.ts`
- Create: `src/utils/http.ts`, `src/utils/auth.ts`, `src/utils/encrypt.ts`, `src/utils/has.ts`, `src/utils/validate.ts`, `src/utils/index.ts`
- Create: `src/services/api.ts` and all service files under `src/services/`
- Create: `src/constants/common.ts`, `src/constants/file.ts`, `src/constants/task.ts`
- Create: `src/stores/useAppStore.ts`, `src/stores/useUserStore.ts`, `src/stores/useRouteStore.ts`, `src/stores/useTabsStore.ts`, `src/stores/useDictStore.ts`, `src/stores/useTenantStore.ts`
- Create: All hooks under `src/hooks/`

### Task 1: Initialize Umi 4 Project

- [ ] **Step 1: Create package.json**

```json
{
  "name": "umi4-admin",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "umi dev",
    "build": "umi build",
    "postinstall": "umi setup",
    "lint": "umi lint",
    "test": "umi test"
  },
  "dependencies": {
    "@ant-design/icons": "^5.3.0",
    "@ant-design/pro-components": "^2.6.0",
    "@ant-design/x": "^1.0.0",
    "antd": "^5.15.0",
    "dayjs": "^1.11.10",
    "echarts": "^5.5.0",
    "echarts-for-react": "^3.0.2",
    "jsencrypt": "^3.3.2",
    "lodash-es": "^4.17.21",
    "qrcode.react": "^3.1.0",
    "query-string": "^9.0.0",
    "umi": "^4.1.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/lodash-es": "^4.17.12",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@umijs/lint": "^4.1.0",
    "@umijs/max": "^4.1.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "./src/.umi/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 3: Create .umirc.ts**

```typescript
import { defineConfig } from 'umi';

export default defineConfig({
  title: 'SSS Admin',
  favicon: '/favicon.ico',
  hash: true,
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false, // We use custom layout
  routes: [
    { path: '/login', component: '@/pages/login', layout: false },
    { path: '/403', component: '@/pages/403', layout: false },
    { path: '/404', component: '@/pages/404', layout: false },
    { path: '/redirect/:path(.*)', component: '@/pages/redirect', layout: false },
    { path: '/user/profile', component: '@/pages/user/profile', layout: false },
    { path: '@/pages/user/message', component: '@/pages/user/message', layout: false },
    { path: '/user/notice', component: '@/pages/user/notice', layout: false },
    {
      path: '/',
      component: '@/layouts',
      routes: [
        { path: '/dashboard/workplace', component: '@/pages/dashboard/workplace' },
        { path: '/dashboard/analysis', component: '@/pages/dashboard/analysis' },
        { path: '/dashboard/cockpit', component: '@/pages/dashboard/cockpit' },
        { path: '/dashboard/task', component: '@/pages/dashboard/task' },
        { path: '/dashboard/category', component: '@/pages/dashboard/category' },
        { path: '/dashboard/project-schedule', component: '@/pages/dashboard/project-schedule' },
        { path: '/dashboard/resource-board', component: '@/pages/dashboard/resource-board' },
        { path: '/system/user', component: '@/pages/system/user' },
        { path: '/system/role', component: '@/pages/system/role' },
        { path: '/system/menu', component: '@/pages/system/menu' },
        { path: '/system/dept', component: '@/pages/system/dept' },
        { path: '/system/dict', component: '@/pages/system/dict' },
        { path: '/system/notice', component: '@/pages/system/notice' },
        { path: '/system/file', component: '@/pages/system/file' },
        { path: '/system/config/site', component: '@/pages/system/config/site' },
        { path: '/system/config/login', component: '@/pages/system/config/login' },
        { path: '/system/config/security', component: '@/pages/system/config/security' },
        { path: '/system/config/mail', component: '@/pages/system/config/mail' },
        { path: '@/pages/system/config/storage', component: '@/pages/system/config/storage' },
        { path: '/system/config/sms', component: '@/pages/system/config/sms' },
        { path: '/system/config/client', component: '@/pages/system/config/client' },
        { path: '/monitor/log/login', component: '@/pages/monitor/log/login' },
        { path: '/monitor/log/operation', component: '@/pages/monitor/log/operation' },
        { path: '/monitor/online', component: '@/pages/monitor/online' },
        { path: '/monitor/sms/log', component: '@/pages/monitor/sms/log' },
        { path: '/schedule/job', component: '@/pages/schedule/job' },
        { path: '/schedule/log', component: '@/pages/schedule/log' },
        { path: '/open/app', component: '@/pages/open/app' },
        { path: '/tenant/management', component: '@/pages/tenant/management' },
        { path: '/tenant/package', component: '@/pages/tenant/package' },
        { path: '/code/generator', component: '@/pages/code/generator' },
      ],
    },
    { path: '/*', redirect: '/404' },
  ],
  proxy: {
    '/sss-task': {
      target: 'https://booking-dev.3s-guojian.com',
      changeOrigin: true,
    },
  },
  plugins: ['@umijs/plugins/dist/model', '@umijs/plugins/dist/request', '@umijs/plugins/dist/access'],
  tailwindcss: {},
  antd: {
    dark: false,
    configProvider: {},
  },
  theme: {
    'primary-color': '#165DFF',
  },
});
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Avoid conflict with antd
  },
} satisfies Config;
```

- [ ] **Step 5: Create postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Create .env.development**

```
VITE_API_PREFIX=/sss-task
VITE_API_BASE_URL=https://booking-dev.3s-guojian.com
VITE_BASE=/
VITE_CLIENT_ID=ef51c9a3e9046c4f2ea45142c8a8344a
VITE_APP_SETTING=true
```

- [ ] **Step 7: Install dependencies**

Run: `cd D:/code/umi4-admin && pnpm install`
Expected: Dependencies installed successfully

### Task 2: Create Type Definitions

**Files:**
- Create: `src/types/api.d.ts`
- Create: `src/types/global.d.ts`
- Create: `src/types/env.d.ts`

- [ ] **Step 1: Create api.d.ts**

```typescript
// src/types/api.d.ts
export interface ApiRes<T = any> {
  code: number;
  data: T;
  msg: string;
  success: boolean;
  timestamp: string;
}

export interface PageRes<T = any> {
  list: T[];
  total: number;
}

export interface PageQuery {
  page: number;
  size: number;
}

export interface LabelValueState {
  label: string;
  value: string | number;
}
```

- [ ] **Step 2: Create global.d.ts**

```typescript
// src/types/global.d.ts
export type AnyObject = Record<string, any>;

export interface Options {
  label: string;
  value: string | number;
}

export type Status = 1 | 2; // 1=enabled, 2=disabled
export type Gender = 0 | 1 | 2; // 0=unknown, 1=male, 2=female
```

- [ ] **Step 3: Create env.d.ts**

```typescript
// src/types/env.d.ts
/// <reference types="umi" />

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_API_PREFIX: string;
    VITE_API_BASE_URL: string;
    VITE_BASE: string;
    VITE_CLIENT_ID: string;
    VITE_APP_SETTING: string;
  }
}
```

### Task 3: Create Utility Functions

**Files:**
- Create: `src/utils/auth.ts`
- Create: `src/utils/encrypt.ts`
- Create: `src/utils/http.ts`
- Create: `src/utils/has.ts`
- Create: `src/utils/validate.ts`
- Create: `src/utils/index.ts`

- [ ] **Step 1: Create auth.ts**

```typescript
// src/utils/auth.ts
const TOKEN_KEY = 'token';
const LOGIN_CORP_KEY = 'loginCorp';

export function isLogin(): boolean {
  return !!getToken();
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getLoginCorp(): string | null {
  return localStorage.getItem(LOGIN_CORP_KEY);
}

export function setLoginCorp(corp: string): void {
  localStorage.setItem(LOGIN_CORP_KEY, corp);
}

export function clearLoginCorp(): void {
  localStorage.removeItem(LOGIN_CORP_KEY);
}
```

- [ ] **Step 2: Create encrypt.ts**

```typescript
// src/utils/encrypt.ts
import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';

const RSA_PUBLIC_KEY = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDrDhXp3UxoVzBmXRpHIX5x6wl+pfHGM8gj6J4jVnqFpVLq0v5UHwMkCe+4E2V9F36pVcPQv1J3HN3h/R+3F5K3Ckz3C9t1t1l/qM/L0o+6vB4t/1lB/s9C6pP+F1vIe67NpZ9A+U3+1/5q3q5F8H/o3q4H+U6v3l9qM+GkIDAQAB`;

export function encryptByRsa(text: string): string {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(RSA_PUBLIC_KEY);
  return encryptor.encrypt(text) || text;
}

export function encryptByMd5(text: string): string {
  return CryptoJS.MD5(text).toString();
}

export function encodeByBase64(text: string): string {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
}

export function decodeByBase64(text: string): string {
  return CryptoJS.enc.Base64.parse(text).toString(CryptoJS.enc.Utf8);
}

export function encryptByAes(text: string, key: string): string {
  return CryptoJS.AES.encrypt(text, key).toString();
}
```

- [ ] **Step 3: Create http.ts**

```typescript
// src/utils/http.ts
import { request } from 'umi';
import { getToken, clearToken } from './auth';
import { message, Modal } from 'antd';

const API_PREFIX = process.env.VITE_API_PREFIX || '/sss-task';

// Request interceptor
request.interceptors.request.use((url: string, options: any) => {
  const token = getToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return { url: `${API_PREFIX}${url}`, options };
});

// Response interceptor
request.interceptors.response.use(async (response: Response) => {
  const data = await response.json();

  if (data.code === 401 && !response.url?.includes('/auth/user/info')) {
    clearToken();
    Modal.confirm({
      title: '登录已过期',
      content: '请重新登录',
      onOk: () => {
        window.location.href = '/login';
      },
    });
    return Promise.reject(new Error('登录已过期'));
  }

  if (!data.success) {
    message.error(data.msg || '请求失败');
    return Promise.reject(new Error(data.msg));
  }

  return data;
});

export default {
  get: <T = any>(url: string, params?: any) =>
    request<ApiRes<T>>(url, { method: 'GET', params }),
  post: <T = any>(url: string, data?: any) =>
    request<ApiRes<T>>(url, { method: 'POST', data }),
  put: <T = any>(url: string, data?: any) =>
    request<ApiRes<T>>(url, { method: 'PUT', data }),
  patch: <T = any>(url: string, data?: any) =>
    request<ApiRes<T>>(url, { method: 'PATCH', data }),
  del: <T = any>(url: string, data?: any) =>
    request<ApiRes<T>>(url, { method: 'DELETE', data }),
  download: (url: string, params?: any) =>
    request(url, { method: 'GET', params, responseType: 'blob' }),
};
```

- [ ] **Step 4: Create has.ts**

```typescript
// src/utils/has.ts
import { useUserStore } from '@/stores/useUserStore';

export function hasPerm(perm: string | string[]): boolean {
  const { permissions } = useUserStore.getState();
  if (permissions.includes('*:*:*')) return true;
  const perms = Array.isArray(perm) ? perm : [perm];
  return perms.some((p) => permissions.includes(p));
}

export function hasPermOr(perms: string[]): boolean {
  return hasPerm(perms);
}

export function hasPermAnd(perms: string[]): boolean {
  const { permissions } = useUserStore.getState();
  if (permissions.includes('*:*:*')) return true;
  return perms.every((p) => permissions.includes(p));
}

export function hasRole(role: string | string[]): boolean {
  const { roles } = useUserStore.getState();
  if (roles.includes('role_admin')) return true;
  const rolesArr = Array.isArray(role) ? role : [role];
  return rolesArr.some((r) => roles.includes(r));
}

export function hasRoleOr(roles: string[]): boolean {
  return hasRole(roles);
}

export function hasRoleAnd(roles: string[]): boolean {
  const { roles: userRoles } = useUserStore.getState();
  if (userRoles.includes('role_admin')) return true;
  return roles.every((r) => userRoles.includes(r));
}
```

- [ ] **Step 5: Create validate.ts**

```typescript
// src/utils/validate.ts
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export function isHttp(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function isIPv4(ip: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
}
```

- [ ] **Step 6: Create index.ts**

```typescript
// src/utils/index.ts
import dayjs from 'dayjs';

export function filterTree(tree: any[], fn: (node: any) => boolean): any[] {
  return tree
    .filter(fn)
    .map((node) => ({
      ...node,
      children: node.children ? filterTree(node.children, fn) : undefined,
    }));
}

export function sortTree(tree: any[], key = 'sort'): any[] {
  return [...tree]
    .sort((a, b) => (a[key] || 0) - (b[key] || 0))
    .map((node) => ({
      ...node,
      children: node.children ? sortTree(node.children, key) : undefined,
    }));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function copyText(text: string): void {
  navigator.clipboard.writeText(text);
}

export function dateFormat(date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(date).format(format);
}

export function transformPathToName(path: string): string {
  return path
    .replace(/\//g, '_')
    .replace(/:/g, '_')
    .replace(/\./g, '_')
    .replace(/-/g, '_');
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}
```

### Task 4: Create Zustand Stores

**Files:**
- Create: `src/stores/useAppStore.ts`
- Create: `src/stores/useUserStore.ts`
- Create: `src/stores/useRouteStore.ts`
- Create: `src/stores/useTabsStore.ts`
- Create: `src/stores/useDictStore.ts`
- Create: `src/stores/useTenantStore.ts`

- [ ] **Step 1: Create useAppStore.ts**

```typescript
// src/stores/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  themeColor: string;
  menuCollapse: boolean;
  layout: 'default' | 'mix' | 'top' | 'columns';
  menuAccordion: boolean;
  menuDark: boolean;
  tab: boolean;
  tabMode: string;
  animate: boolean;
  animateMode: string;
  copyrightDisplay: boolean;
  siteConfig: Record<string, string>;
  toggleTheme: () => void;
  setThemeColor: (color: string) => void;
  setMenuCollapse: (collapse: boolean) => void;
  setLayout: (layout: AppState['layout']) => void;
  setSiteConfig: (config: Record<string, string>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      themeColor: '#165DFF',
      menuCollapse: false,
      layout: 'mix',
      menuAccordion: true,
      menuDark: false,
      tab: true,
      tabMode: 'card-gutter',
      animate: false,
      animateMode: 'zoom-fade',
      copyrightDisplay: true,
      siteConfig: {},
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          return { theme: newTheme };
        }),
      setThemeColor: (color) => set({ themeColor: color }),
      setMenuCollapse: (collapse) => set({ menuCollapse: collapse }),
      setLayout: (layout) => set({ layout }),
      setSiteConfig: (config) => set({ siteConfig: config }),
    }),
    { name: 'app-store' },
  ),
);
```

- [ ] **Step 2: Create useUserStore.ts**

```typescript
// src/stores/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setToken, clearToken } from '@/utils/auth';
import * as authApi from '@/services/auth';

interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  gender: 0 | 1 | 2;
  email: string;
  phone: string;
  avatar: string;
  pwdResetTime: string;
  pwdExpired: boolean;
  registrationDate: string;
  deptName: string;
  roles: string[];
  roleNames: string[];
  permissions: string[];
}

interface UserState {
  token: string;
  userInfo: UserInfo | null;
  roles: string[];
  permissions: string[];
  pwdExpiredShow: boolean;
  login: (params: any) => Promise<void>;
  getInfo: () => Promise<UserInfo>;
  logout: () => Promise<void>;
  resetToken: () => void;
  setPwdExpiredShow: (show: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: '',
      userInfo: null,
      roles: [],
      permissions: [],
      pwdExpiredShow: false,
      login: async (params) => {
        const res = await authApi.accountLogin(params);
        setToken(res.data.token);
        set({ token: res.data.token });
      },
      getInfo: async () => {
        const res = await authApi.getUserInfo();
        const userInfo = res.data;
        set({
          userInfo,
          roles: userInfo.roles,
          permissions: userInfo.permissions,
          pwdExpiredShow: userInfo.pwdExpired,
        });
        return userInfo;
      },
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          clearToken();
          set({ token: '', userInfo: null, roles: [], permissions: [] });
        }
      },
      resetToken: () => {
        clearToken();
        set({ token: '', userInfo: null, roles: [], permissions: [] });
      },
      setPwdExpiredShow: (show) => set({ pwdExpiredShow: show }),
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        token: state.token,
        roles: state.roles,
        permissions: state.permissions,
        pwdExpiredShow: state.pwdExpiredShow,
      }),
    },
  ),
);
```

- [ ] **Step 3: Create useRouteStore.ts**

```typescript
// src/stores/useRouteStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '@/services/auth';
import { history } from 'umi';

interface RouteItem {
  id: string;
  title: string;
  parentId: string;
  type: 1 | 2 | 3;
  path: string;
  name: string;
  component: string;
  redirect: string;
  icon: string;
  isExternal: boolean;
  isHidden: boolean;
  isCache: boolean;
  permission: string;
  roles: string[];
  sort: number;
  status: 0 | 1;
  children: RouteItem[];
  activeMenu: string;
  alwaysShow: boolean;
  breadcrumb: boolean;
  showInTabs: boolean;
  affix: boolean;
}

interface RouteState {
  routes: RouteItem[];
  asyncRoutes: RouteItem[];
  firstRoutePath: string;
  generateRoutes: () => Promise<RouteItem[]>;
}

export const useRouteStore = create<RouteState>()(
  persist(
    (set, get) => ({
      routes: [],
      asyncRoutes: [],
      firstRoutePath: '/dashboard/workplace',
      generateRoutes: async () => {
        const res = await authApi.getUserRoute();
        const asyncRoutes = res.data || [];
        const firstRoutePath = findFirstRoutePath(asyncRoutes) || '/dashboard/workplace';
        set({ asyncRoutes, firstRoutePath });
        return asyncRoutes;
      },
    }),
    { name: 'route-store' },
  ),
);

function findFirstRoutePath(routes: RouteItem[]): string | null {
  for (const route of routes) {
    if (route.path && route.type === 2 && !route.isHidden) {
      return route.path;
    }
    if (route.children?.length) {
      const path = findFirstRoutePath(route.children);
      if (path) return path;
    }
  }
  return null;
}
```

- [ ] **Step 4: Create useTabsStore.ts**

```typescript
// src/stores/useTabsStore.ts
import { create } from 'zustand';

interface TabItem {
  path: string;
  title: string;
  closable: boolean;
}

interface TabsState {
  tabList: TabItem[];
  cacheList: string[];
  reloadFlag: boolean;
  addTabItem: (tab: TabItem) => void;
  deleteTabItem: (path: string) => void;
  clearTabList: () => void;
  closeCurrent: (path: string) => void;
  closeOther: (path: string) => void;
  closeLeft: (path: string) => void;
  closeRight: (path: string) => void;
  closeAll: () => void;
  reloadPage: () => void;
}

export const useTabsStore = create<TabsState>()((set, get) => ({
  tabList: [],
  cacheList: [],
  reloadFlag: false,
  addTabItem: (tab) =>
    set((state) => {
      if (state.tabList.some((t) => t.path === tab.path)) return state;
      return { tabList: [...state.tabList, tab] };
    }),
  deleteTabItem: (path) =>
    set((state) => ({
      tabList: state.tabList.filter((t) => t.path !== path),
    })),
  clearTabList: () => set({ tabList: [] }),
  closeCurrent: (path) => {
    const { tabList } = get();
    const idx = tabList.findIndex((t) => t.path === path);
    if (idx > -1 && tabList[idx].closable) {
      set({ tabList: tabList.filter((t) => t.path !== path) });
    }
  },
  closeOther: (path) => {
    set((state) => ({
      tabList: state.tabList.filter((t) => t.path === path || !t.closable),
    }));
  },
  closeLeft: (path) => {
    const { tabList } = get();
    const idx = tabList.findIndex((t) => t.path === path);
    set({ tabList: tabList.filter((t, i) => i >= idx || !t.closable) });
  },
  closeRight: (path) => {
    const { tabList } = get();
    const idx = tabList.findIndex((t) => t.path === path);
    set({ tabList: tabList.filter((t, i) => i <= idx || !t.closable) });
  },
  closeAll: () => {
    set((state) => ({
      tabList: state.tabList.filter((t) => !t.closable),
    }));
  },
  reloadPage: () => {
    set({ reloadFlag: true });
    setTimeout(() => set({ reloadFlag: false }), 300);
  },
}));
```

- [ ] **Step 5: Create useDictStore.ts**

```typescript
// src/stores/useDictStore.ts
import { create } from 'zustand';

interface DictItem {
  label: string;
  value: string | number;
  color?: string;
  tag?: string;
}

interface DictState {
  dictData: Record<string, DictItem[]>;
  setDict: (code: string, data: DictItem[]) => void;
  getDict: (code: string) => DictItem[] | undefined;
  deleteDict: (code: string) => void;
  cleanDict: () => void;
}

export const useDictStore = create<DictState>()((set, get) => ({
  dictData: {},
  setDict: (code, data) =>
    set((state) => ({ dictData: { ...state.dictData, [code]: data } })),
  getDict: (code) => get().dictData[code],
  deleteDict: (code) =>
    set((state) => {
      const { [code]: _, ...rest } = state.dictData;
      return { dictData: rest };
    }),
  cleanDict: () => set({ dictData: {} }),
}));
```

- [ ] **Step 6: Create useTenantStore.ts**

```typescript
// src/stores/useTenantStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantState {
  tenantEnabled: boolean;
  tenantId: string;
  needInputTenantCode: boolean;
  setTenantEnable: (enabled: boolean) => void;
  setTenantId: (id: string) => void;
  resetTenantId: () => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenantEnabled: false,
      tenantId: '',
      needInputTenantCode: true,
      setTenantEnable: (enabled) => set({ tenantEnabled: enabled }),
      setTenantId: (id) => set({ tenantId: id }),
      resetTenantId: () => set({ tenantId: '' }),
    }),
    {
      name: 'tenant-store',
      partialize: (state) => ({
        tenantEnabled: state.tenantEnabled,
        tenantId: state.tenantId,
      }),
    },
  ),
);
```

### Task 5: Create Service Layer (API)

**Files:**
- Create: `src/services/api.ts` (base wrapper)
- Create: `src/services/auth.ts`
- Create: `src/services/captcha.ts`
- Create: `src/services/dashboard.ts`
- Create: `src/services/task.ts`
- Create: `src/services/system/user.ts` through all system services
- Create: `src/services/monitor/*.ts`
- Create: `src/services/schedule/*.ts`
- Create: `src/services/open/app.ts`
- Create: `src/services/tenant/*.ts`
- Create: `src/services/code/generator.ts`
- Create: `src/services/area.ts`

- [ ] **Step 1: Create services/api.ts**

```typescript
// src/services/api.ts
import { request } from 'umi';

const API_PREFIX = process.env.VITE_API_PREFIX || '/sss-task';

function createApi(basePath: string) {
  return {
    list: <T = any>(params?: any) =>
      request<any>(`${API_PREFIX}${basePath}`, { method: 'GET', params }),
    get: <T = any>(id: string) =>
      request<any>(`${API_PREFIX}${basePath}/${id}`, { method: 'GET' }),
    create: <T = any>(data: any) =>
      request<any>(`${API_PREFIX}${basePath}`, { method: 'POST', data }),
    update: <T = any>(id: string, data: any) =>
      request<any>(`${API_PREFIX}${basePath}/${id}`, { method: 'PUT', data }),
    delete: <T = any>(data: any) =>
      request<any>(`${API_PREFIX}${basePath}`, { method: 'DELETE', data }),
  };
}

export default createApi;
```

- [ ] **Step 2: Create services/auth.ts**

```typescript
// src/services/auth.ts
import { request } from 'umi';

const API_PREFIX = process.env.VITE_API_PREFIX || '/sss-task';

export function accountLogin(data: {
  username: string;
  password: string;
  captcha: string;
  uuid: string;
}) {
  return request<any>(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    data,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function phoneLogin(data: { phone: string; captcha: string }) {
  return request<any>(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    data: { ...data, authType: 'PHONE' },
  });
}

export function emailLogin(data: { email: string; captcha: string }) {
  return request<any>(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    data: { ...data, authType: 'EMAIL' },
  });
}

export function socialAuth(source: string) {
  return request<any>(`${API_PREFIX}/auth/${source}`, { method: 'GET' });
}

export function logout() {
  return request<any>(`${API_PREFIX}/auth/logout`, { method: 'POST' });
}

export function getUserInfo() {
  return request<any>(`${API_PREFIX}/auth/user/info`, { method: 'GET' });
}

export function getUserRoute() {
  return request<any>(`${API_PREFIX}/auth/user/route`, { method: 'GET' });
}
```

- [ ] **Step 3: Create remaining service files**

All service files follow the same pattern. Key files to create:

**src/services/captcha.ts** — image/sms/mail/behavior captcha endpoints
**src/services/dashboard.ts** — notice, overview, geo, timeslot, module, os, browser analytics
**src/services/task.ts** — full task CRUD, progress, attachments, comments, categories, stats, urge
**src/services/system/user.ts** — user CRUD, import/export, password reset, role assignment
**src/services/system/role.ts** — role CRUD, permission tree, user-role management
**src/services/system/menu.ts** — menu tree CRUD, cache clearing
**src/services/system/dept.ts** — dept tree CRUD, export
**src/services/system/dict.ts** — dict + dict item CRUD, cache clearing
**src/services/system/notice.ts** — notice CRUD
**src/services/system/file.ts** — file upload, list, dir, recycle bin
**src/services/system/storage.ts** — storage provider CRUD
**src/services/system/client.ts** — client app CRUD
**src/services/system/option.ts** — system option CRUD
**src/services/system/common.ts** — common dict, site option, file upload, tenant status
**src/services/system/smsConfig.ts** — SMS config CRUD
**src/services/system/smsLog.ts** — SMS log list/delete/export
**src/services/system/userProfile.ts** — avatar, basic info, password, phone, email, social
**src/services/system/userMessage.ts** — messages, notices, read/unread
**src/services/monitor/online.ts** — online user list, kickout
**src/services/monitor/log.ts** — log list, detail, export
**src/services/schedule/job.ts** — job CRUD, status, trigger
**src/services/schedule/log.ts** — job log list, stop, retry
**src/services/open/app.ts** — app CRUD, secret management
**src/services/tenant/common.ts** — tenant by domain
**src/services/tenant/management.ts** — tenant CRUD, admin password
**src/services/tenant/package.ts** — package CRUD, dict, menu tree
**src/services/code/generator.ts** — config, field, preview, download, generate
**src/services/area.ts** — province/city/area list

*(Each file follows the pattern of importing `request` from umi, defining the API_PREFIX, and exporting typed functions for each endpoint. Full code for each is in the source project's `src/apis/` directory.)*

### Task 6: Create Constants

**Files:**
- Create: `src/constants/common.ts`
- Create: `src/constants/file.ts`
- Create: `src/constants/task.ts`

- [ ] **Step 1: Create constants/common.ts**

```typescript
// src/constants/common.ts
export const DisEnableStatusList = [
  { label: '启用', value: 1, color: 'green' },
  { label: '禁用', value: 2, color: 'red' },
];

export const GenderList = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
  { label: '未知', value: 0 },
];
```

- [ ] **Step 2: Create constants/file.ts**

```typescript
// src/constants/file.ts
export const FileTypeList = [
  { name: '全部', value: 0 },
  { name: '图片', value: 2 },
  { name: '文档', value: 3 },
  { name: '视频', value: 4 },
  { name: '音频', value: 5 },
  { name: '其他', value: 1 },
];

export const FileIcon: Record<string, string> = {
  mp3: 'icon-mp3', mp4: 'icon-mp4', dir: 'icon-dir',
  ppt: 'icon-ppt', doc: 'icon-doc', docx: 'icon-doc',
  xls: 'icon-xls', xlsx: 'icon-xls', txt: 'icon-txt',
  rar: 'icon-rar', zip: 'icon-zip', html: 'icon-html',
};

export const ImageTypes = ['jpg', 'png', 'gif', 'jpeg'];
export const OfficeTypes = ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'pdf'];
export const WordTypes = ['doc', 'docx'];
export const ExcelTypes = ['xls', 'xlsx'];
export const DirTypes = ['dir'];
```

- [ ] **Step 3: Create constants/task.ts**

```typescript
// src/constants/task.ts
export type TaskStatus = 'pending' | 'in_progress' | 'submitted' | 'completed' | 'at_risk' | 'blocked';
export type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3';

export const STATUS_MAP: Record<TaskStatus, string> = {
  pending: '待开始',
  in_progress: '进行中',
  submitted: '已提报',
  completed: '已完成',
  at_risk: '有风险',
  blocked: '已阻塞',
};

export const STATUS_REVERSE_MAP = Object.fromEntries(
  Object.entries(STATUS_MAP).map(([k, v]) => [v, k]),
) as Record<string, TaskStatus>;

export const STATUS_COLOR_MAP: Record<TaskStatus, string> = {
  pending: 'default',
  in_progress: 'processing',
  submitted: 'warning',
  completed: 'success',
  at_risk: 'error',
  blocked: 'error',
};

export const PRIORITY_COLOR_MAP: Record<TaskPriority, string> = {
  P0: 'red',
  P1: 'orange',
  P2: 'blue',
  P3: 'default',
};

export const URGEABLE_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'at_risk', 'blocked'];
```

### Task 7: Create Custom Hooks

**Files:**
- Create: `src/hooks/useLoading.ts`
- Create: `src/hooks/usePagination.ts`
- Create: `src/hooks/useTable.ts`
- Create: `src/hooks/useBreakpoint.ts`
- Create: `src/hooks/useDevice.ts`
- Create: `src/hooks/useDownload.ts`
- Create: `src/hooks/useDict.ts`
- Create: `src/hooks/useDept.ts`
- Create: `src/hooks/useMenu.ts`
- Create: `src/hooks/useRole.ts`
- Create: `src/hooks/usePermission.ts`

- [ ] **Step 1: Create useLoading.ts**

```typescript
// src/hooks/useLoading.ts
import { useState, useCallback } from 'react';

export function useLoading(initial = false) {
  const [loading, setLoading] = useState(initial);
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  const toggleLoading = useCallback(() => setLoading((prev) => !prev), []);
  return { loading, setLoading, startLoading, stopLoading, toggleLoading };
}
```

- [ ] **Step 2: Create usePagination.ts**

```typescript
// src/hooks/usePagination.ts
import { useState, useCallback } from 'react';

export function usePagination(defaultPageSize = 10) {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [total, setTotal] = useState(0);

  const onChange = useCallback((page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  }, []);

  return { current, pageSize, total, setCurrent, setPageSize, setTotal, onChange };
}
```

- [ ] **Step 3: Create useTable.ts**

```typescript
// src/hooks/useTable.ts
import { useState, useCallback, useRef } from 'react';
import { message, Modal } from 'antd';
import { usePagination } from './useLoading';

interface UseTableOptions {
  api: (params: any) => Promise<any>;
  deleteApi?: (ids: string[]) => Promise<any>;
  defaultPageSize?: number;
  immediate?: boolean;
}

export function useTable<T = any>(options: UseTableOptions) {
  const { api, deleteApi, defaultPageSize = 10, immediate = true } = options;
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const pagination = usePagination(defaultPageSize);
  const queryParams = useRef<any>({});

  const fetchData = useCallback(
    async (params?: any) => {
      if (params) queryParams.current = params;
      setLoading(true);
      try {
        const res = await api({
          page: pagination.current,
          size: pagination.pageSize,
          ...queryParams.current,
        });
        setDataSource(res.data?.list || []);
        pagination.setTotal(res.data?.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize],
  );

  const handleDelete = useCallback(
    (id: string) => {
      if (!deleteApi) return;
      Modal.confirm({
        title: '确认删除？',
        content: '删除后将无法恢复',
        onOk: async () => {
          await deleteApi([id]);
          message.success('删除成功');
          fetchData();
        },
      });
    },
    [deleteApi, fetchData],
  );

  const handleBatchDelete = useCallback(() => {
    if (!deleteApi || !selectedRowKeys.length) return;
    Modal.confirm({
      title: `确认删除选中的 ${selectedRowKeys.length} 条数据？`,
      onOk: async () => {
        await deleteApi(selectedRowKeys);
        message.success('删除成功');
        setSelectedRowKeys([]);
        fetchData();
      },
    });
  }, [deleteApi, selectedRowKeys, fetchData]);

  const handleSearch = useCallback(
    (params: any) => {
      queryParams.current = params;
      pagination.setCurrent(1);
      fetchData(params);
    },
    [fetchData],
  );

  const handleReset = useCallback(() => {
    queryParams.current = {};
    pagination.setCurrent(1);
    fetchData({});
  }, [fetchData]);

  return {
    dataSource,
    loading,
    pagination,
    selectedRowKeys,
    setSelectedRowKeys,
    fetchData,
    handleDelete,
    handleBatchDelete,
    handleSearch,
    handleReset,
  };
}
```

- [ ] **Step 4: Create remaining hooks**

**useBreakpoint.ts** — responsive breakpoint detection (xs/sm/md/lg/xl/xxl)
**useDevice.ts** — isMobile/isDesktop detection
**useDownload.ts** — blob file download helper
**useDict.ts** — dictionary loading with caching (calls listCommonDict)
**useDept.ts** — department tree loading
**useMenu.ts** — menu tree loading
**useRole.ts** — role list loading
**usePermission.ts** — wraps has.ts for React components

*(Full implementations available in source project's `src/hooks/` directory)*

### Task 8: Create App Runtime Config

**Files:**
- Create: `src/app.tsx`
- Create: `src/global.less`
- Create: `src/tailwind.css`

- [ ] **Step 1: Create src/app.tsx**

```typescript
// src/app.tsx
import { history } from 'umi';
import { getToken } from '@/utils/auth';
import { useUserStore } from '@/stores/useUserStore';
import { useRouteStore } from '@/stores/useRouteStore';
import type { RequestConfig } from 'umi';

// Layout config
export const layout = () => {
  return {
    logo: '/logo.png',
    menu: { locale: false },
    layout: 'mix',
  };
};

// Request config
export const request: RequestConfig = {
  timeout: 30000,
  requestInterceptors: [
    (config: any) => {
      const token = getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      return response;
    },
  ],
};

// Initial state
export async function getInitialState() {
  const token = getToken();
  if (token) {
    try {
      const userInfo = await useUserStore.getState().getInfo();
      return { userInfo };
    } catch {
      return { userInfo: null };
    }
  }
  return { userInfo: null };
}

// Route guard
export function onRouteChange({ location }: { location: any }) {
  const token = getToken();
  const whiteList = ['/login', '/social/callback', '/pwdExpired', '/corp-select'];

  if (!token && !whiteList.includes(location.pathname)) {
    history.push('/login');
  }
}
```

- [ ] **Step 2: Create src/global.less**

```less
// src/global.less
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

.ant-layout {
  min-height: 100vh;
}
```

- [ ] **Step 3: Create src/tailwind.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Run initial build to verify**

Run: `cd D:/code/umi4-admin && pnpm dev`
Expected: Dev server starts without errors

- [ ] **Step 5: Commit**

```bash
git init
git add -A
git commit -m "feat: initialize umi4 project with foundation infrastructure"
```

---

## SUB-PLAN 02: AUTH & LOGIN

### Task 9: Create Login Page

**Files:**
- Create: `src/pages/login/index.tsx`
- Create: `src/pages/login/components/AccountForm.tsx`
- Create: `src/pages/login/components/PhoneForm.tsx`
- Create: `src/pages/login/components/EmailForm.tsx`
- Create: `src/pages/login/components/SocialLogin.tsx`
- Create: `src/pages/login/components/BgAnimation.tsx`

- [ ] **Step 1: Create login page structure**

The login page replicates the Vue source's split layout: banner image on left, login form on right (desktop), full-width form (mobile). Features:
- Account login (username + RSA-encrypted password + image captcha)
- Phone login (phone + SMS captcha)
- Email login (email + captcha)
- OAuth social login buttons (SSO, Gitee, GitHub, WeChat)
- Tenant code input (when multi-tenant enabled)
- Remember me checkbox
- Responsive design
- Animated background

```tsx
// src/pages/login/index.tsx
import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { useUserStore } from '@/stores/useUserStore';
import { useTenantStore } from '@/stores/useTenantStore';
import { Tabs, Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import AccountForm from './components/AccountForm';
import PhoneForm from './components/PhoneForm';
import EmailForm from './components/EmailForm';
import SocialLogin from './components/SocialLogin';
import { encryptByRsa } from '@/utils/encrypt';
import * as captchaApi from '@/services/captcha';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [captchaImg, setCaptchaImg] = useState('');
  const [captchaUuid, setCaptchaUuid] = useState('');
  const login = useUserStore((s) => s.login);
  const tenantEnabled = useTenantStore((s) => s.tenantEnabled);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = async () => {
    const res = await captchaApi.getImageCaptcha();
    if (res.data) {
      setCaptchaImg(res.data.img);
      setCaptchaUuid(res.data.uuid);
    }
  };

  const handleLogin = async (values: any) => {
    try {
      if (activeTab === 'account') {
        await login({
          username: values.username,
          password: encryptByRsa(values.password),
          captcha: values.captcha,
          uuid: captchaUuid,
        });
      } else if (activeTab === 'phone') {
        await login({ phone: values.phone, captcha: values.captcha, authType: 'PHONE' });
      } else {
        await login({ email: values.email, captcha: values.captcha, authType: 'EMAIL' });
      }
      message.success('登录成功');
      history.push('/');
    } catch (e) {
      refreshCaptcha();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">SSS Admin</h1>
          <p className="text-lg opacity-80">后台管理系统</p>
        </div>
      </div>
      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-8 text-center">登录</h2>
          <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
            <Tabs.TabPane tab="账号登录" key="account">
              <AccountForm
                onSubmit={handleLogin}
                captchaImg={captchaImg}
                onRefreshCaptcha={refreshCaptcha}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="手机号登录" key="phone">
              <PhoneForm onSubmit={handleLogin} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="邮箱登录" key="email">
              <EmailForm onSubmit={handleLogin} />
            </Tabs.TabPane>
          </Tabs>
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
```

- [ ] **Step 2: Create AccountForm component**

```tsx
// src/pages/login/components/AccountForm.tsx
import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

interface Props {
  onSubmit: (values: any) => void;
  captchaImg: string;
  onRefreshCaptcha: () => void;
}

const AccountForm: React.FC<Props> = ({ onSubmit, captchaImg, onRefreshCaptcha }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} onFinish={onSubmit} size="large">
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input prefix={<UserOutlined />} placeholder="用户名" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
      </Form.Item>
      <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
        <div className="flex gap-2">
          <Input prefix={<SafetyCertificateOutlined />} placeholder="验证码" />
          <div
            className="w-28 h-10 cursor-pointer border rounded overflow-hidden"
            onClick={onRefreshCaptcha}
            dangerouslySetInnerHTML={{ __html: captchaImg }}
          />
        </div>
      </Form.Item>
      <Form.Item>
        <div className="flex justify-between items-center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
        </div>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AccountForm;
```

- [ ] **Step 3: Create PhoneForm, EmailForm, SocialLogin, BgAnimation components**

*(PhoneForm: phone input + SMS captcha + send button with countdown. EmailForm: email input + captcha. SocialLogin: OAuth buttons row. BgAnimation: CSS animated background.)*

- [ ] **Step 4: Create error pages**

**src/pages/403.tsx** — Forbidden page with icon and back button
**src/pages/404.tsx** — Not Found page with icon and home button
**src/pages/redirect/index.tsx** — Redirect helper component

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement login page with account/phone/email auth and social login"
```

---

## SUB-PLAN 03: LAYOUT & NAVIGATION

### Task 10: Create Layout System

**Files:**
- Create: `src/layouts/index.tsx`
- Create: `src/layouts/DefaultLayout.tsx`
- Create: `src/layouts/MixLayout.tsx`
- Create: `src/layouts/TopLayout.tsx`
- Create: `src/layouts/ColumnsLayout.tsx`
- Create: `src/layouts/components/Asider/index.tsx`
- Create: `src/layouts/components/Header/index.tsx`
- Create: `src/layouts/components/Header/HeaderRightBar.tsx`
- Create: `src/layouts/components/Tabs/index.tsx`
- Create: `src/layouts/components/Menu/index.tsx`

- [ ] **Step 1: Create layout selector**

```tsx
// src/layouts/index.tsx
import React from 'react';
import { useAppStore } from '@/stores/useAppStore';
import DefaultLayout from './DefaultLayout';
import MixLayout from './MixLayout';
import TopLayout from './TopLayout';
import ColumnsLayout from './ColumnsLayout';

const LayoutIndex: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const layout = useAppStore((s) => s.layout);

  const LayoutMap: Record<string, React.FC<{ children: React.ReactNode }>> = {
    default: DefaultLayout,
    mix: MixLayout,
    top: TopLayout,
    columns: ColumnsLayout,
  };

  const Layout = LayoutMap[layout] || DefaultLayout;
  return <Layout>{children}</Layout>;
};

export default LayoutIndex;
```

- [ ] **Step 2: Create DefaultLayout**

```tsx
// src/layouts/DefaultLayout.tsx
import React from 'react';
import { Layout } from 'antd';
import Asider from './components/Asider';
import Header from './components/Header';
import Tabs from './components/Tabs';
import GiFooter from '@/components/GiFooter';

const { Content } = Layout;

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      <Asider />
      <Layout>
        <Header />
        <Tabs />
        <Content className="p-4 bg-gray-50">
          {children}
        </Content>
        <GiFooter />
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
```

- [ ] **Step 3: Create Asider component**

The Asider contains Logo + collapsible sidebar menu (230px width). Supports dark menu theme.

- [ ] **Step 4: Create Header component**

The Header contains: MenuFoldBtn (collapse toggle), Breadcrumb, HeaderRightBar (search, settings, notifications, fullscreen, theme toggle, user dropdown).

- [ ] **Step 5: Create HeaderRightBar**

Contains: global menu search, settings drawer (theme/layout/dark mode), notification badge, fullscreen toggle, theme toggle, user dropdown (profile/messages/logout).

- [ ] **Step 6: Create Tabs component**

Multi-tab navigation with context menu (reload, close current/left/right/other/all).

- [ ] **Step 7: Create Menu component**

Renders route-based menu items, supports accordion, collapse, external links, icons.

- [ ] **Step 8: Create MixLayout, TopLayout, ColumnsLayout**

- MixLayout: Left 2-level vertical menu + right horizontal 1-level menu at top
- TopLayout: Top horizontal menu bar
- ColumnsLayout: Multi-column sidebar

- [ ] **Step 9: Create GiFooter component**

```tsx
// src/components/GiFooter/index.tsx
import React from 'react';
import { useAppStore } from '@/stores/useAppStore';

const GiFooter: React.FC = () => {
  const { copyrightDisplay, siteConfig } = useAppStore();
  if (!copyrightDisplay) return null;

  return (
    <div className="text-center py-4 text-gray-400 text-sm">
      {siteConfig.SITE_COPYRIGHT || 'Copyright © 2024 SSS Admin'}
      {siteConfig.SITE_BEIAN && <span className="ml-2">{siteConfig.SITE_BEIAN}</span>}
    </div>
  );
};

export default GiFooter;
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: implement layout system with 4 layout modes and navigation components"
```

---

## SUB-PLAN 04: COCKPIT DASHBOARD (CORE FEATURE)

### Task 11: Create Cockpit Dashboard

**Files:**
- Create: `src/pages/dashboard/cockpit/index.tsx`
- Create: `src/pages/dashboard/cockpit/components/Sidebar.tsx`
- Create: `src/pages/dashboard/cockpit/components/TopBar.tsx`
- Create: `src/pages/dashboard/cockpit/components/StatsSection.tsx`
- Create: `src/pages/dashboard/cockpit/components/Toolbar.tsx`
- Create: `src/pages/dashboard/cockpit/components/TaskKanban.tsx`
- Create: `src/pages/dashboard/cockpit/components/TaskTable.tsx`
- Create: `src/pages/dashboard/cockpit/components/TaskGantt.tsx`
- Create: `src/pages/dashboard/cockpit/components/AddTaskModal.tsx`
- Create: `src/pages/dashboard/cockpit/components/UpdateTaskModal.tsx`
- Create: `src/pages/dashboard/cockpit/hooks/useTasks.ts`
- Create: `src/pages/dashboard/cockpit/hooks/useUrge.ts`

- [ ] **Step 1: Create useTasks hook**

```typescript
// src/pages/dashboard/cockpit/hooks/useTasks.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import * as taskApi from '@/services/task';
import type { TaskStatus, TaskPriority } from '@/constants/task';

type ViewMode = 'kanban' | 'table' | 'gantt';

interface ChipKey {
  status?: TaskStatus;
  priority?: TaskPriority;
  authorized?: boolean;
  overdue?: boolean;
}

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeChips, setActiveChips] = useState<ChipKey>({});
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [kanbanPage, setKanbanPage] = useState(1);
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const debounceRef = useRef<any>(null);

  const buildQuery = useCallback(() => {
    const query: any = {};
    if (keyword) query.keyword = keyword;
    if (activeCategory) query.categoryId = activeCategory;
    if (activeChips.status) query.status = [activeChips.status];
    if (activeChips.priority) query.priority = [activeChips.priority];
    if (activeChips.authorized) query.authorized = true;
    if (activeChips.overdue) query.overdue = true;
    return query;
  }, [keyword, activeCategory, activeChips]);

  const fetchTasks = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const query = buildQuery();
      const page = viewMode === 'kanban' ? kanbanPage : tablePage;
      const size = viewMode === 'kanban' ? 20 : tablePageSize;
      const res = await taskApi.listTaskItems({ ...query, page, size });
      const list = res.data?.list || [];
      if (reset || viewMode === 'table' || page === 1) {
        setTasks(list);
      } else {
        setTasks((prev) => [...prev, ...list]);
      }
      setTotal(res.data?.total || 0);
      setHasMore(list.length === size);
    } finally {
      setLoading(false);
    }
  }, [buildQuery, viewMode, kanbanPage, tablePage, tablePageSize]);

  const fetchStats = useCallback(async () => {
    const query = buildQuery();
    delete query.page;
    delete query.size;
    delete query.sort;
    const res = await taskApi.getTaskStats(query);
    setStats(res.data);
  }, [buildQuery]);

  const fetchCategories = useCallback(async () => {
    const res = await taskApi.listTaskCategoriesPermitted();
    setCategories(res.data || []);
  }, []);

  const toggleChip = useCallback((chip: ChipKey) => {
    setActiveChips((prev) => {
      const key = Object.keys(chip)[0] as keyof ChipKey;
      if (prev[key] === chip[key]) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, ...chip };
    });
  }, []);

  const clearChips = useCallback(() => setActiveChips({}), []);

  const onKeywordChange = useCallback((value: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setKeyword(value), 300);
  }, []);

  useEffect(() => {
    fetchTasks(true);
    fetchStats();
  }, [activeCategory, activeChips, keyword, viewMode]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    tasks, stats, categories, loading, keyword,
    activeCategory, setActiveCategory,
    activeChips, toggleChip, clearChips,
    viewMode, setViewMode,
    kanbanPage, setKanbanPage,
    tablePage, setTablePage,
    tablePageSize, setTablePageSize,
    total, hasMore,
    fetchTasks, fetchStats, fetchCategories,
    onKeywordChange,
  };
}
```

- [ ] **Step 2: Create useUrge hook**

```typescript
// src/pages/dashboard/cockpit/hooks/useUrge.ts
import { useCallback } from 'react';
import { message } from 'antd';
import * as taskApi from '@/services/task';
import { URGEABLE_STATUSES } from '@/constants/task';

export function useUrge() {
  const canUrge = useCallback((status: string) => {
    return URGEABLE_STATUSES.includes(status as any);
  }, []);

  const urge = useCallback(async (taskId: string) => {
    await taskApi.urgeTaskItem(taskId);
    message.success('催办成功');
  }, []);

  return { canUrge, urge };
}
```

- [ ] **Step 3: Create cockpit main page**

The cockpit page is the most complex UI. It contains:
- **Sidebar** (220px): Brand area, "+ 新增任务" button, status/priority filter chips with counts, user info
- **TopBar**: Title, subtitle, update time, theme toggle, refresh
- **StatsSection**: 6 stat cards (总事项, 进行中, 已完成, 有风险, 已阻塞, 已逾期)
- **AlertBar**: P0 count warning
- **Category Tabs**: "全部" + category names
- **Toolbar**: Search, filter chips, view toggle (看板/表格/甘特)
- **Three views**: Kanban, Table, Gantt

- [ ] **Step 4: Create TaskKanban**

Card grid with `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`. Each card shows:
- Accent color bar (left edge, color by priority)
- Title + code badge
- Description (truncated)
- Progress section
- Status/priority/category tags
- Owner avatar(s) with stack for multi-owner
- Start/due dates
- Urge/delete action buttons
- Infinite scroll with IntersectionObserver

- [ ] **Step 5: Create TaskTable**

ProTable with columns: 编号, 标题, 状态, 重要程度, 分类, 负责人, 截止日期, 主要内容, 最新进展, 操作(催办/删除). Pagination with page size options 10/20/50.

- [ ] **Step 6: Create TaskGantt**

Full gantt chart with:
- Day/week/month view modes
- Time scale header
- Virtual scrolling for large datasets
- Task bars with progress fill
- Today line indicator
- Mouse drag scrolling
- Grouped by business category
- Click bar to open task detail

*(The Gantt chart is a custom implementation using CSS grid/flexbox, not a library)*

- [ ] **Step 7: Create AddTaskModal**

Fields: 任务名称(max 60), 负责人(multi-select from API), 优先级(P0-P3), 所属分类, 预计开始(date), 截止日期(date), 事项描述(max 500), 当前进展(max 500). Validation: title required, ownerUserIds required (min 1), priority required, categoryId required, dueDate required, description required.

- [ ] **Step 8: Create UpdateTaskModal**

Dual-mode modal showing task detail + edit forms. Has "basic info" and "progress update" tabs based on permissions. Includes:
- Full progress timeline
- Edit/delete/comment on progress entries
- Attachment upload per progress entry
- Comment system (add/edit/delete)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: implement cockpit dashboard with kanban/table/gantt views and task CRUD"
```

---

## SUB-PLAN 05: TASK & CATEGORY MANAGEMENT

### Task 12: Create Task List Page

**Files:**
- Create: `src/pages/dashboard/task/index.tsx`
- Create: `src/pages/dashboard/task/components/AddModal.tsx`

- [ ] **Step 1: Create task list page**

ProTable with columns: 序号, 编号, 标题, 状态, 优先级, 分类, 负责人, 开始日期, 截止日期, 最新进展, 创建时间, 修改时间, 操作.

Toolbar: keyword search, category select, status select, priority select, reset button, add button.

Operations: view detail, edit, delete.

- [ ] **Step 2: Create AddModal**

Same fields as cockpit AddTaskModal but supports both create and edit modes. Fetches task detail for edit, loads owner options from API.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: implement task list management page"
```

### Task 13: Create Category Management Page

**Files:**
- Create: `src/pages/dashboard/category/index.tsx`
- Create: `src/pages/dashboard/category/components/AddModal.tsx`

- [ ] **Step 1: Create category page**

ProTable with columns: 序号, 名称, 编码, 状态, 排序, 任务数, 描述, 创建时间, 修改时间, 操作.

Toolbar: search by name, reset, add button.

- [ ] **Step 2: Create AddModal**

Fields: code (regex: `^[a-z][\w-]{1,15}$/i`), name, sort, status (radio: 启用/禁用), description.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: implement category management page"
```

---

## SUB-PLAN 06: SYSTEM MANAGEMENT (12 pages)

### Task 14: Create User Management

**Files:**
- Create: `src/pages/system/user/index.tsx`
- Create: `src/pages/system/user/components/AddDrawer.tsx`
- Create: `src/pages/system/user/components/ImportDrawer.tsx`
- Create: `src/pages/system/user/components/DetailDrawer.tsx`
- Create: `src/pages/system/user/components/PwdResetModal.tsx`
- Create: `src/pages/system/user/components/RoleUpdateModal.tsx`
- Create: `src/pages/system/user/components/DeptTree.tsx`

- [ ] **Step 1: Create user page with GiPageLayout (DeptTree left panel + ProTable right)**

Columns: 序号, 昵称, 用户名, 状态, 性别, 所属部门, 角色, 手机号, 邮箱, 系统内置, 描述, 创建人, 创建时间, 修改人, 修改时间, 操作.

Operations: 新增, 导入, 导出, 详情, 修改, 重置密码, 分配角色, 删除.

- [ ] **Step 2: Create sub-components**

- AddDrawer: User creation/edit form with all fields
- ImportDrawer: File upload + preview for batch import
- DetailDrawer: Read-only user detail view
- PwdResetModal: New password input with confirmation
- RoleUpdateModal: Role checkbox selection with tree
- DeptTree: Department tree sidebar with search

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: implement user management with CRUD, import/export, role assignment"
```

### Task 15: Create Role Management

**Files:**
- Create: `src/pages/system/role/index.tsx`
- Create: `src/pages/system/role/components/RoleTree.tsx`
- Create: `src/pages/system/role/components/Permission.tsx`
- Create: `src/pages/system/role/components/RoleUser.tsx`

- [ ] **Step 1: Create role page**

GiPageLayout with RoleTree on left. Two tabs: 功能权限 (Permission tree) and 角色用户 (RoleUser table).

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement role management with permissions and user assignment"
```

### Task 16: Create Menu Management

**Files:**
- Create: `src/pages/system/menu/index.tsx`
- Create: `src/pages/system/menu/components/AddModal.tsx`

- [ ] **Step 1: Create menu page**

Tree table with expand/collapse. Columns: 菜单标题(with icon), 类型(目录/菜单/按钮), 状态, 排序, 路由地址, 组件名称, 组件路径, 权限标识, 外链, 隐藏, 缓存, 创建人, 创建时间, 修改人, 修改时间, 操作.

Toolbar: search by title/path/permission, reset, add, clear cache, expand/collapse.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement menu management with tree CRUD"
```

### Task 17: Create Department Management

**Files:**
- Create: `src/pages/system/dept/index.tsx`
- Create: `src/pages/system/dept/components/AddModal.tsx`

- [ ] **Step 1: Create dept page**

Tree table with columns: 名称, 状态, 排序, 系统内置, 描述, 创建人, 创建时间, 修改人, 修改时间, 操作.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement department management"
```

### Task 18: Create Dictionary Management

**Files:**
- Create: `src/pages/system/dict/index.tsx`
- Create: `src/pages/system/dict/components/DictTree.tsx`
- Create: `src/pages/system/dict/components/DictItemTable.tsx`
- Create: `src/pages/system/dict/components/AddDictModal.tsx`
- Create: `src/pages/system/dict/components/AddDictItemModal.tsx`

- [ ] **Step 1: Create dict page**

GiPageLayout with DictTree on left. DictItemTable on right. Columns: 序号, 标签(colored), 值, 状态, 排序, 描述, 创建人, 创建时间, 修改人, 修改时间, 操作. Clear cache per dictionary.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement dictionary management"
```

### Task 19: Create Notice Management

**Files:**
- Create: `src/pages/system/notice/index.tsx`
- Create: `src/pages/system/notice/components/AddDrawer.tsx`
- Create: `src/pages/system/notice/components/ViewDrawer.tsx`

- [ ] **Step 1: Create notice page**

ProTable with CRUD. AddDrawer with rich text editor for content. ViewDrawer for read-only display.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement notice management"
```

### Task 20: Create File Management

**Files:**
- Create: `src/pages/system/file/index.tsx`
- Create: `src/pages/system/file/components/FileMain.tsx`
- Create: `src/pages/system/file/components/FileSidebar.tsx`
- Create: `src/pages/system/file/components/RecycleBin.tsx`

- [ ] **Step 1: Create file management page**

Features: file upload, grid/list view toggle, folder creation, file rename, detail view, audio/video preview, recycle bin with restore/clean, file statistics, multipart upload support.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement file management with grid/list views and recycle bin"
```

### Task 21: Create System Config Pages (7 sub-pages)

**Files:**
- Create: `src/pages/system/config/site/index.tsx`
- Create: `src/pages/system/config/login/index.tsx`
- Create: `src/pages/system/config/security/index.tsx`
- Create: `src/pages/system/config/mail/index.tsx`
- Create: `src/pages/system/config/storage/index.tsx`
- Create: `src/pages/system/config/sms/index.tsx`
- Create: `src/pages/system/config/client/index.tsx`

- [ ] **Step 1: Create all config pages**

Each config page uses ProForm to edit system options. Site config: favicon, logo, title, copyright, ICP record. Login config: login method toggles. Security config: password policy, session timeout. Mail config: SMTP settings. Storage config: local/OSS provider settings. SMS config: SMS provider settings. Client config: OAuth client management.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement system configuration pages (7 sub-pages)"
```

---

## SUB-PLAN 07: MONITOR MODULE

### Task 22: Create Monitor Pages

**Files:**
- Create: `src/pages/monitor/online/index.tsx`
- Create: `src/pages/monitor/log/login/index.tsx`
- Create: `src/pages/monitor/log/operation/index.tsx`
- Create: `src/pages/monitor/log/operation/components/DetailDrawer.tsx`
- Create: `src/pages/monitor/sms/log/index.tsx`

- [ ] **Step 1: Create online user page**

ProTable with columns: 用户名, 部门, IP, 浏览器, OS, 登录时间. Operation: kickout (force logout).

- [ ] **Step 2: Create login log page**

ProTable with columns: 用户名, IP, 浏览器, OS, 登录时间, 状态, 描述. Export button.

- [ ] **Step 3: Create operation log page**

ProTable with columns: 模块, 操作, 操作人, IP, 耗时, 状态, 时间. DetailDrawer shows full request/response. Export button.

- [ ] **Step 4: Create SMS log page**

ProTable with columns: 手机号, 内容, 模板, 状态, 发送时间. Export button.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement monitor module (online users, logs, SMS log)"
```

---

## SUB-PLAN 08: SCHEDULE MODULE

### Task 23: Create Schedule Pages

**Files:**
- Create: `src/pages/schedule/job/index.tsx`
- Create: `src/pages/schedule/job/components/AddModal.tsx`
- Create: `src/pages/schedule/log/index.tsx`

- [ ] **Step 1: Create job management page**

ProTable with columns: 任务名称, 任务分组, 调用目标, cron表达式, 状态, 创建时间, 操作. Operations: add, edit, delete, trigger, toggle status. AddModal with cron expression builder.

- [ ] **Step 2: Create job log page**

ProTable with columns: 任务名称, 任务分组, 调用目标, 执行时间, 耗时, 状态, 操作. Operations: stop, retry.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: implement schedule module (jobs and logs)"
```

---

## SUB-PLAN 09: OPEN API & TENANT

### Task 24: Create Open API App Management

**Files:**
- Create: `src/pages/open/app/index.tsx`
- Create: `src/pages/open/app/components/AddDrawer.tsx`
- Create: `src/pages/open/app/components/DetailDrawer.tsx`

- [ ] **Step 1: Create app management page**

ProTable with CRUD. AddDrawer with app details. Secret management (view/reset).

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement open API app management"
```

### Task 25: Create Tenant Management

**Files:**
- Create: `src/pages/tenant/management/index.tsx`
- Create: `src/pages/tenant/management/components/AddModal.tsx`
- Create: `src/pages/tenant/package/index.tsx`
- Create: `src/pages/tenant/package/components/AddModal.tsx`

- [ ] **Step 1: Create tenant management page**

ProTable with CRUD. Admin password update. AddModal with tenant details.

- [ ] **Step 2: Create tenant package page**

ProTable with CRUD. Menu permission tree assignment.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: implement tenant management and packages"
```

---

## SUB-PLAN 10: CODE GENERATOR

### Task 26: Create Code Generator

**Files:**
- Create: `src/pages/code/generator/index.tsx`
- Create: `src/pages/code/generator/components/ConfigDrawer.tsx`
- Create: `src/pages/code/generator/components/PreviewModal.tsx`

- [ ] **Step 1: Create code generator page**

ProTable listing database tables. Operations: configure fields, preview code, download, generate. ConfigDrawer for field-level configuration. PreviewModal with syntax-highlighted code view.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement code generator with preview and download"
```

---

## SUB-PLAN 11: USER PROFILE & MESSAGES

### Task 27: Create User Profile Page

**Files:**
- Create: `src/pages/user/profile/index.tsx`
- Create: `src/pages/user/profile/components/BasicInfo.tsx`
- Create: `src/pages/user/profile/components/Security.tsx`
- Create: `src/pages/user/profile/components/SocialAccount.tsx`

- [ ] **Step 1: Create profile page**

Tabs: Basic info (nickname, gender, avatar), Security (password change, phone/email change with captcha), Social accounts (bind/unbind OAuth).

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: implement user profile page"
```

### Task 28: Create Message Center

**Files:**
- Create: `src/pages/user/message/index.tsx`
- Create: `src/pages/user/message/components/MyMessage.tsx`
- Create: `src/pages/user/message/components/MyNotice.tsx`
- Create: `src/pages/user/notice/index.tsx`

- [ ] **Step 1: Create message center**

Tabs: My messages (unread/read with mark read), My notices. Notice popup on login.

- [ ] **Step 2: Create notice view page**

Full notice content display with rich text rendering.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: implement message center and notice view"
```

---

## ADDITIONAL DASHBOARD PAGES

### Task 29: Create Workplace & Analysis Dashboards

**Files:**
- Create: `src/pages/dashboard/workplace/index.tsx`
- Create: `src/pages/dashboard/analysis/index.tsx`
- Create: `src/pages/dashboard/project-schedule/index.tsx`
- Create: `src/pages/dashboard/resource-board/index.tsx`

- [ ] **Step 1: Create workplace page**

Welcome component + QuickOperation + Notice components.

- [ ] **Step 2: Create analysis page**

Data overview cards, access trend chart (ECharts), geo distribution map, timeslot heatmap, browser/OS pie charts, module usage bar chart.

- [ ] **Step 3: Create project-schedule and resource-board pages**

Placeholder pages with basic structure (these are secondary views in the source project).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: implement workplace and analysis dashboards"
```

---

## SHARED COMPONENTS

### Task 30: Create Shared Components

**Files:**
- Create: `src/components/GiTable/index.tsx`
- Create: `src/components/GiForm/index.tsx`
- Create: `src/components/GiPageLayout/index.tsx`
- Create: `src/components/GiCell/GiCellAvatar.tsx`
- Create: `src/components/GiCell/GiCellStatus.tsx`
- Create: `src/components/GiCell/GiCellTag.tsx`
- Create: `src/components/GiCell/GiCellGender.tsx`
- Create: `src/components/Breadcrumb/index.tsx`
- Create: `src/components/UserSelect/index.tsx`
- Create: `src/components/FilePreview/index.tsx`
- Create: `src/components/Chart/index.tsx`
- Create: `src/components/DateRangePicker/index.tsx`
- Create: `src/components/GenCron/index.tsx`
- Create: `src/components/JsonPretty/index.tsx`
- Create: `src/components/MultipartUpload/index.tsx`
- Create: `src/components/Verify/VerifySlide.tsx`
- Create: `src/components/Verify/VerifyPoints.tsx`

- [ ] **Step 1: Create GiTable**

Enhanced ProTable wrapper with column settings, refresh, export, pagination controls. This is the most used component in the project.

- [ ] **Step 2: Create GiPageLayout**

Page wrapper with optional left panel (tree), header, and content area. Used by user, role, dict pages.

- [ ] **Step 3: Create GiCell components**

Table cell renderers: Avatar (with fallback initials), Status (colored dot + label), Tag (colored tag), Gender (icon + label).

- [ ] **Step 4: Create remaining components**

- Breadcrumb: Route-based breadcrumb navigation
- UserSelect: User selection with search (calls listUserDict API)
- FilePreview: File preview with audio/video/document support
- Chart: ECharts wrapper with dark mode support
- DateRangePicker: Date range selection
- GenCron: Cron expression builder with second/minute/hour/day/week/month/year tabs
- JsonPretty: JSON syntax-highlighted viewer
- MultipartUpload: Chunked file upload with pause/resume
- Verify: Slide and point-click captcha verification

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement all shared components"
```

---

## FINAL TESTING & REVIEW

### Task 31: Run Build & Fix Issues

- [ ] **Step 1: Run production build**

Run: `cd D:/code/umi4-admin && pnpm build`
Expected: Build succeeds without errors

- [ ] **Step 2: Fix any TypeScript errors**

Run: `cd D:/code/umi4-admin && npx tsc --noEmit`
Fix all type errors.

- [ ] **Step 3: Run lint**

Run: `cd D:/code/umi4-admin && pnpm lint`
Fix all lint errors.

### Task 32: Code Review Checklist

- [ ] **Step 1: Review API layer**

- All endpoints from source project are implemented
- Request/response types match
- Error handling is consistent
- Auth token is sent on all requests
- Tenant header is sent when enabled

- [ ] **Step 2: Review pages**

- All 40+ pages are implemented
- CRUD operations work for all entities
- Tables have correct columns matching source
- Forms have correct validation rules
- Modals/drawers open and close properly

- [ ] **Step 3: Review state management**

- All 6 stores are implemented
- Persistence works correctly
- Theme toggle works
- Tab management works
- Dictionary caching works

- [ ] **Step 4: Review auth flow**

- Login with account/phone/email works
- Token is stored and sent correctly
- Logout clears state
- Route guard redirects to login when unauthenticated
- Permission/role checks work

- [ ] **Step 5: Review responsive design**

- Mobile layout works
- Tablet layout works
- Desktop layout works

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete SSS Admin system implementation"
```

---

## SUMMARY

| Sub-plan | Tasks | Pages | Components | Services |
|----------|-------|-------|------------|----------|
| 01 Foundation | 8 | 0 | 0 | 30+ |
| 02 Auth & Login | 2 | 4 | 5 | 2 |
| 03 Layout | 1 | 0 | 10 | 0 |
| 04 Cockpit | 1 | 1 | 10 | 1 |
| 05 Task & Category | 2 | 2 | 2 | 1 |
| 06 System | 8 | 12 | 20+ | 15 |
| 07 Monitor | 1 | 4 | 1 | 2 |
| 08 Schedule | 1 | 2 | 1 | 2 |
| 09 Open & Tenant | 2 | 4 | 2 | 4 |
| 10 Code Generator | 1 | 1 | 2 | 1 |
| 11 User Profile | 2 | 3 | 3 | 2 |
| Additional | 1 | 4 | 0 | 1 |
| Components | 1 | 0 | 17 | 0 |
| Testing & Review | 2 | 0 | 0 | 0 |
| **Total** | **33** | **37+** | **73+** | **62+** |

**Estimated implementation time:** 40-60 hours with subagent-driven development.

**Execution recommendation:** Use subagent-driven development (option 1) for parallel execution of independent sub-plans. Sub-plans 4-11 can all run in parallel once 1-3 are complete.
