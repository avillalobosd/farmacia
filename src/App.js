import React from 'react';
import Top from './components/Top';
import Inventario from './components/Inventario';
import Reportes from './components/Reportes';
import Venta from './components/Venta';
import Ayuda from './components/Ayuda';
import BottomBar from './components/BottomBar';
import BarraDerecha from './components/BarraDerecha';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
// import controllers from './routes/api-routes'

// var user = require('./models/user');
// var sequelize = require('./config/database');


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        productos:"OK DENTRO"
    };

  }
  
  // componentDidMount(){
  //   console.log(controllers);
  // }


render(){
  return (
    <Router>


      <Switch>
        <Route path="/venta" exact component={Venta} />
        <Route path="/inventario" exact component={Inventario} />
        <Route path="/reportes" exact component={Reportes} />
        <Route path="/ayuda" exact component={Ayuda} />
        <Route path="/test" exact component={Venta} />
        <Route path="/" exact component={Venta} />
      </Switch>

      {/* <BarraDerecha /> */}

      <BottomBar />
    </Router>
  );
}
}

export default App;
