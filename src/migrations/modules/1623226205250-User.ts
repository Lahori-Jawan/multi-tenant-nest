import {MigrationInterface, QueryRunner} from "typeorm";

export class User1623226205250 implements MigrationInterface {
    name = 'User1623226205250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" int NOT NULL IDENTITY(1,1), "created_at" datetime NOT NULL CONSTRAINT "DF_c9b5b525a96ddc2c5647d7f7fa5" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_6d596d799f9cb9dac6f7bf7c23c" DEFAULT getdate(), "unique_id" char(21) NOT NULL, "first_name" nvarchar(255) NOT NULL, "last_name" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "is_email_valid" bit NOT NULL CONSTRAINT "DF_c7e917aba19251256694fea35a0" DEFAULT 0, "is_phone_valid" bit NOT NULL CONSTRAINT "DF_c0b4c0bb0f23a0ca2ab9d4b15a7" DEFAULT 0, CONSTRAINT "UQ_a58931548777e5233ab373011fd" UNIQUE ("unique_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
