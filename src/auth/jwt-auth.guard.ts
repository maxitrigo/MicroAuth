import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization']

        if(!authHeader) {
            throw new UnauthorizedException('Authorization header is required.');
        }
        
        const [Bearer, token] = authHeader.split(' ')
        

        if(Bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid token');
        }

        try{
            const decoded = this.jwtService.verify(token);
            decoded.iat = new Date(decoded.iat * 1000).toISOString();// Convertir el timestamp a una fecha
            decoded.exp = new Date(decoded.exp * 1000).toISOString();// Convertir el timestamp a una fecha
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}