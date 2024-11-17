import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CareerPlanning() {
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [careerOptions, setCareerOptions] = useState([]);

  // Fetch all available specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-specializations');
        setSpecializations(response.data);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    fetchSpecializations();
  }, []);

  // Fetch career options when a specialization is selected
  const fetchCareerOptions = async (specialization) => {
    try {
      const response = await axios.get(`http://localhost:5000/explore-career-options?specialization=${specialization}`);
      setCareerOptions(response.data);
    } catch (error) {
      console.error('Error fetching career options:', error);
      setCareerOptions([]); // Clear previous options if there is an error
    }
  };

  // Handle specialization selection change
  const handleSpecializationChange = (e) => {
    const selected = e.target.value;
    setSelectedSpecialization(selected);
    fetchCareerOptions(selected);
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f7f8fc', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ padding: '30px', maxWidth: '900px', width: '100%', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#4A90E2', marginBottom: '30px', fontWeight: '600' }}>Discover Your Career Path</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
          <select
            value={selectedSpecialization}
            onChange={handleSpecializationChange}
            style={{
              padding: '15px',
              fontSize: '1rem',
              borderRadius: '50px',
              border: '2px solid #007BFF',
              width: '60%',
              outline: 'none',
              transition: 'border-color 0.3s ease-in-out',
            }}
            onFocus={(e) => e.target.style.borderColor = '#0060FF'}
            onBlur={(e) => e.target.style.borderColor = '#007BFF'}
          >
            <option value="" disabled>Select a specialization</option>
            {specializations.map((specialization, index) => (
              <option key={index} value={specialization}>{specialization}</option>
            ))}
          </select>
        </div>

        {careerOptions.length > 0 ? (
          <div>
          {careerOptions.map((career, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px',
                boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
                transform: 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3 style={{ color: '#333', fontSize: '1.6rem', fontWeight: '500', marginBottom: '10px' }}>{career.name}</h3>
              <p style={{ color: '#666', fontSize: '1rem', marginBottom: '10px' }}><strong>Description:</strong> {career.description}</p>
              <p style={{ color: '#666', fontSize: '1rem', marginBottom: '10px' }}><strong>Required Skills:</strong> {career.requiredSkills.join(', ')}</p>
              <p style={{ color: '#666', fontSize: '1rem' }}><strong>Resources:</strong></p>
              <ul style={{ textAlign: 'center', marginTop: '10px', color: '#555' }}>
                {career.resources.map((resource, resourceIndex) => (
                  <li key={resourceIndex} style={{ fontSize: '1rem', marginBottom: '5px' }}>
                    <a href={resource.link} style={{ color: '#007bff', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        ) : (
          selectedSpecialization && <p style={{ color: '#999', fontSize: '1.2rem' }}>No career options found for this specialization.</p>
        )}
      </div>
    </div>
  );
}

export default CareerPlanning;