import React from "react";
import styles from "./ProjectTable.module.scss";
import { ProjectData } from "../../../entities/Project";

interface ProjectTableProps {
  projects: ProjectData[];
  selectedProjects: string[];
  onCheckboxChange: (projectName: string) => void;
  onMasterCheckboxChange: () => void;
  onSort: (key: keyof ProjectData["data"][0] | "name") => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  selectedProjects,
  onCheckboxChange,
  onMasterCheckboxChange,
  onSort,
}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={
                projects.length > 0 &&
                selectedProjects.length === projects.length
              }
              onChange={onMasterCheckboxChange}
            />
          </th>
          <th onClick={() => onSort("name")}>Проект</th>
          <th onClick={() => onSort("newUsers")}>Новые пользователи</th>
          <th onClick={() => onSort("activeUsers")}>Активные пользователи</th>
          <th onClick={() => onSort("revenueGrowth")}>Прирост прибыли</th>
          <th onClick={() => onSort("arpu")}>ARPU</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => {
          const lastMonthData =
            project.data[project.data.length - 1] || project.data[0];
          return (
            <tr key={project.name}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.name)}
                  onChange={() => onCheckboxChange(project.name)}
                />
              </td>
              <td>{project.name}</td>
              <td>{lastMonthData.newUsers}</td>
              <td>{lastMonthData.activeUsers}</td>
              <td>{lastMonthData.revenueGrowth}</td>
              <td>{lastMonthData.arpu}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProjectTable;
