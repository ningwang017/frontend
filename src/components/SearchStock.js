import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "bootstrap/dist/css/bootstrap.min.css";

export function SearchStock(props) {

  const navigate = useNavigate();
  const columns = [
    { headerName: "Symbol", field: "symbol" ,},
    { headerName: "Name", field: "name" },
    { headerName: "Industry", field: "sector" },
  ];
  //navigate to price history
  function navigateToPH(symbol, name) {
    navigate("/pricehistory", {
      state: {
        symbol: symbol,
        name: name,
      },
    });
  }
  return (
    <div className="ag-theme-balham" style={{ height: "300px", width: "100%" }}>
      <AgGridReact
        columnDefs={columns}
        defaultColDef={{flex:1}}
        rowData={props.data}
        pagination={true}
        paginationPageSize={10}
        onRowClicked={(e) => {
          navigateToPH(e.data.symbol, e.data.name);
        }}
      />
    </div>
  );
}
