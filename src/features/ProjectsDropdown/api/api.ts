interface Project {
  id: number;
  nameKey: string;
}

export const getProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: 1, nameKey: "project.project1" },
          { id: 2, nameKey: "project.project2" },
          { id: 3, nameKey: "project.project3" },
        ]),
      1000
    )
  );
};
