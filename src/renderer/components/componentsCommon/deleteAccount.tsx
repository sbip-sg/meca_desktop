const deleteAccount = () => {
  window.electron.store.set('publicKey-wallet', '');
  window.electron.store.set('privateKey-wallet', '');
  window.electron.store.set('publicKey', '');
  window.electron.store.set('did', '');
};

export default deleteAccount;
