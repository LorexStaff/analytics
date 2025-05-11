import { createSlice } from "@reduxjs/toolkit";
import { ProjectData } from "../../../entities/Project";

interface Widget {
  id: string;
  type: "table" | "chart" | "barchart" | "piechart" | "area" | "number";
  metrics: Array<keyof Omit<ProjectData["data"][0], "period">>;
  grouping: "country" | "gender" | "none";
  title: string;
}

interface ReportState {
  widgets: Widget[];
}

const initialState: ReportState = {
  widgets: [],
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    addWidget: (state, action) => {
      state.widgets.push(action.payload);
    },
    removeWidget: (state, action) => {
      state.widgets = state.widgets.filter(
        (widget) => widget.id !== action.payload
      );
    },
  },
});

export const { addWidget, removeWidget } = reportSlice.actions;
export default reportSlice.reducer;
