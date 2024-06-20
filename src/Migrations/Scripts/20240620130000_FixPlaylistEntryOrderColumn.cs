using FluentMigrator;
namespace PlaylistManager.Migrations.Scripts;

[Migration(20240620130000)]
public class FixPlaylistEntryOrderColumn : Migration
{
    public override void Up()
    {
        Rename.Column("order").OnTable("playlist_entry").To("entryorder");
        ;
    }

    public override void Down()
    {
        Rename.Column("entryorder").OnTable("playlist_entry").To("order");
        ;
    }
}
