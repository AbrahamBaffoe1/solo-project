import { useState, useEffect } from "react";
import './DonorList.css';

function DonorList({ handleOpen, refreshTrigger, searchTerm }) {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDonors();
    }, [refreshTrigger]);

    const filteredDonors = donors.filter(donor => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            donor.name?.toLowerCase().includes(searchLower) ||
            donor.email?.toLowerCase().includes(searchLower) ||
            donor.phone?.toLowerCase().includes(searchLower) ||
            donor.address?.toLowerCase().includes(searchLower) ||
            donor.amount?.toString().includes(searchTerm) ||
            donor.Donation_date?.includes(searchTerm)
        );
    });

    const fetchDonors = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/donation/');
            if (response.ok) {
                const data = await response.json();
                setDonors(data);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to fetch donors');
            }
        } catch (error) {
            console.error('Error fetching donors:', error);
            setError('Network error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const donor = donors.find(d => d.donor_id === id);
            const response = await fetch(`/api/donation/donors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...donor,
                    Paid: !donor.Paid
                }),
            });

            if (response.ok) {
                setDonors(prevDonors =>
                    prevDonors.map(donor =>
                        donor.donor_id === id ? { ...donor, Paid: !donor.Paid } : donor
                    )
                );
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to update donor status');
            }
        } catch (error) {
            console.error('Error updating donor status:', error);
            alert('Network error occurred. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this donor?')) return;

        try {
            const response = await fetch(`/api/donation/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setDonors(prevDonors => prevDonors.filter(donor => donor.donor_id !== id));
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to delete donor');
            }
        } catch (error) {
            console.error('Error deleting donor:', error);
            alert('Network error occurred. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <span className="loading-spinner"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="error-icon" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
                <button className="retry-button" onClick={fetchDonors}>Try Again</button>
            </div>
        );
    }

    if (donors.length === 0) {
        return (
            <div className="empty-alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="info-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No donors found. Add your first donor to get started!</span>
            </div>
        );
    }

    return (
        <div className="donor-list-container">
            <table className="donor-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Amount</th>
                        <th>Donation Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDonors.map((donor) => (
                        <tr key={donor.donor_id} className="donor-row">
                            <td>{donor.donor_id}</td>
                            <td>{donor.name}</td>
                            <td>{donor.email}</td>
                            <td>{donor.phone || '-'}</td>
                            <td>{donor.address}</td>
                            <td>${parseFloat(donor.amount || 0).toFixed(2)}</td>
                            <td>{formatDate(donor.Donation_date)}</td>
                            <td>
                                <button
                                    onClick={() => handleToggleStatus(donor.donor_id)}
                                    className={`status-button ${donor.Paid ? 'paid' : 'unpaid'}`}
                                >
                                    {donor.Paid ? 'Paid' : 'Not Paid'}
                                </button>
                            </td>
                            <td className="action-cell">
                                <button
                                    className="edit-button"
                                    onClick={() => handleOpen('edit', donor)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(donor.donor_id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DonorList;