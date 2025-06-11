import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, QueryOptions } from 'mongoose';

@Injectable()
export class GenericRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return (await entity.save()).toObject();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findByFilters(filters: FilterQuery<T>, options?: QueryOptions<T>): Promise<T[]> {
    return await this.model.find(filters, null, options).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true })
      .exec();
  }

  async restore(id: string): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, { deletedAt: null, updatedAt: new Date() }, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<T | null> {
    return await this.model
      .findByIdAndUpdate(id, { deletedAt: new Date(), updatedAt: new Date() }, { new: true })
      .exec();
  }

  async hardDelete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
