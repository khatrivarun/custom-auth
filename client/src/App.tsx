import * as AuthService from './service/auth.service';

const App = () => {
  return (
    <div>
      <button onClick={async () => await AuthService.login()}>Login</button>{' '}
      <button onClick={async () => await AuthService.getUser()}>
        Get User
      </button>
      <button onClick={async () => await AuthService.getCookie()}>lol</button>
    </div>
  );
};

export default App;

