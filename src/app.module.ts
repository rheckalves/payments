import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from 'nestjs-s3';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as ormconfig from '../ormconfig';
import { Invoice } from './domain/entities/invoice.entity';
import { StarkbankModule } from './starkbank/startbank.module';
import { UploadModule } from './upload/upload.module';
import { KafkaModule } from './kafka/kafka.module';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { LogLevel } from '@sentry/types';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SentryModule.forRoot({
      debug: true,
      dsn: process.env.SENTRY_DSN,
      logLevel: LogLevel.Debug,
      environment: 'development',
      tracesSampleRate: 1.0,
    }),
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Invoice]),
    StarkbankModule.register({
      environment: process.env.STARKBANK_ENV,
      id: process.env.STARKBANK_ID,
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    /*
    S3Module.forRoot({
      config: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
      },
    }),
    KafkaModule.forRoot({
      brokers: process.env.CLOUDKARAFKA_BROKERS.split(','),
      clientId: 'prodops-payments',
      ssl: true,
      sasl: {
        mechanism: 'scram-sha-256', // scram-sha-256 or scram-sha-512
        username: process.env.CLOUDKARAFKA_USERNAME,
        password: process.env.CLOUDKARAFKA_PASSWORD,
      },
    }),

    UploadModule,
    */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
