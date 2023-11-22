# Contribution

If you want to contribute code to Karrot, you should first read through these guidelines to get an idea of what it will involve.

We have very limited time to guide inexperienced people through the process of contributing, and prefer to make connections where there is the potential for longer term collaboration, as individuals, or between projects.

It is ideal if you are already a user of Karrot, and if not you have taken the time to become familiar with the platform.

## Contribution checklist

Here is a series of steps how we imagine it can work.

### Assess if you have sufficient support to complete the work

As we have very little time for our work on Karrot, we cannot provide extensive support. It can be very time-consuming to help inexperienced coders, and sadly we cannot provide this.

So you will likely need to either be self-sufficient when it comes to contributing code, or have other support around you to help you with that.

### If you are a student or in academia

We have active connections within academia, and if you a student in a university, undergrad, or postgrad, please make contact with one of our connected academics first.

They will help situated your work within their related fields of interest.

You can find their profiles and contact information by visiting: [Are you a student who wants to contribute in Karrot?](https://community.karrot.world/t/are-you-a-student-who-wants-to-contribute-in-karrot/1449).

### Sign up and join the _Playground_ group

Please visit the [Playground group](https://karrot.world/#/groupPreview/16) on our main instance. From there you can signup for an account and apply to join. You will usually be accepted within a few days.

When in the group you can try out the features and get a sense of how the platform works.

### Selecting a task to work on

Finding a task to work on can be tricky, especially if you are looking for a simple task. We choose what to work on in our weekly meetings, and the GitHub issues might not be representative of what is useful to work on.

Have a look at our [task board](https://community.karrot.world/c/32/l/latest?board=default) and look in the __Ready for development__ column. You can view the same tasks on the [Ready for development category](https://community.karrot.world/c/feedback-ideas/ready-for-development/33). We use our forum for this as it is more accessible for non-coders.

Use this list as an idea for what you can work on, if you are a beginner it might be hard to assess the difficulty of each task.

Another idea is to make use of Karrot in the [Playground group](https://karrot.world/#/groupPreview/16) and see if there are issues you can notice yourself.

Try and be aware if the task will require frontend and/or backend work. It's usually easier to work on tasks that only require one or the other. It might be possible to collaborate if a task requires both.

### Join the _Karrot Team & Feedback_ group

If you are ready to proceed please join the [Karrot Team & Feedback group](https://karrot.world/#/groupPreview/191). This is the group we use to organise our work on Karrot.

Please apply to join this group. When accepted please introduce yourself and share your intentions and ideas.

We are not working fulltime on Karrot, so allow time for a reply, and don't be afraid to send a reminder. We might discuss it in our weekly meeting before replying too, as we work collaboratively.

It is an option to join our weekly call, and can be beneficial, particularly if you are proposing a larger contribution.

### Starting work

If you have selected a task to work on that the team is interested in, you can start work!

It's a good idea to announce that you have started, and create a Pull Request as soon as possible with your in-progress work, where the progress can be kept, and discussions relating to the code can be had.

It's better to ask for input as you work if you are unsure, rather than wait until the end.

### Accepting work

Once you have a Pull Request that you think is ready, ask someone for a review. They may suggest changes are needed.

If it is accepted, then the Pull Request will be merged. This will automatically then get deployed to [dev.karrot.world](https://dev.karrot.world).

## Development workflow

To fix a bug or to add a new feature, the workflow is roughly the following. First, switch to master, get the latest version and update your dependencies:

```sh
git checkout master
git pull
yarn
```

Then you are ready to start working. Turn on the development server and open the URL (usually http://localhost:3000). As soon as you change a file in the repository and save it, it will automatically reload the page.

```sh
yarn dev
```

If you are finished with your work, you should run the tests and check the code style.

```sh
yarn test
yarn lint
```

You can use `yarn test` to disable the restarting the tests after a file changed. Also, if you use an IDE that supports [code style plugins](#code-style), you can usually skip the `lint` step.

```sh
git switch -c fix/newBranchForIssue
git diff
git add .
git commit
git push
```

If you now visit https://github.com/karrot-dev/karrot-frontend, there should be a message that you can open a Pull Request for your recently pushed branch.

### Backend connection

Per default, all requests to `/api` are forwarded to the online backend `dev.karrot.world/api`.
To use a [local backend](https://github.com/karrot-dev/karrot-backend/), create a file `.env` with content like

```
BACKEND=http://localhost:8000
```

## Code style

Be careful to adapt your coding style to the already existing one. That makes it easier for future contributors to understand and get used to the code. Some helps:

* We use [editorconfig](http://editorconfig.org/). Plugins are available for many editors, e.g. for Atom:`editorconfig`)
* check your code style with `yarn lint`, or better: install an `eslint` plugin in your IDE
* use `yarn fix` to automatically fix some kinds of code style errors
* Use ES module features (including async/await)
* Avoid global components, import them where needed

### Translating and updating

Every morning, a cron job runs on CirleCI that updates messages from the `master` branch on transifex (our translation manager service). New translations will open up a Pull Request shortly afterwards.

## Making a new release

Have a look at the file `scripts/prepare-release.js`.

## Used tools and libraries

To make it easier to look for documentation and help on the internet, here's a list of our tools and libraries. It's roughly sorted by importance to developers.

* JS framework: [VueJS](https://vuejs.org/)
* UI framework: [Quasar](http://quasar.dev/)
* Test framework: [Vitest](https://vitest.dev/)
