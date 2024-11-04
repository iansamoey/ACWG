// File: app/dashboard/userDashboard/OrderForm.tsx
import React, { useState } from 'react';
import styles from './OrderForm.module.css'; // Import a CSS module for styling

const OrderForm = () => {
    const [service, setService] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState('');
    const [total, setTotal] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!service || !details || !date || !total) {
            setError('Please fill in all fields');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service,
                    date,
                    details,
                    total: parseFloat(total),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error submitting order');
            }

            const orderData = await response.json();
            console.log('Order submitted successfully:', orderData);

            setService('');
            setDetails('');
            setDate('');
            setTotal('');
            setError('');
        } catch (error) {
            console.error('Error submitting order:', error);
            setError(error instanceof Error ? error.message : 'Error submitting order');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.heading}>Place a New Order</h2>
            <select 
                value={service} 
                onChange={(e) => setService(e.target.value)} 
                required 
                className={styles.select}
            >
                <option value="">Select a service</option>
                <option value="Research Papers">Research Papers</option>
                <option value="Dissertations">Dissertations</option>
                <option value="CV Writing">CV Writing</option>
                <option value="Final Year Projects">Final Year Projects</option>
                <option value="Editing and Proofreading">Editing and Proofreading</option>
                <option value="Essay Writing">Essay Writing</option>
            </select>
            <input
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Order details"
                required
                className={styles.input}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={styles.input}
            />
            <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="Total amount"
                required
                step="0.01"
                className={styles.input}
            />
            <button type="submit" disabled={isSubmitting} className={styles.button}>
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
    );
};

export default OrderForm;
