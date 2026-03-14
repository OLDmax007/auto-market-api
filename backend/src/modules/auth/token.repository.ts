import { Token } from "./token.model";
import { TokenPairType, TokenType } from "./token.type";

class TokenRepository {
    public getManyByUserId(userId: string): Promise<TokenType[]> {
        return Token.find({ userId }).sort({ createdAt: 1 });
    }

    public getOneByParams(params: Partial<TokenType>): Promise<TokenType> {
        return Token.findOne(params);
    }

    public create(dto: TokenPairType & { userId: string }): Promise<TokenType> {
        return Token.create(dto);
    }
    public async deleteAllByUserId(userId: string): Promise<void> {
        await Token.deleteMany({ userId });
    }

    public async deleteOneByParams(
        params: Partial<TokenType>,
    ): Promise<number> {
        const result = await Token.deleteOne(params);
        return result.deletedCount;
    }

    public deleteBeforeDate = async (date: Date): Promise<number> => {
        const result = await Token.deleteMany({ createdAt: { $lt: date } });
        return result.deletedCount;
    };
}

export const tokenRepository = new TokenRepository();
