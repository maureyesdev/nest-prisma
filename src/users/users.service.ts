import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from '../prisma/prisma.service';
import { command } from 'execa';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOne(input: CreateUserInput) {
    const newUser = await this.prismaService.user.create({
      data: input,
    });
    return newUser;
  }

  async getMany() {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  async getOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  async runPrismaMigrations() {
    try {
      const { stdout } = await command(
        'node_modules/prisma/build/index.js migrate deploy',
        {
          preferLocal: true,
          stdin: 'inherit',
        },
      );
      if (stdout.includes('No pending migrations to apply')) {
        return 'No pending migrations to apply';
      }
      return 'Migrations applied successfully';
    } catch (error) {
      return 'Error running migrations: ' + error.message;
    }
  }
}
