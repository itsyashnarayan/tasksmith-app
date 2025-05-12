import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTaskSchema1747082243343 implements MigrationInterface {
  name = 'FixTaskSchema1747082243343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_task_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_user_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_pkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_pkey" PRIMARY KEY ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP COLUMN "task_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_pkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD "tasksId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "PK_836169568c5c001ee34e7aa78f7" PRIMARY KEY ("tasksId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD "usersId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "PK_836169568c5c001ee34e7aa78f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "PK_71259eff171eb323f416cd3b74d" PRIMARY KEY ("tasksId", "usersId")`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "title" character varying(100)`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "status" character varying(20) NOT NULL DEFAULT 'To Do'`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "priority" character varying(20) NOT NULL DEFAULT 'Medium'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_836169568c5c001ee34e7aa78f" ON "task_assignees" ("tasksId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e54b42e47461564bc4b18b8f93" ON "task_assignees" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "FK_836169568c5c001ee34e7aa78f7" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "FK_e54b42e47461564bc4b18b8f933" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_e54b42e47461564bc4b18b8f933"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_836169568c5c001ee34e7aa78f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e54b42e47461564bc4b18b8f93"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_836169568c5c001ee34e7aa78f"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "priority" character varying NOT NULL DEFAULT 'Medium'`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "status" character varying NOT NULL DEFAULT 'To Do'`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "PK_71259eff171eb323f416cd3b74d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "PK_836169568c5c001ee34e7aa78f7" PRIMARY KEY ("tasksId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP COLUMN "usersId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "PK_836169568c5c001ee34e7aa78f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP COLUMN "tasksId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD "user_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_pkey" PRIMARY KEY ("user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD "task_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_pkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_pkey" PRIMARY KEY ("task_id", "user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
