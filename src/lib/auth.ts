// 认证相关工具函数

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

// 检查用户是否已认证
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const user = localStorage.getItem('prompt-optimizer-user');
  return !!user;
}

// 获取当前用户信息
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('prompt-optimizer-user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('解析用户信息失败:', e);
    return null;
  }
}

// 登出
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('prompt-optimizer-user');
  }
}

// 获取认证令牌（如果有）
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  // 这里可以根据需要实现令牌逻辑
  return isAuthenticated() ? 'authenticated' : null;
}