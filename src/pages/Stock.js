import { useState, useEffect } from "react";
import { SearchStock } from "../components/SearchStock";
import Select from "react-select";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API_KEY = "ec2c2f7ec1e18e713abe3dd914556864";

export default function Stock() {
  const [rowData, setRowData] = useState([]);
  const [innerSearch, setInnerSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  async function getStock() {
    let res = await fetch(
      `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${API_KEY}`
    );
    let data = await res.json();
    return data.map((stocks) => {
      return {
        symbol: stocks.symbol,
        name: stocks.name,
        sector: stocks.sector,
      };
    });
  }

  useEffect(() => {
    (async () => {
      setRowData(await getStock());
    })();
  }, []);

  function searchSymbol(stocks) {
    if (selectedOption == null) {
      return stocks.filter(
        (stock) => stock.symbol.toLowerCase().indexOf(innerSearch) > -1
      );
    } return stocks.filter((stock) =>
      stock.symbol.toLowerCase().indexOf(innerSearch) > -1 && stock.sector.indexOf(selectedOption) > -1
    )
  }
  //extract unique industries for selector options
  const uniqueOptions = [...new Set(rowData.map((x) => x.sector))];
  
  const options = uniqueOptions.map((x)=>{
    return {
      value: x, 
      label:x,
    }
  })
  
  return (
    <div className="container">
      <h1>Stock Market</h1>
      <div className="row">
        <div className="col">
          <input
            placeholder="Search by symbol"
            name="search"
            id="saerch"
            type="search"
            style={{ width: "100%", height: "70%" }}
            value={innerSearch}
            onChange={(e) => setInnerSearch(e.target.value)}
          />
        </div>
        <div className="col mb-3">
          <Select placeholder="Select Industry" options={options} onChange={e=> setSelectedOption(e.value)}/>
        </div>
      </div>
      <SearchStock data={searchSymbol(rowData)} />
    </div>
  );
}
