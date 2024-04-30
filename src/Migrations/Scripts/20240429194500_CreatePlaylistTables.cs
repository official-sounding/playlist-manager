using FluentMigrator;
namespace PlaylistManager.Migrations.Scripts;

[Migration(20240429194500)]
public class CreatePlaylistTable : Migration
{
    public override void Up()
    {
        Create.Table("playlist")
            .WithIdColumn()
            .WithColumn("title").AsString().NotNullable()
            .WithCreatedAt();

        Create.Table("playlist_entry")
            .WithIdColumn()
            .WithColumn("playlistId").AsInt32().NotNullable()
            .WithColumn("videoId").AsInt32().NotNullable()
            .WithColumn("order").AsInt32().NotNullable()
            .WithCreatedAt()
        ;
    }

    public override void Down()
    {
        Delete.Table("playlist_entry");
        Delete.Table("playlist");
    }
}
