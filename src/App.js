import { version, Component, linkEvent } from 'inferno';
import './registerServiceWorker';
import './App.css';
import ApiService from './utils/ApiService';
import Loading from './components/Loading/Loading';
import DinoList from './components/DinoList/DinoList';

import auth0 from 'auth0-js';
import Login from './components/Login/Login';
import User from './components/User/User';


function logOut(instance) {
  // Remove token and profile from state
  // (using instance passed in by linkEvent to preserve "this" context)
  instance.setState({
    idToken: null,
    profile: null
  });

  // Remove tokens and profile from localStorage
  localStorage.removeItem('id_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('profile');
}

class App extends Component {

  constructor(props) {
    super(props);

    // Initial authentication state:
    // check for existing token and profile
    this.state = {
      dinos: [],
      error: false,
      idToken: localStorage.getItem('id_token'),
      profile: JSON.parse(localStorage.getItem('profile'))
    };
  }
  
  componentDidMount() {
    // Create Auth0 WebAuth instance
    this.auth0 = new auth0.WebAuth({
      clientID: 'i19Ca7X1SzGpSKPfJBMjT34ZVbmNMlN8',
      domain: 'anmoldesailendi.au.auth0.com'
    });

     // When Auth0 hash parsed, get profile
     this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.idToken && authResult.accessToken) {
        // Use access token to retrieve user's profile and set session
        // If you wanted to protect API requests, you'd use the access token to do so!
        // For more information, please see: https://auth0.com/docs/api-auth/grant/implicit
        this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
          window.location.hash = '';

          // Save tokens and profile to state
          this.setState({
            idToken: authResult.idToken,
            profile: profile
          });

          // Save tokens and profile to localStorage
          localStorage.setItem('id_token', this.state.idToken);
          // access_token should be used to protect API requests using an Authorization header
          localStorage.setItem('access_token', this.state.accessToken);
          localStorage.setItem('profile', JSON.stringify(profile));
        });
      }
    });

    // GET list of dinosaurs from API
    ApiService.getDinoList()
      .then(
        res => {
          // Set state with fetched dinos list
          this.setState({
            dinos: res
          });
        },
        error => {
          // An error occurred, set state with error
          this.setState({
            error: error
          });
        }
      );
  }


  render(props, state) {
    const { dinos, error, idToken, profile } = this.state;
    return(
      <div className="App">
         <header className="App-header bg-primary clearfix">
          <div className="App-auth pull-right">
            {
              !idToken ? (
                <Login auth0={this.auth0} />
              ) : (
                <div className="App-auth-loggedIn">
                  <User profile={profile} />
                  <a
                    className="App-auth-loggedIn-logout"
                    onClick={linkEvent(this, logOut)}>Log Out</a>
                </div>
              )
            }
            </div>
          <h1 className="text-center">Dinosaurs</h1>
        </header>
        <div className="App-content container-fluid">
          <div className="row">
            {
              dinos.length > 0 ? (
                <DinoList dinos={dinos} />
              ) : (
                <Loading error={error} />
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
