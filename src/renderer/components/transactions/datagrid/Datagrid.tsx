import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import actions from 'renderer/redux/actionCreators';
import { useNavigate } from 'react-router-dom';
import { DataEntry } from '../../../utils/dataTypes';
import { PropConfig } from '../propConfig';
import { Order, stableSort, getComparator } from './datagridUtils/comparatorUtils';
import CustomTableHead from './CustomTableHead';
import CustomTableBody from './CustomTableBody';
import CustomTablePagination from './CustomTablePagination';
import CustomToolbar from './CustomToolbar';
import { maxRowHeight, expandedRowPerPage } from './datagridUtils/TableParams';

interface DatagridProps {
  data: DataEntry[];
  isTableExpanded: boolean;
  setIsTableExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  propConfigList: PropConfig<DataEntry>[];
}

const Datagrid: React.FC<DatagridProps> = ({
  data,
  isTableExpanded,
  setIsTableExpanded,
  propConfigList,
}) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof DataEntry>(
    'transaction_start_datetime'
  );
  const [page, setPage] = useState(0);
  const [tableOverflow, setTableOverflow] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(expandedRowPerPage);
  const [addRightPadding, setAddRightPadding] = useState(true);
  const maxTableHeight =
    maxRowHeight * (expandedRowPerPage + 1) + expandedRowPerPage - 1;
  const handleTableRowClick = (transactionId: string) => {
    const transactionDetails = data.find(
      (entry) => entry.transaction_id === transactionId
    );
    if (transactionDetails) {
      actions.setDataEntry(transactionDetails);
      navigate(`/details/${transactionId}`);
    } else {
      console.error('entry doesnt exist');
    }
  };
  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof DataEntry
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const visibleRows = useMemo(
    () =>
      stableSort<DataEntry>(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, data]
  );
  // table expansion effect
  useEffect(() => {
    if (isTableExpanded) {
      setTableOverflow(true);
      setAddRightPadding(false);
    } else {
      setTableOverflow(false);
      setAddRightPadding(true);
    }
  }, [isTableExpanded]);

  return (
    <Box
      id="datagrid-container-inner"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <CustomToolbar
        isTableExpanded={isTableExpanded}
        setIsTableExpanded={setIsTableExpanded}
      />
      <TableContainer
        id="tablecontainer"
        sx={{
          maxHeight: `${maxTableHeight}px`,
          overflowY: tableOverflow ? 'none' : 'hidden',
        }}
      >
        <Table
          sx={{
            minWidth: 750,
            '& .MuiTableRow-root:hover': {
              backgroundColor: 'primary.light',
            },
          }}
          size="small"
        >
          <CustomTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            propConfigList={propConfigList}
            addRightPadding={addRightPadding ? 1 : 0}
            maxRowHeight={maxRowHeight}
          />
          <CustomTableBody
            visibleRows={visibleRows}
            handleTableRowClick={handleTableRowClick}
            propConfigList={propConfigList}
            emptyRows={emptyRows}
            addRightPadding={addRightPadding ? 1 : 0}
            maxRowHeight={maxRowHeight}
          />
        </Table>
      </TableContainer>
      <CustomTablePagination
        totalRows={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Datagrid;
