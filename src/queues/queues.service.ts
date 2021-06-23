import { Job, Queue } from 'bull';
import { InjectQueue, OnQueueActive, OnQueueError } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { QUEUE } from '@src/app/common/constants/queue';

@Injectable()
export class QueuesService {
  logger = new Logger(QueuesService.name);

  constructor(@InjectQueue(QUEUE.Tenant.Name) private tenantQueue: Queue) {}

  async createTenant(tenant) {
    this.logger.log(`Creating job in queue ${QUEUE.Tenant.Name}`);
    const job = await this.tenantQueue.add(QUEUE.Tenant.Job.New_Tenant, {
      ...tenant,
    });
    this.logger.log(
      `created job "${QUEUE.Tenant.Job.New_Tenant}" in queue "${QUEUE.Tenant.Name}" with job id ${job.id}`,
    );
    return;
  }

  @OnQueueActive()
  onQueueActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueError()
  onQueueError(error: Error) {
    this.logger.log(`Queueu '${QUEUE.Tenant.Name}' error ${error}`);
  }
}
