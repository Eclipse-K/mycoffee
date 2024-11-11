const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5001;
const SECRET_KEY = "your_secret_key";

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const userDataPath = path.join(__dirname, "user-data.json");

app.post("/api/login", (req, res) => {
  const { id, password } = req.body;
  console.log("Login attempt:", id); // 디버깅을 위한 로그

  try {
    const existingUsers = JSON.parse(fs.readFileSync(userDataPath, "utf-8"));
    const user = existingUsers.find(
      (user) => user.id === id && user.password === password
    );

    if (user) {
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.json({
        success: true,
        token,
        id: user.id,
        email: user.email,
        username: user.username,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 일치하지 않습니다.",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

app.post("/api/verify-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "토큰이 없습니다." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "유효하지 않은 토큰입니다." });
    }
    res.json({
      success: true,
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    });
  });
});

// API: 커피 항목 가져오기
app.get("/api/coffee-items", (req, res) => {
  const coffeeItems = readCoffeeData();
  res.json(coffeeItems);
});

// count 업데이트 API
app.post("/api/update-count", (req, res) => {
  const { id, category } = req.body;
  const coffeeItems = readCoffeeData();

  if (coffeeItems[category]) {
    const item = coffeeItems[category].find((i) => i.id === id);

    if (item) {
      item.count += 1;
      writeCoffeeData(coffeeItems);
      res.json({ success: true, updatedItem: item });
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid category" });
  }
});

// JSON 파일 경로 및 읽기/쓰기 함수
const coffeeFilePath = path.join(__dirname, "./src/Coffee.json");
const readCoffeeData = () =>
  JSON.parse(fs.readFileSync(coffeeFilePath, "utf-8"));
const writeCoffeeData = (data) =>
  fs.writeFileSync(coffeeFilePath, JSON.stringify(data, null, 2), "utf-8");

// 회원가입 API 경로
app.post("/api/signup", (req, res) => {
  const newUser = req.body;

  // 파일이 없거나 비어 있으면 새 파일 생성 후 빈 배열로 초기화
  if (
    !fs.existsSync(userDataPath) ||
    fs.readFileSync(userDataPath, "utf-8").trim() === ""
  ) {
    fs.writeFileSync(userDataPath, JSON.stringify([]));
  }

  // 기존 데이터 로드 후 새 사용자 추가
  const existingUsers = JSON.parse(fs.readFileSync(userDataPath, "utf-8"));
  existingUsers.push(newUser);

  // 파일에 업데이트된 사용자 목록 저장
  fs.writeFileSync(userDataPath, JSON.stringify(existingUsers, null, 2));

  res.json({ success: true, message: "회원가입이 완료되었습니다." });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
