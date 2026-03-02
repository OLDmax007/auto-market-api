import { NextFunction, Request, Response } from "express";

import { HttpStatusEnum } from "../../common/enums/http-status.enum";
import { TokenPayloadType } from "../auth/token.type";
import { PlatformRoleType } from "../user/types/platform-role.type";
import { SubscriptionPlanEnum } from "./enums/subscription-plan.enum";
import { SubscriptionPresenter } from "./subscription.presenter";
import { subscriptionService } from "./subscription.service";

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
            const dto = req.body as { newPlan: SubscriptionPlanEnum };

            const data = await subscriptionService.setSubscriptionPlanByUserId(
                userId,
                initiatorId,
                role,
                dto,
            );
            const presented = SubscriptionPresenter.toAdminResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
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
            const presented = SubscriptionPresenter.toAdminResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
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
            const presented = SubscriptionPresenter.toAdminResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }

    public async upgradeToPremium(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { userId } = res.locals.tokenPayload as TokenPayloadType;
            const data = await subscriptionService.upgradeToPremium(userId);
            const presented = SubscriptionPresenter.toResponse(data);
            res.status(HttpStatusEnum.OK).json(presented);
        } catch (e: unknown) {
            next(e);
        }
    }
}

export const subscriptionController = new SubscriptionController();
