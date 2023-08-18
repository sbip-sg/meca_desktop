import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useTheme } from '@emotion/react';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import { useNavigate } from 'react-router-dom';
const txn_data_url = process.env.TXN_SERVICE_API_URL;

interface DataEntry {
    session_id: string;
    did: string;
    provider_did: string;
    resource_consumed: number;
    session_start_datetime: number;
    session_end_datetime: number;
    task: string;
    duration: number;
    network_reliability: number;
    is_host: Boolean;
    task_run: number;
    usage_charge: number;
  }
interface DatagridProps {
    data: DataEntry[];
    hasButton: Boolean;
    expandView: Boolean;
    rotateButton: Boolean;
    fromClient: Boolean;
}
  
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.mediumBlack.main,
      color: theme.palette.cerulean.main,
    //   width: "300px"
    // minWidth: 140,
    //  flex: 1
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
      backgroundColor: theme.palette.darkBlack.main,
    //   maxWidth: "1px"
    // minWidth: 100,
    //  flex: 1
    //   width: "300px"
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "theme.palette.lightBlack.main",
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  id: keyof DataEntry;
  label: string;
  numeric: boolean;
}


interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DataEntry) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  fromClient: Boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort, fromClient } =
    props;
  const createSortHandler =
    (property: keyof DataEntry) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

    const headCells: readonly HeadCell[] = [
      {
        id: 'session_id',
        numeric: false,
        label: 'Session ID',
      },
      {
        id: 'did',
        numeric: false,
        label: 'DID',
      },
      {
        id: 'provider_did',
        numeric: false,
        label: 'Issuer DID',
      },
      {
        id: 'resource_consumed',
        numeric: true,
        label: 'Resource Consumed (CC)',
      },
      {
        id: 'session_start_datetime',
        numeric: true,
        label: 'Session Start Datetime',
      },
      {
        id: 'session_end_datetime',
        numeric: true,
        label: 'Session End Datetime',
      },
      {
        id: 'task',
        numeric: false,
        label: fromClient ? 'Task' : 'No. of Task Ran',
      },
      {
        id: 'duration',
        numeric: true,
        label: 'Duration (min)',
      },
      {
        id: 'network_reliability',
        numeric: true,
        label: 'Network Reliability (%)',
      },
      {
        id: 'is_host',
        numeric: true,
        label: 'Is Host',
      },
      {
        id: 'task_run',
        numeric: true,
        label: 'Tasks Ran',
      },
      {
        id: 'usage_charge',
        numeric: true,
        label: 'Usage Charge',
      },
    ];
  return (
    <TableHead>
      <StyledTableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}


const ProviderDatagrid: React.FC<DatagridProps> = ({ data, hasButton, expandView, rotateButton, fromClient }) => {
    const navigate = useNavigate();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof DataEntry>('session_start_datetime');
  const [page, setPage] = React.useState(0);
  var initialRowsPerPage = 5;
  const handleTableRowClick = (sessionId: string) => {
    console.log("handleTableRowClick", txn_data_url);
    navigate(`/details/${sessionId}`);

    // navigate(txn_data_url+'?session_id=01H65Y8SMXXCZQDMG71YV492QN')
  }
  if (expandView) {
    initialRowsPerPage = 20
    }
    const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
    const theme = useTheme();
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof DataEntry,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, data],
  );

  const handleClickExpandButton = () => {
    console.log('clicked');
    if (hasButton) {
        navigate('/providerdashboardnochart');
    } else {
        navigate('/providerdashboard');

    }
    console.error("uncaught error")
  }
  return (
    <Box id='datagrid-container-inner'
      sx={{ 
        display: 'flex', 
        flexDirection: "column", 
        justifyContent: 'center', 
        alignContent: 'center', 
        height: '100%', 
        width: '100%',
        // maxWidth: '95vw',
        // padding: '0.5rem', 
        // margin: '0 0 2rem 0',
        // padding: '0 0 2rem 0',

        position:'relative',
      }}>
        <Toolbar id='datagrid-toolbar'
            variant='dense'
                style={{minHeight: '1rem'}}
            sx={{
                backgroundColor: theme.palette.lightBlack.main,
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                borderRadius: '0.5em 0.5em 0 0',
                marginTop:  !hasButton ? '4rem' : 'none' 
            }}>
            {!hasButton &&
            <Box sx={{ position: 'absolute', top: '-31px', left: '50%', transform: 'translateX(-50%)' }}>
                <IconButton onClick={handleClickExpandButton} sx={{ opacity: 1, zIndex: 10000 }}>
                    <ExpandCircleDownIcon 
                    style={{ zIndex:10000, fontSize: 50, color: theme.palette.cerulean.main, transform: rotateButton ? 'rotate(180deg)' : 'none' }} />
                </IconButton>
            </Box>
            }
            <Typography
            sx={{ flex: '1 1 100%' }}
            variant="body1"
            id="tableTitle"
            component="div"
            >
            Past Transactions
            </Typography>
            <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
            </Tooltip>   
        </Toolbar>
        <TableContainer id='tablecontainer'>
          <Table
            sx={{ minWidth: 750,  }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              fromClient={fromClient}
            />
            <TableBody>
              {visibleRows.map((data, index) => {
                console.log("visibleRows", data)
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    onClick={() => handleTableRowClick(data.session_id)}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={data.session_id}
                    sx={{ cursor: 'pointer' }}
                  >
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                    >
                      {data.session_id.slice(0, 10) + "..."}
                    </StyledTableCell>
                    {/* <StyledTableCell align="right">{data.did.slice(0, 10) + "..."}</StyledTableCell> */}
                    <StyledTableCell align="right">{data.resource_consumed}</StyledTableCell>
                    <StyledTableCell align="center">{data.did.slice(0, 10) + "..."}</StyledTableCell>
                    <StyledTableCell align="center">{data.provider_did.slice(0, 10) + "..."}</StyledTableCell>
                    <StyledTableCell align="right">{data.session_start_datetime}</StyledTableCell>
                    <StyledTableCell align="right">{data.session_end_datetime}</StyledTableCell>
                    <StyledTableCell align="right">{data.task}</StyledTableCell>
                    <StyledTableCell align="right">{data.duration}</StyledTableCell>
                    <StyledTableCell align="right">{data.network_reliability}</StyledTableCell>
                    <StyledTableCell align="right">{data.is_host}</StyledTableCell>
                    <StyledTableCell align="right">{data.task_run}</StyledTableCell>
                    <StyledTableCell align="right">{data.usage_charge}</StyledTableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 13 * emptyRows,
                  }}
                >
                  <StyledTableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box id='paginationBox' sx={{position: 'relative', overflowY: 'hidden', height:"23%"}}>

            <TablePagination  id='pagination'  
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
              //   position:'relative',
                backgroundColor: theme.palette.mediumBlack.main,
                borderRadius: '0 0 0.5em 0.5em',
                // margin: '0 0 4rem 0',

              }} />
            {hasButton &&
            <Box sx={{ position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%)' }}>
                <IconButton onClick={handleClickExpandButton} sx={{ opacity: 1, zIndex:10000, }}>
                    <ExpandCircleDownIcon 
                    style={{ zIndex:10000, fontSize: 50, color: theme.palette.cerulean.main, transform: rotateButton ? 'rotate(180deg)' : 'none' }} />
                </IconButton>
            </Box>
            }
        </Box>
    </Box>
  );
}

export default ProviderDatagrid;