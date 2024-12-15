// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// const TableComponent = () => {
//   // 상태: 화면에 보이는 테이블 행 (Set을 사용)
//   const [visibleRows, setVisibleRows] = useState(new Set()); // Set으로 상태 관리
  
//   // 테이블 행을 관찰할 ref 배열
//   const observeRef = useRef([]);

//   // 예시 데이터
//   const rows = [
//     { id: 1, name: 'Item 1', description: 'Description for item 1' },
//     { id: 2, name: 'Item 2', description: 'Description for item 2' },
//     { id: 3, name: 'Item 3', description: 'Description for item 3' },
//     { id: 4, name: 'Item 4', description: 'Description for item 4' },
//     { id: 5, name: 'Item 5', description: 'Description for item 5' },
//     { id: 6, name: 'Item 6', description: 'Description for item 6' },
//     { id: 7, name: 'Item 7', description: 'Description for item 7' },
//     { id: 8, name: 'Item 8', description: 'Description for item 8' },
//     { id: 9, name: 'Item 9', description: 'Description for item 9' },
//     { id: 10, name: 'Item 10', description: 'Description for item 10' },
//     { id: 11, name: 'Item 11', description: 'Description for item 11' },
//     { id: 12, name: 'Item 12', description: 'Description for item 12' },
//     { id: 13, name: 'Item 13', description: 'Description for item 13' },
//     { id: 14, name: 'Item 14', description: 'Description for item 14' },
//     { id: 15, name: 'Item 15', description: 'Description for item 15' },
//     { id: 16, name: 'Item 16', description: 'Description for item 16' },
//     { id: 17, name: 'Item 17', description: 'Description for item 17' },
//     { id: 18, name: 'Item 18', description: 'Description for item 18' },
//     { id: 19, name: 'Item 19', description: 'Description for item 19' },
//     { id: 20, name: 'Item 20', description: 'Description for item 20' },
//   ];
//   // IntersectionObserver 콜백 함수
//   const handleIntersection = useCallback((entries) => {
//     entries.forEach((entry) => {
//         //console.log(entry.target)
//       const rowId = entry.target.id; // 행의 id를 직접 추출

//       if (entry.isIntersecting) {
//         // 화면에 보이면 visibleRows에 추가
        
//         setVisibleRows((prev) => {
//           const newSet = new Set(prev); // 기존 Set을 복사
//           newSet.add(rowId); // Set에 추가 (중복은 자동으로 처리됨)
//           console.log(newSet)
//           return newSet;
//         });
//       } else {
//         // 화면에서 벗어나면 visibleRows에서 제거
//         setVisibleRows((prev) => {
//           const newSet = new Set(prev); // 기존 Set을 복사
//           newSet.delete(rowId); // Set에서 해당 id를 제거
//           return newSet;
//         });
//       }
//     });
//   });

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleIntersection, {
//       root: null, // viewport를 기준으로
//       rootMargin: '0px',
//       threshold: 1.0, // 50% 이상 보일 때 감지
//     });

//     // 각 테이블 행을 관찰
//     observeRef.current.forEach((row) => observer.observe(row));

//     // 컴포넌트가 unmount 될 때 observer 해제
//     // return () => {
//     //   observeRef.current.forEach((row) => observer.unobserve(row));
//     // };
//   }, []);


//   return (
//     <div>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Description</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row) => (
//               <TableRow
//                 key={row.id}
//                 id={row.id} // 각 행에 id를 추가 (각 행의 고유 식별자로 사용)
//                 ref={(el) => (observeRef.current[row.id] = el)} // 행을 ref로 추적
//               >
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.description}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default TableComponent;


//callback에는 entries(교차된 요소 배열로 반환) observer두개의 인자를 받음 
//const observer = new IntersectionObserver(callback,options);

//옵저버로 감시할 요소 지정
//observer.observe(element)

//옵저버 해제
//observer.unobserve(element)
//observer.disconnect()


// import React, { useState, useEffect, useRef } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// const TableWithIntersectionObserver = () => {
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

//   const [visibleRows, setVisibleRows] = useState([]);
//   const observeRef = useRef([]);
//   const [trigger, setTrigger] = useState(false); 
//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         console.log(entry.target.dataset)
//         const index = entry.target.dataset.index;
//         if (entry.isIntersecting) {//화면에 보여야할 요소
//           setVisibleRows((prev) => {
//              const newSet = new Set(prev);
//              newSet.add(index)
//              return [...newSet];
//           });
//         } else {
//             setVisibleRows((prev) => {
//                 console.log(index)
//                  const newSet = new Set(prev);
//                  newSet.delete(index)
//                  return [...newSet];
//               });
//         }
//       });
//     }, { rootMargin: '0px',  threshold: 1.0 });


//     const currentRef = observeRef.current;

//     // 각 항목에 대해 observer를 설정
//     if (currentRef.length > 0) {
//       currentRef.forEach((el) =>{ observer.observe(el)  ;    console.log("Observe 추가된 요소:", el);});
//     }

//     // 컴포넌트가 언마운트될 때 observer를 해제
// //   return () => {
// //       if (currentRef.length > 0) {
// //         console.log('언마운트')
// //         currentRef.forEach((el) => observer.unobserve(el));
// //       }
// //     };
//  // 컴포넌트가 언마운트될 때 observer를 해제
//  return () => {
//     console.log('언마운트');
//     // disconnect()를 사용하여 모든 관찰을 중지 foreach안돌리고 이렇게해도 먹히냐구.,
//     observer.disconnect(); 
//   };

// }, [trigger]);

// useEffect(()=>{
// console.log(visibleRows)
// },[visibleRows])

//   return (
//     <div>
//             <button onClick={() => setTrigger((prev) => !prev)}>Change Trigger</button>
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
//           <TableBody>
//             {rows.map((row) => (
//               <TableRow
//                 key={row.id}
//                 data-index={row.id}  // 각 항목의 인덱스를 데이터로 저장
//                 ref={(el) => (observeRef.current[row.id] = el)} // ref를 사용하여 Intersection Observer와 연결
//               >
//                 <TableCell>{row.id}</TableCell>
//                 <TableCell>{row.name}</TableCell>
//                 <TableCell>{row.age}</TableCell>
//                 <TableCell>{row.city}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default TableWithIntersectionObserver;



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
