import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // header
  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: 'version',
  // });

  // media_type
  // app.enableVersioning({
  //   type: VersioningType.MEDIA_TYPE,
  //   key: 'v=',
  // });

  // uri
  // app.enableVersioning({
  //   type: VersioningType.URI,
  // });

  // custom
  app.enableVersioning({
    type: VersioningType.CUSTOM,
    extractor: (request: Request) => {
      if (request.headers['disable-custom']) {
        return '';
      }
      return request.url.includes('fan') ? '2' : '1';
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
