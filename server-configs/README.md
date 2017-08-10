# Foodsaving World server configs

This generates the servers configs need. It's a poor mans ansible.

## Generate configs

First install jinja2 cli:

```
pip install jinja2-cli
```

Then generate configs into the `out` directory:

```
./generate.sh
```

## Put them on the server

Up to you to put them on the server.

Put the systemd files in `/etc/systemd/system/`.

And the nginx one in `/etc/nginx/sites-available/`.

## Useful commands on server

Start the service:
```
systemctl start foodsaving-world-channels-daphne.server
```

Start the workers:

```
systemctl start foodsaving-world-channels-worker.target
```

Restart the workers:

```
systemctl restart foodsaving-world-channels-worker.target
```

Watch the daphne logs:

```
journalctl -f -u foodsaving-world-channels-daphne.service
```
