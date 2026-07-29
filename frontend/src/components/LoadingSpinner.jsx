function LoadingSpinner() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        ⏳ Loading Dashboard...
      </div>
    );
  }
  
  export default LoadingSpinner;