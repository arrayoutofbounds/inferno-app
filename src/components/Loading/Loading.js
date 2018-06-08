import { Component } from 'inferno';
import loading from './raptor-loading.gif';
import './Loading.css';

class Loading extends Component {
  render() {
      const { error } = this.props;
      console.log(error);
      console.log(!error);
      return (
        <div className="Loading">
            {
            !error ? (
                <img className="Loading-img" src={loading} alt="Loading..." />
            ) : (
                <p className="alert alert-danger"><strong>Error:</strong> Could not retrieve data.</p>
            )
            }
      </div>
      );
  }
}

export default Loading;