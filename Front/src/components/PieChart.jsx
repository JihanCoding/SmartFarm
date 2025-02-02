import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function PieChart(){
  const pieChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (pieChartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(pieChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Direct", "Referral", "Social"],
          datasets: [
            {
              data: [55, 30, 15],
              backgroundColor: [
                "rgba(0, 97, 242, 1)",
                "rgba(0, 172, 105, 1)",
                "rgba(88, 0, 232, 1)"
              ],
              hoverBackgroundColor: [
                "rgba(0, 97, 242, 0.9)",
                "rgba(0, 172, 105, 0.9)",
                "rgba(88, 0, 232, 0.9)"
              ],
              hoverBorderColor: "rgba(234, 236, 244, 1)"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              backgroundColor: "rgba(255,255,255,0.95)",
              titleFont: {
                size: 16,
                weight: "bold"
              },
              titleColor: "#000",
              bodyFont: {
                size: 14
              },
              bodyColor: "#333",
              borderColor: "#dddfeb",
              borderWidth: 1,
              padding: 15,
              displayColors: false,
              caretPadding: 10,
              callbacks: {
                label: function (tooltipItem) {
                  let dataset = tooltipItem.dataset;
                  let index = tooltipItem.dataIndex;
                  let value = dataset.data[index];
                  return `${tooltipItem.label}: ${value}%`;
                }
              }
            }
          },
          cutout: "80%" // Chart.js 최신 버전에서 cutoutPercentage 대신 사용
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
    return(     
      // <div className="card mb-4">{/* Pie chart example */}
      //   <div className="card-header">Pie Chart Example</div>
      //   <div className="card-body">
          <div className="chart-pie">
            <canvas ref={pieChartRef} width="100%" height={50}></canvas>
          </div>
      //   </div>
      //   <div className="card-footer small text-muted">Updated yesterday at 11:59 PM</div>
      // </div>
    );
}

export default PieChart;