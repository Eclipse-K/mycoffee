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

// API: 만료된 쿠폰 제거
app.get("/api/user-coupons", (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const users = safeReadFile(userDataPath);
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const now = new Date();
  user.coupons = (user.coupons || []).filter((coupon) => {
    const expiryDate = new Date(coupon.expiry);
    return expiryDate >= now; // 만료되지 않은 쿠폰만 유지
  });

  safeWriteFile(userDataPath, users);
  res.json({ coupons: user.coupons });
});

// API: 쿠폰 받기
app.post("/api/claim-coupon", authenticateUser, (req, res) => {
  const { couponId } = req.body;

  const availableCoupons = [
    { id: 1, name: "10% 할인 쿠폰", discount: 10 },
    { id: 2, name: "무료 배송 쿠폰" },
  ];

  const coupon = availableCoupons.find((c) => c.id === couponId);
  if (!coupon) {
    return res.status(404).json({ error: "Coupon not found" });
  }

  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((u) => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = users[userIndex];
  user.coupons = user.coupons || [];

  // 중복 확인
  if (
    user.coupons.some((existingCoupon) => existingCoupon.name === coupon.name)
  ) {
    return res
      .status(400)
      .json({ error: `"${coupon.name}" 쿠폰은 이미 발급받았습니다.` });
  }

  const newCoupon = {
    id: uuidv4(),
    name: coupon.name,
    discount: coupon.discount,
    expiry: endOfMonth.toISOString().split("T")[0],
  };

  user.coupons.push(newCoupon);

  safeWriteFile(userDataPath, users);
  res.json({ success: true, coupons: user.coupons });
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

const getTitleById = (id) => {
  const coffeeData = safeReadFile(coffeeFilePath);
  for (const category in coffeeData) {
    const product = coffeeData[category].find(
      (item) => item.id === parseInt(id)
    );
    if (product) return product.title;
  }
  return null;
};

//상품 정보 조회
app.get("/api/product/:title", (req, res) => {
  const { title } = req.params;
  const coffeeData = safeReadFile(coffeeFilePath);

  let foundProduct = null;

  for (const category in coffeeData) {
    const product = coffeeData[category].find((item) => item.title === title);
    if (product) {
      foundProduct = product;
      break;
    }
  }

  if (foundProduct) {
    res.json({ success: true, product: foundProduct });
  } else {
    res
      .status(404)
      .json({ success: false, message: "상품을 찾을 수 없습니다." });
  }
});

//특정 상품의 후기 가져오기
// app.get("/api/reviews/:productTitle", authenticateUser, (req, res) => {
//   const { productTitle } = req.params;

//   const users = safeReadFile(userDataPath);
//   const user = users.find((u) => u.id === req.user.id);
//   if (!user) {
//     return res
//       .status(404)
//       .json({ success: false, message: "유저를 찾을 수 없습니다." });
//   }

//   const reviews = user.reviews[productTitle] || [];
//   res.json({ success: true, reviews });
// });
// 특정 상품의 후기 가져오기 (모든 사용자 접근 가능)
app.get("/api/reviews/:productTitle", (req, res) => {
  const { productTitle } = req.params;

  const users = safeReadFile(userDataPath);
  let allReviews = [];

  users.forEach((user) => {
    if (user.reviews && user.reviews[productTitle]) {
      allReviews = allReviews.concat(user.reviews[productTitle]);
    }
  });

  res.json({ success: true, reviews: allReviews });
});

// API: 사용자 후기 가져오기
app.get("/api/my-posts", authenticateUser, (req, res) => {
  const users = safeReadFile(userDataPath);
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, reviews: [] });
  }

  res.json({ success: true, reviews: user.reviews || {} });
});

//상품 구매 이력 저장/조회
const purchaseHistoryPath = path.join(__dirname, "./src/PurchaseHistory.json");

if (!fs.existsSync(purchaseHistoryPath)) {
  fs.writeFileSync(purchaseHistoryPath, JSON.stringify([]), "utf-8");
}

const hasPurchaseHistory = (userId, productId) => {
  const purchaseHistory = safeReadFile(purchaseHistoryPath);
  return purchaseHistory.some(
    (entry) => entry.userId === userId && entry.productId === productId
  );
};

//상품 후기를 저장
app.post("/api/reviews", authenticateUser, (req, res) => {
  const { productId, reviewContent, imgUrl } = req.body;

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((u) => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false });
  }

  const user = users[userIndex];
  if (!user.reviews[productId]) {
    user.reviews[productId] = [];
  }

  const newReview = {
    user: req.user.username,
    content: reviewContent,
    date: new Date().toISOString().split("T")[0],
    imgUrl: imgUrl || "", // imgUrl이 없을 경우 빈 문자열로 저장
  };

  user.reviews[productId].push(newReview);
  users[userIndex] = user;
  safeWriteFile(userDataPath, users);

  res.json({ success: true, reviews: user.reviews });
});

//후기 삭제
app.delete("/api/my-posts/:reviewIndex", authenticateUser, (req, res) => {
  const { reviewIndex } = req.params;

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((u) => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false });
  }

  const user = users[userIndex];
  const reviews = user.reviews || {};
  for (const product in reviews) {
    reviews[product].splice(reviewIndex, 1);
  }

  safeWriteFile(userDataPath, users);
  res.json({ success: true, reviews });
});

//게시물 삭제 최신 데이터 반영
app.delete("/api/my-posts", authenticateUser, (req, res) => {
  const { postIds } = req.body;

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((u) => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, reviews: {} });
  }

  const user = users[userIndex];
  const reviews = user.reviews || {};

  for (const product in reviews) {
    reviews[product] = reviews[product].filter(
      (_, idx) => !postIds.includes(idx)
    );
  }

  safeWriteFile(userDataPath, users);
  res.json({ success: true, reviews }); // 삭제 후 최신 리뷰 반환
});

//후기 수정
app.put(
  "/api/reviews/:productTitle/:reviewIndex",
  authenticateUser,
  (req, res) => {
    const { productTitle, reviewIndex } = req.params;
    const { reviewContent } = req.body;

    const users = safeReadFile(userDataPath);
    const userIndex = users.findIndex((u) => u.id === req.user.id);
    if (userIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "유저를 찾을 수 없습니다." });
    }

    const user = users[userIndex];
    const reviews = user.reviews[productTitle] || [];
    if (!reviews[reviewIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }

    // 수정
    reviews[reviewIndex].content = reviewContent;
    safeWriteFile(userDataPath, users);

    res.json({ success: true, reviews }); // 수정된 리뷰 목록 반환
  }
);

//리뷰 삭제
app.delete(
  "/api/reviews/:productTitle/:reviewIndex",
  authenticateUser,
  (req, res) => {
    const { productTitle, reviewIndex } = req.params;

    const users = safeReadFile(userDataPath);
    const userIndex = users.findIndex((u) => u.id === req.user.id);
    if (userIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "유저를 찾을 수 없습니다." });
    }

    const user = users[userIndex];
    const reviews = user.reviews[productTitle] || [];
    if (!reviews[reviewIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "리뷰를 찾을 수 없습니다." });
    }

    // 삭제
    reviews.splice(reviewIndex, 1);
    safeWriteFile(userDataPath, users);

    res.json({ success: true, reviews });
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

// 위시리스트 가져오기
app.get("/api/wishlist", authenticateUser, (req, res) => {
  try {
    const users = safeReadFile(userDataPath);
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "유저를 찾을 수 없습니다." });
    }

    user.wishlist = user.wishlist || []; // wishlist가 없으면 빈 배열로 초기화
    res.json(user.wishlist);
  } catch (error) {
    console.error("위시리스트 로드 오류:", error.message);
    res.status(500).json({ success: false, message: "서버 내부 오류" });
  }
});

// 위시리스트 추가
app.post("/api/wishlist/add", authenticateUser, (req, res) => {
  const { productId, category } = req.body;
  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((u) => u.id === req.user.id);

  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const coffeeItems = safeReadFile(coffeeFilePath);
  const product = coffeeItems[category]?.find((item) => item.id === productId);

  if (product) {
    const user = users[userIndex];
    user.wishlist = user.wishlist || [];
    if (!user.wishlist.some((item) => item.id === productId)) {
      const newItem = {
        uuid: uuidv4(), // 고유 식별자 생성
        img: product.img,
        title: product.title,
        price: product.price,
      };
      user.wishlist.push(newItem);
      safeWriteFile(userDataPath, users);
      return res.json(user.wishlist); // 전체 위시리스트 배열 반환
    } else {
      return res
        .status(400)
        .json({ success: false, message: "이미 추가된 상품입니다." });
    }
  }

  res.status(404).json({ success: false, message: "상품을 찾을 수 없습니다." });
});

// 위시리스트 삭제
app.post("/api/wishlist/remove", authenticateUser, (req, res) => {
  const { uuid } = req.body;

  if (!uuid) {
    console.error("삭제 요청에서 uuid가 누락되었습니다.");
    return res
      .status(400)
      .json({ success: false, message: "uuid가 필요합니다." });
  }

  const users = safeReadFile(userDataPath);
  const userIndex = users.findIndex((u) => u.id === req.user.id);

  if (userIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "유저를 찾을 수 없습니다." });
  }

  const user = users[userIndex];
  const initialLength = user.wishlist.length;
  user.wishlist = user.wishlist.filter((item) => item.uuid !== uuid);

  if (user.wishlist.length === initialLength) {
    console.error("위시리스트에서 uuid에 해당하는 항목을 찾을 수 없습니다.");
    return res
      .status(404)
      .json({ success: false, message: "항목을 찾을 수 없습니다." });
  }

  safeWriteFile(userDataPath, users);
  return res.json({ success: true, wishlist: user.wishlist });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
