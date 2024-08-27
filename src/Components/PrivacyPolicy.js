import { useState } from "react";
import "./PrivacyPolicy.css";
import { Link } from "react-router-dom";

function PrivacyPolicy() {
  const [isAgree, setIsAgree] = useState(false);

  const checkAgreeChange = () => {
    setIsAgree(!isAgree);
  };

  const checkNextSubmit = (e) => {
    if (!isAgree) {
      e.preventDefault();
      alert("필수동의에 체크해 주시기 바랍니다.");
      return;
    }
    // 다음 단계로 이동하는 코드 작성
  };

  return (
    <div className="PrivacyPolicy">
      <div className="Privacy-Container">
        <h1>개인정보처리방침</h1>
        <p>
          본 개인정보처리방침은 (주)네이버(이하 “회사”)가 제공하는 서비스(이하
          “서비스”)를 이용하는 사용자(이하 “회원”)의 개인정보를 보호하고,
          사용자의 개인정보에 대한 권리와 이익을 보호하기 위해 제정되었습니다.
        </p>
        <h2>1. 개인정보의 수집 및 이용</h2>
        <p>
          회사는 회원이 서비스를 이용하기 위해 회원가입을 할 때, 회원의
          개인정보를 수집하고 이용합니다. 이때 수집되는 개인정보는 다음과
          같습니다.
        </p>
        <ul>
          <li>이름, 이메일, 비밀번호</li>
          <li>전화번호, 주소</li>
          <li>기타 서비스 이용에 필요한 정보</li>
        </ul>
        <h2>2. 개인정보의 보유 및 이용기간</h2>
        <p>
          회사는 회원의 개인정보를 서비스 이용기간 동안만 보유하며, 서비스 종료
          시에는 지체없이 파기합니다. 단, 다음의 경우에는 예외적으로 개인정보를
          보유할 수 있습니다.
        </p>
        <ul>
          <li>회원이 서비스를 이용하는 동안</li>
          <li>회원이 서비스를 탈퇴한 경우</li>
          <li>법령에 따라 개인정보를 보유해야 하는 경우</li>
        </ul>
        <h2>3. 개인정보의 제3자 제공</h2>
        <p>
          회사는 회원의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의
          경우에는 예외적으로 제3자에게 제공할 수 있습니다.
        </p>
        <ul>
          <li>법령에 따라 제3자에게 제공이 필요한 경우</li>
          <li>회원이 제3자에게 개인정보를 제공하는 것에 동의한 경우</li>
        </ul>
        <h2>4. 개인정보의 보호</h2>
        <p>
          회사는 회원의 개인정보를 안전하게 보호하기 위해 다음과 같은 조치를
          취하고 있습니다.
        </p>
        <ul>
          <li>개인정보 암호화</li>
          <li>개인정보 접근 제한</li>
          <li>개인정보 유출 방지</li>
        </ul>
        <h2>5. 개인정보의 열람, 정정, 삭제, 처리정지 요구</h2>
        <p>
          회원은 언제든지 자신의 개인정보를 열람, 정정, 삭제, 처리정지 요구할 수
          있습니다.
        </p>
        <h2>6. 개인정보보호책임자</h2>
        <p>
          회사는 개인정보보호책임자를 지정하여 회원의 개인정보를 보호하고,
          개인정보에 대한 불만이나 문의를 처리하고 있습니다.
        </p>
        <p>개인정보보호책임자: (이름) (이메일) (전화번호)</p>
      </div>
      <form className="Privacy-CheckBox">
        <input
          type="checkbox"
          checked={isAgree}
          onChange={checkAgreeChange}
          required
        />
        <label>필수항목에 동의합니다.</label>
      </form>
      <Link
        className="Privacy-Next-Button"
        disabled={!isAgree}
        onClick={checkNextSubmit}
        to="/SignupForm"
      >
        다음
      </Link>
    </div>
  );
}

export default PrivacyPolicy;
