import React, { useState } from 'react';
import axios from 'axios';

function CareerPlanning() {
  const [specialization, setSpecialization] = useState('');
  const [careerOptions, setCareerOptions] = useState([]);

  const fetchCareerOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/explore-career-options', {
        params: { specialization }
      });
      setCareerOptions(response.data);
    } catch (error) {
      console.error('Error fetching career options:', error);
    }
  };

  return (
    <div>
      <h2>Career Planning Service</h2>
      <input
        type="text"
        placeholder="Enter specialization"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
      />
      <button onClick={fetchCareerOptions}>Explore Career Options</button>

      {careerOptions.length > 0 && (
        <ul>
          {careerOptions.map((career, index) => (
            <li key={index}>{career.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CareerPlanning;
