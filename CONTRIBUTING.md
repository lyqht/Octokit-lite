Table of contents

- [Contributing to Octokit-lite](#contributing-to-octokit-lite)
  - [Introduction](#introduction)
  - [Any contributions you make will be under the MIT Software License](#any-contributions-you-make-will-be-under-the-mit-software-license)
  - [Reporting bugs](#reporting-bugs)
  - [Setting up the project for development](#setting-up-the-project-for-development)
    - [Set up Supabase](#set-up-supabase)


# Contributing to Octokit-lite

## Introduction

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features/designs

As a new contributor, please make sure to perform the following tasks.

1. Refer to the CodeSee map to understand the code on a high level overview. 
   
   [![View CodeSee Map](https://codesee-docs.s3.amazonaws.com/badge.svg)](https://app.codesee.io/maps/public/ca272eb0-4d3e-11ed-a645-2b949c63e59c)
2. For development, you can develop the project either locally on your machine or use GitPod. For the full setup instructions, refer to [this section](#setting-up-the-project-for-development).
  
    [![Contribute with GitPod](https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod)](https://gitpod.io/github.com/lyqht/Octokit-lite/)

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. By contributing, you agree that your contributions will be licensed under its MIT License.

## Reporting bugs 

We use GitHub issues to track public bugs. Report a bug by opening a new issue; it's that easy!

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can. [My stackoverflow question](http://stackoverflow.com/q/12488905/180626) includes sample code that _anyone_ with a base R setup can run to reproduce what I was seeing
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Setting up the project for development

### Set up Supabase

Please refer to `.env.template` for the env variables you may need. I am not going to give you the prod Supabase project access, so please create your own Supabase project and populate those values.

For tables, you need to create these table(s).

```
create table "DeletedRecords" (
  id bigint not null primary key,
  created_at timestamp default now(),
  repo text not null,
  "sourceRepo" text,
  "isFork" boolean not null,
  "userId" uuid,
  "repoDetails" json not null
);


create table "UpdatedRecords" (
  id bigint not null primary key,
  created_at timestamp default now(),
  repo text not null,
  "userId" uuid,
  "initialRepoDetails" json not null,
  "updatedFields" json not null
);

```

Then you need to add additional auth URLs to your project, depending on the URL you spin up the app on.

- If you are working **locally**, it should be `http://localhost:3000`
- If you are working on **Gitpod**, it should be `**.gitpod.io`

This is my Supabase project auth URL configuration that allows for connecting to localhost, gitpod and prod. You can follow this.

![](./screenshots/supabase_redirect_urls.png)

To authenticate to Github, please turn on the Github authentication method in Supabase. You would need to fill the GitHub Client ID and Client Key. These values can be retrieved by following these steps:

- Move to Your github profile > Settings
- Look for Developer Settings
- Click on OAuth Apps
- Create a New OAuth App, copy client id and client key(if it is not there then generate a new key) and fill those values on Supabase.

Example

<img width="861" alt="Screenshot 2022-10-05 at 8 06 06 PM" src="https://user-images.githubusercontent.com/35736525/194056646-bbd16502-e1c9-4099-a0f1-123f53e917d8.png">
