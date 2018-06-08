import { version, Component } from 'inferno';
import './registerServiceWorker';
import './App.css';
import ApiService from './utils/ApiService';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dinos: []
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
    const { dinos } = this.state;
    return(
      <div className="App">
        <header className="App-header bg-primary clearfix">
          <h1 className="text-center">Dinosaurs</h1>
        </header>
        <div className="App-content container-fluid">
          <div className="row">
            {
              dinos ? (
                <ul>
                  {
                    dinos.map((dino) => (
                      <li key={dino.id}>{dino.name}</li>
                    ))
                  }
                </ul>
              ) : (
                <p>Loading...</p>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
