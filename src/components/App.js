import React, {Component} from 'react';
import TopBar from './TopBar';
import Main from './Main';

import { TOKEN_KEY } from '../constants';

class App extends Component{
    state = {
        isLoggedIn: Boolean(localStorage.getItem(TOKEN_KEY)), // token from server, localStorage in window
    }

    handleLoginSucceed = (token) => {
        console.log('token --- ', token)
        localStorage.setItem(TOKEN_KEY, token)
        this.setState({ isLoggedIn: true });
    }

    handleLogout = () => {
        localStorage.removeItem(TOKEN_KEY); // Token_key, token key value pair
        this.setState({ isLoggedIn: false });
    }

    render(){
        return (
            <div className="App">
                <TopBar handleLogout={this.handleLogout}
                        isLoggedIn={this.state.isLoggedIn}
                />
                <Main
                    handleLoginSucceed={this.handleLoginSucceed}
                    isLoggedIn={this.state.isLoggedIn}
                />
            </div>
        );
    }
}

export default App;

// function App() {
//   return (
//       <div className="App">
//         <TopBar />
//         <Main />
//       </div>
//   );
// }
