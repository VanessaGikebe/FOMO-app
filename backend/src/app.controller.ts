import {Controller, Get} from '@nestjs/common';

@Controller('test')
export class testController {
    @Get()
    getTest(): string {
        return 'Test endpoint is working!';
    }  
}