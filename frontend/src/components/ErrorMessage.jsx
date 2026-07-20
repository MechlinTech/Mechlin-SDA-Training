function ErrorMessage({ message }) {
    return (
      <div
        style={{
          background: "#ffebee",
          color: "#b71c1c",
          padding: "20px",
          margin: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Error</h2>
  
        <p>{message}</p>
      </div>
    );
  }
  
  export default ErrorMessage;