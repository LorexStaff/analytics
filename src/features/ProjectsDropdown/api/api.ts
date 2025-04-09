interface Project {
  id: number;
  name: string;
}

export const getProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: 1, name: "Проект 1" },
          { id: 2, name: "Проект 2" },
          { id: 3, name: "Проект 3" },
        ]),
      1000
    )
  );
};
