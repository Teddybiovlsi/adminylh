import React from 'react';
import Loading from './Loading';
import styles from '../styles/components/LoadingComponent.module.scss';

export default function LoadingComponent({ title = '資訊欄位', text = 'Loading' }) {
  return (
    <div className='container'>
      <h1 className={styles.container_firstHeading}>{title}</h1>
      <div className={styles.container_division}>
        <h2 className={styles.container_division_secondHeading}>
          <Loading text={text} />
        </h2>
      </div>
    </div>
  );
}
