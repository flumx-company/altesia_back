import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { UserEntity } from '../../shared/models/user.entity';
import { EventEntity } from '../../shared/models/event.entity';
import { EventRepository } from '../../shared/repositories/event.repository';
import { BulkDestroyDto } from '../../common/dto/bulk-destroy.dto';
import { UserEventEntity } from '../../shared/models/user-event.entity';
import { IPaginationOptions } from '../../common/interfaces/pagination-options.interface';
import { EventSearch } from '../../shared/query-filters/events-search/event.search';

import { CreateEventDto } from './dto/create-event.dto';
import { AttachEventToUser } from './dto/attach-event-to-user';
import { ChangeEventStatusDto } from './dto/change-event-status.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAllEventsForAdmin(
    query: Record<string, string>,
    options: IPaginationOptions,
  ): Promise<Pagination<EventEntity>> {
    const queryBuilder: SelectQueryBuilder<EventEntity> =
      await new EventSearch().apply(this.eventRepository, query);

    return this.eventRepository.paginateQueryBuilder(queryBuilder, options);
  }

  async fetchAllEvents(
    user: UserEntity,
    fetchMine: string,
    options: IPaginationOptions,
  ): Promise<Pagination<EventEntity>> {
    let queryBuilder: SelectQueryBuilder<EventEntity>;
    if (fetchMine) {
      queryBuilder = this.eventRepository
        .createQueryBuilder('events')
        .loadRelationCountAndMap(
          'events.countOfAppliedUsers',
          'events.userEvents',
          'appliedUsers',
          (qb) => {
            return qb.where('appliedUsers.is_interesting = :is_interesting', {
              is_interesting: true,
            });
          },
        )
        .leftJoinAndSelect('events.attachmentFiles', 'attachmentFiles')
        .fetchPublished()
        .fetchMineInterestingRecords(user.id);
    } else {
      queryBuilder = this.eventRepository
        .createQueryBuilder('events')
        .leftJoinAndSelect('events.attachmentFiles', 'attachmentFiles')
        .fetchPublished()
        .fetchNonInterestingUserRecordsWithAscendingInterestingField(user.id);
    }

    return this.eventRepository.paginateQueryBuilder(queryBuilder, options);
  }

  async getById(eventId: number) {
    return await this.eventRepository.findOneOrFail(
      { id: eventId },
      {
        relations: ['users', 'attachmentFiles'],
      },
    );
  }

  async createEvent(
    createEventDto: CreateEventDto,
    attachments: Array<Express.Multer.File>,
  ): Promise<Record<string, number>> {
    const event = await this.eventRepository.saveAndReturn(createEventDto, {}, [
      'attachmentFiles',
    ]);

    await this.eventRepository.updateEntityAttachments(event, attachments);

    return {
      id: event.id,
    };
  }

  async updateEvent(
    id: number,
    updateEventDto: UpdateEventDto,
    attachments: Array<Express.Multer.File>,
  ): Promise<Record<string, number>> {
    const event = await this.eventRepository.updateByIdAndReturn(
      id,
      updateEventDto,
      ['attachmentFiles'],
    );

    await this.eventRepository.updateEntityAttachments(event, attachments);

    return {
      id: event.id,
    };
  }

  async changeEventStatus(
    id: number,
    changeEventStatusDto: ChangeEventStatusDto,
  ) {
    const opportunity = await this.eventRepository.updateByIdAndReturn(
      id,
      changeEventStatusDto,
    );

    return {
      id: opportunity.id,
    };
  }

  async participateEvent(
    id: number,
    attachEventToUser: AttachEventToUser,
    user: UserEntity,
  ) {
    const event = await this.eventRepository.findOneOrFail(id, {
      relations: ['userEvents', 'userEvents.user'],
    });

    if (event.userEvents.length >= event.maxAttendanceNumber) {
      throw new BadRequestException('You has reached event count limit');
    }

    const userHasInterestingEvent = event.userEvents.find(
      (userEvent) =>
        userEvent.event_id === event.id &&
        userEvent.user.id === user.id &&
        userEvent.is_interesting === attachEventToUser.is_interesting,
    );

    if (userHasInterestingEvent) {
      throw new BadRequestException({
        message: {
          error: `You already have this event. user events table id - ${userHasInterestingEvent.id}`,
          is_interesting: userHasInterestingEvent.is_interesting,
        },
      });
    }

    const theSameUserEvent = event.userEvents.find(
      (userEvent) =>
        userEvent.event_id === event.id && userEvent.user.id === user.id,
    );

    if (theSameUserEvent) {
      event.userEvents = event.userEvents.map((userEvent) => {
        if (userEvent.event_id === event.id) {
          userEvent.is_interesting = attachEventToUser.is_interesting;
        }
        return userEvent;
      });
    } else {
      event.userEvents.push({
        event_id: event.id,
        user_id: user.id,
        event,
        user,
        is_interesting: attachEventToUser.is_interesting,
      });
    }

    await this.eventRepository.save(event);

    return {
      id,
    };
  }

  async getUserEvents(id: number): Promise<UserEventEntity[]> {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id,
      },
      relations: [
        'userEvents',
        'userEvents.event',
        'userEvents.event.attachmentFiles',
      ],
    });

    if (!user.userEvents.length) {
      throw new NotFoundException(`No events found for user with id - ${id}`);
    }

    return user.userEvents;
  }

  async cancelParticipate(id: number, userId: number) {
    const event = await this.eventRepository.findOneOrFail(id);

    const user = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
      relations: ['userEvents'],
    });

    const userHasEvent = user.userEvents.find(
      (userEvent) => userEvent.event_id === event.id,
    );

    if (!userHasEvent) {
      throw new BadRequestException(`You don't have this event`);
    }

    user.userEvents = user.userEvents.filter(
      (userEvent) => userEvent.event_id !== event.id,
    );

    await this.userRepository.save(user);

    return {
      id,
    };
  }

  async deleteEvent(bulkDestroyDto: BulkDestroyDto): Promise<null> {
    await this.eventRepository.bulkDestroy(bulkDestroyDto, ['attachmentFiles']);
    return null;
  }
}
