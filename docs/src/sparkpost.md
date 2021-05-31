# Sparkpost

**Document state: provisional, may contain errors or incomplete information. Should be reviewed by Tilmann too.**

We use sparkpost for sending emails and accepting inbound emails.

There are quite a few things to consider and this page hopefully will guide you to understand:

* what to create in the Sparkpost admin interface
* which DNS records you need to set
* which variables need to be configured in the ansible config

## Sparkpost admin interface

Firstly, you need an account. If you don't already have one ask Nick or Tilmann for an invite. If you don't know who those people are then I think setting up Sparkpost is not your first step ;)

Each deployment of Karrot needs to have the following things:
* a subaccount
* an API key for that subaccount (normally created when you create the subaccount)
* an API key for the main account with two permissions enabled:
  * **Inbound Domains: Read/Write**
  * **Relay Webhooks: Read/Write**
* a sending domain

Keep hold of those two API keys as you'll need to store them as ansible secrets.

Later, during the ansible deployment a webhook and a relay setup (inbound email configuration) will be created for you.

## DNS records

When you create a sending domain in Sparkpost, it will tell you which DNS record to add. You want to add the TXT one to verify domain ownership.

I'm not sure if we need to also configure the bounce domain bit.

You also need to setup the inbound email domain for "reply to this email" functionality. By convention we use the main application domain prepended with "replies." e.g. `karrot.world` -> `replies.karrot.world`.

For this domain you need to give it some MX records so they will arrive at Sparkpost. See the [Sparkpost docs](https://www.sparkpost.com/docs/tech-resources/inbound-email-relay-webhook/#add-mx-records) for which records to add.

Note: when we did this using NameCheap it seemed to exclude the subdomain from the wildcard A record we had, requiring a seperate A record for the subdomain, so check your settings!

## Ansible configuration

You need the following variables in your `secrets.vars.yml`:

```
sparkpost_account_key: <main account API key from above>
sparkpost_subaccount_key: <subaccount API key from above>
sparkpost_relay_secret: <generate a 40 char random string>
sparkpost_webhook_secret: <generate a 40 char random string>
```

And the following somewhere in the vars for your `setup.playbook.yml`:

```
sparkpost_relay_domain: replies.your.domain
```

## Troubleshooting / Tips

The ordering can be tricky as you cannot create a webhook if the app is not deployed at a version that has the webhook endpoint available. There may be some manual deployment steps needed if you are in an intermediate state.
