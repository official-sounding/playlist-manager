echo 'http://dl-cdn.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories
apk update
apk add yt-dlp

echo <<'EOF' >/etc/init.d/playlist-manager
#!/sbin/openrc-run

directory="/opt/playlist-manager"

depend() {
  need net
  use dns logger netmount
}

command="$directory/PlaylistManager.API"
start_stop_daemon_args="--chdir $directory -1 /var/log/playlist-manager/app.log"
command_background=true
command_user="pl-svc:pl-svc"
pidfile="/var/run/${RC_SVCNAME}.pid"
EOF

chmod u+x /etc/init.d/playlist-manager

addgroup -S pl-svc && adduser -S pl-svc -G pl-svc
mkdir /var/log/playlist-manager
chown pl-svc:pl-svc /var/log/playlist-manager

mkdir /opt/playlist-manager

rc-update add playlist-manager
rc-service playlist-manager start