import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

export class Files {
  public static init(cwd: string): string {
    const storageDir = process.env.STORAGE_DIRECTORY;
    const uploadDir = path.join(cwd, storageDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    return uploadDir;
  }

  public static storage(...parts: string[]): string {
    return path.join(
      path.resolve(process.env.STORAGE_DIRECTORY),
      ...(parts ?? []),
    );
  }

  public static save(poster: Express.Multer.File): string | null {
    try {
      const fileName = `${randomUUID()}-${poster.originalname}`;
      const filePath = this.storage(fileName);
      
      fs.writeFileSync(filePath, poster.buffer);

      return fileName;
    } catch (_e) {
      return null;
    }
  }

  public static remove(poster: string): void {
    const filePath = Files.storage(poster);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
