const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5001; // 포트를 5000으로 변경
const SECRET_KEY = "your_secret_key";

// 구체적인 CORS 설정
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // 쿠키를 포함한 요청을 허용
  optionsSuccessStatus: 200,
};

// CORS 및 JSON 요청 처리 미들웨어
app.use(cors(corsOptions));
app.use(express.json());

// 예제 사용자 정보
const users = {
  user1: "password1",
  user2: "password2",
};

// 로그인 처리 및 토큰 발급 API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const storedPassword = users[username];

  if (storedPassword && storedPassword === password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ success: true, token });
  } else {
    res.status(401).json({
      success: false,
      message: "아이디 또는 비밀번호가 일치하지 않습니다.",
    });
  }
});

// 토큰 검증 API
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
    res.json({ success: true, username: decoded.username });
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

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
