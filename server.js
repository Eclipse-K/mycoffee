require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5001;

// 환경 변수 확인
const serialKey = process.env.SECRET_KEY;
if (!serialKey) {
  throw new Error("SECRET_KEY is not defined in the .env file");
}

// 파일 경로 정의
const userDataPath = path.join(__dirname, "user-data.json");
const coffeeFilePath = path.join(__dirname, "./src/Coffee.json");

// 파일 초기화
if (!fs.existsSync(userDataPath)) {
  fs.writeFileSync(userDataPath, JSON.stringify([]), "utf-8");
}

// 공통 유틸리티 함수: 파일 읽기/쓰기
const safeReadFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error(`Failed to read file: ${filePath}`, error);
    return [];
  }
};

const safeWriteFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Failed to write file: ${filePath}`, error);
  }
};

// 미들웨어 설정
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// API: 로그인
app.post("/api/login", (req, res) => {
  const { id, password } = req.body;
  console.log("Login attempt:", id);

  try {
    const existingUsers = safeReadFile(userDataPath);
    const user = existingUsers.find(
      (user) => user.id === id && user.password === password
    );

    if (user) {
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        serialKey,
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

// API: JWT 토큰 검증
app.post("/api/verify-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "토큰이 없습니다." });
  }

  jwt.verify(token, serialKey, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message);
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
  const coffeeItems = safeReadFile(coffeeFilePath);
  res.json(coffeeItems);
});

// API: count 업데이트
app.post("/api/update-count", async (req, res) => {
  const { id, category } = req.body;
  const coffeeItems = safeReadFile(coffeeFilePath);

  if (coffeeItems[category]) {
    const item = coffeeItems[category].find((i) => i.id === id);

    if (item) {
      item.count += 1;
      safeWriteFile(coffeeFilePath, coffeeItems);
      res.json({ success: true, updatedItem: item });
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid category" });
  }
});

// API: 회원가입
app.post("/api/signup", (req, res) => {
  const newUser = req.body;

  const existingUsers = safeReadFile(userDataPath);
  existingUsers.push(newUser);

  safeWriteFile(userDataPath, existingUsers);

  res.json({ success: true, message: "회원가입이 완료되었습니다." });
});

// API: 쿠폰 조회
app.get("/api/user-coupons", (req, res) => {
  const username = req.query.username;

  const users = safeReadFile(userDataPath);
  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(404).json({ error: "유저를 찾을 수 없음" });
  }

  res.json({
    coupons: (user.coupons || []).map((coupon) => ({
      id: coupon.id,
      name: coupon.name,
      discount: coupon.discount || 0,
      expiry: coupon.expiry,
    })),
  });
});

// API: 사용자 정보 가져오기
app.get("/api/get-user-info", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "인증 토큰이 필요합니다." });
  }

  jwt.verify(token, serialKey, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "유효하지 않은 토큰입니다." });
    }

    const users = safeReadFile(userDataPath);
    const user = users.find((user) => user.id === decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "유저를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      userInfo: {
        id: user.id,
        username: user.username,
        email: user.email,
        birthdate: user.birthdate,
        phone: user.phone,
        address: user.address,
      },
    });
  });
});

// 사용자 장바구니 가져오기
app.get("/api/cart", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, cart: [] }); // 로그인하지 않은 경우
  }

  jwt.verify(token, serialKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, cart: [] });
    }

    const users = safeReadFile(userDataPath);
    const user = users.find((user) => user.id === decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, cart: [] });
    }

    res.json({ success: true, cart: user.cart || [] }); // 장바구니 데이터 반환
  });
});

// 사용자 장바구니 저장하기
app.post("/api/cart", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const { cart } = req.body;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "로그인이 필요합니다." });
  }

  jwt.verify(token, serialKey, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "유효하지 않은 토큰입니다." });
    }

    const users = safeReadFile(userDataPath);
    const userIndex = users.findIndex((user) => user.id === decoded.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    // 사용자의 장바구니 업데이트
    users[userIndex].cart = cart;
    safeWriteFile(userDataPath, users);

    res.json({ success: true, message: "장바구니가 저장되었습니다." });
  });
});

// API: 회원정보 필드별 수정
app.put("/api/update-user", (req, res) => {
  const { id, phone, address, email } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID가 누락되었습니다.",
    });
  }

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const user = users[userIndex];

  // 필드별 업데이트 처리
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;
  if (email !== undefined) user.email = email;

  users[userIndex] = user;
  safeWriteFile(userDataPath, users);

  res.json({
    success: true,
    message: "회원정보가 성공적으로 수정되었습니다.",
    user,
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
