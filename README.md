<h1>Octokit-lite</h1>
<div align='center'>
  <div>
    <img width='160' src='public/logo.png' />
    <p><i>An app to help you perform handy operations for your GitHub repositories (especially during <a href="https://hacktoberfest.com/">Hacktoberfest</a>!)</i></p>
  </div>
  <a href="https://gitpod.io/github.com/lyqht/Octokit-lite/">
    <img
      src="https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod"
      alt="Contribute with Gitpod"
    />
  </a>
</div>

<br />

At the moment, Octokit lite has the following functionalities:
- [Unfork](#unfork) <img width='24' src='public/unfork_logo.png' /> — identify all the forks that you have made over the _months_ or _years_ and **unfork** them all!
- [TopicSpace](#topicspace) <img width='24' src='public/topicspace_logo.svg' /> — a handy tool for project maintainers to add topic(s) to all the repositories that you want!

---

**Table of contents**
- [Unfork](#unfork)
  - [Features](#features)
  - [Demo](#demo)
- [TopicSpace](#topicspace)
  - [Features](#features-1)
  - [Demo](#demo-1)
- [Tech Stack](#tech-stack)
- [License](#license)
- [Contributing](#contributing)
- [Other handy tools](#other-handy-tools)

---


## Unfork

Delete repositories easily with Unfork.

<details><summary>Idea behind Unfork</summary>
GitHub forks tend to be created for the following reasons:
1. Following tutorials 📖
2. Contributing to open source projects (especially during [Hacktoberfest](https://hacktoberfest.com/)!) 💻
3. GitHub automatically forking stuff for you when you just wanted to view the source code for a particular file of a project 😆

After months and years, usually these forks still stay in your repository — and that's because of how _inconvenient_ it is to identify and delete the many forks that you have made.

Unfork helps you to solve that problem **easily** ✨
</details>

<img src='screenshots/unfork_preview.png' width='400' />

### Features

- [x] View your repository count.
- [x] You can choose what repos to delete before actually deleting them.
- [x] View what the forks that you have deleted.
- [ ] Allow users to filter repos by inactivity level (e.g. last repo commit date/their last personal commit date to the repo)
- [ ] Generates an optional shell command for you to run to backup all the forks that you are going to delete before deleting them.

### Demo

![](screenshots/Octokitlite-Unfork-Demo.gif)

## TopicSpace

Apply any topic you like e.g. `Hacktoberfest` to the repositories that you own.

<img src='screenshots/topicspace_preview.png' />

### Features
 
- [x] You can choose multiple topics and apply it to all of the repos you have selected
- [ ] Show list of autocompleted topics that user can select after user types in some input (just like in GitHub)
- [ ] In the repository picker
  - [ ] Show list of existing topics that they have
- [ ] Allow users to filters repos by issue count and by inactivity level
- [ ] Preview of repo upon hover on repo item: show repo name, description, stars etc like a GitHub repo card

### Demo

![](screenshots/Octokitlite-TopicSpace-Demo.gif)

## Tech Stack

This project is bootstrapped by:
- [Typescript Next.js starter by @jpedroschmitz](https://github.com/jpedroschmitz/typescript-nextjs-starter)
- [Supabase](https://github.com/supabase/supabase/)
- [React Select](https://react-select.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://github.com/saadeghi/daisyui)
- [Octokit.js](https://github.com/octokit/octokit.js/)

For lessons learnt, you can refer to [notes.md](notes.md).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.

## Contributing

Refer to [CONTRIBUTING.md](CONTRIBUTING.md).

## Other handy tools

- If you prefer a CLI version of Unfork, there's [delete-github-forks](https://github.com/yangshun/delete-github-forks) by yangshun.
- If you prefer a CLI version of TopicSpace, there's [hacktoberfest-repo-topic-apply](https://github.com/Hacktoberfest/hacktoberfest-repo-topic-apply) by the official Hacktoberfest team.
