import React, { useState } from "react";
import styles from "./CreateProjectPage.module.scss";
import { useNavigate } from "react-router-dom";
import Input from "../../../shared/components/Input/Input";
import Button from "../../../shared/components/Button/Button";
import Select from "../../../shared/components/Select";
import { useTranslation } from "react-i18next";

const CreateProjectPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [projectLink, setProjectLink] = useState("");
  const [platform, setPlatform] = useState("");
  const [appName, setAppName] = useState("");
  const [apiKey, setApiKey] = useState("");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const platforms = [
    { value: "App Store", label: t("createProject.platform.AppStore") },
    { value: "Google Play", label: t("createProject.platform.GooglePlay") },
    { value: "RuStore", label: t("createProject.platform.RuStore") },
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
            <h2>{t("createProject.title")}</h2>

            <Select
              options={platforms}
              value={platform}
              onChange={setPlatform}
              placeholderKey={t("createProject.platformPlaceholder")}
            />

            <Input
              type="text"
              placeholder={t("createProject.projectLinkPlaceholder")}
              value={projectLink}
              onChange={(value) => setProjectLink(value)}
            />

            <Input
              type="text"
              placeholder={t("createProject.appNamePlaceholder")}
              value={appName}
              onChange={(value) => setAppName(value)}
            />

            <div className={styles.buttonGroup}>
              <Button
                variant="gray"
                size="medium"
                onClick={handleBackToOverview}
              >
                {t("common.cancel")}
              </Button>
              <Button variant="primary" size="medium" onClick={handleContinue}>
                {t("common.continue")}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={styles.apiKeyCard}>
            <h2>{t("createProject.apiKeyTitle")}</h2>
            <div className={styles.spanContainer}>
              <div>{t("createProject.apiKeyMessage")}</div>
              <div>{t("createProject.apiKeyLabel")}</div>
            </div>
            <div className={styles.apiKey}>
              <span>{apiKey}</span>
              <Button variant="secondary" size="small" onClick={handleCopy}>
                {t("createProject.copyButton")}
              </Button>
            </div>
            <Button
              variant="primary"
              size="small"
              onClick={handleBackToOverview}
            >
              {t("common.backToOverview")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProjectPage;
