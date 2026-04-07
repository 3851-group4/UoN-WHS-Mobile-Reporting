const API_BASE = "http://localhost:8000";

interface ApiResponse<T> {
  code: number;
  msg?: string;
  data?: T;
}

export const uploadIssueImages = async (
  files: File[],
  token?: string
): Promise<string[]> => {
  if (files.length === 0) {
    return [];
  }

  return Promise.all(
    files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE}/api/issue/upload`, {
        method: "POST",
        headers: token ? { token } : undefined,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = (await response.json()) as ApiResponse<string>;
      if (result.code !== 200 || !result.data) {
        throw new Error(result.msg || "Failed to upload file");
      }

      return result.data;
    })
  );
};
