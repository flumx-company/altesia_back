import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RedisHealthIndicator } from '@liaoliaots/nestjs-redis/health';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@ApiTags('Check services health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    @InjectRedis() private readonly defaultRedisClient: Redis,
  ) {}

  @Get('database')
  @ApiOperation({ summary: 'Check database health' })
  @HealthCheck()
  databaseHealthCheck() {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
    ]);
  }

  @Get('redis')
  @ApiOperation({ summary: 'Check redis health' })
  @HealthCheck()
  redisHealthCheck() {
    return this.health.check([
      async () =>
        this.redis.checkHealth('default-redis-client', {
          client: this.defaultRedisClient,
        }),
    ]);
  }
}
