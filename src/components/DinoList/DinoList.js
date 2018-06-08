
import { Component, linkEvent } from 'inferno';
import ApiService from './../../utils/ApiService';
import Loading from './../Loading/Loading';
import './DinoList.css';
import DinoDetail from '../DinoDetail/DinoDetail';

/* 
  This function is pulled out of the class to 
  demonstrate how we could easily use third-party APIs
*/
function getDinoById(obj) {
  const id = obj.id;
  const instance = obj.instance;

  // Set loading state to true while data is being fetched
  // Set active state to index of clicked item
  instance.setState({
    loading: true,
    active: id
  });

  // GET dino by ID
  // On resolve, set detail state and turn off loading
  ApiService.getDino(id)
    .then(
      res => {
        instance.setState({
          detail: res,
          loading: false,
          error: false
        });
      },
      error => {
        instance.setState({
          error: error,
          loading: false
        });
      }
    );
}

class DinoList extends Component {
  constructor() {
    super();

    // Set default loading state to false
    this.state = {
      loading: false
    };
  }

  /*
  We'll import linkEvent from inferno. 
  linkEvent() is an excellent helper function unique to Inferno. 
  It allows attachment of data to events without needing bind(this), arrow functions, or closures.
  */
  render() {
    return(
      <div className="DinoList">
        <div className="col-sm-3">
          <ul className="DinoList-list">
            {
              this.props.dinos.map((dino) => (
                <li key={dino.id}>
                  <a
                    className={this.state.active === dino.id ? 'active' : ''}
                    onClick={linkEvent({id: dino.id, instance: this}, getDinoById)}>
                    {dino.name}
                  </a>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-sm-9">
          {
            !this.state.loading && !this.state.error ? (
                <DinoDetail dino={this.state.detail} />
            ) : (
              <Loading error={this.state.error} />
            )
          }
        </div>
      </div>
    );
  }
}

export default DinoList;