import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from '@libs/common';
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class UserRepository extends GenericRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.model.findOne({ email }).exec();
  }
}
