import { useState, useEffect } from 'react';
import './App.css';
import { API_URL } from './config';

function App() {
  // Form input states
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editGrade, setEditGrade] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setError(''); 
      const response = await fetch(`${API_URL}/show`);
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const text = await response.text();

      //Parse HTML response 
      if (text.includes('The gradebook is currently empty')) {
        setSubjects([]);
      } else {
        const lines = text.split('<br>').filter(line => line.includes(':') && !line.includes('Current Gradebook'));
        const parsedSubjects = lines.map((line, index) => {
          const [name, grade] = line.split(': ');
          return {
            id: index,
            name: name.trim(),
            grade: parseFloat(grade)
          };
        });
        setSubjects(parsedSubjects);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError('Error fetching subjects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Adding:', newSubject, newGrade);
    //Basic form validation
    if (newSubject && newGrade) {
      setLoading(true);
      setError('');
      try {
        const response = await fetch (`${API_URL}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subject: newSubject,
            grade: parseFloat(newGrade)
          })
        });
        if (!response.ok) throw new Error('Failed to add subject');
        await fetchSubjects();
      
        //Clear form inputs
        setNewSubject('');
        setNewGrade('');
      } catch (error) {
        setError('Error adding subject');
        console.error('Error adding subject:', error);
      } finally {
        setLoading(false);
      }
    }
  };

      //Start editing functionality
      const startEditing = (subject) => {
        setEditingId(subject.id);
        setEditGrade(subject.grade.toString());
      };

      //Save edited grade
      const saveEdit = async (subject) => {
        if (!editGrade || isNaN(editGrade)) {
          setError('Please enter a valid grade');
          return;
        }
        setLoading(true);
        setError('');

        try {
          const response = await fetch(`${API_URL}/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              subject: subject.name,
              new_grade: parseFloat(editGrade)
            })
          });
          if (!response.ok) throw new Error('Failed to update grade');
          await fetchSubjects();
          setEditingId(null);
          setEditGrade('');
        } catch (error) {
          setError('Error updating grade');
          console.error('Error updating grade:', error);
        } finally {
          setLoading(false);
        }
      };

      //Cancel editing
      const cancelEdit = () => {
        setEditingId(null);
        setEditGrade('');
      };

      //Delete subject
      const deleteSubject = async (subject) => {
        if (!window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
          return;
        }
        setLoading(true);
        setError('');

        try {
          const response = await fetch(`${API_URL}/remove`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              subject: subject.name
            })
          });
          
          if (!response.ok) throw new Error('Failed to delete subject');
          await fetchSubjects();
        } catch (error) {
          setError('Error deleting subject');
          console.error('Error deleting subject:', error);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="App">
          <h1>My Gradebook</h1>
          <p>Connected to: {API_URL}</p>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="create-form">
            <h2>Add New Subject</h2>
            <div className="form-row">
              <input
                type="text"
                placeholder="Subject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Grade"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                disabled={loading}
                min="0"
                max="100"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Subject'}
              </button>
            </div>
          </form>
            <div className="subjects-list">
              <h2>Subjects ({subjects.length})</h2>
              {subjects.length === 0 ? (
                <p className="empty-state">No subjects added yet. Add one above!</p>
              ) : (
              <ul>
                {subjects.map((subject) => (
                  <li key={subject.id} className="subject-item">
                    <span className="subject-name">{subject.name}</span>
                    {editingId === subject.id ? (
                    //Edit Mode
                    <div className="edit-mode">
                      <input 
                        type="number"
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value)}
                        min="0"
                        max="100"
                      />
                      <button
                        onClick={() => saveEdit(subject)}
                        disabled={loading}
                        className="save-btn"
                        >
                        Save
                      </button>
                      <button 
                        onClick={cancelEdit}
                        disabled={loading}
                        className="cancel-btn"
                        >
                        Cancel
                      </button>
                    </div>
                    ) : (
                      //View Mode 
                      <div className="view-mode">
                        <span className="subject-grade">{subject.grade}%</span>
                        <button
                          onClick={() => startEditing(subject)}
                          disabled={loading}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSubject(subject)}
                          disabled={loading}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                ))} 
              </ul>
              )}     
            </div>  
          </div> 
        );
}
      
export default App;
                    
                  
            
             
          
        
          
        
      
          
    

  



