const isBackendUser = (user) => {
    return user?.role_id?.nom === 'admin' || user?.role_id?.nom === 'oficina';
  };
  
  module.exports = {
    isBackendUser
  };
  