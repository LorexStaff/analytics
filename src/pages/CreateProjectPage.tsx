import React, { useState } from "react";
import styles from "./CreateProjectPage.module.scss";
import { useNavigate } from "react-router-dom";
import Input from "../shared/components/Input/Input";
import Button from "../shared/components/Button/Button";
import Select from "../shared/components/Select";

const CreateProjectPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [projectLink, setProjectLink] = useState("");
  const [platform, setPlatform] = useState("");
  const [appName, setAppName] = useState("");
  const [apiKey, setApiKey] = useState("");

  const navigate = useNavigate();

  const platforms = [
    { value: "App Store", label: "App Store" },
    { value: "Google Play", label: "Google Play" },
    { value: "RuStore", label: "RuStore" },
  ];

  const handleContinue = async () => {
    const fakeApiKey = `fake-api-key-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setApiKey(fakeApiKey);
    setStep(2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
  };

  const handleBackToOverview = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {step === 1 && (
          <div className={styles.form}>
            <h2>Добавление нового проекта</h2>

            <Select
              options={platforms}
              value={platform}
              onChange={setPlatform}
              placeholder="Выберите платформу"
            />

            <Input
              type="text"
              placeholder="Ссылка на проект"
              value={projectLink}
              onChange={(value) => setProjectLink(value)}
            />

            <Input
              type="text"
              placeholder="Название приложения"
              value={appName}
              onChange={(value) => setAppName(value)}
            />

            <div className={styles.buttonGroup}>
              <Button
                variant="gray"
                size="medium"
                onClick={handleBackToOverview}
              >
                Отмена
              </Button>
              <Button variant="primary" size="medium" onClick={handleContinue}>
                Продолжить
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.apiKeyCard}>
            <h2>Почти готово</h2>
            <div className={styles.spanContainer}>
              <div>
                Чтобы начать пользоваться аналитикой, интегрируйте SDK Best
                Analytics в приложение.
              </div>
              <div>Ваш API ключ:</div>
            </div>
            <div className={styles.apiKey}>
              <span>{apiKey}</span>
              <Button variant="secondary" size="small" onClick={handleCopy}>
                Скопировать
              </Button>
            </div>
            <Button
              variant="primary"
              size="small"
              onClick={handleBackToOverview}
            >
              К обзору
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProjectPage;
