dotnet publish src/API/PlaylistManager.API.csproj -o publish/backend -c Release -r linux-musl-x64

Compress-Archive -Path publish/backend/* -Force -DestinationPath publish/backend.zip

push-location src/frontend

npm run build

pop-location

Compress-Archive -Path src/frontend/dist/* -Force -DestinationPath publish/frontend.zip