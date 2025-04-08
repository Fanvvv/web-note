import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'node:fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 上传文件函数
   * 使用FilesInterceptor拦截器处理上传的文件，允许一次最多上传20个文件，上传目录为'uploads'
   * @param files 上传的文件数组，由拦截器解析并注入
   * @param body 请求体，可能包含除文件外的其他上传数据
   */
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads',
    }),
  )
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { name: string },
  ) {
    console.log('body', body);
    console.log('files', files);

    // 从请求体的name中提取文件名前缀，用于后续的文件处理
    const arr = body.name.match(/(.+)-\d+$/);
    // 打印匹配结果，用于调试
    console.log(arr, 'arr');
    // 根据匹配结果提取文件名前缀，如果没有匹配到则使用原始name
    const fileName = arr ? arr[1] : body.name;
    // 拼接出分块目录路径
    const chunkDir = 'uploads/chunks_' + fileName;

    // 检查分块目录是否存在，如果不存在则创建
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    // 将上传的文件复制到分块目录中，并使用原始name作为文件名
    fs.cpSync(files[0].path, chunkDir + '/' + body.name);
    // 删除上传的临时文件
    fs.rmSync(files[0].path);
  }

  /**
   * 合并分块文件的函数
   * 该函数用于将上传的分块文件合并为一个完整的文件
   *
   * @param name 文件名，通过查询参数传递，用于定位分块文件所在的目录
   */
  @Get('merge')
  merge(@Query('name') name: string) {
    // 拼接出分块文件所在的目录路径
    const chunkDir = 'uploads/chunks_' + name;

    // 读取分块目录下的所有文件名
    const files = fs.readdirSync(chunkDir);

    let count = 0;
    let startPos = 0; // 初始化写入起始位置
    files.map((file) => {
      // 拼接每个分块文件的完整路径
      const filePath = chunkDir + '/' + file;
      // 创建可读流以读取分块文件内容
      const stream = fs.createReadStream(filePath);
      // 将可读流的内容写入到最终合并的文件中，并指定写入的起始位置
      stream
        .pipe(
          fs.createWriteStream('uploads/' + name, {
            start: startPos,
          }),
        )
        .on('finish', () => {
          count++;
          if (count === files.length) {
            fs.rm(
              chunkDir,
              {
                recursive: true,
              },
              () => {},
            );
          }
        });

      // 更新写入起始位置，累加上当前分块文件的大小
      startPos += fs.statSync(filePath).size;
    });
  }
}
