import {Injectable} from '@nestjs/common';
import {MulterModuleOptions, MulterOptionsFactory} from '@nestjs/platform-express';
import {diskStorage} from 'multer';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  // Get the root path of the project
  getRootPath = () => {
    return process.cwd();
  };

  // Create a directory if it doesn't exist
  ensureExists(targetDirectory: string) {
    try {
      fs.mkdirSync(targetDirectory, {recursive: true});
      console.log('Directory created successfully');
    } catch (err) {
      if (err.code === 'EEXIST') {
        console.log('Directory already exists');
      } else if (err.code === 'ENOTDIR') {
        console.error('Path exists but is not a directory');
      } else {
        console.error('Error creating directory:', err);
      }
    }
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? 'default';
          this.ensureExists(`public/images/${folder}`);
          // null tức là không có lỗi
          cb(null, path.join(this.getRootPath(), `public/images/${folder}`));
        },
        filename: (req, file, cb) => {
          // Get image extension
          const extName = path.extname(file.originalname);
          // Get image name without extension
          const baseName = path.basename(file.originalname, extName);
          // Generate a random string
          const finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    };
  }
}
