import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        try {

            const result = await this.userService.registerUser(registerUserDto); // Gọi register từ service
            return result; // Trả về thông báo thành công nếu không có lỗi
        } catch (error) {
            if (error instanceof HttpException) {
                throw error; // Trả về lỗi với mã và thông báo đã được định nghĩa
            }
            // Xử lý các lỗi khác không xác định
            throw new HttpException(
                'Lỗi server không xác định.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('login')
    async login(@Body() loginData: { key: string; password: string }) {
        const { key, password } = loginData;
        try {
            const result = await this.userService.login(key, password); // Gọi login từ service
            return { message: result };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Các phương thức get để test kết nối.

    // Endpoint để lấy tất cả người dùng
    @Get()
    async findAll(): Promise<User[]> {
        return await this.userService.findAll();
    }

    // Endpoint để lấy người dùng theo ID
    @Get(':id')
    async findById(@Param('id') id: string): Promise<User> {
        return await this.userService.findById(+id);
    }   
}
