#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

#Set the base image to the .NET 6 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /app

ENV DOTNET_USE_POLLING_FILE_WATCHER=1
ENV DOTNET_WATCH_SUPPRESS_LAUNCH_BROWSER=1

RUN apk add yt-dlp ffmpeg

# Copy the project files and restore dependencies
COPY Data/PlaylistManager.Data.csproj Data/
COPY Migrations/PlaylistManager.Migrations.csproj Migrations/
COPY API/PlaylistManager.API.csproj API/
RUN dotnet restore API/PlaylistManager.API.csproj

# Copy the remaining project files
COPY . .

# Start the application in watch mode
CMD ["dotnet", "watch", "run", "--no-restore", "--non-interactive", "--project" , "/app/API/PlaylistManager.API.csproj"]