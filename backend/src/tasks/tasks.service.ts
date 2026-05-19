import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status || 'pending',
        dueDate: new Date(createTaskDto.dueDate),
        userId: userId,
      },
    });
  }

  async findAll(userId: string, status?: string, page = 1, limit = 10) {
    const whereClause: Prisma.TaskWhereInput = {
      userId,
    };

    if (status && ['pending', 'done'].includes(status)) {
      whereClause.status = status;
    }

    const skip = (page - 1) * limit;

    const [tasks, totalItems] = await Promise.all([
      this.prisma.task.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: tasks,
      meta: {
        totalItems,
        itemCount: tasks.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) {
      throw new NotFoundException(
        `Tarea con ID ${id} no encontrada o no tienes permisos`,
      );
    }
    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        dueDate: updateTaskDto.dueDate
          ? new Date(updateTaskDto.dueDate)
          : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.task.delete({
      where: { id },
    });
    return { message: 'Tarea eliminada con éxito' };
  }
}
