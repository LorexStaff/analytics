interface Project {
  id: number;
  nameKey: string;
}

export const getProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: 1, nameKey: "project.projectA" },
          { id: 2, nameKey: "project.projectB" },
          { id: 3, nameKey: "project.all_projects" },
        ]),
      1000
    )
  );
};
