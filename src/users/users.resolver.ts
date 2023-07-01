import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.createOne(input);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.getMany();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.getOne(id);
  }

  @Mutation(() => String)
  runMigrations() {
    return this.usersService.runPrismaMigrations();
  }
}
