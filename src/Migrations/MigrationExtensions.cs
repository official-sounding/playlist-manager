#region License
//
// Copyright (c) 2007-2018, Sean Chambers <schambers80@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
#endregion

using FluentMigrator;
using FluentMigrator.Builders.Create.Table;

namespace PlaylistManager.Migrations;

internal static class MigrationExtensions
{
    public static ICreateTableColumnOptionOrWithColumnSyntax WithIdColumn(this ICreateTableWithColumnSyntax tableWithColumnSyntax)
    {
        return tableWithColumnSyntax
            .WithColumn("id")
            .AsInt32()
            .NotNullable()
            .PrimaryKey()
            .Identity();
    }

    public static ICreateTableColumnOptionOrWithColumnSyntax WithCreatedAt(this ICreateTableWithColumnSyntax tableWithColumnSyntax) {
        return tableWithColumnSyntax
            .WithColumn("createdAt").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentDateTime);
    }

    public static ICreateTableColumnOptionOrWithColumnSyntax WithTimeStamps(this ICreateTableWithColumnSyntax tableWithColumnSyntax)
    {
        return tableWithColumnSyntax
            .WithCreatedAt()
            .WithColumn("modifiedAt").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentDateTime)
            .WithColumn("deletedAt").AsDateTime().Nullable();
    }
}
