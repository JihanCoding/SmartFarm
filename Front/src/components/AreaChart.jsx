import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const AreaChart = ({ dataset, scales, label }) => {
  const areaChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // 데이터가 없으면 차트를 생성하지 않음
    if (!dataset || dataset.length === 0) {
      console.warn("차트 데이터가 없습니다.");
      return;
    }

    if (areaChartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();  // 기존 차트 제거
      }

      chartInstance.current = new Chart(areaChartRef.current, {
        type: "line",
        data: {
          labels: label,  // X축 라벨
          datasets: dataset,  // 실제 데이터셋
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: scales,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              enabled: true,
              mode: 'index',  
              intersect: false,  
              backgroundColor: "rgba(255,255,255,0.9)",
              titleFont: { size: 14, weight: "bold" },
              titleColor: "#000",
              bodyFont: { size: 12 },
              bodyColor: "#333",
              borderColor: "rgba(0, 97, 242, 1)",
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              caretPadding: 10,
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(1)}°C`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();  // 컴포넌트 언마운트 시 정리
      }
    };
  }, [dataset, scales, label]);  // 의존성 추가

  return (
    <div className="chart-area">
      {dataset && dataset.length > 0 ? (
        <canvas ref={areaChartRef} width="100%" height={50}></canvas>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default AreaChart;