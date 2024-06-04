import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import { ContainerName, ImageName } from 'common/dockerNames';
import ErrorDialog from '../componentsCommon/ErrorDialogue';
import actions from '../../redux/actionCreators';
import { ReactComponent as Logo } from '../../../../assets/LogoColor.svg';
import Transitions from '../../utils/Transition';
import {
  fetchAccount,
  setStoreSettings,
  startDockerContainer,
} from './handleEnterApp';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  useEffect(() => {
    async function setup() {
      try {
        await setStoreSettings();
        await startDockerContainer(
          ImageName.MECA_EXECUTOR,
          ContainerName.MECA_EXECUTOR_1
        );
        await startDockerContainer(
          ImageName.PYMECA_SERVER,
          ContainerName.PYMECA_SERVER_1
        );
      } catch (error) {
        console.error('Error starting:', error);
        setErrorMessage('Error starting');
        setErrorDialogOpen(true);
      }
    }
    actions.setImportingAccount(false);
    setIsLoading(true);
    try {
      setup();
      setTimeout(async () => {
        try {
          await fetchAccount();
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Error setting up:', error);
    }
  }, []);

  return (
    <Transitions duration={2}>
      {isLoading ? (
        <CircularProgress
          size={36}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : (
        <Container
          component="main"
          maxWidth="xs"
          sx={{ height: '100vh', display: 'flex' }}
        >
          <Box
            sx={{
              pb: '6rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                paddingLeft: '0.5rem',
                height: '20%',
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <Logo width="300px" height="100%" />
            </Box>
            <Typography
              fontSize="12px"
              maxWidth="22rem"
              textAlign="center"
              marginTop="2rem"
            >
              Cannot find your account
            </Typography>
            <Box sx={{ maxWidth: '22rem', width: '100%' }}>
              <Box
                sx={{
                  pt: '2rem',
                  display: 'flex',
                  justifyContent: 'space-evenly',
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => fetchAccount()}
                  sx={{
                    width: '70%',
                    color: 'text.primary',
                    backgroundColor: 'primary.main',
                    fontWeight: '600',
                  }}
                >
                  Reload
                </Button>
              </Box>
            </Box>
            <ErrorDialog
              open={errorDialogOpen}
              onClose={handleCloseErrorDialog}
              errorMessage={errorMessage}
            />
          </Box>
        </Container>
      )}
    </Transitions>
  );
};

export default Login;
