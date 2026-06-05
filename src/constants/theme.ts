/**
 * Design Token System - Premium Business Admin
 *
 * Color philosophy:
 * - Primary: Deep indigo (#4F46E5) - sophisticated, not generic blue
 * - Neutrals: Zinc-based cool grays - modern, clean
 * - Semantic: Refined success/warning/error with proper contrast
 * - Both light and dark mode tokens defined
 */

// ─── Primary Palette ───────────────────────────────────────────
export const PRIMARY = {
  50: '#EEF2FF',
  100: '#E0E7FF',
  200: '#C7D2FE',
  300: '#A5B4FC',
  400: '#818CF8',
  500: '#6366F1',
  600: '#4F46E5',
  700: '#4338CA',
  800: '#3730A3',
  900: '#312E81',
  950: '#1E1B4B',
} as const

// ─── Semantic Colors ───────────────────────────────────────────
export const SEMANTIC = {
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#065F46',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#92400E',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#991B1B',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoDark: '#1E3A8A',
} as const

// ─── Ant Design Theme Tokens ───────────────────────────────────
export const getAntdTheme = (isDark: boolean) => ({
  token: {
    colorPrimary: PRIMARY[600],
    colorSuccess: SEMANTIC.success,
    colorWarning: SEMANTIC.warning,
    colorError: SEMANTIC.error,
    colorInfo: SEMANTIC.info,
    colorBgContainer: isDark ? '#1A1A2E' : '#FFFFFF',
    colorBgElevated: isDark ? '#16213E' : '#FFFFFF',
    colorBgLayout: isDark ? '#0F0F23' : '#F4F4F5',
    colorBgSpotlight: isDark ? '#1E1E3F' : '#F9FAFB',
    colorBorder: isDark ? 'rgba(255,255,255,0.08)' : '#E4E4E7',
    colorBorderSecondary: isDark ? 'rgba(255,255,255,0.05)' : '#F4F4F5',
    colorText: isDark ? '#E4E4E7' : '#18181B',
    colorTextSecondary: isDark ? '#A1A1AA' : '#71717A',
    colorTextTertiary: isDark ? '#71717A' : '#A1A1AA',
    colorTextQuaternary: isDark ? '#52525B' : '#D4D4D8',
    colorFill: isDark ? 'rgba(255,255,255,0.06)' : '#F4F4F5',
    colorFillSecondary: isDark ? 'rgba(255,255,255,0.04)' : '#FAFAFA',
    colorFillTertiary: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
    borderRadius: 8,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontSize: 14,
    controlHeight: 36,
    boxShadow: isDark
      ? '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)'
      : '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
    boxShadowSecondary: isDark
      ? '0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.4)'
      : '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06)',
  },
  components: {
    Menu: {
      darkItemBg: '#0F0F23',
      darkSubMenuItemBg: '#0A0A1A',
      darkItemSelectedBg: 'rgba(79,70,229,0.15)',
      darkItemHoverBg: 'rgba(255,255,255,0.06)',
      darkItemColor: 'rgba(255,255,255,0.65)',
      darkItemSelectedColor: '#818CF8',
    },
    Card: {
      headerBg: isDark ? '#1A1A2E' : '#FFFFFF',
    },
    Table: {
      headerBg: isDark ? '#16213E' : '#FAFAFA',
      rowHoverBg: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB',
    },
    Button: {
      primaryShadow: '0 2px 4px rgba(79,70,229,0.2)',
    },
    Tabs: {
      inkBarColor: PRIMARY[600],
      itemActiveColor: PRIMARY[600],
      itemSelectedColor: PRIMARY[600],
    },
  },
})

// ─── Sidebar Theme ─────────────────────────────────────────────
export const SIDEBAR = {
  width: 220,
  collapsedWidth: 64,
  darkBg: '#0B0B1E',
  darkBgGradient: 'linear-gradient(180deg, #0F0F23 0%, #0B0B1E 100%)',
}

// ─── Layout Dimensions ─────────────────────────────────────────
export const LAYOUT = {
  headerHeight: 56,
  pagePadding: 16,
  cardPadding: 24,
  sectionGap: 16,
}
