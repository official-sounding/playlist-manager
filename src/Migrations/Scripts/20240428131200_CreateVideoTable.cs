using FluentMigrator;
namespace PlaylistManager.Migrations.Scripts;

    [Migration(20240428131200)]
    public class CreateVideoTable : Migration
    {
        /*    id int primary key,
    videoUrl text not null,
    filename text not null,
    title text not null,
    added_at datetime default CURRENT_TIMESTAMP,*/
        public override void Up()
        {
            Create.Table("Video")
                .WithIdColumn()
                .WithColumn("videoUrl").AsString().NotNullable()
                .WithColumn("filename").AsString().NotNullable()
                .WithColumn("title").AsString().NotNullable()
                .WithCreatedAt();
        }

        public override void Down()
        {
            Delete.Table("Video");
        }
    }
