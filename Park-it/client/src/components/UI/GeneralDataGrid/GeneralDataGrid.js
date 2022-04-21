import classes from "./GeneralDataGrid.module.css";

import { useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

const GeneralDataGrid = ({
  rows,
  columns,
  rowsPerPageOptions,
  initialState,
  onRowClick,
  helperText = "",
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const changePageHandler = (newPage) => {
    setPage(newPage);
  };
  const changeRowsPerPageHandler = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return (
    <div className={classes["grid-container"]}>
      <Typography
        variant="sectionSubContent"
        className={classes["helper-text"]}
      >
        {helperText}
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        page={page}
        onPageChange={changePageHandler}
        pageSize={rowsPerPage}
        onPageSizeChange={changeRowsPerPageHandler}
        rowsPerPageOptions={rowsPerPageOptions}
        initialState={initialState}
        onRowClick={onRowClick}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            fontSize: "1rem",
            color: "var(--light)",
            fontWeight: "bold",
            fontFamily: "Montserrat",
            backgroundColor: "var(--green)",
          },
          "& .MuiDataGrid-cell": {
            color: "var(--dark)",
          },
        }}
      />
    </div>
  );
};

export default GeneralDataGrid;
