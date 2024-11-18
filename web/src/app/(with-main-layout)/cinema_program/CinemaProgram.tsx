'use client'

import React, { useState } from 'react';
import styles from './CinemaProgram.module.css';
import { seanse } from '@/config/showData';

// Typ obiektu filmu
interface Movie {
  id: number;
  title: string;
  description: string;
  lengthInMinutes: number;
  genres: string[];
  imageUrl: string;
}

export default function CinemaProgram() {
  const availableDates = Array.from(
    new Set(seanse.map((s) => new Date(s.startTime).toISOString().split('T')[0]))
  );

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0] || '');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // Typowanie stanu

  const getShowtimesForDate = (date: string) => {
    return seanse.filter(
      (s) => new Date(s.startTime).toISOString().split('T')[0] === date
    );
  };

  return (
    <div className={styles.container}>
      <select 
        className={styles.select}
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)}
      >
        {availableDates.map((date) => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>

      <div className={styles.movieGrid}>
        {getShowtimesForDate(selectedDate).map((seans) => {
          const { movie, startTime } = seans;
          const formattedTime = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={movie.id} className={styles.movieCard}>
              <h2>{movie.title}</h2>
              <img src={movie.imageUrl} alt={`${movie.title} poster`} className={styles.movieImage} />
              <div className={styles.movieInfo}>
                <span className={styles.badge}>{movie.genres.join(', ')}</span>
                <span className={styles.badge}>{`${movie.lengthInMinutes} min`}</span>
              </div>
              <div className={styles.showtimes}>
                <h3>Showtime:</h3>
                <span className={styles.badge}>{formattedTime}</span>
              </div>
              <button 
                className={styles.button}
                onClick={() => setSelectedMovie(movie)}
              >
                More Info
              </button>
            </div>
          );
        })}
      </div>

      {selectedMovie && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.description}</p>
            <div className={styles.movieInfo}>
              <span className={styles.badge}>{selectedMovie.genres.join(', ')}</span>
              <span className={styles.badge}>{`${selectedMovie.lengthInMinutes} min`}</span>
            </div>
            <button 
              className={styles.button}
              onClick={() => setSelectedMovie(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

