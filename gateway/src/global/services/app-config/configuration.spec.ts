import { readFileSync } from "fs";
import { join } from "path";
import { getConfig } from "./configuration";

describe("config helper", () => {
  it("should be defined", () => {
    expect(getConfig).toBeDefined();
  });

  it("should return configs", () => {
    const env = readFileSync(join(process.cwd(), "../.env.example"), "utf8")
      .split("\n")
      .reduce((vars: any, i) => {
        const [variable, value] = i.split("=");
        vars[variable] = value;
        return vars;
      }, {});

    process.env = Object.assign(process.env, env);

    expect(getConfig()).toStrictEqual({
      port: 3000,
      appEnv: "dev",
      jwt: {
        expiry: "2h",
        secret: "secret",
      },
      database: {
        dbName: "appDB",
        host: "localhost",
        password: "topsecret",
        port: 5432,
        user: "user",
      },
      redis: {
        host: "localhost",
        password: "",
        port: 6379,
      },
      upload: {
        path: "uploads",
        maxFileSize: 1048576,
      },
    });
  });

  it("should return default configs for certain values", () => {
    const parseIntSpy = jest.spyOn(globalThis, "parseInt").mockReturnValue(0);

    const config = getConfig();

    expect(parseIntSpy).toHaveBeenCalledTimes(4);
    expect(config.port).toEqual(0);
    expect(config.database.port).toEqual(0);
    expect(config.redis.port).toEqual(0);
    expect(config.upload.maxFileSize).toEqual(0);
    expect(config.jwt.expiry).toEqual("2h");
  });
});
