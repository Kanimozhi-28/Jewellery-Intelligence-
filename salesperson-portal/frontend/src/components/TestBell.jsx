
import React from 'react';

export const TestBell = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '0',
            right: '0',
            width: '100px',
            height: '100px',
            background: 'red',
            zIndex: 999999,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
        }}>
            TEST RIGHT
        </div>
    );
}
