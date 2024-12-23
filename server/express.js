//express로드 , 이를 통해 express모듈을 제어한다.
require("dotenv").config({ path: "../.env" });

const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { Pool } = require("pg");
//포트 지정
const port = 4000;
const secretKey = process.env.REACT_APP_SECRET_KEY;
const refreshSecretKey = process.env.REACT_APP_REFRESH_SECRET_KEY;
app.use(express.json());


// app.use(
//   cors({
//     origin: ['http://localhost:6500', 'http://localhost:3000','http://192.168.219.105:6500'], // 클라이언트 출처
//     methods: ["GET", "POST", "DELETE", "PUT"], // 허용할 HTTP 메소드
//  //   credentials: true, // 쿠키를 포함한 요청을 허용
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:6500',
        'http://localhost:3000',
        'http://192.168.219.105:6500'
      ];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // CORS를 허용
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    // credentials: true, // 쿠키 포함 요청 허용 시 활성화
  })
);


// Preflight 요청 처리 /
app.options('*', cors({
  origin: ['http://localhost:6500', 'http://localhost:3000','http://192.168.219.105:6500'],
  methods: ["GET", "POST", "DELETE", "PUT"],
  // credentials: true,
}));

// PostgreSQL 연결 정보
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// DB 연결 확인
// pool
//   .connect()
//   .then((client) => {
//     console.log("PostgreSQL 데이터베이스에 연결됨!");

//     // 쿼리 실행 (SELECT * FROM member)
//     return client.query('select * from "MEMBER"');
//   })
//   .then((result) => {
//     // 쿼리 결과 확인
//     console.log("쿼리 결과:", result.rows); // member 테이블의 모든 데이터 출력
//   })
//   .catch((err) => {
//     console.error("PostgreSQL 연결 실패:", err.stack);
//   });

app.get("/", (req, res) => {
  res.send("연결성공");
});

app.post("/login", (req, res) => {
  console.log('로그인 누름')
  try {
    const { id, password } = req.body;


    if (id === "test" && password === "test") {
      const payload = { id, name: "테스트" };
      const accessToken = jwt.sign(payload, secretKey, { expiresIn: "5s" });

      const refreshToken = jwt.sign(payload, refreshSecretKey, {
        expiresIn: "30m",
      });

      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
      });
    } else {
      res.json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh Token을 이용한 새로운 Access Token 발급
app.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  // Refresh Token을 검증
  jwt.verify(refreshToken, refreshSecretKey, (err, decoded) => {
    if (err) {
      console.log("error" + err);
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    // 리프레시 토큰이 유효한 경우 새로운 access token 발급
    const payload = { id: decoded.id, name: decoded.name };
    const newAccessToken = jwt.sign(payload, secretKey, { expiresIn: "24h" });
    console.log("리프래시토큰 발급완료");
    res.json({ accessToken: newAccessToken });
  });
});

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "C:/myIntro/doyun0327.github.io/server/images"); // Save images in the "uploads" folder
    cb(null, "./images"); // Save images in the "uploads" folder
  },
  filename: function (req, file, cb) {
    // Define the file name (use original name or generate a unique name)
    cb(null, Date.now() + path.extname(file.originalname)); // Adding timestamp to avoid name collision
  },
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // 폼에서 텍스트 데이터 가져오기
    const text = req.body.text;
    console.log("text :" + text);
    // 랜덤 UUID 생성
    const randomId = uuidv4(); // UUID를 사용하여 랜덤 id 생성

    // 원래 파일 이름과 랜덤 UUID 결합 (확장자도 유지)
    const originalFileName = req.file.filename;
    const fileExtension = path.extname(originalFileName); // 파일 확장자 추출
    const fileBaseName = path.basename(originalFileName, fileExtension); // 확장자 제외 파일 이름

    const newFileName = `${randomId}_${fileBaseName}${fileExtension}`; // 랜덤 UUID + 원래 파일 이름

    // 새 파일 경로
    const newFilePath = path.join(imageDir, newFileName);

    // 파일을 새로운 이름으로 저장 (이동)
    fs.renameSync(path.join(imageDir, originalFileName), newFilePath);

    const textFilePath = path.join(
      imageDir,
      newFileName.replace(fileExtension, ".txt")
    );

    // 텍스트 파일에 랜덤 id와 텍스트 저장
    fs.writeFileSync(textFilePath, text);

    // 클라이언트에 응답
    res.status(200).json({
      message: "Upload successful!",
      file: newFileName, // 새로운 파일 이름 반환
      text: text, // 저장된 텍스트 정보도 반환 (선택 사항)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
});

// 'images' 폴더를 static 파일로 제공
const imageDir = path.join(__dirname, "images");
app.use("/images", express.static(imageDir));

app.get("/gallery", (req, res) => {
  console.log("imageDir: " + imageDir);

  // 이미지 디렉토리에서 파일 목록을 읽음
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error("이미지 파일 목록을 가져오는 데 실패했습니다.", err);
      return res.status(500).send("서버 오류");
    }

    // 이미지 파일만 필터링 (jpg, jpeg, png, gif 확장자)
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    // 이미지와 매칭되는 텍스트 파일 목록을 함께 반환
    const imageData = imageFiles.map((imageFile) => {
      const textFile = path.join(
        imageDir,
        imageFile.replace(/\.(jpg|jpeg|png|gif)$/i, ".txt")
      );

      // 텍스트 파일이 존재하면 읽고, 없으면 빈 텍스트를 사용
      let textContent = "";
      if (fs.existsSync(textFile)) {
        console.log("textContent0:", textContent);
        textContent = fs.readFileSync(textFile, "utf-8");
      }

      // 이미지와 해당 텍스트를 매핑하여 반환
      return {
        image: imageFile,
        text: textContent,
      };
    });

    // 이미지와 텍스트 데이터를 JSON으로 반환
    res.json({ gallery: imageData });
  });
});

// 이미지 삭제 API
app.delete("/gallery/:filename", (req, res) => {
  const { filename } = req.params; // 요청받은 파일명
  const imagePath = path.join(imageDir, filename); // 이미지 파일 경로
  const textFilePath = path.join(
    imageDir,
    filename.replace(/\.(jpg|jpeg|png|gif)$/i, ".txt")
  ); // 텍스트 파일 경로

  // 이미지 파일 삭제
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("이미지 삭제 실패:", err);
      return res.status(500).send("이미지 삭제 실패");
    }

    // 텍스트 파일 삭제
    fs.unlink(textFilePath, (err) => {
      if (err) {
        console.error("텍스트 파일 삭제 실패:", err);
        return res.status(500).send("텍스트 파일 삭제 실패");
      }

      // 성공적으로 삭제되었음을 응답
      res.status(200).send("이미지와 텍스트 파일이 삭제되었습니다.");
    });
  });
});

// 이미지 및 텍스트 수정 API
app.put("/edit/:filename", upload.single("image"), (req, res) => {
  const { filename } = req.params; // URL 파라미터로 받은 기존 파일명
  const { text } = req.body; // 수정된 텍스트 (폼 데이터로 받아옴)

  // 기존 이미지 및 텍스트 파일 경로 설정
  const imagePath = path.join(imageDir, filename); // 기존 이미지 경로
  const textFilePath = path.join(
    imageDir,
    filename.replace(/\.(jpg|jpeg|png|gif)$/i, ".txt")
  ); // 기존 텍스트 파일 경로

  // 1. 텍스트만 수정한 경우
  if (!req.file && text) {
    // 이미지 파일이 없고 텍스트만 존재하는 경우
    fs.writeFile(textFilePath, text, (err) => {
      if (err) {
        console.error("텍스트 파일 저장 실패:", err);
        return res.status(500).send("텍스트 파일 저장 실패");
      }
      res.status(200).send("텍스트 파일이 수정되었습니다.");
    });
    return;
  }

  // 2. 이미지만 수정한 경우
  if (req.file && !text) {
    // 이미지 파일이 있고 텍스트가 없는 경우
    const newImagePath = path.join(imageDir, req.file.filename); // 새 이미지 파일 경로
    fs.rename(req.file.path, newImagePath, (err) => {
      if (err) {
        console.error("새 이미지 저장 실패:", err);
        return res.status(500).send("새 이미지 저장 실패");
      }
      res.status(200).send("이미지 파일이 수정되었습니다.");
    });
    return;
  }

  // 3. 이미지와 텍스트 둘 다 수정한 경우
  // 기존 이미지 삭제
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("기존 이미지 삭제 실패:", err);
      return res.status(500).send("기존 이미지 삭제 실패");
    }

    // 기존 텍스트 파일 삭제
    fs.unlink(textFilePath, (err) => {
      if (err) {
        console.error("기존 텍스트 파일 삭제 실패:", err);
        return res.status(500).send("기존 텍스트 파일 삭제 실패");
      }

      // 새로운 이미지 업로드 (req.file는 업로드된 새 이미지)
      const newImagePath = path.join(imageDir, req.file.filename); // 새 이미지 파일 경로
      fs.rename(req.file.path, newImagePath, (err) => {
        if (err) {
          console.error("새 이미지 저장 실패:", err);
          return res.status(500).send("새 이미지 저장 실패");
        }

        // 텍스트 파일 저장 (텍스트가 있는 경우에만)
        if (text) {
          const newTextFilePath = path.join(
            imageDir,
            req.file.filename.replace(/\.(jpg|jpeg|png|gif)$/i, ".txt")
          ); // 새 텍스트 파일 경로
          fs.writeFile(newTextFilePath, text, (err) => {
            if (err) {
              console.error("텍스트 파일 저장 실패:", err);
              return res.status(500).send("텍스트 파일 저장 실패");
            }

            // 성공적으로 수정이 완료되었음을 응답
            res.status(200).send("이미지와 텍스트 파일이 수정되었습니다.");
          });
        } else {
          // 텍스트 없이 이미지만 수정한 경우
          res.status(200).send("이미지 수정만 완료되었습니다.");
        }
      });
    });
  });
});

// app.put("/edit/:filename", upload.single("image"), (req, res) => {
//   const { filename } = req.params; // URL 파라미터로 받은 기존 파일명
//   const imagePath = path.join(imageDir, filename); // 기존 이미지 파일 경로
//   const textFilePath = path.join(
//     imageDir,
//     filename.replace(/\.(jpg|jpeg|png|gif)$/i, ".txt")
//   ); // 기존 텍스트 파일 경로

//   // 기존 이미지 삭제
//   fs.unlink(imagePath, (err) => {
//     if (err) {
//       console.error("기존 이미지 삭제 실패:", err);
//       return res.status(500).send("기존 이미지 삭제 실패");
//     }

//     // 기존 텍스트 파일 삭제
//     fs.unlink(textFilePath, (err) => {
//       if (err) {
//         console.error("기존 텍스트 파일 삭제 실패:", err);
//         return res.status(500).send("기존 텍스트 파일 삭제 실패");
//       }

//       // 새 이미지 파일과 텍스트 파일 저장
//       const newImagePath = path.join(imageDir, req.file.filename); // 새 이미지 파일 경로
//       const newTextFilePath = path.join(
//         imageDir,
//         req.file.filename.replace(/\.(jpg|jpeg|png|gif)$/i, ".txt")
//       ); // 새 텍스트 파일 경로

//       // 새 이미지 파일 저장
//       fs.rename(req.file.path, newImagePath, (err) => {
//         if (err) {
//           console.error("새 이미지 저장 실패:", err);
//           return res.status(500).send("새 이미지 저장 실패");
//         }

//         // 새 텍스트 파일 저장 (텍스트는 `req.body.text`로 받는다)
//         if (req.body.text) {
//           fs.writeFile(newTextFilePath, req.body.text, (err) => {
//             if (err) {
//               console.error("텍스트 파일 저장 실패:", err);
//               return res.status(500).send("텍스트 파일 저장 실패");
//             }

//             // 성공적으로 수정이 완료되었음을 응답
//             res.status(200).send("이미지 및 텍스트 파일이 수정되었습니다.");
//           });
//         } else {
//           // 텍스트 없이 이미지만 수정한 경우
//           res.status(200).send("이미지만 수정되었습니다.");
//         }
//       });
//     });
//   });
// });
//port에 접속 성공하면 콜백 함수를 실행시킨다..
app.listen(port, () => {
  console.log(`server open~~~~  http://localhost:${port}`);
});
