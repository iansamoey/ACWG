import React, { useState } from 'react';

const NewOrderForm: React.FC = () => {
    const [formData, setFormData] = useState({
        services: [{ name: '', price: 0, description: '' }],
        total: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const newServices = [...formData.services];
        newServices[index] = { ...newServices[index], [name]: name === 'price' ? Number(value) : value };
        setFormData(prev => ({ ...prev, services: newServices }));
    };

    const handleAddService = () => {
        setFormData(prev => ({
            ...prev,
            services: [...prev.services, { name: '', price: 0, description: '' }],
        }));
    };

    const handleRemoveService = (index: number) => {
        const newServices = formData.services.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, services: newServices }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const total = formData.services.reduce((acc, service) => acc + service.price, 0);
        
        const orderData = {
            ...formData,
            total,
        };

        try {
            const response = await fetch('/api/newOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Order submitted successfully:', result);
        } catch (error) {
            console.error('Error submitting order:', error);
        }
    };

    const formStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const inputStyle: React.CSSProperties = {
        margin: '10px 0',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    };

    const buttonStyle: React.CSSProperties = {
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            {formData.services.map((service, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Service Name"
                        value={service.name}
                        onChange={(e) => handleChange(e, index)}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={service.price}
                        onChange={(e) => handleChange(e, index)}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={service.description}
                        onChange={(e) => handleChange(e, index)}
                        required
                        style={inputStyle}
                    />
                    <button type="button" onClick={() => handleRemoveService(index)} style={buttonStyle}>
                        Remove Service
                    </button>
                </div>
            ))}
            <button type="button" onClick={handleAddService} style={buttonStyle}>
                Add Service
            </button>
            <button type="submit" style={buttonStyle}>Submit Order</button>
        </form>
    );
};

export default NewOrderForm;
