import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
    @IsString({ message: 'Tên người dùng phải là chuỗi.' })
    @IsNotEmpty({ message: 'Tên người dùng không được để trống.' })
    @Length(3, 50, { message: 'Tên người dùng phải có độ dài từ 3 đến 50 ký tự.' })
    username: string;

    @IsEmail({}, { message: 'Email không hợp lệ.' })
    email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
    @Length(3, 50, { message: 'Mật khẩu phải có độ dài từ 3 đến 50 ký tự.' }) // Cập nhật điều kiện mật khẩu
    password: string;
}
