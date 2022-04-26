export const fetchMetadata = async (url) => {
    const response = await fetch(url);
    const jsonData = await response.json();
    //console.log(jsonData)
    return jsonData;
  };