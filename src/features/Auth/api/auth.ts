const FAKE_USER = {
  email: "user@example.com",
  password: "password123!",
};

export const login = async (email: string, password: string) => {
  return new Promise<{ success: boolean; message: string }>(
    (resolve, reject) => {
      setTimeout(() => {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
          resolve({ success: true, message: "Успешный вход" });
        } else {
          reject({ success: false, message: "Неправильный email или пароль" });
        }
      }, 1000);
    }
  );
};

export const register = async (email: string, password: string) => {
  return new Promise<{ success: boolean; message: string }>(
    (resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject({ success: false, message: "Email и пароль обязательны" });
        } else {
          resolve({ success: true, message: "Успешная регистрация" });
        }
      }, 1000);
    }
  );
};
