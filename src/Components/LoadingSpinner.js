import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>로딩중...</p>
    </div>
  );
};

export default LoadingSpinner;
