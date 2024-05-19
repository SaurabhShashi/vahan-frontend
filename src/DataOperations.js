import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DataOperations.css"; // For styling

const DataOperations = ({ tableName }) => {
  const [data, setData] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [newEntry, setNewEntry] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchData();
    fetchTableAttributes();
  }, [tableName]);

  // Function to fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `https://vahan-api.onrender.com/getAll/${tableName}`
      );
      setData(result.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setIsLoading(false);
    }
  };

  // Function to fetch table attributes
  const fetchTableAttributes = async () => {
    try {
      const result = await axios.get(
        `https://vahan-api.onrender.com/describeTable/${tableName}`
      );
      setAttributes(result.data);
    } catch (error) {
      console.error("Failed to fetch table attributes:", error);
    }
  };

  // Function to add new data
  const handleAdd = async () => {
    setIsCreating(true);
    try {
      const result = await axios.post(
        `https://vahan-api.onrender.com/insert/${tableName}`,
        newEntry
      );
      setData([...data, result.data]);
      setNewEntry({});
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to add data:", error);
      setIsCreating(false);
    }
  };

  // Function to update data
  const handleUpdate = async (id, updatedFields) => {
    try {
      const result = await axios.put(
        `https://vahan-api.onrender.com/update/${tableName}/${id}`,
        updatedFields
      );
      const updatedData = data.map((item) =>
        item.id === id ? result.data : item
      );
      setData(updatedData);
    } catch (error) {
      console.error("Failed to update data:", error);
    }
  };

  // Function to delete data
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://vahan-api.onrender.com/delete/${tableName}/${id}`
      );
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Failed to delete data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="data-operations">
      <h2>Manage {tableName}</h2>
      {data.map((item) => (
        <div key={item.id} className="data-item">
          {Object.entries(item).map(([key, value]) => (
            <span key={key}>
              <strong>{key}:</strong> {value}
            </span>
          ))}
          <button
            onClick={() =>
              handleUpdate(item.id, { ...item, name: "Updated Name" })
            }
          >
            Update
          </button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
      <div>
        <h3>Add New Entry</h3>
        {attributes.map((attribute, index) => (
          <div key={index} className="form-group">
            <label>{attribute.fieldName}:</label>
            <input
              type="text"
              name={attribute.fieldName}
              value={newEntry[attribute.fieldName] || ""}
              onChange={handleInputChange}
              placeholder={attribute.fieldName}
              required
            />
          </div>
        ))}
        <button onClick={handleAdd} disabled={isCreating}>
          {isCreating ? "Creating..." : "Add"}
        </button>
      </div>
    </div>
  );
};

export default DataOperations;
