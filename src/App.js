import React, { useState, useEffect } from "react";
import EntityCreator from "./EntityCreator";
import DataOperations from "./DataOperations";
import "./App.css"; // Ensure the CSS is imported

function App() {
  const [tableName, setTableName] = useState("");

  useEffect(() => {
    // Reset table name if needed based on certain conditions or actions
  }, [tableName]);

  return (
    <div className="App">
      <div className="form-container">
        <EntityCreator setTableName={setTableName} />
      </div>
      <div className="data-operations">
        {tableName ? (
          <DataOperations tableName={tableName} />
        ) : (
          <p>
            No table is created yet. Please create a table to perform CRUD
            operations.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
