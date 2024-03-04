import React, { useState, useEffect } from "react";
import axios from "axios";
import { Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function App() {
  const [points, setPoints] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    x: "",
    y: "",
    label: "",
  });
  const [isEditing, setIsEditing] = useState(false); // New state to track editing status
  const [editPointId, setEditPointId] = useState(null); // New state to store the ID of the point being edited

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    const res = await axios.get("http://localhost:5000/api/points");
    setPoints(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/points", formData);
      fetchPoints();
      setFormData({
        id: "",
        x: "",
        y: "",
        label: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/points/${id}`);
      fetchPoints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (pointId) => {
    const pointToEdit = points.find((point) => point._id === pointId);
    setFormData({
      id: pointToEdit.id,
      x: pointToEdit.x,
      y: pointToEdit.y,
      label: pointToEdit.label,
    });
    setIsEditing(true);
    setEditPointId(pointId);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/points/${editPointId}`,
        formData
      );
      fetchPoints();
      setFormData({
        id: "",
        x: "",
        y: "",
        label: "",
      });
      setIsEditing(false);
      setEditPointId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = {
    datasets: [
      {
        label: "Scatter Chart",
        data: points.map((point) => ({ x: point.x, y: point.y })),
        backgroundColor: points.map(
          (_, index) =>
            `rgba(${index * 50}, ${index * 100}, ${index * 150}, 0.6)`
        ),
        borderColor: points.map(
          (_, index) => `rgba(${index * 50}, ${index * 100}, ${index * 150}, 1)`
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1>Scatter Chart App</h1>
      {isEditing ? (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
          />
          <input
            type="text"
            name="x"
            placeholder="X"
            value={formData.x}
            onChange={handleChange}
          />
          <input
            type="text"
            name="y"
            placeholder="Y"
            value={formData.y}
            onChange={handleChange}
          />
          <input
            type="text"
            name="label"
            placeholder="Label"
            value={formData.label}
            onChange={handleChange}
          />
          <button type="submit">Update Point</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
          />
          <input
            type="text"
            name="x"
            placeholder="X"
            value={formData.x}
            onChange={handleChange}
          />
          <input
            type="text"
            name="y"
            placeholder="Y"
            value={formData.y}
            onChange={handleChange}
          />
          <input
            type="text"
            name="label"
            placeholder="Label"
            value={formData.label}
            onChange={handleChange}
          />
          <button type="submit" className="add">
            Add Point
          </button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>X</th>
            <th>Y</th>
            <th>Label</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point._id}>
              <td>{point.id}</td>
              <td>{point.x}</td>
              <td>{point.y}</td>
              <td>{point.label}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(point._id)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(point._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="chart">
        <Scatter data={chartData} />
      </div>
    </div>
  );
}

export default App;
