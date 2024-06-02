import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FraudDetectionPage = () => {
    const [studentName, setStudentName] = useState('');
    const [fraudCounts, setFraudCounts] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Récupération des informations de l'étudiant
            

            // Récupération des données de fraude
            const fraudResponse = await axios.get('http://127.0.0.1:5000/fraudCounts');
            setFraudCounts(fraudResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Fraud Detection Dashboard</h1>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {<h2>Etudiant: LAGHOUB Nassim</h2>}
            </div>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <table className="fraud-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'left' }}>Timestamp</th>
                            <th style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'left' }}>Case Description</th>
                            <th style={{ padding: '10px', border: '1px solid #dddddd', textAlign: 'left' }}>Number of Cases</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(fraudCounts).map(([timestamp, count]) => (
                            <tr key={timestamp}>
                                <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{timestamp}</td>
                                <td style={{ padding: '10px', border: '1px solid #dddddd' }}>Hidden</td>
                                <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FraudDetectionPage;
