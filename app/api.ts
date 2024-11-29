const API_BASE = `https://jsonplaceholder.typicode.com`;

export async function getData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    let errorMessage = `Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      console.log("not json error");
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
