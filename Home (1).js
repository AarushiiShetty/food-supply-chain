import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import './Home.css';

function Home() {
    const history = useHistory();
    const [clicked, setClicked] = useState(false);

    const redirectTo = (path) => {
        setClicked(true);
        setTimeout(() => {
            setClicked(false);
            history.push(path);
        }, 400);
    };

    return (
        <div className="background">
            <div style={styles.container}>
                <div style={styles.content}>
                    <h1 className="fade-in-heading" style={styles.heading}>Food Supply Chain Manager</h1>
                    <div style={styles.buttonGroup}>
                        <button 
                            className={`fancyButton ${clicked ? 'burst' : ''}`}
                            onClick={() => redirectTo('/roles')}
                        >
                            Register Roles
                        </button>
                        <button 
                            className={`fancyButton ${clicked ? 'burst' : ''}`}
                            onClick={() => redirectTo('/addfood')}
                        >
                            Order Materials
                        </button>
                        <button 
                            className={`fancyButton ${clicked ? 'burst' : ''}`}
                            onClick={() => redirectTo('/track')}
                        >
                            Track Materials
                        </button>
                        <button 
                            className={`fancyButton ${clicked ? 'burst' : ''}`}
                            onClick={() => redirectTo('/supply')}
                        >
                            Supply Materials
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
    },
    content: {
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent glass
        backdropFilter: 'blur(10px)',                 // Frosted glass effect
        WebkitBackdropFilter: 'blur(10px)',            // For Safari
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.3)',
        maxWidth: '500px',
        width: '100%',
    },
    heading: {
        fontSize: '36px',
        fontWeight: '700',
        marginBottom: '30px',
        color: '#333',
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    }
};

export default Home;
