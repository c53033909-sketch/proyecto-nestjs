import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser: User = {
      id: this.nextId++,
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    };

    this.users.push(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  findAll(): Omit<User, 'password'>[] {
    return this.users.map(({ password, ...safeUser }) => safeUser);
  }

  findOne(id: number): Omit<User, 'password'> {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase(),
    );
  }
}