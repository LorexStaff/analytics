import * as yup from "yup";

export const createValidationSchema = (t: any) => {
  const emailValidation = yup
    .string()
    .email(t("auth.validation.emailInvalidFormat"))
    .required(t("auth.validation.emailRequired"));

  const passwordValidation = yup
    .string()
    .min(8, t("auth.validation.passwordMinLength", { min: 8 }))
    .matches(/[0-9]/, t("auth.validation.passwordDigitRequired"))
    .matches(/[^a-zA-Z0-9]/, t("auth.validation.passwordSpecialCharRequired"))
    .required(t("auth.validation.passwordRequired"));

  return yup.object({
    email: emailValidation,
    password: passwordValidation,
  });
};

export const validateForm = async (
  values: { email: string; password: string },
  validationSchema: any
) => {
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
