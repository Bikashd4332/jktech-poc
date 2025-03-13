import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { firstValueFrom } from "rxjs";
import { DocumentEntity } from "src/document/entities/document.entity";
import { INGESTION_SERVICE } from "src/global/tokens/ingestion.token";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { CreateIngestionDto } from "./dto/create-ingestion.dto";
import { IngestionResponse } from "./interface/ingestion-response.interface";
import { ClsService } from "nestjs-cls";

@Injectable()
export class IngestionService {
  constructor(
    @Inject(INGESTION_SERVICE)
    private readonly ingestionClient: ClientProxy,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly clsService: ClsService,
  ) {}

  addIngestion(createIngestionDto: CreateIngestionDto) {
    return firstValueFrom(
      this.ingestionClient.send<
        IngestionResponse,
        CreateIngestionDto & { userId: number }
      >("add.ingestion", {
        userId: this.clsService.get<number>("authUser.id"),
        ...createIngestionDto,
      }),
    );
  }

  async findIngestionById(id: number) {
    const response = await firstValueFrom(
      this.ingestionClient.send<IngestionResponse, number>("get.ingestion", id),
    );

    const [document, user] = await Promise.all([
      this.documentRepository.findOne({
        where: { id: response.ingestion.documentId },
      }),
      this.userRepository.findOne({
        where: { id: response.ingestion.userId },
      }),
    ]);

    return {
      id: response.ingestion.id,
      user: {
        id: user?.id,
        name: user?.firstName,
        email: user?.email,
      },
      document: {
        id: document?.id,
        name: document?.originalName,
      },
      status: response.ingestion.status,
    };
  }
}
