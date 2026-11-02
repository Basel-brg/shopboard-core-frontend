export interface ApiOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  let url = endpoint;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      searchParams.append(key, String(val));
    });
    url += (url.includes('?') ? '&' : '?') + searchParams.toString();
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
