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
//포트 지정
const port = 4000;
const secretKey = process.env.REACT_APP_SECRET_KEY;
const refreshSecretKey = process.env.REACT_APP_REFRESH_SECRET_KEY;
//확인 -  // 이 미들웨어가 있어야 req.body에서 JSON 데이터를 파싱할 수 있습니다.
app.use(express.json());
//app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000", // 허용할 출처
    methods: ["GET", "POST", "DELETE"],
    credentials: true, // 쿠키를 포함하여 요청
  })
);

app.get("/", (req, res) => {
  res.send("연결성공");
});

app.post("/login", (req, res) => {
  try {
    console.log("secretKey" + secretKey);
    const { id, password } = req.body;

    if (id === "test" && password === "test") {
      const payload = { id, name: "테스트" };
      const accessToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      // 리프레시 토큰 생성 (유효 기간 7일)
      const refreshToken = jwt.sign(payload, refreshSecretKey, {
        expiresIn: "7d",
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

// 이게 미들웨어가 될 계획
app.get("/protected", (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1]; // 'Bearer token'에서 token만 추출

  if (!token) {
    return res.status(401).json({ message: "토큰이 존재하지 않습니다." });
  }
  const decoded = jwt.decode(token);
  console.log("decoded:" + JSON.stringify(decoded));
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      //토큰 유효x, 변조
      return res.status(403).json({ message: "Invalid token" });
    }

    const userIdFromToken = decoded.id;
    if (userIdFromToken === "test") {
      // "로그인한 사용자의 id"는 예시로 사용
      res.status(200).json({ result: decoded });
    } else {
      res.status(403).json({ message: "User ID does not match" });
    }
  });
});

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define where to store the uploaded images
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
      console.log("여기여");
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

    console.log("imageFiles:", imageFiles);

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

//port에 접속 성공하면 콜백 함수를 실행시킨다..
app.listen(port, () => {
  console.log(`server open~~~~  http://localhost:${port}`);
});
