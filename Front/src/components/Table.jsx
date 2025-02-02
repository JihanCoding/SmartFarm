import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const Table = ({ data, option, th, tableId }) => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // ✅ 필터 변경 핸들러
  const handleFilterChange = (event) => {
    const newValue = event.target.value;
    setSelectedFilter(newValue);
  
    if (newValue === "") {
      updateFilteredData(data);  // 전체 데이터 업데이트
    } else {
      const firstKey = Object.keys(data[0])[0];
      const filtered = data.filter((item) => item[firstKey] === newValue);
      updateFilteredData(filtered);  // 순번 재설정 없음
    }
  };
                     
  const updateFilteredData = (data) => {
    setFilteredData(
      data.map((item, index) => ({
        순번: data.length - index,  // 데이터 변경 시에만 순번 업데이트
        ...item,
      }))
    );
  };

  // ✅ 데이터 변경 시 필터링된 데이터 업데이트
  useEffect(() => {
    setSelectedFilter("");
    updateFilteredData(data);
  }, [data]);


  // ✅ 상태에 따른 배지 스타일 지정
  const getBadgeClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success text-white";  // 스타일 클래스 개선 가능
      case "ERROR":
        return "bg-danger text-white";
      case "CHECKED":
        return "bg-primary text-white";  // ✅ CHECKED 스타일 변경
      case "UNCHECKED":
        return "bg-warning text-white";   // ✅ UNCHECKED 스타일 변경
      default:
        return "bg-light text-dark";
    }
  };

  const statusColumnKey = filteredData.length > 0 
  ? Object.keys(filteredData[0]).find(key => key.toLowerCase().includes("status") || key.includes("상태"))
  : null;

  const columns =
    filteredData.length > 0
      ? Object.keys(filteredData[0]).map((col, index) => ({
          name: th[index], // 헤더 제목
          selector: (row) => row[col], // 데이터 매칭
          sortable: true,
          cell: (row) =>
            col === statusColumnKey ? ( // ✅ 상태 컬럼 자동 탐색 후 배지 적용
              <div className={`badge rounded-pill ${getBadgeClass(row[col])}`} style={{ fontSize: "14px", textAlign: "center" }}>
                {row[col]}
              </div>
            ) : (
              <div style={{ fontSize: "14px", textAlign: "center" }}>{row[col]}</div>
            ),
        }))
      : [];
      const customStyles = {
        headCells: {
          style: {
            fontSize: '18px !important',   // 폰트 크기
            fontWeight: 'bold',
            justifyContent: 'center',
            textAlign: 'center',           // 중앙 정렬
          },
        },
        cells: {
          style: {
            fontSize: '16px !important',
            justifyContent: 'center',
            textAlign: 'center',
          },
        },  
        rows: {
          style: {
            minHeight: '50px',  // 각 행의 높이 설정
            fontSize: '1000px !important',   // 행 텍스트 크기 설정
          },
        },
      };
      
  return (
    <div>
      <div className="new-top" style={{ marginBottom: "10px" }}>
        <select
          className="form-select w-auto"
          value={selectedFilter}
          onChange={handleFilterChange}
        >
          <option value="">전체</option>
          {option.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="card-body">
        <DataTable
          key={filteredData.length} // ✅ 데이터 변경 시 강제 리렌더링
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default Table;
