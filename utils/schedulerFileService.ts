/**
 * Utility untuk fetch dan process file dari scheduler API
 */

export const fetchScheduleFile = async (
  filename: string,
  schedulerBaseUrl: string
): Promise<string> => {
  try {
    const response = await fetch(`${schedulerBaseUrl}/download/${filename}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Get file sebagai text (CSV)
    const csvContent = await response.text();
    return csvContent;
  } catch (error) {
    throw new Error(
      `Error fetching schedule file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Fetch file dan return sebagai base64 untuk download
 */
export const downloadScheduleFile = async (
  filename: string,
  schedulerBaseUrl: string
): Promise<void> => {
  try {
    const response = await fetch(`${schedulerBaseUrl}/download/${filename}`);

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(
      `Error downloading file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
