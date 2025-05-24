import { createSlice } from "@reduxjs/toolkit";

interface ProjectState {
  projects: { id: number; nameKey: string }[];
  selectedProject: string | null;
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { setProjects, setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
