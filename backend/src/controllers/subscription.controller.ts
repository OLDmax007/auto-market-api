import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../enums/http-status.enum";
import { PlanTypeEnum } from "../enums/plan-type.enum";
import { subscriptionService } from "../services/subscription.service";
import { PlatformRoleType } from "../types/permissions/platform-role.type";
import { TokenPayloadType } from "../types/token.type";

class SubscriptionController {
    public async setSubscriptionPlanByUserId(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = req.params as { userId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;
            const dto = req.body as { newPlan: PlanTypeEnum };

            const data = await subscriptionService.setSubscriptionPlanByUserId(
                userId,
                initiatorId,
                role,
                dto,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params as { userId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;

            const data = await subscriptionService.setStatusByUserId(
                userId,
                initiatorId,
                role,
                true,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async deactivate(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params as { userId: string };
            const { userId: initiatorId } = res.locals
                .tokenPayload as TokenPayloadType;
            const { role } = res.locals.rolePayload as PlatformRoleType;

            const data = await subscriptionService.setStatusByUserId(
                userId,
                initiatorId,
                role,
                false,
            );
            res.status(HttpStatusEnum.OK).json(data);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const subscriptionController = new SubscriptionController();
