using FluentMigrator;
namespace PlaylistManager.Migrations.Scripts;

[Migration(20240706080000)]
public class AddTagVideoUniqueConstraint : Migration
{
    public override void Up()
    {
        Create.UniqueConstraint("tag_video_uniq")
            .OnTable("tag_video")
            .Columns("videoId","tagId");
    }

    public override void Down()
    {
        Delete.UniqueConstraint("tag_video_uniq");
    }
}
