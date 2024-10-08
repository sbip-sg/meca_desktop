import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { Typography, Stack, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import { scrollbarHeight } from 'renderer/utils/constants';
import CustomLineChart from './linechart/CustomLineChart';
import { DataEntry } from '../../utils/dataTypes';
import { PropConfigList } from './propConfig';
import Datagrid from './datagrid/Datagrid';
import Transitions from '../../utils/Transition';
import {
  tablePaginationMinHeight,
  maxRowHeight,
  toolbarMinHeight,
  unexpandedRowPerPage,
} from './datagrid/datagridUtils/TableParams';
import dummyData from './dummyData';
import ErrorDialog from '../componentsCommon/ErrorDialogue';
import fetchTransactionEvents from '../componentsCommon/fetchTransactionHistory';

const TxnDashboard: React.FC = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [hasData, setHasData] = useState(false);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const maxTableHeight = maxRowHeight * (unexpandedRowPerPage + 1) - 1;
  const chartHeightOffset = `${
    tablePaginationMinHeight +
    maxTableHeight +
    toolbarMinHeight +
    scrollbarHeight -
    1
  }px`;

  const fetchAndSetData = async () => {
    setIsLoading(true);
    try {
      const transactionHistory = await fetchTransactionEvents();
      if (transactionHistory.length > 0) {
        setHasData(true);
      }
      setData(transactionHistory);
    } catch (error) {
      setErrorMessage(`${error}`);
      setErrorDialogOpen(true);
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchAndSetData();
  };

  const handleAddDummyData = async () => {
    setIsLoading(true);
    setData(dummyData);
    setHasData(true);
    setIsLoading(false);
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  useEffect(() => {
    handleRefresh();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return isLoading ? (
    <CircularProgress
      style={{
        color: 'secondary.main',
        position: 'absolute',
        width: '4rem',
        height: '4rem',
        left: '50%',
        top: '50%',
        translate: '-2rem -2rem',
      }}
    />
  ) : (
    <Transitions duration={1}>
      <ErrorDialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        errorMessage={errorMessage}
      />
      <Stack
        id="dashboard-wrapper-stack"
        height="100%"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        sx={{ padding: '2rem 0 2rem 0' }}
      >
        <Box
          id="title-wrapper"
          sx={{
            height: '10%',
            width: '90%',
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            padding: '0 0 0 2%',
          }}
        >
          <Typography
            style={{
              fontSize: '24px',
              letterSpacing: '0.1em',
              margin: '0 0 0 0',
              whiteSpace: 'nowrap',
            }}
          >
            Resource Utilization Overview
          </Typography>
        </Box>
        {!hasData && (
          <Box
            sx={{
              height: '100%',
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'start',
              padding: '3% 0 0 2.5%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshIcon
                  fontSize="small"
                  sx={{ color: 'text.primary', marginRight: '0.5rem' }}
                />
              </IconButton>
              <Typography
                sx={{
                  fontSize: '14px',
                  letterSpacing: '0.0em',
                  margin: '0 0 0 0',
                  whiteSpace: 'nowrap',
                  color: 'text.primary',
                  textAlign: 'center',
                }}
              >
                You have not done any MECAnywhere transactions for the past 6 months.
              </Typography>
            </Box>
            <Button
              onClick={() => handleAddDummyData()}
              sx={{
                margin: '2rem 0 0 0',
                padding: '0.5rem 1.5rem',
                backgroundColor: 'primary.main',
              }}
            >
              Add Dummy Data (development)
            </Button>
          </Box>
        )}
        {hasData && (
          <motion.div
            id="line-chart-motion-div"
            style={{
              height: isTableExpanded
                ? '0%'
                : `calc(90% - ${chartHeightOffset})`,
              width: '90%',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
            }}
            initial={{ height: `calc(90% - ${chartHeightOffset})` }}
            animate={{
              height: isTableExpanded
                ? '0%'
                : `calc(90% - ${chartHeightOffset})`,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <CustomLineChart
              data={data}
              handleRefresh={handleRefresh}
              handleAddDummyData={handleAddDummyData}
            />
          </motion.div>
        )}
        {hasData && (
          <motion.div
            id="table-motion-div"
            style={{
              height: isTableExpanded ? '90%' : chartHeightOffset,
              width: '90%',
            }}
            initial={{ height: chartHeightOffset }}
            animate={{ height: isTableExpanded ? '90%' : chartHeightOffset }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Datagrid
              data={data}
              isTableExpanded={isTableExpanded}
              setIsTableExpanded={setIsTableExpanded}
              propConfigList={PropConfigList}
            />
          </motion.div>
        )}
      </Stack>
    </Transitions>
  );
};

export default TxnDashboard;
