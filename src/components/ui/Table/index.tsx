import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

interface ITableColumn {
  id: string;
  label: string;
}

interface ITableRowData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface IProps {
  columns: ITableColumn[];
  data: ITableRowData[];
  loading?: boolean;
}

export default function CustomTable({
  columns,
  data,
  loading = false,
}: IProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <TableContainer
      sx={{ borderRadius: 4 }}
      className="border-1 border-gray-300 bg-white"
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={uuidv4()} className="!p-3 !font-semibold">
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map(() => (
                    <TableCell key={uuidv4()}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : displayedData.map((row) => (
                <TableRow key={uuidv4()}>
                  {columns.map((column) => (
                    <TableCell key={uuidv4()} className="!px-3 !py-1">
                      {row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {!loading && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </TableContainer>
  );
}
