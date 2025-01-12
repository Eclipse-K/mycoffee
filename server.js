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

const reviewsFilePath = path.join(__dirname, "./src/Reviews.json");

// 초기 파일 생성
if (!fs.existsSync(reviewsFilePath)) {
  fs.writeFileSync(reviewsFilePath, JSON.stringify([]), "utf-8");
}

//로그인 상태 확인 및 사용자 정보 가져오기
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

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
    req.user = decoded; // 사용자 정보를 요청 객체에 추가
    next();
  });
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

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  console.log("쿠폰 요청 사용자:", username);

  const users = safeReadFile(userDataPath);
  const user = users.find((u) => u.username === username);

  if (!user) {
    console.error("유저를 찾을 수 없습니다:", username);
    return res.status(404).json({ error: "User not found" });
  }

  const coupons = user.coupons || [];
  console.log("사용자 쿠폰 목록:", coupons);

  res.json({ coupons });
});

// API: 사용자 정보 가져오기
app.get("/api/get-user-info", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("받은 토큰:", token); // 디버깅용 로그

  if (!token) {
    console.error("토큰이 없습니다.");
    return res
      .status(401)
      .json({ success: false, message: "인증 토큰이 필요합니다." });
  }

  jwt.verify(token, serialKey, (err, decoded) => {
    if (err) {
      console.error("토큰 검증 실패:", err.message);
      return res
        .status(403)
        .json({ success: false, message: "유효하지 않은 토큰입니다." });
    }

    console.log("디코딩된 사용자 정보:", decoded); // 디버깅용 로그

    const users = safeReadFile(userDataPath);
    const user = users.find((user) => user.id === decoded.id);

    if (!user) {
      console.error("유저를 찾을 수 없습니다. ID:", decoded.id);
      return res.status(404).json({
        success: false,
        message: "유저를 찾을 수 없습니다.",
      });
    }

    console.log("찾은 유저:", user); // 디버깅용 로그

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

// 비밀번호 검증 API
app.post("/api/verify-password", (req, res) => {
  const { id, password } = req.body;

  // user-data.json에서 데이터 읽기
  fs.readFile(userDataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading user data:", err);
      return res.status(500).json({ success: false, message: "서버 오류" });
    }

    const users = JSON.parse(data);
    const user = users.find((u) => u.id === id); // ID로 사용자 찾기

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "사용자를 찾을 수 없습니다." });
    }

    if (user.password === password) {
      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
  });
});

//특정 상품의 후기 가져오기
app.get("/api/reviews/:productId", (req, res) => {
  const { productId } = req.params;
  const reviews = safeReadFile(reviewsFilePath);

  // 상품 ID에 해당하는 리뷰 반환
  const productReviews = reviews[productId] || [];
  res.json(productReviews);
});

//상품 후기를 저장
app.post("/api/reviews", authenticateUser, (req, res) => {
  const { productId, reviewContent } = req.body;
  const reviews = safeReadFile(reviewsFilePath);

  if (!reviews[productId]) {
    reviews[productId] = []; // 해당 상품 ID가 없으면 초기화
  }

  const newReview = {
    user: req.user.username, // 토큰에서 가져온 사용자 이름
    content: reviewContent,
    date: new Date().toISOString().split("T")[0],
  };

  reviews[productId].push(newReview);
  safeWriteFile(reviewsFilePath, reviews);

  res.json(reviews[productId]); // 해당 상품 ID의 후기 리스트 반환
});

//후기 삭제
app.delete(
  "/api/reviews/:productId/:reviewIndex",
  authenticateUser,
  (req, res) => {
    const { productId, reviewIndex } = req.params;
    const reviews = safeReadFile(reviewsFilePath);

    if (!reviews[productId] || !reviews[productId][reviewIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }

    const review = reviews[productId][reviewIndex];
    if (review.user !== req.user.username) {
      return res
        .status(403)
        .json({ success: false, message: "삭제 권한이 없습니다." });
    }

    reviews[productId].splice(reviewIndex, 1); // 해당 리뷰 삭제
    safeWriteFile(reviewsFilePath, reviews);

    res.json({ success: true, reviews: reviews[productId] }); // 해당 상품 ID의 리뷰 반환
  }
);

//후기 수정
app.put(
  "/api/reviews/:productId/:reviewIndex",
  authenticateUser,
  (req, res) => {
    const { productId, reviewIndex } = req.params;
    const { reviewContent } = req.body;
    const reviews = safeReadFile(reviewsFilePath);

    if (!reviews[productId] || !reviews[productId][reviewIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }

    const review = reviews[productId][reviewIndex];
    if (review.user !== req.user.username) {
      return res
        .status(403)
        .json({ success: false, message: "수정 권한이 없습니다." });
    }

    reviews[productId][reviewIndex].content = reviewContent; // 리뷰 수정
    safeWriteFile(reviewsFilePath, reviews);

    res.json({ success: true, reviews: reviews[productId] });
  }
);

// API: 기본 배송지 설정
app.put("/api/addresses/:id/default", authenticateUser, (req, res) => {
  const { id } = req.params;
  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((user) => user.id === req.user.id);

  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const user = users[userIndex];
  user.addresses.forEach((addr) => (addr.isDefault = false)); // 모든 배송지 기본값 해제
  const addressIndex = user.addresses.findIndex(
    (addr) => addr.id === parseInt(id)
  );

  if (addressIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "배송지를 찾을 수 없습니다." });
  }

  user.addresses[addressIndex].isDefault = true; // 새로운 기본 배송지 설정
  users[userIndex] = user;
  safeWriteFile(userDataPath, users);

  res.json({ success: true, addresses: user.addresses });
});

// API: 배송지 목록 조회
app.get("/api/addresses", authenticateUser, (req, res) => {
  const users = safeReadFile(userDataPath);
  const user = users.find((user) => user.id === req.user.id);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  res.json({ success: true, addresses: user.addresses || [] });
});

// API: 배송지 추가
app.post("/api/addresses", authenticateUser, (req, res) => {
  const { addressName, name, phone, address, request } = req.body;
  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((user) => user.id === req.user.id);

  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const user = users[userIndex];
  if (!user.addresses) {
    user.addresses = [];
  }

  // 필요한 경우 crypto 모듈 사용
  const { v4: uuidv4 } = require("uuid");

  // ID 생성 방식 변경
  const newAddress = {
    id: uuidv4(), // UUID로 고유 ID 생성
    addressName,
    name,
    phone,
    address,
    request,
    isDefault: user.addresses.length === 0,
  };

  user.addresses.push(newAddress);
  users[userIndex] = user;
  safeWriteFile(userDataPath, users);

  res.json({ success: true, addresses: user.addresses });
});

// API: 특정 배송지 정보 조회
app.get("/api/addresses/:id", authenticateUser, (req, res) => {
  const { id } = req.params;
  const users = safeReadFile(userDataPath);
  const user = users.find((user) => user.id === req.user.id);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  // ID를 문자열로 비교
  const address = user.addresses.find((addr) => String(addr.id) === String(id));

  if (!address) {
    return res
      .status(404)
      .json({ success: false, message: "배송지를 찾을 수 없습니다." });
  }

  res.json(address);
});

// API: 배송지 수정
app.put("/api/addresses/:id", authenticateUser, (req, res) => {
  const { id } = req.params;
  const { addressName, name, phone, address, request } = req.body; // 모든 필드 받기

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((user) => user.id === req.user.id);

  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const user = users[userIndex];
  const addressIndex = user.addresses.findIndex(
    (a) => String(a.id) === String(id)
  ); // 문자열로 비교

  if (addressIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "배송지를 찾을 수 없습니다." });
  }

  // 필드 업데이트
  const addressToUpdate = user.addresses[addressIndex];
  addressToUpdate.addressName = addressName || addressToUpdate.addressName;
  addressToUpdate.name = name || addressToUpdate.name;
  addressToUpdate.phone = phone || addressToUpdate.phone;
  addressToUpdate.address = address || addressToUpdate.address;
  addressToUpdate.request = request || addressToUpdate.request;

  // 파일 저장
  users[userIndex] = user;
  safeWriteFile(userDataPath, users);

  res.json({ success: true, addresses: user.addresses });
});

// API: 배송지 삭제
app.delete("/api/addresses/:id", authenticateUser, (req, res) => {
  const { id } = req.params;

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((user) => user.id === req.user.id);

  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const user = users[userIndex];
  user.addresses = user.addresses.filter((a) => a.id !== parseInt(id));

  users[userIndex] = user;
  safeWriteFile(userDataPath, users);

  res.json({ success: true, addresses: user.addresses });
});

// API: 나의 문의 목록 조회
app.get("/api/my-inquiries", authenticateUser, (req, res) => {
  const users = safeReadFile(userDataPath);
  const user = users.find((user) => user.id === req.user.id);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const inquiries = user.inquiries || []; // 문의 데이터
  res.json({ success: true, inquiries });
});

const { v4: uuidv4 } = require("uuid"); // 파일 상단에 추가

// API: 문의 추가
app.post("/api/my-inquiries", authenticateUser, (req, res) => {
  const { title, content } = req.body;

  // 입력값 확인
  if (!title || !content) {
    console.error("문의 추가 실패: 제목 또는 내용이 비어 있음");
    return res
      .status(400)
      .json({ success: false, message: "제목과 내용을 입력해주세요." });
  }

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((user) => user.id === req.user.id);

  if (userIndex === -1) {
    console.error("문의 추가 실패: 유저를 찾을 수 없음");
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const user = users[userIndex];
  if (!user.inquiries) {
    user.inquiries = [];
  }

  // UUID로 고유 ID 생성
  let newInquiry;
  try {
    console.log("UUID 생성 시도...");
    const generatedUuid = uuidv4(); // UUID 생성
    console.log("생성된 UUID:", generatedUuid);

    newInquiry = {
      id: generatedUuid, // 고유한 UUID 사용
      title,
      content,
      date: new Date().toISOString(),
    };
    console.log("새 문의 데이터 생성 성공:", newInquiry);
  } catch (error) {
    console.error("UUID 생성 실패:", error);
    return res.status(500).json({
      success: false,
      message: "문의 ID 생성 중 오류가 발생했습니다.",
    });
  }

  // 문의 데이터 추가
  try {
    user.inquiries.push(newInquiry);
    users[userIndex] = user;
    safeWriteFile(userDataPath, users);
    console.log("문의 데이터 저장 성공");
    res.json({ success: true, inquiries: user.inquiries });
  } catch (error) {
    console.error("문의 저장 실패:", error);
    res
      .status(500)
      .json({ success: false, message: "문의 저장 중 오류가 발생했습니다." });
  }
});

// API: 문의 삭제
app.delete("/api/my-inquiries/:id", authenticateUser, (req, res) => {
  const { id } = req.params;

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((user) => user.id === req.user.id);

  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const user = users[userIndex];
  if (!user.inquiries) {
    user.inquiries = [];
  }

  // 문의 삭제
  const inquiryIndex = user.inquiries.findIndex((inquiry) => inquiry.id === id);
  if (inquiryIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "문의가 존재하지 않습니다." });
  }

  user.inquiries.splice(inquiryIndex, 1); // 해당 문의 삭제
  users[userIndex] = user;
  safeWriteFile(userDataPath, users);

  res.json({ success: true, inquiries: user.inquiries }); // 갱신된 목록 반환
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
