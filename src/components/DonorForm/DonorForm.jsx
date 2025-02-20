import { useState, useEffect } from "react";
import './DonorForm.css';

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
        <>
            <dialog id="my_modal_5" className="donor-form-modal" open={isopen}>
                <div className="donor-form-box">
                    <h3 className="donor-form-title">
                        {FormMode === 'edit' ? 'Edit Donor' : 'Donor Details'}</h3>
                    <div className="donor-form-content">
                        <form onSubmit={handleSubmit}>
                            <label className="form-input-group">
                                Name
                                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required/>
                            </label>

                            <label className="form-input-group wide">
                                Email 
                                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            </label>

                            <label className="form-input-group wide">
                                Phone
                                <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </label>

                            <label className="form-input-group">
                                Address
                                <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} required/>
                            </label>

                            <label className="form-input-group wide">
                                Donation Date
                                <input 
                                    type="date" 
                                    className="form-input" 
                                    value={Donation_date} 
                                    onChange={(e) => setDonationDate(e.target.value)}
                                    required
                                />
                            </label>

                            <div className="form-select-group">
                                <label className="amount-input">
                                    Amount
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </label>
                                <select value={Paid ? 'Paid' : 'Not Paid'} className="status-select" onChange={handleStatusChange}>
                                    <option>Paid</option>
                                    <option>Not Paid</option>
                                </select>
                            </div>

                            <button type="submit" className="submit-button">
                                {FormMode === 'edit' ? 'Save Changes': ' Add a donor'}
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default DonorForm;
