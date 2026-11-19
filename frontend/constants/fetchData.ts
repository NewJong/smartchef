import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchData = async (
    endpoint: string,
    method: string = "GET",
    body: any = null,
  ) => {
    try {
      const serverIP = "192.168.3.35"; 
      const url = `http://${serverIP}:8888/${endpoint}`;

      const token = await AsyncStorage.getItem('token');

      const options: RequestInit = {
        method,
        headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : null,
      };
      
      // console.log("Request:", { url, options });
      const start = Date.now();
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const end = Date.now() - start;
      console.log("Response time:", end, "ms");
      const data = await response.json();
      // console.log("Data from the server:", data);
      return data;
    } catch (error) {
      // console.error("Error loading data:", error);
      return null;
    }
  };
  