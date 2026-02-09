// 验证邮箱
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证用户名
export const isValidUsername = (username: string): boolean => {
  // 3-20个字符，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// 验证密码强度
export const validatePassword = (password: string): {
  isValid: boolean;
  message: string;
} => {
  if (password.length < 6) {
    return { isValid: false, message: '密码至少需要6个字符' };
  }
  if (password.length > 50) {
    return { isValid: false, message: '密码不能超过50个字符' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, message: '密码必须包含字母' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: '密码必须包含数字' };
  }
  return { isValid: true, message: '密码强度良好' };
};

// 验证 URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 验证文件类型
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.startsWith(type));
};

// 验证文件大小
export const isValidFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

