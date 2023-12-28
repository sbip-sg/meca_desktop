import List from '@mui/material/List';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaidIcon from '@mui/icons-material/Paid';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import actions from '../../../redux/actionCreators';
import deleteAccount from 'renderer/electron-store';

const ProviderTab = () => {
  const navigate = useNavigate();
  const listTopBottomMargin = '0.5rem';
  const listItemSpacing = '8px';
  return (
    <>
      <List disablePadding component="li" sx={{}}>
        <ListItemButton
          onClick={() => navigate('/providertxndashboard')}
          key="dashboard"
        >
          <DashboardIcon
            sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
          />
          <Typography
            margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
            sx={{ color: 'text.primary' }}
          >
            Dashboard
          </Typography>
        </ListItemButton>
      </List>
      <Divider />
      <List disablePadding component="li">
        <ListItemButton
          onClick={() => navigate('/providerbillingdashboard')}
          key="billing"
        >
          <PaidIcon
            sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
          />
          <Typography
            margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
            sx={{ color: 'text.primary' }}
          >
            Billing
          </Typography>
        </ListItemButton>
      </List>
      <Divider />
      <List disablePadding component="li">
        <ListItemButton
          sx={{
            '& .MuiButtonBase-root': {
              height: '100%',
            },
            height: '100%',
          }}
          onClick={() => navigate('/usermanagement')}
          key="usermanagement"
        >
          <SupervisorAccountIcon
            sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
          />
          <Typography
            margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
            sx={{ color: 'text.primary' }}
          >
            Manage Users
          </Typography>
        </ListItemButton>
      </List>
      <Divider />
      <List disablePadding component="li">
        <ListItemButton
          onClick={() => {
            navigate('/hosttxndashboard');
            // deleteAccount();
            actions.setRole('host');
          }}
          key="switch_view_to_host"
        >
          <SwapHorizIcon
            sx={{ marginRight: listItemSpacing, color: 'text.primary' }}
          />
          <Typography
            margin={`${listTopBottomMargin} 0 ${listTopBottomMargin} 0`}
            sx={{ color: 'text.primary' }}
          >
            Switch To Host View (Dev)
          </Typography>
        </ListItemButton>
      </List>
      <Divider />
    </>
  );
};

export default ProviderTab;
