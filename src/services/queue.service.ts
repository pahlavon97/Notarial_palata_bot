import { Queue, Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { Logger } from '../core/logger/logger';

export interface LegalTaskJobData {
  jobType: 'LOG_SEARCH' | 'REFRESH_CACHE' | 'ANALYTICS';
  payload: Record<string, unknown>;
  timestamp: string;
}

export class QueueService {
  private queue: Queue<LegalTaskJobData> | null = null;
  private worker: Worker<LegalTaskJobData> | null = null;
  private logger = new Logger('QueueService');
  private inMemoryTasks: LegalTaskJobData[] = [];

  constructor() {
    if (env.REDIS_URL && process.env.NODE_ENV !== 'test') {
      try {
        const connection = { url: env.REDIS_URL };
        this.queue = new Queue<LegalTaskJobData>('notary_background_jobs', { connection });

        this.worker = new Worker<LegalTaskJobData>(
          'notary_background_jobs',
          async (job: Job<LegalTaskJobData>) => {
            await this.processJob(job.data);
          },
          { connection, concurrency: 5 }
        );

        this.worker.on('failed', (job, err) => {
          this.logger.error(`Job ${job?.id} failed`, err);
        });

        this.logger.info('BullMQ Queue and Worker initialized successfully with Redis');
      } catch (err) {
        this.logger.warn('Failed to initialize BullMQ, using in-memory queue fallback', { error: String(err) });
      }
    } else {
      this.logger.info('Running in standalone/test mode: in-memory queue enabled');
    }
  }

  public async addTask(task: LegalTaskJobData): Promise<void> {
    if (this.queue) {
      try {
        await this.queue.add(task.jobType, task, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: 100,
          removeOnFail: 200,
        });
        return;
      } catch (err) {
        this.logger.warn('Error adding job to BullMQ, falling back to in-memory', { error: String(err) });
      }
    }

    // In-memory async processing
    this.inMemoryTasks.push(task);
    setImmediate(async () => {
      await this.processJob(task);
    });
  }

  private async processJob(data: LegalTaskJobData): Promise<void> {
    this.logger.debug(`Processing background task: ${data.jobType}`, { payload: data.payload });
    // Execute job logic (metrics, audit, cache sync)
  }

  public async close(): Promise<void> {
    if (this.worker) await this.worker.close();
    if (this.queue) await this.queue.close();
  }
}

export const queueService = new QueueService();
