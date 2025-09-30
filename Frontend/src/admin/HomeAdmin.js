import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function HomeAdmin() {
  const [activePage] = useState("dashboard");

  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);

  useEffect(() => {
    if (activePage === "dashboard") {
      renderCharts();
    }
  }, [activePage]);

  const renderCharts = () => {
    if (pieChartRef.current && lineChartRef.current) {
      if (pieChartRef.current.chart) pieChartRef.current.chart.destroy();
      if (lineChartRef.current.chart) lineChartRef.current.chart.destroy();

      pieChartRef.current.chart = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: ["Total Order", "Customer Growth", "Total Revenue"],
          datasets: [
            {
              data: [81, 22, 62],
              backgroundColor: ["#ff99b5", "#f77fb1", "#f9d4e4"], // Pink tones
            },
          ],
        },
      });

      lineChartRef.current.chart = new Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ],
          datasets: [
            {
              label: "2020 Revenue",
              data: [5000, 10000, 7500, 20000, 15000, 25000, 30000, 22000, 27000, 24000, 29000, 31000],
              borderColor: "#ff69b4", // Hot pink
              backgroundColor: "#ff69b4",
              tension: 0.3,
              fill: false,
            },
            {
              label: "2021 Revenue",
              data: [6000, 11000, 8500, 22000, 17000, 26000, 31000, 23000, 28000, 26000, 32000, 34000],
              borderColor: "#ff99b5", // Light pink
              backgroundColor: "#ff99b5",
              tension: 0.3,
              fill: false,
            },
          ],
        },
      });
    }
  };

  return (
    <div style={{ background: "#fff0f5", padding: "40px 0", fontFamily: "Arial, sans-serif" }}>
      <div style={styles.mainWrapper}>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3 style={styles.cardTitle}>Total Orders</h3>
            <h3 style={styles.cardValue}>75</h3>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.cardTitle}>Total Delivered</h3>
            <h3 style={styles.cardValue}>357</h3>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.cardTitle}>Total Canceled</h3>
            <h3 style={styles.cardValue}>65</h3>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.cardTitle}>Total Revenue</h3>
            <h3 style={styles.cardValue}>$128</h3>
          </div>
        </div>

        <div style={styles.charts}>
          <div style={styles.chart}>
            <canvas ref={pieChartRef}></canvas>
          </div>
          <div style={styles.chart}>
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  mainWrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 20px",
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "30px",
  },
  statCard: {
    background: "linear-gradient(to right, #ffe4ec, #fff)", // light pinkish gradient
    padding: "20px",
    borderRadius: "12px",
    flex: "1",
    textAlign: "center",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #fcddec",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#aa4465", // darker pink
  },
  cardValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ff69b4", // hot pink
  },
  charts: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  chart: {
    width: "48%",
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid #fcddec",
  },
};

export default HomeAdmin;
