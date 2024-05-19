import React, { useState } from "react";
import axios from "axios";
import "./EntityCreator.css"; // Separate CSS for EntityCreator

const EntityCreator = ({ setTableName }) => {
  const [localTableName, setLocalTableName] = useState("");
  const [fields, setFields] = useState([{ fieldName: "", type: "" }]);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const handleAddField = () => {
    setFields([...fields, { fieldName: "", type: "" }]);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, e) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, [e.target.name]: e.target.value } : field
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const res = await axios.post("https://vahan-api.onrender.com/define", {
        tableName: localTableName,
        fields,
      });
      alert("Table created successfully: " + res.data);
      setTableName(localTableName); // Pass the tableName back to App
      setIsLoading(false); // Stop loading
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create table: " + error.message);
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container">
        <h2>Create Entity</h2>
        <div className="form-group">
          <label>Table Name:</label>
          <input
            type="text"
            value={localTableName}
            onChange={(e) => setLocalTableName(e.target.value)}
            required
          />
        </div>
        {fields.map((field, index) => (
          <div key={index} className="form-group">
            <input
              type="text"
              name="fieldName"
              value={field.fieldName}
              onChange={(e) => handleFieldChange(index, e)}
              placeholder="Field Name"
              required
            />
            <select
              name="type"
              value={field.type}
              onChange={(e) => handleFieldChange(index, e)}
              required
            >
              <option value="">Select Type</option>
              <option value="VARCHAR(255)">VARCHAR</option>
              <option value="INTEGER">INTEGER</option>
              <option value="BIGINT">BIGINT</option>
              <option value="DATE">DATE</option>
            </select>
            <button
              type="button"
              onClick={() => handleRemoveField(index)}
              className="add-remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddField}
          className="add-remove-btn"
        >
          Add Field
        </button>
        <button type="submit">Create Table</button>
      </form>
      {isLoading && <div className="loading-spinner">Creating Table...</div>}
    </div>
  );
};

export default EntityCreator;
