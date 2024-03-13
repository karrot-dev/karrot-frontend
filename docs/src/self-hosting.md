# Guide for self-hosting Karrot

We run a _main_ instance of Karrot at [karrot.world](https://karrot.world) as many groups do not have the technical capacity to run their own instance.

It also has the benefit that groups that use Karrot can see each other on the map, and an account on [karrot.world](https://karrot.world) can be used to join multiple groups in an area that might not be officially connected to each other.

We also like to think there is a sense of belonging and connection to the project by sharing an instance, it's also a kind of resource saving.

There are also many reasons to want to self-host Karrot and it's a scenario we are keen to support. We are hoping one day that the instances will be able to federate with each other and get the best of both worlds.

You might want to self-host if:
- you want to decide where and how the data is managed
- you want your own identity for the site as a whole (e.g. own domain name and logo), not just per-group
- you want to customize aspects of the functionality beyond what is possible with group settings
- you have the technical and financial capacity to do so
- you want to collect a number of groups under a theme that doesn't seem to quite fit with [karrot.world](https://karrot.world)

Karrot can be easily deployed with [co-op cloud](https://coopcloud.tech). This approach aims to minimize the amount of configuration that needs to be done, and allow you to quickly and easily deploy and manage your own Karrot instance. It's a great project with lovely people involved.

_Note: you might find some rough edges at this time, we are very interested to support the smoothing of those!_

## Prerequsites

- [`abra`](https://docs.coopcloud.tech/abra/install/) installed on your local computer
- A domain name
- An internet-reachable machine running linux, [configured for use with abra](https://docs.coopcloud.tech/operators/tutorial/#deploy-your-first-app)
    - that includes a running [traefik instance](https://docs.coopcloud.tech/operators/tutorial/#web-proxy-setup)

## Steps

1. `abra app new karrot`
    - choose your server
    - choose a domain name that karrot will be deployed under: this is what we refer to as `karrot app name`
2. `abra app config <karrot app name>` see [configuration options](#configuration-options) below
3. Set all the secrets, even the ones you don't want to use:
   - `abra app secret list <karrot app name>` for listing all secrets
   - `abra app secret insert <karrot app name> <secret name> <version> "<secret value>"` for inserting a secret
   - `abra app secret generate <karrot app name> <secret name> <version>` for generating a secret
4. `abra app deploy <karrot app name>`
5. Wait for a few minutes while karrot initializes and then you can start creating accounts!

## Other useful commands

### Checking the logs
1. `abra app ls` for finding the right app
2. `abra app logs <karrot app name>` for showing the logs

You can also get the logs for just one service:
1. `abra app ps <karrot app name>` for listing the services
2. `abra app logs <karrot app name> <service>` for showing the logs for that service

## Configuration options

### Basic

- `TYPE`, `SITE_URL`, `LETS_ENCRYPT_ENV` - leave as-is
- `DOMAIN` - this is the domain name which resolves to karrot. Should be set to the same as app name
- `SITE_NAME` - what you want your Karrot instance to be called. This will appear i.e. in registration mails.
- `SITE_LOGO` - set to Karrot project logo by default, point it to a .png image reachable via http(s)

### GeoIP

- `MAXMIND_ACCOUNT_ID` and `MAXMIND_LICENSE_KEY` are API credentials from maxmind.com. You need an account there to get GeoIP data for Karrot. You only need the [free account](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data?lang=en#accessing-geolite2-free-geolocation-data) and then generate the license key.

### Email

Karrot uses both outgoing and incoming email.

- `EMAIL_BACKEND`:
     - if set to `console`, no e-mails will be sent to users, instead they will be logged to `app` service logs and accessible by running `abra app logs <karrot app name> app`. Useful for debugging!
     - if set to `smtp` you have to configure an e-mail server using the `SMTP_*` options
     - if you set to `postal` you will need a [postal](https://github.com/postalserver/postal) instance and then configure the `POSTAL_*` options below
- `EMAIL_FROM` - the sender e-mail address

#### SMTP settings

- `SMTP_USER` - login to the SMTP server. Often the same as `EMAIL_FROM`.
- `SMTP_PASSWORD` - password for the SMTP server
- `SMTP_HOST` - domain (or IP address) of the SMTP server
- `SMTP_USE_SSL` - leave commented. If you want to use SSL instead of TLS set `SMTP_USE_TLS` to `false` and this to `true`
- `SMTP_USE_TLS` - set to true to enable encryption
- `SMTP_PORT` - set to 587 which is default TLS SMTP port.

#### Postal settings

If you're using postal, you'll also need to configure that appropriately, which is out of the scope of this document. You're welcome to contact us about that, we use postal ourselves.

- `POSTAL_API_URL` - a URL to a [postal](https://github.com/postalserver/postal) server
- `POSTAL_API_KEY` - postal API key
- `POSTAL_WEBHOOK_KEY` - postal webhook key (for incoming email)

## Overview of external systems

Here's all the systems that Karrot can interact with.

| What                                            | Required | Description                                                                                                      |
|-------------------------------------------------|----------|------------------------------------------------------------------------------------------------------------------|
| [Sentry](https://sentry.io)                     | no       | reports errors                                                                                                   |
| Outgoing Email                                  | yes | for sending emails to users                                                                                      |
| Incoming Email                                  | maybe | most notification emails can be replied to, and the content will be included in the conversation                 |
| [Postal](https://github.com/postalserver/postal) | no | we use Postal API for our incoming and outgoing email on karrot.world                                            |
| InfluxDB                                        | no | report group-level stats, e.g. powers [grafana.karrot.world](https://grafana.karrot.world) for our main instance |
| Firebase Cloud Messaging (FCM)                  | no | for sending push notifications to browser and mobile devices                                                     |
| Slack / Rocketchat                              | no | can send webhook notifications when a new group is created                                                       |
| Discourse                                       | no | include content from a Discourse forum inside Karrot, e.g. for community updates                                 |
| MaxMind GeoIP data                              | no | used for geolocating IP addresses, need a free account license to fetch updates                                  |
|
| OpenStreetMap                                   | yes | map data for the, well, maps                                                                                     |
|
