import { exec, spawn } from "child_process";
import { rmSync } from "fs";

export const migrationAllOfDatabase = async ({ from, to }) => {
  // init tunel
  const tunnel = spawn("scalingo", [
    "--region",
    "osc-secnum-fr1",
    "--app",
    "datas-a-just",
    "db-tunnel",
    "DATABASE_URL",
  ]);
  tunnel.stdout.on("data", (data) => {
    const output = data.toString();
    console.log("[Tunnel]", output);
  });
  tunnel.stderr.on("data", (data) => {
    console.error("[Tunnel error]", data.toString());
  });
  tunnel.on("exit", (code) => {
    console.log(`Tunnel fermé avec le code ${code}`);
  });

  await delay(2000);

  tunnel.stderr.on("data", (data) => {
    console.error("[Tunnel error]", data.toString());
  });

  tunnel.on("exit", (code) => {
    console.log(`Tunnel fermé avec le code ${code}`);
  });

  await commandLine(
    `PGPASSWORD='${from.password}' pg_dump -no-owner --no-privileges --schema=public -U ${from.user} -h ${from.url} -p ${from.port} -Fc ${from.db} -t datasv1 > datasv1_dump_source.dump`
  );
  await commandLine(
    `PGPASSWORD='${from.password}' pg_dump -no-owner --no-privileges --schema=public -U ${from.user} -h ${from.url} -p ${from.port} -Fc ${from.db} -t dictionaries > dictionaries_dump_source.dump`
  );
  await commandLine(
    `PGPASSWORD='${from.password}' pg_dump -no-owner --no-privileges --schema=public -U ${from.user} -h ${from.url} -p ${from.port} -Fc ${from.db} -t datasindex > datasindex_dump_source.dump`
  );
  await commandLine(
    `PGPASSWORD='${to.password}' psql -U ${to.user} -h ${to.url} -p ${to.port} -d ${to.db} -c "TRUNCATE TABLE datasv1 RESTART IDENTITY CASCADE;"`
  );
  await commandLine(
    `PGPASSWORD='${to.password}' pg_restore --no-owner --no-privileges --data-only -U ${to.user} -h ${to.url} -p ${to.port} -d ${to.db} datasv1_dump_source.dump`
  );
  await commandLine(
    `PGPASSWORD='${to.password}' psql -U ${to.user} -h ${to.url} -p ${to.port} -d ${to.db} -c "TRUNCATE TABLE dictionaries RESTART IDENTITY CASCADE;"`
  );
  await commandLine(
    `PGPASSWORD='${to.password}' pg_restore --no-owner --no-privileges --data-only -U ${to.user} -h ${to.url} -p ${to.port} -d ${to.db} dictionaries_dump_source.dump`
  );
  await commandLine(
    `PGPASSWORD='${to.password}' psql -U ${to.user} -h ${to.url} -p ${to.port} -d ${to.db} -c "TRUNCATE TABLE datasindex RESTART IDENTITY CASCADE;"`
  );
  await commandLine(
    `PGPASSWORD='${to.password}' pg_restore --no-owner --no-privileges --data-only -U ${to.user} -h ${to.url} -p ${to.port} -d ${to.db} datasindex_dump_source.dump`
  );
  rmSync("datasv1_dump_source.dump", { force: true });
  rmSync("dictionaries_dump_source.dump", { force: true });
  rmSync("datasindex_dump_source.dump", { force: true });

  tunnel.kill("SIGTERM");
  // kill tunel
  console.log("Migration done");
};

export const commandLine = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(`exec error: ${err}`);
        reject(err);
        // node couldn't execute the command
        return;
      }

      resolve(true);
    });
  });
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
