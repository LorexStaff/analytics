import * as yup from "yup";

const emailValidation = yup
  .string()
  .email("Неверный формат email")
  .required("Email обязателен");

const passwordValidation = yup
  .string()
  .min(8, "Пароль должен содержать минимум 8 символов")
  .matches(/[0-9]/, "Пароль должен содержать хотя бы одну цифру")
  .matches(/[^a-zA-Z0-9]/, "Пароль должен содержать хотя бы один спецсимвол")
  .required("Пароль обязателен");

export const validationSchema = yup.object({
  email: emailValidation,
  password: passwordValidation,
});

export const validateForm = async (values: {
  email: string;
  password: string;
}) => {
  try {
    await validationSchema.validate(values, { abortEarly: false });
    return null;
  } catch (err: any) {
    const errors: Record<string, string> = {};
    err.inner.forEach((error: any) => {
      if (error.path) {
        errors[error.path] = error.message;
      }
    });
    return errors;
  }
};
