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

I use `foodsaving-world-dev` here, but for production replace with just `foodsaving-world`.

Start the service:
```
systemctl start foodsaving-world-dev-daphne.service
```

Start the workers:

```
systemctl start foodsaving-world-dev-worker.target
```

Restart the workers:

```
systemctl restart foodsaving-world-dev-worker.target
```

Watch the daphne logs:

```
journalctl -f -u foodsaving-world-dev-daphne.service
```

Watch all related logs:

```
journalctl -f -u 'foodsaving-world-dev-*'
```

## Deployment script

In order to allow a deployment user e.g. `deploy` to restart the workers, you
can configure a sudoers file like this:

```
# /etc/sudoers.d/deploy_foodsaving_world
%deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart foodsaving-world-dev.target
```
