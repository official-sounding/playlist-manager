using FluentMigrator;
namespace PlaylistManager.Migrations.Scripts;

[Migration(20241024210000)]
public class AddServiceTable : Migration
{
    public override void Up()
    {
        Alter.Table("video")
            .AddColumn("service").AsInt32().NotNullable().WithDefaultValue(1);
        ;
    }

    public override void Down()
    {
        Delete
            .Column("serviceId")
            .FromTable("video");
    }
}
