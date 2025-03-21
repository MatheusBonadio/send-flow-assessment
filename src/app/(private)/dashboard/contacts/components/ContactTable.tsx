import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import { IContact } from '@/services/contactService';

export interface ContactTableProps {
  contacts: IContact[];
  onUpdate: (id: string, updatedData: IContact) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  onUpdate,
  onDelete,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('name');

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedContacts = contacts.sort((a, b) => {
    if (orderBy === 'name') {
      return order === 'asc'
        ? a.name!.localeCompare(b.name!)
        : b.name!.localeCompare(a.name!);
    }
    return 0;
  });

  const displayedContacts = sortedContacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <TableContainer component={Paper} className="px-10">
      <Table sx={{ borderRadius: 4 }} className="border-1 border-gray-500">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleRequestSort('name')}
              >
                Nome
              </TableSortLabel>
            </TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedContacts.map((contact: IContact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    contact.id &&
                    onUpdate(contact.id, {
                      name: 'Atualizado',
                      phone: '987654321',
                    })
                  }
                >
                  Atualizar
                </Button>
                <Button
                  onClick={() => contact.id && onDelete(contact.id)}
                  color="error"
                >
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={contacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default ContactTable;
