export const formatToLocalDateTime = (utcString) => {
    const date = new Date(utcString);
    
    // YYYY-MM-DDTHH:MM:SS 형식으로 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const formatDate = (dateString) => {
    // 문자열을 Date 객체로 변환
    const date = new Date(dateString);
  
    // Intl.DateTimeFormat을 사용하여 형식 변경
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,  // 12시간제 (오전/오후)
    }).format(date);
  };