import { Client } from '@upstash/qstash';

export const qstash = new Client({
    token: process.env.QSTASH_TOKEN!,
});

// Configuration constants
export const QUEUE_CONFIG = {
    maxRetries: 3,
    retryDelaySeconds: 60, // 1 minute between retries
    checkStatusDelaySeconds: 30, // Check container status every 30 seconds
};