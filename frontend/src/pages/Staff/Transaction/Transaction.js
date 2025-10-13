import styles from './Transaction.module.css';
import React from 'react';
import StatsHeader from "../components/StatsHeader/StatsHeader";
function Transaction() {
    return (
        <div className={styles.container}>
            <StatsHeader title="Transaction Management" />
            <h1>Transaction Page</h1>
            <p>This is the transaction page for staff members.</p>
            <p></p>
        </div>
    );
}
export default Transaction;
