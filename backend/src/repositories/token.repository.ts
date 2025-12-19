import { DeleteResult } from "mongoose";

import { Token } from "../models/token.model";
import { TokenPairType, TokenType } from "../types/token.type";

class TokenRepository {
    public getOneByParams(filter: Partial<TokenType>): Promise<TokenType> {
        return Token.findOne(filter);
    }

    public create(dto: TokenPairType & { userId: string }): Promise<TokenType> {
        return Token.create(dto);
    }
    public deleteAllByUserId(userId: string): Promise<DeleteResult> {
        return Token.deleteMany({ userId });
    }
}

export const tokenRepository = new TokenRepository();
