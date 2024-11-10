import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TableWithIntersectionObserver = () => {
  const generateRows = () => {
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    const names = [
      'John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'David Wilson', 'Emily Harris', 'Frank Clark', 'Grace Lewis', 'Hannah Walker',
      'Ivy Hall', 'Jack Young', 'Kathy Adams', 'Luke Mitchell', 'Megan King', 'Nate Scott', 'Olivia Perez', 'Paul Thompson', 'Quincy Rodriguez', 'Rachel White',
      'Sam Lewis', 'Tina Hall', 'Ursula Allen', 'Vince Green', 'Walter Carter', 'Xander Evans', 'Yvonne Nelson', 'Zack Turner', 'Aaron Martin', 'Bella Lee'
    ];

    const rows = [];
    for (let i = 1; i <= 50; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomAge = Math.floor(Math.random() * 40) + 20; // 20 ~ 60 사이의 나이
      rows.push({ id: i, name: randomName, age: randomAge, city: randomCity });
    }
    return rows;
  };

  const rows = generateRows();

  const [visibleRows, setVisibleRows] = useState([]);
  const observeRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        
        const index = entry.target.dataset.index;
      //  console.log(entry.target.dataset)
        if (entry.isIntersecting) {//화면에 보여야할 요소
          setVisibleRows((prev) => {
            const newList = [...prev];
            if (!newList.some((item) => item.id === rows[index].id)) {
              newList.push(rows[index]);
              newList.sort((a,b)=>a.id -b.id);
              console.log('SSE 요청 보내기:', newList);
            }
            return newList;
          });
        } else {
          // 화면에서 벗어난 항목은 visibleRows에서 제거
          setVisibleRows((prev) => prev.filter((item) => item.id !== rows[index].id));
        }
      });
    }, { rootMargin: '0px',  threshold: 1.0 });


    const currentRef = observeRef.current;

    // 각 항목에 대해 observer를 설정
    currentRef.forEach((el) => observer.observe(el));

    // 컴포넌트가 언마운트될 때 observer를 해제
    return () => {
      currentRef.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-index={index}  // 각 항목의 인덱스를 데이터로 저장
                ref={(el) => (observeRef.current[index] = el)} // ref를 사용하여 Intersection Observer와 연결
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div>
        <h3>현재 화면에 보이는 데이터:</h3>
        <ul>
          {visibleRows.map((item) => (
            <li key={item.id}>{`${item.id}: ${item.name}, ${item.age}, ${item.city}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableWithIntersectionObserver;



// import React, { useState, useMemo, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { Virtuoso } from 'react-virtuoso';

// const TableVirtuoso = () => {
//   // 데이터 50개 생성
//   const generateRows = () => {
//     const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
//     const names = [
//       'John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'David Wilson', 'Emily Harris', 'Frank Clark', 'Grace Lewis', 'Hannah Walker',
//       'Ivy Hall', 'Jack Young', 'Kathy Adams', 'Luke Mitchell', 'Megan King', 'Nate Scott', 'Olivia Perez', 'Paul Thompson', 'Quincy Rodriguez', 'Rachel White',
//       'Sam Lewis', 'Tina Hall', 'Ursula Allen', 'Vince Green', 'Walter Carter', 'Xander Evans', 'Yvonne Nelson', 'Zack Turner', 'Aaron Martin', 'Bella Lee'
//     ];

//     const rows = [];
//     for (let i = 1; i <= 50; i++) {
//       const randomName = names[Math.floor(Math.random() * names.length)];
//       const randomCity = cities[Math.floor(Math.random() * cities.length)];
//       const randomAge = Math.floor(Math.random() * 40) + 20; // 20 ~ 60 사이의 나이
//       rows.push({ id: i, name: randomName, age: randomAge, city: randomCity });
//     }
//     return rows;
//   };

//   const rows = generateRows();


//     const [visibleRange, setVisibleRange] = useState({
//       startIndex: 0,
//       endIndex: 0,
//     })

//     // 화면에 보이는 항목 범위가 변경될 때마다 호출되는 함수
//     // const handleRangeChange = (startIndex, endIndex) => {
//     //   // 현재 화면에 보이는 항목들만 가져와서 visibleData에 저장
//     //   const visibleItems = rows.slice(startIndex, endIndex + 1);
//     //   setVisibleData(visibleItems); // 상태에 저장
//     //   console.log('현재 화면에 보이는 항목들:', visibleItems);  // 콘솔에 보이는 항목 출력
//     // };

//     const [subScribeList,setsubScribeList]=useState([]);
   

//     useEffect(()=>{
//       const visibleRows = rows.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
//       setsubScribeList(visibleRows);
//      // console.log('list' + JSON.stringify(subScribeList.map((item)=>item.id)));
//     },[visibleRange]);

//     useEffect(() => {
//       console.log(' subScribeList: ', JSON.stringify(subScribeList));
//     }, [subScribeList]);  

//     //센서 데이터 헤더도 map돌거임..
//   return (
//     <div>
//       <TableContainer component={Paper} sx={{ marginTop: 2 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Age</TableCell>
//               <TableCell>City</TableCell>
//             </TableRow>
//           </TableHead>
//         </Table>
//         <Virtuoso
//           totalCount={rows.length}  // 전체 항목 수
//           itemContent={(index) => {
//             const row = rows[index]; // 현재 인덱스에 해당하는 데이터
//             return (
//               <Table key={row.id}>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell>{row.id}</TableCell>
//                     <TableCell>{row.name}</TableCell>
//                     <TableCell>{row.age}</TableCell>
//                     <TableCell>{row.city}</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             );
//           }}
//          style={{ height: '800px' }}  // 스크롤 가능한 영역 크기 설정
//          rangeChanged={setVisibleRange}
//         />
//       </TableContainer>
//     </div>
//   );
// }

// export default TableVirtuoso;
