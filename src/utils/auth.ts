const TOKEN_KEY = 'token'
const LOGIN_CORP_KEY = 'login_corp'

export const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY)
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getLoginCorp = () => localStorage.getItem(LOGIN_CORP_KEY)
export const setLoginCorp = (corp: string) => localStorage.setItem(LOGIN_CORP_KEY, corp)
export const clearLoginCorp = () => localStorage.removeItem(LOGIN_CORP_KEY)
