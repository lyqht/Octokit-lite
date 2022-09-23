<h1>Octokit-lite</h1>
<div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px; padding: 16px;">
  <img width='160' src='public/logo.png' />
  <p><i>An app to help you perform handy operations for your GitHub repositories</i></p>
</div>

At the moment, Octokit lite has the following functionalities:
- [Unfork](#unfork)  <img width='24' src='public/unfork_logo.png' /> — identify all the forks that you have made over the _months_ or _years_ and **unfork** them all!
- (coming soon!) HacktoberfestLah — a handy tool for project maintainers to apply the `Hacktoberfest` topic to all the repositories that you want!

---

**Table of contents**
- [Unfork](#unfork)
  - [Problem](#problem)
  - [Features](#features)
- [Tech Stack](#tech-stack)
- [HacktoberfestLah](#hacktoberfestlah)
- [License](#license)
## Unfork

GitHub forks tend to be created for the following reasons:
1. Following tutorials 📖
1. Contributing to open source projects 💻
1. GitHub automatically forking stuff for you when you just wanted to view the source code for a particular file of a project 😆

After months and years, usually these forks still stay in your repository — and that's because of how _inconvenient_ it is to identify and delete the many forks that you have made.

Unfork helps you to solve that problem **easily** ✨

### Features

- [x] View your repository count.
- [x] You can choose what repos to delete before actually deleting them.
- [x] View what the forks that you have deleted.
- [ ] Allow users to filter forks by inactivity level (e.g. last repo commit date/their last personal commit date to the repo)
- [ ] Generates an optional shell command for you to run to backup all the forks that you are going to delete before deleting them.

### Demo

![](demo.gif)

## HacktoberfestLah



## Tech Stack

This project is bootstrapped by:
- [Typescript Next.js starter by @jpedroschmitz](https://github.com/jpedroschmitz/typescript-nextjs-starter)
- [Supabase](https://github.com/supabase/supabase/)
- [React Select](https://react-select.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Octokit.js](https://github.com/octokit/octokit.js/)

For lessons learnt, you can refer to [notes.md](notes.md).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.

## Other handy tools

- If you prefer a CLI version of Unfork, there's [delete-github-forks](https://github.com/yangshun/delete-github-forks) by yangshun.
- If you prefer a CLI version of HacktoberfestLah, there's [hacktoberfest-repo-topic-apply](https://github.com/Hacktoberfest/hacktoberfest-repo-topic-apply) by the official Hacktoberfest team.
