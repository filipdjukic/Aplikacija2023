import { JwtDataDto } from "src/dtos/auth/jtw.data.dto";

declare module 'express' {
    interface Request {
        token: JwtDataDto;
    }
}