using FluentMigrator;
namespace PlaylistManager.Migrations.Scripts;

[Migration(20240429163600)]
public class ExtendedVideoAttributes : Migration
{
    public override void Up()
    {
        Alter.Table("video")
            .AddColumn("artist").AsString().Nullable()
            .AddColumn("duration").AsFloat().Nullable()
            .AddColumn("uploadedAt").AsDateTime().Nullable()
        ;
    }

    public override void Down()
    {
        Delete
            .Column("artist")
            .Column("duration")
            .Column("uploadedAt")
            .FromTable("video");
    }
}
