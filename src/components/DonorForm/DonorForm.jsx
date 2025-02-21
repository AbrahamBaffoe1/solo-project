import { useState, useEffect } from "react";
import './DonorForm.css'

function DonorForm({ isopen, onClose, FormMode, OnSubmit, initialData }) {
    const handleClose = () => {
        // Close the modal using the onClose callback from the parent
        onClose();
    };


    const [name, setName] = useState(initialData?.name || '');
    const [amount, setAmount] = useState(initialData?.amount ? parseFloat(initialData.amount).toString() : '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [address, setAddress] = useState(initialData?.address || '');
    const [Paid, setPaid] = useState(initialData?.Paid || false);
    const [Donation_date, setDonationDate] = useState(initialData?.Donation_date || new Date().toISOString().split('T')[0]);


    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setAmount(initialData.amount ? parseFloat(initialData.amount).toString() : '');
            setEmail(initialData.email || '');
            setPhone(initialData.phone || '');
            setAddress(initialData.address || '');
            setPaid(initialData.Paid || false);
            setDonationDate(initialData.Donation_date || new Date().toISOString().split('T')[0]);
        } else {
            setName('');
            setAmount('');
            setEmail('');
            setPhone('');
            setAddress('');
            setPaid(false);
        }
    }, [initialData]);

    const handleStatusChange = (e) => {
        setPaid(e.target.value === 'Paid');
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        const donorData = {
            name,
            email,
            phone,
            address,
            amount: parseFloat(amount || 0),
            Paid,
            Donation_date
        };

        try {
            const url = FormMode === 'edit'
                ? `/api/donation/donors/${initialData.donor_id}`
                : '/api/donation/';

            const response = await fetch(url, {
                method: FormMode === 'edit' ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donorData),
            });

            if (response.ok) {
                if (OnSubmit) OnSubmit(); // Call the OnSubmit function if provided
                handleClose(); // Closes the modal after submit
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to submit donor. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting donor:', error);
            alert('Network error occurred. Please check your connection and try again.');
        }
    };




    return (
        <dialog id="my_modal_5" className="donor-form-modal" open={isopen}>
            <button
                className="modal-close-button"
                onClick={onClose}
                aria-label="Close modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div className="donor-form-box">
                <h3 className="donor-form-title">
                    {FormMode === 'edit' ? 'Edit Donor' : 'Add New Donor'}
                </h3>
                <div className="donor-form-content">
                    <form onSubmit={handleSubmit}>
                        <div className="form-input-group">
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-input-group wide">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-input-group wide">
                            <label htmlFor="phone">Phone</label>
                            <input
                                id="phone"
                                type="tel"
                                className="form-input"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="form-input-group">
                            <label htmlFor="address">Address</label>
                            <input
                                id="address"
                                type="text"
                                className="form-input"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-input-group wide">
                            <label htmlFor="donation-date">Donation Date</label>
                            <input
                                id="donation-date"
                                type="date"
                                className="form-input"
                                value={Donation_date}
                                onChange={(e) => setDonationDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-select-group">
                            <div className="amount-input">
                                <label htmlFor="amount">Amount</label>
                                <input
                                    id="amount"
                                    type="number"
                                    className="form-input"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="status-input">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    value={Paid ? 'Paid' : 'Not Paid'}
                                    className="status-select"
                                    onChange={handleStatusChange}
                                >
                                    <option>Paid</option>
                                    <option>Not Paid</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="submit-button">
                            {FormMode === 'edit' ? 'Save Changes' : ' Add a donor'}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}



export default DonorForm;