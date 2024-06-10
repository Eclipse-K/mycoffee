import "./Footer.css";

function Footer() {
  return (
    <footer className="Footer">
      <div className="Footer-container">
        <h1>My Coffee (마이커피)</h1>
        <ul className="Footer-info-1">
          <li>이용약관</li>
          <li>개인정보처리방침</li>
          <li>이용안내</li>
          <li>자주 묻는 질문</li>
        </ul>
        <ul className="Footer-info-2">
          <li>고객센터 000-0000-0000</li>
          <li>
            #교환/반품/AS 문의는 고객센터로 사진과 함께 문의 부탁드립니다!
          </li>
          <li>
            평일 AM09:30 ~ PM5:00 / 점심시간 11:30 ~ 12:30 (토, 일, 공휴일 휴무_
            오프라인 매장은 운영하지 않습니다.)
          </li>
        </ul>
        <ul className="Footer-info-3">
          <li>(주)마이커피 주식회사 </li>
          <li>마이커피대표자 : ???</li>
          <li>주소 : ???</li>
          <li>사업자등록번호 : 000-00-00000 [사업자정보확인]</li>
          <li>통신판매업신고번호 : 0000-????-0000</li>
          <li>개인정보관리책임자 : ??? (E-mail)</li>
        </ul>
        <p className="Copyright">copyright.마이커피. all rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
