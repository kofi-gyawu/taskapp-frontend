import { JwtPayload } from "jwt-decode";
export class customPayload implements JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string[] | string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    "cognito:groups"?:string
}