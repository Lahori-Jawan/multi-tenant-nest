import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tenant1623234315480 implements MigrationInterface {
  name = 'Tenant1623234315480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tenants" ("id" int NOT NULL IDENTITY(1,1), "created_at" datetime NOT NULL CONSTRAINT "DF_1dba291f7611c0f2388055c40b4" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_a61a56d6a40cfbc5564968f5275" DEFAULT getdate(), "tenant_name" nvarchar(255) NOT NULL, "username" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "is_active" bit NOT NULL CONSTRAINT "DF_1ebff6b4e641024e7e656b26736" DEFAULT 1, CONSTRAINT "UQ_5cbe54e309efc7de9cf098223c8" UNIQUE ("tenant_name"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "tenant_name" ON "tenants" ("tenant_name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "tenant_owner" ON "tenants" ("username") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "tenant_owner" ON "tenants"`);
    await queryRunner.query(
      `DROP INDEX "IDX_5cbe54e309efc7de9cf098223c" ON "tenants"`,
    );
    await queryRunner.query(`DROP TABLE "tenants"`);
  }
}
