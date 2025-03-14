import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DocumentService } from "./document.service";
import { DocumentEntity } from "./entities/document.entity";
import * as fs from "fs/promises";
import * as nodeFs from "fs";
import { NotFoundException } from "@nestjs/common";

describe("DocumentService", () => {
  let service: DocumentService;
  let config: DeepMocked<ConfigService>;
  let repo: DeepMocked<Repository<DocumentEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: ConfigService, useValue: createMock<ConfigService>() },
        {
          provide: getRepositoryToken(DocumentEntity),
          useValue: createMock(),
        },
      ],
    }).compile();

    config = module.get(ConfigService);
    service = module.get<DocumentService>(DocumentService);
    repo = module.get(getRepositoryToken(DocumentEntity));

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a document", async () => {
    repo.save.mockResolvedValue({} as any);

    await service.create({
      originalname: "originalname",
      filename: "filename",
      mimetype: "mimetype",
    } as any);

    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  it("it should delete the file if the document creation fails", async () => {
    const rmSpy = jest.spyOn(fs, "rm");
    repo.save.mockRejectedValue(new Error("error"));

    const document = {
      originalname: "originalname",
      filename: "filename",
      mimetype: "mimetype",
      path: "path",
    };

    await expect(service.create(document as any)).rejects.toThrow();

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(rmSpy).toHaveBeenCalledWith(document.path);
  });

  it("should get a document by id", async () => {
    repo.findOne.mockResolvedValue({} as any);

    await service.getDocumentById(1);

    expect(repo.findOne).toHaveBeenCalledTimes(1);
  });

  it("should get a document by id", async () => {
    repo.findOne.mockResolvedValue({} as any);

    await service.getDocumentById(1);

    expect(repo.findOne).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the document is not found", async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.getDocumentById(1)).rejects.toThrow(NotFoundException);
  });

  it("should retrieve a document by id", async () => {
    const createReadStreamSpy = jest
      .spyOn(nodeFs, "createReadStream")
      .mockReturnValue({} as any);
    config.get.mockReturnValue("upload.path");
    const document = {
      name: "name",
    } as any;

    repo.findOne.mockResolvedValue(document);

    const readStream = await service.retrieveDocument(1);

    expect(repo.findOne).toHaveBeenCalledTimes(1);
    expect(createReadStreamSpy).toHaveBeenCalledTimes(1);
    expect(readStream).toBeDefined();
  });

  it("should update a document", async () => {
    const rmSpy = jest.spyOn(fs, "rm").mockResolvedValue();
    config.get.mockReturnValue("upload.path");
    const document = {
      name: "name",
      originalName: "originalName",
      mimeType: "mimeType",
    } as any;

    repo.findOne.mockResolvedValue(document);
    repo.save.mockResolvedValue({} as any);

    await service.updateDocument(1, {
      originalname: "originalname",
      filename: "filename",
      mimetype: "mimetype",
    } as any);

    expect(repo.findOne).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(rmSpy).toHaveBeenCalledTimes(1);
  });
});
