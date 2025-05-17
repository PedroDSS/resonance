import {
    Controller,
    Patch,
    UseInterceptors,
    UploadedFile,
    Body,
    UseGuards,
    Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: './uploads/avatars',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async updateProfile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UpdateProfileDto,
        @Req() req: { user: JwtPayload },
    ) {
        const userId = req.user.sub;
        const updatedData: any = {
            ...body,
        };

        if (file) {
            updatedData.avatar = file.filename;
        }

        const updatedUser = await this.userService.updateProfile(userId, updatedData);
        return updatedUser;
    }
}
