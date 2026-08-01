export const capitalize = (text = "") => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  
  export const truncateText = (
    text,
    length = 100
  ) => {
    if (!text) return "";
  
    return text.length > length
      ? text.substring(0, length) + "..."
      : text;
  };