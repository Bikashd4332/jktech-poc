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
      redis: {
        host: "localhost",
        password: "",
        port: 6379,
      },
      database: {
        dbName: "appDB",
        host: "localhost",
        password: "topsecret",
        port: 5432,
        user: "user",
      },
      appEnv: "dev",
      jwt: {
        expiry: "2h",
        secret: "secret",
      },
      upload: {
        path: "uploads",
        maxFileSize: 1048576,
      },
      port: 3000,
    });
  });
});
