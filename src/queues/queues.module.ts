import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from '@src/app/common/constants/queue';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE.Tenant.Name,
      // redis: 'redis://127.0.0.1:6379',
    }),
  ],
  providers: [QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
