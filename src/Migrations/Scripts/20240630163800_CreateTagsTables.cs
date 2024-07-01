using FluentMigrator;
namespace PlaylistManager.Migrations.Scripts;

[Migration(20240630163800)]
public class CreateTagsTables : Migration
{
    public override void Up()
    {
        Create.Table("tag")
            .WithIdColumn()
            .WithColumn("title").AsString().NotNullable()
            .WithCreatedAt();

        Create.Table("tag_video")
            .WithIdColumn()
            .WithColumn("tagId").AsInt32().NotNullable()
            .WithColumn("videoId").AsInt32().NotNullable()
            .WithCreatedAt()
            ;
    }

    public override void Down()
    {
        Delete.Table("tag_video");
        Delete.Table("tag");
    }
}
