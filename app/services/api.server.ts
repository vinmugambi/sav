const API_BASE = `https://jsonplaceholder.typicode.com`;

export async function getData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => {
        console.error("Error parsing error body");
      });

      if (response.status >= 500 && response.status < 600) {
        throw new Error("Request to downstream server failed");
      } else if (response.status >= 400 && response.status < 500) {
        throw new Error(errorData?.error || "An unknown client error occurred");
      }
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Unable to reach downstream server");
    }
    throw error;
  }
}
