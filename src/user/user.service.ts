import { Injectable,  HttpException, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

     // Phương thức đăng ký người dùng mới
     async registerUser(RegisterUserDto: RegisterUserDto): Promise<{ message: string }> {
        const { username, email, password } = RegisterUserDto;

        // Kiểm tra xem tên đăng nhập đã tồn tại
        const existingUsername = await this.userRepository.findOne({
            where: { username },
        });

        if (existingUsername) {
            throw new HttpException(
                'Tên người dùng đã tồn tại.',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Kiểm tra xem email đã tồn tại
        const existingEmail = await this.userRepository.findOne({
            where: { email },
        });

        if (existingEmail) {
            throw new HttpException(
                'Email đã đã tồn tại.',
                HttpStatus.BAD_REQUEST,
            );
        }

        // Băm mật khẩu
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng mới
        const newUser = this.userRepository.create({
            username,
            email,
            password: hashedPassword,
        });

        try {
            // Lưu người dùng vào cơ sở dữ liệu
            await this.userRepository.save(newUser);
            return { message: 'Đăng ký thành công!' };
        } catch (error) {
            throw new InternalServerErrorException('Đã xảy ra lỗi trong quá trình đăng ký');
        }
    }

    async login(key: string, password: string): Promise<string> {
        // Tìm người dùng theo key là username hoặc email
        const user = await this.userRepository.findOne({
            where: [{ username: key }, { email: key }],
        });

        if (!user) {
            throw new HttpException('Tài khoản không tồn tại', HttpStatus.NOT_FOUND);
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Mật khẩu sai', HttpStatus.UNAUTHORIZED);
        }

        // Trả về thông báo thành công
        return 'Đăng nhập thành công!';
    }


    // Các phương thức get dùng để test kết nối database và api.
    // Thêm phương thức lấy tất cả người dùng
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    // Cập nhật phương thức lấy người dùng theo ID
    async findById(id: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });

            // Kiểm tra nếu không tìm thấy người dùng
            if (!user) {
                throw new NotFoundException('Không tìm thấy người dùng với ID đã cung cấp');
            }

            return user;
        } catch (error) {
            throw new InternalServerErrorException('Đã xảy ra lỗi khi tìm kiếm người dùng');
        }
    }

}
