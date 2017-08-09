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

Start 3 workers:
```
```

Watch logs for a service

```
journalctl -f -u foodsaving-world-channels-daphne.service
```