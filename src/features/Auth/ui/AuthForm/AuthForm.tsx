import React, { useState } from "react";
import styles from "./AuthForm.module.scss";
import Button from "../../../../shared/components/Button/Button";
import Input from "../../../../shared/components/Input/Input";
import GoogleIcon from "../../assets/google-icon.svg";
import VkIcon from "../../assets/vk-icon.svg";
import Checkbox from "../../../../shared/components/Checkbox";
import SocialButton from "../../../../shared/components/SocialButton/ui/SocialButton";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../model/authSlice";
import { login as fakeLogin, register as fakeRegister } from "../../api/auth";
import { createValidationSchema, validateForm } from "../../model/validation";
import { useTranslation } from "react-i18next";

interface AuthFormProps {
  type: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const validationSchema = createValidationSchema(t);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = await validateForm(
      { email, password },
      validationSchema
    );
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setApiError(null);

    try {
      dispatch(loginStart());
      if (type === "login") {
        await fakeLogin(email, password);
        dispatch(loginSuccess());
        navigate("/");
      } else {
        await fakeRegister(email, password);
        navigate("/login");
      }
    } catch (err: any) {
      dispatch(loginFailure(err.message || "Something went wrong"));
      setApiError(err.message || "Something went wrong");
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gradient}>
        <h1>{t("auth.welcome")}</h1>
      </div>
      <div className={styles.authContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.languageSelector}>
            <select
              onChange={handleLanguageChange}
              defaultValue={i18n.language}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
            <span className={styles.arrow}>▼</span>
          </div>
          <h1 className={styles.registrationTitle}>
            {type === "login" ? t("auth.login") : t("auth.register")}
          </h1>
          <div className={styles.inputWrapper}>
            <Input
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(value) => setEmail(value)}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>
          <div className={styles.inputWrapper}>
            <Input
              type="password"
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChange={(value) => setPassword(value)}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
          </div>
          {apiError && <p className={styles.error}>{apiError}</p>}
          {type === "login" && (
            <div className={styles.checkboxWrapper}>
              <Checkbox
                label={t("auth.rememberMe")}
                checked={isChecked}
                onChange={(checked) => setIsChecked(checked)}
              />
            </div>
          )}
          <Button
            variant="primary"
            className={styles.customButtom}
            type="submit"
          >
            {type === "login" ? t("auth.login") : t("auth.register")}
          </Button>
          <div className={styles.mobileSwitchButton}>
            <Button
              variant="outline"
              className={styles.mobileLoginButton}
              onClick={() =>
                type === "login" ? navigate("/register") : navigate("/login")
              }
            >
              {type === "login"
                ? t("auth.switchToRegister")
                : t("auth.switchToLogin")}
            </Button>
          </div>
        </form>
        <div className={styles.socialLogin}>
          <div className={styles.orTextContainer}>
            <div className={styles.line}></div>
            <p className={styles.orText}>{t("auth.orText")}</p>
            <div className={styles.line}></div>
          </div>
          <div className={styles.iconContainer}>
            <SocialButton icon={GoogleIcon} alt="Google" />
            <SocialButton icon={VkIcon} alt="VK" />
          </div>
          {type === "login" && (
            <div className={styles.forgotPassword}>
              <span>{t("auth.forgotPassword")}</span>
              <Link to="/forgot-password">{t("auth.recoverPassword")}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
