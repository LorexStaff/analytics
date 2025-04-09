import React from "react";
import styles from "./SocialButton.module.scss";

interface SocialButtonProps {
  icon: string;
  alt: string;
  onClick?: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, alt, onClick }) => {
  return (
    <button className={styles.socialButton} onClick={onClick}>
      <img src={icon} alt={alt} className={styles.icon} />
    </button>
  );
};

export default SocialButton;
