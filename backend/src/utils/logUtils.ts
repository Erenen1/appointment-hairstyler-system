import fs from 'fs';
import path from 'path';
import logger from '../config/logger';
export class LogManager {
  static async cleanOldLogs(daysToKeep: number = 30): Promise<void> {
    try {
      const logDir = path.join(process.cwd(), 'logs');
      const files = await fs.promises.readdir(logDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      for (const file of files) {
        const filePath = path.join(logDir, file);
        const stats = await fs.promises.stat(filePath);
        if (stats.mtime < cutoffDate) {
          await fs.promises.unlink(filePath);
          logger.info('Old log file deleted', { file, deletedAt: new Date() });
        }
      }
    } catch (error) {
      logger.error('Error cleaning old logs', { error });
    }
  }
  static async getLogDirectorySize(): Promise<number> {
    try {
      const logDir = path.join(process.cwd(), 'logs');
      const files = await fs.promises.readdir(logDir);
      let totalSize = 0;
      for (const file of files) {
        const filePath = path.join(logDir, file);
        const stats = await fs.promises.stat(filePath);
        totalSize += stats.size;
      }
      return totalSize;
    } catch (error) {
      logger.error('Error calculating log directory size', { error });
      return 0;
    }
  }
  static async ensureLogDirectory(): Promise<void> {
    try {
      const logDir = path.join(process.cwd(), 'logs');
      await fs.promises.mkdir(logDir, { recursive: true });
    } catch (error) {
      console.error('Error creating log directory:', error);
    }
  }
}
export class PerformanceTracker {
  private startTime: number;
  private label: string;
  constructor(label: string) {
    this.label = label;
    this.startTime = Date.now();
  }
  end(meta?: any): number {
    const duration = Date.now() - this.startTime;
    logger.info('Performance Measurement', {
      type: 'performance',
      label: this.label,
      duration: `${duration}ms`,
      ...meta
    });
    return duration;
  }
  static track<T>(label: string, operation: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const tracker = new PerformanceTracker(label);
      try {
        const result = await operation();
        tracker.end({ success: true });
        resolve(result);
      } catch (error: unknown) {
        tracker.end({ success: false, error: error instanceof Error ? error.message : String(error) });
        reject(error); 
      }
    });
  }
} 