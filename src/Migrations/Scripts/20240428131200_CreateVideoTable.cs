using FluentMigrator;
namespace PlaylistManager.Migrations.Scripts;

[Migration(20240428131200)]
public class CreateVideoTable : Migration
{
    public override void Up()
    {
        Create.Table("Video")
            .WithIdColumn()
            .WithColumn("videoId").AsString().NotNullable()
            .WithColumn("filename").AsString().NotNullable()
            .WithColumn("title").AsString().NotNullable()
            .WithCreatedAt();
    }

    public override void Down()
    {
        Delete.Table("Video");
    }
}
