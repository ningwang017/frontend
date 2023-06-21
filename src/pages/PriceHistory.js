import React from "react";
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { StockChart } from "../components/StockChart";


// ag-grid-float filter. copy&pasted from ag grid
const dateFilterParams = {
  comparator: function (filterLocalDateAtMidnight, cellValue) {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split('-');
    var cellDate = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2]),
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  },
  browserDatePicker: true,
};

const API_KEY = "0GGOBWT47FRG1G7I";

export default function PriceHistory() {
  const [stockData, setStockData] = useState([]);
  const [gridApi, setGridApi] = useState();
  const [endDate, setEndDate] = useState("");
  const location = useLocation();
  let companyName = location.state.name;
  let companySymbol = location.state.symbol;

  const columns = [
    { headerName: "Time", field: "time", filter: 'agDateColumnFilter',
    filterParams: dateFilterParams,},
    { headerName: "Open", field: "open" },
    { headerName: "High", field: "high" },
    { headerName: "Low", field: "low" },
    { headerName: "Close", field: "close" },
    { headerName: "Volume", field: "volume" },
  ];

  async function getStockData() {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${companySymbol}&apikey=${API_KEY}`;

    let res = await fetch(url);
    let data = await res.json();
    let entry = await data["Time Series (Daily)"];

    let tableData = [];
    for (let x in entry) {
      tableData.push({
        time: x,
        open: entry[x]["1. open"],
        high: entry[x]["2. high"],
        low: entry[x]["3. low"],
        close: entry[x]["4. close"],
        volume: entry[x]["5. volume"],
      });
    }
    setStockData(tableData);
  }

  useEffect(() => {
    (async () => {
      await getStockData();
    })();
  }, []);

  
  const onGridReady = (e) => {
    setGridApi(e)
  }

  useEffect(()=>{
   if(gridApi) {
    let dateFilterComponent = gridApi.api.getFilterInstance('time');
    dateFilterComponent.setModel({
      type: 'greaterThan',
      dateFrom: endDate,
      dateTo: null,
    });
    gridApi.api.onFilterChanged();
   }
  },[endDate])


  //apply time filter to stockdata. 
  //ps: i know it takes extra space and run time, 
  //but i didnt figure out another mothod, plz hint me if possible in the feedback
  function timeFilter(stocks) {
    let filteredStock = []
    if(endDate) {
      for(let x in stocks) {
        if ( endDate <= stocks[x].time ){
          filteredStock.push(stocks[x])
        }
      }
      return filteredStock;
    } 
    return stocks
  }
  return (
    <div className="container">
      <div
        className="ag-theme-balham"
        style={{ height: "350px", width: "100%" }}
      >
        <h2>{companyName} Stock History</h2>
        From: <input type="date" className="col-2 mt-3 mb-3" onChange={e=>setEndDate(e.target.value)}/>
        <AgGridReact
          columnDefs={columns}
          rowData={stockData.map((x) => {
            return {
              time: x.time,
              open: x.open,
              high: x.high,
              low: x.low,
              close: x.close,
              volume: x.volume,
            };
          })}
          pagination={true}
          paginationPageSize={15}
          defaultColDef={{flex:1}}
          onGridReady={onGridReady}
        />
        <StockChart data={timeFilter(stockData)} />
      </div>
    </div>
  );
}
