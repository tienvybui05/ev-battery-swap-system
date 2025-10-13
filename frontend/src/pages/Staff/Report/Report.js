import styles from './Report.module.css';
import React from 'react';
import StatsHeader from "../components/StatsHeader/StatsHeader";
function Report() {
    return (
        <div className={styles.container}>
            <StatsHeader title="Report Management" />
            <h1>Report Page</h1>
            <p>This is the report page for staff members.</p>
        </div>
    );
}
export default Report;