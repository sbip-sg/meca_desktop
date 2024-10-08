import React from 'react';
import {
  Typography,
  ButtonGroup,
  Button,
  Stack,
  Box,
  IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';
import { ExecutorSettings } from 'renderer/utils/dataTypes';

interface CoreSelectorWidgetProps {
  executorSettings: ExecutorSettings;
  setExecutorSettings: React.Dispatch<React.SetStateAction<ExecutorSettings>>;
}

/**
 * Adds two values together and returns the result.
 */
const CoreSelectorWidget: React.FC<CoreSelectorWidgetProps> = ({
  executorSettings,
  setExecutorSettings,
}) => {
  const theme = useTheme();
  const totalCpuCores = useSelector(
    (state: RootState) => state.deviceStatsReducer.totalCpuCores
  );
  const incrementCore = () => {
    if (executorSettings.cpu_cores < totalCpuCores) {
      setExecutorSettings((prev) => ({
        ...prev,
        cpu_cores: prev.cpu_cores + 1,
      }));
    }
  };

  const decrementCore = () => {
    if (executorSettings.cpu_cores > 0) {
      setExecutorSettings((prev) => ({
        ...prev,
        cpu_cores: prev.cpu_cores - 1,
      }));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 0.1rem',
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        CPU cores
      </Typography>
      <ButtonGroup variant="contained" size="small">
        <Button
          disabled
          sx={{
            backgroundColor: `${theme.palette.background.paper} !important`,
            color: `${theme.palette.text.primary} !important`,
            fontWeight: '600',
          }}
        >
          {executorSettings.cpu_cores}
        </Button>
        <Stack>
          <IconButton
            onClick={incrementCore}
            sx={{ padding: '0.1rem 0.1rem 0rem 0.1rem' }}
          >
            <KeyboardArrowUpIcon
              sx={{ fontSize: '20px', color: 'text.primary' }}
            />
          </IconButton>
          <IconButton
            onClick={decrementCore}
            sx={{ padding: '0rem 0.1rem 0.1rem 0.1rem' }}
          >
            <KeyboardArrowDownIcon
              sx={{ fontSize: '20px', color: 'text.primary' }}
            />
          </IconButton>
        </Stack>
      </ButtonGroup>
    </Box>
  );
};

export default CoreSelectorWidget;
