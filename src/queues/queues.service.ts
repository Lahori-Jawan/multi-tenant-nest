import { Job, Queue } from 'bull';
import { InjectQueue, OnQueueActive, OnQueueError } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QUEUE } from '@src/app/common/constants/queue';

@Injectable()
export class QueuesService {
  constructor(@InjectQueue(QUEUE.Tenant.Name) private tenantQueue: Queue) {}

  async createTenant() {
    const job = await this.tenantQueue.add(QUEUE.Tenant.Job.New_Tenant, {
      name: 'nasir',
      username: 'nk',
      password: '@Password1',
    });
    console.log(
      `created job in queue ${QUEUE.Tenant.Name} with process ${QUEUE.Tenant.Job.New_Tenant} & job id is ${job.id}`,
    );
    return;
  }

  @OnQueueActive()
  onQueueActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueError()
  onQueueError(error: Error) {
    console.log(`Queueu '${QUEUE.Tenant.Name}' error ${error}`);
  }
}
