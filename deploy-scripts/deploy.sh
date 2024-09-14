#!/bin/sh

rm -r /opt/playlist-manager/frontend/*
rm -r /opt/playlist-manager/app/*


unzip frontend.zip -d /opt/playlist-manager/frontend/
unzip backend.zip -d /opt/playlist-manager/app/

cp /opt/playlist-manager/appsettings.json /opt/playlist-manager/app/

chown :pl-svc /opt/playlist-manager/app/*
chmod 774 /opt/playlist-manager/app/*

service restart playlist-manager