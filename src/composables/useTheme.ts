import { ref } from 'vue'

// 明暗主题：默认跟随系统；用户显式切换后写 data-theme 并持久化。
type Theme = 'light' | 'dark' | 'system'

const KEY = 'jiaxian.theme'
const theme = ref<Theme>((localStorage.getItem(KEY) as Theme) || 'system')

function apply() {
  const root = document.documentElement
  if (theme.value === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme.value)
}

function prefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

/** 当前实际呈现是否为暗色 */
function isDark() {
  return theme.value === 'dark' || (theme.value === 'system' && prefersDark())
}

export function useTheme() {
  function toggle() {
    // 在明暗之间切换（以当前实际呈现为准）
    theme.value = isDark() ? 'light' : 'dark'
    localStorage.setItem(KEY, theme.value)
    apply()
  }
  function init() {
    apply()
  }
  return { theme, isDark, toggle, init }
}
