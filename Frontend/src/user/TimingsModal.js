import React, { useEffect, useState } from "react";

export default function TimingsModal({ closeModal }) {
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/onlinerestro/backend/get_timings.php")
      .then((res) => res.json())
      .then((data) => {
        setTimings(data.timings || []);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={closeModal}>
          &times;
        </button>
        <h2 style={styles.title}>📅 Restaurant Timings</h2>

        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th>Day</th>
                  <th>Open</th>
                  <th>Close</th>
                  <th>Break</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {timings.map((t, i) => (
                  <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td>{t.day}</td>
                    <td>{t.is_closed === "1" ? "Closed" : t.open_time}</td>
                    <td>{t.is_closed === "1" ? "Closed" : t.close_time}</td>
                    <td>
                      {t.break_start && t.break_end
                        ? `${t.break_start} – ${t.break_end}`
                        : "-"}
                    </td>
                    <td>{t.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const pink = "#e91e63";
const pinkLight = "#fce4ec";
const fontFamily = `"Poppins", sans-serif`;

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "30px",
    width: "90%",
    maxWidth: "750px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    position: "relative",
    animation: "fadeIn 0.3s ease-in-out",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "20px",
    fontSize: "28px",
    background: "none",
    border: "none",
    color: "#999",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    fontSize: "26px",
    marginBottom: "25px",
    background: `linear-gradient(to right, ${pink}, #f06292)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 600,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "16px",
    borderRadius: "10px",
    overflow: "hidden",
  },
  theadRow: {
    backgroundColor: pink,
    color: "#fff",
  },
  rowEven: {
    backgroundColor: "#f9f9f9",
  },
  rowOdd: {
    backgroundColor: pinkLight,
  },
  loading: {
    textAlign: "center",
    fontStyle: "italic",
    color: pink,
  },
};
