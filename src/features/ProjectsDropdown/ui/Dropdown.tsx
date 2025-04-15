import React, { useState, useEffect, useRef } from "react";
import styles from "./Dropdown.module.scss";
import { getProjects } from "../api/api";
import CheckmarkIcon from "../assets/Checkmark.svg";
import ArrowDownIcon from "../assets/dropdown-vector.svg";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
}

const Dropdown: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0]);
      }
    });
  }, []);

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
    setSelectedProject(project);
    setIsOpen(false);
  };

  const handleAddProject = () => {
    navigate("/create-project");
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.closed} onClick={toggleDropdown}>
        <span>{selectedProject ? selectedProject.name : "Нет проектов"}</span>
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
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`${styles.projectItem} ${
                      selectedProject?.id === project.id ? styles.selected : ""
                    }`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    {project.name}
                    {selectedProject?.id === project.id && (
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
                <span>+</span> Добавить проект
              </button>
            </>
          ) : (
            <button
              className={styles.noProjectsButton}
              onClick={handleAddProject}
            >
              <span>+</span> Добавить проект
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
