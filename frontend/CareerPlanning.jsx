import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CareerPlanning.css';

function CareerPlanning() {
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [careerOptions, setCareerOptions] = useState([]);

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

  const fetchCareerOptions = async (specialization) => {
    try {
      const response = await axios.get(`http://localhost:5000/explore-career-options?specialization=${specialization}`);
      setCareerOptions(response.data);
    } catch (error) {
      console.error('Error fetching career options:', error);
      setCareerOptions([]);
    }
  };

  const handleSpecializationChange = (e) => {
    const selected = e.target.value;
    setSelectedSpecialization(selected);
    fetchCareerOptions(selected);
  };

  return (
    <div id='BG-img'>
      <div className="content">
        <h2 className="heading">Discover Your Career Path</h2>

        <div className="select-container">
          <select
            value={selectedSpecialization}
            onChange={handleSpecializationChange}
            className="select-box"
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
                className="career-option"
              >
                <h3 className="career-name">{career.name}</h3>
                <p className="career-description"><strong>Description:</strong> {career.description}</p>
                <p className="career-skills"><strong>Required Skills:</strong> {career.requiredSkills.join(', ')}</p>
                <p className="career-skills"><strong>Resources:</strong></p>
                <div className="resources-container">
                  {career.resources.map((resource, resourceIndex) => (
                    <a 
                      key={resourceIndex} 
                      href={resource.link} 
                      className="resource-button" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          selectedSpecialization && <p className="no-options">No career options found for this specialization.</p>
        )}
      </div>
    </div>
  );
}

export default CareerPlanning;