import { unlink } from "fs/promises";

export async function deleteFile(path: string) {
  try {
    await unlink(path);
    console.log(`Successfully deleted ${path}`);
  } catch (error) {
    console.error('Error deleting file:', error.message);
  }
}