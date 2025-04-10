interface RegisterDto {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  const AUTH_API_URL = "https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net/auth";
  
  export const registerUser = async (data: RegisterDto): Promise<{ message: string; email: string }> => {
    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // To handle identity cookies
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Registration failed: ${errorText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };
  