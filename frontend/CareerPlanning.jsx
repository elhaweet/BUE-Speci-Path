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
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f7f8fc', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ padding: '30px', maxWidth: '900px', width: '100%', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#4A90E2', marginBottom: '30px', fontWeight: '600' }}>Discover Your Career Path</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Enter your specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            style={{
              padding: '15px',
              fontSize: '1rem',
              borderRadius: '50px',
              border: '2px solid #007BFF',
              width: '60%',
              marginRight: '20px',
              outline: 'none',
              transition: 'border-color 0.3s ease-in-out',
            }}
            onFocus={(e) => e.target.style.borderColor = '#0060FF'}
            onBlur={(e) => e.target.style.borderColor = '#007BFF'}
          />
          <button
            onClick={fetchCareerOptions}
            style={{
              padding: '15px 25px',
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
          >
            Explore Options
          </button>
        </div>

        {careerOptions.length > 0 && (
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
                <ul style={{ textAlign: 'left', marginTop: '10px', color: '#555' }}>
                  {career.resources.map((resource, resourceIndex) => (
                    <li key={resourceIndex} style={{ fontSize: '1rem', marginBottom: '5px' }}>{resource}</li>
                  ))}
                </ul>
                <button
                  style={{
                    padding: '12px 25px',
                    fontSize: '1.1rem',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '30px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0, 123, 255, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#0056b3';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#007BFF';
                  }}
                >
                  View More
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerPlanning;