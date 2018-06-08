import { version, Component } from 'inferno';
import './registerServiceWorker';
import './App.css';
import ApiService from './utils/ApiService';
import Loading from './components/Loading/Loading';
import DinoList from './components/DinoList/DinoList';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dinos: [],
      error: false,
    };
  }
  
  componentDidMount() {
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
    const { dinos, error } = this.state;
    return(
      <div className="App">
        <header className="App-header bg-primary clearfix">
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
