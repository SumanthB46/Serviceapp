import fs from 'fs';
import path from 'path';

/**
 * Saves a base64 string as a file in the specified directory.
 * @param base64Data The base64 string (can include data:image/... prefix)
 * @param subDir The subdirectory under 'uploads' (e.g., 'verification/pending')
 * @param fileName Custom filename (optional)
 * @returns The relative path to the saved file (e.g., '/uploads/verification/pending/file.jpg')
 */
export const saveBase64File = (base64Data: string, subDir: string, fileName?: string): string => {
  if (!base64Data || !base64Data.startsWith('data:')) {
    // If it's already a URL or invalid, return it
    return base64Data;
  }

  const baseDir = path.join(process.cwd(), 'uploads');
  const targetDir = path.join(baseDir, subDir);

  // Ensure directories exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Extract extension and data
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 format');
  }

  const extension = matches[1].split('/')[1];
  const data = Buffer.from(matches[2], 'base64');
  const finalFileName = fileName || `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
  const filePath = path.join(targetDir, finalFileName);

  fs.writeFileSync(filePath, data);

  // Return relative path for database storage
  return `/uploads/${subDir}/${finalFileName}`.replace(/\\/g, '/');
};

/**
 * Deletes a file from the filesystem.
 * @param relativePath The relative path stored in the database (e.g., '/uploads/...')
 */
export const deleteFile = (relativePath: string): void => {
  if (!relativePath || !relativePath.startsWith('/uploads/')) return;

  const fullPath = path.join(process.cwd(), relativePath.substring(1)); // remove leading /

  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`[FILE SYSTEM] Deleted file: ${fullPath}`);
    } catch (err) {
      console.error(`[FILE SYSTEM] Error deleting file: ${fullPath}`, err);
    }
  }
};
