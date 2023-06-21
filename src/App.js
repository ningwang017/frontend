import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Stock from "./pages/Stock";
import Home from "./pages/Home";
import PriceHistory from "./pages/PriceHistory";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul
            className="row justify-content-md-center mt-4"
            style={{ listStyle: "none" }}
          >
            <li className="col-1">
              <NavLink to="/" style={{ textDecoration: 'none' }}>Home</NavLink>
            </li>
            <li className="col-1">
              <NavLink to="/stock" style={{ textDecoration: 'none' }}>Stocks</NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/pricehistory" element={<PriceHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
