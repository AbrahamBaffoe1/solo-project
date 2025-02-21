import { useState } from 'react';
import DonorList from '../DonorList/DonorList';
import Navbar from '../Navbar/NavBar';
import DonorForm from '../DonorForm/DonorForm';
import './HomePage.css';

function HomePage() {
  const [isopen, setIsOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpen = (mode, donor = null) => {
    setFormMode(mode);
    setSelectedDonor(donor);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedDonor(null);
  };

  const handleSubmit = async () => {
    setRefreshList(prev => !prev);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="home-container">
      <Navbar onOpen={() => handleOpen('add')} onSearch={handleSearch} />
      
      <div className="content-wrapper">
        <div className="content-card">
          <DonorList
            handleOpen={handleOpen}
            refreshTrigger={refreshList}
            searchTerm={searchTerm}
          />
        </div>
      </div>
      
      <DonorForm
        isopen={isopen}
        onClose={handleClose}
        OnSubmit={handleSubmit}
        FormMode={formMode}
        initialData={selectedDonor}
      />
    </div>
  );
}

export default HomePage;