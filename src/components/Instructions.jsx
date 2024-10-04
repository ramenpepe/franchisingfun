// Instructions.jsx
import React from 'react';
import { Modal, Button } from '@mui/material';

const Instructions = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ padding: '20px', background: 'white', color:'#333',margin: 'auto', marginTop: '100px', width: '80%', maxWidth: '600px' }}>
                <h2>Instructions</h2>
                <p>Here you can include your instructions for the users.</p>
                <p>Explain how to mint tokens, what the marketplace is, etc.</p>
                <Button variant="contained" color="primary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default Instructions;
