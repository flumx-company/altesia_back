import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { AppRoutes } from '../../app.routes';
import { ApiPaginationParamsQueryDecorator } from '../../shared/decorators/swagger/api-pagination-params-query.decorator';
import { ApiCommonResponseDecorator } from '../../shared/decorators/swagger/api-common-response.decorator';
import { AuthAndVerified } from '../../shared/decorators/auth-and-verified.decorator';
import { RoleEnum } from '../role/enums/role.enum';
import { FullRequestUrlDecorator } from '../../shared/decorators/full-request-url.decorator';
import { OpportunityAlertReplyService } from '../opportunity-alert-reply/opportunity-alert-reply.service';
import { OpportunityAlertReplyEntity } from '../../shared/models/opportunity-alert-reply.entity';

import { OpportunityAlertService } from './opportunity-alert.service';

@ApiTags('Opportunity Alerts')
@Controller()
export class OpportunityAlertController {
  constructor(
    private readonly opportunityAlertService: OpportunityAlertService,
    private readonly opportunityAlertReplyService: OpportunityAlertReplyService,
  ) {}

  @Get(`${AppRoutes.OPPORTUNITY_ALERT_URL.CLIENT}`)
  @ApiOperation({ summary: 'Fetch all opportunity alerts' })
  @ApiPaginationParamsQueryDecorator()
  @ApiCommonResponseDecorator({
    description: 'Opportunity alerts successfully fetched',
  })
  @ApiCommonResponseDecorator({
    success: false,
    status: HttpStatus.NOT_FOUND,
    description: 'Entity not found',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  findOpportunityAlerts(
    @FullRequestUrlDecorator() fullRequestUrl: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ) {
    return this.opportunityAlertService.findOpportunityAlerts({
      page,
      limit,
      route: fullRequestUrl,
    });
  }

  @Get(`${AppRoutes.OPPORTUNITY_ALERT_URL.CLIENT}/:opportunityAlertId/replies`)
  @ApiOperation({
    summary: 'Fetch opportunity alert replies',
  })
  @AuthAndVerified(RoleEnum.USER, RoleEnum.ADMIN)
  fetchOpportunityAlertRepliesThatBelongToOpportunityAlert(
    @Param('opportunityAlertId', ParseIntPipe) opportunityAlertId: number,
  ): Promise<OpportunityAlertReplyEntity> {
    return this.opportunityAlertReplyService.fetchOpportunityAlertRepliesThatBelongToOpportunityAlert(
      opportunityAlertId,
    );
  }
}
