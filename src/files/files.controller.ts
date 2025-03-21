import {Controller, Delete, Get, Param, Post, Res, UploadedFile, UseFilters, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {Response} from 'express';
import * as fs from 'fs';
import {join} from 'path';
import {HttpExceptionFilter} from 'src/core/http-exception.filter';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {FilesService} from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(new HttpExceptionFilter())
  @ResponseMessage('File uploaded successfully')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }

  @Get('images/:folder/:filename')
  getImage(@Param('folder') folder: string, @Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'public', 'images', folder, filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Send the file
      return res.sendFile(filePath);
    }

    // File not found
    return res.status(404).send('File not found');
  }
}
