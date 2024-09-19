const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3001;

app.use(express.json()); // JSON 요청을 처리하기 위해 설정

const cors = require("cors");
app.use(cors()); // 모든 요청에 대해 CORS 허용

// Coffee JSON 파일 경로
const coffeeFilePath = path.join(__dirname, "./Coffee.json");

// JSON 파일 읽기 함수
const readCoffeeData = () => {
  const data = fs.readFileSync(coffeeFilePath, "utf-8");
  return JSON.parse(data);
};

// JSON 파일 쓰기 함수
const writeCoffeeData = (data) => {
  fs.writeFileSync(coffeeFilePath, JSON.stringify(data, null, 2), "utf-8");
};

// API: 모든 커피 항목 가져오기
app.get("/api/coffee-items", (req, res) => {
  const coffeeItems = readCoffeeData();
  res.json(coffeeItems);
});

// API: count 업데이트
app.post("/api/update-count", (req, res) => {
  const { id, category } = req.body; // 프론트엔드에서 id와 category를 보냅니다.
  const coffeeItems = readCoffeeData();

  if (coffeeItems[category]) {
    const item = coffeeItems[category].find((i) => i.id === id);

    if (item) {
      item.count += 1; // count 증가
      writeCoffeeData(coffeeItems); // 파일에 저장
      res.json({ success: true, updatedItem: item });
    } else {
      res.status(404).json({ success: false, message: "Item not found" });
    }
  } else {
    res.status(400).json({ success: false, message: "Invalid category" });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
