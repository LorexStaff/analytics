import React, { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.scss";
import { getProjects } from "../api/api";
import CheckmarkIcon from "../assets/Checkmark.svg";
import ArrowDownIcon from "../assets/dropdown-vector.svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setProjects, setSelectedProject } from "../model/slice";

interface Project {
  id: number;
  nameKey: string;
}

const Dropdown: React.FC = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state: any) => state.project.projects || []);
  const selectedProject = useSelector(
    (state: any) => state.project.selectedProject
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    getProjects().then((data) => {
      if (data.length > 0) {
        dispatch(setProjects(data));
        if (!selectedProject) {
          dispatch(setSelectedProject(data[0].nameKey));
        }
      }
    });
  }, [dispatch, selectedProject]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProjectSelect = (project: Project) => {
    dispatch(setSelectedProject(project.nameKey));
    setIsOpen(false);
  };

  const handleAddProject = () => {
    navigate("/create-project");
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.closed} onClick={toggleDropdown}>
        <span>
          {selectedProject ? t(selectedProject) : t("dropdown.noProjects")}
        </span>
        <img
          src={ArrowDownIcon}
          alt="Arrow"
          className={`${styles.arrowIcon} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      {isOpen && (
        <div className={styles.open}>
          {projects.length > 0 ? (
            <>
              <div className={styles.projectList}>
                {projects.map((project: Project) => (
                  <div
                    key={project.id}
                    className={`${styles.projectItem} ${
                      selectedProject === project.nameKey ? styles.selected : ""
                    }`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    {t(project.nameKey)}
                    {selectedProject === project.nameKey && (
                      <img
                        src={CheckmarkIcon}
                        alt="Checkmark"
                        className={styles.checkmark}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.divider}></div>

              <button className={styles.addButton} onClick={handleAddProject}>
                <span>+</span> {t("dropdown.addProject")}
              </button>
            </>
          ) : (
            <button
              className={styles.noProjectsButton}
              onClick={handleAddProject}
            >
              <span>+</span> {t("dropdown.addProject")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
