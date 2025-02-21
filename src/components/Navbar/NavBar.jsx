import './NavBar.css';
import { useState } from 'react';

function Navbar({onOpen, onSearch}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar-center-section">
        <div className="search-control">
          <input 
            type="text" 
            placeholder="Search donors" 
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="navbar-end-section">
        <button className="add-donor-button" onClick={onOpen}>Add New</button>
      </div>
    </div>
  );
}

export default Navbar;